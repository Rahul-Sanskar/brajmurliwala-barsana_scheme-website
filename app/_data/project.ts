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
   * "OPEN"   — applications are being accepted; APPLY NOW button is enabled.
   * "CLOSED" — applications are paused; button is visually disabled.
   */
  APPLICATION_STATUS: "OPEN" as "OPEN" | "CLOSED",

  /**
   * Set to true when Razorpay credentials are configured in .env.local.
   * When false the APPLY NOW button shows a "Payment not configured" notice
   * instead of initiating a checkout — prevents accidental live charges.
   */
  RAZORPAY_ENABLED: true,
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
      src: "/braj/hero/1-elevation-day.png",
      alt: "Braj Murliwala Residency elevation on Goverdhan Road, Barsana — daytime view",
      message: "1, 2 & 3 BHK Residences — Pre-Launch at ₹7,999/sq.ft.",
    },
    {
      src: "/braj/hero/2-elevation-night.png",
      alt: "Braj Murliwala Residency illuminated night elevation — Goverdhan Road, Barsana",
      message: "Modern Residences in the Spiritual Heart of Braj",
    },
    {
      src: "/braj/hero/3-elevation-side.png",
      alt: "Braj Murliwala Residency side elevation view — residential project in Barsana",
      message: "Bank Loan up to 90% — Fully Furnished Options Available",
    },
    {
      src: "/braj/hero/4-furnished.png",
      alt: "Furnished apartment interior at Braj Murliwala Residency, Barsana",
      message: "Premium Branded Fittings — Furnished Apartment Options Available",
    },
    {
      src: "/braj/hero/5-barsana.png",
      alt: "Goverdhan Road, Barsana — location of Braj Murliwala Residency",
      message: "Located on Goverdhan Road, 1.5 km from Barsana Bus Stand",
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
    "1, 2 & 3 BHK Modern Apartment Layouts",
    "Premium branded fittings",
    "Ready-to-Move positioning",
    "Fully furnished apartment options available",
    "Located on Goverdhan Road, Barsana",
    "Spiritual Braj region address",
    "Potential for rental / Airbnb income",
  ],

  overview: [
    "Har din Radha Rani ke aashirwad ke saath apni zindagi ki nai shuruaat kijiye. Braj Murliwala presents Barsana me Goverdhan Road par, pahla Ready-to-Move Ultra Luxury Society Apartments — 1, 2 & 3 BHK homes with premium branded fittings aur world-class amenities.",
    "Yeh RERA-approved project Shri Radha Rani aur Kirti Mandir se close, Barsana Bus Stand se 1.5 km ki doori par hai. Bank loan up to 90%, aur pre-launch price sirf ₹7,999 per sq. ft., jo launch ke baad ₹8,499 per sq. ft. ho jayegi. Chahe apne liye ek peaceful spiritual home ho ya Airbnb aur rental income ke saath smart investment, yeh ek perfect opportunity hai. Limited period pre-launch offer ka fayda uthaiye.",
  ],

  aboutContent: {
    heading: "About Braj Murliwala Residency",
    paragraphs: [
      "Braj Murliwala Residency is a multi-storey residential project on Goverdhan Road, Barsana — situated in Shridham Barsana, one of the most significant pilgrimage towns of the Braj region, Uttar Pradesh.",
      "The project offers 1 BHK, 2 BHK, and 3 BHK apartments designed for modern residential living. Each home is built with premium branded fittings and supported by a full range of community amenities including a swimming pool, gymnasium, temple, landscaped park, and 24-hour power backup.",
      "Developed by SKG Infratech — the developer group behind the established Murliwala Group of Hotels and Restaurants in the Braj region — the project is positioned as a well-planned residential community for families, pilgrims, and investors looking for a home in Barsana.",
    ],
    points: [
      "1 BHK, 2 BHK and 3 BHK configurations",
      "Bank loan assistance up to 90%",
      "Fully furnished apartment options available",
      "Located on Goverdhan Road, approx. 1.5 km from Barsana Bus Stand",
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
      id: "brochure",
      title: "Project Brochure",
      description: "Complete project overview including elevations, floor plans, amenities and pricing.",
      type: "Brochure",
      available: false,
      note: "[TO BE PROVIDED]",
    },
    {
      id: "floor-plan",
      title: "Floor Plan Compilation",
      description: "Detailed floor plans for all configurations — 1 BHK, 2 BHK, and 3 BHK.",
      type: "PDF",
      available: false,
      note: "[TO BE PROVIDED]",
    },
    {
      id: "payment-plan",
      title: "Payment Plan",
      description: "Construction-linked and down-payment schedule with financing options.",
      type: "PDF",
      available: false,
      note: "[TO BE PROVIDED]",
    },
    {
      id: "rera",
      title: "RERA Certificate",
      description: "UP-RERA registration certificate for this project.",
      type: "PDF",
      available: false,
      note: "[TO BE PROVIDED]",
    },
    {
      id: "spec-sheet",
      title: "Specification Sheet",
      description: "Detailed specifications for structure, finishes, fittings and amenities.",
      type: "PDF",
      available: false,
      note: "[TO BE PROVIDED]",
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
      a: "Braj Murliwala Residency is located on Goverdhan Road, Barsana, Mathura district, Uttar Pradesh. The project is approximately 1.5 km from Barsana Bus Stand.",
    },
    {
      q: "What configurations are available?",
      a: "The project offers 1 BHK, 2 BHK, and 3 BHK apartments. All configurations are available for enquiry.",
    },
    {
      q: "What is the area range for each configuration?",
      a: "1 BHK: 881–895 sq. ft. | 2 BHK: 1,395–1,675 sq. ft. | 3 BHK: 1,916–1,982 sq. ft. (Super Built-Up Area)",
    },
    {
      q: "What is the current price per sq. ft.?",
      a: "The pre-launch price is ₹7,999 per sq. ft. This is a limited-period offer valid for early bookings. Post-launch the rate will be ₹8,499 per sq. ft.",
    },
    {
      q: "What is the starting price?",
      a: "Starting from ₹74 Lakh for a 1 BHK apartment at the pre-launch rate. Prices for 2 BHK and 3 BHK configurations are available on enquiry.",
    },
    {
      q: "Is the project RERA-approved?",
      a: "Yes, the project is RERA-approved. The RERA registration number will be published here once officially confirmed. You may request it directly from the developer.",
    },
    {
      q: "What is the expected possession date?",
      a: "The possession timeline will be provided by the developer. Please enquire directly for the latest update on possession.",
    },
    {
      q: "Are furnished flat options available?",
      a: "Yes. Fully furnished apartment options are available. Please enquire for the furnished package details and pricing.",
    },
    {
      q: "Is parking included?",
      a: "The project provides common car parking. Dedicated/covered parking availability should be confirmed at the time of booking.",
    },
    {
      q: "What amenities does the project offer?",
      a: "The project includes Swimming Pool, Gymnasium, Temple, Landscaped Park, CCTV Surveillance, Boom Barrier, High-Speed Lifts, Intercom, Fire Safety, 100% Power Backup for common areas, Wi-Fi/DTH provision, Community Center, Kids Play Zone, Yoga area, Senior Citizen Corner, Rainwater Harvesting, and Sewage Treatment Plant.",
    },
    {
      q: "Is bank loan available?",
      a: "Yes. Bank loan assistance of up to 90% is available through tie-up banks. Please enquire for a list of empanelled banks.",
    },
    {
      q: "How can I schedule a site visit?",
      a: "Site visits can be scheduled on all days via prior enquiry. Please call +91 87966 22722 or fill the enquiry form on this page.",
    },
  ] as FaqItem[],

  notices: [
    "Pre-Launch price of ₹7,999/- per sq. ft. valid for limited bookings only.",
    "Site visits can be scheduled on all days via prior enquiry.",
    "Bank loan assistance up to 90% available through empanelled banks.",
    "Furnished apartment options available — enquire for details.",
  ],

  snapshot: [
    { label: "Configuration", value: "1 / 2 / 3 BHK", sub: "881–1982 sq. ft.", icon: "LayoutGrid" },
    { label: "Location",      value: "Goverdhan Road",   sub: "Barsana, Mathura", icon: "MapPin" },
    { label: "Starting Price", value: "₹74 Lakh", sub: "Pre-launch ₹7,999/sq. ft.", icon: "Banknote" },
    { label: "Project", value: "Braj Murliwala Residency", sub: "Barsana Housing Scheme", icon: "Building2" },
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
        "Situated on Goverdhan Road in Barsana — the birthplace of Shri Radha Rani. Close proximity to Radha Rani Temple, Kirti Mandir and Goverdhan.",
    },
    {
      icon: "Banknote",
      title: "Accessible Financing",
      detail:
        "Bank loan assistance of up to 90% available through empanelled banks. Pre-launch rate of ₹7,999/sq.ft. — limited period offer.",
    },
    {
      icon: "Home",
      title: "Furnished Options",
      detail:
        "Fully furnished apartment packages available across all configurations — 1 BHK, 2 BHK, and 3 BHK. Move in without the hassle.",
    },
    {
      icon: "Building2",
      title: "Complete Community",
      detail:
        "Swimming pool, gymnasium, temple, landscaped parks, 24×7 power backup, CCTV, high-speed lifts and more — all within the campus.",
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
  { id: "application",   label: "Apply Now",    href: "#application", primary: true },
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
