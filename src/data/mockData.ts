export interface CarbonProject {
  id: string;
  name: string;
  code: string;
  registry: 'Verra' | 'Gold Standard' | 'Puro.earth';
  registryId: string;
  category: 'Afforestation' | 'Renewable Energy' | 'Soil Carbon' | 'Mangrove Restoration' | 'Direct Air Capture' | 'Biochar';
  type: 'Removal' | 'Reduction';
  location: string;
  state: string;
  country: string;
  vintage: number;
  availableCredits: number;
  totalVolume: number;
  pricePerCredit: number; // in INR (₹)
  rating: number; // e.g. 4.8
  verificationStatus: 'Verified' | 'Under Review' | 'Listed' | 'Pending';
  developer: string;
  description: string;
  methodology: string;
  additionalityScore: string;
  permanenceRisk: 'Low' | 'Medium' | 'Negligible';
  coBenefitsSDGs: number[]; // e.g. [8, 13, 15]
  priceHistory: { month: string; price: number }[];
  lifecycleStage: number; // 1: Feasibility, 2: Validation, 3: Verification, 4: Issuance
  featured?: boolean;
}

export interface QuoteRequest {
  id: string;
  projectId: string;
  projectName: string;
  developer: string;
  registry: string;
  requestedCredits: number;
  targetPricePerCredit: number;
  totalValue: number;
  status: 'Pending' | 'Responded' | 'Accepted' | 'Rejected';
  requestDate: string;
  expiryDate: string;
  notes: string;
  sellerOffer?: {
    offeredPrice: number;
    offeredVolume: number;
    deliveryDate: string;
    message: string;
  };
}

export interface PortfolioHolding {
  id: string;
  projectId: string;
  projectName: string;
  registry: string;
  registryId: string;
  vintage: number;
  creditsHeld: number;
  purchasePrice: number;
  currentValue: number;
  purchaseDate: string;
  status: 'Active' | 'Partially Retired';
}

export interface RetirementRecord {
  id: string;
  certificateNumber: string;
  projectId: string;
  projectName: string;
  developer: string;
  registry: string;
  registryId: string;
  vintage: number;
  creditsRetired: number;
  beneficiaryName: string;
  retirementReason: string;
  retirementDate: string;
  serialNumberRange: string;
  blockchainTxHash: string;
}

export interface SellerInventoryItem {
  id: string;
  projectId: string;
  batchNumber: string;
  projectName: string;
  vintage: number;
  totalIssued: number;
  available: number;
  allocated: number;
  sold: number;
  basePrice: number;
  status: 'Listed' | 'Under Review' | 'Sold' | 'Draft';
  registry: string;
}

export interface BuyerInquiry {
  id: string;
  buyerCompany: string;
  buyerContact: string;
  projectId: string;
  projectName: string;
  volumeRequested: number;
  targetPrice: number;
  date: string;
  status: 'Pending' | 'Responded' | 'Rejected';
  buyerNote: string;
}

export interface SellerVerificationItem {
  id: string;
  companyName: string;
  legalEntityId: string; // GSTN / CIN
  registeredState: string;
  contactPerson: string;
  contactEmail: string;
  submissionDate: string;
  documentCount: number;
  documents: { name: string; type: string; size: string; status: 'Verified' | 'Pending' }[];
  status: 'Under Review' | 'Verified' | 'Rejected';
  riskScore: 'Low' | 'Medium' | 'High';
}

export interface ListingApprovalItem {
  id: string;
  projectName: string;
  developer: string;
  registry: string;
  methodology: string;
  vintage: number;
  volume: number;
  proposedPrice: number;
  submissionDate: string;
  status: 'Under Review' | 'Listed' | 'Rejected';
  checklist: {
    additionalityVerified: boolean;
    baselineAudited: boolean;
    landTitleClearance: boolean;
    registryIssuanceLetter: boolean;
    esgSafeguardsChecked: boolean;
  };
}

export interface AdminUser {
  id: string;
  name: string;
  company: string;
  role: 'Buyer' | 'Seller' | 'Admin';
  email: string;
  status: 'Verified' | 'Pending' | 'Rejected';
  joinDate: string;
  totalVolume: number;
}

export interface AdminTransaction {
  id: string;
  txHash: string;
  buyerName: string;
  sellerName: string;
  projectName: string;
  credits: number;
  amount: number;
  date: string;
  status: 'Listed' | 'Sold' | 'Retired';
}

export const INITIAL_PROJECTS: CarbonProject[] = [
  {
    id: 'prj-od-01',
    name: 'Eastern Ghats Community Reforestation',
    code: 'CARB-OD-001',
    registry: 'Verra',
    registryId: 'VCS-2394',
    category: 'Afforestation',
    type: 'Removal',
    location: 'Koraput & Rayagada',
    state: 'Odisha',
    country: 'India',
    vintage: 2023,
    availableCredits: 85000,
    totalVolume: 250000,
    pricePerCredit: 1250,
    rating: 4.9,
    verificationStatus: 'Verified',
    developer: 'Vanya Climate Foundation',
    description: 'High-permanence mixed native afforestation restoring 14,000 hectares of degraded tribal forest lands in Odisha with direct community revenue sharing.',
    methodology: 'VM0007 REDD+ & ARR',
    additionalityScore: '98% Positive Additionality',
    permanenceRisk: 'Low',
    coBenefitsSDGs: [1, 8, 13, 15],
    lifecycleStage: 4,
    featured: true,
    priceHistory: [
      { month: 'Oct 23', price: 1100 },
      { month: 'Dec 23', price: 1150 },
      { month: 'Feb 24', price: 1180 },
      { month: 'Apr 24', price: 1200 },
      { month: 'Jun 24', price: 1240 },
      { month: 'Aug 24', price: 1250 }
    ]
  },
  {
    id: 'prj-ka-02',
    name: 'Karnataka Agri-Photovoltaic Clean Power',
    code: 'CARB-KA-002',
    registry: 'Gold Standard',
    registryId: 'GS-8910',
    category: 'Renewable Energy',
    type: 'Reduction',
    location: 'Pavagada Solar Park',
    state: 'Karnataka',
    country: 'India',
    vintage: 2024,
    availableCredits: 140000,
    totalVolume: 500000,
    pricePerCredit: 720,
    rating: 4.7,
    verificationStatus: 'Verified',
    developer: 'Surya CleanTech Solutions Ltd.',
    description: 'Grid-connected dual-use solar generation displacing fossil-heavy thermal grid emissions while preserving agricultural ground underneath for horticulture.',
    methodology: 'ACM0002 Grid Solar Electricity',
    additionalityScore: '94% Grid Benchmark Displaced',
    permanenceRisk: 'Negligible',
    coBenefitsSDGs: [7, 8, 9, 13],
    lifecycleStage: 4,
    featured: true,
    priceHistory: [
      { month: 'Jan 24', price: 680 },
      { month: 'Mar 24', price: 690 },
      { month: 'May 24', price: 705 },
      { month: 'Jul 24', price: 715 },
      { month: 'Sep 24', price: 720 }
    ]
  },
  {
    id: 'prj-pb-03',
    name: 'Punjab Regenerative Biochar & Crop Residue',
    code: 'CARB-PB-003',
    registry: 'Puro.earth',
    registryId: 'PURO-PB-142',
    category: 'Biochar',
    type: 'Removal',
    location: 'Ludhiana & Sangrur',
    state: 'Punjab',
    country: 'India',
    vintage: 2024,
    availableCredits: 32000,
    totalVolume: 75000,
    pricePerCredit: 3400,
    rating: 4.95,
    verificationStatus: 'Verified',
    developer: 'Indo-Nordic Carbon Sink',
    description: 'Pyrolysis valorization of paddy stubble preventing hazardous seasonal stubble burnings, locking organic carbon in farmland soils for 1000+ years.',
    methodology: 'Puro Biochar Standard v2',
    additionalityScore: '99% Absolute Air Quality Disruption Solved',
    permanenceRisk: 'Negligible',
    coBenefitsSDGs: [3, 9, 12, 13, 15],
    lifecycleStage: 4,
    featured: true,
    priceHistory: [
      { month: 'Feb 24', price: 3100 },
      { month: 'Apr 24', price: 3250 },
      { month: 'Jun 24', price: 3320 },
      { month: 'Aug 24', price: 3400 }
    ]
  },
  {
    id: 'prj-mh-04',
    name: 'Western Ghats Bamboo Biomass Sink',
    code: 'CARB-MH-004',
    registry: 'Verra',
    registryId: 'VCS-3108',
    category: 'Soil Carbon',
    type: 'Removal',
    location: 'Ratnagiri Watershed',
    state: 'Maharashtra',
    country: 'India',
    vintage: 2023,
    availableCredits: 52000,
    totalVolume: 120000,
    pricePerCredit: 1650,
    rating: 4.65,
    verificationStatus: 'Verified',
    developer: 'Sahyadri Ecology Trust',
    description: 'Rapid sequestering native giant bamboo cultivation on barren slopes, stabilizing river catchments and building deep soil organic matter.',
    methodology: 'VM0042 Improved Agricultural Land',
    additionalityScore: '91% Watershed Restoration Verified',
    permanenceRisk: 'Low',
    coBenefitsSDGs: [6, 12, 13, 15],
    lifecycleStage: 4,
    featured: false,
    priceHistory: [
      { month: 'Oct 23', price: 1500 },
      { month: 'Jan 24', price: 1580 },
      { month: 'Apr 24', price: 1620 },
      { month: 'Jul 24', price: 1650 }
    ]
  },
  {
    id: 'prj-tn-05',
    name: 'Sundarbans & Gulf of Mannar Blue Carbon',
    code: 'CARB-TN-005',
    registry: 'Gold Standard',
    registryId: 'GS-7741',
    category: 'Mangrove Restoration',
    type: 'Removal',
    location: 'Ramanathapuram Coast',
    state: 'Tamil Nadu',
    country: 'India',
    vintage: 2023,
    availableCredits: 41000,
    totalVolume: 90000,
    pricePerCredit: 2800,
    rating: 4.88,
    verificationStatus: 'Verified',
    developer: 'Coastal Mangrove Alliance',
    description: 'Coastal saline wetland restoration creating a multi-layered tidal buffer against cyclones while burying oceanic blue carbon sediment.',
    methodology: 'VM0033 Tidal Wetland Restoration',
    additionalityScore: '96% Coastal Surge Protection Standard',
    permanenceRisk: 'Low',
    coBenefitsSDGs: [8, 13, 14, 15],
    lifecycleStage: 4,
    featured: true,
    priceHistory: [
      { month: 'Nov 23', price: 2550 },
      { month: 'Feb 24', price: 2680 },
      { month: 'May 24', price: 2750 },
      { month: 'Aug 24', price: 2800 }
    ]
  },
  {
    id: 'prj-hp-06',
    name: 'Himalayan Direct Air Capture Pilot',
    code: 'CARB-HP-006',
    registry: 'Puro.earth',
    registryId: 'PURO-DAC-007',
    category: 'Direct Air Capture',
    type: 'Removal',
    location: 'Solan Geothermal Zone',
    state: 'Himachal Pradesh',
    country: 'India',
    vintage: 2024,
    availableCredits: 9500,
    totalVolume: 15000,
    pricePerCredit: 8200,
    rating: 4.92,
    verificationStatus: 'Under Review',
    developer: 'Himalayan PureZero Labs',
    description: 'Renewable-powered solid sorbent direct atmospheric capture coupled with underground mineralized basalt carbon mineralization.',
    methodology: 'Puro DACCS Standard v1',
    additionalityScore: '100% Engineered Permanent Storage',
    permanenceRisk: 'Negligible',
    coBenefitsSDGs: [9, 13],
    lifecycleStage: 3,
    featured: false,
    priceHistory: [
      { month: 'May 24', price: 8500 },
      { month: 'Jul 24', price: 8350 },
      { month: 'Sep 24', price: 8200 }
    ]
  }
];

export const INITIAL_QUOTES: QuoteRequest[] = [
  {
    id: 'QTE-2024-881',
    projectId: 'prj-od-01',
    projectName: 'Eastern Ghats Community Reforestation',
    developer: 'Vanya Climate Foundation',
    registry: 'Verra (VCS-2394)',
    requestedCredits: 12500,
    targetPricePerCredit: 1200,
    totalValue: 15000000,
    status: 'Responded',
    requestDate: '10 Oct 2024',
    expiryDate: '24 Oct 2024',
    notes: 'Required for Q4 ESG compliance portfolio. Immediate settlement preferred.',
    sellerOffer: {
      offeredPrice: 1220,
      offeredVolume: 12500,
      deliveryDate: '28 Oct 2024',
      message: 'We can allocate the 12,500 credits at ₹1,220 with immediate Verra serial transfers upon receipt.'
    }
  },
  {
    id: 'QTE-2024-814',
    projectId: 'prj-ka-02',
    projectName: 'Karnataka Agri-Photovoltaic Clean Power',
    developer: 'Surya CleanTech Solutions Ltd.',
    registry: 'Gold Standard (GS-8910)',
    requestedCredits: 25000,
    targetPricePerCredit: 700,
    totalValue: 17500000,
    status: 'Pending',
    requestDate: '12 Oct 2024',
    expiryDate: '26 Oct 2024',
    notes: 'Multi-year corporate scope 2 offset mandate.'
  },
  {
    id: 'QTE-2024-742',
    projectId: 'prj-pb-03',
    projectName: 'Punjab Regenerative Biochar & Crop Residue',
    developer: 'Indo-Nordic Carbon Sink',
    registry: 'Puro.earth (PURO-PB-142)',
    requestedCredits: 5000,
    targetPricePerCredit: 3300,
    totalValue: 16500000,
    status: 'Accepted',
    requestDate: '28 Sep 2024',
    expiryDate: '12 Oct 2024',
    notes: 'Net Zero 2030 corporate commitment benchmark.',
    sellerOffer: {
      offeredPrice: 3350,
      offeredVolume: 5000,
      deliveryDate: '05 Oct 2024',
      message: 'Accepted offer with delivery into Carbonly escrow holding.'
    }
  }
];

export const INITIAL_HOLDINGS: PortfolioHolding[] = [
  {
    id: 'HLD-001',
    projectId: 'prj-od-01',
    projectName: 'Eastern Ghats Community Reforestation',
    registry: 'Verra',
    registryId: 'VCS-2394',
    vintage: 2023,
    creditsHeld: 15000,
    purchasePrice: 1180,
    currentValue: 1250,
    purchaseDate: '14 Jun 2024',
    status: 'Active'
  },
  {
    id: 'HLD-002',
    projectId: 'prj-ka-02',
    projectName: 'Karnataka Agri-Photovoltaic Clean Power',
    registry: 'Gold Standard',
    registryId: 'GS-8910',
    vintage: 2024,
    creditsHeld: 30000,
    purchasePrice: 690,
    currentValue: 720,
    purchaseDate: '19 Aug 2024',
    status: 'Active'
  },
  {
    id: 'HLD-003',
    projectId: 'prj-pb-03',
    projectName: 'Punjab Regenerative Biochar & Crop Residue',
    registry: 'Puro.earth',
    registryId: 'PURO-PB-142',
    vintage: 2024,
    creditsHeld: 5000,
    purchasePrice: 3350,
    currentValue: 3400,
    purchaseDate: '05 Oct 2024',
    status: 'Partially Retired'
  }
];

export const INITIAL_CERTIFICATES: RetirementRecord[] = [
  {
    id: 'CERT-IN-2024-0091',
    certificateNumber: 'CBN-RET-2024-IN-0091',
    projectId: 'prj-pb-03',
    projectName: 'Punjab Regenerative Biochar & Crop Residue',
    developer: 'Indo-Nordic Carbon Sink',
    registry: 'Puro.earth',
    registryId: 'PURO-PB-142',
    vintage: 2024,
    creditsRetired: 2500,
    beneficiaryName: 'Acme Enterprise India Pvt Ltd',
    retirementReason: 'FY2023-24 Scope 1 & 2 Emissions Neutralization',
    retirementDate: '08 Oct 2024',
    serialNumberRange: 'PURO-2024-PB-00142-005001-007500',
    blockchainTxHash: '0x8f2a49b819e64e5c829912c0192d77321fa9c90e668b5a764d26e95bf0a991f8'
  }
];

export const INITIAL_INQUIRIES: BuyerInquiry[] = [
  {
    id: 'INQ-901',
    buyerCompany: 'Tata Sustainability Mandate',
    buyerContact: 'sustainability@tata-corp.mock',
    projectId: 'prj-od-01',
    projectName: 'Eastern Ghats Community Reforestation',
    volumeRequested: 20000,
    targetPrice: 1210,
    date: '13 Oct 2024',
    status: 'Pending',
    buyerNote: 'Looking to contract 20k tonnes of verified ARR credits with social co-benefits.'
  },
  {
    id: 'INQ-902',
    buyerCompany: 'Infosys ESG Net-Zero Desk',
    buyerContact: 'procurement@infosys-mock.com',
    projectId: 'prj-ka-02',
    projectName: 'Karnataka Agri-Photovoltaic Clean Power',
    volumeRequested: 50000,
    targetPrice: 700,
    date: '11 Oct 2024',
    status: 'Responded',
    buyerNote: 'Bulk procurement RFP for Bangalore campuses scope 2 offset.'
  }
];

export const INITIAL_INVENTORY: SellerInventoryItem[] = [
  {
    id: 'INV-01',
    projectId: 'prj-od-01',
    batchNumber: 'VCS-2023-B1',
    projectName: 'Eastern Ghats Community Reforestation',
    vintage: 2023,
    totalIssued: 250000,
    available: 85000,
    allocated: 65000,
    sold: 100000,
    basePrice: 1250,
    status: 'Listed',
    registry: 'Verra'
  },
  {
    id: 'INV-02',
    projectId: 'prj-ka-02',
    batchNumber: 'GS-2024-B2',
    projectName: 'Karnataka Agri-Photovoltaic Clean Power',
    vintage: 2024,
    totalIssued: 500000,
    available: 140000,
    allocated: 160000,
    sold: 200000,
    basePrice: 720,
    status: 'Listed',
    registry: 'Gold Standard'
  },
  {
    id: 'INV-03',
    projectId: 'prj-mh-04',
    batchNumber: 'VCS-2024-DRAFT',
    projectName: 'Western Ghats Bamboo Biomass Sink',
    vintage: 2024,
    totalIssued: 60000,
    available: 0,
    allocated: 0,
    sold: 0,
    basePrice: 1650,
    status: 'Draft',
    registry: 'Verra'
  }
];

export const INITIAL_SELLER_VERIFICATIONS: SellerVerificationItem[] = [
  {
    id: 'VERIF-01',
    companyName: 'Vanya Climate Foundation',
    legalEntityId: '21AABCV9981K1ZP',
    registeredState: 'Odisha',
    contactPerson: 'Dr. Anita Mohapatra',
    contactEmail: 'anita@vanyaclimate.mock',
    submissionDate: '02 Oct 2024',
    documentCount: 4,
    documents: [
      { name: 'Certificate_of_Incorporation.pdf', type: 'PDF', size: '2.4 MB', status: 'Verified' },
      { name: 'GSTN_Registration_Certificate.pdf', type: 'PDF', size: '1.1 MB', status: 'Verified' },
      { name: 'Registry_Account_Statement_Verra.pdf', type: 'PDF', size: '4.8 MB', status: 'Verified' },
      { name: 'Board_Resolution_Carbon_Trading.pdf', type: 'PDF', size: '1.9 MB', status: 'Pending' }
    ],
    status: 'Under Review',
    riskScore: 'Low'
  },
  {
    id: 'VERIF-02',
    companyName: 'Deccan Agro Agroforestry Pvt Ltd',
    legalEntityId: '29AAACD4412M1Z2',
    registeredState: 'Karnataka',
    contactPerson: 'Vikram Gowda',
    contactEmail: 'vikram@deccanagro.mock',
    submissionDate: '09 Oct 2024',
    documentCount: 3,
    documents: [
      { name: 'Incorporation_Documents.pdf', type: 'PDF', size: '3.1 MB', status: 'Pending' },
      { name: 'Land_Title_Due_Diligence.pdf', type: 'PDF', size: '6.5 MB', status: 'Pending' },
      { name: 'PAN_Director_Proof.pdf', type: 'PDF', size: '0.8 MB', status: 'Verified' }
    ],
    status: 'Under Review',
    riskScore: 'Medium'
  }
];

export const INITIAL_LISTING_APPROVALS: ListingApprovalItem[] = [
  {
    id: 'LST-APPR-101',
    projectName: 'Sundarbans Blue Carbon Tidal Barrier',
    developer: 'Coastal Mangrove Alliance',
    registry: 'Gold Standard',
    methodology: 'VM0033 Tidal Wetland Restoration',
    vintage: 2024,
    volume: 65000,
    proposedPrice: 2850,
    submissionDate: '06 Oct 2024',
    status: 'Under Review',
    checklist: {
      additionalityVerified: true,
      baselineAudited: true,
      landTitleClearance: true,
      registryIssuanceLetter: false,
      esgSafeguardsChecked: true
    }
  },
  {
    id: 'LST-APPR-102',
    projectName: 'Himalayan Direct Air Capture Pilot',
    developer: 'Himalayan PureZero Labs',
    registry: 'Puro.earth',
    methodology: 'Puro DACCS Standard v1',
    vintage: 2024,
    volume: 15000,
    proposedPrice: 8200,
    submissionDate: '08 Oct 2024',
    status: 'Under Review',
    checklist: {
      additionalityVerified: true,
      baselineAudited: true,
      landTitleClearance: true,
      registryIssuanceLetter: true,
      esgSafeguardsChecked: false
    }
  }
];

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  { id: 'USR-01', name: 'Rohan Sharma', company: 'Tata Power Renewable Energy', role: 'Buyer', email: 'rohan.s@tatapower.mock', status: 'Verified', joinDate: '12 Jan 2024', totalVolume: 125000 },
  { id: 'USR-02', name: 'Dr. Anita Mohapatra', company: 'Vanya Climate Foundation', role: 'Seller', email: 'anita@vanyaclimate.mock', status: 'Verified', joinDate: '04 Mar 2024', totalVolume: 250000 },
  { id: 'USR-03', name: 'Kavita Menon', company: 'Infosys ESG Trust', role: 'Buyer', email: 'kavita.m@infosys.mock', status: 'Verified', joinDate: '18 Apr 2024', totalVolume: 90000 },
  { id: 'USR-04', name: 'Vikram Gowda', company: 'Deccan Agro Agroforestry', role: 'Seller', email: 'vikram@deccanagro.mock', status: 'Pending', joinDate: '09 Oct 2024', totalVolume: 0 },
  { id: 'USR-05', name: 'Arjun Mehra', company: 'Carbonly Oversight Desk', role: 'Admin', email: 'arjun.mehra@carbonly.mock', status: 'Verified', joinDate: '01 Jan 2024', totalVolume: 0 }
];

export const INITIAL_ADMIN_TRANSACTIONS: AdminTransaction[] = [
  { id: 'TX-8921', txHash: '0x94b...21e', buyerName: 'Tata Power Renewable Energy', sellerName: 'Vanya Climate Foundation', projectName: 'Eastern Ghats Community Reforestation', credits: 15000, amount: 18750000, date: '14 Jun 2024', status: 'Sold' },
  { id: 'TX-8922', txHash: '0x32c...78a', buyerName: 'Infosys ESG Trust', sellerName: 'Surya CleanTech Solutions Ltd.', projectName: 'Karnataka Agri-Photovoltaic Clean Power', credits: 30000, amount: 21600000, date: '19 Aug 2024', status: 'Sold' },
  { id: 'TX-8923', txHash: '0x71a...99f', buyerName: 'Acme Enterprise India Pvt Ltd', sellerName: 'Indo-Nordic Carbon Sink', projectName: 'Punjab Regenerative Biochar & Crop Residue', credits: 2500, amount: 8375000, date: '08 Oct 2024', status: 'Retired' }
];
