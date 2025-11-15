import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useWeeklyHadith } from "@/hooks/useWeeklyHadith";

export const WeeklyHadith = () => {
  const { hadith, loading } = useWeeklyHadith();

  if (loading) {
    return (
      <Card className="shadow-lg border-accent/20 hover:shadow-xl transition-all duration-300">
        <CardHeader className="space-y-3">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-4 w-1/3" />
        </CardContent>
      </Card>
    );
  }

  if (!hadith) {
    return null;
  }

  return (
    <div className="text-center py-4 px-6 rounded-2xl bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 shadow-sm">
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-card/50 backdrop-blur-sm">
          <p className="text-right font-arabic text-lg sm:text-xl leading-loose text-foreground mb-3">
            {hadith.arabic_text}
          </p>
          <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent my-3" />
          <p className="text-sm leading-relaxed text-muted-foreground italic">
            {hadith.french_translation}
          </p>
        </div>
        <p className="text-xs text-muted-foreground font-medium">
          📚 {hadith.reference}
        </p>
      </div>
    </div>
  );
};
