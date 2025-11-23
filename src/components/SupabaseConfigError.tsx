import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const SupabaseConfigError = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 space-y-6 shadow-2xl border-2 border-destructive/20">
        <div className="flex items-center justify-center">
          <div className="p-4 rounded-2xl bg-destructive/10">
            <AlertCircle className="w-16 h-16 text-destructive" />
          </div>
        </div>

        <div className="text-center space-y-3">
          <h1 className="text-2xl font-bold text-foreground">
            Configuration Error
          </h1>
          <p className="text-muted-foreground">
            The application could not connect to the backend service. This usually means the app is not properly configured.
          </p>
        </div>

        <div className="space-y-4 text-sm text-muted-foreground">
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <p className="font-semibold text-foreground">For developers:</p>
            <p>Missing required environment variables:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><code className="text-xs bg-muted px-1 py-0.5 rounded">VITE_SUPABASE_URL</code></li>
              <li><code className="text-xs bg-muted px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code></li>
            </ul>
            <p className="mt-2">Check your <code className="text-xs bg-muted px-1 py-0.5 rounded">.env</code> file configuration.</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleReload}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Retry
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            If the problem persists, please contact support
          </p>
        </div>
      </Card>
    </div>
  );
};
