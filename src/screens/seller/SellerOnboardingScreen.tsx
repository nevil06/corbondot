import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stepper } from '../../components/Stepper/Stepper';
import { Button } from '../../components/Button/Button';
import { useToast } from '../../components/Toast/ToastContext';
import {
  Building2,
  UserCheck,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Trash2,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import './SellerOnboardingScreen.css';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

export const SellerOnboardingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState(0);

  // Form State
  const [companyName, setCompanyName] = useState('Vanya EcoTech Solutions Private Limited');
  const [cinNumber, setCinNumber] = useState('U01400OR2020PTC034567');
  const [gstnNumber, setGstnNumber] = useState('21AABCV9981K1ZP');
  const [state, setState] = useState('Odisha');
  const [address, setAddress] = useState('Plot 45, Chandaka Industrial Estate, Bhubaneswar');

  const [contactName, setContactName] = useState('Dr. Anita Mohapatra');
  const [contactEmail, setContactEmail] = useState('anita.mohapatra@vanyaecotech.mock');
  const [contactPhone, setContactPhone] = useState('+91 98765 43210');
  const [designation, setDesignation] = useState('Chief Sustainability Officer & Proponent');

  const [registryAccount, setRegistryAccount] = useState('Verra (VCS Account #99214)');
  const [developerExperience, setDeveloperExperience] = useState('5-10 Years');

  // Simulated Files Whitelist (PDF, PNG, JPG max 10MB)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    { name: 'Certificate_of_Incorporation.pdf', size: 2450000, type: 'application/pdf' },
    { name: 'GSTN_Registration_Certificate.pdf', size: 1120000, type: 'application/pdf' }
  ]);
  const [uploadError, setUploadError] = useState('');

  const steps = [
    { label: 'Company Info', description: 'Legal corporate identity' },
    { label: 'Contact', description: 'Authorised officer' },
    { label: 'Verification', description: 'GSTN & Registry ID' },
    { label: 'Documents', description: 'Due diligence uploads' },
    { label: 'Review', description: 'Final compliance check' },
    { label: 'Submit', description: 'Complete onboarding' }
  ];

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg'];
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';

    // Security Rule 7: Whitelist types and cap size at 10 MB
    if (!allowedExtensions.includes(fileExt)) {
      setUploadError('Invalid file type. Only PDF, PNG, and JPG files are accepted.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File exceeds 10 MB maximum limit.');
      return;
    }

    setUploadedFiles((prev) => [
      ...prev,
      { name: file.name, size: file.size, type: file.type }
    ]);
    showToast(`Attached ${file.name}`, 'info');
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const handleSubmitOnboarding = () => {
    showToast('Corporate Onboarding Dossier submitted for Admin compliance review!', 'success');
    navigate('/seller/dashboard');
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-header">
        <h1 className="onboarding-title">Seller Onboarding & KYC Wizard</h1>
        <p className="onboarding-subtitle">
          Six-step enterprise verification workflow to list carbon credits on the Carbonly institutional registry.
        </p>
      </div>

      {/* Stepper Progress Indicator */}
      <div className="onboarding-stepper-wrapper">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      {/* Wizard Card Body */}
      <div className="onboarding-card">
        {/* Step 1: Company Info */}
        {currentStep === 0 && (
          <div className="wizard-step-pane">
            <h2 className="step-heading">
              <Building2 size={20} className="step-icon" /> Step 1: Corporate Legal Information
            </h2>
            <div className="wizard-grid">
              <div className="wizard-field full-width">
                <label htmlFor="company-name" className="wizard-label">Registered Corporate Legal Name *</label>
                <input
                  id="company-name"
                  type="text"
                  className="wizard-input"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div className="wizard-field">
                <label htmlFor="cin-no" className="wizard-label">Corporate Identification Number (CIN) *</label>
                <input
                  id="cin-no"
                  type="text"
                  className="wizard-input font-mono"
                  value={cinNumber}
                  onChange={(e) => setCinNumber(e.target.value)}
                />
              </div>
              <div className="wizard-field">
                <label htmlFor="registered-state" className="wizard-label">Registered Indian State *</label>
                <select
                  id="registered-state"
                  className="wizard-select"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="Odisha">Odisha</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                </select>
              </div>
              <div className="wizard-field full-width">
                <label htmlFor="office-address" className="wizard-label">Registered Office Address *</label>
                <input
                  id="office-address"
                  type="text"
                  className="wizard-input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Contact Person */}
        {currentStep === 1 && (
          <div className="wizard-step-pane">
            <h2 className="step-heading">
              <UserCheck size={20} className="step-icon" /> Step 2: Authorised Representative
            </h2>
            <div className="wizard-grid">
              <div className="wizard-field">
                <label htmlFor="contact-name" className="wizard-label">Primary Proponent Officer Name *</label>
                <input
                  id="contact-name"
                  type="text"
                  className="wizard-input"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </div>
              <div className="wizard-field">
                <label htmlFor="designation" className="wizard-label">Corporate Designation *</label>
                <input
                  id="designation"
                  type="text"
                  className="wizard-input"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                />
              </div>
              <div className="wizard-field">
                <label htmlFor="contact-email" className="wizard-label">Corporate Email Address *</label>
                <input
                  id="contact-email"
                  type="email"
                  className="wizard-input"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>
              <div className="wizard-field">
                <label htmlFor="contact-phone" className="wizard-label">Direct Contact Phone *</label>
                <input
                  id="contact-phone"
                  type="tel"
                  className="wizard-input"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Business Verification */}
        {currentStep === 2 && (
          <div className="wizard-step-pane">
            <h2 className="step-heading">
              <FileCheck size={20} className="step-icon" /> Step 3: Tax & Registry Credentials
            </h2>
            <div className="wizard-grid">
              <div className="wizard-field">
                <label htmlFor="gstn-input" className="wizard-label">GSTN Registration Number *</label>
                <input
                  id="gstn-input"
                  type="text"
                  className="wizard-input font-mono"
                  value={gstnNumber}
                  onChange={(e) => setGstnNumber(e.target.value)}
                />
              </div>
              <div className="wizard-field">
                <label htmlFor="registry-acc" className="wizard-label">Primary Voluntary Carbon Registry Account *</label>
                <input
                  id="registry-acc"
                  type="text"
                  className="wizard-input"
                  value={registryAccount}
                  onChange={(e) => setRegistryAccount(e.target.value)}
                />
              </div>
              <div className="wizard-field full-width">
                <label htmlFor="dev-exp" className="wizard-label">Project Development Track Record</label>
                <select
                  id="dev-exp"
                  className="wizard-select"
                  value={developerExperience}
                  onChange={(e) => setDeveloperExperience(e.target.value)}
                >
                  <option value="1-3 Years">1–3 Years (Emerging Proponent)</option>
                  <option value="3-5 Years">3–5 Years (Established Developer)</option>
                  <option value="5-10 Years">5–10 Years (Senior Project Developer)</option>
                  <option value="10+ Years">10+ Years (Institutional Originator)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Documents Upload UI (Simulated) */}
        {currentStep === 3 && (
          <div className="wizard-step-pane">
            <h2 className="step-heading">
              <UploadCloud size={20} className="step-icon" /> Step 4: Verification Documentation Upload
            </h2>
            <p className="wizard-hint">
              Security Notice: Client-side simulated upload. Accepts whitelisted types only (PDF, PNG, JPG ≤ 10 MB).
            </p>

            <div className="upload-dropzone">
              <UploadCloud size={36} className="upload-icon" />
              <div className="upload-text">
                <strong>Click to browse or drop compliance files</strong>
                <span>Certificate of Incorporation, Board Resolution, PAN, GST Certificate</span>
              </div>
              <input
                type="file"
                id="file-upload-input"
                className="file-input-hidden"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleSimulatedFileUpload}
              />
              <label htmlFor="file-upload-input" className="upload-btn-label">
                Select Local File
              </label>
            </div>

            {uploadError && (
              <div className="upload-error" role="alert">
                <AlertCircle size={16} /> {uploadError}
              </div>
            )}

            <div className="attached-files-list">
              <h3 className="attached-heading">Attached Documents ({uploadedFiles.length})</h3>
              {uploadedFiles.map((f, i) => (
                <div key={i} className="attached-file-item">
                  <div className="file-info">
                    <FileText size={18} className="file-icon" />
                    <div>
                      <span className="file-name">{f.name}</span>
                      <span className="file-size">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="remove-file-btn"
                    onClick={() => removeFile(i)}
                    aria-label={`Remove ${f.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {currentStep === 4 && (
          <div className="wizard-step-pane">
            <h2 className="step-heading">
              <CheckCircle2 size={20} className="step-icon" /> Step 5: Review Application Dossier
            </h2>
            <div className="review-dossier">
              <div className="review-section">
                <h3 className="review-sec-title">Corporate Information</h3>
                <div className="review-row"><span>Entity Name:</span> <strong>{companyName}</strong></div>
                <div className="review-row"><span>CIN:</span> <code>{cinNumber}</code></div>
                <div className="review-row"><span>State & Address:</span> <span>{state} • {address}</span></div>
              </div>

              <div className="review-section">
                <h3 className="review-sec-title">Authorised Contact</h3>
                <div className="review-row"><span>Officer:</span> <strong>{contactName} ({designation})</strong></div>
                <div className="review-row"><span>Email & Phone:</span> <span>{contactEmail} • {contactPhone}</span></div>
              </div>

              <div className="review-section">
                <h3 className="review-sec-title">Registry Credentials & Documents</h3>
                <div className="review-row"><span>GSTN:</span> <code>{gstnNumber}</code></div>
                <div className="review-row"><span>Registry Account:</span> <span>{registryAccount}</span></div>
                <div className="review-row"><span>Uploaded Files:</span> <strong>{uploadedFiles.length} files attached</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Submit Confirmation */}
        {currentStep === 5 && (
          <div className="wizard-step-pane text-center">
            <CheckCircle2 size={56} className="success-icon" />
            <h2 className="step-heading center">Ready to Submit for Governance Audit</h2>
            <p className="wizard-hint center">
              By submitting this onboarding dossier, you certify that all corporate information and registry accounts are accurate under Indian Company Law and Voluntary Carbon Market frameworks.
            </p>
            <div className="submit-action-box">
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmitOnboarding}
              >
                Submit Dossier to Carbonly Compliance Desk
              </Button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="wizard-actions">
          {currentStep > 0 && currentStep < 5 && (
            <Button variant="outline" onClick={handlePrev}>
              <ArrowLeft size={16} /> Previous
            </Button>
          )}
          <div style={{ marginLeft: 'auto' }}>
            {currentStep < 5 && (
              <Button variant="primary" onClick={handleNext}>
                Continue <ArrowRight size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
