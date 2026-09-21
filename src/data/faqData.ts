export interface FAQItem {
  id: string;
  category: 'admissions' | 'academics' | 'campus' | 'general';
  question: {
    en: string;
    am: string;
    om: string;
  };
  answer: {
    en: string;
    am: string;
    om: string;
  };
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'admissions',
    question: {
      en: "What grade levels are offered at Albright Academy?",
      am: "በአልብራይት አካዳሚ ምን ምን የትምህርት ክፍሎች ይሰጣሉ?",
      om: "Albright Academy kutaalee barnootaa akkamii kenna?",
    },
    answer: {
      en: "Albright Academy currently welcomes scholars from Early Childhood (KG1 and KG2), Primary School (Grades 1 through 4), and Junior Secondary School (Grades 5 through 8).",
      am: "የአልብራይት አካዳሚ በአሁኑ ወቅት ከቅድመ-መደበኛ (ኬጂ1 እና ኬጂ2)፣ ከመጀመሪያ ደረጃ (ከ1ኛ እስከ 4ኛ ክፍል) እና ከመካከለኛ ደረጃ (ከ5ኛ እስከ 8ኛ ክፍል) ተማሪዎችን ተቀብሎ ያስተምራል።",
      om: "Albright Academy yeroo ammaa kanatti daa'imman barnoota duraa (KG1 fi KG2), sadarkaa 1ffaa (Kutaa 1 hanga 4) fi sadarkaa giddu-galeessaa (Kutaa 5 hanga 8) simatee barsiisa.",
    },
  },
  {
    id: 'faq-2',
    category: 'academics',
    question: {
      en: "What curriculum and teaching methodology does the academy follow?",
      am: "ትምህርት ቤቱ ምን አይነት ስርዓተ-ትምህርት እና የማስተማር ዘዴ ይከተላል?",
      om: "Manni barumsichaa sirna barnootaa fi tooftaa barsiisuu akkamii hordofa?",
    },
    answer: {
      en: "We follow the Ethiopian National Curriculum enriched with international STEM (Science, Technology, Engineering, Math) best practices, inquiry-based robotics, digital literacy, and holistic character education.",
      am: "የትምህርት ሚኒስቴርን ብሔራዊ ስርዓተ-ትምህርት ከዓለም አቀፍ የSTEM (ሳይንስ፣ ቴክኖሎጂ፣ ኢንጂነሪንግና ሂሳብ)፣ የሮቦቲክስ፣ የዲጂታል እውቀት እና የስነ-ምግባር ትምህርት ጋር አቀናጅተን እናስተምራለን።",
      om: "Sirna Barnootaa Biyyaalessaa Itoophiyaa kan qorannoo STEM (Saayinsii, Teeknooloojii, Injinariingii fi Herrega), roobootiksii fi naamusa gaarii waliin gabbifame hordofna.",
    },
  },
  {
    id: 'faq-3',
    category: 'academics',
    question: {
      en: "What is the medium of instruction at Albright Academy?",
      am: "በአልብራይት አካዳሚ ዋናው የማስተማሪያ ቋንቋ ምንድን ነው?",
      om: "Albright Academy keessatti afaan barnootaa inni guddaan maali?",
    },
    answer: {
      en: "English is the primary medium of instruction across all academic subjects (except regional languages). Amharic and Afaan Oromo are taught with high priority to preserve national identity and linguistic fluency.",
      am: "ከቋንቋ ትምህርቶች ውጭ በሁሉም የትምህርት ክፍሎች ዋናው የማስተማሪያ ቋንቋ እንግሊዝኛ ነው። የአማርኛ እና የአፋን ኦሮሞ ቋንቋዎች ደግሞ የባህል እና የብሔራዊ ማንነት እሴታቸውን ጠብቀው በጥልቀት ይሰጣሉ።",
      om: "Afaan Ingilizii afaan barnootaa isa guddaadha. Afaan Oromoo fi Afaan Amaaraas akka afaan dhalootaa fi duudhaa aadaatti xiyyeeffannoo guddaadhaan kennamu.",
    },
  },
  {
    id: 'faq-4',
    category: 'campus',
    question: {
      en: "What are the daily school hours and arrival times?",
      am: "የትምህርት ሰዓት እና የጠዋት መግቢያ ሰዓት ስንት ነው?",
      om: "Sa'aatiin barnootaa fi seenumsi ganamaa yoomi?",
    },
    answer: {
      en: "Regular school hours are Monday through Friday from 8:00 AM to 3:30 PM. Campus gates open at 7:30 AM for supervised breakfast and reading. Optional enrichment clubs run until 4:30 PM.",
      am: "መደበኛ የትምህርት ሰዓት ከሰኞ እስከ አርብ ከጠዋቱ 2:00 እስከ 9:30 ነው። ተማሪዎች ከጠዋቱ 1:30 ጀምሮ ግቢ መግባት ይችላሉ። የተማሪዎች የክበባት እና የስፖርት ሰዓት እስከ 10:30 ይቆያል።",
      om: "Barnoonni idilee Wiixata hanga Jimaataatti ganama sa'aatii 8:00 hanga waaree booda 3:30tti ta'a. Balballi mana barumsaa ganama 7:30 irratti banama. Kilaboonni hanga 4:30tti turu.",
    },
  },
  {
    id: 'faq-5',
    category: 'campus',
    question: {
      en: "Is dedicated school bus transportation available?",
      am: "የትምህርት ቤት አውቶቡስ ትራንስፖርት አገልግሎት አለ?",
      om: "Tajaajilli geejjiba baasii mana barumsaa ni jiraa?",
    },
    answer: {
      en: "Yes. Albright Academy operates a fleet of well-maintained, GPS-tracked buses covering key routes across Addis Ababa, staffed by certified drivers and trained adult attendants.",
      am: "አዎ፤ የአልብራይት አካዳሚ በጂፒኤስ (GPS) የሚከታተሉ፣ ምቹ እና አስተማማኝ አውቶቡሶችን በሰለጠኑ አሽከርካሪዎችና ረዳቶች ታግዞ በአዲስ አበባ ዋና ዋና መስመሮች ያሰማራል።",
      om: "Eeyyee; Albright Academy baasota ammayyaa GPS qaban kan oftota dandeettii qabanii fi gargaartotaan to'ataman daandiiwwan Finfinnee keessa tajaajila kennan qaba.",
    },
  },
  {
    id: 'faq-6',
    category: 'admissions',
    question: {
      en: "What documents are required to complete an admission application?",
      am: "ለተማሪዎች ምዝገባ የሚያስፈልጉ ሰነዶች ምንድን ናቸው?",
      om: "Galmee barattootaaf sanadoonni barbaachisan maal fa'i?",
    },
    answer: {
      en: "You will need: (1) Copy of the child’s birth certificate, (2) Two recent passport-sized photos, (3) Previous school report card/transcript (for Grade 1 and above), and (4) Completed online application.",
      am: "የሚያስፈልጉ ሰነዶች፡ (1) የተማሪው የልደት ምስክር ወረቀት ኮፒ፣ (2) ሁለት የቅርብ ጊዜ ፓስፖርት ፎቶዎች፣ (3) የቀደመ የትምህርት ሪፖርት ካርድ (ከ1ኛ ክፍል ጀምሮ ላሉ) እና (4) የተሞላ የማመልከቻ ቅጽ።",
      om: "Kan barbaachisan: (1) Koppii waraqaa ragaa dhalootaa, (2) Suuraa paaspoortii lama, (3) Waraqaa ragaa mana barumsaa duraanii (Kutaa 1 fi isaa ol), fi (4) Unka iyyataa galmeeffame.",
    },
  },
  {
    id: 'faq-7',
    category: 'campus',
    question: {
      en: "Does the school provide lunch and nutritious snacks?",
      am: "ትምህርት ቤቱ ምሳ እና የተመጣጠነ መክሰስ ያቀርባል?",
      om: "Manni barumsichaa dhangaggoo fi laaqana ni dhiyeessaa?",
    },
    answer: {
      en: "Yes. Our monitored on-campus cafeteria serves freshly prepared, balanced, and hygienic hot meals daily, accommodating dietary preferences and fruit snacks.",
      am: "አዎ፤ በግቢያችን የሚገኘው ንጹህ ካፌቴሪያ በየቀኑ ትኩስ፣ ጤናማና የተመጣጠነ ምሳ እንዲሁም የፍራፍሬ መክሰሶችን ለተማሪዎች ያቀርባል።",
      om: "Eeyyee; Kaafeteeriyaan mana barumsaa keenyaa nyaata laaqanaa qulqullina qabu, mi'aawaa fi dhangaggoo guyyaa guyyaan qopheessee dhiyeessa.",
    },
  },
  {
    id: 'faq-8',
    category: 'general',
    question: {
      en: "What is the average teacher-to-student ratio in classes?",
      am: "በክፍል ውስጥ ያለው የመምህር እና የተማሪ ምጥጥን ስንት ነው?",
      om: "Reeshiyoon barsiisaa fi barattootaa kutaatti meeqa?",
    },
    answer: {
      en: "We maintain an optimal ratio of 1:18 to 1:20 in kindergarten and primary classrooms, ensuring every child receives individualized attention, encouragement, and support.",
      am: "በኬጂ እና የመጀመሪያ ደረጃ ክፍሎች ውስጥ የመምህር እና ተማሪ ምጥጥን 1፡18 እስከ 1፡20 እንዲሆን በማድረግ ለእያንዳንዱ ተማሪ ተገቢው ክትትልና እንክብካቤ እንዲሰጥ እናደርጋለን።",
      om: "Kutaa KG fi sadarkaa 1ffaa keessatti reeshiyoo 1:18 hanga 1:20 eeguun barataan hundi xiyyeeffannoo dhuunfaa fi deeggarsa akka argatu goona.",
    },
  },
];
