import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function FAQs() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Mock data
  const faqs = [
    {
      id: "faq_01",
      question: "How do I make a daily deposit?",
      answer:
        "Navigate to the Funds page, select your name from the dropdown, enter the amount, and click the Deposit button. Confirm your transaction to complete the deposit.",
    },
    {
      id: "faq_02",
      question: "What is the minimum daily saving amount?",
      answer:
        "The minimum daily saving amount is set by the admin in the Settings page. Currently, it is KES 50 per day.",
    },
    {
      id: "faq_03",
      question: "How do I apply for a loan?",
      answer:
        "Contact your group admin to apply for a loan. The admin will process your request through the Loans page and approve it based on your savings history and group rules.",
    },
    {
      id: "faq_04",
      question: "Can I withdraw my savings anytime?",
      answer:
        "Withdrawal policies are set by your group admin. Generally, withdrawals require admin approval and may have restrictions based on your group's saving goals.",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-faqs-title">
            FAQs
          </h1>
          <p className="text-muted-foreground">Frequently asked questions</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-faq">
              <Plus className="mr-2 h-4 w-4" />
              Add FAQ
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New FAQ</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">Question *</Label>
                <Input
                  id="question"
                  placeholder="Enter the question"
                  data-testid="input-faq-question"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="answer">Answer *</Label>
                <Textarea
                  id="answer"
                  placeholder="Enter the answer"
                  rows={4}
                  data-testid="input-faq-answer"
                  required
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsAddDialogOpen(false)}
                  data-testid="button-cancel-add-faq"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" data-testid="button-submit-add-faq">
                  Add FAQ
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Questions & Answers</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} data-testid={`faq-${faq.id}`}>
                <div className="flex items-center gap-2">
                  <AccordionTrigger className="flex-1 text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      data-testid={`button-edit-${faq.id}`}
                      aria-label="Edit FAQ"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      data-testid={`button-delete-${faq.id}`}
                      aria-label="Delete FAQ"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {faqs.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              <p>No FAQs added yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
