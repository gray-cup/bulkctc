# Bulk Green Coffee — Checkout, Payment & Database Documentation

> Last updated: May 2026  
> Stack: Next.js 15 (App Router) · TypeScript · Drizzle ORM · PostgreSQL · Cashfree Payments

---

## Table of Contents

1. [Sample Buying Flow — Overview](#1-sample-buying-flow--overview)
2. [Product Catalogue & Pricing](#2-product-catalogue--pricing)
3. [Quantity Tiers & Price Calculation](#3-quantity-tiers--price-calculation)
4. [State Management & LocalStorage](#4-state-management--localstorage)
5. [Step 1 — Product Selection UI](#5-step-1--product-selection-ui)
6. [Step 2 — Checkout UI](#6-step-2--checkout-ui)
7. [Form Validation Rules](#7-form-validation-rules)
8. [API Route — POST /api/create-payment](#8-api-route--post-apicreate-payment)
9. [Cashfree Payment Link Integration](#9-cashfree-payment-link-integration)
10. [Success Page](#10-success-page)
11. [Currency Conversion](#11-currency-conversion)
12. [Database Table — bulkgreencoffee_site](#12-database-table--bulkgreencoffee_site)
13. [Environment Variables](#13-environment-variables)
14. [Error Handling Summary](#14-error-handling-summary)

---

## 1. Sample Buying Flow — Overview

The sample buying flow is a two-step single-page experience at `/buy-samples`.

```
User visits /buy-samples
        │
        ▼
┌─────────────────────────┐
│  Step 1: Select Products │  ← choose products + per-product weight tier
│  (sticky bottom bar      │
│   shows running total)   │
└────────────┬────────────┘
             │  "Proceed to Checkout"
             ▼
┌─────────────────────────────────────────────────────┐
│  Step 2: Checkout                                    │
│  ┌──────────────────┐  ┌────────────────────────┐   │
│  │  Form (left)     │  │  Order Summary (right) │   │
│  │  · Customer type │  │  · Per-product tier    │   │
│  │  · Name          │  │    selector            │   │
│  │  · Phone         │  │  · Per-item price      │   │
│  │  · Country       │  │  · Total               │   │
│  │  · Email         │  └────────────────────────┘   │
│  │  · Address       │                                │
│  │  · State         │  ┌────────────────────────┐   │
│  │  · Pincode       │  │  Add More Products     │   │
│  │  · GST (biz)     │  │  (card grid below)     │   │
│  │  · Biz type      │  └────────────────────────┘   │
│  └──────────────────┘                                │
└────────────────────────────┬────────────────────────┘
                             │  POST /api/create-payment
                             ▼
                   Cashfree Payment Link
                             │
                             ▼
               /buy-samples/success?link_id=…
```

---

## 2. Product Catalogue & Pricing

All prices are in **Indian Rupees (INR) per kilogram** and represent the **minimum** `priceRange.min` from the product data. Final pricing on bulk orders depends on grade and lot size.

| Product | Region | Min Price (INR/kg) | Max Price (INR/kg) |
|---|---|---|---|
| Koraput Arabica Naturals | East India (Odisha) | ₹1,100 | ₹1,900 |
| Koraput Arabica Honey Sun-Dried | East India (Odisha) | ₹1,200 | ₹2,100 |
| Koraput Arabica Washed | East India (Odisha) | ₹1,100 | ₹1,900 |
| Halflong Arabica Naturals | North East India (Assam) | ₹1,750 | ₹1,750 |
| Chirang Robusta Naturals | North East India (Assam) | ₹750 | ₹1,100 |
| Tirap Robusta Naturals | North East India (Arunachal Pradesh) | ₹800 | ₹1,200 |
| Chikmagalur Arabica | South India (Karnataka) | ₹950 | ₹1,700 |
| Coorg Arabica | South India (Karnataka) | ₹900 | ₹1,600 |
| Wayanad Arabica | South India (Kerala) | ₹900 | ₹1,650 |
| Bababudangiri Arabica | South India (Karnataka) | ₹1,200 | ₹2,200 |

Product data lives in `src/data/products/specialty-coffee.ts` and is re-exported from `src/data/products/index.ts`.

---

## 3. Quantity Tiers & Price Calculation

Four weight tiers are available. Each product's sample price is calculated on the **client** before the order is submitted.

```ts
const TIERS = [
  { label: "100g", grams: 100,  packaging: 30 },  // ₹30 packaging fee for smallest size
  { label: "1kg",  grams: 1000, packaging: 0  },
  { label: "3kg",  grams: 3000, packaging: 0  },
  { label: "5kg",  grams: 5000, packaging: 0  },
]
```

### Price Formula

```ts
function calcPrice(pricePerKg: number, grams: number, packaging: number): number {
  return Math.round((pricePerKg * grams) / 1000) + packaging;
}
```

**Example — Koraput Arabica Naturals @ 100g:**
```
calcPrice(1100, 100, 30) = round(1100 × 100 / 1000) + 30 = 110 + 30 = ₹140
```

**Example — Halflong Arabica Naturals @ 1kg:**
```
calcPrice(1750, 1000, 0) = round(1750 × 1000 / 1000) + 0 = ₹1,750
```

### Order Total

```ts
const orderTotal = selectedProducts.reduce(
  (sum, { product, tierData }) =>
    sum + calcPrice(product.priceRange.min, tierData.grams, tierData.packaging),
  0
);
```

The `orderTotal` is **always in INR**. This is the value sent to Cashfree as `link_amount` and stored in the database as `total_amount`.

---

## 4. State Management & LocalStorage

The selection state is persisted to `localStorage` so the cart survives page refreshes.

### State Shape

```ts
type TierLabel = "100g" | "1kg" | "3kg" | "5kg";
type SelectedItem = { slug: string; tier: TierLabel };

// State:
selected:   SelectedItem[]   // one entry per selected product with its own tier
activeTier: TierLabel        // default tier applied when adding from the product grid
```

### LocalStorage Keys

| Key | Value | Purpose |
|---|---|---|
| `bgc_selected` | JSON `SelectedItem[]` | Persists the cart across page loads |
| `bgc_tier` | `TierLabel` string | Persists the active tier tab selection |

### Migration from old format

Early versions stored `selected` as a plain `string[]` (slugs only). On load, the initializer migrates this automatically:

```ts
const normalized: SelectedItem[] = parsed.map((s: string | SelectedItem) =>
  typeof s === "string" ? { slug: s, tier: "100g" } : s
);
```

### Pre-selection via URL

A product can be pre-selected by navigating to `/buy-samples?product=<slug>`. The slug is merged into the loaded cart on mount.

---

## 5. Step 1 — Product Selection UI

**Route:** `src/app/(marketing)/buy-samples/page.tsx` → `BuySamplesInner` (rendered inside `<Suspense>`)

### Layout

- **Header** — title + subtitle
- **Quantity tab bar** — switches `activeTier` (applies to newly added products)
- **Product grid** — 4-column responsive grid; selected cards get a teal border + "Selected" badge
- **Sticky bottom bar** — slides up from the bottom when ≥1 product is selected; shows count + `fmt(orderTotal)` + "Proceed to Checkout" button

### Per-card actions

| Button | Behaviour |
|---|---|
| Select Sample | Adds product to cart with `activeTier` as its tier |
| Remove | Removes product from cart |
| Buy now → | Navigates to `/buy-samples/[slug]` (individual product purchase page) |

---

## 6. Step 2 — Checkout UI

Triggered by clicking "Proceed to Checkout". `window.scrollTo({ top: 0, behavior: "instant" })` fires on every step change.

### Layout

```
┌──────────────────────────────────────┐
│  Left column (CheckoutForm)          │
│  src/components/buy-samples/         │
│  CheckoutForm.tsx                    │
└──────────────────────────────────────┘
┌──────────────────────────────────────┐
│  Right column — Order Summary        │
│  sticky top-8, max-h-[80vh],         │
│  overflow-y-auto                     │
│                                      │
│  · Each selected product             │
│    · Name                            │
│    · Per-product tier buttons        │
│      (100g / 1kg / 3kg / 5kg)        │
│    · Price (in selected currency)    │
│    · ✕ Remove                        │
│  · Total row (bg-gray-50)            │
└──────────────────────────────────────┘
┌──────────────────────────────────────┐
│  "Add more samples" card grid        │
│  (full width below the 2-col grid)   │
│  · Each card has its own local tier  │
│    selector and "+ Add" button       │
└──────────────────────────────────────┘
```

### CheckoutForm fields

| Field | Required | Notes |
|---|---|---|
| Customer Type | — | Toggle: Individual / Business (controls visible fields) |
| Name | Yes | Auto title-cased on blur (`"john doe"` → `"John Doe"`) |
| Phone Number | Yes | `type="tel"` |
| Country | No | Auto-filled by `/api/geo` on mount (full name via `Intl.DisplayNames`) |
| Email Address | Yes | Format validated with regex |
| Full Delivery Address | Yes | Minimum 7 characters |
| State | No | Free text |
| Pincode / ZIP | Yes | |
| GST Number / Tax ID | No | Business only; label switches India ↔ international |
| Business Type | No | Business only; pill buttons: Roastery, Cafe, Hotel, Restaurant, Importer, Other |
| Turnstile CAPTCHA | — | Must pass before submit is enabled |

---

## 7. Form Validation Rules

Validation runs on every render against current field values. Errors are shown **per field** after the field is blurred (`onBlur`) or after the first submit attempt (`triedSubmit = true`).

```ts
type FieldErrors = Partial<Record<"name"|"phone"|"email"|"address"|"pincode", string>>;

function validate(fields): FieldErrors {
  const e: FieldErrors = {};

  if (!fields.name.trim())
    e.name = "Name is required.";

  if (!fields.phone.trim())
    e.phone = "Phone number is required.";

  if (!fields.email.trim())
    e.email = "Email address is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
    e.email = "Enter a valid email address.";

  if (!fields.address.trim())
    e.address = "Delivery address is required.";
  else if (fields.address.trim().length < 7)
    e.address = "Address must be at least 7 characters.";

  if (!fields.pincode.trim())
    e.pincode = "Pincode / ZIP is required.";

  return e;
}
```

If `hasErrors` is true on submit, the request is **not sent** and a banner "Please fix the errors above before continuing." is shown.

### Name auto-casing

```ts
onBlur={() => {
  touch("name");
  if (name.trim()) setName(titleCase(name.trim()));
}}

function titleCase(str: string) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}
```

### Active state on buttons

All interactive buttons have `active:scale-95` applied so users get visual click feedback.

---

## 8. API Route — POST /api/create-payment

**File:** `src/app/api/create-payment/route.ts`

### Request body — `SampleOrderRequest`

```ts
interface SampleOrderRequest {
  name:          string;       // required
  phone:         string;       // required; stripped to digits, last 12 kept
  email:         string;       // required
  country:       string;       // full name e.g. "India"
  pincode:       string;       // required
  address:       string;       // required
  state?:        string;
  gstOrTaxId?:   string;
  businessType?: string;
  products:      string[];     // array of product slugs
  quantityTier:  string;       // dominant tier e.g. "100g"
  totalAmount:   number;       // INR integer, pre-calculated on client
}
```

### Server-side validation

```ts
if (!name || !phone || !address || !pincode || products.length === 0) {
  return 400 { error: "Name, phone, address, pincode and at least one product are required" }
}
```

### Processing steps

1. **Validate** env vars (`CASHFREE_CLIENT_ID`, `CASHFREE_CLIENT_SECRET`)
2. **Validate** required fields
3. **Generate** unique `link_id`:
   ```ts
   const linkId = `bgc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
   // e.g. "bgc_1716000000000_a3f7k2"
   ```
4. **Set expiry** — 30 minutes from now
5. **Insert** order row into DB with `payment_status = "pending"`
6. **Call** Cashfree API to create payment link
7. **Return** `{ success: true, paymentLink: data.link_url, linkId }`

### Cashfree API call

```
POST https://api.cashfree.com/pg/links
Headers:
  x-client-id:     CASHFREE_CLIENT_ID
  x-client-secret: CASHFREE_CLIENT_SECRET
  x-api-version:   2023-08-01
```

```json
{
  "link_id": "bgc_1716000000000_a3f7k2",
  "link_amount": 420,
  "link_currency": "INR",
  "link_purpose": "Bulk Green Coffee — 100g samples (koraput-naturals, halflong-arabica-naturals)",
  "customer_details": {
    "customer_name": "John Doe",
    "customer_phone": "9876543210",
    "customer_email": "john@example.com"
  },
  "link_meta": {
    "return_url": "https://bulkgreencoffee.com/buy-samples/success?link_id=bgc_…"
  },
  "link_notify": {
    "send_sms": true,
    "send_email": true
  },
  "link_expiry_time": "2026-05-18T12:30:00.000Z"
}
```

### Response

```json
{
  "success": true,
  "paymentLink": "https://payments.cashfree.com/links/bgc_…",
  "linkId": "bgc_1716000000000_a3f7k2"
}
```

The client immediately redirects: `window.location.href = data.paymentLink`

---

## 9. Cashfree Payment Link Integration

### How it works

Cashfree Payment Links are **hosted payment pages** managed by Cashfree. We do not handle card details, UPI, or any payment method directly.

```
Our server creates a link  →  user is redirected to Cashfree's hosted page
Cashfree collects payment  →  redirects user back to our return_url
                           →  also sends webhook (SMS + email to customer)
```

### Return URL

After payment (success or failure), Cashfree redirects to:
```
/buy-samples/success?link_id=bgc_…
```

The success page is static — it shows a confirmation message regardless of payment status. For production, the `link_id` can be used to query Cashfree's API and verify actual payment status.

### Link expiry

Payment links expire **30 minutes** after creation. If the user does not pay within this window, they need to place the order again.

### Notifications

| Channel | When sent |
|---|---|
| SMS to customer | Always (Cashfree sends automatically) |
| Email to customer | Only if `email` was provided |

### Phone number handling

The phone number is normalised before sending to Cashfree:

```ts
// For DB (stores up to 12 digits — includes country code):
phone.replace(/\D/g, "").slice(-12)

// For Cashfree customer_details (10 digits — India mobile):
phone.replace(/\D/g, "").slice(-10)
```

---

## 10. Success Page

**Route:** `/buy-samples/success`  
**File:** `src/app/(marketing)/buy-samples/success/page.tsx`

Static confirmation page. Shown after Cashfree redirects back via `return_url`. Displays:

- ✓ icon
- "Order placed!" heading
- Dispatch timeline (2–3 business days)
- Delivery timeline (3–5 days after dispatch)
- SMS confirmation note
- Link to contact page
- Link back to `/products`

> **Note:** Payment verification against Cashfree is not yet implemented on the success page. The `link_id` query param is available for future use to call Cashfree's `GET /pg/links/{link_id}` endpoint and confirm `link_status`.

---

## 11. Currency Conversion

Prices are **displayed** in the user's selected currency but **all payments are processed in INR**.

### How display currency is resolved

1. On load, `CurrencyProvider` checks `localStorage` for a previously chosen currency (`graycup_currency`, `graycup_currency_manual`)
2. If no manual choice, calls `/api/geo` → maps country code → currency via `COUNTRY_CURRENCY_MAP`
3. Fetches live rates from `/api/exchange-rates` (24-hour cached, falls back to hardcoded rates)

### Supported display currencies

| Code | Symbol | Locale |
|---|---|---|
| INR | ₹ | en-IN |
| USD | $ | en-US |
| EUR | € | de-DE |
| GBP | £ | en-GB |
| AED | د.إ | ar-AE |
| KRW | ₩ | ko-KR |

### Price display formula

```ts
// In buy-samples/page.tsx:
const { currency, rates } = useCurrency();
const fmt = (inr: number) => formatPrice(convertPrice(inr, currency, rates), currency);

// convertPrice:
function convertPrice(priceInINR, toCurrency, rates) {
  const rate = rates?.[toCurrency] ?? CURRENCIES[toCurrency].rate;
  return Math.round(priceInINR * rate * 100) / 100;
}
```

The `totalAmount` passed to `CheckoutForm` and subsequently to the API is **always the raw INR integer** — never converted.

---

## 12. Database Table — bulkgreencoffee_site

**ORM:** Drizzle ORM  
**Database:** PostgreSQL  
**File:** `src/db/schema.ts`

### Table: `bulkgreencoffee_site`

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `serial` (integer) | NOT NULL | auto-increment | Primary key |
| `created_at` | `timestamp` | NOT NULL | `now()` | Row creation time (UTC) |
| `name` | `text` | NOT NULL | — | Customer full name (title-cased) |
| `phone` | `text` | NOT NULL | — | Digits only, up to 12 chars (includes country code) |
| `email` | `text` | NULL | — | Customer email |
| `country` | `text` | NOT NULL | `"IN"` | Full country name e.g. `"India"` |
| `pincode` | `text` | NOT NULL | — | Postal / ZIP code |
| `address` | `text` | NOT NULL | — | Full delivery address |
| `state` | `text` | NULL | — | State or province |
| `gst_or_tax_id` | `text` | NULL | — | GST number (India) or VAT/Tax ID (international) |
| `business_type` | `text` | NULL | — | One of: `roastery`, `cafe`, `hotel`, `restaurant`, `importer`, `other` |
| `products` | `text` | NOT NULL | — | JSON-encoded array of product slugs e.g. `'["koraput-naturals","coorg-arabica"]'` |
| `quantity_tier` | `text` | NOT NULL | — | Dominant tier: `"100g"`, `"1kg"`, `"3kg"`, or `"5kg"` |
| `total_amount` | `integer` | NOT NULL | — | Order total in **INR paise** — actually stored as whole rupees (integer) |
| `link_id` | `text` | NOT NULL | — | Cashfree payment link ID e.g. `"bgc_1716000000000_a3f7k2"` — unique per order |
| `payment_status` | `text` | NOT NULL | `"pending"` | Payment status: `"pending"` at creation, can be updated to `"paid"` / `"failed"` via webhook |

### Drizzle schema definition

```ts
import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const bulkgreencoffee_site = pgTable("bulkgreencoffee_site", {
  id:             serial("id").primaryKey(),
  created_at:     timestamp("created_at").defaultNow().notNull(),

  // customer
  name:           text("name").notNull(),
  phone:          text("phone").notNull(),
  email:          text("email"),
  country:        text("country").notNull().default("IN"),
  pincode:        text("pincode").notNull(),
  address:        text("address").notNull(),
  state:          text("state"),
  gst_or_tax_id:  text("gst_or_tax_id"),
  business_type:  text("business_type"),

  // order
  products:       text("products").notNull(),   // JSON array of slugs
  quantity_tier:  text("quantity_tier").notNull(),
  total_amount:   integer("total_amount").notNull(),

  // cashfree
  link_id:        text("link_id").notNull(),
  payment_status: text("payment_status").notNull().default("pending"),
});
```

### Example row

```json
{
  "id": 42,
  "created_at": "2026-05-18T09:14:22.000Z",
  "name": "Priya Sharma",
  "phone": "919876543210",
  "email": "priya@blueroasters.com",
  "country": "India",
  "pincode": "400001",
  "address": "12B, Marine Lines, Mumbai",
  "state": "Maharashtra",
  "gst_or_tax_id": "27AABCU9603R1ZX",
  "business_type": "roastery",
  "products": "[\"koraput-naturals\",\"halflong-arabica-naturals\",\"coorg-arabica\"]",
  "quantity_tier": "100g",
  "total_amount": 420,
  "link_id": "bgc_1716026062000_k3m9p1",
  "payment_status": "pending"
}
```

### Querying orders

```ts
// All orders, newest first:
await db.select().from(bulkgreencoffee_site).orderBy(desc(bulkgreencoffee_site.created_at));

// Paid orders only:
await db.select().from(bulkgreencoffee_site)
  .where(eq(bulkgreencoffee_site.payment_status, "paid"));

// Orders for a specific product:
await db.select().from(bulkgreencoffee_site)
  .where(like(bulkgreencoffee_site.products, "%koraput-naturals%"));
```

---

## 13. Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `CASHFREE_CLIENT_ID` | Yes | Cashfree API client ID |
| `CASHFREE_CLIENT_SECRET` | Yes | Cashfree API client secret |

Loaded from `.env` (root of project). Drizzle config reads `DATABASE_URL` directly — no `.env.local` fallback unless you rename or symlink.

---

## 14. Error Handling Summary

### Client-side (CheckoutForm)

| Scenario | Behaviour |
|---|---|
| Required field empty on blur | Red inline error message below field |
| Invalid email format | Red inline error below email field |
| Address < 7 chars | Red inline error below address field |
| Submit with any field error | No request sent; banner shown |
| Turnstile not verified | Submit button disabled |
| No products selected | Submit button disabled |
| API returns non-2xx | Error shown in red box; loading state cleared |

### Server-side (/api/create-payment)

| Scenario | HTTP Status | Response |
|---|---|---|
| Missing env vars | 500 | `{ error: "Payment gateway not configured" }` |
| Missing required fields | 400 | `{ error: "Name, phone, address, pincode and at least one product are required" }` |
| Cashfree API error | Cashfree's status | `{ error: data.message }` |
| Unhandled exception | 500 | `{ error: "Internal server error" }` |

### Payment link edge cases

| Scenario | Behaviour |
|---|---|
| Link expires (30 min) | Cashfree shows expired page; user must re-order |
| User closes Cashfree page | Order row stays `payment_status = "pending"` |
| Payment fails | Cashfree shows failure; order stays `pending` |
| Payment succeeds | Cashfree redirects to `/buy-samples/success?link_id=…` |

> **TODO:** Implement a Cashfree webhook at `/api/webhooks/cashfree` to update `payment_status` to `"paid"` or `"failed"` automatically on payment completion.
