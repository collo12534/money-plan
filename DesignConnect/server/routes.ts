import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertMemberSchema,
  insertTransactionSchema,
  insertLoanSchema,
  insertPersonalPlanSchema,
  insertAdminSchema,
  insertSettingsSchema,
  insertFaqSchema,
  insertNoteSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Members routes
  app.get("/api/members", async (req, res) => {
    try {
      const members = await storage.getAllMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch members" });
    }
  });

  app.get("/api/members/:id", async (req, res) => {
    try {
      const member = await storage.getMember(req.params.id);
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }
      res.json(member);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch member" });
    }
  });

  app.post("/api/members", async (req, res) => {
    try {
      const data = insertMemberSchema.parse(req.body);
      
      // Check for duplicate email
      const existing = await storage.getMemberByEmail(data.email);
      if (existing) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const member = await storage.createMember(data);
      res.status(201).json(member);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create member" });
    }
  });

  app.patch("/api/members/:id", async (req, res) => {
    try {
      const member = await storage.updateMember(req.params.id, req.body);
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }
      res.json(member);
    } catch (error) {
      res.status(500).json({ error: "Failed to update member" });
    }
  });

  app.delete("/api/members/:id", async (req, res) => {
    try {
      const success = await storage.deleteMember(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Member not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete member" });
    }
  });

  // Transactions routes
  app.get("/api/transactions", async (req, res) => {
    try {
      const { memberId } = req.query;
      if (memberId) {
        const transactions = await storage.getTransactionsByMember(memberId as string);
        return res.json(transactions);
      }
      const transactions = await storage.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const data = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(data);
      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create transaction" });
    }
  });

  // Loans routes
  app.get("/api/loans", async (req, res) => {
    try {
      const { memberId } = req.query;
      if (memberId) {
        const loans = await storage.getLoansByMember(memberId as string);
        return res.json(loans);
      }
      const loans = await storage.getAllLoans();
      res.json(loans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch loans" });
    }
  });

  app.post("/api/loans", async (req, res) => {
    try {
      const data = insertLoanSchema.parse(req.body);
      const loan = await storage.createLoan(data);
      res.status(201).json(loan);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create loan" });
    }
  });

  app.patch("/api/loans/:id", async (req, res) => {
    try {
      const loan = await storage.updateLoan(req.params.id, req.body);
      if (!loan) {
        return res.status(404).json({ error: "Loan not found" });
      }
      res.json(loan);
    } catch (error) {
      res.status(500).json({ error: "Failed to update loan" });
    }
  });

  // Personal Plan routes
  app.get("/api/personal-plan", async (req, res) => {
    try {
      const { adminId } = req.query;
      if (!adminId) {
        return res.status(400).json({ error: "adminId is required" });
      }
      const plan = await storage.getPersonalPlan(adminId as string);
      res.json(plan || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch personal plan" });
    }
  });

  app.post("/api/personal-plan", async (req, res) => {
    try {
      const data = insertPersonalPlanSchema.parse(req.body);
      const plan = await storage.createPersonalPlan(data);
      res.status(201).json(plan);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create personal plan" });
    }
  });

  app.patch("/api/personal-plan/:id", async (req, res) => {
    try {
      const plan = await storage.updatePersonalPlan(req.params.id, req.body);
      if (!plan) {
        return res.status(404).json({ error: "Personal plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(500).json({ error: "Failed to update personal plan" });
    }
  });

  // Admins routes
  app.get("/api/admins", async (req, res) => {
    try {
      const admins = await storage.getAllAdmins();
      // Don't send passwords to frontend
      const sanitized = admins.map(({ password, ...admin }) => admin);
      res.json(sanitized);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admins" });
    }
  });

  app.post("/api/admins", async (req, res) => {
    try {
      const data = insertAdminSchema.parse(req.body);
      
      // Check for duplicate email
      const existing = await storage.getAdminByEmail(data.email);
      if (existing) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const admin = await storage.createAdmin(data);
      const { password, ...sanitized } = admin;
      res.status(201).json(sanitized);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create admin" });
    }
  });

  app.patch("/api/admins/:id", async (req, res) => {
    try {
      const admin = await storage.updateAdmin(req.params.id, req.body);
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }
      const { password, ...sanitized } = admin;
      res.json(sanitized);
    } catch (error) {
      res.status(500).json({ error: "Failed to update admin" });
    }
  });

  app.delete("/api/admins/:id", async (req, res) => {
    try {
      const success = await storage.deleteAdmin(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Admin not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete admin" });
    }
  });

  // Settings routes
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      const data = insertSettingsSchema.parse(req.body);
      const settings = await storage.createSettings(data);
      res.status(201).json(settings);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create settings" });
    }
  });

  app.patch("/api/settings/:id", async (req, res) => {
    try {
      const settings = await storage.updateSettings(req.params.id, req.body);
      if (!settings) {
        return res.status(404).json({ error: "Settings not found" });
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // FAQs routes
  app.get("/api/faqs", async (req, res) => {
    try {
      const faqs = await storage.getAllFAQs();
      res.json(faqs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch FAQs" });
    }
  });

  app.post("/api/faqs", async (req, res) => {
    try {
      const data = insertFaqSchema.parse(req.body);
      const faq = await storage.createFAQ(data);
      res.status(201).json(faq);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create FAQ" });
    }
  });

  app.patch("/api/faqs/:id", async (req, res) => {
    try {
      const faq = await storage.updateFAQ(req.params.id, req.body);
      if (!faq) {
        return res.status(404).json({ error: "FAQ not found" });
      }
      res.json(faq);
    } catch (error) {
      res.status(500).json({ error: "Failed to update FAQ" });
    }
  });

  app.delete("/api/faqs/:id", async (req, res) => {
    try {
      const success = await storage.deleteFAQ(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "FAQ not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete FAQ" });
    }
  });

  // Notes routes
  app.get("/api/notes", async (req, res) => {
    try {
      const { adminId } = req.query;
      if (!adminId) {
        return res.status(400).json({ error: "adminId is required" });
      }
      const note = await storage.getNote(adminId as string);
      res.json(note || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch note" });
    }
  });

  app.post("/api/notes", async (req, res) => {
    try {
      const data = insertNoteSchema.parse(req.body);
      const note = await storage.createNote(data);
      res.status(201).json(note);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create note" });
    }
  });

  app.patch("/api/notes/:id", async (req, res) => {
    try {
      const note = await storage.updateNote(req.params.id, req.body);
      if (!note) {
        return res.status(404).json({ error: "Note not found" });
      }
      res.json(note);
    } catch (error) {
      res.status(500).json({ error: "Failed to update note" });
    }
  });

  // Activities routes
  app.get("/api/activities", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const activities = await storage.getAllActivities(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  // Reports/CSV export
  app.get("/api/reports/export", async (req, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      const members = await storage.getAllMembers();
      
      // Create CSV content
      let csv = "Date,Member,Type,Amount,Note\n";
      for (const t of transactions) {
        const member = members.find((m) => m.id === t.memberId);
        csv += `${t.date},"${member?.name || 'Unknown'}",${t.type},${t.amount},"${t.note}"\n`;
      }
      
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename=transactions-${Date.now()}.csv`);
      res.send(csv);
    } catch (error) {
      res.status(500).json({ error: "Failed to export report" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const members = await storage.getAllMembers();
      const transactions = await storage.getAllTransactions();
      const settings = await storage.getSettings();

      const activeMembers = members.length;
      const totalSavings = members.reduce((sum, m) => sum + m.totalSaved, 0);
      const pendingTotal = members.reduce((sum, m) => sum + m.outstanding, 0);
      const targetProgress = settings
        ? (totalSavings / settings.targetAmount) * 100
        : 0;

      // Calculate missed deposits (members who haven't deposited in last 2 days)
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const recentDeposits = transactions.filter(
        (t) => t.type === "deposit" && new Date(t.date) >= twoDaysAgo
      );
      const membersWithRecentDeposits = new Set(recentDeposits.map((t) => t.memberId));
      const pendingDeposits = members
        .filter((m) => !membersWithRecentDeposits.has(m.id))
        .map((m) => ({
          id: m.id,
          name: m.name,
          missedDates: "Last 2 days",
          amount: settings?.dailyMinimum || 50,
        }));

      res.json({
        activeMembers,
        totalSavings,
        pendingTotal,
        targetProgress: parseFloat(targetProgress.toFixed(1)),
        pendingDeposits,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
