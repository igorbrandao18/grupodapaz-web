import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, jsonb, timestamp, serial, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const profiles = pgTable("profiles", {
  id: varchar("id").primaryKey(),
  email: text("email").notNull().unique(),
  full_name: text("full_name"),
  phone: text("phone"),
  cpf: text("cpf"),
  role: text("role").notNull().default("client"),
  plan_id: integer("plan_id"),
  stripe_customer_id: text("stripe_customer_id"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;

export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: text("price").notNull(),
  period: text("period").notNull().default("/mês"),
  description: text("description"),
  dependents: integer("dependents").notNull().default(1),
  popular: boolean("popular").notNull().default(false),
  active: boolean("active").notNull().default(true),
  image: text("image"),
  features: text("features").array().notNull(),
  display_order: integer("display_order").notNull().default(0),
  stripe_price_id: text("stripe_price_id"),
  stripe_product_id: text("stripe_product_id"),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPlanSchema = createInsertSchema(plans).omit({
  id: true,
  updated_at: true,
});

export type InsertPlan = z.infer<typeof insertPlanSchema>;
export type Plan = typeof plans.$inferSelect;

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  profile_id: varchar("profile_id").notNull(),
  plan_id: integer("plan_id").notNull(),
  stripe_subscription_id: text("stripe_subscription_id").unique(),
  stripe_price_id: text("stripe_price_id"),
  status: text("status").notNull().default("active"),
  start_date: timestamp("start_date").defaultNow().notNull(),
  end_date: timestamp("end_date"),
  cancel_at_period_end: boolean("cancel_at_period_end").default(false),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

export const dependents = pgTable("dependents", {
  id: serial("id").primaryKey(),
  profile_id: varchar("profile_id").notNull(),
  name: text("name").notNull(),
  cpf: text("cpf").notNull(),
  birth_date: timestamp("birth_date"),
  relationship: text("relationship").notNull(),
  photo_url: text("photo_url"),
  active: boolean("active").notNull().default(true),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDependentSchema = createInsertSchema(dependents).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type InsertDependent = z.infer<typeof insertDependentSchema>;
export type Dependent = typeof dependents.$inferSelect;

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  subscription_id: integer("subscription_id").notNull(),
  stripe_payment_intent_id: text("stripe_payment_intent_id"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  payment_method: text("payment_method").notNull(),
  paid_at: timestamp("paid_at"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  created_at: true,
});

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  subscription_id: integer("subscription_id").notNull(),
  stripe_invoice_id: text("stripe_invoice_id").unique(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  due_date: timestamp("due_date").notNull(),
  status: text("status").notNull().default("pending"),
  hosted_invoice_url: text("hosted_invoice_url"),
  invoice_pdf_url: text("invoice_pdf_url"),
  pix_code: text("pix_code"),
  boleto_url: text("boleto_url"),
  boleto_barcode: text("boleto_barcode"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  created_at: true,
});

export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;
