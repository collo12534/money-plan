import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Minus } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Funds() {
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: members = [], isLoading: membersLoading } = useQuery<any[]>({
    queryKey: ["/api/members"],
  });

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<any[]>({
    queryKey: ["/api/transactions"],
    enabled: !!selectedMember,
  });

  const createTransactionMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/transactions", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      setDepositDialogOpen(false);
      setWithdrawDialogOpen(false);
      toast({
        title: "Success",
        description: "Transaction completed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to process transaction",
        variant: "destructive",
      });
    },
  });

  const memberTransactions = transactions.filter(
    (t: any) => t.memberId === selectedMember
  );

  const handleDeposit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      memberId: selectedMember,
      type: "deposit",
      amount: parseFloat(formData.get("amount") as string),
      date: formData.get("date") as string,
      note: formData.get("note") as string || "Deposit",
      createdBy: "admin_01",
    };

    createTransactionMutation.mutate(data);
  };

  const handleWithdraw = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      memberId: selectedMember,
      type: "withdraw",
      amount: parseFloat(formData.get("amount") as string),
      date: formData.get("date") as string,
      note: formData.get("reason") as string,
      createdBy: "admin_01",
    };

    createTransactionMutation.mutate(data);
  };

  if (membersLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-funds-title">
          Funds Management
        </h1>
        <p className="text-muted-foreground">Manage deposits and withdrawals</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Member</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedMember} onValueChange={setSelectedMember}>
            <SelectTrigger data-testid="select-member">
              <SelectValue placeholder="Choose a member" />
            </SelectTrigger>
            <SelectContent>
              {members.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedMember && (
            <div className="grid gap-4 md:grid-cols-2">
              <Button
                className="w-full"
                onClick={() => setDepositDialogOpen(true)}
                data-testid="button-deposit"
              >
                <Plus className="mr-2 h-4 w-4" />
                Deposit
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setWithdrawDialogOpen(true)}
                data-testid="button-withdraw"
              >
                <Minus className="mr-2 h-4 w-4" />
                Withdraw
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedMember && (
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {transactionsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {memberTransactions.map((transaction: any) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between rounded-md border p-3 hover-elevate"
                    data-testid={`transaction-${transaction.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={transaction.type === "deposit" ? "default" : "secondary"}
                      >
                        {transaction.type}
                      </Badge>
                      <div>
                        <p className="font-medium">
                          KES {transaction.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">{transaction.note}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}

                {memberTransactions.length === 0 && (
                  <div className="py-12 text-center text-muted-foreground">
                    <p>No transactions yet</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make Deposit</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleDeposit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deposit-amount">Amount (KES) *</Label>
              <Input
                id="deposit-amount"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter amount"
                data-testid="input-deposit-amount"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deposit-note">Note</Label>
              <Textarea
                id="deposit-note"
                name="note"
                placeholder="Optional note about this deposit"
                data-testid="input-deposit-note"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deposit-date">Date</Label>
              <Input
                id="deposit-date"
                name="date"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                data-testid="input-deposit-date"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setDepositDialogOpen(false)}
                data-testid="button-cancel-deposit"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                data-testid="button-confirm-deposit"
                disabled={createTransactionMutation.isPending}
              >
                {createTransactionMutation.isPending ? "Processing..." : "Confirm Deposit"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make Withdrawal</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="withdraw-amount">Amount (KES) *</Label>
              <Input
                id="withdraw-amount"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter amount"
                data-testid="input-withdraw-amount"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="withdraw-reason">Reason *</Label>
              <Textarea
                id="withdraw-reason"
                name="reason"
                placeholder="Reason for withdrawal"
                data-testid="input-withdraw-reason"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="withdraw-date">Date</Label>
              <Input
                id="withdraw-date"
                name="date"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                data-testid="input-withdraw-date"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setWithdrawDialogOpen(false)}
                data-testid="button-cancel-withdraw"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                data-testid="button-confirm-withdraw"
                disabled={createTransactionMutation.isPending}
              >
                {createTransactionMutation.isPending ? "Processing..." : "Confirm Withdrawal"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
