import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, CheckCircle } from "lucide-react";

interface Dhikr {
  id: string;
  name: string;
  nameEn: string;
  preview: string;
  previewEn: string;
  sentences: {
    arabic: string;
    phonetic: string;
    translation: string;
    translationFr: string;
  }[];
  repetitions: number;
}

const morningAtkar: Dhikr[] = [
  {
    id: "ayat-kursi",
    name: "Ayat al-Kursi",
    nameEn: "Ayat al-Kursi",
    preview: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...",
    previewEn: "Allah! There is no deity except Him...",
    sentences: [
      {
        arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ",
        phonetic: "Allāhu lā ilāha illā huwa al-ḥayyu al-qayyūm, lā ta'khudhuhu sinatun wa lā nawm",
        translation: "Allah! There is no deity except Him, the Ever-Living, the Sustainer. Neither drowsiness overtakes Him nor sleep.",
        translationFr: "Allah! Il n'y a de divinité que Lui, le Vivant, Celui qui subsiste par Lui-même. Ni somnolence ni sommeil ne Le saisissent."
      }
    ],
    repetitions: 1
  },
  {
    id: "surah-ikhlas",
    name: "Sourate Al-Ikhlas",
    nameEn: "Surah Al-Ikhlas",
    preview: "قُلْ هُوَ اللَّهُ أَحَدٌ...",
    previewEn: "Say: He is Allah, the One...",
    sentences: [
      {
        arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
        phonetic: "Qul huwa Allāhu aḥad",
        translation: "Say: He is Allah, the One",
        translationFr: "Dis : Il est Allah, Unique"
      },
      {
        arabic: "اللَّهُ الصَّمَدُ",
        phonetic: "Allāhu aṣ-ṣamad",
        translation: "Allah, the Eternal Refuge",
        translationFr: "Allah, Le Seul à être imploré"
      },
      {
        arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
        phonetic: "Lam yalid wa lam yūlad",
        translation: "He neither begets nor is born",
        translationFr: "Il n'a jamais engendré, n'a pas été engendré"
      },
      {
        arabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
        phonetic: "Wa lam yakun lahu kufuwan aḥad",
        translation: "Nor is there to Him any equivalent",
        translationFr: "Et nul n'est égal à Lui"
      }
    ],
    repetitions: 3
  },
  {
    id: "surah-falaq",
    name: "Sourate Al-Falaq",
    nameEn: "Surah Al-Falaq",
    preview: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ...",
    previewEn: "Say: I seek refuge in the Lord of daybreak...",
    sentences: [
      {
        arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
        phonetic: "Qul a'ūdhu bi-rabbi al-falaq",
        translation: "Say: I seek refuge in the Lord of daybreak",
        translationFr: "Dis : Je cherche protection auprès du Seigneur de l'aube"
      },
      {
        arabic: "مِن شَرِّ مَا خَلَقَ",
        phonetic: "Min sharri mā khalaq",
        translation: "From the evil of that which He created",
        translationFr: "Contre le mal des êtres qu'Il a créés"
      }
    ],
    repetitions: 3
  },
  {
    id: "surah-nas",
    name: "Sourate An-Nas",
    nameEn: "Surah An-Nas",
    preview: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ...",
    previewEn: "Say: I seek refuge in the Lord of mankind...",
    sentences: [
      {
        arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
        phonetic: "Qul a'ūdhu bi-rabbi an-nās",
        translation: "Say: I seek refuge in the Lord of mankind",
        translationFr: "Dis : Je cherche protection auprès du Seigneur des hommes"
      },
      {
        arabic: "مَلِكِ النَّاسِ",
        phonetic: "Maliki an-nās",
        translation: "The Sovereign of mankind",
        translationFr: "Le Roi des hommes"
      }
    ],
    repetitions: 3
  }
];

const eveningAtkar: Dhikr[] = [...morningAtkar];

export const Atkar = () => {
  const { t, language } = useLanguage();
  const [selectedDhikr, setSelectedDhikr] = useState<Dhikr | null>(null);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [completedMorning, setCompletedMorning] = useState<Set<string>>(new Set());
  const [completedEvening, setCompletedEvening] = useState<Set<string>>(new Set());

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const stored = localStorage.getItem(`atkar-${today}`);
    if (stored) {
      const data = JSON.parse(stored);
      setCompletedMorning(new Set(data.morning || []));
      setCompletedEvening(new Set(data.evening || []));
    }
  }, []);

  const handleDhikrClick = (dhikr: Dhikr) => {
    setSelectedDhikr(dhikr);
    setCurrentSentence(0);
    setDialogOpen(true);
  };

  const handleMarkComplete = (dhikr: Dhikr, type: "morning" | "evening") => {
    const today = new Date().toISOString().split("T")[0];
    const newCompleted = type === "morning" 
      ? new Set([...completedMorning, dhikr.id])
      : new Set([...completedEvening, dhikr.id]);
    
    if (type === "morning") {
      setCompletedMorning(newCompleted);
    } else {
      setCompletedEvening(newCompleted);
    }

    const stored = localStorage.getItem(`atkar-${today}`);
    const data = stored ? JSON.parse(stored) : { morning: [], evening: [] };
    data[type] = Array.from(newCompleted);
    localStorage.setItem(`atkar-${today}`, JSON.stringify(data));

    setDialogOpen(false);
  };

  const nextSentence = () => {
    if (selectedDhikr && currentSentence < selectedDhikr.sentences.length - 1) {
      setCurrentSentence(currentSentence + 1);
    }
  };

  const prevSentence = () => {
    if (currentSentence > 0) {
      setCurrentSentence(currentSentence - 1);
    }
  };

  const renderDhikrList = (dhikrList: Dhikr[], type: "morning" | "evening") => {
    const completed = type === "morning" ? completedMorning : completedEvening;
    const allCompleted = dhikrList.every(d => completed.has(d.id));
    const estimatedTime = dhikrList.length * 2; // 2 min par dhikr

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg sm:text-xl font-bold text-foreground">
              {type === "morning" ? (language === "fr" ? "Adhkar du matin" : "Morning Adhkar") : (language === "fr" ? "Adhkar du soir" : "Evening Adhkar")}
            </h3>
            {allCompleted && (
              <Badge className="bg-success text-success-foreground">
                <CheckCircle className="w-3 h-3 mr-1" />
                {language === "fr" ? "Terminé" : "Complete"}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>~{estimatedTime} min</span>
          </div>
        </div>

        {dhikrList.map((dhikr) => {
          const isCompleted = completed.has(dhikr.id);
          return (
            <Card
              key={dhikr.id}
              className={`p-3 sm:p-4 cursor-pointer hover:shadow-lg transition-all ${
                isCompleted ? "bg-success/5 border-success/20" : ""
              }`}
              onClick={() => handleDhikrClick(dhikr)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm sm:text-base font-semibold text-foreground">
                      {language === "fr" ? dhikr.name : dhikr.nameEn}
                    </h4>
                    {isCompleted && (
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {language === "fr" ? dhikr.preview : dhikr.previewEn}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {dhikr.repetitions}x
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-foreground">
        {language === "fr" ? "Adhkar quotidiens" : "Daily Adhkar"}
      </h2>

      {renderDhikrList(morningAtkar, "morning")}
      {renderDhikrList(eveningAtkar, "evening")}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              {selectedDhikr && (language === "fr" ? selectedDhikr.name : selectedDhikr.nameEn)}
            </DialogTitle>
          </DialogHeader>

          {selectedDhikr && (
            <div className="space-y-6 p-2">
              <div className="text-center space-y-4">
                <p className="text-2xl sm:text-3xl md:text-4xl font-arabic leading-loose" dir="rtl">
                  {selectedDhikr.sentences[currentSentence].arabic}
                </p>
                
                <p className="text-base sm:text-lg text-primary italic">
                  {selectedDhikr.sentences[currentSentence].phonetic}
                </p>
                
                <p className="text-sm sm:text-base text-muted-foreground">
                  {language === "fr" 
                    ? selectedDhikr.sentences[currentSentence].translationFr 
                    : selectedDhikr.sentences[currentSentence].translation}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  onClick={prevSentence}
                  disabled={currentSentence === 0}
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <span className="text-sm text-muted-foreground">
                  {currentSentence + 1} / {selectedDhikr.sentences.length}
                </span>

                <Button
                  onClick={nextSentence}
                  disabled={currentSentence === selectedDhikr.sentences.length - 1}
                  variant="outline"
                  size="sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {currentSentence === selectedDhikr.sentences.length - 1 && (
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <Button
                    onClick={() => handleMarkComplete(selectedDhikr, "morning")}
                    className="w-full bg-success hover:bg-success/90"
                  >
                    {language === "fr" ? "Marquer Matin" : "Mark Morning"}
                  </Button>
                  <Button
                    onClick={() => handleMarkComplete(selectedDhikr, "evening")}
                    className="w-full bg-success hover:bg-success/90"
                  >
                    {language === "fr" ? "Marquer Soir" : "Mark Evening"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
