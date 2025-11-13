import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, TrendingUp } from "lucide-react";

export default function PersonalPlan() {
  const [weeklyIncome, setWeeklyIncome] = useState(5000);
  const [categories, setCategories] = useState([
    { id: "1", name: "Food", planned: 1500, actual: 1800 },
    { id: "2", name: "Transport", planned: 800, actual: 750 },
    { id: "3", name: "Internet", planned: 500, actual: 500 },
    { id: "4", name: "Electricity", planned: 600, actual: 450 },
    { id: "5", name: "Others", planned: 400, actual: 600 },
  ]);

  const personalSavings = 2500;

  const updateCategory = (id: string, field: "planned" | "actual", value: number) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, [field]: value } : cat
      )
    );
  };

  const getPercentage = (actual: number, planned: number) => {
    if (planned === 0) return 0;
    return (actual / planned) * 100;
  };

  const getVariant = (actual: number, planned: number) => {
    const percentage = getPercentage(actual, planned);
    if (percentage > 120) return "destructive";
    if (percentage >= 100) return "warning";
    return "success";
  };

  const getColorClass = (actual: number, planned: number) => {
    const percentage = getPercentage(actual, planned);
    if (percentage > 120) return "bg-destructive";
    if (percentage >= 100) return "bg-warning";
    return "bg-success";
  };

  const totalPlanned = categories.reduce((sum, cat) => sum + cat.planned, 0);
  const totalActual = categories.reduce((sum, cat) => sum + cat.actual, 0);

  const topCategories = [...categories]
    .sort((a, b) => b.actual - a.actual)
    .slice(0, 3);

  const topCategoryPercentage =
    totalActual > 0
      ? ((topCategories[0]?.actual || 0) / totalActual) * 100
      : 0;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-personal-plan-title">
          Personal Plan
        </h1>
        <p className="text-muted-foreground">Track your income and expenses</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="income">Income (KES)</Label>
            <Input
              id="income"
              type="number"
              value={weeklyIncome}
              onChange={(e) => setWeeklyIncome(Number(e.target.value))}
              min="0"
              data-testid="input-weekly-income"
              className="text-lg font-medium"
            />
            <p className="text-sm text-muted-foreground">
              Total budgeted: KES {totalPlanned.toLocaleString()} |
              Remaining: KES {(weeklyIncome - totalPlanned).toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Spending Categories</h2>
          <Button variant="outline" size="sm" data-testid="button-add-category">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const percentage = getPercentage(category.actual, category.planned);
            const variant = getVariant(category.actual, category.planned);
            const colorClass = getColorClass(category.actual, category.planned);

            return (
              <Card key={category.id} data-testid={`category-${category.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{category.name}</CardTitle>
                    <Badge variant={variant === "success" ? "outline" : variant}>
                      {percentage.toFixed(0)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor={`planned-${category.id}`} className="text-xs">
                        Planned
                      </Label>
                      <Input
                        id={`planned-${category.id}`}
                        type="number"
                        value={category.planned}
                        onChange={(e) => updateCategory(category.id, "planned", Number(e.target.value))}
                        min="0"
                        data-testid={`input-planned-${category.id}`}
                        className="h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`actual-${category.id}`} className="text-xs">
                        Actual
                      </Label>
                      <Input
                        id={`actual-${category.id}`}
                        type="number"
                        value={category.actual}
                        onChange={(e) => updateCategory(category.id, "actual", Number(e.target.value))}
                        min="0"
                        data-testid={`input-actual-${category.id}`}
                        className="h-8"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        KES {category.actual} / {category.planned}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className={`h-full transition-all ${colorClass}`}
                        style={{
                          width: `${Math.min(percentage, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Savings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-md border p-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Saved</p>
              <p className="text-2xl font-bold" data-testid="text-personal-savings">
                KES {personalSavings.toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" data-testid="button-personal-deposit">
                <Plus className="mr-2 h-4 w-4" />
                Deposit
              </Button>
              <Button variant="outline" size="sm" data-testid="button-personal-withdraw">
                <Minus className="mr-2 h-4 w-4" />
                Withdraw
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Spending Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="mb-3 text-sm font-medium">Top 3 Spending Categories</h3>
            <div className="space-y-2">
              {topCategories.map((category, index) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between rounded-md border p-3"
                  data-testid={`top-category-${index + 1}`}
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      KES {category.actual.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {totalActual > 0
                        ? ((category.actual / totalActual) * 100).toFixed(1)
                        : 0}
                      % of total
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md bg-muted p-4">
            <p className="text-sm">
              <span className="font-medium">{topCategories[0]?.name || "N/A"}</span>{" "}
              consumes{" "}
              <span className="font-medium">{topCategoryPercentage.toFixed(1)}%</span> of
              your weekly spending
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
