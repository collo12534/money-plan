import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Edit, Trash2, Upload, Download, RotateCcw } from "lucide-react";

export default function Settings() {
  const [isAddAdminDialogOpen, setIsAddAdminDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  // Mock data
  const [financialSettings, setFinancialSettings] = useState({
    targetAmount: 500000,
    targetPeriodMonths: 6,
    dailyMinimum: 50,
    globalInterestRate: 5,
  });

  const [securitySettings, setSecuritySettings] = useState({
    requirePasswordForSensitiveActions: false,
  });

  const admins = [
    {
      id: "admin_01",
      name: "Admin User",
      email: "admin@example.com",
      phone: "+254700000000",
      avatarUrl: null,
    },
  ];

  const handleExportConfig = () => {
    const config = {
      financial: financialSettings,
      security: securitySettings,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `settings-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportConfig = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          try {
            const config = JSON.parse(event.target.result);
            if (config.financial) setFinancialSettings(config.financial);
            if (config.security) setSecuritySettings(config.security);
          } catch (error) {
            console.error("Failed to import config:", error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleReset = () => {
    setFinancialSettings({
      targetAmount: 500000,
      targetPeriodMonths: 6,
      dailyMinimum: 50,
      globalInterestRate: 5,
    });
    setSecuritySettings({
      requirePasswordForSensitiveActions: false,
    });
    setResetDialogOpen(false);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-settings-title">
          Settings
        </h1>
        <p className="text-muted-foreground">Manage application configuration</p>
      </div>

      <Tabs defaultValue="financial" className="space-y-4">
        <TabsList>
          <TabsTrigger value="financial" data-testid="tab-financial">
            Financial Rules
          </TabsTrigger>
          <TabsTrigger value="admins" data-testid="tab-admins">
            Admin Management
          </TabsTrigger>
          <TabsTrigger value="security" data-testid="tab-security">
            Security
          </TabsTrigger>
          <TabsTrigger value="import-export" data-testid="tab-import-export">
            Import/Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle>Financial Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="target-amount">Target Amount (KES)</Label>
                  <Input
                    id="target-amount"
                    type="number"
                    value={financialSettings.targetAmount}
                    onChange={(e) =>
                      setFinancialSettings({
                        ...financialSettings,
                        targetAmount: Number(e.target.value),
                      })
                    }
                    min="0"
                    data-testid="input-target-amount"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target-period">Target Period (Months)</Label>
                  <Input
                    id="target-period"
                    type="number"
                    value={financialSettings.targetPeriodMonths}
                    onChange={(e) =>
                      setFinancialSettings({
                        ...financialSettings,
                        targetPeriodMonths: Number(e.target.value),
                      })
                    }
                    min="1"
                    data-testid="input-target-period"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="daily-minimum">Daily Minimum (KES)</Label>
                  <Input
                    id="daily-minimum"
                    type="number"
                    value={financialSettings.dailyMinimum}
                    onChange={(e) =>
                      setFinancialSettings({
                        ...financialSettings,
                        dailyMinimum: Number(e.target.value),
                      })
                    }
                    min="0"
                    data-testid="input-daily-minimum"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                  <Input
                    id="interest-rate"
                    type="number"
                    value={financialSettings.globalInterestRate}
                    onChange={(e) =>
                      setFinancialSettings({
                        ...financialSettings,
                        globalInterestRate: Number(e.target.value),
                      })
                    }
                    min="0"
                    step="0.1"
                    data-testid="input-interest-rate"
                  />
                </div>
              </div>
              <Button data-testid="button-save-financial">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admins">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Admin Accounts</CardTitle>
                <Dialog open={isAddAdminDialogOpen} onOpenChange={setIsAddAdminDialogOpen}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-add-admin">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Admin</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="admin-name">Name *</Label>
                        <Input
                          id="admin-name"
                          placeholder="Enter name"
                          data-testid="input-admin-name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin-email">Email *</Label>
                        <Input
                          id="admin-email"
                          type="email"
                          placeholder="email@example.com"
                          data-testid="input-admin-email"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin-phone">Phone</Label>
                        <Input
                          id="admin-phone"
                          type="tel"
                          placeholder="+254..."
                          data-testid="input-admin-phone"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin-password">Password *</Label>
                        <Input
                          id="admin-password"
                          type="password"
                          placeholder="Enter password"
                          data-testid="input-admin-password"
                          required
                        />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={() => setIsAddAdminDialogOpen(false)}
                          data-testid="button-cancel-add-admin"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1"
                          data-testid="button-submit-add-admin"
                        >
                          Add Admin
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {admins.map((admin) => (
                  <div
                    key={admin.id}
                    className="flex items-center gap-4 rounded-md border p-4 hover-elevate"
                    data-testid={`admin-${admin.id}`}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={admin.avatarUrl || undefined} />
                      <AvatarFallback>
                        {admin.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{admin.name}</p>
                      <div className="flex gap-2 text-sm text-muted-foreground">
                        <span>{admin.email}</span>
                        <span>•</span>
                        <span>{admin.phone}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        data-testid={`button-edit-admin-${admin.id}`}
                        aria-label="Edit admin"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        data-testid={`button-delete-admin-${admin.id}`}
                        aria-label="Delete admin"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="password-toggle">
                    Require Password for Sensitive Actions
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Require admin password when approving loans or deleting members
                  </p>
                </div>
                <Switch
                  id="password-toggle"
                  checked={securitySettings.requirePasswordForSensitiveActions}
                  onCheckedChange={(checked) =>
                    setSecuritySettings({
                      ...securitySettings,
                      requirePasswordForSensitiveActions: checked,
                    })
                  }
                  data-testid="switch-password-requirement"
                />
              </div>
              <Button data-testid="button-save-security">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import-export">
          <Card>
            <CardHeader>
              <CardTitle>Import/Export Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Export your current settings as a JSON file or import settings from a
                  previously exported file.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={handleExportConfig}
                  data-testid="button-export-config"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Configuration
                </Button>
                <Button
                  variant="outline"
                  onClick={handleImportConfig}
                  data-testid="button-import-config"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Import Configuration
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setResetDialogOpen(true)}
                  data-testid="button-reset-config"
                  className="text-destructive hover:text-destructive"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset to Default Settings?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset all settings to their default values. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-reset">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              data-testid="button-confirm-reset"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reset Settings
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
