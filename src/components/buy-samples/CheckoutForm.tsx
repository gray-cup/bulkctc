"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Turnstile, useTurnstile } from "@/components/ui/turnstile";
import type { ChaiOrderRequest } from "@/app/api/create-payment/route";

const businessCategories = [
  { id: "hotel",     label: "Hotel" },
  { id: "canteen",   label: "Canteen / Pantry" },
  { id: "tea-stall", label: "Tea Stall" },
  { id: "restaurant",label: "Restaurant" },
  { id: "office",    label: "Office / Corporate" },
  { id: "catering",  label: "Catering" },
  { id: "other",     label: "Other" },
];

type FieldErrors = Partial<Record<"name" | "phone" | "email" | "address" | "pincode", string>>;

function titleCase(str: string) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

function validate(fields: {
  name: string; phone: string; email: string; address: string; pincode: string;
}): FieldErrors {
  const e: FieldErrors = {};
  if (!fields.name.trim())                                       e.name    = "Name is required.";
  if (!fields.phone.trim())                                      e.phone   = "Phone number is required.";
  if (!fields.email.trim())                                      e.email   = "Email address is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))    e.email   = "Enter a valid email address.";
  if (!fields.address.trim())                                    e.address = "Delivery address is required.";
  else if (fields.address.trim().length < 7)                     e.address = "Address must be at least 7 characters.";
  if (!fields.pincode.trim())                                    e.pincode = "Pincode is required.";
  return e;
}

type Props = {
  products: string[];
  quantityTier: string;
  totalAmount: number;
  onBack?: () => void;
};

export function CheckoutForm({ products, quantityTier, totalAmount, onBack }: Props) {
  const turnstile = useTurnstile();

  const [customerType, setCustomerType] = useState<"individual" | "business">("individual");
  const [name,         setName]         = useState("");
  const [phone,        setPhone]        = useState("");
  const [email,        setEmail]        = useState("");
  const [pincode,      setPincode]      = useState("");
  const [address,      setAddress]      = useState("");
  const [state,        setState]        = useState("");
  const [gstNumber,    setGstNumber]    = useState("");
  const [businessType, setBusinessType] = useState("");
  const [isLoading,    setIsLoading]    = useState(false);
  const [submitError,  setSubmitError]  = useState("");

  const [touched,      setTouched]      = useState<Set<string>>(new Set());
  const [triedSubmit,  setTriedSubmit]  = useState(false);

  const touch   = (field: string) => setTouched((prev) => new Set([...prev, field]));
  const showErr = (field: string) => touched.has(field) || triedSubmit;

  const errors   = validate({ name, phone, email, address, pincode });
  const hasErrors = Object.keys(errors).length > 0;

  const isBusiness = customerType === "business";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTriedSubmit(true);
    if (hasErrors) return;

    setSubmitError("");
    setIsLoading(true);

    const payload: ChaiOrderRequest = {
      name,
      phone,
      email,
      pincode,
      address,
      state:        state        || undefined,
      gstNumber:    gstNumber    || undefined,
      businessType: businessType || undefined,
      products,
      quantityTier,
      totalAmount,
    };

    try {
      const res  = await fetch("/api/create-payment", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create payment");
      window.location.href = data.paymentLink;
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const fieldClass = (field: keyof FieldErrors) =>
    errors[field] && showErr(field) ? "border-red-400 focus-visible:ring-red-300" : "";

  return (
    <div>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-neutral-500 hover:text-neutral-900 mb-8 flex items-center gap-1 transition-colors active:opacity-60 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg> Back to products
        </button>
      )}

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>

        {/* Individual / Business tab */}
        <div className="inline-flex gap-1 bg-gray-100 p-1">
          {(["individual", "business"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setCustomerType(type)}
              className={`px-5 py-1.5 text-sm font-medium transition-colors cursor-pointer active:scale-95 ${
                customerType === type
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-800 hover:bg-white/60"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Name + Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Your name"
              value={name}
              className={fieldClass("name")}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => {
                touch("name");
                if (name.trim()) setName(titleCase(name.trim()));
              }}
            />
            {errors.name && showErr("name") && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              className={fieldClass("phone")}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={() => touch("phone")}
            />
            {errors.phone && showErr("phone") && <p className="text-xs text-red-500">{errors.phone}</p>}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={email}
            className={fieldClass("email")}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => touch("email")}
          />
          {errors.email && showErr("email") && <p className="text-xs text-red-500">{errors.email}</p>}
        </div>

        {/* Address */}
        <div className="space-y-1.5">
          <Label htmlFor="address">Full Delivery Address</Label>
          <Textarea
            id="address"
            placeholder="House / flat no., street, area, city"
            rows={3}
            value={address}
            className={fieldClass("address")}
            onChange={(e) => setAddress(e.target.value)}
            onBlur={() => touch("address")}
          />
          {errors.address && showErr("address") && <p className="text-xs text-red-500">{errors.address}</p>}
        </div>

        {/* State + Pincode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              placeholder="Maharashtra"
              value={state}
              onChange={(e) => setState(e.target.value)}
              onBlur={() => touch("state")}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              placeholder="400001"
              value={pincode}
              className={fieldClass("pincode")}
              onChange={(e) => setPincode(e.target.value)}
              onBlur={() => touch("pincode")}
            />
            {errors.pincode && showErr("pincode") && <p className="text-xs text-red-500">{errors.pincode}</p>}
          </div>
        </div>

        {/* Business-only fields */}
        {isBusiness && (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="gst">
                GST Number{" "}
                <span className="text-neutral-400 font-normal">(optional)</span>
              </Label>
              <Input
                id="gst"
                placeholder="22AAAAA0000A1Z5"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label>
                Business Type{" "}
                <span className="text-neutral-400 font-normal">(optional)</span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {businessCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setBusinessType(businessType === cat.id ? "" : cat.id)}
                    className={`px-4 py-2 text-sm border transition-colors cursor-pointer active:scale-95 ${
                      businessType === cat.id
                        ? "bg-neutral-900 border-neutral-900 text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <Turnstile
          onVerify={turnstile.handleVerify}
          onError={turnstile.handleError}
          onExpire={turnstile.handleExpire}
        />

        {submitError && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2">
            {submitError}
          </p>
        )}

        {triedSubmit && hasErrors && (
          <p className="text-sm text-red-600">Please fix the errors above before continuing.</p>
        )}

        <button
          type="submit"
          disabled={!turnstile.isVerified || isLoading || products.length === 0}
          className="w-full h-11 bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
        >
          {isLoading ? "Processing…" : `Pay ₹${totalAmount.toLocaleString("en-IN")} & Order`}
        </button>
      </form>
    </div>
  );
}
