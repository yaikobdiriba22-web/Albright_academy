export interface FacilityItem {
  id: string;
  name: {
    en: string;
    am: string;
    om: string;
  };
  category: 'academic' | 'technology' | 'recreation' | 'services';
  description: {
    en: string;
    am: string;
    om: string;
  };
  features: {
    en: string[];
    am: string[];
    om: string[];
  };
  imageUrl: string;
}

export const FACILITIES_DATA: FacilityItem[] = [
  {
    id: 'fac-1',
    name: {
      en: "Smart Modern Classrooms",
      am: "ዘመናዊና ብሩህ የመማሪያ ክፍሎች",
      om: "Kutaalee Barumsaa Ammayyaa",
    },
    category: 'academic',
    description: {
      en: "Bright, acoustically treated learning spaces equipped with digital interactive boards, ergonomic student desks, and natural airflow.",
      am: "በይነ-መረብ የታከለባቸው፣ የድምጽ ማስተጋባትን የሚከላከሉና የተፈጥሮ ንጹህ አየር በበቂ ሁኔታ የሚያገኙ የመማሪያ ክፍሎች።",
      om: "Kutaalee barumsaa ifa uumamaa qaban, kan teeknooloojiin deeggaramanii fi teessuma mijaawaa qaban.",
    },
    features: {
      en: ["Digital Smart Boards", "Ergonomic Furniture", "Natural Cross-Ventilation", "CCTV Campus Safety"],
      am: ["ዲጂታል ስማርት ቦርዶች", "ምቹና ዘመናዊ ወንበሮች", "ንጹህ የተፈጥሮ አየር", "የደህንነት ካሜራ ክትትል"],
      om: ["Boodii Dijitaalaa", "Teessuma Mijaawaa", "Qilleensa Qulqulluu", "Kaameeraa Nageenyaa"],
    },
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'fac-2',
    name: {
      en: "Resource Center & Library",
      am: "ቤተ-መጻሕፍት እና የመረጃ ማዕከል",
      om: "Mana Kitaabaa fi Wiirtuu Qorannoo",
    },
    category: 'academic',
    description: {
      en: "A quiet sanctuary with over 5,000 curated books in English, Amharic, and Afaan Oromo, including digital tablets and reading pods.",
      am: "ከ5,000 በላይ መጻሕፍት በእንግሊዝኛ፣ አማርኛ እና ኦሮምኛ ያካተተ፣ የዲጂታል ታብሌቶችና የጸጥታ ንባብ ማዕዘናት ያለው።",
      om: "Kitaabota 5,000 ol Afaan Ingilizii, Afaan Oromoo fi Amaaraatiin, taableetota fi bakka dubbisaa callisaa.",
    },
    features: {
      en: ["Bilingual & Trilingual Books", "Digital E-Reader Stations", "Storytelling Corner for Early Years", "Research Study Carrels"],
      am: ["ባለብዙ ቋንቋ መጻሕፍት", "የዲጂታል ንባብ ጣቢያዎች", "የህጻናት የተረት ማዕዘን", "የምርምር ጠረጴዛዎች"],
      om: ["Kitaabota Afaanota Hedduu", "Isteeshinii Dijitaalaa", "Koreen Oduu Daa'immanii", "Minjaala Qorannoo"],
    },
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'fac-3',
    name: {
      en: "Computer & Coding Lab",
      am: "የኮምፒውተር እና ኮዲንግ ላብ",
      om: "Laabii Kompiitaraa fi Koodingii",
    },
    category: 'technology',
    description: {
      en: "A state-of-the-art computer room with high-speed fiber internet where students learn touch-typing, block coding, and safe internet usage.",
      am: "ፈጣን የኢንተርኔት ግንኙነት ያላቸው ዘመናዊ ኮምፒውተሮች ተማሪዎች የኮዲንግና ዲጂታል ክህሎት የሚያገኙበት ክፍል ነው።",
      om: "Kutaa kompiitaraa intarneetii saffisaa qabu kan barattoonni koodingii fi itti fayyadama intarneetii sirrii itti baratan.",
    },
    features: {
      en: ["1:1 Student Workstations", "Scratch & Python Learning", "Cyber Safety Filters", "Robotics Interface Hub"],
      am: ["ለእያንዳንዱ ተማሪ ኮምፒውተር", "የስክራች እና ፓይተን ትምህርት", "የደህንነት ኢንተርኔት ማጣሪያ", "የሮቦቲክስ ማዕከል"],
      om: ["Kompiitara Barataa Tokkoof Tokko", "Barnoota Scratch fi Python", "Calaltuu Nageenyaa", "Wiirtuu Roobootiksii"],
    },
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'fac-4',
    name: {
      en: "Experimental Science Lab",
      am: "የትምህርት ሳይንስ ላቦራቶሪ",
      om: "Laaboraatorii Saayinsii Qorannoo",
    },
    category: 'academic',
    description: {
      en: "Equipped with child-safe microscopes, lab glassware, physical measurement kits, and botanical specimens for grades 1 to 8.",
      am: "አደጋ የማያደርሱ ማይክሮስኮፖች፣ የኬሚስትሪ መለኪያ እቃዎችና የሳይንስ ናሙናዎች የተሟሉለት ላቦራቶሪ።",
      om: "Meeshaalee maaykirooskooppii, safartuu fi saayinsii qorannoo barattootaaf nageenyi isaanii eegame.",
    },
    features: {
      en: ["Optical Microscopes", "Safety Goggles & Wash Stations", "Botanical Specimens", "Guided Hands-on Experiments"],
      am: ["ዘመናዊ ማይክሮስኮፖች", "የደህንነት መነጽሮችና መታጠቢያዎች", "የተፈጥሮ ናሙናዎች", "በመምህራን የሚመሩ ሙከራዎች"],
      om: ["Maaykirooskooppii", "Gilaasii fi Bakka Dhiqannaa", "Saamuda Uumamaa", "Qorannoo Barsiisaan Hogganamu"],
    },
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'fac-5',
    name: {
      en: "Outdoor Playground & Sports Court",
      am: "የልጆች መጫወቻ እና የስፖርት ሜዳ",
      om: "Dirree Taphaa fi Ispoortii",
    },
    category: 'recreation',
    description: {
      en: "Dedicated early-childhood soft playground paired with open basketball, football, and athletics tracks for physical fitness.",
      am: "የህጻናት መጫወቻ መሳሪያዎች፣ የእግር ኳስ ሜዳ፣ የቅርጫት ኳስ መጫወቻ እና የሩጫ ትራክ ያለው ሰፊ ግቢ።",
      om: "Dirree tapha daa'immanii balaa hin qabne, kubbaa miilaa, kubbaa kaawukkee fi fiigicha.",
    },
    features: {
      en: ["Impact-absorbing Safety Flooring", "Mini Soccer Pitch", "Basketball Half-Court", "Swings & Climbing Towers"],
      am: ["አደጋ የማያደርስ ንጣፍ", "የእግር ኳስ ሜዳ", "የቅርጫት ኳስ ሜዳ", "የልጆች ዥዋዥዌና መወጣጫ"],
      om: ["Dirree Balaa Hin Qabne", "Dirree Kubbaa Miilaa", "Kubbaa Kaawukkee", "Siqiftoo fi Tapha Daa'immanii"],
    },
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'fac-6',
    name: {
      en: "Multi-Purpose Activity Hall",
      am: "ሁለገብ የስብሰባና የኪነ-ጥበብ አዳራሽ",
      om: "Galma Walgahii fi Aartii Bal'aa",
    },
    category: 'recreation',
    description: {
      en: "A spacious indoor facility hosting morning assemblies, student theater, cultural performances, science fairs, and indoor sports.",
      am: "ለጠዋት ሰልፍ፣ ለድራማ ዝግጅቶች፣ ለባህል ቀናት፣ ለሳይንስ አውደ-ርዕይ እና ለስብሰባዎች የሚያገለግል ትልቅ አዳራሽ።",
      om: "Galma bal'aa kan koolleeffannaaf, agarsiisa aadaa, tiyaatira fi dorgommiiwwaniif oolu.",
    },
    features: {
      en: ["Full Stage & Sound System", "Seating for 350+ Guests", "Gymnastics Mats & Racks", "Exhibition Display Panels"],
      am: ["የሙዚቃና የድምጽ ሲስተም", "ከ350 በላይ ተመልካች የሚይዝ", "የጅምናስቲክስ ፍራሾች", "የአውደ-ርዕይ ፓነሎች"],
      om: ["Sirna Sagalee fi Masaraa", "Teessuma Namoota 350+", "Firaashii Jiimnaastiksii", "Boodii Agarsiisaa"],
    },
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'fac-7',
    name: {
      en: "Hygienic Dining Cafeteria",
      am: "ንጹህና ጤናማ የምግብ ማዕከል",
      om: "Kaafeteeriyaa Nyaata Qulqullinaa",
    },
    category: 'services',
    description: {
      en: "A bright, sanitized cafeteria serving wholesome, nutritionist-designed hot lunches, fresh fruits, and filtered drinking water stations.",
      am: "በየቀኑ በንጽህና የሚዘጋጁ የተመጣጠኑ ምግቦች እና ንጹህ የመጠጥ ውሃ ጣቢያዎች የተሟሉለት ካፌቴሪያ።",
      om: "Kaafeteeriyaa qulqullina olaanaa qabu kan laaqana madaalamaa fi bishaan qulqulluu qopheessu.",
    },
    features: {
      en: ["Nutritionist-Approved Menu", "UV-Filtered Water Coolers", "Hand-Washing Stations", "Full Adult Supervision"],
      am: ["የተመጣጠነ የምግብ ዝርዝር", "የተጣራ ንጹህ የመጠጥ ውሃ", "የእጅ መታጠቢያ ጣቢያዎች", "የአዋቂዎች ቁጥጥርና ክትትል"],
      om: ["Baajata Nyaata Madaalamaa", "Bishaan Qulqulluu Calalame", "Bakka Harka Dhiqannaa", "To'annoo Guutuu"],
    },
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'fac-8',
    name: {
      en: "Safe School Transportation",
      am: "አስተማማኝ የትምህርት ቤት ትራንስፖርት",
      om: "Geejjiba Mana Barumsaa Nageenyi Eegame",
    },
    category: 'services',
    description: {
      en: "Fleet of modern yellow buses equipped with seat belts, first-aid kits, GPS tracking, and experienced drivers with attendants.",
      am: "የደህንነት ቀበቶዎች፣ የመጀመሪያ እርዳታ እቃዎችና የጂፒኤስ ክትትል ያላቸው አውቶቡሶች ከሰለጠኑ ረዳቶች ጋር።",
      om: "Baasota ammayyaa qulqullina qaban kan GPS fi qoricha duraa qaban oftota dandeettii qabaniin kan hoogganaman.",
    },
    features: {
      en: ["GPS Live Route Tracking", "Individual Seatbelts", "Dedicated Bus Attendants", "Addis Ababa Sub-City Coverage"],
      am: ["የጂፒኤስ ቀጥታ ክትትል", "የደህንነት ቀበቶዎች", "ልዩ አጃቢ ረዳቶች", "አዲስ አበባ ዋና ዋና መስመሮች"],
      om: ["Hordoffii GPS Kallattii", "Qabannoo Nageenyaa", "Gargaartota Baasii", "Uwwisa Daandiiwwan Finfinnee"],
    },
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
  },
];
