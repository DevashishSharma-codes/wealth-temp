import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import client from '../../../config/api';
import { FloatingDropdownModal } from '../../ui/FloatingDropdownModal';

/* Pure Inline SVG Icons for new-wealth-fe */
const CompassIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const GlobeIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
);

const CalendarIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const DollarSignIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v22m5-18H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </svg>
);

const MapPinIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const SparklesIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const SlidersHorizontalIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);

const UserIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const XIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CheckIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const ArrowRightIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const ChevronDown = ({ open }) => (
  <svg className={`w-4 h-4 text-[#2459D2] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const formatINR = (value) => {
  if (!Number.isFinite(value) || value === 0) return null;
  return `₹${value.toLocaleString('en-IN')}`;
};

export function TripPlanModal({ isOpen, onClose, onSave, goal, childrenCount }) {
  const [tripPlanningType, setTripPlanningType] = useState('destinations');
  const [tripSelectedDestinations, setTripSelectedDestinations] = useState([]);
  const [tripTargetYear, setTripTargetYear] = useState('');
  const [tripBudgetPerPerson, setTripBudgetPerPerson] = useState('');

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [catOpen, setCatOpen] = useState(false);

  const [destinationsList, setDestinationsList] = useState([]);
  const [destOpen, setDestOpen] = useState(false);

  const [budgetOptions, setBudgetOptions] = useState([]);
  const [loadingBudgetOptions, setLoadingBudgetOptions] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [projectedCost, setProjectedCost] = useState(null);
  const [addingId, setAddingId] = useState(null);

  const [tripTravellers, setTripTravellers] = useState(2 + (childrenCount || 0));

  useEffect(() => {
    if (isOpen) {
      setTripTravellers(2 + (childrenCount || 0));
    }
  }, [isOpen, childrenCount]);

  const getTourOptions = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    return response?.data?.items || [];
  };

  const toDestination = (item, fallbackId) => {
    const value = item.budget_inr ?? item.cost ?? item.price;
    return {
      id: item.id || item.destination_id || item.uuid || item.slug || fallbackId,
      name: item.country || item.name || item.destination_name || item.title || '',
      cost: value == null || value === '' ? null : Number(value),
      famousFor: item.famous_for || item.country_famous_for || '',
      category: item.category || '',
      currency: item.local_currency || '',
      bestSeason: item.best_season || '',
    };
  };

  useEffect(() => {
    if (isOpen) {
      client.get('/tour/categories').then(res => {
        if (res.data?.categories) setCategories(res.data.categories);
        else if (res.data?.data?.categories) setCategories(res.data.data.categories);
        else if (Array.isArray(res.categories)) setCategories(res.categories);
      }).catch(console.error);
    }
  }, [isOpen]);

  useEffect(() => {
    if (goal) {
      setTripTargetYear(goal.targetYear || '');
      setTripSelectedDestinations([]);
      setTripPlanningType('destinations');
      const familySizeInit = 2 + (childrenCount || 0);
      const existingBudget = goal.todaysCost ? Math.round(parseFloat(goal.todaysCost) / familySizeInit) : '';
      setTripBudgetPerPerson(existingBudget);
      setSaveError('');
      setSelectedCategory('');
      setDestOpen(false);
    }
  }, [goal, isOpen, childrenCount]);

  useEffect(() => {
    if (!isOpen) return;
    const url = `/tour/destinations?per_page=1000${selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : ''}`;
    client.get(url)
      .then(res => {
        const list = getTourOptions(res);
          const destinations = list
            .map((item, i) => toDestination(item, `dest-${i}`))
            .filter((destination) => destination.name)
            .sort((a, b) => a.name.localeCompare(b.name));
          setDestinationsList(destinations);
        })
        .catch(err => console.error('Failed to load destinations:', err));
    }, [isOpen, selectedCategory]);

    useEffect(() => {
      if (!isOpen || !tripBudgetPerPerson || tripPlanningType !== 'budget') {
        setBudgetOptions([]);
        return;
      }
      const t = setTimeout(() => {
        setLoadingBudgetOptions(true);
        const url = `/tour/destinations-for-budget?budget=${encodeURIComponent(tripBudgetPerPerson)}&per_page=5${selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : ''}`;
        client.get(url)
          .then(res => {
            const list = getTourOptions(res);
            const mapped = list.slice(0, 5).map((item, i) => toDestination(item, `bdest-${i}`));
            console.log('✈️ [TRIP MODAL LOGGER] Top 5 Matching Destinations from Modal:', mapped.map(x => x.name));
            setBudgetOptions(mapped);
          })
        .catch(err => console.error('Budget search failed:', err))
        .finally(() => setLoadingBudgetOptions(false));
    }, 350);
    return () => clearTimeout(t);
  }, [tripBudgetPerPerson, tripPlanningType, isOpen, selectedCategory]);

  useEffect(() => {
    if (tripSelectedDestinations.length > 0 && tripTargetYear && isOpen) {
      client.post('/tour/project-cost', {
        destination_id: tripSelectedDestinations[0].id,
        target_year: Number(tripTargetYear),
        travellers: Number(tripTravellers) || 1
      }).then(res => {
        const d = res.data?.data || res.data || res;
        setProjectedCost(d);
      }).catch(() => setProjectedCost(null));
    } else {
      setProjectedCost(null);
    }
  }, [tripSelectedDestinations, tripTargetYear, tripTravellers, isOpen]);

  const selectDestination = (destination) => {
    if (tripSelectedDestinations.some(s => s.id === destination.id)) return;
    setSaveError('');
    setDestOpen(false);
    setAddingId(destination.id);
    setTimeout(() => setAddingId(null), 800);
    setTripSelectedDestinations(prev => [...prev, destination]);
    if (Number.isFinite(destination.cost)) setTripBudgetPerPerson(String(destination.cost));
  };

  const removeDestination = (id) => {
    setSaveError('');
    setTripSelectedDestinations(prev => prev.filter(d => d.id !== id));
  };

  const getProjectedValue = () => {
    if (!projectedCost) return null;
    const raw = projectedCost.future_cost?.raw ?? projectedCost.future_cost ?? projectedCost.projected_cost ?? projectedCost.total_cost;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : null;
  };

  const getSIPValue = () => {
    if (!projectedCost) return null;
    const raw = projectedCost.monthly_sip?.raw ?? projectedCost.monthly_sip ?? projectedCost.sip;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : null;
  };

  const getTodaysCost = () => {
    if (tripPlanningType === 'destinations' && tripSelectedDestinations.length > 0) {
      const costs = tripSelectedDestinations
        .map((destination) => destination.cost)
        .filter((cost) => Number.isFinite(cost) && cost > 0);

      if (costs.length !== tripSelectedDestinations.length) return null;

      const averagePerPerson = costs.reduce((total, cost) => total + cost, 0) / costs.length;
      return Math.round(averagePerPerson * (Number(tripTravellers) || 1));
    }

    const enteredBudget = Number(tripBudgetPerPerson);
    return Number.isFinite(enteredBudget) && enteredBudget > 0
      ? Math.round(enteredBudget * (Number(tripTravellers) || 1))
      : null;
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    const cost = getTodaysCost();
    if (cost === null) {
      setSaveError(
        tripSelectedDestinations.length
          ? 'We could not retrieve the selected destination budget. Please try again.'
          : 'Select a destination or enter a budget before saving.'
      );
      return;
    }
    const combinedDestinations = [...tripSelectedDestinations];
    if (Array.isArray(budgetOptions)) {
      budgetOptions.forEach(bOpt => {
        const bName = bOpt.name || bOpt;
        if (!combinedDestinations.some(d => (d.name || d).toLowerCase() === String(bName).toLowerCase())) {
          combinedDestinations.push(bOpt);
        }
      });
    }

    console.log('✈️ [TRIP MODAL SAVE] Saving 5 destinations:', combinedDestinations.map(x => x.name || x));

    onSave({
      targetYear: tripTargetYear || String(new Date().getFullYear() + 5),
      todaysCost: String(cost),
      selectedDestinations: combinedDestinations,
      suggested_tours: combinedDestinations,
      budgetOptions: budgetOptions,
      selectedCategory,
      travellers: tripTravellers,
    });
  };

  if (!isOpen) return null;

  const todaysCost = getTodaysCost();
  const projVal = getProjectedValue();
  const sipVal = getSIPValue();

  const modalJSX = (
    <div
      className="fixed inset-0 z-[9999] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 lg:p-8 overflow-hidden select-none animate-fade-in text-[#0E2C7E]"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="w-full max-w-7xl h-[95dvh] sm:h-auto sm:max-h-[92vh] bg-white/95 border border-[#77B1EC]/40 rounded-2xl sm:rounded-[32px] flex flex-col overflow-hidden shadow-2xl relative backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 min-h-[56px] sm:h-20 px-4 sm:px-10 border-b border-[#77B1EC]/30 bg-white/80 flex items-center justify-between gap-3 z-10 py-2 sm:py-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#77B1EC]/20 border border-[#77B1EC]/40 flex items-center justify-center text-[#2459D2] shrink-0 shadow-xs">
              <CompassIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-sm sm:text-xl font-extrabold text-[#0E2C7E] leading-tight">
                Foreign Tour Planning
              </h3>
              <p className="text-[11px] sm:text-xs text-[#64748B] font-medium mt-0.5 hidden sm:block">
                Calculate estimated trip cost for {tripTravellers || 1} travellers
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center neu-btn-flat-inactive transition-all cursor-pointer text-[#0E2C7E] hover:text-[#2459D2] outline-none shrink-0"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content (Hidden Scrollbars) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-10 no-scrollbar scrollbar-none bg-white/40">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">

            {/* Mode Switcher & Category Filter */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 items-center">
              {/* Mode Switcher */}
              <div className="md:col-span-7 grid grid-cols-2 gap-2.5 sm:gap-3">
                {[
                  { key: 'destinations', label: 'Pick Destinations', sub: 'Browse & pick countries', icon: GlobeIcon },
                  { key: 'budget', label: 'Set a Budget', sub: 'Filter top matches by budget', icon: DollarSignIcon },
                ].map(({ key, label, sub, icon: Icon }) => {
                  const active = tripPlanningType === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTripPlanningType(key)}
                      className={`p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl transition-all cursor-pointer flex items-center gap-2 sm:gap-3.5 text-left overflow-hidden min-w-0 ${
                        active ? 'glass-morphism-card border-[#2459D2]' : 'bg-slate-100/70 border border-[#77B1EC]/20 hover:bg-[#77B1EC]/15'
                      }`}
                    >
                      <div className={`p-1.5 sm:p-2.5 rounded-xl border border-[#77B1EC]/30 shrink-0 ${active ? 'bg-[#77B1EC]/20 text-[#2459D2]' : 'bg-white text-[#64748B]'}`}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <div className={`text-xs sm:text-sm font-extrabold truncate ${active ? 'text-[#2459D2]' : 'text-[#0E2C7E]'}`}>{label}</div>
                        <div className="text-[10px] sm:text-[11px] text-[#64748B] font-medium mt-0.5 truncate">{sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Category Dropdown */}
              <div className="md:col-span-5">
                <label className="block text-xs font-bold text-[#0E2C7E] mb-1.5 select-none flex items-center gap-1.5">
                  <SlidersHorizontalIcon className="w-4 h-4 text-[#2459D2]" /> Travel Category Filter
                </label>
                <button
                  type="button"
                  onClick={() => setCatOpen(true)}
                  className="neu-field w-full px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold rounded-2xl outline-none flex justify-between items-center cursor-pointer hover:border-[#2459D2]/50 transition-all"
                >
                  <span className={selectedCategory ? 'text-[#0E2C7E] truncate' : 'text-[#64748B] truncate'}>
                    {selectedCategory || 'All Travel Categories'}
                  </span>
                  <ChevronDown open={catOpen} />
                </button>
                <FloatingDropdownModal
                  isOpen={catOpen}
                  onClose={() => setCatOpen(false)}
                  isFullScreen={false}
                  title="Select Travel Category"
                  subtitle="Filter destinations by trip theme"
                  placeholder="Search category..."
                  selectedValue={selectedCategory}
                  onSelect={(opt) => setSelectedCategory(opt.value)}
                  options={[
                    { label: 'All Categories', value: '', subtext: 'View all tour destinations', icon: <GlobeIcon className="w-4 h-4" /> },
                    ...categories.map((c) => ({
                      label: c,
                      value: c,
                      subtext: `${c} packages`,
                      icon: <CompassIcon className="w-4 h-4" />,
                    })),
                  ]}
                />
              </div>
            </div>

            {/* 2-Column Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              {/* Left Column (7 cols): Destination Search or Budget Input */}
              <div
                className="lg:col-span-7 space-y-5 sm:space-y-6 glass-morphism-card p-4 sm:p-8 rounded-2xl sm:rounded-[32px]"
              >
                {tripPlanningType === 'destinations' ? (
                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-[#0E2C7E] select-none flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4 text-[#2459D2]" /> Search & Select Destination
                    </label>
                    <button
                      type="button"
                      onClick={() => setDestOpen(true)}
                      className="neu-field w-full px-3.5 sm:px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold rounded-2xl outline-none flex items-center justify-between gap-3 text-left cursor-pointer hover:border-[#2459D2]/50 transition-all"
                    >
                      <span className="truncate text-[#64748B]">Type country name or landmark...</span>
                      <ChevronDown open={destOpen} />
                    </button>

                    <FloatingDropdownModal
                      isOpen={destOpen}
                      onClose={() => setDestOpen(false)}
                      isFullScreen={true}
                      title="Select Tour Destinations"
                      subtitle="Search countries and estimated per-person budgets"
                      placeholder="Type destination..."
                      emptyMessage="No destinations found."
                      onSelect={(opt) => selectDestination(opt.raw)}
                      options={destinationsList.map((d) => ({
                        id: d.id,
                        label: d.name,
                        subtext: [d.famousFor, d.category, d.bestSeason ? `🗓 ${d.bestSeason}` : null].filter(Boolean).join(' · '),
                        rightTag: Number.isFinite(d.cost) ? `${formatINR(d.cost)} /pp` : null,
                        disabled: tripSelectedDestinations.some((item) => item.id === d.id),
                        raw: d,
                        icon: <MapPinIcon className="w-4 h-4 text-[#2459D2]" />,
                      }))}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-[#0E2C7E] select-none">
                      Approx. Today's Cost (per person)
                    </label>
                    <input
                      type="number"
                      value={tripBudgetPerPerson}
                      onChange={(e) => {
                        setSaveError('');
                        setTripBudgetPerPerson(e.target.value);
                      }}
                      placeholder="e.g. 380000"
                      onWheel={(e) => e.currentTarget.blur()}
                      className="neu-field w-full px-3.5 sm:px-4 py-3 sm:py-3.5 text-sm font-semibold rounded-2xl outline-none"
                    />

                    {tripBudgetPerPerson && (
                      <div className="space-y-3 pt-2">
                        <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                          {loadingBudgetOptions ? 'Searching...' : 'Top 5 Matching Destinations'}
                        </div>
                        {loadingBudgetOptions ? (
                          <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="h-14 rounded-2xl bg-slate-100 animate-pulse" />
                            ))}
                          </div>
                        ) : budgetOptions.length > 0 ? (
                          <div className="space-y-2.5">
                            {budgetOptions.map((opt, idx) => {
                              const selected = tripSelectedDestinations.some((s) => s.id === opt.id);
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => {
                                    if (!selected) {
                                      setSaveError('');
                                      setAddingId(opt.id);
                                      setTimeout(() => setAddingId(null), 700);
                                      setTripSelectedDestinations([opt]);
                                    }
                                  }}
                                  disabled={selected}
                                  className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                                    selected
                                      ? 'bg-[#77B1EC]/20 border-[#2459D2] shadow-xs cursor-default'
                                      : 'border-[#77B1EC]/30 bg-white/70 hover:bg-[#77B1EC]/15 hover:border-[#2459D2]/40 cursor-pointer'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold ${selected ? 'bg-[#2459D2] text-white' : 'bg-slate-100 text-[#64748B]'}`}>
                                      {selected ? <CheckIcon className="w-4 h-4 stroke-[3]" /> : idx + 1}
                                    </div>
                                    <div>
                                      <div className="text-xs font-bold text-[#0E2C7E]">{opt.name}</div>
                                      <div className="text-[11px] text-[#64748B]">{opt.famousFor || opt.category}</div>
                                    </div>
                                  </div>
                                  {Number.isFinite(opt.cost) && (
                                    <div className="text-xs font-bold text-[#2459D2]">{formatINR(opt.cost)}</div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-xs text-[#64748B] italic py-2">No destinations matching budget.</div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column (5 cols): Summary Card & Future Projection */}
              <div
                className="lg:col-span-5 glass-morphism-card rounded-2xl sm:rounded-[32px] p-4 sm:p-8 space-y-5 sm:space-y-6 flex flex-col justify-start"
              >
                <div className="space-y-4 sm:space-y-5">
                  <div className="text-xs font-extrabold text-[#0E2C7E] border-b border-[#77B1EC]/30 pb-3 flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4 text-[#2459D2]" /> Trip Planning Summary
                  </div>

                  {/* Selected Chips */}
                  <div>
                    <label className="block text-xs font-bold text-[#64748B] mb-2 select-none">
                      Selected Destinations
                    </label>
                    {tripSelectedDestinations.length === 0 ? (
                      <div className="p-4 sm:p-5 text-center text-xs text-[#64748B] neu-field rounded-2xl">
                        No destinations selected yet.
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {tripSelectedDestinations.map((dest) => (
                          <div
                            key={dest.id}
                            className="bg-[#77B1EC]/20 border border-[#77B1EC]/40 text-[#2459D2] rounded-2xl px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold flex items-center gap-2 shadow-2xs"
                          >
                            <MapPinIcon className="w-4 h-4 shrink-0" />
                            <span className="truncate max-w-[160px] sm:max-w-none">{dest.name}</span>
                            {Number.isFinite(dest.cost) && (
                              <span className="text-[10px] text-[#64748B] font-semibold">{formatINR(dest.cost)}/pp</span>
                            )}
                            <button
                              type="button"
                              onClick={() => removeDestination(dest.id)}
                              className="hover:text-[#0E2C7E] font-extrabold cursor-pointer ml-1"
                            >
                              <XIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Target Year */}
                  <div>
                    <label className="block text-xs font-bold text-[#0E2C7E] mb-1.5 select-none flex items-center gap-1.5">
                      <CalendarIcon className="w-4 h-4 text-[#2459D2]" /> Target Travel Year
                    </label>
                    <input
                      type="number"
                      value={tripTargetYear}
                      onChange={(e) => setTripTargetYear(e.target.value)}
                      placeholder="e.g. 2027"
                      onWheel={(e) => e.currentTarget.blur()}
                      className="neu-field w-full px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold rounded-2xl outline-none"
                    />
                  </div>

                  {/* Total Travellers count */}
                  <div>
                    <label className="block text-xs font-bold text-[#0E2C7E] mb-1.5 select-none flex items-center gap-1.5">
                      <UserIcon className="w-4 h-4 text-[#2459D2]" /> Total Travellers
                    </label>
                    <input
                      type="number"
                      value={tripTravellers}
                      onChange={(e) => setTripTravellers(e.target.value)}
                      placeholder="e.g. 2"
                      min="1"
                      onWheel={(e) => e.currentTarget.blur()}
                      className="neu-field w-full px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold rounded-2xl outline-none"
                    />
                  </div>

                  {/* Calculation Breakdown Box */}
                  {todaysCost ? (
                    <div className="p-3.5 bg-[#77B1EC]/15 border border-[#77B1EC]/30 rounded-2xl text-center space-y-1 shadow-xs">
                      <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Total Today's Cost Calculation</p>
                      <p className="text-xs font-semibold text-[#0E2C7E]">
                        ₹{Number(tripBudgetPerPerson || (tripSelectedDestinations[0]?.cost) || 0).toLocaleString('en-IN')} (per person) × {tripTravellers || 1} people
                      </p>
                      <p className="text-base font-extrabold text-[#2459D2]">
                        = ₹{Number(todaysCost).toLocaleString('en-IN')} Total
                      </p>
                    </div>
                  ) : null}

                </div>

                {/* Projected Future Cost */}
                {projVal ? (
                  <div className="p-4 sm:p-5 bg-[#77B1EC]/20 border border-[#77B1EC]/40 rounded-2xl text-center space-y-1 sm:space-y-1.5 shadow-xs mt-4">
                    <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Projected Future Cost</p>
                    <p className="text-2xl sm:text-3xl font-black text-[#0E2C7E]">{formatINR(projVal)}</p>
                    {sipVal && (
                      <p className="text-xs font-semibold text-[#0E2C7E]/80">
                        Monthly SIP Needed: <span className="text-[#2459D2] font-bold">{formatINR(sipVal)}</span>
                      </p>
                    )}
                    <p className="text-xs font-medium text-[#2459D2]">For {tripTravellers || 1} travellers in {tripTargetYear}</p>
                  </div>
                ) : (
                  <div className="p-4 sm:p-5 neu-field rounded-2xl text-center text-xs text-[#64748B] font-medium mt-4">
                    Select a destination and enter target year to view cost estimation.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Responsive Footer */}
        <div className="shrink-0 py-3 sm:py-0 sm:h-20 px-4 sm:px-10 border-t border-[#77B1EC]/30 bg-white/80 flex items-center justify-between gap-3 z-10">
          <div className="text-xs sm:text-sm font-semibold text-[#64748B] truncate max-w-[130px] sm:max-w-none">
            {todaysCost ? (
              <span className="truncate block">Cost: <span className="text-[#2459D2] font-black text-sm sm:text-base ml-0.5">{formatINR(todaysCost)}</span></span>
            ) : saveError ? (
              <span className="text-red-600 font-semibold truncate block">{saveError}</span>
            ) : (
              <span className="text-[#64748B] hidden sm:block">Fill in travel details to calculate.</span>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 sm:px-6 py-2.5 text-xs font-bold neu-btn-flat-inactive transition-all cursor-pointer text-[#0E2C7E] rounded-xl sm:rounded-2xl shrink-0"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="glass-morphism-btn flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold px-4 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl transition-all cursor-pointer whitespace-nowrap shrink-0 text-white"
            >
              Save Tour Goal <ArrowRightIcon className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalJSX, document.body);
}
