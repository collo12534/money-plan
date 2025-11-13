import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Printer } from "lucide-react";

export default function Reports() {
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<any[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: members = [] } = useQuery<any[]>({
    queryKey: ["/api/members"],
  });

  const summary = {
    totalDeposits: transactions
      .filter((t: any) => t.type === "deposit")
      .reduce((sum: number, t: any) => sum + t.amount, 0),
    totalWithdrawals: transactions
      .filter((t: any) => t.type === "withdraw")
      .reduce((sum: number, t: any) => sum + t.amount, 0),
    netSavings: 0,
    transactionCount: transactions.length,
  };

  summary.netSavings = summary.totalDeposits - summary.totalWithdrawals;

  const handleExportCSV = async () => {
    try {
      const response = await fetch("/api/reports/export");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transactions-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to export CSV:", error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const enrichedTransactions = transactions.map((t: any) => ({
    ...t,
    memberName: members.find((m: any) => m.id === t.memberId)?.name || "Unknown",
  }));

  if (transactionsLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-reports-title">
            Reports
          </h1>
          <p className="text-muted-foreground">Export and view transaction summaries</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExportCSV}
            data-testid="button-export-csv"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={handlePrint} data-testid="button-print">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              KES {summary.totalDeposits.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              KES {summary.totalWithdrawals.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              KES {summary.netSavings.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.transactionCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-2 text-left text-sm font-medium">Date</th>
                  <th className="pb-2 text-left text-sm font-medium">Member</th>
                  <th className="pb-2 text-left text-sm font-medium">Type</th>
                  <th className="pb-2 text-right text-sm font-medium">Amount</th>
                  <th className="pb-2 text-left text-sm font-medium">Note</th>
                </tr>
              </thead>
              <tbody>
                {enrichedTransactions.map((transaction: any) => (
                  <tr
                    key={transaction.id}
                    className="border-b hover-elevate"
                    data-testid={`report-transaction-${transaction.id}`}
                  >
                    <td className="py-3 text-sm">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-sm">{transaction.memberName}</td>
                    <td className="py-3 text-sm">
                      <Badge
                        variant={
                          transaction.type === "deposit" ? "default" : "secondary"
                        }
                      >
                        {transaction.type}
                      </Badge>
                    </td>
                    <td className="py-3 text-right text-sm font-medium">
                      KES {transaction.amount.toLocaleString()}
                    </td>
                    <td className="py-3 text-sm text-muted-foreground">
                      {transaction.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {enrichedTransactions.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                <p>No transactions found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
