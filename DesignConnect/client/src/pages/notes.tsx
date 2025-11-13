import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Save } from "lucide-react";

export default function Notes() {
  const [content, setContent] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("admin-notes");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setContent(data.content || "");
        setLastSaved(data.updatedAt ? new Date(data.updatedAt) : null);
      } catch (error) {
        console.error("Failed to load notes:", error);
      }
    }
  }, []);

  // Auto-save on content change
  useEffect(() => {
    if (content === "") return;

    const timer = setTimeout(() => {
      setIsSaving(true);
      const now = new Date();
      localStorage.setItem(
        "admin-notes",
        JSON.stringify({ content, updatedAt: now.toISOString() })
      );
      setLastSaved(now);
      setTimeout(() => setIsSaving(false), 500);
    }, 1000);

    return () => clearTimeout(timer);
  }, [content]);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-notes-title">
          Notes
        </h1>
        <p className="text-muted-foreground">Keep track of important information</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Admin Notes</CardTitle>
            <div className="flex items-center gap-2">
              {isSaving && (
                <Badge variant="outline" className="gap-1">
                  <Save className="h-3 w-3" />
                  Saving...
                </Badge>
              )}
              {!isSaving && lastSaved && (
                <Badge variant="outline" className="text-xs">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start typing your notes here... Auto-saves after 1 second of inactivity."
            className="min-h-[400px] resize-none"
            data-testid="textarea-notes"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {content.length} characters
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
