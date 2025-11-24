import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDailyHadith } from "@/hooks/useDailyHadith";

export const DailyHadith = () => {
  const { hadith, loading, error } = useDailyHadith();

  if (loading) {
    return (
      <Card className="shadow-lg border-accent/20 hover:shadow-xl transition-all duration-300">
        <CardHeader className="space-y-3">
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-4 w-1/3" />
        </CardContent>
      </Card>
    );
  }

  if (error || !hadith) {
    return (
      <Card className="shadow-lg border-accent/20">
        <CardContent className="py-6">
          <p className="text-center text-sm text-muted-foreground">
            {error || "Le hadith du jour n'est pas disponible pour le moment."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-accent/20 hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <BookOpen className="w-5 h-5 text-accent" />
          Hadith du jour
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-card/50 backdrop-blur-sm">
            <p className="text-right font-arabic text-lg leading-loose text-foreground mb-3">
              {hadith.arabic_text}
            </p>
            <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent my-3" />
            <p className="text-sm leading-relaxed text-muted-foreground italic">
              {hadith.french_translation}
            </p>
          </div>
          <p className="text-xs text-muted-foreground font-medium text-center">
            📚 {hadith.reference}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
