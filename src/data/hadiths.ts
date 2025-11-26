export interface Hadith {
  id: number;
  arabic: string;
  french: string;
  reference: string;
}

export const LOCAL_HADITHS: Hadith[] = [
  {
    id: 1,
    arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    french: "Les actes ne valent que par les intentions, et chaque homme n'a que ce qu'il a eu réellement l'intention de faire.",
    reference: "Sahih Bukhari & Muslim"
  },
  {
    id: 2,
    arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    french: "Que celui qui croit en Allah et au Jour Dernier dise du bien ou qu'il se taise.",
    reference: "Sahih Bukhari & Muslim"
  },
  {
    id: 3,
    arabic: "الدِّينُ النَّصِيحَةُ",
    french: "La religion, c'est la sincérité et le bon conseil.",
    reference: "Sahih Muslim"
  },
  {
    id: 4,
    arabic: "مَنْ حُسْنِ إِسْلَامِ الْمَرْءِ تَرْكُهُ مَا لَا يَعْنِيهِ",
    french: "Parmi les qualités d'un bon musulman, il y a le fait de délaisser ce qui ne le regarde pas.",
    reference: "Tirmidhi"
  },
  {
    id: 5,
    arabic: "الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا",
    french: "Le croyant est pour le croyant comme un édifice dont les parties se soutiennent mutuellement.",
    reference: "Sahih Bukhari & Muslim"
  },
  {
    id: 6,
    arabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    french: "Aucun d'entre vous ne sera véritablement croyant tant qu'il n'aimera pas pour son frère ce qu'il aime pour lui-même.",
    reference: "Sahih Bukhari & Muslim"
  },
  {
    id: 7,
    arabic: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    french: "Le musulman est celui dont les musulmans sont à l'abri de la langue et de la main.",
    reference: "Sahih Bukhari & Muslim"
  },
  {
    id: 8,
    arabic: "خَيْرُكُمْ خَيْرُكُمْ لِأَهْلِهِ",
    french: "Le meilleur d'entre vous est le meilleur envers sa famille.",
    reference: "Tirmidhi"
  },
  {
    id: 9,
    arabic: "الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ",
    french: "La bonne parole est une aumône.",
    reference: "Sahih Bukhari & Muslim"
  },
  {
    id: 10,
    arabic: "مَنْ صَلَّى الْبَرْدَيْنِ دَخَلَ الْجَنَّةَ",
    french: "Celui qui accomplit les deux prières froides (Fajr et Asr) entrera au Paradis.",
    reference: "Sahih Bukhari"
  },
  {
    id: 11,
    arabic: "صَلَاةُ الْجَمَاعَةِ أَفْضَلُ مِنْ صَلَاةِ الْفَذِّ بِسَبْعٍ وَعِشْرِينَ دَرَجَةً",
    french: "La prière en groupe est supérieure de vingt-sept degrés à la prière individuelle.",
    reference: "Sahih Bukhari & Muslim"
  },
  {
    id: 12,
    arabic: "مَنْ قَالَ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، دَخَلَ الْجَنَّةَ",
    french: "Celui qui dit 'Il n'y a de divinité qu'Allah, Unique, sans associé' entrera au Paradis.",
    reference: "Sahih Muslim"
  },
  {
    id: 13,
    arabic: "الصَّلَوَاتُ الْخَمْسُ، وَالْجُمُعَةُ إِلَى الْجُمُعَةِ، كَفَّارَةٌ لِمَا بَيْنَهُنَّ",
    french: "Les cinq prières et la prière du vendredi expient les péchés commis entre elles.",
    reference: "Sahih Muslim"
  },
  {
    id: 14,
    arabic: "أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ",
    french: "Les œuvres les plus aimées d'Allah sont celles qui sont les plus régulières, même si elles sont peu nombreuses.",
    reference: "Sahih Bukhari & Muslim"
  },
  {
    id: 15,
    arabic: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ",
    french: "Ton sourire au visage de ton frère est une aumône.",
    reference: "Tirmidhi"
  },
  {
    id: 16,
    arabic: "الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ",
    french: "Le croyant fort est meilleur et plus aimé d'Allah que le croyant faible.",
    reference: "Sahih Muslim"
  },
  {
    id: 17,
    arabic: "مَنْ حَافَظَ عَلَى الصَّلَوَاتِ الْخَمْسِ كَانَتْ لَهُ نُورًا وَبُرْهَانًا وَنَجَاةً يَوْمَ الْقِيَامَةِ",
    french: "Celui qui préserve les cinq prières aura lumière, preuve et salut le Jour de la Résurrection.",
    reference: "Ahmad"
  },
  {
    id: 18,
    arabic: "الصَّبْرُ ضِيَاءٌ",
    french: "La patience est lumière.",
    reference: "Sahih Muslim"
  },
  {
    id: 19,
    arabic: "لَا تَحْقِرَنَّ مِنَ الْمَعْرُوفِ شَيْئًا",
    french: "Ne sous-estime aucune bonne action.",
    reference: "Sahih Muslim"
  },
  {
    id: 20,
    arabic: "إِنَّ اللَّهَ طَيِّبٌ لَا يَقْبَلُ إِلَّا طَيِّبًا",
    french: "Allah est Bon et n'accepte que ce qui est bon.",
    reference: "Sahih Muslim"
  },
  {
    id: 21,
    arabic: "مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ",
    french: "Celui qui jeûne le Ramadan avec foi et espoir de récompense, ses péchés passés lui seront pardonnés.",
    reference: "Sahih Bukhari & Muslim"
  },
  {
    id: 22,
    arabic: "الطُّهُورُ شَطْرُ الْإِيمَانِ",
    french: "La purification est la moitié de la foi.",
    reference: "Sahih Muslim"
  },
  {
    id: 23,
    arabic: "اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ",
    french: "Crains Allah où que tu sois.",
    reference: "Tirmidhi"
  },
  {
    id: 24,
    arabic: "مَنْ دَعَا إِلَى هُدًى كَانَ لَهُ مِنَ الْأَجْرِ مِثْلُ أُجُورِ مَنْ تَبِعَهُ",
    french: "Celui qui appelle à une bonne guidée aura une récompense égale à celle de ceux qui le suivent.",
    reference: "Sahih Muslim"
  },
  {
    id: 25,
    arabic: "الْجَنَّةُ تَحْتَ أَقْدَامِ الْأُمَّهَاتِ",
    french: "Le Paradis se trouve sous les pieds des mères.",
    reference: "Ahmad & Nasai"
  },
  {
    id: 26,
    arabic: "بَيْنَ الرَّجُلِ وَبَيْنَ الْكُفْرِ تَرْكُ الصَّلَاةِ",
    french: "Entre l'homme et la mécréance, il y a l'abandon de la prière.",
    reference: "Sahih Muslim"
  },
  {
    id: 27,
    arabic: "الْحَيَاءُ شُعْبَةٌ مِنَ الْإِيمَانِ",
    french: "La pudeur fait partie de la foi.",
    reference: "Sahih Bukhari & Muslim"
  },
  {
    id: 28,
    arabic: "أَلَا أُنَبِّئُكُمْ بِخَيْرِ أَعْمَالِكُمْ؟ ذِكْرُ اللَّهِ",
    french: "Ne vous informerai-je pas de vos meilleures œuvres ? L'invocation d'Allah.",
    reference: "Tirmidhi"
  },
  {
    id: 29,
    arabic: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ",
    french: "Celui qui emprunte un chemin pour y chercher la science, Allah lui facilitera un chemin vers le Paradis.",
    reference: "Sahih Muslim"
  },
  {
    id: 30,
    arabic: "الْإِيمَانُ بِضْعٌ وَسَبْعُونَ شُعْبَةً",
    french: "La foi comporte soixante-dix et quelques branches.",
    reference: "Sahih Bukhari & Muslim"
  }
];

export function getHadithOfTheDay(): Hadith {
  try {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const index = dayOfYear % LOCAL_HADITHS.length;
    return LOCAL_HADITHS[index];
  } catch (error) {
    console.error('Error getting hadith of the day:', error);
    return LOCAL_HADITHS[0];
  }
}
