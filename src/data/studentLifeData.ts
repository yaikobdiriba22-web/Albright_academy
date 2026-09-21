export interface StudentLifeActivity {
  id: string;
  category: 'sports' | 'clubs' | 'arts' | 'competitions' | 'trips' | 'projects' | 'culture';
  title: {
    en: string;
    am: string;
    om: string;
  };
  subtitle: {
    en: string;
    am: string;
    om: string;
  };
  description: {
    en: string;
    am: string;
    om: string;
  };
  items: {
    en: string[];
    am: string[];
    om: string[];
  };
  imageUrl: string;
}

export const STUDENT_LIFE_DATA: StudentLifeActivity[] = [
  {
    id: 'sl-sports',
    category: 'sports',
    title: {
      en: "Athletics & Physical Well-Being",
      am: "አካላዊ ማጎልመሻ እና ስፖርት",
      om: "Ispoortii fi Fayyummaa Qaamaa",
    },
    subtitle: {
      en: "Building Endurance, Agility, and Sportsmanship",
      am: "የአካል ጥንካሬን፣ ቅልጥፍናን እና መልካም የስፖርት ስነ-ምግባርን መገንባት",
      om: "Jabina Qaamaa fi Tokkummaa Gabbisuu",
    },
    description: {
      en: "Our physical education program fosters lifelong healthy habits, friendly intramural leagues, and athletic development for every age group.",
      am: "የትምህርት ቤታችን የስፖርት ፕሮግራም ጤናማ የአኗኗር ዘይቤን፣ የቡድን መንፈስን እና ንቁ ተሳትፎን ከኬጂ ጀምሮ ያዳብራል።",
      om: "Sagantaan ispoortii keenya fayyummaa qaamaa, amala gaarii fi wal-dorgommii nagaa barattoota hundaaf kenna.",
    },
    items: {
      en: ["Junior Football League", "Basketball Half-Court Training", "Track & Field Sprints", "Gymnastics & Balance Floor"],
      am: ["የታዳጊዎች እግር ኳስ ሊግ", "የቅርጫት ኳስ ስልጠና", "የአጭር ርቀት ሩጫዎች", "የጅምናስቲክስ ስልጠና"],
      om: ["Liigii Kubbaa Miilaa", "Leenjii Kubbaa Kaawukkee", "Fiigicha Gabaabaa", "Jiimnaastiksii fi Tapha Qaamaa"],
    },
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'sl-clubs',
    category: 'clubs',
    title: {
      en: "Co-Curricular Clubs & Societies",
      am: "የትምህርት ክበባት እና ማህበራት",
      om: "Kilaboota Mana Barumsaa",
    },
    subtitle: {
      en: "Pursuing Passions Beyond the Classroom",
      am: "ከተለመደው የክፍል ትምህርት ባሻገር ተሰጥኦን ማሳደግ",
      om: "Kutaan Alatti Fedhii Dabalataa Gabbisuu",
    },
    description: {
      en: "Meeting every Wednesday and Friday afternoon, students choose from a diverse catalog of faculty-mentored interest clubs.",
      am: "ተማሪዎች በየሳምንቱ ረቡዕ እና አርብ ከሰዓት በመምህራን በሚመሩ የተለያዩ የክበባት ስራዎች ላይ በነጻነት ይሳተፋሉ።",
      om: "Barattoonni torbanitti guyyoota Roobii fi Jimaataa waaree booda kilaboota fedhii isaanii keessatti hirmaatu.",
    },
    items: {
      en: ["Robotics & Lego STEM Club", "Debate & Public Speaking Society", "Green Earth Ecology Club", "Junior Chess Masters"],
      am: ["የሮቦቲክስ እና ሌጎ ክበብ", "የክርክር እና የንግግር ጥበብ ክበብ", "የአካባቢ ጥበቃ ክበብ", "የቼዝ ጨዋታ ክበብ"],
      om: ["Kilaba Roobootiksii fi STEM", "Kilaba Falmii fi Dubbii", "Kilaba Qulqullina Naannoo", "Kilaba Chess"],
    },
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'sl-arts',
    category: 'arts',
    title: {
      en: "Fine Arts, Music & Theater",
      am: "ስነ-ጥበብ፣ ሙዚቃ እና ትያትር",
      om: "Aartii, Muuziqaa fi Tiyaatira",
    },
    subtitle: {
      en: "Unlocking Creative Expression & Aesthetic Sensibility",
      am: "የፈጠራ ችሎታን፣ ውበትን የማድነቅ እና የስሜት ህዋሳትን ማጎልበት",
      om: "Kalaqa Aartii fi Muuziqaa Dammaqsuu",
    },
    description: {
      en: "From canvas painting and clay sculpting to learning traditional Ethiopian instruments (Kirar, Washint, Kebero) and musical choir.",
      am: "ከሰሌዳ ስዕልና ከሸክላ ስራ ጀምሮ እስከ ባህላዊ መሳሪያዎች (ክራር፣ ዋሽንት፣ ከበሮ) እና የትምህርት ቤት መዘምራን ድረስ ይማራሉ።",
      om: "Fakkii kaasuu, meeshaalee aadaa Itoophiyaa (Kiraara, Waashintii, Kabaro) taphachuu fi faaruu garee.",
    },
    items: {
      en: ["Watercolors & Clay Sculpting", "Traditional Instruments & Choir", "Annual Drama Production", "Visual Arts Gallery Day"],
      am: ["የውሃ ቀለም ስዕልና የሸክላ ቅርጽ", "ባህላዊ መሳሪያዎችና መዘምራን", "ዓመታዊ የድራማ ዝግጅት", "የስነ-ጥበብ አውደ-ርዕይ"],
      om: ["Fakkii fi Dhoqqee Hojjechuu", "Meeshaalee Aadaa fi Faaruu", "Qophii Tiyaatira Waggaa", "Agarsiisa Aartii"],
    },
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'sl-competitions',
    category: 'competitions',
    title: {
      en: "Academic Competitions & Olympiads",
      am: "የትምህርት ውድድሮች እና ኦሎምፒያዶች",
      om: "Dorgommiiwwan Barnootaa fi Saayinsii",
    },
    subtitle: {
      en: "Celebrating Academic Striving & Intellectual Courage",
      am: "የትምህርት ጥረትን፣ ብልሃትን እና የእውቀት ድፍረትን ማክበር",
      om: "Beekumsa fi Cimina Qorannoo Mul'isuu",
    },
    description: {
      en: "Albright scholars regularly participate and excel in intra-school and regional spelling bees, math bowls, and science olympiads.",
      am: "የአልብራይት ተማሪዎች በትምህርት ቤትና በከተማ አቀፍ የስፔሊንግ ቢ፣ የሂሳብና የሳይንስ ውድድሮች ላይ በመሳተፍ ከፍተኛ ውጤት ያስመዘግባሉ።",
      om: "Barattoonni keenya dorgommiiwwan Spelling Bee, Herregaa fi Saayinsii keessatti hirmaachuun qabxii olaanaa galmeessu.",
    },
    items: {
      en: ["Annual Inter-Grade Spelling Bee", "Addis Ababa Math Olympiad", "Junior STEM Innovation Challenge", "Essay & Poetry Contests"],
      am: ["ዓመታዊ የስፔሊንግ ቢ ውድድር", "የአዲስ አበባ የሂሳብ ኦሎምፒያድ", "የታዳጊዎች የSTEM ፈጠራ ውድድር", "የግጥምና ድርሰት ውድድሮች"],
      om: ["Dorgommii Spelling Bee Waggaa", "Oolompika Herregaa Finfinnee", "Dorgommii Kalaqa STEM", "Dorgommii Walaloo fi Barreeffamaa"],
    },
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'sl-trips',
    category: 'trips',
    title: {
      en: "Educational Field Trips & Excursions",
      am: "የትምህርት የመስክ ጉዞዎች እና ጉብኝቶች",
      om: "Daawwannaa fi Imala Barnootaa",
    },
    subtitle: {
      en: "Experiential Learning in the Real World",
      am: "በእውነተኛው ዓለም ውስጥ የሚደረግ ተግባራዊ ትምህርት",
      om: "Barnoota Qabatamaa Addunyaa Keessatti",
    },
    description: {
      en: "Carefully curated excursions connect classroom curriculum to historical sites, natural wonders, and modern institutions across Ethiopia.",
      am: "በክፍል ውስጥ የተማሩትን ትምህርት ከታሪካዊ ስፍራዎች፣ ከተፈጥሮ ፓርኮችና ከዘመናዊ ተቋማት ጋር የሚያስተሳስሩ ጉብኝቶች።",
      om: "Daawwannaan kun barnoota kutaatti baratan seenaa, uumama fi dhaabbilee ammayyaa waliin walitti fida.",
    },
    items: {
      en: ["National Museum of Ethiopia", "Science Museum of Addis Ababa", "Gullele Botanical Garden", "Airport & Air Force Base Tours"],
      am: ["የኢትዮጵያ ብሔራዊ ሙዚየም", "የአዲስ አበባ ሳይንስ ሙዚየም", "የጉለሌ እጽዋት ማዕከል", "የአየር ማረፊያ ጉብኝት"],
      om: ["Muuziyeemii Biyyaalessaa", "Muuziyeemii Saayinsii Finfinnee", "Iddoo Misooma Biqiltuu Gullaallee", "Daawwannaa Buufata Xiyyaaraa"],
    },
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'sl-projects',
    category: 'projects',
    title: {
      en: "Student Innovation Projects",
      am: "የተማሪዎች የፈጠራ ፕሮጀክቶች",
      om: "Piroojektiiwwan Kalaqa Barattootaa",
    },
    subtitle: {
      en: "Applying Science & Problem Solving to Local Challenges",
      am: "ሳይንስንና የፈጠራ አስተሳሰብን ለአካባቢያዊ ችግሮች መፍትሔ ማድረግ",
      om: "Saayinsii fi Furmaata Rakkoolee Hawaasaaf Oolchuu",
    },
    description: {
      en: "Grades 4 through 8 conduct term-long capstone inquiries, designing working prototypes, renewable models, and digital presentations.",
      am: "ከ4ኛ እስከ 8ኛ ክፍል ያሉ ተማሪዎች በእውነተኛ ችግሮች ላይ ምርምር አድርገው ተግባራዊ የቴክኖሎጂ ሞዴሎችን ያዘጋጃሉ።",
      om: "Barattoonni kutaa 4 hanga 8 qorannoo geggeessuun moodeelota teeknooloojii fi furmaata haarawaa uumu.",
    },
    items: {
      en: ["Solar & Renewable Energy Models", "Automated Plant Watering System", "Recycled Materials Art Installations", "Mobile Learning App Prototypes"],
      am: ["የጸሀይ ኃይል ሞዴሎች", "ራስ-ሰር የውሃ ማጠጫ ዘዴዎች", "ከዳግም ጥቅም እቃዎች የተሰሩ ስራዎች", "የሞባይል መተግበሪያ ፕሮቶታይፖች"],
      om: ["Moodeela Annisaa Aduu", "Sirna Bishaan Biqiltootaa", "Aartii Meeshaalee Irra-deebii", "Koodii Moobaayilaa"],
    },
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'sl-culture',
    category: 'culture',
    title: {
      en: "Cultural & National Heritage Days",
      am: "የባህል እና የብሔራዊ ቅርስ ቀናት",
      om: "Ayyaanota Aadaa fi Duudhaa Biyyaalessaa",
    },
    subtitle: {
      en: "Embracing Unity in Diversity & Cultural Pride",
      am: "በብዝሃነት ውስጥ ያለውን አንድነት እና የባህል ኩራትን ማክበር",
      om: "Tokkummaa fi Aadaa Heddu-buleeyyii Kabajuu",
    },
    description: {
      en: "Celebrating Ethiopia’s diverse cultures, traditional attire, regional cuisines, dances, and history alongside Global Friendship Day.",
      am: "የኢትዮጵያን ውብ ባህሎች፣ አለባበስ፣ ምግቦች እና ጭፈራዎችን ከዓለም አቀፍ የወዳጅነት ቀን ጋር በድምቀት እናከብራለን።",
      om: "Uffata aadaa, nyaata aadaa, shubbisa fi seenaa Itoophiyaa akkasumas Guyyaa Michummaa Addunyaa kabajuu.",
    },
    items: {
      en: ["Nations & Nationalities Cultural Day", "Traditional Coffee & Cuisine Fair", "Folk Dance & Poetry Recitals", "Global Friendship & Flags Exhibition"],
      am: ["የብሔር ብሔረሰቦች የባህል ቀን", "የባህላዊ ቡና እና ምግቦች አውደ-ርዕይ", "የባህል ጭፈራዎችና ግጥሞች", "የዓለም አቀፍ ባንዲራዎችና ወዳጅነት ቀን"],
      om: ["Guyyaa Aadaa Sabootaa fi Sab-lammootaa", "Agarsiisa Nyaataa fi Buna Aadaa", "Shubbisa fi Walaloo Aadaa", "Agarsiisa Faajjiiwwan Addunyaa"],
    },
    imageUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80',
  },
];
