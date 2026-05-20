import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const bulkctc_orders = pgTable("bulkctc_orders", {
  id:             serial("id").primaryKey(),
  created_at:     timestamp("created_at").defaultNow().notNull(),

  // customer
  name:           text("name").notNull(),
  phone:          text("phone").notNull(),
  email:          text("email"),
  pincode:        text("pincode").notNull(),
  address:        text("address").notNull(),
  state:          text("state"),
  gst_number:     text("gst_number"),
  business_type:  text("business_type"),

  // order
  products:       text("products").notNull(),   // JSON array of slugs
  quantity_tier:  text("quantity_tier").notNull(),
  total_amount:   integer("total_amount").notNull(),

  // cashfree
  link_id:        text("link_id").notNull().unique(),
  payment_status: text("payment_status").notNull().default("pending"),
});
