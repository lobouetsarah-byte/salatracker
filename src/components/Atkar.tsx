import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sunrise, Sunset, Volume2 } from "lucide-react";

interface Dhikr {
  id: string;
  text: string;
  translation: string;
  translationFr: string;
  phonetic: string;
  count: number;
  audioUrl?: string;
}

const morningAtkar: Dhikr[] = [
  {
    id: "ayat-kursi",
    text: "آية الكرسي",
    translation: "Ayat Al-Kursi (The Throne Verse)",
    translationFr: "Ayat Al-Kursi (Le verset du Trône)",
    phonetic: "Allāhu lā ilāha illā huwa al-ḥayyu al-qayyūm...",
    count: 1,
  },
  {
    id: "qul-huwa",
    text: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
    translation: "Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent.",
    translationFr: "Dis : Il est Allah, Unique. Allah, Le Seul à être imploré. Il n'a jamais engendré, n'a pas été engendré non plus. Et nul n'est égal à Lui.",
    phonetic: "Qul huwa Allāhu aḥad. Allāhu ṣ-ṣamad. Lam yalid wa lam yūlad. Wa lam yakun lahu kufuwan aḥad.",
    count: 3,
  },
  {
    id: "qul-aodhu-falaq",
    text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    translation: "Say: I seek refuge in the Lord of daybreak from the evil of that which He created, and from the evil of darkness when it settles, and from the evil of the blowers in knots, and from the evil of an envier when he envies.",
    translationFr: "Dis : Je cherche protection auprès du Seigneur de l'aube naissante, contre le mal des êtres qu'Il a créés, contre le mal de l'obscurité quand elle s'approfondit, contre le mal de celles qui soufflent sur les nœuds, et contre le mal de l'envieux quand il envie.",
    phonetic: "Qul aʿūdhu bi-rabbi al-falaq. Min sharri mā khalaq. Wa min sharri ghāsiqin idhā waqab. Wa min sharri n-naffāthāti fī al-ʿuqad. Wa min sharri ḥāsidin idhā ḥasad.",
    count: 3,
  },
  {
    id: "qul-aodhu-nas",
    text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ",
    translation: "Say: I seek refuge in the Lord of mankind, the Sovereign of mankind, the God of mankind, from the evil of the retreating whisperer who whispers into the hearts of mankind, from among the jinn and mankind.",
    translationFr: "Dis : Je cherche protection auprès du Seigneur des hommes, le Souverain des hommes, la Divinité des hommes, contre le mal du mauvais conseiller, furtif, qui souffle le mal dans les poitrines des hommes, qu'il soit djinn ou être humain.",
    phonetic: "Qul aʿūdhu bi-rabbi n-nās. Maliki n-nās. Ilāhi n-nās. Min sharri al-waswāsi al-khannās. Alladhī yuwaswisu fī ṣudūri n-nās. Mina al-jinnati wa n-nās.",
    count: 3,
  },
  {
    id: "morning-dua",
    text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ",
    translation: "We have entered a new day and the dominion belongs to Allah, and all praise is due to Allah",
    translationFr: "Nous voici au matin et le royaume appartient à Allah, et la louange est à Allah",
    phonetic: "Aṣbaḥnā wa aṣbaḥa al-mulku lillāh, wa al-ḥamdu lillāh",
    count: 1,
  },
];

const eveningAtkar: Dhikr[] = [
  {
    id: "ayat-kursi-eve",
    text: "آية الكرسي",
    translation: "Ayat Al-Kursi (The Throne Verse)",
    translationFr: "Ayat Al-Kursi (Le verset du Trône)",
    phonetic: "Allāhu lā ilāha illā huwa al-ḥayyu al-qayyūm...",
    count: 1,
  },
  {
    id: "qul-huwa-eve",
    text: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
    translation: "Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent.",
    translationFr: "Dis : Il est Allah, Unique. Allah, Le Seul à être imploré. Il n'a jamais engendré, n'a pas été engendré non plus. Et nul n'est égal à Lui.",
    phonetic: "Qul huwa Allāhu aḥad. Allāhu ṣ-ṣamad. Lam yalid wa lam yūlad. Wa lam yakun lahu kufuwan aḥad.",
    count: 3,
  },
  {
    id: "qul-aodhu-falaq-eve",
    text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    translation: "Say: I seek refuge in the Lord of daybreak from the evil of that which He created, and from the evil of darkness when it settles, and from the evil of the blowers in knots, and from the evil of an envier when he envies.",
    translationFr: "Dis : Je cherche protection auprès du Seigneur de l'aube naissante, contre le mal des êtres qu'Il a créés, contre le mal de l'obscurité quand elle s'approfondit, contre le mal de celles qui soufflent sur les nœuds, et contre le mal de l'envieux quand il envie.",
    phonetic: "Qul aʿūdhu bi-rabbi al-falaq. Min sharri mā khalaq. Wa min sharri ghāsiqin idhā waqab. Wa min sharri n-naffāthāti fī al-ʿuqad. Wa min sharri ḥāsidin idhā ḥasad.",
    count: 3,
  },
  {
    id: "qul-aodhu-nas-eve",
    text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ",
    translation: "Say: I seek refuge in the Lord of mankind, the Sovereign of mankind, the God of mankind, from the evil of the retreating whisperer who whispers into the hearts of mankind, from among the jinn and mankind.",
    translationFr: "Dis : Je cherche protection auprès du Seigneur des hommes, le Souverain des hommes, la Divinité des hommes, contre le mal du mauvais conseiller, furtif, qui souffle le mal dans les poitrines des hommes, qu'il soit djinn ou être humain.",
    phonetic: "Qul aʿūdhu bi-rabbi n-nās. Maliki n-nās. Ilāhi n-nās. Min sharri al-waswāsi al-khannās. Alladhī yuwaswisu fī ṣudūri n-nās. Mina al-jinnati wa n-nās.",
    count: 3,
  },
  {
    id: "evening-dua",
    text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ",
    translation: "We have entered the evening and the dominion belongs to Allah, and all praise is due to Allah",
    translationFr: "Nous voici au soir et le royaume appartient à Allah, et la louange est à Allah",
    phonetic: "Amsaynā wa amsā al-mulku lillāh, wa al-ḥamdu lillāh",
    count: 1,
  },
];

export const Atkar = () => {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [selectedDhikr, setSelectedDhikr] = useState<Dhikr | null>(null);
  const [language, setLanguage] = useState<'en' | 'fr'>('en');
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const toggleComplete = (id: string) => {
    const newCompleted = new Set(completed);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompleted(newCompleted);
  };

  const playAudio = (dhikr: Dhikr) => {
    if (audio) {
      audio.pause();
    }
    
    if (dhikr.audioUrl) {
      const newAudio = new Audio(dhikr.audioUrl);
      newAudio.play();
      setAudio(newAudio);
    }
  };

  const renderDhikrList = (dhikrList: Dhikr[]) => (
    <div className="space-y-4">
      {dhikrList.map((dhikr) => (
        <Card key={dhikr.id} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id={dhikr.id}
                checked={completed.has(dhikr.id)}
                onCheckedChange={() => toggleComplete(dhikr.id)}
                className="mt-1"
                onClick={(e) => e.stopPropagation()}
              />
              <div 
                className="flex-1 space-y-1"
                onClick={() => setSelectedDhikr(dhikr)}
              >
                <p className="text-xl font-arabic text-right leading-relaxed">
                  {dhikr.text}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'en' ? dhikr.translation : dhikr.translationFr}
                </p>
                {dhikr.count > 1 && (
                  <p className="text-xs text-muted-foreground">
                    {language === 'en' ? `Repeat ${dhikr.count}x` : `Répéter ${dhikr.count}x`}
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
      <div className="flex justify-end gap-2 mb-4">
        <Button
          variant={language === 'en' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setLanguage('en')}
        >
          English
        </Button>
        <Button
          variant={language === 'fr' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setLanguage('fr')}
        >
          Français
        </Button>
      </div>

      <Tabs defaultValue="morning" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="morning" className="flex items-center gap-2">
            <Sunrise className="w-4 h-4" />
            {language === 'en' ? 'Morning' : 'Matin'}
          </TabsTrigger>
          <TabsTrigger value="evening" className="flex items-center gap-2">
            <Sunset className="w-4 h-4" />
            {language === 'en' ? 'Evening' : 'Soir'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="morning" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sunrise className="w-5 h-5" />
                {language === 'en' ? 'Morning Atkar' : 'Atkar du Matin'}
              </CardTitle>
              <CardDescription>
                {language === 'en' 
                  ? 'Recommended to recite after Fajr prayer until sunrise'
                  : 'Recommandé de réciter après la prière du Fajr jusqu\'au lever du soleil'}
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
                {language === 'en' ? 'Evening Atkar' : 'Atkar du Soir'}
              </CardTitle>
              <CardDescription>
                {language === 'en'
                  ? 'Recommended to recite after Asr prayer until sunset'
                  : 'Recommandé de réciter après la prière du Asr jusqu\'au coucher du soleil'}
              </CardDescription>
            </CardHeader>
          </Card>
          {renderDhikrList(eveningAtkar)}
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedDhikr} onOpenChange={() => setSelectedDhikr(null)}>
        <DialogContent className="max-w-2xl">
          {selectedDhikr && (
            <>
              <DialogHeader>
                <DialogTitle className="text-center">
                  {language === 'en' ? 'Dhikr Details' : 'Détails du Dhikr'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="text-center">
                  <p className="text-3xl font-arabic text-right leading-relaxed mb-2">
                    {selectedDhikr.text}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground">
                    {language === 'en' ? 'Phonetic:' : 'Phonétique:'}
                  </h4>
                  <p className="text-lg italic leading-relaxed">
                    {selectedDhikr.phonetic}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground">
                    {language === 'en' ? 'Translation:' : 'Traduction:'}
                  </h4>
                  <p className="text-base leading-relaxed">
                    {language === 'en' ? selectedDhikr.translation : selectedDhikr.translationFr}
                  </p>
                </div>

                {selectedDhikr.count > 1 && (
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">
                      {language === 'en' 
                        ? `Repeat ${selectedDhikr.count} times`
                        : `Répéter ${selectedDhikr.count} fois`}
                    </p>
                  </div>
                )}

                {selectedDhikr.audioUrl && (
                  <Button 
                    onClick={() => playAudio(selectedDhikr)}
                    className="w-full"
                    size="lg"
                  >
                    <Volume2 className="w-5 h-5 mr-2" />
                    {language === 'en' ? 'Play Audio' : 'Écouter l\'audio'}
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
