import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface DailySuccessProps {
  open: boolean;
  onClose: () => void;
  isInPeriod: boolean;
}

export const DailySuccess = ({ open, onClose, isInPeriod }: DailySuccessProps) => {
  const message = isInPeriod
    ? "Félicitations ! Tu as accompli un acte spirituel à chaque moment de prière aujourd'hui 🌸"
    : "Bravo ! Toutes tes prières ont été accomplies à l'heure aujourd'hui 🎉";

  const emoji = isInPeriod ? "🌸" : "🕌";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" aria-describedby={undefined}>
        <div className="flex flex-col items-center text-center space-y-6 py-6">
          <div className="text-7xl animate-bounce">{emoji}</div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Journée Accomplie !
            </h2>
            <p className="text-muted-foreground text-lg">
              {message}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4" />
            <span>Continue comme ça, tu es sur la bonne voie</span>
            <Sparkles className="w-4 h-4" />
          </div>

          <Button 
            onClick={onClose}
            className="w-full"
            size="lg"
          >
            Merci ! ✨
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
