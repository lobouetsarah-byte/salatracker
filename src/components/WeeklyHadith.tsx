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
    <Card className="shadow-lg border-accent/20 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-accent/5 to-accent/10">
      <CardHeader className="space-y-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="p-2 rounded-lg bg-accent/10">
            <BookOpen className="w-5 h-5 text-accent" />
          </div>
          Hadith de la semaine
          <Sparkles className="w-4 h-4 text-accent ml-auto" />
        </CardTitle>
        <CardDescription className="text-sm font-medium text-accent">
          {hadith.title}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-xl bg-card border border-accent/20">
          <p className="text-right font-arabic text-xl leading-loose text-foreground mb-3">
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
      </CardContent>
    </Card>
  );
};
