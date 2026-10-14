import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarbonApp } from '../../context/CarbonAppContext';
import { StatusPill } from '../../components/StatusPill/StatusPill';
import { Button } from '../../components/Button/Button';
import { Chip } from '../../components/Chip/Chip';
import { formatINR } from '../../utils/formatters';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Check,
  Scale,
  RefreshCw,
  AlertCircle,
  X,
  ShieldCheck,
  MapPin
} from 'lucide-react';
import './MarketplaceScreen.css';

export const MarketplaceScreen: React.FC = () => {
  const navigate = useNavigate();
  const { projects, shortlist, toggleShortlist, isInShortlist } = useCarbonApp();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedRegistry, setSelectedRegistry] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedVintage, setSelectedVintage] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [minQuantity, setMinQuantity] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('featured');
  
  // Prototype States
  const [viewState, setViewState] = useState<'normal' | 'loading' | 'empty' | 'error'>('normal');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const categories = [
    'All',
    'Afforestation',
    'Renewable Energy',
    'Soil Carbon',
    'Mangrove Restoration',
    'Direct Air Capture',
    'Biochar'
  ];

  const registries = ['All', 'Verra', 'Gold Standard', 'Puro.earth'];
  const indianStates = ['All', 'Odisha', 'Karnataka', 'Punjab', 'Maharashtra', 'Tamil Nadu', 'Himachal Pradesh'];
  const vintages = ['All', '2024', '2023', '2022', '2021'];

  // Filtering Logic
  const filteredProjects = useMemo(() => {
    if (viewState === 'empty') return [];
    
    return projects.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.registryId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesType = selectedType === 'All' || p.type === selectedType;
      const matchesReg = selectedRegistry === 'All' || p.registry === selectedRegistry;
      const matchesState = selectedState === 'All' || p.state === selectedState;
      const matchesVintage = selectedVintage === 'All' || p.vintage.toString() === selectedVintage;
      const matchesPrice = p.pricePerCredit <= maxPrice;
      const matchesQty = p.availableCredits >= minQuantity;

      return (
        matchesSearch &&
        matchesCat &&
        matchesType &&
        matchesReg &&
        matchesState &&
        matchesVintage &&
        matchesPrice &&
        matchesQty
      );
    });
  }, [
    projects,
    searchQuery,
    selectedCategory,
    selectedType,
    selectedRegistry,
    selectedState,
    selectedVintage,
    maxPrice,
    minQuantity,
    viewState
  ]);

  // Sorting
  const sortedProjects = useMemo(() => {
    const list = [...filteredProjects];
    if (sortBy === 'price-low') {
      return list.sort((a, b) => a.pricePerCredit - b.pricePerCredit);
    }
    if (sortBy === 'price-high') {
      return list.sort((a, b) => b.pricePerCredit - a.pricePerCredit);
    }
    if (sortBy === 'vintage') {
      return list.sort((a, b) => b.vintage - a.vintage);
    }
    if (sortBy === 'volume') {
      return list.sort((a, b) => b.availableCredits - a.availableCredits);
    }
    if (sortBy === 'rating') {
      return list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [filteredProjects, sortBy]);

  // Pagination slice
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedProjects.slice(start, start + pageSize);
  }, [sortedProjects, currentPage]);

  const totalPages = Math.ceil(sortedProjects.length / pageSize) || 1;

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedType('All');
    setSelectedRegistry('All');
    setSelectedState('All');
    setSelectedVintage('All');
    setMaxPrice(10000);
    setMinQuantity(0);
    setSortBy('featured');
    setViewState('normal');
  };

  return (
    <div className="marketplace-page">
      {/* Page Header */}
      <div className="marketplace-header">
        <div className="marketplace-header__content">
          <h1 className="marketplace-title">Marketplace</h1>
          <p className="marketplace-subtitle">
            Browse institution-grade, verified Indian carbon mitigation and removal credits.
          </p>
        </div>

        {/* Prototype Variant Controls */}
        <div className="marketplace-state-switchers" role="group" aria-label="Prototype state tester">
          <span className="state-switcher-label">View State:</span>
          <button
            type="button"
            className={`state-chip ${viewState === 'normal' ? 'active' : ''}`}
            onClick={() => setViewState('normal')}
          >
            Normal
          </button>
          <button
            type="button"
            className={`state-chip ${viewState === 'loading' ? 'active' : ''}`}
            onClick={() => setViewState('loading')}
          >
            Skeleton Loading
          </button>
          <button
            type="button"
            className={`state-chip ${viewState === 'empty' ? 'active' : ''}`}
            onClick={() => setViewState('empty')}
          >
            Empty
          </button>
          <button
            type="button"
            className={`state-chip ${viewState === 'error' ? 'active' : ''}`}
            onClick={() => setViewState('error')}
          >
            Error
          </button>
        </div>
      </div>

      {/* Category Chips Bar */}
      <div className="category-scroll-container">
        <div className="category-chips-bar" role="toolbar" aria-label="Project categories">
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              selected={selectedCategory === cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
            />
          ))}
        </div>
      </div>

      {/* Top Search & Filter Bar */}
      <div className="search-sort-bar">
        <div className="search-input-wrapper">
          <Search className="search-icon" aria-hidden="true" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search projects by name, registry ID, state..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Search carbon projects"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="sort-filter-actions">
          <div className="sort-wrapper">
            <ArrowUpDown size={16} className="sort-icon" aria-hidden="true" />
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort projects"
            >
              <option value="featured">Sort: Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="volume">Available Volume</option>
              <option value="vintage">Newest Vintage</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            type="button"
            className="mobile-filter-trigger"
            onClick={() => setIsMobileFilterOpen(true)}
            aria-label="Open filter drawer"
          >
            <SlidersHorizontal size={16} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Results */}
      <div className="marketplace-layout">
        {/* Desktop Filter Sidebar */}
        <aside className="filter-sidebar" aria-label="Marketplace filters">
          <div className="filter-sidebar__header">
            <h2 className="filter-sidebar__title">
              <SlidersHorizontal size={18} aria-hidden="true" /> Filters
            </h2>
            <button type="button" className="filter-reset-btn" onClick={resetFilters}>
              Reset all
            </button>
          </div>

          {/* Project Type */}
          <div className="filter-group">
            <label className="filter-label" htmlFor="type-filter">Type</label>
            <select
              id="type-filter"
              className="filter-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="All">All Types (Removal & Reduction)</option>
              <option value="Removal">Carbon Removal (High Permanence)</option>
              <option value="Reduction">Emissions Avoidance / Reduction</option>
            </select>
          </div>

          {/* Registry */}
          <div className="filter-group">
            <label className="filter-label" htmlFor="reg-filter">Registry Standard</label>
            <select
              id="reg-filter"
              className="filter-select"
              value={selectedRegistry}
              onChange={(e) => setSelectedRegistry(e.target.value)}
            >
              {registries.map((r) => (
                <option key={r} value={r}>{r === 'All' ? 'All Registries' : r}</option>
              ))}
            </select>
          </div>

          {/* State / Location */}
          <div className="filter-group">
            <label className="filter-label" htmlFor="state-filter">Indian State</label>
            <select
              id="state-filter"
              className="filter-select"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              {indianStates.map((s) => (
                <option key={s} value={s}>{s === 'All' ? 'All States' : s}</option>
              ))}
            </select>
          </div>

          {/* Vintage */}
          <div className="filter-group">
            <label className="filter-label" htmlFor="vintage-filter">Vintage</label>
            <select
              id="vintage-filter"
              className="filter-select"
              value={selectedVintage}
              onChange={(e) => setSelectedVintage(e.target.value)}
            >
              {vintages.map((v) => (
                <option key={v} value={v}>{v === 'All' ? 'All Vintages' : v}</option>
              ))}
            </select>
          </div>

          {/* Max Price Slider */}
          <div className="filter-group">
            <div className="filter-slider-header">
              <label className="filter-label" htmlFor="price-range">Max Price</label>
              <span className="filter-slider-val">{formatINR(maxPrice)}</span>
            </div>
            <input
              id="price-range"
              type="range"
              min="500"
              max="10000"
              step="250"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="filter-range-input"
            />
          </div>

          {/* Min Quantity */}
          <div className="filter-group">
            <label className="filter-label" htmlFor="min-qty">Min Available Credits</label>
            <input
              id="min-qty"
              type="number"
              min="0"
              step="5000"
              placeholder="e.g. 10000"
              className="filter-text-input"
              value={minQuantity || ''}
              onChange={(e) => setMinQuantity(Number(e.target.value) || 0)}
            />
          </div>
        </aside>

        {/* Mobile Filter Drawer */}
        {isMobileFilterOpen && (
          <div className="mobile-drawer-backdrop" onClick={() => setIsMobileFilterOpen(false)}>
            <div
              className="mobile-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Filter drawer"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mobile-drawer__header">
                <h3>Filters</h3>
                <button
                  type="button"
                  className="mobile-drawer__close"
                  onClick={() => setIsMobileFilterOpen(false)}
                  aria-label="Close filters"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mobile-drawer__content">
                <div className="filter-group">
                  <label className="filter-label" htmlFor="m-type-filter">Project Type</label>
                  <select
                    id="m-type-filter"
                    className="filter-select"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="All">All Types</option>
                    <option value="Removal">Carbon Removal</option>
                    <option value="Reduction">Emissions Avoidance</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label" htmlFor="m-reg-filter">Registry Standard</label>
                  <select
                    id="m-reg-filter"
                    className="filter-select"
                    value={selectedRegistry}
                    onChange={(e) => setSelectedRegistry(e.target.value)}
                  >
                    {registries.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label" htmlFor="m-state-filter">State</label>
                  <select
                    id="m-state-filter"
                    className="filter-select"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                  >
                    {indianStates.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <div className="filter-slider-header">
                    <label className="filter-label" htmlFor="m-price-range">Max Price</label>
                    <span className="filter-slider-val">{formatINR(maxPrice)}</span>
                  </div>
                  <input
                    id="m-price-range"
                    type="range"
                    min="500"
                    max="10000"
                    step="250"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="filter-range-input"
                  />
                </div>
              </div>

              <div className="mobile-drawer__footer">
                <Button variant="outline" onClick={resetFilters}>Reset</Button>
                <Button variant="primary" onClick={() => setIsMobileFilterOpen(false)}>
                  Show {sortedProjects.length} Results
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Results Area */}
        <section className="results-container" aria-label="Project listings">
          {/* Active Filter Indicators */}
          <div className="results-bar">
            <span className="results-count">
              Showing <strong>{sortedProjects.length}</strong> verified projects
            </span>
          </div>

          {/* State 1: Error State */}
          {viewState === 'error' && (
            <div className="state-panel state-panel--error" role="alert">
              <AlertCircle size={40} className="state-panel__icon" />
              <h3 className="state-panel__title">Failed to load marketplace index</h3>
              <p className="state-panel__text">
                An unexpected local error occurred while indexing registry data.
              </p>
              <Button variant="primary" onClick={() => setViewState('normal')}>
                <RefreshCw size={16} /> Retry Marketplace
              </Button>
            </div>
          )}

          {/* State 2: Skeleton Loading State */}
          {viewState === 'loading' && (
            <div className="projects-grid" aria-busy="true" aria-label="Loading projects">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="project-card-skeleton">
                  <div className="skeleton-line skeleton-badge" />
                  <div className="skeleton-line skeleton-title" />
                  <div className="skeleton-line skeleton-meta" />
                  <div className="skeleton-line skeleton-price" />
                  <div className="skeleton-line skeleton-btn" />
                </div>
              ))}
            </div>
          )}

          {/* State 3: Empty Search / Filter State */}
          {viewState === 'normal' && sortedProjects.length === 0 && (
            <div className="state-panel state-panel--empty">
              <Search size={40} className="state-panel__icon" />
              <h3 className="state-panel__title">No projects match your filter criteria</h3>
              <p className="state-panel__text">
                Try widening your price range, clearing specific registries, or resetting all filters.
              </p>
              <Button variant="outline" onClick={resetFilters}>
                Clear All Filters
              </Button>
            </div>
          )}

          {/* State 4: Normal Card Grid */}
          {viewState === 'normal' && sortedProjects.length > 0 && (
            <div className="projects-grid">
              {paginatedProjects.map((project) => {
                const inShortlist = isInShortlist(project.id);

                return (
                  <article key={project.id} className="project-card">
                    {/* Top Registry & Status */}
                    <div className="project-card__top">
                      <div className="project-card__badges">
                        <span className="registry-tag">{project.registry} ({project.registryId})</span>
                        <span className={`type-tag type-tag--${project.type.toLowerCase()}`}>
                          {project.type}
                        </span>
                      </div>
                      <StatusPill status={project.verificationStatus} size="sm" />
                    </div>

                    {/* Title */}
                    <h3 className="project-card__title" title={project.name}>
                      {project.name}
                    </h3>

                    {/* Location & Vintage Metadata */}
                    <div className="project-card__meta">
                      <span className="meta-item">
                        <MapPin size={13} aria-hidden="true" />
                        {project.state}, {project.country}
                      </span>
                      <span className="meta-divider">•</span>
                      <span className="meta-item">Vintage {project.vintage}</span>
                    </div>

                    {/* Developer */}
                    <p className="project-card__developer">
                      By {project.developer}
                    </p>

                    {/* Key Metrics: Big Bold Numbers (Groww Style) */}
                    <div className="project-card__pricing">
                      <div className="price-block">
                        <span className="price-label">Unit Price</span>
                        <span className="price-val">{formatINR(project.pricePerCredit)}</span>
                        <span className="price-unit">/ credit</span>
                      </div>
                      <div className="volume-block">
                        <span className="volume-label">Available</span>
                        <span className="volume-val">{project.availableCredits.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Additionality & Methodology Pill */}
                    <div className="project-card__methodology">
                      <ShieldCheck size={14} className="methodology-icon" aria-hidden="true" />
                      <span>{project.methodology}</span>
                    </div>

                    {/* Card Actions */}
                    <div className="project-card__actions">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(`/project/${project.id}`)}
                        className="card-cta-btn"
                      >
                        View Project
                      </Button>

                      <Button
                        variant={inShortlist ? 'secondary' : 'outline'}
                        size="sm"
                        onClick={() => toggleShortlist(project.id)}
                        className={`card-shortlist-btn ${inShortlist ? 'in-shortlist' : ''}`}
                        title={inShortlist ? 'In Shortlist' : 'Add to Compare Shortlist'}
                      >
                        {inShortlist ? (
                          <>
                            <Check size={14} /> Shortlisted
                          </>
                        ) : (
                          <>
                            <Scale size={14} /> Compare
                          </>
                        )}
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {viewState === 'normal' && totalPages > 1 && (
            <nav className="pagination-nav" aria-label="Marketplace pagination">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </nav>
          )}
        </section>
      </div>

      {/* Floating Sticky Compare Shortlist Bar */}
      {shortlist.length > 0 && (
        <div className="floating-shortlist-bar" role="region" aria-label="Comparison shortlist">
          <div className="floating-shortlist-bar__content">
            <div className="shortlist-summary">
              <Scale size={18} className="shortlist-icon" aria-hidden="true" />
              <span className="shortlist-count">
                <strong>{shortlist.length}</strong> of 4 projects shortlisted for comparison
              </span>
            </div>
            <div className="shortlist-actions">
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/compare')}
              >
                Compare Now ({shortlist.length})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
