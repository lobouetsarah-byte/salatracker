import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import salatrackLogo from "@/assets/salatrack-logo.png";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center">
          <img src={salatrackLogo} alt="Salatrack" className="w-20 h-20" />
        </div>
        <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">404</h1>
        <p className="text-xl text-muted-foreground">Page introuvable</p>
        <Button onClick={() => navigate("/")} size="lg" className="gap-2">
          <Home className="w-4 h-4" />
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
