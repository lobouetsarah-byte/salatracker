import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface Sentence {
  arabic: string;
  phonetic: string;
  translation: string;
  translationFr: string;
  audioUrl?: string;
}

interface Dhikr {
  title: string;
  titleFr: string;
  sentences: Sentence[];
  completed: boolean;
}

export const Atkar = () => {
  const { language, t } = useLanguage();
  const [selectedDhikr, setSelectedDhikr] = useState<Dhikr | null>(null);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const morningAtkar: Dhikr[] = [
    {
      title: "Ayat Al-Kursi",
      titleFr: "Ayat Al-Kursi",
      sentences: [
        {
          arabic: "ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ",
          phonetic: "Allāhu lā ilāha illā huwa al-ḥayyu al-qayyūm",
          translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer",
          translationFr: "Allah - il n'y a de divinité que Lui, le Vivant, Celui qui subsiste par Lui-même",
        },
        {
          arabic: "لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ",
          phonetic: "lā ta'khudhuhū sinatun wa lā nawm",
          translation: "Neither drowsiness overtakes Him nor sleep",
          translationFr: "Ni somnolence ni sommeil ne Le saisissent",
        },
        {
          arabic: "لَّهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ",
          phonetic: "lahū mā fī as-samāwāti wa mā fī al-arḍ",
          translation: "To Him belongs whatever is in the heavens and whatever is on the earth",
          translationFr: "À Lui appartient tout ce qui est dans les cieux et sur la terre",
        },
      ],
      completed: false,
    },
    {
      title: "Al-Ikhlas, Al-Falaq, An-Nas",
      titleFr: "Sourate Al-Ikhlas, Al-Falaq, An-Nas",
      sentences: [
        {
          arabic: "قُلْ هُوَ ٱللَّهُ أَحَدٌ",
          phonetic: "Qul huwa Allāhu aḥad",
          translation: "Say, He is Allah, [who is] One",
          translationFr: "Dis : Il est Allah, Unique",
        },
        {
          arabic: "ٱللَّهُ ٱلصَّمَدُ",
          phonetic: "Allāhu aṣ-ṣamad",
          translation: "Allah, the Eternal Refuge",
          translationFr: "Allah, Le Seul à être imploré pour ce que nous désirons",
        },
        {
          arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
          phonetic: "lam yalid wa lam yūlad",
          translation: "He neither begets nor is born",
          translationFr: "Il n'a jamais engendré, n'a pas été engendré",
        },
        {
          arabic: "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ",
          phonetic: "wa lam yakun lahū kufuwan aḥad",
          translation: "Nor is there to Him any equivalent",
          translationFr: "Et nul n'est égal à Lui",
        },
      ],
      completed: false,
    },
    {
      title: "Morning Dhikr",
      titleFr: "Dhikr du matin",
      sentences: [
        {
          arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ",
          phonetic: "Aṣbaḥnā wa aṣbaḥa al-mulku lillāh",
          translation: "We have entered morning and the dominion belongs to Allah",
          translationFr: "Nous voici au matin et la royauté appartient à Allah",
        },
      ],
      completed: false,
    },
  ];

  const eveningAtkar: Dhikr[] = [
    {
      title: "Evening Dhikr",
      titleFr: "Dhikr du soir",
      sentences: [
        {
          arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ",
          phonetic: "Amsaynā wa amsā al-mulku lillāh",
          translation: "We have entered evening and the dominion belongs to Allah",
          translationFr: "Nous voici au soir et la royauté appartient à Allah",
        },
      ],
      completed: false,
    },
    {
      title: "Protection Dhikr",
      titleFr: "Dhikr de protection",
      sentences: [
        {
          arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ",
          phonetic: "Bismillāhi alladhī lā yaḍurru ma'a ismihi shay'un fī al-arḍi wa lā fī as-samā'",
          translation: "In the name of Allah with whose name nothing can harm in the earth nor in the heavens",
          translationFr: "Au nom d'Allah avec le nom duquel rien sur terre ni au ciel ne peut nuire",
        },
        {
          arabic: "وَهُوَ السَّمِيعُ الْعَلِيمُ",
          phonetic: "wa huwa as-samī'u al-'alīm",
          translation: "And He is the All-Hearing, the All-Knowing",
          translationFr: "Et Il est l'Audient, l'Omniscient",
        },
      ],
      completed: false,
    },
  ];

  const handleDhikrClick = (dhikr: Dhikr) => {
    setSelectedDhikr(dhikr);
    setCurrentSentence(0);
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (selectedDhikr && currentSentence < selectedDhikr.sentences.length - 1) {
      setCurrentSentence(currentSentence + 1);
      setIsPlaying(false);
    }
  };

  const handlePrevious = () => {
    if (currentSentence > 0) {
      setCurrentSentence(currentSentence - 1);
      setIsPlaying(false);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const renderDhikrList = (dhikrList: Dhikr[]) => (
    <div className="space-y-3">
      {dhikrList.map((dhikr, index) => (
        <Card
          key={index}
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => handleDhikrClick(dhikr)}
        >
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-1">
              {language === "fr" ? dhikr.titleFr : dhikr.title}
            </h3>
            <p className="text-sm text-muted-foreground font-arabic text-right">
              {dhikr.sentences[0].arabic}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <Tabs defaultValue="morning" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="morning">{t.morningAtkar}</TabsTrigger>
          <TabsTrigger value="evening">{t.eveningAtkar}</TabsTrigger>
        </TabsList>

        <TabsContent value="morning">
          {renderDhikrList(morningAtkar)}
        </TabsContent>

        <TabsContent value="evening">
          {renderDhikrList(eveningAtkar)}
        </TabsContent>
      </Tabs>

      {/* Dhikr Detail Dialog */}
      <Dialog open={selectedDhikr !== null} onOpenChange={() => setSelectedDhikr(null)}>
        <DialogContent className="max-w-2xl">
          {selectedDhikr && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {language === "fr" ? selectedDhikr.titleFr : selectedDhikr.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Arabic Text */}
                <div className="text-center">
                  <p className="text-3xl font-arabic leading-loose text-foreground">
                    {selectedDhikr.sentences[currentSentence].arabic}
                  </p>
                </div>

                {/* Phonetic */}
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-semibold text-muted-foreground mb-1">
                    {language === "fr" ? "Phonétique" : "Phonetic"}
                  </p>
                  <p className="text-lg italic">
                    {selectedDhikr.sentences[currentSentence].phonetic}
                  </p>
                </div>

                {/* Translation */}
                <div className="bg-primary/5 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-muted-foreground mb-1">
                    {language === "fr" ? "Traduction" : "Translation"}
                  </p>
                  <p className="text-lg">
                    {language === "fr"
                      ? selectedDhikr.sentences[currentSentence].translationFr
                      : selectedDhikr.sentences[currentSentence].translation}
                  </p>
                </div>

                {/* Audio Player */}
                {selectedDhikr.sentences[currentSentence].audioUrl && (
                  <div className="flex justify-center">
                    <Button onClick={toggleAudio} variant="outline" size="lg">
                      {isPlaying ? (
                        <>
                          <Pause className="w-5 h-5 mr-2" />
                          {language === "fr" ? "Pause" : "Pause"}
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5 mr-2" />
                          {language === "fr" ? "Écouter" : "Play"}
                        </>
                      )}
                    </Button>
                    <audio
                      ref={audioRef}
                      src={selectedDhikr.sentences[currentSentence].audioUrl}
                      onEnded={() => setIsPlaying(false)}
                    />
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentSentence === 0}
                    variant="outline"
                  >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    {language === "fr" ? "Précédent" : "Previous"}
                  </Button>

                  <span className="text-sm text-muted-foreground">
                    {currentSentence + 1} / {selectedDhikr.sentences.length}
                  </span>

                  <Button
                    onClick={handleNext}
                    disabled={currentSentence === selectedDhikr.sentences.length - 1}
                    variant="outline"
                  >
                    {language === "fr" ? "Suivant" : "Next"}
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
