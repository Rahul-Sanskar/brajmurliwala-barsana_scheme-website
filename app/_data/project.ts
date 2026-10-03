export type UnitConfig = {
  id: string;
  name: string;
  superAreaSqftMin: number;
  superAreaSqftMax: number;
  preLaunchRatePerSqft: number;
  postLaunchRatePerSqft: number;
  startingPrice: number | null;
  furnishedAvailable: boolean;
  status: "Available" | "Enquire" | "[TO BE PROVIDED]";
};

export type Amenity = {
  id: string;
  label: string;
  icon: string; // lucide icon name
  category: "Wellness" | "Safety" | "Services" | "Community" | "Green";
};

export type NavAnchor = {
  id: string;
  label: string;
  href: string;
  primary?: boolean;
};

export type DocumentItem = {
  id: string;
  title: string;
  description: string;
  type: "PDF" | "Image" | "Brochure" | "[TO BE PROVIDED]";
  sizeKb?: number;
  available: boolean;
  note?: string;
  /** Public URL of the file (e.g. "/braj/Bmw RERA.pdf") — required when available: true */
  file?: string;
};

export type ContactInfo = {
  phonePrimary: string;
  phoneSecondary?: string;
  whatsapp: string;
  email: string;
  addressLines: string[];
  mapQuery: string;
};

export type SpecRow = {
  feature: string;
  detail: string;
};

export type SpecCategory = {
  category: string;
  rows: SpecRow[];
};

export type FaqItem = {
  q: string;
  a: string;
};

export type HeroSlide = {
  src: string;
  alt: string;
  message: string;
  /** Optional per-slide overrides — if omitted, global PROJECT values are used */
  kicker?: string;
  title?: string;
  location?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
};

/**
 * APPLICATION CONFIGURATION — single source of truth.
 * Change APPLICATION_AMOUNT and APPLICATION_STATUS here only.
 * Never hard-code these values in components.
 */
export const CONFIG = {
  /** Application / booking amount in INR (paise = × 100 when sent to Razorpay) */
  APPLICATION_AMOUNT: 21000,

  /**
   * "OPEN"   — registrations are being accepted; REGISTER NOW button is enabled.
   * "CLOSED" — registrations are paused; button is visually disabled.
   */
  APPLICATION_STATUS: "OPEN" as "OPEN" | "CLOSED",

  /**
   * Set to true when Razorpay credentials are configured in .env.local.
   * When false the REGISTER NOW button shows a "Payment not configured" notice
   * instead of initiating a checkout — prevents accidental live charges.
   */
  RAZORPAY_ENABLED: true,

  /** Registration window & allotment — displayed beneath every Register Now button */
  REGISTRATION_START: "5 Oct 2026",
  REGISTRATION_END:   "22 Oct 2026",
  ALLOTMENT_DATE:     "25 Oct 2026",
} as const;

export const PROJECT = {
  portal: {
    name: "Barsana Housing Scheme",
    description:
      "A private residential development initiative offering organised 1, 2 & 3 BHK housing in Barsana.",
  },
  name: "Braj Murliwala Residency",
  tagline: "1, 2 & 3 BHK Residences on Goverdhan Road, Barsana",
  developer: {
    name: "SKG Infratech",
    lineage:
      "After a successful journey in Braj with Murliwala Group of Hotels and Restaurants, SKG Infratech has launched its flagship multi-story housing society as part of the Barsana Urban Housing Scheme.",
  },
  location: {
    address: "Goverdhan Road",
    landmark: "Approx. 1.5 km from Barsana Bus Stand",
    short: "Goverdhan Road, Barsana",
    city: "Barsana",
    district: "Mathura",
    state: "Uttar Pradesh",
    context: [
      "Shridham Barsana — the birthplace of Shri Radha Rani",
      "Goverdhan Road corridor",
      "Close proximity to Kirti Mandir and Radha Rani Temple",
      "Well connected by road to Goverdhan, Mathura and Vrindavan",
    ],
    nearbyLandmarks: [
      { label: "Barsana Bus Stand", distance: "1.5 km" },
      { label: "Radha Rani Temple (Lathmar Holi)", distance: "2 km" },
      { label: "Kirti Mandir", distance: "2.5 km" },
      { label: "Goverdhan", distance: "15 km" },
      { label: "Mathura", distance: "45 km" },
      { label: "Vrindavan", distance: "50 km" },
      { label: "Agra", distance: "90 km" },
      { label: "Delhi (NH-19)", distance: "140 km" },
    ],
  },
  approvals: {
    reraApproved: true,
    reraNumber: "[TO BE PROVIDED]",
    licenseNumber: "[TO BE PROVIDED]",
    completionCertificate: "[TO BE PROVIDED]",
    possession: "[TO BE PROVIDED]",
  },
  pricing: {
    preLaunchRatePerSqft: 7999,
    postLaunchRatePerSqft: 8499,
    startingPriceInr: 7400000,
    bankLoanUptoPercent: 90,
    furnishedOptionAvailable: true,
  },
  unitConfigs: [
    {
      id: "1bhk",
      name: "1 BHK",
      superAreaSqftMin: 881,
      superAreaSqftMax: 895,
      preLaunchRatePerSqft: 7999,
      postLaunchRatePerSqft: 8499,
      startingPrice: 7400000,
      furnishedAvailable: true,
      status: "Available",
    },
    {
      id: "2bhk",
      name: "2 BHK",
      superAreaSqftMin: 1395,
      superAreaSqftMax: 1675,
      preLaunchRatePerSqft: 7999,
      postLaunchRatePerSqft: 8499,
      startingPrice: null,
      furnishedAvailable: true,
      status: "Enquire",
    },
    {
      id: "3bhk",
      name: "3 BHK",
      superAreaSqftMin: 1916,
      superAreaSqftMax: 1982,
      preLaunchRatePerSqft: 7999,
      postLaunchRatePerSqft: 8499,
      startingPrice: null,
      furnishedAvailable: true,
      status: "Enquire",
    },
  ] as UnitConfig[],

  heroSlides: [
    {
      /* ── SLIDE 1 — Hindi ── */
      src: "/braj/hero/1-elevation-day.png",
      alt: "Braj Murliwala Residency elevation on Goverdhan Road, Barsana — daytime view",
      kicker: "बरसाना अर्बन हाउसिंग स्कीम",
      title: "ब्रज मुरलीवाला रेजीडेंसी",
      location: "गोवर्धन रोड, बरसाना",
      message: "⚠️ केवल 50 यूनिट बचे हैं — जल्दी करें!\nश्री राधा रानी की नगरी में अपना घर पाएं।\nमंदिर, कीर्ति मंदिर और बस स्टैंड के बिल्कुल पास।",
      ctaPrimary: "अभी रजिस्टर करें",
      ctaSecondary: "प्रोजेक्ट देखें",
    },
    {
      /* ── SLIDE 2 — English ── */
      src: "/braj/hero/2-elevation-night.png",
      alt: "Braj Murliwala Residency illuminated night elevation — Goverdhan Road, Barsana",
      message: "Only 50 units remaining — register now to secure yours!\nSecure your home in the divine city of Shree Radha Rani.\nPre-launch rate ₹7,999/sq.ft. — rising after launch.",
    },
    {
      /* ── SLIDE 3 — Hindi ── */
      src: "/braj/hero/3-elevation-side.png",
      alt: "Braj Murliwala Residency side elevation view — residential project in Barsana",
      kicker: "बरसाना अर्बन हाउसिंग स्कीम",
      title: "ब्रज मुरलीवाला रेजीडेंसी",
      location: "गोवर्धन रोड, बरसाना",
      message: "बैंक लोन 90% तक उपलब्ध है।\nप्री-लॉन्च रेट सिर्फ ₹7,999/sq.ft. — देर मत करें!\n1, 2 और 3 BHK अपार्टमेंट — अभी बुक करें।",
      ctaPrimary: "अभी आवेदन करें",
      ctaSecondary: "प्रोजेक्ट देखें",
    },
    {
      /* ── SLIDE 4 — English ── */
      src: "/braj/hero/4-furnished.png",
      alt: "Furnished apartment interior at Braj Murliwala Residency, Barsana",
      message: "Premium furnished apartments — 1, 2 & 3 BHK.\nSteps from Shree Radha Rani Mandir & Kirti Mandir.\nBank loan up to 90% — apply today!",
    },
    {
      /* ── SLIDE 5 — Hindi ── */
      src: "/braj/hero/5-barsana.png",
      alt: "Goverdhan Road, Barsana — location of Braj Murliwala Residency",
      kicker: "बरसाना अर्बन हाउसिंग स्कीम",
      title: "ब्रज मुरलीवाला रेजीडेंसी",
      location: "गोवर्धन रोड, बरसाना",
      message: "श्री राधा रानी की नगरी — बरसाना में अपना घर!\nसिर्फ 50 यूनिट बचे हैं — पहले आएं, पहले पाएं।\nआज ही संपर्क करें।",
      ctaPrimary: "अभी आवेदन करें",
      ctaSecondary: "प्रोजेक्ट देखें",
    },
  ] as HeroSlide[],

  amenities: [
    { id: "pool", label: "Swimming Pool", icon: "Waves", category: "Wellness" },
    { id: "gym", label: "Gymnasium", icon: "Dumbbell", category: "Wellness" },
    { id: "temple", label: "Temple within Campus", icon: "Building2", category: "Community" },
    { id: "park", label: "Landscaped Park", icon: "Trees", category: "Green" },
    { id: "cctv", label: "CCTV Surveillance", icon: "Camera", category: "Safety" },
    { id: "boom", label: "Boom Barrier Entry", icon: "ShieldCheck", category: "Safety" },
    { id: "lift", label: "High-Speed Lifts", icon: "ArrowUpDown", category: "Services" },
    { id: "intercom", label: "Intercom Facility", icon: "Phone", category: "Services" },
    { id: "fire", label: "Fire Safety System", icon: "Flame", category: "Safety" },
    { id: "power", label: "100% Power Backup", icon: "Zap", category: "Services" },
    { id: "wifi", label: "Wi-Fi / DTH Provision", icon: "Wifi", category: "Services" },
    { id: "community", label: "Community Center", icon: "Users", category: "Community" },
    { id: "kids", label: "Kids Play Zone", icon: "Star", category: "Community" },
    { id: "parking", label: "Covered Car Parking", icon: "Car", category: "Services" },
    { id: "yoga", label: "Yoga / Meditation Area", icon: "Heart", category: "Wellness" },
    { id: "senior", label: "Senior Citizen Corner", icon: "User", category: "Community" },
    { id: "rwh", label: "Rainwater Harvesting", icon: "Droplets", category: "Green" },
    { id: "stp", label: "Sewage Treatment Plant", icon: "Recycle", category: "Green" },
  ] as Amenity[],

  highlights: [
    "⚠️ Only 50 Units Left — Act Fast!",
    "1, 2 & 3 BHK Modern Apartment Layouts",
    "Pre-launch ₹7,999/sq.ft. — rises to ₹8,499 after launch",
    "Premium branded fittings — Ready-to-Move",
    "Fully furnished options — limited inventory",
    "Steps from Shree Radha Rani Mandir & Kirti Mandir",
    "Potential for rental / Airbnb income — high pilgrim footfall",
    "Bank loan up to 90% — apply TODAY",
  ],

  overview: [
    "⚡ Sirf 50 units bache hain — jaldi kijiye! Har din Radha Rani ke aashirwad ke saath apni zindagi ki nai shuruaat kijiye. Braj Murliwala presents Barsana ke Goverdhan Road par, pahla Ready-to-Move Ultra Luxury Society Apartments — 1, 2 & 3 BHK homes with premium branded fittings aur world-class amenities.",
    "Yeh RERA-approved project Shri Radha Rani aur Kirti Mandir se bilkul close, Barsana Bus Stand se sirf 1.5 km ki doori par hai. Bank loan up to 90%, aur pre-launch price SIRF ₹7,999 per sq. ft. — jo launch ke baad ₹8,499 per sq. ft. ho jayegi. Jitna zyada wait karenge, utna zyada paisa lagega. Chahe apne liye ek peaceful spiritual home ho ya Airbnb aur rental income ke saath smart investment — yeh opportunity phir nahi aayegi. Abhi apply karein.",
  ],

  aboutContent: {
    heading: "About Braj Murliwala Residency",
    paragraphs: [
      "Braj Murliwala Residency is a multi-storey residential project on Goverdhan Road, Barsana — situated in Shridham Barsana, the birthplace of Shri Radha Rani and one of the most significant pilgrimage towns of the Braj region, Uttar Pradesh. With only 50 units available, this is a once-in-a-lifetime chance to own a home in this sacred city.",
      "The project offers 1 BHK, 2 BHK, and 3 BHK apartments designed for modern residential living. Each home is built with premium branded fittings and supported by world-class amenities including a swimming pool, gymnasium, temple within campus, landscaped park, and 24-hour power backup. The pre-launch rate of ₹7,999/sq.ft. is a limited-period offer — it rises to ₹8,499/sq.ft. after launch.",
      "Developed by SKG Infratech — the group behind the established Murliwala Hotels and Restaurants in Braj — this is a trusted, RERA-approved project. Bank loan assistance up to 90% is available. Every day without booking is money left on the table. Secure your home today.",
    ],
    points: [
      "⚠️ Only 50 units available — book your slot now",
      "Pre-launch ₹7,999/sq.ft. — rising to ₹8,499 after launch",
      "Bank loan up to 90% — apply now",
      "Steps from Shree Radha Rani Mandir, Kirti Mandir & Bus Stand",
    ],
  },

  specifications: [
    {
      category: "Structure",
      rows: [
        { feature: "Construction Type", detail: "RCC framed structure — earthquake resistant design" },
        { feature: "Walls (External)", detail: "Fly ash brick masonry" },
        { feature: "Walls (Internal)", detail: "Fly ash brick masonry / light partition" },
      ],
    },
    {
      category: "Flooring",
      rows: [
        { feature: "Living / Dining", detail: "Vitrified tiles (premium brand)" },
        { feature: "Bedrooms", detail: "Vitrified tiles" },
        { feature: "Kitchen", detail: "Anti-skid ceramic tiles" },
        { feature: "Bathrooms", detail: "Anti-skid ceramic tiles" },
        { feature: "Balcony / Terrace", detail: "Anti-skid ceramic tiles" },
        { feature: "Common Areas", detail: "Granite / Vitrified tiles" },
        { feature: "Staircase", detail: "Marble / Kota stone" },
      ],
    },
    {
      category: "Kitchen",
      rows: [
        { feature: "Counter", detail: "Granite platform with stainless steel sink" },
        { feature: "Dado", detail: "Ceramic tiles up to 2 ft above counter" },
        { feature: "Fittings", detail: "CP fittings — premium brand" },
      ],
    },
    {
      category: "Bathrooms & Plumbing",
      rows: [
        { feature: "Sanitary Ware", detail: "Premium brand white sanitary ware" },
        { feature: "CP Fittings", detail: "Premium brand CP fittings" },
        { feature: "Tiles", detail: "Full-height ceramic tile dado" },
        { feature: "Water Supply", detail: "24×7 via overhead tank and underground sump" },
      ],
    },
    {
      category: "Electrical",
      rows: [
        { feature: "Wiring", detail: "Concealed copper wiring with MCB protection" },
        { feature: "Switches", detail: "Modular switches — premium brand" },
        { feature: "Power Points", detail: "Adequate power points in all rooms" },
        { feature: "Power Backup", detail: "100% backup for common areas; DG provision for flats" },
      ],
    },
    {
      category: "Doors & Windows",
      rows: [
        { feature: "Main Door", detail: "Engineered wood frame with flush door — branded fittings" },
        { feature: "Internal Doors", detail: "Flush doors with standard height frame" },
        { feature: "Windows", detail: "Powder-coated aluminium sliding windows with mosquito mesh" },
        { feature: "Balcony Railing", detail: "MS / aluminium railing" },
      ],
    },
    {
      category: "Lifts & Vertical Transport",
      rows: [
        { feature: "Lifts", detail: "High-speed automatic lifts per tower (branded)" },
        { feature: "Emergency", detail: "ARD (Automatic Rescue Device) provision" },
      ],
    },
    {
      category: "Security & Safety",
      rows: [
        { feature: "Access Control", detail: "Boom barrier at main entrance" },
        { feature: "CCTV", detail: "CCTV surveillance at entrance, lobbies and common areas" },
        { feature: "Intercom", detail: "Video/audio intercom provision" },
        { feature: "Fire Safety", detail: "Fire NOC compliant — hydrant, hose reel, extinguishers" },
        { feature: "Boundary", detail: "Compound wall with main gate" },
      ],
    },
    {
      category: "Common Areas & Finishes",
      rows: [
        { feature: "Lobby", detail: "Designed entrance lobby with granite / marble flooring" },
        { feature: "Landscaping", detail: "Professionally landscaped gardens and pathways" },
        { feature: "Painting (External)", detail: "Weather-proof exterior paint" },
        { feature: "Painting (Internal)", detail: "OBD / emulsion paint in all rooms" },
      ],
    },
  ] as SpecCategory[],

  documents: [
    {
      id: "rera",
      title: "RERA Certificate",
      description: "UP-RERA registration certificate for Braj Murliwala Residency.",
      type: "PDF",
      available: true,
      file: "/braj/Bmw RERA.pdf",
    },
    {
      id: "layout",
      title: "Project Layout Plan",
      description: "Approved layout plan of Braj Murliwala Residency — plot boundaries and block positions.",
      type: "PDF",
      available: true,
      file: "/braj/bmw layout.pdf",
    },
    {
      id: "nagar-nigam",
      title: "Nagar Nigam Approval",
      description: "Nagar Nigam (Municipal Corporation) approval document for the project.",
      type: "PDF",
      available: true,
      file: "/braj/bmw nagar nigam.pdf",
    },
    {
      id: "khasra",
      title: "Khasra Map",
      description: "Official khasra (land parcel) map for the project site on Goverdhan Road, Barsana.",
      type: "PDF",
      available: true,
      file: "/braj/bmw khasra map.pdf",
    },
    {
      id: "brochure",
      title: "Project Brochure",
      description: "Complete project overview including elevations, floor plans, amenities and pricing.",
      type: "Brochure",
      available: false,
    },
    {
      id: "floor-plan",
      title: "Floor Plan Compilation",
      description: "Detailed floor plans for all configurations — 1 BHK, 2 BHK, and 3 BHK.",
      type: "PDF",
      available: false,
    },
    {
      id: "payment-plan",
      title: "Payment Plan",
      description: "Construction-linked and down-payment schedule with financing options.",
      type: "PDF",
      available: false,
    },
    {
      id: "spec-sheet",
      title: "Specification Sheet",
      description: "Detailed specifications for structure, finishes, fittings and amenities.",
      type: "PDF",
      available: false,
    },
  ] as DocumentItem[],

  contact: {
    phonePrimary: "+91 87966 22722",
    whatsapp: "+918796622722",
    email: "info@brajmurliwala.online",
    addressLines: [
      "Braj Murliwala Residency",
      "Goverdhan Road",
      "Barsana, Mathura — Uttar Pradesh",
    ],
    mapQuery: "Barsana Bus Stand, Mathura, Uttar Pradesh, India",
  } as ContactInfo,

  faq: [
    {
      q: "Where is Braj Murliwala Residency located?",
      a: "Braj Murliwala Residency is on Goverdhan Road, Barsana — the divine city of Shree Radha Rani, Mathura district, UP. Just 1.5 km from Barsana Bus Stand, steps from Radha Rani Mandir and Kirti Mandir. There is no better address in Braj.",
    },
    {
      q: "How many units are left?",
      a: "Only 50 units remain in this pre-launch offering. Units are being booked quickly. Once they are gone, this opportunity is gone forever. Do not wait — enquire or apply now.",
    },
    {
      q: "What configurations are available?",
      a: "1 BHK (881–895 sq.ft.), 2 BHK (1,395–1,675 sq.ft.), and 3 BHK (1,916–1,982 sq.ft.) — all available right now at the pre-launch rate. Act before they sell out.",
    },
    {
      q: "What is the current price per sq. ft.?",
      a: "Pre-launch price is ₹7,999/sq.ft. — this is a strictly limited-period offer. After launch the rate rises to ₹8,499/sq.ft. Every day you wait costs you ₹500 more per sq.ft. Lock in today.",
    },
    {
      q: "What is the starting price?",
      a: "Starting from just ₹74 Lakh for a 1 BHK at the pre-launch rate — with bank loan up to 90%, your down payment could be as low as ₹7–8 Lakh. This is your most affordable window. 2 BHK and 3 BHK pricing on enquiry.",
    },
    {
      q: "Is the project RERA-approved?",
      a: "Yes — the project is RERA-approved, giving you complete legal security and peace of mind. Buy with full confidence.",
    },
    {
      q: "Are furnished flat options available?",
      a: "Yes — fully furnished apartment options are available, but inventory is limited. Enquire immediately to check availability for your preferred configuration.",
    },
    {
      q: "Is bank loan available?",
      a: "Yes — bank loan up to 90% is available through empanelled banks. That means you can own a home in the city of Shree Radha Rani with minimal upfront investment. Call us today to get started.",
    },
    {
      q: "What amenities does the project offer?",
      a: "Swimming Pool, Gymnasium, Temple within campus, Landscaped Park, CCTV, Boom Barrier, High-Speed Lifts, Intercom, Fire Safety, 100% Power Backup, Wi-Fi/DTH, Community Center, Kids Play Zone, Yoga area, Senior Citizen Corner, Rainwater Harvesting, STP — all within your community.",
    },
    {
      q: "What is the expected possession date?",
      a: "Possession timeline will be confirmed by the developer. Pre-launch buyers get priority possession. Enquire now for the latest update.",
    },
    {
      q: "Is parking included?",
      a: "Yes — common car parking is provided. Dedicated/covered parking availability should be confirmed at booking. Limited slots available.",
    },
    {
      q: "How can I schedule a site visit?",
      a: "Site visits are available every day. Call +91 87966 22722 NOW or fill the enquiry form below. Seeing is believing — visit and book same day.",
    },
  ] as FaqItem[],

  notices: [
    "⚠️ ONLY 50 UNITS REMAINING — Register now, secure your slot before it's gone!",
    "Pre-Launch price ₹7,999/sq.ft. — price RISES to ₹8,499 after launch. Lock in now!",
    "🔥 Pre-launch offer closes soon — every day of delay costs you ₹500/sq.ft. more.",
    "Bank loan up to 90% available — apply today, move in to the city of Shree Radha Rani.",
    "Site visits available daily — call +91 87966 22722 to book yours NOW.",
    "Furnished apartment options available — limited inventory, first-come first-served.",
    "Don't regret missing out — neighbours of Shree Radha Rani Mandir & Kirti Mandir.",
    "₹21,000 blocks your unit — secure your home before someone else does.",
  ],

  snapshot: [
    { label: "Units Remaining", value: "Only 50 Left", sub: "Register now — secure your slot", icon: "AlertTriangle" },
    { label: "Location",        value: "Goverdhan Road", sub: "Barsana — City of Shree Radha Rani", icon: "MapPin" },
    { label: "Pre-Launch Price", value: "₹74 Lakh+", sub: "₹7,999/sq.ft. — rising soon", icon: "Banknote" },
    { label: "Project",         value: "Braj Murliwala Residency", sub: "Barsana Housing Scheme", icon: "Building2" },
  ],

  /**
   * whyBarsana — cultural and location context for the "Why Barsana" section.
   * Only factual, non-fabricated statements about Barsana's significance.
   */
  whyBarsana: {
    heading: "Why Choose Barsana",
    intro:
      "Barsana is one of the most celebrated towns of the Braj region — widely revered as the birthplace of Shri Radha Rani and a significant pilgrimage destination in Mathura district, Uttar Pradesh.",
    points: [
      {
        title: "Birthplace of Shri Radha Rani",
        detail:
          "Barsana is revered across the Braj region as the birthplace of Shri Radha Rani. The Radha Rani Temple (Shri Ji Temple) on the hilltop is one of the most visited temples in Braj.",
        icon: "MapPin",
      },
      {
        title: "Heart of Braj Cultural Heritage",
        detail:
          "The Braj region — encompassing Barsana, Mathura, Vrindavan and Goverdhan — holds deep significance in Indian cultural and religious tradition. Barsana is an active centre of this heritage.",
        icon: "Trees",
      },
      {
        title: "Lathmar Holi — National Recognition",
        detail:
          "Barsana's Lathmar Holi celebration is nationally known and draws visitors from across India and abroad every year. The town's cultural calendar is active year-round.",
        icon: "Star",
      },
      {
        title: "Well-Connected Location",
        detail:
          "Situated on the Goverdhan Road corridor, Barsana is well connected by road to Goverdhan (15 km), Mathura (45 km), Vrindavan (50 km), Agra (90 km), and Delhi via NH-19 (140 km).",
        icon: "Navigation",
      },
      {
        title: "Residential Investment Context",
        detail:
          "The town sees consistent pilgrim footfall and tourism activity throughout the year, creating a context for residential investment with rental and homestay potential.",
        icon: "Banknote",
      },
      {
        title: "Peaceful Residential Environment",
        detail:
          "Away from the density of larger cities, Barsana offers a calm residential setting with the spiritual ambience of the Braj landscape.",
        icon: "Home",
      },
    ],
  },

  keyBenefits: [
    {
      icon: "MapPin",
      title: "Prime Spiritual Location",
      detail:
        "Steps from Shree Radha Rani Mandir, Kirti Mandir & Barsana Bus Stand — own a home in the divine city of Shree Radha Rani. A once-in-a-lifetime address.",
    },
    {
      icon: "Banknote",
      title: "Pre-Launch Price — Act NOW",
      detail:
        "Lock in at just ₹7,999/sq.ft. before the price rises to ₹8,499. Every day of delay costs you ₹500 more per sq.ft. Bank loan up to 90% available.",
    },
    {
      icon: "Home",
      title: "Only 50 Units — Going Fast",
      detail:
        "Only 50 homes available in this exclusive launch. Furnished options available across all configurations. First come, first served — don't miss your unit.",
    },
    {
      icon: "Building2",
      title: "World-Class Amenities",
      detail:
        "Swimming pool, gymnasium, temple within campus, landscaped parks, 24×7 power backup, CCTV, high-speed lifts — everything included. Ready to move in.",
    },
  ],
};

export const NAV_ANCHORS: NavAnchor[] = [
  // Order matches the DOM section order in page.tsx.
  { id: "home",          label: "Home",         href: "#hero" },
  { id: "overview",      label: "The Project",  href: "#overview" },
  { id: "pricing",       label: "Price List",   href: "#pricing" },
  { id: "site-layout",   label: "Master Plan",  href: "#site-layout" },
  { id: "floor-plans",   label: "Floor Plans",  href: "#floor-plans" },
  { id: "documents",     label: "Documents",    href: "#documents" },
  { id: "gallery",       label: "Gallery",      href: "#gallery" },
  { id: "amenities",     label: "Amenities",    href: "#amenities" },
  { id: "location",      label: "Location",     href: "#location" },
  { id: "faq",           label: "FAQ",          href: "#faq" },
  { id: "contact",       label: "Contact",      href: "#contact" },
  { id: "application",   label: "Register Now",  href: "#application", primary: true },
];

export const SITE_LINKS = {
  home: "/",
  application: "/application",
  privacy: "/privacy-policy",
  terms: "/terms",
};

export function formatInr(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatSqftRange(min: number, max: number): string {
  if (min === max) return `${min} sq. ft.`;
  return `${min}–${max} sq. ft.`;
}

export function formatLakhs(n: number): string {
  const l = n / 100000;
  if (l >= 100) return `₹${(l / 100).toFixed(2)} Cr`;
  return `₹${l.toFixed(0)} Lakh`;
}
