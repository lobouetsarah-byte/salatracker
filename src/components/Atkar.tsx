import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sunrise, Sunset } from "lucide-react";

interface Dhikr {
  id: string;
  text: string;
  translation: string;
  count: number;
}

const morningAtkar: Dhikr[] = [
  {
    id: "ayat-kursi",
    text: "آية الكرسي",
    translation: "Ayat Al-Kursi (The Throne Verse)",
    count: 1,
  },
  {
    id: "qul-huwa",
    text: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    translation: "Surah Al-Ikhlas (Say: He is Allah, the One)",
    count: 3,
  },
  {
    id: "qul-aodhu-falaq",
    text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
    translation: "Surah Al-Falaq (Say: I seek refuge in the Lord of daybreak)",
    count: 3,
  },
  {
    id: "qul-aodhu-nas",
    text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
    translation: "Surah An-Nas (Say: I seek refuge in the Lord of mankind)",
    count: 3,
  },
  {
    id: "morning-dua",
    text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ",
    translation: "We have entered a new day and the dominion belongs to Allah",
    count: 1,
  },
];

const eveningAtkar: Dhikr[] = [
  {
    id: "ayat-kursi-eve",
    text: "آية الكرسي",
    translation: "Ayat Al-Kursi (The Throne Verse)",
    count: 1,
  },
  {
    id: "qul-huwa-eve",
    text: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    translation: "Surah Al-Ikhlas (Say: He is Allah, the One)",
    count: 3,
  },
  {
    id: "qul-aodhu-falaq-eve",
    text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
    translation: "Surah Al-Falaq (Say: I seek refuge in the Lord of daybreak)",
    count: 3,
  },
  {
    id: "qul-aodhu-nas-eve",
    text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
    translation: "Surah An-Nas (Say: I seek refuge in the Lord of mankind)",
    count: 3,
  },
  {
    id: "evening-dua",
    text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ",
    translation: "We have entered the evening and the dominion belongs to Allah",
    count: 1,
  },
];

export const Atkar = () => {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const toggleComplete = (id: string) => {
    const newCompleted = new Set(completed);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompleted(newCompleted);
  };

  const renderDhikrList = (dhikrList: Dhikr[]) => (
    <div className="space-y-4">
      {dhikrList.map((dhikr) => (
        <Card key={dhikr.id}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id={dhikr.id}
                checked={completed.has(dhikr.id)}
                onCheckedChange={() => toggleComplete(dhikr.id)}
                className="mt-1"
              />
              <div className="flex-1 space-y-1">
                <p className="text-xl font-arabic text-right leading-relaxed">
                  {dhikr.text}
                </p>
                <p className="text-sm text-muted-foreground">{dhikr.translation}</p>
                {dhikr.count > 1 && (
                  <p className="text-xs text-muted-foreground">
                    Repeat {dhikr.count}x
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <Tabs defaultValue="morning" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="morning" className="flex items-center gap-2">
            <Sunrise className="w-4 h-4" />
            Morning
          </TabsTrigger>
          <TabsTrigger value="evening" className="flex items-center gap-2">
            <Sunset className="w-4 h-4" />
            Evening
          </TabsTrigger>
        </TabsList>

        <TabsContent value="morning" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sunrise className="w-5 h-5" />
                Morning Atkar
              </CardTitle>
              <CardDescription>
                Recommended to recite after Fajr prayer until sunrise
              </CardDescription>
            </CardHeader>
          </Card>
          {renderDhikrList(morningAtkar)}
        </TabsContent>

        <TabsContent value="evening" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sunset className="w-5 h-5" />
                Evening Atkar
              </CardTitle>
              <CardDescription>
                Recommended to recite after Asr prayer until sunset
              </CardDescription>
            </CardHeader>
          </Card>
          {renderDhikrList(eveningAtkar)}
        </TabsContent>
      </Tabs>
    </div>
  );
};
