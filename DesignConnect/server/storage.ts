import {
  type Member,
  type InsertMember,
  type Transaction,
  type InsertTransaction,
  type Loan,
  type InsertLoan,
  type PersonalPlan,
  type InsertPersonalPlan,
  type Admin,
  type InsertAdmin,
  type Settings,
  type InsertSettings,
  type FAQ,
  type InsertFAQ,
  type Note,
  type InsertNote,
  type Activity,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Members
  getAllMembers(): Promise<Member[]>;
  getMember(id: string): Promise<Member | undefined>;
  getMemberByEmail(email: string): Promise<Member | undefined>;
  createMember(member: InsertMember): Promise<Member>;
  updateMember(id: string, member: Partial<Member>): Promise<Member | undefined>;
  deleteMember(id: string): Promise<boolean>;

  // Transactions
  getAllTransactions(): Promise<Transaction[]>;
  getTransactionsByMember(memberId: string): Promise<Transaction[]>;
  getTransaction(id: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;

  // Loans
  getAllLoans(): Promise<Loan[]>;
  getLoansByMember(memberId: string): Promise<Loan[]>;
  getLoan(id: string): Promise<Loan | undefined>;
  createLoan(loan: InsertLoan): Promise<Loan>;
  updateLoan(id: string, loan: Partial<Loan>): Promise<Loan | undefined>;

  // Personal Plans
  getPersonalPlan(adminId: string): Promise<PersonalPlan | undefined>;
  createPersonalPlan(plan: InsertPersonalPlan): Promise<PersonalPlan>;
  updatePersonalPlan(id: string, plan: Partial<PersonalPlan>): Promise<PersonalPlan | undefined>;

  // Admins
  getAllAdmins(): Promise<Admin[]>;
  getAdmin(id: string): Promise<Admin | undefined>;
  getAdminByEmail(email: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  updateAdmin(id: string, admin: Partial<Admin>): Promise<Admin | undefined>;
  deleteAdmin(id: string): Promise<boolean>;

  // Settings
  getSettings(): Promise<Settings | undefined>;
  createSettings(settings: InsertSettings): Promise<Settings>;
  updateSettings(id: string, settings: Partial<Settings>): Promise<Settings | undefined>;

  // FAQs
  getAllFAQs(): Promise<FAQ[]>;
  getFAQ(id: string): Promise<FAQ | undefined>;
  createFAQ(faq: InsertFAQ): Promise<FAQ>;
  updateFAQ(id: string, faq: Partial<FAQ>): Promise<FAQ | undefined>;
  deleteFAQ(id: string): Promise<boolean>;

  // Notes
  getNote(adminId: string): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: string, note: Partial<Note>): Promise<Note | undefined>;

  // Activities
  getAllActivities(limit?: number): Promise<Activity[]>;
  createActivity(activity: Omit<Activity, "id">): Promise<Activity>;
}

export class MemStorage implements IStorage {
  private members: Map<string, Member>;
  private transactions: Map<string, Transaction>;
  private loans: Map<string, Loan>;
  private personalPlans: Map<string, PersonalPlan>;
  private admins: Map<string, Admin>;
  private settings: Settings | null;
  private faqs: Map<string, FAQ>;
  private notes: Map<string, Note>;
  private activities: Activity[];

  constructor() {
    this.members = new Map();
    this.transactions = new Map();
    this.loans = new Map();
    this.personalPlans = new Map();
    this.admins = new Map();
    this.settings = null;
    this.faqs = new Map();
    this.notes = new Map();
    this.activities = [];
    this.seedData();
  }

  private seedData() {
    // Seed default settings
    this.settings = {
      id: "settings_01",
      targetAmount: 500000,
      targetPeriodMonths: 6,
      dailyMinimum: 50,
      globalInterestRate: 5,
      requirePasswordForSensitiveActions: false,
    };

    // Seed default admin
    const admin: Admin = {
      id: "admin_01",
      name: "Admin User",
      email: "admin@example.com",
      phone: "+254700000000",
      avatarUrl: null,
      password: "admin123",
    };
    this.admins.set(admin.id, admin);

    // Seed sample members
    const members: Member[] = [
      {
        id: "m_01",
        name: "Jane Doe",
        phone: "+254712345678",
        email: "jane@example.com",
        avatarUrl: null,
        joinedAt: "2025-11-01",
        reason: "School fees",
        totalSaved: 12300,
        outstanding: 500,
      },
      {
        id: "m_02",
        name: "John Smith",
        phone: "+254723456789",
        email: "john@example.com",
        avatarUrl: null,
        joinedAt: "2025-10-15",
        reason: "Business capital",
        totalSaved: 8500,
        outstanding: 0,
      },
      {
        id: "m_03",
        name: "Mary Johnson",
        phone: "+254734567890",
        email: "mary@example.com",
        avatarUrl: null,
        joinedAt: "2025-09-20",
        reason: "Emergency fund",
        totalSaved: 15200,
        outstanding: 1000,
      },
    ];
    members.forEach((m) => this.members.set(m.id, m));

    // Seed sample FAQs
    const faqs: FAQ[] = [
      {
        id: "faq_01",
        question: "How do I make a daily deposit?",
        answer: "Navigate to the Funds page, select your name from the dropdown, enter the amount, and click the Deposit button.",
      },
      {
        id: "faq_02",
        question: "What is the minimum daily saving amount?",
        answer: "The minimum daily saving amount is KES 50 per day as set by the admin.",
      },
    ];
    faqs.forEach((f) => this.faqs.set(f.id, f));
  }

  // Members
  async getAllMembers(): Promise<Member[]> {
    return Array.from(this.members.values());
  }

  async getMember(id: string): Promise<Member | undefined> {
    return this.members.get(id);
  }

  async getMemberByEmail(email: string): Promise<Member | undefined> {
    return Array.from(this.members.values()).find((m) => m.email === email);
  }

  async createMember(insertMember: InsertMember): Promise<Member> {
    const id = randomUUID();
    const member: Member = {
      ...insertMember,
      id,
      totalSaved: 0,
      outstanding: 0,
    };
    this.members.set(id, member);
    await this.createActivity({
      type: "member_added",
      description: `New member added: ${member.name}`,
      timestamp: new Date().toISOString(),
      actorId: "admin_01",
    });
    return member;
  }

  async updateMember(id: string, updates: Partial<Member>): Promise<Member | undefined> {
    const member = this.members.get(id);
    if (!member) return undefined;
    const updated = { ...member, ...updates };
    this.members.set(id, updated);
    return updated;
  }

  async deleteMember(id: string): Promise<boolean> {
    const member = this.members.get(id);
    if (!member) return false;
    this.members.delete(id);
    await this.createActivity({
      type: "member_deleted",
      description: `Member deleted: ${member.name}`,
      timestamp: new Date().toISOString(),
      actorId: "admin_01",
    });
    return true;
  }

  // Transactions
  async getAllTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values());
  }

  async getTransactionsByMember(memberId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (t) => t.memberId === memberId
    );
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = { ...insertTransaction, id };
    this.transactions.set(id, transaction);

    // Update member totals
    const member = this.members.get(transaction.memberId);
    if (member) {
      if (transaction.type === "deposit") {
        member.totalSaved += transaction.amount;
      } else if (transaction.type === "withdraw") {
        member.totalSaved -= transaction.amount;
      }
      this.members.set(member.id, member);
    }

    // Create activity
    const activityType = transaction.type === "deposit" ? "deposit" : "withdraw";
    await this.createActivity({
      type: activityType,
      description: `${member?.name || "Member"} ${transaction.type}ed KES ${transaction.amount.toLocaleString()}`,
      timestamp: new Date().toISOString(),
      actorId: transaction.createdBy,
    });

    return transaction;
  }

  // Loans
  async getAllLoans(): Promise<Loan[]> {
    return Array.from(this.loans.values());
  }

  async getLoansByMember(memberId: string): Promise<Loan[]> {
    return Array.from(this.loans.values()).filter((l) => l.memberId === memberId);
  }

  async getLoan(id: string): Promise<Loan | undefined> {
    return this.loans.get(id);
  }

  async createLoan(insertLoan: InsertLoan): Promise<Loan> {
    const id = randomUUID();
    const interest = (insertLoan.principal * insertLoan.interestRate) / 100;
    const loan: Loan = {
      ...insertLoan,
      id,
      outstanding: insertLoan.principal + interest,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    this.loans.set(id, loan);

    // Create loan disbursement transaction
    await this.createTransaction({
      memberId: loan.memberId,
      type: "loan_disbursement",
      amount: loan.principal,
      date: new Date().toISOString(),
      note: "Loan disbursement",
      createdBy: "admin_01",
    });

    // Update member outstanding
    const member = this.members.get(loan.memberId);
    if (member) {
      member.outstanding += loan.outstanding;
      this.members.set(member.id, member);
    }

    // Create activity
    await this.createActivity({
      type: "loan_approved",
      description: `Loan approved for ${member?.name || "Member"} - KES ${loan.principal.toLocaleString()}`,
      timestamp: new Date().toISOString(),
      actorId: "admin_01",
    });

    return loan;
  }

  async updateLoan(id: string, updates: Partial<Loan>): Promise<Loan | undefined> {
    const loan = this.loans.get(id);
    if (!loan) return undefined;

    const previousOutstanding = loan.outstanding;
    const updated = { ...loan, ...updates };
    this.loans.set(id, updated);

    // Update member outstanding if changed
    if (updates.outstanding !== undefined) {
      const member = this.members.get(loan.memberId);
      if (member) {
        member.outstanding = member.outstanding - previousOutstanding + updated.outstanding;
        if (updated.outstanding === 0) {
          updated.status = "paid";
        }
        this.members.set(member.id, member);

        // Create activity for repayment
        if (updates.outstanding < previousOutstanding) {
          const repaymentAmount = previousOutstanding - updates.outstanding;
          await this.createActivity({
            type: "loan_repayment",
            description: `${member.name} repaid KES ${repaymentAmount.toLocaleString()} towards loan`,
            timestamp: new Date().toISOString(),
            actorId: "admin_01",
          });
        }
      }
    }

    return updated;
  }

  // Personal Plans
  async getPersonalPlan(adminId: string): Promise<PersonalPlan | undefined> {
    return Array.from(this.personalPlans.values()).find((p) => p.adminId === adminId);
  }

  async createPersonalPlan(insertPlan: InsertPersonalPlan): Promise<PersonalPlan> {
    const id = randomUUID();
    const plan: PersonalPlan = { ...insertPlan, id };
    this.personalPlans.set(id, plan);
    return plan;
  }

  async updatePersonalPlan(id: string, updates: Partial<PersonalPlan>): Promise<PersonalPlan | undefined> {
    const plan = this.personalPlans.get(id);
    if (!plan) return undefined;
    const updated = { ...plan, ...updates };
    this.personalPlans.set(id, updated);
    return updated;
  }

  // Admins
  async getAllAdmins(): Promise<Admin[]> {
    return Array.from(this.admins.values());
  }

  async getAdmin(id: string): Promise<Admin | undefined> {
    return this.admins.get(id);
  }

  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    return Array.from(this.admins.values()).find((a) => a.email === email);
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const id = randomUUID();
    const admin: Admin = { ...insertAdmin, id };
    this.admins.set(id, admin);
    return admin;
  }

  async updateAdmin(id: string, updates: Partial<Admin>): Promise<Admin | undefined> {
    const admin = this.admins.get(id);
    if (!admin) return undefined;
    const updated = { ...admin, ...updates };
    this.admins.set(id, updated);
    return updated;
  }

  async deleteAdmin(id: string): Promise<boolean> {
    return this.admins.delete(id);
  }

  // Settings
  async getSettings(): Promise<Settings | undefined> {
    return this.settings || undefined;
  }

  async createSettings(insertSettings: InsertSettings): Promise<Settings> {
    const id = randomUUID();
    const settings: Settings = { ...insertSettings, id };
    this.settings = settings;
    return settings;
  }

  async updateSettings(id: string, updates: Partial<Settings>): Promise<Settings | undefined> {
    if (!this.settings || this.settings.id !== id) return undefined;
    this.settings = { ...this.settings, ...updates };
    return this.settings;
  }

  // FAQs
  async getAllFAQs(): Promise<FAQ[]> {
    return Array.from(this.faqs.values());
  }

  async getFAQ(id: string): Promise<FAQ | undefined> {
    return this.faqs.get(id);
  }

  async createFAQ(insertFAQ: InsertFAQ): Promise<FAQ> {
    const id = randomUUID();
    const faq: FAQ = { ...insertFAQ, id };
    this.faqs.set(id, faq);
    return faq;
  }

  async updateFAQ(id: string, updates: Partial<FAQ>): Promise<FAQ | undefined> {
    const faq = this.faqs.get(id);
    if (!faq) return undefined;
    const updated = { ...faq, ...updates };
    this.faqs.set(id, updated);
    return updated;
  }

  async deleteFAQ(id: string): Promise<boolean> {
    return this.faqs.delete(id);
  }

  // Notes
  async getNote(adminId: string): Promise<Note | undefined> {
    return Array.from(this.notes.values()).find((n) => n.adminId === adminId);
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const id = randomUUID();
    const note: Note = {
      ...insertNote,
      id,
      updatedAt: new Date().toISOString(),
    };
    this.notes.set(id, note);
    return note;
  }

  async updateNote(id: string, updates: Partial<Note>): Promise<Note | undefined> {
    const note = this.notes.get(id);
    if (!note) return undefined;
    const updated = {
      ...note,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.notes.set(id, updated);
    return updated;
  }

  // Activities
  async getAllActivities(limit = 10): Promise<Activity[]> {
    return this.activities.slice(-limit).reverse();
  }

  async createActivity(activity: Omit<Activity, "id">): Promise<Activity> {
    const id = randomUUID();
    const newActivity: Activity = { ...activity, id };
    this.activities.push(newActivity);
    // Keep only last 100 activities
    if (this.activities.length > 100) {
      this.activities = this.activities.slice(-100);
    }
    return newActivity;
  }
}

export const storage = new MemStorage();
