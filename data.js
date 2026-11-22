// Data Master untuk Vanguard Barbershop

const SERVICES_DATA = [
  {
    id: "srv-1",
    category: "haircut",
    name: "Gentlemen Signature Cut",
    subtitle: "Potongan rambut presisi sesuai kontur kepala & bentuk wajah",
    duration: 45,
    price: 65000,
    badge: "Paling Populer",
    features: [
      "Konsultasi bentuk wajah & style",
      "Haircut dengan teknik clipper & scissor",
      "Cuci rambut 2x (shampoo & conditioner)",
      "Pijat relaksasi leher & pundak",
      "Tonic & Premium Pomade styling"
    ]
  },
  {
    id: "srv-2",
    category: "haircut",
    name: "Fade & Taper Master Cut",
    subtitle: "Gradasi super halus (Skin Fade / Low / Mid / High Taper)",
    duration: 50,
    price: 75000,
    badge: "Favorit",
    features: [
      "Precision skin fade / zero fade",
      "Razor line detailing & hairline trim",
      "Double hair wash & cold towel finish",
      "Head & shoulder massage",
      "Matte paste / clay styling"
    ]
  },
  {
    id: "srv-3",
    category: "haircut",
    name: "Junior Gent Cut (Anak-anak)",
    subtitle: "Potongan rapi & ramah untuk anak usia 3 - 12 tahun",
    duration: 35,
    price: 50000,
    badge: "Kids Friendly",
    features: [
      "Barber ramah anak & sabar",
      "Tersedia booster seat & tontonan kartun",
      "Cuci rambut lembut",
      "Styling pomade water-based",
      "Bonus lollipop / sticker"
    ]
  },
  {
    id: "srv-4",
    category: "beard",
    name: "Royal Hot Towel Shave",
    subtitle: "Cukur janggut & kumis tradisional dengan handuk hangat aromaterapi",
    duration: 35,
    price: 55000,
    badge: "Sensasi Klasik",
    features: [
      "Kompres handuk hangat pre-shave",
      "Pre-shave oil & thick lather foam",
      "Cukur presisi straight razor (single use blade)",
      "Cooling aftershave balm & splash",
      "Kompres handuk dingin penutup pori"
    ]
  },
  {
    id: "srv-5",
    category: "beard",
    name: "Beard Sculpting & Trim",
    subtitle: "Membentuk dan merapikan kontur janggut agar tebal & maskulin",
    duration: 30,
    price: 45000,
    badge: "",
    features: [
      "Trimming panjang & kerapatan janggut",
      "Cheek line & neckline razor definition",
      "Beard oil nourishing & comb styling"
    ]
  },
  {
    id: "srv-6",
    category: "treatment",
    name: "Scalp Detox & Anti-Dandruff Spa",
    subtitle: "Pembersihan kerak kulit kepala, anti ketombe & peremajaan akar rambut",
    duration: 40,
    price: 85000,
    badge: "Best Treatment",
    features: [
      "Scalp scrub exfoliation",
      "Menthol cooling mask",
      "Steamer ozon terapi akar rambut",
      "Pijat akupresur kepala 15 menit",
      "Serum tonic penumbuh rambut"
    ]
  },
  {
    id: "srv-7",
    category: "treatment",
    name: "Black Mask Charcoal Deep Clean",
    subtitle: "Cabut komedo wajah, membersihkan pori & menghaluskan kulit",
    duration: 25,
    price: 45000,
    badge: "",
    features: [
      "Hot steam muka membuka pori",
      "Oles masker activated bamboo charcoal",
      "Pencabutan komedo & sel kulit mati",
      "Face mist toner menyegarkan"
    ]
  },
  {
    id: "srv-8",
    category: "color",
    name: "Korean Down Perm",
    subtitle: "Jinakkan rambut samping yang jabrik/ngembang ala idol Korea",
    duration: 60,
    price: 150000,
    badge: "Trending 2026",
    features: [
      "Aplikasi obat perm premium Korea (bebas bau menyengat)",
      "Proses heating & neutralizer",
      "Sudah termasuk Gentlemen Haircut & styling"
    ]
  },
  {
    id: "srv-9",
    category: "color",
    name: "Coloring & Bleaching (Fashion / Silver / Ash)",
    subtitle: "Pewarnaan rambut trendi dengan produk aman & minim rusak",
    duration: 90,
    price: 250000,
    badge: "Custom Color",
    features: [
      "Konsultasi warna & tone kulit",
      "Bleaching level safe dengan Olaplex protection",
      "Aplikasi cat rambut premium pilihan",
      "Hair mask treatment pasca-warna"
    ]
  },
  {
    id: "srv-10",
    category: "package",
    name: "The Sultan Executive VIP Package",
    subtitle: "Layanan paling komplit untuk tampilan maskulin dan kesegaran paripurna",
    duration: 90,
    price: 185000,
    badge: "All In One VIP",
    features: [
      "Gentlemen Signature Haircut & Styling",
      "Royal Hot Towel Shave / Beard Trim",
      "Scalp Detox Treatment & Head Spa",
      "Black Mask Charcoal Facial",
      "Pijat relaksasi ekstra punggung & tangan",
      "Complimentary Iced Caramel Macchiato / Premium Tea"
    ]
  }
];

const BARBERS_DATA = [
  {
    id: "barber-1",
    name: "Rian 'The Razor' Pratama",
    title: "Master Capster & Educator",
    experience: "9 Tahun Pengalaman",
    specialty: "Skin Fade, French Crop, Beard Sculpting",
    rating: 4.98,
    reviewsCount: 340,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    bio: "Juara 1 Indonesia Barber Battle 2023. Ahli dalam menciptakan gradasi fade presisi dan gaya rambut berkarakter tegas."
  },
  {
    id: "barber-2",
    name: "Kevin Ardiansyah",
    title: "Texture & Korean Hair Specialist",
    experience: "6 Tahun Pengalaman",
    specialty: "Two-Block, Korean Perm, Comma Hair, Mullet",
    rating: 4.95,
    reviewsCount: 285,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    bio: "Spesialis potongan rambut modern ala K-Pop & Asia urban. Ahli teknik texturizing dan chemical down perm."
  },
  {
    id: "barber-3",
    name: "Bagas Satria",
    title: "Classic & Vintage Master",
    experience: "8 Tahun Pengalaman",
    specialty: "Classic Pompadour, Side Part, Hot Shave",
    rating: 4.94,
    reviewsCount: 310,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    bio: "Pecinta gaya gentlemen klasik era 50-an. Sangat teliti dalam razor work dan seni mencukur handuk hangat."
  },
  {
    id: "barber-4",
    name: "Dimas 'Chroma' Kurnia",
    title: "Colorist & Modern Styling",
    experience: "5 Tahun Pengalaman",
    specialty: "Silver Ash, Highlights, Buzz Cut & Hair Tattoo",
    rating: 4.92,
    reviewsCount: 220,
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    bio: "Kreator warna rambut berani dan hair line art. Menguasai teknik perpaduan warna yang serasi dengan skintone."
  }
];

const LOOKBOOK_DATA = [
  {
    id: "lb-1",
    tag: "fade",
    name: "Mid Taper Fade with Textured Top",
    category: "Fade & Taper",
    suitableFor: "Oval, Kotak, Lonjong",
    desc: "Gradasi taper di samping & belakang dengan rambut atas bertekstur natural matte.",
    image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "lb-2",
    tag: "korean",
    name: "Korean Two-Block & Comma Hair",
    category: "Korean & Texture",
    suitableFor: "Oval, Hati, Bulat",
    desc: "Bagian poni melengkung menyerupai tanda koma, memberikan impresi stylish dan fresh.",
    image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "lb-3",
    tag: "crop",
    name: "French Crop with Sharp Lineup",
    category: "Crop & Short",
    suitableFor: "Kotak, Oval, Berlian",
    desc: "Poni lurus pendek dengan potongan samping high fade yang tegas dan minim perawatan harian.",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "lb-4",
    tag: "classic",
    name: "Classic Executive Side Part",
    category: "Classic & Gentleman",
    suitableFor: "Semua Bentuk Wajah",
    desc: "Gaya belah samping rapi klimis berkelas eksekutif, cocok untuk profesional dan acara formal.",
    image: "https://images.unsplash.com/photo-1517832606589-715753d4f323?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "lb-5",
    tag: "beard",
    name: "Sculpted Beard & Low Fade",
    category: "Beard & Grooming",
    suitableFor: "Kotak, Bulat, Oval",
    desc: "Kombinasi janggut tebal bergaris tajam yang menyambung mulus dengan fade rambut samping.",
    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "lb-6",
    tag: "modern",
    name: "Modern Mullet with Drop Fade",
    category: "Korean & Texture",
    suitableFor: "Oval, Lonjong",
    desc: "Sentuhan retro-modern edgy dengan bagian belakang bervolume dan samping drop fade bersih.",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80"
  }
];

const FACE_SHAPE_RECOMMENDATIONS = {
  oval: {
    title: "Bentuk Wajah Oval",
    desc: "Bentuk wajah paling proporsional dan fleksibel. Hampir semua model rambut cocok untuk Anda!",
    recs: ["Mid Taper Fade", "Textured Quiff", "Korean Comma Hair", "Classic Side Part"],
    avoid: "Hindari poni depan yang menutupi dahi secara penuh karena bisa membuat wajah terlihat bulat."
  },
  kotak: {
    title: "Bentuk Wajah Persegi / Kotak (Square)",
    desc: "Memiliki garis rahang yang tegas dan maskulin. Triknya adalah menonjolkan atau melembutkan sudut rahang.",
    recs: ["French Crop", "High Skin Fade", "Buzz Cut", "Undercut Slick Back"],
    avoid: "Potongan belah tengah datar atau potongan yang terlalu kaku di bagian samping."
  },
  bulat: {
    title: "Bentuk Wajah Bulat (Round)",
    desc: "Lebar dan panjang wajah relatif sama. Butuh model rambut yang memberi ilusi tinggi dan sudut.",
    recs: ["High Fade Pompadour", "Faux Hawk", "Side Part Quiff", "Short Textured Crop"],
    avoid: "Buzz cut rata tanpa volume atas atau poni lurus mangkok yang menambah kesan bulat."
  },
  lonjong: {
    title: "Bentuk Wajah Lonjong (Oblong / Rectangular)",
    desc: "Wajah lebih panjang daripada lebarnya. Butuh gaya rambut dengan volume samping seimbang.",
    recs: ["Two-Block Korean", "Side Swept Fringe", "Layered Cut", "Mid Taper dengan sedikit volume samping"],
    avoid: "Gaya rambut terlalu tinggi di atas (seperti pompadour tinggi) yang membuat wajah semakin panjang."
  },
  hati: {
    title: "Bentuk Wajah Hati / Segitiga Terbalik (Heart)",
    desc: "Dahi lebih lebar dengan dagu yang runcing. Cocok dengan gaya bertekstur atau memiliki poni halus.",
    recs: ["Textured Fringe", "Modern Mullet", "Medium Length Layer", "Soft Two-Block"],
    avoid: "High skin fade yang terlalu tipis di samping karena akan menonjolkan lebar dahi."
  }
};

const INITIAL_REVIEWS = [
  {
    id: "rev-1",
    name: "Alif Raditya",
    rating: 5,
    date: "2 hari yang lalu",
    service: "Gentlemen Signature Cut",
    comment: "Barbershop terbaik di kota! Tempatnya estetik, AC dingin, dapat kopi gratis, dan potongannya Mas Rian bener-bener rapi presisi sesuai bentuk mukaku. Bakal langganan terus!",
    verified: true
  },
  {
    id: "rev-2",
    name: "Christian Wijaya",
    rating: 5,
    date: "5 hari yang lalu",
    service: "The Sultan Executive VIP Package",
    comment: "Ambil paket Sultan pas weekend, sensasi hot towel shave dan scalp detox-nya bikin semua stres ilang. Pelayanan ramah, capster detail banget kerjanya.",
    verified: true
  },
  {
    id: "rev-3",
    name: "Farhan Maulana",
    rating: 5,
    date: "1 minggu yang lalu",
    service: "Korean Down Perm",
    comment: "Rambut samping gw yang biasanya jegrik kayak landak sekarang nurut banget setelah di-down perm sama Mas Kevin. Hasil natural dan ga bikin rambut rusak!",
    verified: true
  }
];
