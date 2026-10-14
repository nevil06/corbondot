import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarbonApp } from '../../context/CarbonAppContext';
import { Button } from '../../components/Button/Button';
import { useToast } from '../../components/Toast/ToastContext';
import {
  ArrowLeft,
  UploadCloud,
  FileText,
  Trash2
} from 'lucide-react';
import './AddProjectScreen.css';

export const AddProjectScreen: React.FC = () => {
  const navigate = useNavigate();
  const { submitNewProject } = useCarbonApp();
  const { showToast } = useToast();

  const [projectName, setProjectName] = useState('Sundarbans Coastal Mangrove Restoration');
  const [category, setCategory] = useState<'Afforestation' | 'Renewable Energy' | 'Soil Carbon' | 'Mangrove Restoration' | 'Direct Air Capture' | 'Biochar'>('Mangrove Restoration');
  const [projectType, setProjectType] = useState<'Removal' | 'Reduction'>('Removal');
  const [registry, setRegistry] = useState<'Verra' | 'Gold Standard' | 'Puro.earth'>('Gold Standard');
  const [registryId, setRegistryId] = useState('GS-9942');
  const [state, setState] = useState('West Bengal');
  const [location, setLocation] = useState('Sundarbans Biosphere Reserve');
  const [vintage, setVintage] = useState<number>(2024);
  const [totalVolume, setTotalVolume] = useState<string>('50000');
  const [availableCredits, setAvailableCredits] = useState<string>('50000');
  const [pricePerCredit, setPricePerCredit] = useState<string>('2400');
  const [methodology, setMethodology] = useState('VM0033 Tidal Wetland Restoration');
  const [description, setDescription] = useState('Restoration of degraded tidal mangrove buffer zones protecting vulnerable coastal communities while sequestering oceanic blue carbon.');

  // Simulated uploads
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: number }[]>([
    { name: 'Project_Design_Document_v1.0.pdf', size: 3800000 }
  ]);
  const [uploadError, setUploadError] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const allowed = ['pdf', 'png', 'jpg', 'jpeg'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (!allowed.includes(ext)) {
      setUploadError('Invalid format. Accepted types: PDF, PNG, JPG.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds 10 MB maximum limit.');
      return;
    }

    setUploadedFiles((prev) => [...prev, { name: file.name, size: file.size }]);
    showToast(`Attached ${file.name}`, 'info');
  };

  const removeFile = (idx: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!projectName.trim()) errs.name = 'Project name is required.';
    if (!registryId.trim()) errs.registryId = 'Registry serial ID is required.';
    const vol = parseInt(totalVolume, 10);
    if (!vol || vol <= 0) errs.volume = 'Volume must be greater than zero.';
    const prc = parseFloat(pricePerCredit);
    if (!prc || prc <= 0) errs.price = 'Price must be a valid positive amount.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitForReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    submitNewProject({
      name: projectName,
      category,
      type: projectType,
      registry,
      registryId,
      state,
      location,
      vintage,
      totalVolume: parseInt(totalVolume, 10),
      availableCredits: parseInt(availableCredits, 10),
      pricePerCredit: parseFloat(pricePerCredit),
      methodology,
      description,
      developer: 'Vanya Climate Foundation'
    });

    navigate('/seller/inventory');
  };

  const handleSaveDraft = () => {
    showToast('Project listing saved as draft in Inventory.', 'info');
    navigate('/seller/inventory');
  };

  return (
    <div className="add-project-page">
      <button
        type="button"
        className="back-btn"
        onClick={() => navigate('/seller/dashboard')}
      >
        <ArrowLeft size={16} /> Back to Seller Dashboard
      </button>

      <div className="add-project-header">
        <h1 className="add-project-title">Register Carbon Project for Listing</h1>
        <p className="add-project-subtitle">
          Submit project methodology, registry issuance proof, and pricing parameters for Admin compliance audit.
        </p>
      </div>

      <form className="add-project-form" onSubmit={handleSubmitForReview}>
        <div className="form-card">
          <h2 className="form-card-title">Project Fundamentals</h2>
          <div className="form-grid">
            <div className="form-field full-width">
              <label htmlFor="p-name" className="form-label">Project Title *</label>
              <input
                id="p-name"
                type="text"
                className={`form-input ${errors.name ? 'has-error' : ''}`}
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              {errors.name && <span className="field-err">{errors.name}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="p-category" className="form-label">Category</label>
              <select
                id="p-category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as typeof category)}
              >
                <option value="Afforestation">Afforestation / Reforestation</option>
                <option value="Mangrove Restoration">Mangrove Restoration (Blue Carbon)</option>
                <option value="Biochar">Biochar Sequestration</option>
                <option value="Renewable Energy">Renewable Energy</option>
                <option value="Soil Carbon">Soil Carbon</option>
                <option value="Direct Air Capture">Direct Air Capture</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="p-type" className="form-label">Classification</label>
              <select
                id="p-type"
                className="form-select"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value as typeof projectType)}
              >
                <option value="Removal">Carbon Removal (High Permanence)</option>
                <option value="Reduction">Emissions Avoidance / Reduction</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="p-registry" className="form-label">Registry Standard</label>
              <select
                id="p-registry"
                className="form-select"
                value={registry}
                onChange={(e) => setRegistry(e.target.value as typeof registry)}
              >
                <option value="Verra">Verra (VCS)</option>
                <option value="Gold Standard">Gold Standard</option>
                <option value="Puro.earth">Puro.earth</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="p-reg-id" className="form-label">Registry Serial ID *</label>
              <input
                id="p-reg-id"
                type="text"
                className={`form-input ${errors.registryId ? 'has-error' : ''}`}
                value={registryId}
                onChange={(e) => setRegistryId(e.target.value)}
              />
              {errors.registryId && <span className="field-err">{errors.registryId}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="p-state" className="form-label">State</label>
              <input
                id="p-state"
                type="text"
                className="form-input"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="p-loc" className="form-label">Specific Location / District</label>
              <input
                id="p-loc"
                type="text"
                className="form-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Issuance & Pricing Parameters */}
        <div className="form-card">
          <h2 className="form-card-title">Volume, Vintage & Pricing</h2>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="p-vintage" className="form-label">Vintage Year</label>
              <select
                id="p-vintage"
                className="form-select"
                value={vintage}
                onChange={(e) => setVintage(Number(e.target.value))}
              >
                <option value={2024}>2024</option>
                <option value={2023}>2023</option>
                <option value={2022}>2022</option>
                <option value={2021}>2021</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="p-vol" className="form-label">Total Issued Batch Volume (Credits) *</label>
              <input
                id="p-vol"
                type="number"
                min="1000"
                className={`form-input ${errors.volume ? 'has-error' : ''}`}
                value={totalVolume}
                onChange={(e) => {
                  setTotalVolume(e.target.value);
                  setAvailableCredits(e.target.value);
                }}
              />
              {errors.volume && <span className="field-err">{errors.volume}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="p-price" className="form-label">Proposed Listing Price (INR / Credit) *</label>
              <div className="prefix-wrapper">
                <span className="prefix-symbol">₹</span>
                <input
                  id="p-price"
                  type="number"
                  min="100"
                  className={`form-input has-prefix ${errors.price ? 'has-error' : ''}`}
                  value={pricePerCredit}
                  onChange={(e) => setPricePerCredit(e.target.value)}
                />
              </div>
              {errors.price && <span className="field-err">{errors.price}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="p-methodology" className="form-label">Approved Methodology Protocol</label>
              <input
                id="p-methodology"
                type="text"
                className="form-input"
                value={methodology}
                onChange={(e) => setMethodology(e.target.value)}
              />
            </div>

            <div className="form-field full-width">
              <label htmlFor="p-desc" className="form-label">Impact Narrative & Co-Benefits</label>
              <textarea
                id="p-desc"
                rows={3}
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Audited Documents Upload */}
        <div className="form-card">
          <h2 className="form-card-title">Audited Documents & Registry Verification Letter</h2>
          <div className="upload-dropzone">
            <UploadCloud size={32} className="upload-icon" />
            <div className="upload-text">
              <strong>Attach PDD, Validation Report, or Registry Letter</strong>
              <span>PDF, PNG, JPG under 10 MB accepted</span>
            </div>
            <input
              type="file"
              id="doc-upload"
              className="file-input-hidden"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
            />
            <label htmlFor="doc-upload" className="upload-btn-label">
              Upload Document
            </label>
          </div>

          {uploadError && <div className="upload-error">{uploadError}</div>}

          <div className="attached-files-list">
            {uploadedFiles.map((f, i) => (
              <div key={i} className="attached-file-item">
                <div className="file-info">
                  <FileText size={18} className="file-icon" />
                  <span className="file-name">{f.name}</span>
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

        {/* Form Actions */}
        <div className="form-actions-bar">
          <Button type="button" variant="ghost" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button type="button" variant="outline" onClick={() => navigate('/seller/dashboard')}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit for Admin Review
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
