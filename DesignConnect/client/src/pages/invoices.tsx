import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export default function Invoices() {
  // Mock data
  const transactions = [
    {
      id: "t_01",
      date: "2025-11-10",
      member: "Jane Doe",
      amount: 2000,
      type: "deposit",
    },
    {
      id: "t_02",
      date: "2025-11-09",
      member: "John Smith",
      amount: 1000,
      type: "withdraw",
    },
    {
      id: "t_03",
      date: "2025-11-08",
      member: "Mary Johnson",
      amount: 1500,
      type: "deposit",
    },
  ];

  const handleGenerate = (transactionId: string) => {
    console.log("Generating invoice for:", transactionId);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-invoices-title">
          Invoices
        </h1>
        <p className="text-muted-foreground">Generate invoices from transactions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between rounded-md border p-4 hover-elevate"
                data-testid={`invoice-transaction-${transaction.id}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{transaction.member}</p>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground capitalize">
                      {transaction.type}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{new Date(transaction.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="font-medium">
                      KES {transaction.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGenerate(transaction.id)}
                  data-testid={`button-generate-${transaction.id}`}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Invoice
                </Button>
              </div>
            ))}

            {transactions.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                <p>No transactions available for invoicing</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
