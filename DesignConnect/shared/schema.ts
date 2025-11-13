import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Member schema
export const memberSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  email: z.string().email(),
  avatarUrl: z.string().nullable(),
  joinedAt: z.string(),
  reason: z.string(),
  totalSaved: z.number().default(0),
  outstanding: z.number().default(0),
});

export const insertMemberSchema = memberSchema.omit({ id: true, totalSaved: true, outstanding: true });
export type Member = z.infer<typeof memberSchema>;
export type InsertMember = z.infer<typeof insertMemberSchema>;

// Transaction schema
export const transactionSchema = z.object({
  id: z.string(),
  memberId: z.string(),
  type: z.enum(["deposit", "withdraw", "loan_disbursement", "loan_repayment"]),
  amount: z.number().positive(),
  date: z.string(),
  note: z.string(),
  createdBy: z.string(),
});

export const insertTransactionSchema = transactionSchema.omit({ id: true });
export type Transaction = z.infer<typeof transactionSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

// Loan schema
export const loanSchema = z.object({
  id: z.string(),
  memberId: z.string(),
  principal: z.number().positive(),
  interestRate: z.number().min(0),
  outstanding: z.number(),
  status: z.enum(["active", "paid", "overdue"]),
  createdAt: z.string(),
});

export const insertLoanSchema = loanSchema.omit({ id: true, outstanding: true, createdAt: true });
export type Loan = z.infer<typeof loanSchema>;
export type InsertLoan = z.infer<typeof insertLoanSchema>;

// Personal Plan schema
export const spendingCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  plannedAmount: z.number().min(0),
  actualAmount: z.number().min(0),
});

export const personalPlanSchema = z.object({
  id: z.string(),
  adminId: z.string(),
  weeklyIncome: z.number().min(0),
  categories: z.array(spendingCategorySchema),
  personalSavings: z.number().default(0),
});

export const insertPersonalPlanSchema = personalPlanSchema.omit({ id: true });
export type PersonalPlan = z.infer<typeof personalPlanSchema>;
export type InsertPersonalPlan = z.infer<typeof insertPersonalPlanSchema>;
export type SpendingCategory = z.infer<typeof spendingCategorySchema>;

// Admin schema
export const adminSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  avatarUrl: z.string().nullable(),
  password: z.string(),
});

export const insertAdminSchema = adminSchema.omit({ id: true });
export type Admin = z.infer<typeof adminSchema>;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;

// Settings schema
export const settingsSchema = z.object({
  id: z.string(),
  targetAmount: z.number().positive(),
  targetPeriodMonths: z.number().positive(),
  dailyMinimum: z.number().min(0),
  globalInterestRate: z.number().min(0),
  requirePasswordForSensitiveActions: z.boolean().default(false),
});

export const insertSettingsSchema = settingsSchema.omit({ id: true });
export type Settings = z.infer<typeof settingsSchema>;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;

// FAQ schema
export const faqSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
});

export const insertFaqSchema = faqSchema.omit({ id: true });
export type FAQ = z.infer<typeof faqSchema>;
export type InsertFAQ = z.infer<typeof insertFaqSchema>;

// Note schema
export const noteSchema = z.object({
  id: z.string(),
  adminId: z.string(),
  content: z.string(),
  updatedAt: z.string(),
});

export const insertNoteSchema = noteSchema.omit({ id: true, updatedAt: true });
export type Note = z.infer<typeof noteSchema>;
export type InsertNote = z.infer<typeof insertNoteSchema>;

// Activity schema for activity feed
export const activitySchema = z.object({
  id: z.string(),
  type: z.enum(["deposit", "withdraw", "loan_approved", "loan_repayment", "member_added", "member_deleted"]),
  description: z.string(),
  timestamp: z.string(),
  actorId: z.string(),
});

export type Activity = z.infer<typeof activitySchema>;
