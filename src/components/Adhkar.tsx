import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/useLanguage";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Clock, CheckCircle, Check, Volume2, Pause, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Dhikr {
  id: string;
  name: string;
  nameEn: string;
  preview: string;
  previewEn: string;
  estimatedTime: string;
  sentences: {
    arabic: string;
    phonetic: string;
    translation: string;
    translationFr: string;
  }[];
  repetitions: number;
}

const morningAdhkar: Dhikr[] = [
  {
    id: "morning-invocation",
    name: "Invocation du matin",
    nameEn: "Morning Invocation",
    preview: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ...",
    previewEn: "We have reached morning...",
    estimatedTime: "1 min",
    sentences: [
      {
        arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        phonetic: "Aṣbaḥnā wa aṣbaḥa al-mulku lillāh, walḥamdu lillāh, lā ilāha illā Allāhu waḥdahu lā sharīka lah, lahu al-mulk wa lahu al-ḥamd wa huwa 'alā kulli shay'in qadīr",
        translation: "We have reached morning and the sovereignty belongs to Allah, and all praise is due to Allah. There is no god but Allah alone with no partner. To Him belongs the dominion and to Him is all praise, and He has power over all things.",
        translationFr: "Nous voici au matin et le royaume appartient à Allah. Louange à Allah, il n'y a de divinité qu'Allah, Unique, sans associé. À Lui la royauté, à Lui la louange et Il est capable de toute chose."
      }
    ],
    repetitions: 1
  },
  {
    id: "ayat-kursi",
    name: "Ayat al-Kursi",
    nameEn: "Ayat al-Kursi",
    preview: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...",
    previewEn: "Allah! There is no deity except Him...",
    estimatedTime: "1 min",
    sentences: [
      {
        arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ",
        phonetic: "Allāhu lā ilāha illā huwa al-ḥayyu al-qayyūm, lā ta'khudhuhu sinatun wa lā nawm",
        translation: "Allah! There is no deity except Him, the Ever-Living, the Sustainer. Neither drowsiness overtakes Him nor sleep.",
        translationFr: "Allah! Il n'y a de divinité que Lui, le Vivant, Celui qui subsiste par Lui-même. Ni somnolence ni sommeil ne Le saisissent."
      },
      {
        arabic: "لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ",
        phonetic: "Lahu mā fī as-samāwāti wa mā fī al-arḍ, man dhā alladhī yashfa'u 'indahu illā bi-idhnih",
        translation: "To Him belongs whatever is in the heavens and whatever is on earth. Who is it that can intercede with Him except by His permission?",
        translationFr: "À Lui appartient tout ce qui est dans les cieux et sur la terre. Qui peut intercéder auprès de Lui sans Sa permission?"
      },
      {
        arabic: "يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ",
        phonetic: "Ya'lamu mā bayna aydīhim wa mā khalfahum, wa lā yuḥīṭūna bi-shay'in min 'ilmihi illā bimā shā'",
        translation: "He knows what is before them and what is behind them, and they encompass not a thing of His knowledge except what He wills.",
        translationFr: "Il connaît leur passé et leur futur. Et, de Sa science, ils n'embrassent que ce qu'Il veut."
      },
      {
        arabic: "وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
        phonetic: "Wasi'a kursiyyuhu as-samāwāti wa al-arḍ, wa lā ya'ūduhu ḥifẓuhumā, wa huwa al-'aliyyu al-'aẓīm",
        translation: "His Throne extends over the heavens and the earth, and it does not tire Him to preserve them. And He is the Most High, the Most Great.",
        translationFr: "Son Trône déborde les cieux et la terre, dont la garde ne Lui coûte aucune peine. Et Il est le Très Haut, le Très Grand."
      }
    ],
    repetitions: 1
  },
  {
    id: "subhan-allah",
    name: "Tasbih, Tahmid, Takbir",
    nameEn: "Tasbih, Tahmid, Takbir",
    preview: "سُبْحَانَ اللَّهِ، الْحَمْدُ لِلَّهِ، اللَّهُ أَكْبَرُ",
    previewEn: "Glory be to Allah, Praise be to Allah, Allah is the Greatest",
    estimatedTime: "2 min",
    sentences: [
      {
        arabic: "سُبْحَانَ اللَّهِ",
        phonetic: "Subḥāna Allāh",
        translation: "Glory be to Allah",
        translationFr: "Gloire à Allah"
      },
      {
        arabic: "الْحَمْدُ لِلَّهِ",
        phonetic: "Al-ḥamdu lillāh",
        translation: "Praise be to Allah",
        translationFr: "Louange à Allah"
      },
      {
        arabic: "اللَّهُ أَكْبَرُ",
        phonetic: "Allāhu akbar",
        translation: "Allah is the Greatest",
        translationFr: "Allah est le Plus Grand"
      }
    ],
    repetitions: 33
  }
];

const eveningAdhkar: Dhikr[] = [
  {
    id: "evening-invocation",
    name: "Invocation du soir",
    nameEn: "Evening Invocation",
    preview: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ...",
    previewEn: "We have reached evening...",
    estimatedTime: "1 min",
    sentences: [
      {
        arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        phonetic: "Amsaynā wa amsā al-mulku lillāh, walḥamdu lillāh, lā ilāha illā Allāhu waḥdahu lā sharīka lah, lahu al-mulk wa lahu al-ḥamd wa huwa 'alā kulli shay'in qadīr",
        translation: "We have reached evening and the sovereignty belongs to Allah, and all praise is due to Allah. There is no god but Allah alone with no partner. To Him belongs the dominion and to Him is all praise, and He has power over all things.",
        translationFr: "Nous voici au soir et le royaume appartient à Allah. Louange à Allah, il n'y a de divinité qu'Allah, Unique, sans associé. À Lui la royauté, à Lui la louange et Il est capable de toute chose."
      }
    ],
    repetitions: 1
  },
  {
    id: "ayat-kursi-evening",
    name: "Ayat al-Kursi",
    nameEn: "Ayat al-Kursi",
    preview: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...",
    previewEn: "Allah! There is no deity except Him...",
    estimatedTime: "1 min",
    sentences: [
      {
        arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ",
        phonetic: "Allāhu lā ilāha illā huwa al-ḥayyu al-qayyūm, lā ta'khudhuhu sinatun wa lā nawm",
        translation: "Allah! There is no deity except Him, the Ever-Living, the Sustainer. Neither drowsiness overtakes Him nor sleep.",
        translationFr: "Allah! Il n'y a de divinité que Lui, le Vivant, Celui qui subsiste par Lui-même. Ni somnolence ni sommeil ne Le saisissent."
      },
      {
        arabic: "لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ",
        phonetic: "Lahu mā fī as-samāwāti wa mā fī al-arḍ, man dhā alladhī yashfa'u 'indahu illā bi-idhnih",
        translation: "To Him belongs whatever is in the heavens and whatever is on earth. Who is it that can intercede with Him except by His permission?",
        translationFr: "À Lui appartient tout ce qui est dans les cieux et sur la terre. Qui peut intercéder auprès de Lui sans Sa permission?"
      },
      {
        arabic: "يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ",
        phonetic: "Ya'lamu mā bayna aydīhim wa mā khalfahum, wa lā yuḥīṭūna bi-shay'in min 'ilmihi illā bimā shā'",
        translation: "He knows what is before them and what is behind them, and they encompass not a thing of His knowledge except what He wills.",
        translationFr: "Il connaît leur passé et leur futur. Et, de Sa science, ils n'embrassent que ce qu'Il veut."
      },
      {
        arabic: "وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
        phonetic: "Wasi'a kursiyyuhu as-samāwāti wa al-arḍ, wa lā ya'ūduhu ḥifẓuhumā, wa huwa al-'aliyyu al-'aẓīm",
        translation: "His Throne extends over the heavens and the earth, and it does not tire Him to preserve them. And He is the Most High, the Most Great.",
        translationFr: "Son Trône déborde les cieux et la terre, dont la garde ne Lui coûte aucune peine. Et Il est le Très Haut, le Très Grand."
      }
    ],
    repetitions: 1
  },
  {
    id: "subhan-allah-evening",
    name: "Tasbih, Tahmid, Takbir",
    nameEn: "Tasbih, Tahmid, Takbir",
    preview: "سُبْحَانَ اللَّهِ، الْحَمْدُ لِلَّهِ، اللَّهُ أَكْبَرُ",
    previewEn: "Glory be to Allah, Praise be to Allah, Allah is the Greatest",
    estimatedTime: "2 min",
    sentences: [
      {
        arabic: "سُبْحَانَ اللَّهِ",
        phonetic: "Subḥāna Allāh",
        translation: "Glory be to Allah",
        translationFr: "Gloire à Allah"
      },
      {
        arabic: "الْحَمْدُ لِلَّهِ",
        phonetic: "Al-ḥamdu lillāh",
        translation: "Praise be to Allah",
        translationFr: "Louange à Allah"
      },
      {
        arabic: "اللَّهُ أَكْبَرُ",
        phonetic: "Allāhu akbar",
        translation: "Allah is the Greatest",
        translationFr: "Allah est le Plus Grand"
      }
    ],
    repetitions: 33
  }
];

export const Adhkar = () => {
  const { t, language } = useLanguage();
  const [selectedDhikr, setSelectedDhikr] = useState<Dhikr | null>(null);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"morning" | "evening">("morning");
  const [completedMorning, setCompletedMorning] = useState<Set<string>>(new Set());
  const [completedEvening, setCompletedEvening] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const voicesLoaded = useRef(false);
  const [hasShownMorningCongrats, setHasShownMorningCongrats] = useState(false);
  const [hasShownEveningCongrats, setHasShownEveningCongrats] = useState(false);

  // Load voices when available
  useEffect(() => {
    if ('speechSynthesis' in window && !voicesLoaded.current) {
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
        voicesLoaded.current = true;
      };

      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  // Load completion status from localStorage
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const stored = localStorage.getItem(`adhkar-${today}`);
    if (stored) {
      const data = JSON.parse(stored);
      if (data.morning) setCompletedMorning(new Set(data.morning));
      if (data.evening) setCompletedEvening(new Set(data.evening));
    }
  }, []);

  const handleDhikrClick = (dhikr: Dhikr, type: "morning" | "evening") => {
    setSelectedDhikr(dhikr);
    setCurrentSentence(0);
    setActiveTab(type);
    setDialogOpen(true);
  };

  const markAsComplete = () => {
    if (!selectedDhikr) return;

    const today = new Date().toISOString().split("T")[0];
    const newCompleted = activeTab === "morning" 
      ? new Set([...completedMorning, selectedDhikr.id])
      : new Set([...completedEvening, selectedDhikr.id]);

    if (activeTab === "morning") {
      setCompletedMorning(newCompleted);
    } else {
      setCompletedEvening(newCompleted);
    }

    const stored = localStorage.getItem(`adhkar-${today}`);
    const data = stored ? JSON.parse(stored) : { morning: [], evening: [] };
    data[activeTab] = Array.from(newCompleted);
    localStorage.setItem(`adhkar-${today}`, JSON.stringify(data));

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

  const getTotalTime = (dhikrList: Dhikr[]) => {
    let totalMinutes = 0;
    dhikrList.forEach((dhikr) => {
      const time = dhikr.estimatedTime;
      if (time.includes("min")) {
        totalMinutes += parseInt(time);
      } else if (time.includes("sec")) {
        totalMinutes += 0.5;
      }
    });
    return Math.ceil(totalMinutes);
  };

  const playAudio = (text: string) => {
    if (!('speechSynthesis' in window)) {
      return;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    setIsPlaying(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.7;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(voice => 
      voice.lang.startsWith('ar') || voice.lang.includes('ar-SA')
    );
    
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }
    
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => {
      setIsPlaying(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const allMorningCompleted = morningAdhkar.every(d => completedMorning.has(d.id));
  const allEveningCompleted = eveningAdhkar.every(d => completedEvening.has(d.id));

  // Check for completion and show congratulation animation
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const congratsKey = `adhkar-congrats-${today}`;
    const stored = localStorage.getItem(congratsKey);
    const data = stored ? JSON.parse(stored) : { morning: false, evening: false };
    
    if (allMorningCompleted && morningAdhkar.length > 0 && !data.morning) {
      toast.success("🎉 Masha'Allah ! Vous avez complété tous les adhkar du matin !", {
        duration: 5000,
        icon: <Sparkles className="w-5 h-5 text-yellow-500" />,
        className: "animate-scale-in",
      });
      data.morning = true;
      localStorage.setItem(congratsKey, JSON.stringify(data));
    }

    if (allEveningCompleted && eveningAdhkar.length > 0 && !data.evening) {
      toast.success("🎉 Masha'Allah ! Vous avez complété tous les adhkar du soir !", {
        duration: 5000,
        icon: <Sparkles className="w-5 h-5 text-yellow-500" />,
        className: "animate-scale-in",
      });
      data.evening = true;
      localStorage.setItem(congratsKey, JSON.stringify(data));
    }
  }, [allMorningCompleted, allEveningCompleted]);

  const renderDhikrList = (dhikrList: Dhikr[], type: "morning" | "evening") => {
    const completed = type === "morning" ? completedMorning : completedEvening;

    return (
      <div className="space-y-3">
        {dhikrList.map((dhikr) => {
          const isCompleted = completed.has(dhikr.id);
          return (
            <Card
              key={dhikr.id}
              className={`p-3 sm:p-4 cursor-pointer hover:shadow-lg transition-all ${
                isCompleted ? "bg-success/10 border-success" : ""
              }`}
              onClick={() => handleDhikrClick(dhikr, type)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm sm:text-base font-semibold text-foreground">
                      {language === "fr" ? dhikr.name : dhikr.nameEn}
                    </h4>
                    {isCompleted && (
                      <Badge className="bg-success text-success-foreground text-xs">
                        <Check className="w-3 h-3" />
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {language === "fr" ? dhikr.preview : dhikr.previewEn}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ⏱ {dhikr.estimatedTime}
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
    <div className="space-y-4 sm:space-y-6">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "morning" | "evening")} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 h-auto p-1">
          <TabsTrigger value="morning" className="flex items-center justify-start gap-2 py-3 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <span className="text-lg sm:text-xl shrink-0">☀️</span>
            <div className="flex flex-col items-start flex-1 min-w-0">
              <span className="text-xs sm:text-sm font-medium truncate w-full">{t.morningAdhkar}</span>
              <span className="text-[10px] sm:text-xs opacity-70">
                ~{getTotalTime(morningAdhkar)} min
              </span>
            </div>
            {allMorningCompleted && (
              <CheckCircle className="w-4 h-4 shrink-0 text-success" />
            )}
          </TabsTrigger>
          <TabsTrigger value="evening" className="flex items-center justify-start gap-2 py-3 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <span className="text-lg sm:text-xl shrink-0">🌙</span>
            <div className="flex flex-col items-start flex-1 min-w-0">
              <span className="text-xs sm:text-sm font-medium truncate w-full">{t.eveningAdhkar}</span>
              <span className="text-[10px] sm:text-xs opacity-70">
                ~{getTotalTime(eveningAdhkar)} min
              </span>
            </div>
            {allEveningCompleted && (
              <CheckCircle className="w-4 h-4 shrink-0 text-success" />
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="morning">
          {renderDhikrList(morningAdhkar, "morning")}
        </TabsContent>

        <TabsContent value="evening">
          {renderDhikrList(eveningAdhkar, "evening")}
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              {selectedDhikr && (language === "fr" ? selectedDhikr.name : selectedDhikr.nameEn)}
            </DialogTitle>
          </DialogHeader>

          {selectedDhikr && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{selectedDhikr.estimatedTime}</span>
                </div>
                <span>
                  {currentSentence + 1} / {selectedDhikr.sentences.length}
                </span>
              </div>

              <div className="space-y-4 p-4 sm:p-6 bg-muted/30 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-arabic leading-loose text-foreground mb-4">
                    {selectedDhikr.sentences[currentSentence].arabic}
                  </p>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (isPlaying) {
                        stopAudio();
                      } else {
                        playAudio(selectedDhikr.sentences[currentSentence].arabic);
                      }
                    }}
                    className="mb-4"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 mr-2" />
                        Écouter
                      </>
                    )}
                  </Button>

                  <p className="text-sm sm:text-base text-muted-foreground italic mb-3">
                    {selectedDhikr.sentences[currentSentence].phonetic}
                  </p>
                  <p className="text-sm sm:text-base text-foreground">
                    {language === "fr" 
                      ? selectedDhikr.sentences[currentSentence].translationFr
                      : selectedDhikr.sentences[currentSentence].translation}
                  </p>
                </div>

                {selectedDhikr.repetitions > 1 && (
                  <div className="text-center text-sm text-muted-foreground">
                    {language === "fr" ? "À répéter" : "Repeat"} {selectedDhikr.repetitions}x
                  </div>
                )}
              </div>

              <div className="flex justify-between gap-2">
                <Button
                  variant="outline"
                  onClick={prevSentence}
                  disabled={currentSentence === 0}
                  className="flex-1"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  {language === "fr" ? "Précédent" : "Previous"}
                </Button>
                <Button
                  variant="outline"
                  onClick={nextSentence}
                  disabled={currentSentence === selectedDhikr.sentences.length - 1}
                  className="flex-1"
                >
                  {language === "fr" ? "Suivant" : "Next"}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {currentSentence === selectedDhikr.sentences.length - 1 && (
                <Button 
                  onClick={markAsComplete} 
                  className="w-full"
                  size="lg"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {language === "fr" ? "Marquer comme terminé" : "Mark as completed"}
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
