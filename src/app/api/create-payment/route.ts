import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { bulkctc_orders } from "@/db/schema";
import { chaiProducts } from "@/data/chai-products";
import { computeOrderTotal, unitPriceForSlug, type CartLine } from "@/lib/pricing";

const CASHFREE_API_URL     = "https://api.cashfree.com/pg/links";
const CASHFREE_CLIENT_ID     = process.env.CASHFREE_CLIENT_ID;
const CASHFREE_CLIENT_SECRET = process.env.CASHFREE_CLIENT_SECRET;

export interface ChaiOrderRequest {
  name:          string;
  phone:         string;
  email:         string;
  pincode:       string;
  address:       string;
  state?:        string;
  gstNumber?:    string;
  businessType?: string;
  items:         CartLine[]; // { slug, kg, quantity }[] - price is always recomputed server-side from this
}

export async function POST(request: NextRequest) {
  try {
    if (!CASHFREE_CLIENT_ID || !CASHFREE_CLIENT_SECRET) {
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 });
    }

    const body: ChaiOrderRequest = await request.json();
    const { name, phone, email, pincode, address, state, gstNumber, businessType, items } = body;

    if (!name || !phone || !address || !pincode || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Name, phone, address, pincode and at least one product are required" },
        { status: 400 },
      );
    }

    // The order total is ALWAYS computed here from our own product/weight
    // catalogue - the client cannot influence the charged amount by editing
    // the request body. computeOrderTotal throws if any slug/kg is invalid.
    let totalAmount: number;
    try {
      totalAmount = computeOrderTotal(items);
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Invalid order items" },
        { status: 400 },
      );
    }

    const linkId = `ctc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 30);

    const origin = request.headers.get("origin") || "https://bulkctc.com";

    const productSlugs = items.map((i) => i.slug);
    const quantityTier = items.map((i) => `${i.quantity}×${i.kg}kg`).join(", ");

    // Per-item breakdown (name/image/price/weight/quantity) for the
    // orders-graycup admin dashboard - the order row only stores the
    // aggregate total, so this is the only place the "how much per item"
    // detail is ever persisted.
    const itemsDetail = items.map(({ slug, kg, quantity }) => {
      const product = chaiProducts.find((p) => p.slug === slug);
      const unitPrice = unitPriceForSlug(slug, kg);
      return {
        slug,
        name: product?.name ?? slug,
        image: `${origin}/4-3-chai.webp`,
        tier: `${kg}kg`,
        grams: kg * 1000,
        price: unitPrice * quantity,
        quantity,
      };
    });

    await db.insert(bulkctc_orders).values({
      name,
      phone:         phone.replace(/\D/g, "").slice(-12),
      email:         email         || null,
      pincode,
      address,
      state:         state         || null,
      gst_number:    gstNumber     || null,
      business_type: businessType  || null,
      products:      JSON.stringify(productSlugs),
      quantity_tier: quantityTier,
      items_detail:  JSON.stringify(itemsDetail),
      total_amount:  totalAmount,
      link_id:       linkId,
      payment_status: "pending",
    });

    const paymentLinkPayload = {
      link_id:       linkId,
      link_amount:   totalAmount,
      link_currency: "INR",
      link_purpose:  `BulkCTC — ${quantityTier} (${productSlugs.join(", ")})`,

      customer_details: {
        customer_name:  name,
        customer_phone: phone.replace(/\D/g, "").slice(-10),
        ...(email && { customer_email: email }),
      },

      link_meta: {
        return_url: `${origin}/buy-samples/success?link_id=${linkId}`,
      },

      link_notify: {
        send_sms:   true,
        send_email: !!email,
      },

      link_expiry_time: expiryTime.toISOString(),
    };

    const cfRes = await fetch(CASHFREE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type":    "application/json",
        "x-client-id":     CASHFREE_CLIENT_ID,
        "x-client-secret": CASHFREE_CLIENT_SECRET,
        "x-api-version":   "2023-08-01",
      },
      body: JSON.stringify(paymentLinkPayload),
    });

    const data = await cfRes.json();

    if (!cfRes.ok) {
      return NextResponse.json({ error: data.message || "Payment gateway error" }, { status: cfRes.status });
    }

    if (data.cf_link_id) {
      await db.update(bulkctc_orders)
        .set({ cf_link_id: String(data.cf_link_id) })
        .where(eq(bulkctc_orders.link_id, linkId));
    }

    return NextResponse.json({ success: true, paymentLink: data.link_url, linkId });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("create-payment error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
