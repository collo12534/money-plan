import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, DollarSign, Clock, Target, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: members = [], isLoading: membersLoading } = useQuery<any[]>({
    queryKey: ["/api/members"],
  });

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<any[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: activities = [], isLoading: activitiesLoading } = useQuery<any[]>({
    queryKey: ["/api/activities"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Calculate member contributions for pie chart
  const memberContributions = members.map((member) => ({
    name: member.name,
    value: member.totalSaved,
  }));

  const contributionData = {
    labels: memberContributions.map((m) => m.name),
    datasets: [
      {
        data: memberContributions.map((m) => m.value),
        backgroundColor: [
          "hsl(var(--chart-1))",
          "hsl(var(--chart-2))",
          "hsl(var(--chart-3))",
          "hsl(var(--chart-4))",
          "hsl(var(--chart-5))",
        ],
      },
    ],
  };

  // Calculate weekly contributions
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split("T")[0];
  });

  const weeklyContributions = last7Days.map((date) => {
    const dayTransactions = transactions.filter(
      (t: any) =>
        t.type === "deposit" && t.date.split("T")[0] === date
    );
    return dayTransactions.reduce((sum: number, t: any) => sum + t.amount, 0);
  });

  const weeklyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Daily Contributions",
        data: weeklyContributions,
        backgroundColor: "hsl(var(--primary))",
      },
    ],
  };

  // Find top contributor
  const topContributor = [...members].sort((a, b) => b.totalSaved - a.totalSaved)[0];

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  if (statsLoading || membersLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-dashboard-title">
            Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back! Here's your savings overview</p>
        </div>
        <Button variant="outline" data-testid="button-logout">
          Logout
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-active-members">
              {stats?.activeMembers || 0}
            </div>
            <p className="text-xs text-muted-foreground">Total registered members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-savings">
              KES {(stats?.totalSavings || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Accumulated group savings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Deposits</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-pending-total">
              KES {(stats?.pendingTotal || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Outstanding loans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Target Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-target-progress">
              {stats?.targetProgress || 0}%
            </div>
            <p className="text-xs text-muted-foreground">Of KES 500,000 goal</p>
          </CardContent>
        </Card>
      </div>

      {stats?.pendingDeposits && stats.pendingDeposits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Deposits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2 text-left text-sm font-medium">Member Name</th>
                    <th className="pb-2 text-left text-sm font-medium">Missed Date(s)</th>
                    <th className="pb-2 text-right text-sm font-medium">Amount Missed</th>
                    <th className="pb-2 text-right text-sm font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.pendingDeposits.map((deposit: any) => (
                    <tr key={deposit.id} className="border-b hover-elevate" data-testid={`row-pending-${deposit.id}`}>
                      <td className="py-3 text-sm">{deposit.name}</td>
                      <td className="py-3 text-sm text-muted-foreground">{deposit.missedDates}</td>
                      <td className="py-3 text-right text-sm font-medium">
                        KES {deposit.amount.toLocaleString()}
                      </td>
                      <td className="py-3 text-right">
                        <Button size="sm" variant="outline" data-testid={`button-remind-${deposit.id}`}>
                          Send Reminder
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Member Contributions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              {members.length > 0 ? (
                <div className="w-64 h-64">
                  <Pie
                    data={contributionData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          position: "bottom",
                        },
                      },
                    }}
                  />
                </div>
              ) : (
                <p className="py-12 text-muted-foreground">No data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Contributions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar
                data={weeklyData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {topContributor && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Top Contributor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={topContributor.avatarUrl || undefined} />
                  <AvatarFallback>
                    {topContributor.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{topContributor.name}</p>
                  <p className="text-sm text-muted-foreground">
                    KES {topContributor.totalSaved.toLocaleString()}
                  </p>
                </div>
                <Badge variant="default">#1</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Total contributed</p>
            </CardContent>
          </Card>
        )}

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities.length > 0 ? (
                activities.map((activity: any) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 text-sm"
                    data-testid={`activity-${activity.id}`}
                  >
                    <Badge
                      variant={
                        activity.type === "deposit"
                          ? "default"
                          : activity.type === "withdraw"
                          ? "secondary"
                          : "outline"
                      }
                      className="mt-0.5"
                    >
                      {activity.type.replace("_", " ")}
                    </Badge>
                    <div className="flex-1">
                      <p>{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-4 text-center text-muted-foreground">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
