export interface TeacherMember {
  id: string;
  name: {
    en: string;
    am: string;
    om: string;
  };
  position: {
    en: string;
    am: string;
    om: string;
  };
  department: 'early' | 'primary' | 'junior' | 'stem' | 'admin';
  qualification: string;
  specialization: {
    en: string;
    am: string;
    om: string;
  };
  experience: string;
  imageUrl: string;
  bio: {
    en: string;
    am: string;
    om: string;
  };
}

export const TEACHERS_DATA: TeacherMember[] = [
  {
    id: "t-1",
    name: {
      en: "Dr. Helen Mengistu",
      am: "ዶ/ር ሔለን መንግስቱ",
      om: "Dk. Heelan Mangistuu",
    },
    position: {
      en: "School Principal & Head of Academics",
      am: "ርእሰ-መምህርት እና የትምህርት ጥራት አስተባባሪ",
      om: "Hogganaa fi Daayirektara Mana Barumsaa",
    },
    department: "admin",
    qualification: "Ph.D. in Educational Leadership & Curriculum Design",
    specialization: {
      en: "K–8 Educational Strategy, STEM Leadership & Pedagogy",
      am: "የትምህርት አመራር፣ የSTEM ስርአተ-ትምህርትና ማስተማር ስነ-ዘዴ",
      om: "Hoggansa Barnootaa, Kalaqa Sirna Barnootaa fi STEM",
    },
    experience: "18+ Years",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    bio: {
      en: "Passionate visionary educator championing student-centered learning and STEM integration across Ethiopian private schools.",
      am: "የተማሪን ተሰጥኦ የሚያጎለብት ዘመናዊ የSTEM እና የስነ-ምግባር ትምህርትን በኢትዮጵያ የሚያራምዱ አንጋፋ መምህርት።",
      om: "Hoggantuu barnootaa kan barataa giddu-galeessa godhate fi saayinsii ammayyaa gabbisuuf tattaafatan.",
    },
  },
  {
    id: "t-2",
    name: {
      en: "Mr. Dawit Alemayehu",
      am: "አቶ ዳዊት አለማየሁ",
      om: "Obbo Daawit Alamayyahuu",
    },
    position: {
      en: "Vice Principal & Primary Academic Director",
      am: "ምክትል ርእሰ-መምህር እና የመጀመሪያ ደረጃ አስተባባሪ",
      om: "Itti-Aanaa Daayirektaraa fi Qindeessaa Sadarkaa 1ffaa",
    },
    department: "primary",
    qualification: "M.Ed. in Primary Pedagogy & Assessment",
    specialization: {
      en: "Foundational Mathematics & Inquiry-Based Science",
      am: "የመሰረታዊ ሂሳብ እና ተግባራዊ ሳይንስ ማስተማር",
      om: "Herrega Bu'uuraa fi Saayinsii Qorannoo",
    },
    experience: "14+ Years",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
    bio: {
      en: "Specializes in transforming abstract mathematical concepts into fun, hands-on classroom discoveries.",
      am: "የሂሳብ ትምህርትን በተግባራዊና አስደሳች መንገድ ለታዳጊ ህጻናት በማቅረብ የሚታወቁ አንጋፋ መምህር።",
      om: "Barnoota herregaa haala salphaa fi hawwataadhaan barsiisuun beekamu.",
    },
  },
  {
    id: "t-3",
    name: {
      en: "Ms. Bethlehem Tadesse",
      am: "ወ/ሮ ቤተልሔም ታደሰ",
      om: "Aadde Beetaliheem Taaddasaa",
    },
    position: {
      en: "Early Childhood Lead Educator (KG1 – KG2)",
      am: "የቅድመ-መደበኛ ትምህርት ዋና መምህርት",
      om: "Barsiistuu Ol-aantuu Daa'immanii (KG)",
    },
    department: "early",
    qualification: "B.A. in Early Childhood Education & Child Psychology",
    specialization: {
      en: "Phonics, Sensory Discovery & Early Literacy",
      am: "የድምጽ ንባብ (Phonics)፣ የስሜት ህዋሳት እድገት እና ቅድመ-ንባብ",
      om: "Qubeessaa, Miira Bilcheessuu fi Dubbisa Daa'immanii",
    },
    experience: "10+ Years",
    imageUrl: "https://images.unsplash.com/photo-1580894732484-934c9c22d4f5?auto=format&fit=crop&w=800&q=80",
    bio: {
      en: "Dedicated to creating safe, playful, and nurturing classrooms where young toddlers discover the joy of books.",
      am: "ህጻናት ፍርሃት ሳይሰማቸው በደስታ የሚማሩበትና የማንበብ ፍቅር የሚያዳብሩበትን ምቹ ከባቢ ይፈጥራሉ።",
      om: "Daa'imman nagaa fi gammachuudhaan akka baratan kan gargaaran.",
    },
  },
  {
    id: "t-4",
    name: {
      en: "Mr. Yohannes Bekele",
      am: "አቶ ዮሐንስ በቀለ",
      om: "Obbo Yohaannis Baqqalaa",
    },
    position: {
      en: "Head of STEM & Junior High Sciences",
      am: "የSTEM እና የመካከለኛ ደረጃ ሳይንስ መምህር",
      om: "Barsiisaa Saayinsii fi STEM Sadarkaa Giddu-galeessaa",
    },
    department: "stem",
    qualification: "B.Sc. in Applied Physics & Robotics Engineering",
    specialization: {
      en: "Robotics, Coding & Experimental Physics",
      am: "ሮቦቲክስ፣ የኮምፒውተር ኮዲንግ እና የፊዚክስ ላቦራቶሪ",
      om: "Roobootiksii, Koodingii fi Fiiziksii",
    },
    experience: "8+ Years",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    bio: {
      en: "Leads our after-school robotics club and mentors students for national STEM and coding competitions.",
      am: "የትምህርት ቤቱን የሮቦቲክስ ክበብ የሚመሩና ተማሪዎችን ለብሔራዊ የሳይንስ ውድድር የሚያዘጋጁ።",
      om: "Kilaba roobootiksii hogganuun dorgommiiwwan adda addaatiif barattoota qopheessu.",
    },
  },
  {
    id: "t-5",
    name: {
      en: "Ms. Senait Kebede",
      am: "ወ/ሮ ሰናይት ከበደ",
      om: "Aadde Saanaayt Kabbadaa",
    },
    position: {
      en: "English & Literature Coordinator (Grades 5–8)",
      am: "የእንግሊዝኛ ቋንቋ እና ስነ-ጽሑፍ አስተባባሪ",
      om: "Qindeessituu Afaan Ingilizii fi Og-barruu",
    },
    department: "junior",
    qualification: "M.A. in English Literature & Linguistics",
    specialization: {
      en: "Debate, Creative Writing & Public Speaking",
      am: "የክርክር ጥበብ፣ ፈጠራዊ ጽሑፍ እና የንግግር ክህሎት",
      om: "Falmii, Barreessuu fi Dandeettii Dubbachuu",
    },
    experience: "12+ Years",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    bio: {
      en: "Inspires confident, articulate young writers and leads our Model UN and Spelling Bee programs.",
      am: "ተማሪዎች ሃሳባቸውን በድፍረት እንዲገልጹና የማንበብ ባህላቸው እንዲዳብር በትጋት የሚሰሩ።",
      om: "Barattoonni ofitti amanamummaadhaan akka dubbatan deeggaru.",
    },
  },
  {
    id: "t-6",
    name: {
      en: "Mr. Tolosa Feyissa",
      am: "አቶ ቶሎሳ ፈይሳ",
      om: "Obbo Tolosaa Fayyisaa",
    },
    position: {
      en: "Afaan Oromo & Ethiopian Cultural Studies Lead",
      am: "የአፋን ኦሮሞ ቋንቋ እና የባህል ትምህርት መምህር",
      om: "Barsiisaa Afaan Oromoo fi Aadaa Itoophiyaa",
    },
    department: "primary",
    qualification: "B.A. in Ethiopian Languages & Cultural Anthropology",
    specialization: {
      en: "Oromo Linguistics, Folklore & Traditional Music",
      am: "የኦሮምኛ ቋንቋ ስነ-ጽሑፍ፣ ተረትና ባህላዊ ሙዚቃ",
      om: "Afaan Oromoo, Oduu Durii fi Muuziqaa Aadaa",
    },
    experience: "11+ Years",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    bio: {
      en: "Instills cultural pride, bilingual excellence, and traditional Ethiopian music appreciation in all our young scholars.",
      am: "የቋንቋ እውቀትን፣ የባህል ኩራትን እና ህብረ-ብሔራዊ አንድነትን ለተማሪዎች የሚያስተምሩ።",
      om: "Aadaa fi afaan kabachiisuun tokkummaa barattootaa cimsu.",
    },
  },
  {
    id: "t-7",
    name: {
      en: "Mr. Michael Assefa",
      am: "አቶ ሚካኤል አሰፋ",
      om: "Obbo Mikaa'el Asaffaa",
    },
    position: {
      en: "Athletics & Physical Education Director",
      am: "የአካል ማጎልመሻ እና ስፖርት አስተባባሪ",
      om: "Qindeessaa Ispoortii fi Nageenya Qaamaa",
    },
    department: "stem",
    qualification: "B.Sc. in Sport Science & Youth Athletic Coaching",
    specialization: {
      en: "Youth Soccer, Basketball & Gymnastics Conditioning",
      am: "እግር ኳስ፣ ቅርጫት ኳስ እና የጅምናስቲክስ ስልጠና",
      om: "Kubbaa Miilaa, Kubbaa Kaawukkee fi Jiimnaastiksii",
    },
    experience: "9+ Years",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    bio: {
      en: "Passionate about building teamwork, resilience, sportsmanship, and lifelong healthy physical habits.",
      am: "የቡድን ስሜትን፣ ጽናትን እና ጤናማ የአኗኗር ዘይቤን በተማሪዎች ውስጥ የሚገነቡ አሰልጣኝ።",
      om: "Fayyummaa qaamaa fi tokkummaa barattootaa gabbisu.",
    },
  },
  {
    id: "t-8",
    name: {
      en: "Ms. Hanan Mohammed",
      am: "ወ/ሪት ሃናን መሀመድ",
      om: "Aadde Haanan Mahammad",
    },
    position: {
      en: "Primary Mathematics & Science Educator (Grades 2–4)",
      am: "የመጀመሪያ ደረጃ ሂሳብ እና ሳይንስ መምህርት",
      om: "Barsiistuu Herregaa fi Saayinsii (Kutaa 2–4)",
    },
    department: "primary",
    qualification: "B.Ed. in Mathematics & Environmental Science",
    specialization: {
      en: "Differentiated Instruction & Visual Math Models",
      am: "የሂሳብ ሞዴሎችና የአካባቢ ሳይንስ ትምህርት",
      om: "Moodeelota Herregaa fi Saayinsii Naannoo",
    },
    experience: "7+ Years",
    imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80",
    bio: {
      en: "Uses gamified problem solving and interactive science kits to make learning irresistible for primary scholars.",
      am: "በጨዋታ እና በሙከራ የታገዘ የሂሳብ ትምህርትን ለህጻናት በማስተማር ተወዳጅ መምህርት።",
      om: "Herrega akka taphaatti barsiisuun fedhii barattootaa kakaasu.",
    },
  },
];
