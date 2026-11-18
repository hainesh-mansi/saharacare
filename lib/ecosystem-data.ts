export type AmbulanceService = {
  id: string;
  name: string;
  district: string;
  phone: string;
  is24x7: boolean;
};

export const nepalAmbulanceServices: AmbulanceService[] = [
  { id: "amb-1", name: "Nepal Red Cross Society Ambulance Service", district: "Kathmandu", phone: "102", is24x7: true },
  { id: "amb-2", name: "Paropakar Ambulance Service", district: "Kathmandu", phone: "+977 1 4260859", is24x7: true },
  { id: "amb-3", name: "Armed Police Force Disaster & Medical Rescue", district: "National", phone: "1114", is24x7: true },
  { id: "amb-4", name: "Patan Hospital Emergency Ambulance", district: "Lalitpur", phone: "+977 1 5522295", is24x7: true },
  { id: "amb-5", name: "Tribhuvan University Teaching Hospital (TUTH)", district: "Kathmandu", phone: "+977 1 4412404", is24x7: true },
  { id: "amb-6", name: "Bhaktapur Red Cross Ambulance", district: "Bhaktapur", phone: "+977 1 6611661", is24x7: true },
  { id: "amb-7", name: "Western Regional Hospital Ambulance", district: "Pokhara", phone: "+977 61 520067", is24x7: true },
  { id: "amb-8", name: "Bharatpur Hospital Ambulance", district: "Chitwan", phone: "+977 56 524101", is24x7: true },
];

export type PharmacyItem = {
  id: string;
  name: string;
  district: string;
  address: string;
  phone: string;
  is24x7: boolean;
  hasDelivery: boolean;
};

export type MedicineItem = {
  id: string;
  genericName: string;
  brandNames: string;
  approxPriceNpr: string;
  category: string;
};

export const verifiedPharmacies: PharmacyItem[] = [
  {
    id: "ph-1",
    name: "Sajha Swasthya Sewa (Sajha Pharmacy)",
    district: "Kathmandu",
    address: "Maharajgunj (Opposite TUTH), Kathmandu",
    phone: "+977 1 4414582",
    is24x7: true,
    hasDelivery: true,
  },
  {
    id: "ph-2",
    name: "Alka Pharmacy & Medical Hall",
    district: "Lalitpur",
    address: "Jawalakhel, Lalitpur",
    phone: "+977 1 5555555",
    is24x7: true,
    hasDelivery: true,
  },
  {
    id: "ph-3",
    name: "Patan Hospital Community Pharmacy",
    district: "Lalitpur",
    address: "Lagankhel, Lalitpur",
    phone: "+977 1 5522295",
    is24x7: true,
    hasDelivery: false,
  },
  {
    id: "ph-4",
    name: "Metro Care Pharmacy",
    district: "Kathmandu",
    address: "New Baneshwor, Kathmandu",
    phone: "+977 1 4782390",
    is24x7: false,
    hasDelivery: true,
  },
  {
    id: "ph-5",
    name: "Gandaki Care Pharmacy",
    district: "Pokhara",
    address: "Prithvi Chowk, Pokhara",
    phone: "+977 61 532100",
    is24x7: true,
    hasDelivery: true,
  },
];

export const commonMedicines: MedicineItem[] = [
  {
    id: "med-1",
    genericName: "Paracetamol 500mg",
    brandNames: "Cetmol, Napa, Febrex",
    approxPriceNpr: "15 - 25",
    category: "Fever & Pain",
  },
  {
    id: "med-2",
    genericName: "Metformin 500mg",
    brandNames: "Glycomet, Cetapin",
    approxPriceNpr: "45 - 65",
    category: "Diabetes",
  },
  {
    id: "med-3",
    genericName: "Pantoprazole 40mg",
    brandNames: "Pantocid, Pan 40, Pantop",
    approxPriceNpr: "80 - 110",
    category: "Antacid & Gastric",
  },
  {
    id: "med-4",
    genericName: "Amlodipine 5mg",
    brandNames: "Amlopres, Stamlo",
    approxPriceNpr: "50 - 70",
    category: "Hypertension",
  },
  {
    id: "med-5",
    genericName: "Azithromycin 500mg",
    brandNames: "Zithromax, Azith, Azithral",
    approxPriceNpr: "120 - 160",
    category: "Antibiotic",
  },
  {
    id: "med-6",
    genericName: "Oral Rehydration Salts (ORS)",
    brandNames: "Jeevan Jal, Nava Jeevan",
    approxPriceNpr: "10 - 15",
    category: "Electrolytes",
  },
];

export type CostEstimateItem = {
  id: string;
  serviceName: string;
  category: string;
  govtNpr: string;
  privateNpr: string;
  hibCovered: boolean;
};

export const costEstimates: CostEstimateItem[] = [
  {
    id: "cost-1",
    serviceName: "General OPD Consultation",
    category: "Consultation",
    govtNpr: "50 - 100",
    privateNpr: "500 - 1,200",
    hibCovered: true,
  },
  {
    id: "cost-2",
    serviceName: "Complete Blood Count (CBC)",
    category: "Laboratory",
    govtNpr: "200 - 350",
    privateNpr: "500 - 900",
    hibCovered: true,
  },
  {
    id: "cost-3",
    serviceName: "Fasting & PP Blood Glucose",
    category: "Laboratory",
    govtNpr: "100 - 150",
    privateNpr: "250 - 450",
    hibCovered: true,
  },
  {
    id: "cost-4",
    serviceName: "Lipid Profile & Liver Function",
    category: "Laboratory",
    govtNpr: "600 - 900",
    privateNpr: "1,500 - 2,500",
    hibCovered: true,
  },
  {
    id: "cost-5",
    serviceName: "Abdominal Ultrasound (USG)",
    category: "Radiology",
    govtNpr: "500 - 800",
    privateNpr: "1,500 - 2,800",
    hibCovered: true,
  },
  {
    id: "cost-6",
    serviceName: "Brain CT Scan (Plain)",
    category: "Radiology",
    govtNpr: "2,500 - 3,500",
    privateNpr: "5,000 - 8,500",
    hibCovered: true,
  },
  {
    id: "cost-7",
    serviceName: "General Ward Bed (per day)",
    category: "Inpatient",
    govtNpr: "100 - 300",
    privateNpr: "1,500 - 4,000",
    hibCovered: true,
  },
];
