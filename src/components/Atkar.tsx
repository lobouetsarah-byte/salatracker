import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/useLanguage";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Clock, CheckCircle, Check, Volume2, Pause } from "lucide-react";

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

const morningAtkar: Dhikr[] = [
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
        arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
        phonetic: "Allāhu lā ilāha illā huwa al-ḥayyu al-qayyūm, lā ta'khudhuhu sinatun wa lā nawm, lahu mā fī as-samāwāti wa mā fī al-arḍ...",
        translation: "Allah! There is no deity except Him, the Ever-Living, the Sustainer. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on earth...",
        translationFr: "Allah! Il n'y a de divinité que Lui, le Vivant, Celui qui subsiste par Lui-même. Ni somnolence ni sommeil ne Le saisissent. À Lui appartient tout ce qui est dans les cieux et sur la terre..."
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
    estimatedTime: "30 sec",
    sentences: [
      {
        arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
        phonetic: "Qul huwa Allāhu aḥad, Allāhu aṣ-ṣamad, lam yalid wa lam yūlad, wa lam yakun lahu kufuwan aḥad",
        translation: "Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent.",
        translationFr: "Dis : Il est Allah, Unique. Allah, Le Seul à être imploré. Il n'a jamais engendré, n'a pas été engendré, et nul n'est égal à Lui."
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
    estimatedTime: "30 sec",
    sentences: [
      {
        arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ، مِن شَرِّ مَا خَلَقَ، وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ، وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ، وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        phonetic: "Qul a'ūdhu bi-rabbi al-falaq, min sharri mā khalaq, wa min sharri ghāsiqin idhā waqab...",
        translation: "Say: I seek refuge in the Lord of daybreak, from the evil of that which He created, and from the evil of darkness when it settles...",
        translationFr: "Dis : Je cherche protection auprès du Seigneur de l'aube, contre le mal des êtres qu'Il a créés, contre le mal de l'obscurité quand elle s'approfondit..."
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
    estimatedTime: "30 sec",
    sentences: [
      {
        arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ، مَلِكِ النَّاسِ، إِلَٰهِ النَّاسِ، مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
        phonetic: "Qul a'ūdhu bi-rabbi an-nās, maliki an-nās, ilāhi an-nās, min sharri al-waswāsi al-khannās",
        translation: "Say: I seek refuge in the Lord of mankind, the Sovereign of mankind, the God of mankind, from the evil of the retreating whisperer.",
        translationFr: "Dis : Je cherche protection auprès du Seigneur des hommes, Le Roi des hommes, Dieu des hommes, contre le mal du mauvais conseiller, furtif."
      }
    ],
    repetitions: 3
  },
  {
    id: "morning-tasbih",
    name: "Tasbih du matin",
    nameEn: "Morning Tasbih",
    preview: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ...",
    previewEn: "Glory be to Allah and praise be to Him...",
    estimatedTime: "2 min",
    sentences: [
      {
        arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ (100 مرة)",
        phonetic: "Subḥāna Allāhi wa biḥamdih (100 fois)",
        translation: "Glory be to Allah and praise be to Him (100 times)",
        translationFr: "Gloire et pureté à Allah et par Sa louange (100 fois)"
      }
    ],
    repetitions: 100
  }
];

const eveningAtkar: Dhikr[] = [
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
        arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
        phonetic: "Allāhu lā ilāha illā huwa al-ḥayyu al-qayyūm, lā ta'khudhuhu sinatun wa lā nawm, lahu mā fī as-samāwāti wa mā fī al-arḍ...",
        translation: "Allah! There is no deity except Him, the Ever-Living, the Sustainer. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on earth...",
        translationFr: "Allah! Il n'y a de divinité que Lui, le Vivant, Celui qui subsiste par Lui-même. Ni somnolence ni sommeil ne Le saisissent. À Lui appartient tout ce qui est dans les cieux et sur la terre..."
      }
    ],
    repetitions: 1
  },
  {
    id: "surah-ikhlas-evening",
    name: "Sourate Al-Ikhlas",
    nameEn: "Surah Al-Ikhlas",
    preview: "قُلْ هُوَ اللَّهُ أَحَدٌ...",
    previewEn: "Say: He is Allah, the One...",
    estimatedTime: "30 sec",
    sentences: [
      {
        arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
        phonetic: "Qul huwa Allāhu aḥad, Allāhu aṣ-ṣamad, lam yalid wa lam yūlad, wa lam yakun lahu kufuwan aḥad",
        translation: "Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent.",
        translationFr: "Dis : Il est Allah, Unique. Allah, Le Seul à être imploré. Il n'a jamais engendré, n'a pas été engendré, et nul n'est égal à Lui."
      }
    ],
    repetitions: 3
  },
  {
    id: "surah-falaq-evening",
    name: "Sourate Al-Falaq",
    nameEn: "Surah Al-Falaq",
    preview: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ...",
    previewEn: "Say: I seek refuge in the Lord of daybreak...",
    estimatedTime: "30 sec",
    sentences: [
      {
        arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ، مِن شَرِّ مَا خَلَقَ، وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ، وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ، وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        phonetic: "Qul a'ūdhu bi-rabbi al-falaq, min sharri mā khalaq, wa min sharri ghāsiqin idhā waqab...",
        translation: "Say: I seek refuge in the Lord of daybreak, from the evil of that which He created, and from the evil of darkness when it settles...",
        translationFr: "Dis : Je cherche protection auprès du Seigneur de l'aube, contre le mal des êtres qu'Il a créés, contre le mal de l'obscurité quand elle s'approfondit..."
      }
    ],
    repetitions: 3
  },
  {
    id: "surah-nas-evening",
    name: "Sourate An-Nas",
    nameEn: "Surah An-Nas",
    preview: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ...",
    previewEn: "Say: I seek refuge in the Lord of mankind...",
    estimatedTime: "30 sec",
    sentences: [
      {
        arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ، مَلِكِ النَّاسِ، إِلَٰهِ النَّاسِ، مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
        phonetic: "Qul a'ūdhu bi-rabbi an-nās, maliki an-nās, ilāhi an-nās, min sharri al-waswāsi al-khannās",
        translation: "Say: I seek refuge in the Lord of mankind, the Sovereign of mankind, the God of mankind, from the evil of the retreating whisperer.",
        translationFr: "Dis : Je cherche protection auprès du Seigneur des hommes, Le Roi des hommes, Dieu des hommes, contre le mal du mauvais conseiller, furtif."
      }
    ],
    repetitions: 3
  },
  {
    id: "evening-tasbih",
    name: "Tasbih du soir",
    nameEn: "Evening Tasbih",
    preview: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ...",
    previewEn: "Glory be to Allah and praise be to Him...",
    estimatedTime: "2 min",
    sentences: [
      {
        arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ (100 مرة)",
        phonetic: "Subḥāna Allāhi wa biḥamdih (100 fois)",
        translation: "Glory be to Allah and praise be to Him (100 times)",
        translationFr: "Gloire et pureté à Allah et par Sa louange (100 fois)"
      }
    ],
    repetitions: 100
  }
];

export const Atkar = () => {
  const { t, language } = useLanguage();
  const [selectedDhikr, setSelectedDhikr] = useState<Dhikr | null>(null);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"morning" | "evening">("morning");
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

  const handleDhikrClick = (dhikr: Dhikr, type: "morning" | "evening") => {
    setSelectedDhikr(dhikr);
    setCurrentSentence(0);
    setActiveTab(type);
    setDialogOpen(true);
  };

  const handleMarkComplete = () => {
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

    const stored = localStorage.getItem(`atkar-${today}`);
    const data = stored ? JSON.parse(stored) : { morning: [], evening: [] };
    data[activeTab] = Array.from(newCompleted);
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

  const allMorningCompleted = morningAtkar.every(d => completedMorning.has(d.id));
  const allEveningCompleted = eveningAtkar.every(d => completedEvening.has(d.id));

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
    <div className="space-y-6 pb-6">
      <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center">
        {language === "fr" ? "Adhkar quotidiens" : "Daily Adhkar"}
      </h2>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "morning" | "evening")} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="morning" className="flex flex-col gap-1">
            <span>{language === "fr" ? "Matin" : "Morning"}</span>
            <div className="flex items-center gap-2">
              {allMorningCompleted && (
                <Badge className="bg-success text-success-foreground text-xs px-1 py-0">
                  <Check className="w-3 h-3" />
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                ~{getTotalTime(morningAtkar)} min
              </span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="evening" className="flex flex-col gap-1">
            <span>{language === "fr" ? "Soir" : "Evening"}</span>
            <div className="flex items-center gap-2">
              {allEveningCompleted && (
                <Badge className="bg-success text-success-foreground text-xs px-1 py-0">
                  <Check className="w-3 h-3" />
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                ~{getTotalTime(eveningAtkar)} min
              </span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="morning">
          {renderDhikrList(morningAtkar, "morning")}
        </TabsContent>

        <TabsContent value="evening">
          {renderDhikrList(eveningAtkar, "evening")}
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl text-center">
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

              {/* Audio button */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2"
                  onClick={() => {
                    const utterance = new SpeechSynthesisUtterance(
                      selectedDhikr.sentences[currentSentence].arabic
                    );
                    utterance.lang = "ar-SA";
                    speechSynthesis.speak(utterance);
                  }}
                >
                  <Volume2 className="w-5 h-5" />
                  {language === "fr" ? "Écouter" : "Listen"}
                </Button>
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

              {/* Mark as complete button */}
              <div className="pt-4">
                <Button
                  onClick={handleMarkComplete}
                  className="w-full bg-success hover:bg-success/90 text-success-foreground"
                  size="lg"
                  disabled={
                    activeTab === "morning"
                      ? completedMorning.has(selectedDhikr.id)
                      : completedEvening.has(selectedDhikr.id)
                  }
                >
                  <Check className="w-5 h-5 mr-2" />
                  {activeTab === "morning"
                    ? completedMorning.has(selectedDhikr.id)
                      ? (language === "fr" ? "✓ Déjà fait" : "✓ Already done")
                      : (language === "fr" ? "Marquer comme fait (Matin)" : "Mark as done (Morning)")
                    : completedEvening.has(selectedDhikr.id)
                      ? (language === "fr" ? "✓ Déjà fait" : "✓ Already done")
                      : (language === "fr" ? "Marquer comme fait (Soir)" : "Mark as done (Evening)")}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
