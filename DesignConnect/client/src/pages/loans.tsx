import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { HandCoins, Info } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Loans() {
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [repayDialogOpen, setRepayDialogOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const { toast } = useToast();

  const { data: members = [], isLoading: membersLoading } = useQuery<any[]>({
    queryKey: ["/api/members"],
  });

  const { data: settings } = useQuery<any>({
    queryKey: ["/api/settings"],
  });

  const { data: loans = [], isLoading: loansLoading } = useQuery<any[]>({
    queryKey: ["/api/loans"],
  });

  const createLoanMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/loans", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loans"] });
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      setApprovalDialogOpen(false);
      setLoanAmount("");
      setSelectedMember("");
      toast({
        title: "Success",
        description: "Loan approved successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve loan",
        variant: "destructive",
      });
    },
  });

  const repayLoanMutation = useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) => {
      const loan = loans.find((l: any) => l.id === id);
      if (!loan) throw new Error("Loan not found");
      
      const newOutstanding = Math.max(0, loan.outstanding - amount);
      return apiRequest("PATCH", `/api/loans/${id}`, {
        outstanding: newOutstanding,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loans"] });
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      setRepayDialogOpen(false);
      setSelectedLoan(null);
      toast({
        title: "Success",
        description: "Repayment processed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to process repayment",
        variant: "destructive",
      });
    },
  });

  const interestRate = settings?.globalInterestRate || 5;

  const calculateInterest = (amount: number) => {
    return (amount * interestRate) / 100;
  };

  const handleApprove = () => {
    const amount = parseFloat(loanAmount);
    if (!isNaN(amount) && amount > 0 && selectedMember) {
      setApprovalDialogOpen(true);
    }
  };

  const confirmApproval = () => {
    const amount = parseFloat(loanAmount);
    createLoanMutation.mutate({
      memberId: selectedMember,
      principal: amount,
      interestRate: interestRate,
      status: "active",
    });
  };

  const handleRepay = (loan: any) => {
    setSelectedLoan(loan);
    setRepayDialogOpen(true);
  };

  const handleRepaySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const amount = parseFloat(formData.get("amount") as string);
    
    if (selectedLoan) {
      repayLoanMutation.mutate({ id: selectedLoan.id, amount });
    }
  };

  if (loansLoading || membersLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  // Enrich loans with member names
  const enrichedLoans = loans.map((loan: any) => ({
    ...loan,
    memberName: members.find((m: any) => m.id === loan.memberId)?.name || "Unknown",
  }));

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-loans-title">
          Loan Management
        </h1>
        <p className="text-muted-foreground">Approve and manage member loans</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Approve New Loan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="loan-member">Select Member</Label>
            <Select value={selectedMember} onValueChange={setSelectedMember}>
              <SelectTrigger id="loan-member" data-testid="select-loan-member">
                <SelectValue placeholder="Choose a member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member: any) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="loan-amount">Loan Amount (KES)</Label>
            <Input
              id="loan-amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter loan amount"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              data-testid="input-loan-amount"
            />
          </div>

          {loanAmount && parseFloat(loanAmount) > 0 && (
            <div className="rounded-md bg-muted p-3 space-y-1">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium">Interest ({interestRate}%):</span> KES{" "}
                    {calculateInterest(parseFloat(loanAmount)).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">Total Payable:</span> KES{" "}
                    {(
                      parseFloat(loanAmount) + calculateInterest(parseFloat(loanAmount))
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button
            className="w-full"
            onClick={handleApprove}
            disabled={!selectedMember || !loanAmount || parseFloat(loanAmount) <= 0}
            data-testid="button-approve-loan"
          >
            <HandCoins className="mr-2 h-4 w-4" />
            Approve Loan
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Loan Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {enrichedLoans.map((loan: any) => (
              <div
                key={loan.id}
                className="flex items-center justify-between rounded-md border p-4 hover-elevate"
                data-testid={`loan-${loan.id}`}
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{loan.memberName}</p>
                    <Badge
                      variant={
                        loan.status === "paid"
                          ? "outline"
                          : loan.status === "overdue"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {loan.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm md:grid-cols-4">
                    <div>
                      <span className="text-muted-foreground">Principal:</span>
                      <span className="ml-1 font-medium">
                        KES {loan.principal.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Interest:</span>
                      <span className="ml-1 font-medium">{loan.interestRate}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Outstanding:</span>
                      <span className="ml-1 font-medium">
                        KES {loan.outstanding.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created:</span>
                      <span className="ml-1">
                        {new Date(loan.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                {loan.status === "active" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRepay(loan)}
                    data-testid={`button-repay-${loan.id}`}
                  >
                    Repay
                  </Button>
                )}
              </div>
            ))}

            {enrichedLoans.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                <p>No loans found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Loan Approval</DialogTitle>
            <DialogDescription>
              Please review the loan details before approving.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Member:</span>
              <span className="font-medium">
                {members.find((m: any) => m.id === selectedMember)?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Principal Amount:</span>
              <span className="font-medium">
                KES {parseFloat(loanAmount || "0").toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Interest ({interestRate}%):</span>
              <span className="font-medium">
                KES {calculateInterest(parseFloat(loanAmount || "0")).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium">Total Payable:</span>
              <span className="text-lg font-bold">
                KES{" "}
                {(
                  parseFloat(loanAmount || "0") +
                  calculateInterest(parseFloat(loanAmount || "0"))
                ).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setApprovalDialogOpen(false)}
              data-testid="button-cancel-approval"
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={confirmApproval}
              data-testid="button-confirm-approval"
              disabled={createLoanMutation.isPending}
            >
              {createLoanMutation.isPending ? "Approving..." : "Approve"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={repayDialogOpen} onOpenChange={setRepayDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loan Repayment</DialogTitle>
            <DialogDescription>
              Enter the repayment amount for this loan.
            </DialogDescription>
          </DialogHeader>
          {selectedLoan && (
            <div className="mb-4 rounded-md bg-muted p-3 text-sm">
              <p>
                <span className="font-medium">Outstanding:</span> KES{" "}
                {selectedLoan.outstanding.toLocaleString()}
              </p>
            </div>
          )}
          <form onSubmit={handleRepaySubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="repay-amount">Repayment Amount (KES) *</Label>
              <Input
                id="repay-amount"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                max={selectedLoan?.outstanding}
                placeholder="Enter amount"
                data-testid="input-repay-amount"
                required
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setRepayDialogOpen(false)}
                data-testid="button-cancel-repay"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                data-testid="button-confirm-repay"
                disabled={repayLoanMutation.isPending}
              >
                {repayLoanMutation.isPending ? "Processing..." : "Confirm Repayment"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
