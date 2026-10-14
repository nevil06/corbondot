import React, { createContext, useContext, useState } from 'react';
import {
  CarbonProject,
  QuoteRequest,
  PortfolioHolding,
  RetirementRecord,
  SellerInventoryItem,
  BuyerInquiry,
  SellerVerificationItem,
  ListingApprovalItem,
  INITIAL_PROJECTS,
  INITIAL_QUOTES,
  INITIAL_HOLDINGS,
  INITIAL_CERTIFICATES,
  INITIAL_INVENTORY,
  INITIAL_INQUIRIES,
  INITIAL_SELLER_VERIFICATIONS,
  INITIAL_LISTING_APPROVALS
} from '../data/mockData';
import { useToast } from '../components/Toast/ToastContext';

interface CarbonAppContextType {
  projects: CarbonProject[];
  shortlist: string[];
  quotes: QuoteRequest[];
  holdings: PortfolioHolding[];
  certificates: RetirementRecord[];
  inventory: SellerInventoryItem[];
  inquiries: BuyerInquiry[];
  sellerVerifications: SellerVerificationItem[];
  listingApprovals: ListingApprovalItem[];
  
  // Actions
  toggleShortlist: (projectId: string) => boolean;
  isInShortlist: (projectId: string) => boolean;
  clearShortlist: () => void;
  submitQuoteRequest: (params: {
    projectId: string;
    requestedCredits: number;
    targetPricePerCredit: number;
    notes?: string;
  }) => string;
  acceptQuote: (quoteId: string) => void;
  rejectQuote: (quoteId: string) => void;
  retireHolding: (params: {
    holdingId: string;
    creditsToRetire: number;
    beneficiaryName: string;
    retirementReason: string;
  }) => string | null;
  submitNewProject: (project: Partial<CarbonProject>) => string;
  respondToInquiry: (inquiryId: string, offerPrice: number) => void;
  rejectInquiry: (inquiryId: string) => void;
  approveSellerKYC: (sellerId: string) => void;
  rejectSellerKYC: (sellerId: string) => void;
  approveListing: (listingId: string) => void;
  rejectListing: (listingId: string) => void;
}

const CarbonAppContext = createContext<CarbonAppContextType | undefined>(undefined);

export const CarbonAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [projects, setProjects] = useState<CarbonProject[]>(INITIAL_PROJECTS);
  const [shortlist, setShortlist] = useState<string[]>(['prj-od-01', 'prj-ka-02']); // 2 initial for compare demo
  const [quotes, setQuotes] = useState<QuoteRequest[]>(INITIAL_QUOTES);
  const [holdings, setHoldings] = useState<PortfolioHolding[]>(INITIAL_HOLDINGS);
  const [certificates, setCertificates] = useState<RetirementRecord[]>(INITIAL_CERTIFICATES);
  const [inventory, setInventory] = useState<SellerInventoryItem[]>(INITIAL_INVENTORY);
  const [inquiries, setInquiries] = useState<BuyerInquiry[]>(INITIAL_INQUIRIES);
  const [sellerVerifications, setSellerVerifications] = useState<SellerVerificationItem[]>(INITIAL_SELLER_VERIFICATIONS);
  const [listingApprovals, setListingApprovals] = useState<ListingApprovalItem[]>(INITIAL_LISTING_APPROVALS);

  const isInShortlist = (projectId: string) => shortlist.includes(projectId);

  const toggleShortlist = (projectId: string): boolean => {
    if (shortlist.includes(projectId)) {
      setShortlist((prev) => prev.filter((id) => id !== projectId));
      showToast('Removed from comparison shortlist', 'info');
      return false;
    } else {
      if (shortlist.length >= 4) {
        showToast('Maximum 4 projects can be compared side-by-side', 'warning');
        return false;
      }
      setShortlist((prev) => [...prev, projectId]);
      showToast('Added to comparison shortlist (2–4 projects)', 'success');
      return true;
    }
  };

  const clearShortlist = () => {
    setShortlist([]);
    showToast('Comparison shortlist cleared', 'info');
  };

  const submitQuoteRequest = ({
    projectId,
    requestedCredits,
    targetPricePerCredit,
    notes = ''
  }: {
    projectId: string;
    requestedCredits: number;
    targetPricePerCredit: number;
    notes?: string;
  }): string => {
    const project = projects.find((p) => p.id === projectId);
    const quoteId = `QTE-2024-${Math.floor(100 + Math.random() * 900)}`;
    const newQuote: QuoteRequest = {
      id: quoteId,
      projectId,
      projectName: project ? project.name : 'Carbon Offset Project',
      developer: project ? project.developer : 'Verified Developer',
      registry: project ? `${project.registry} (${project.registryId})` : 'Verra',
      requestedCredits,
      targetPricePerCredit,
      totalValue: requestedCredits * targetPricePerCredit,
      status: 'Pending',
      requestDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      expiryDate: new Date(Date.now() + 14 * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      notes
    };

    setQuotes((prev) => [newQuote, ...prev]);
    showToast(`Quote request #${quoteId} submitted successfully`, 'success');
    return quoteId;
  };

  const acceptQuote = (quoteId: string) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, status: 'Accepted' } : q))
    );
    showToast(`Quote #${quoteId} accepted. Credits transferred to Portfolio.`, 'success');
  };

  const rejectQuote = (quoteId: string) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, status: 'Rejected' } : q))
    );
    showToast(`Quote #${quoteId} declined`, 'info');
  };

  const retireHolding = ({
    holdingId,
    creditsToRetire,
    beneficiaryName,
    retirementReason
  }: {
    holdingId: string;
    creditsToRetire: number;
    beneficiaryName: string;
    retirementReason: string;
  }): string | null => {
    const targetHolding = holdings.find((h) => h.id === holdingId);
    if (!targetHolding || targetHolding.creditsHeld < creditsToRetire) {
      showToast('Insufficient credits available to retire', 'error');
      return null;
    }

    const certId = `CERT-IN-2024-${Math.floor(1000 + Math.random() * 9000)}`;
    const certNum = `CBN-RET-2024-IN-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCert: RetirementRecord = {
      id: certId,
      certificateNumber: certNum,
      projectId: targetHolding.projectId,
      projectName: targetHolding.projectName,
      developer: 'Vanya Climate Foundation',
      registry: targetHolding.registry,
      registryId: targetHolding.registryId,
      vintage: targetHolding.vintage,
      creditsRetired: creditsToRetire,
      beneficiaryName,
      retirementReason,
      retirementDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      serialNumberRange: `${targetHolding.registryId}-${targetHolding.vintage}-${Math.floor(10000 + Math.random() * 90000)}`,
      blockchainTxHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
    };

    setCertificates((prev) => [newCert, ...prev]);

    // Update holdings
    setHoldings((prev) =>
      prev
        .map((h) => {
          if (h.id === holdingId) {
            const remaining = h.creditsHeld - creditsToRetire;
            return {
              ...h,
              creditsHeld: remaining,
              status: remaining > 0 ? ('Partially Retired' as const) : ('Active' as const)
            };
          }
          return h;
        })
        .filter((h) => h.creditsHeld > 0)
    );

    showToast(`Successfully retired ${creditsToRetire.toLocaleString('en-IN')} credits!`, 'success');
    return certId;
  };

  const submitNewProject = (projectData: Partial<CarbonProject>): string => {
    const newId = `prj-in-${Math.floor(100 + Math.random() * 900)}`;
    const newProject: CarbonProject = {
      id: newId,
      name: projectData.name || 'Untitled Carbon Project',
      code: `CARB-NEW-${Math.floor(10 + Math.random() * 90)}`,
      registry: (projectData.registry as CarbonProject['registry']) || 'Verra',
      registryId: projectData.registryId || 'VCS-PENDING',
      category: (projectData.category as CarbonProject['category']) || 'Afforestation',
      type: (projectData.type as CarbonProject['type']) || 'Removal',
      location: projectData.location || 'Bhubaneswar',
      state: projectData.state || 'Odisha',
      country: 'India',
      vintage: projectData.vintage || 2024,
      availableCredits: projectData.availableCredits || 10000,
      totalVolume: projectData.totalVolume || 50000,
      pricePerCredit: projectData.pricePerCredit || 1200,
      rating: 4.8,
      verificationStatus: 'Under Review',
      developer: projectData.developer || 'Registered Developer Ltd',
      description: projectData.description || 'Verified nature-based sequestration initiative.',
      methodology: projectData.methodology || 'VM0007 REDD+',
      additionalityScore: '95% Rigorous Baseline',
      permanenceRisk: 'Low',
      coBenefitsSDGs: [13, 15],
      lifecycleStage: 3,
      priceHistory: [
        { month: 'Jul 24', price: projectData.pricePerCredit || 1200 },
        { month: 'Sep 24', price: projectData.pricePerCredit || 1200 }
      ]
    };

    setProjects((prev) => [newProject, ...prev]);

    // Add to inventory
    const newInv: SellerInventoryItem = {
      id: `INV-${Math.floor(10 + Math.random() * 90)}`,
      projectId: newId,
      batchNumber: `${newProject.registryId}-B1`,
      projectName: newProject.name,
      vintage: newProject.vintage,
      totalIssued: newProject.totalVolume,
      available: newProject.availableCredits,
      allocated: 0,
      sold: 0,
      basePrice: newProject.pricePerCredit,
      status: 'Under Review',
      registry: newProject.registry
    };
    setInventory((prev) => [newInv, ...prev]);

    showToast('Project submitted for verification and added to inventory', 'success');
    return newId;
  };

  const respondToInquiry = (inquiryId: string, offerPrice: number) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === inquiryId ? { ...inq, status: 'Responded' } : inq))
    );
    showToast(`Quotation sent at ₹${offerPrice.toLocaleString('en-IN')}/credit`, 'success');
  };

  const rejectInquiry = (inquiryId: string) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === inquiryId ? { ...inq, status: 'Rejected' } : inq))
    );
    showToast('Inquiry declined', 'info');
  };

  const approveSellerKYC = (sellerId: string) => {
    setSellerVerifications((prev) =>
      prev.map((v) => (v.id === sellerId ? { ...v, status: 'Verified' } : v))
    );
    showToast('Seller corporate verification approved', 'success');
  };

  const rejectSellerKYC = (sellerId: string) => {
    setSellerVerifications((prev) =>
      prev.map((v) => (v.id === sellerId ? { ...v, status: 'Rejected' } : v))
    );
    showToast('Seller verification rejected', 'error');
  };

  const approveListing = (listingId: string) => {
    setListingApprovals((prev) =>
      prev.map((l) => (l.id === listingId ? { ...l, status: 'Listed' } : l))
    );
    showToast('Listing approved and published to Marketplace', 'success');
  };

  const rejectListing = (listingId: string) => {
    setListingApprovals((prev) =>
      prev.map((l) => (l.id === listingId ? { ...l, status: 'Rejected' } : l))
    );
    showToast('Listing returned with notes', 'error');
  };

  return (
    <CarbonAppContext.Provider
      value={{
        projects,
        shortlist,
        quotes,
        holdings,
        certificates,
        inventory,
        inquiries,
        sellerVerifications,
        listingApprovals,
        toggleShortlist,
        isInShortlist,
        clearShortlist,
        submitQuoteRequest,
        acceptQuote,
        rejectQuote,
        retireHolding,
        submitNewProject,
        respondToInquiry,
        rejectInquiry,
        approveSellerKYC,
        rejectSellerKYC,
        approveListing,
        rejectListing
      }}
    >
      {children}
    </CarbonAppContext.Provider>
  );
};

export const useCarbonApp = () => {
  const context = useContext(CarbonAppContext);
  if (!context) {
    throw new Error('useCarbonApp must be used within CarbonAppProvider');
  }
  return context;
};
