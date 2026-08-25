import React, { forwardRef } from 'react';
import { RoadmapTemplate } from './RoadmapTemplate';
import { formatGoalTitle, getActualChildName, stripSalutation } from '../../../utils/formatters';

/**
 * FullReportTemplate React Component
 * 100% Exact Visual & Structural Replica of the 15-Page Backend Report PDF.
 * Renders every page in React HTML/CSS matching the exact templates, icons, pill boxes, tables, and colors.
 */
export const FullReportTemplate = forwardRef(({ formData = {}, childrenData = [], calculationResult = {}, reportData = {}, services = [], testimonials = [], assessmentId = '' }, ref) => {
  const clientName = stripSalutation(formData.name) || 'Valued Client';
  const reportDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const defaultServices = [
    'Financial Planning',
    'Mutual Funds',
    'PMS',
    'NRI Investments',
    'Life Insurance',
    'Health Insurance',
    'General Insurance',
    'Estate Planning',
  ];

const ensureString = (val, fallback = '') => {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return String(val);
  if (typeof val === 'object') {
    return val.display || val.title || val.name || val.inr || val.text || val.formatted || fallback;
  }
  return String(val);
};

const formatInrFull = (val, defaultVal = '₹0') => {
  if (val === null || val === undefined) return defaultVal;
  if (typeof val === 'number') return `₹${Math.round(val).toLocaleString('en-IN')}`;
  if (typeof val === 'object') {
    if (val.raw !== undefined && typeof val.raw === 'number') {
      return `₹${Math.round(val.raw).toLocaleString('en-IN')}`;
    }
    if (val.inr && typeof val.inr === 'string') return formatInrFull(val.inr, defaultVal);
    if (val.formatted && typeof val.formatted === 'string') return formatInrFull(val.formatted, defaultVal);
    if (val.display && typeof val.display === 'string') return formatInrFull(val.display, defaultVal);
    if (val.value !== undefined) return formatInrFull(val.value, defaultVal);
    return defaultVal;
  }
  let str = String(val).trim();
  if (!str) return defaultVal;
  let cleanStr = str.replace(/^₹\s*/, '');
  if (/cr|crore/i.test(cleanStr)) {
    const num = parseFloat(cleanStr.replace(/[^0-9.]/g, ''));
    if (!isNaN(num)) return `₹${Math.round(num * 10000000).toLocaleString('en-IN')}`;
  }
  if (/lakh|\bl\b/i.test(cleanStr)) {
    const num = parseFloat(cleanStr.replace(/[^0-9.]/g, ''));
    if (!isNaN(num)) return `₹${Math.round(num * 100000).toLocaleString('en-IN')}`;
  }
  const rawNum = parseFloat(cleanStr.replace(/[^0-9.]/g, ''));
  if (!isNaN(rawNum) && rawNum > 0) {
    return `₹${Math.round(rawNum).toLocaleString('en-IN')}`;
  }
  return str;
};

const formatDisplayVal = (val, defaultVal = '₹0') => {
  if (val === null || val === undefined) return defaultVal;
  return formatInrFull(val, defaultVal);
};

  const inputServices = (services && services.length > 0)
    ? services
    : (calculationResult?.services && calculationResult.services.length > 0)
    ? calculationResult.services
    : (formData?.services && formData.services.length > 0)
    ? formData.services
    : defaultServices;

  const activeServices = inputServices
    .filter((s) => {
      if (!s) return false;
      if (typeof s === 'object') {
        return s.is_visible !== false && s.active !== false;
      }
      return true;
    })
    .map((s) => {
      if (typeof s === 'string') return s;
      if (typeof s === 'object' && s) {
        return ensureString(s.title || s.name || s.service_name || s.service || s.display, 'Service');
      }
      return String(s);
    });

  const defaultTestimonials = [
    {
      quote: "Wealth Wisdom made my retirement planning clear and straightforward. Highly professional advice!",
      author: "Rajesh Sharma",
      designation: "IT Executive"
    },
    {
      quote: "Extremely reliable wealth management team. They helped me plan for both my children's higher education.",
      author: "Priya Patel",
      designation: "Business Owner"
    },
    {
      quote: "Tailored investment guidance with complete transparency. Couldn't have asked for a better financial partner.",
      author: "Amitabh Verma",
      designation: "Doctor"
    }
  ];

  const inputTestimonials = (testimonials && testimonials.length > 0)
    ? testimonials
    : (calculationResult?.testimonials && calculationResult.testimonials.length > 0)
    ? calculationResult.testimonials
    : (formData?.testimonials && formData.testimonials.length > 0)
    ? formData.testimonials
    : defaultTestimonials;

  const activeTestimonials = inputTestimonials
    .filter((t) => {
      if (!t) return false;
      if (typeof t === 'object') {
        return t.is_visible !== false && t.active !== false;
      }
      return true;
    })
    .map((t) => {
      if (typeof t === 'string') {
        return { quote: t, author: 'Valued Client', designation: '' };
      }
      const quote = ensureString(t?.quote || t?.text || t?.message || t?.content || t?.testimonial || t?.review_message, '');
      const author = ensureString(t?.author || t?.name || t?.author_name || t?.client_name, 'Valued Client');
      const designation = ensureString(t?.designation || t?.title || t?.company || t?.author_designation || t?.role || t?.client_designation, '');
      return { quote, author, designation };
    });

  // Service Pages Pagination (6 services per page)
  const servicePages = [];
  const sChunkSize = 6;
  for (let i = 0; i < activeServices.length; i += sChunkSize) {
    servicePages.push(activeServices.slice(i, i + sChunkSize));
  }
  if (servicePages.length === 0) {
    servicePages.push([]);
  }

  // Ensure activeTestimonials is formatted in groups/multiples of 3 per page exactly so it never breaks
  let paddedTestimonials = [...activeTestimonials];
  if (paddedTestimonials.length === 0) {
    paddedTestimonials = [...defaultTestimonials];
  } else if (paddedTestimonials.length % 3 !== 0) {
    const remainder = paddedTestimonials.length % 3;
    const needed = 3 - remainder;
    for (let i = 0; i < needed; i++) {
      paddedTestimonials.push(defaultTestimonials[i % defaultTestimonials.length]);
    }
  }

  // Testimonial Pages Pagination (3 testimonials per page)
  const testimonialPages = [];
  const tChunkSize = 3;
  for (let i = 0; i < paddedTestimonials.length; i += tChunkSize) {
    testimonialPages.push(paddedTestimonials.slice(i, i + tChunkSize));
  }
  if (testimonialPages.length === 0) {
    testimonialPages.push([]);
  }

  const calcObj = calculationResult?.data?.client
    ? calculationResult.data
    : (calculationResult?.calculation?.client
        ? calculationResult.calculation
        : (calculationResult?.result?.client
            ? calculationResult.result
            : (calculationResult?.client ? calculationResult : (calculationResult?.data || reportData?.data || reportData || calculationResult || {}))));

  const goals = calculationResult?.goals?.items || 
                calculationResult?.data?.goals?.items || 
                calculationResult?.calculation?.goals?.items ||
                reportData?.goals?.items ||
                reportData?.data?.goals?.items ||
                reportData?.calculation?.goals?.items ||
                calcObj?.goals?.items ||
                formData?.goals ||
                formData?.activeGoals || [];

  const activeChildren =
    (Array.isArray(childrenData) && childrenData.length > 0)
      ? childrenData
      : (Array.isArray(formData?.children) && formData.children.length > 0)
      ? formData.children
      : (Array.isArray(formData?.childrenData) && formData.childrenData.length > 0)
      ? formData.childrenData
      : (Array.isArray(calculationResult?.children) && calculationResult.children.length > 0)
      ? calculationResult.children
      : (Array.isArray(calculationResult?.data?.children) && calculationResult.data.children.length > 0)
      ? calculationResult.data.children
      : (Array.isArray(reportData?.children) && reportData.children.length > 0)
      ? reportData.children
      : [];

  const totalGoalsMonthlySip = formatDisplayVal(
    calculationResult?.goals?.total_monthly_sip ||
    calculationResult?.data?.goals?.total_monthly_sip ||
    reportData?.goals?.total_monthly_sip ||
    reportData?.data?.goals?.total_monthly_sip,
    '₹0'
  );

  const clientRet = calcObj?.client || calcObj?.client_data || calculationResult?.client || calculationResult?.data?.client || {};
  const spouseRet = calcObj?.spouse || calcObj?.spouse_data || calculationResult?.spouse || calculationResult?.data?.spouse || {};
  const summary = calcObj?.summary || calculationResult?.summary || calculationResult?.data?.summary || reportData?.summary || reportData?.data?.summary || {};

  const invSummary = calculationResult?.investment_summary || 
                     calculationResult?.data?.investment_summary || 
                     calculationResult?.calculation?.investment_summary ||
                     reportData?.investment_summary ||
                     reportData?.data?.investment_summary ||
                     reportData?.calculation?.investment_summary;

  const retAgeVal = Number(formData.targetRetireAge || clientRet.retirement_age || clientRet.target_retirement_age || 0);
  const clientRetAge = retAgeVal > 0 
    ? `${retAgeVal} Years` 
    : (formData.targetRetireAge || clientRet.retirement_age || clientRet.target_retirement_age)
    ? ensureString(formData.targetRetireAge || clientRet.retirement_age || clientRet.target_retirement_age)
    : '—';

  const yearsToRetVal = Number(clientRet.years_to_retirement || clientRet.years_until_retirement || formData.yearsUntilRetirement || 0);
  const clientYearsToRet = yearsToRetVal > 0 
    ? `${yearsToRetVal} Years` 
    : (clientRet.years_to_retirement || clientRet.years_until_retirement)
    ? ensureString(clientRet.years_to_retirement || clientRet.years_until_retirement)
    : '—';

  const rawRetPeriod = clientRet.retirement_period || clientRet.period || clientRet.retirement_duration || clientRet.retirement_years || formData.retirementPeriod || formData.retirement_period;
  const lifeExpVal = Number(clientRet.life_expectancy || formData.lifeExpectancy || 80);
  const computedRetPeriod = (retAgeVal > 0 && lifeExpVal > retAgeVal) ? `${lifeExpVal - retAgeVal} Years` : '20 Years';

  const clientRetPeriod = rawRetPeriod
    ? (String(rawRetPeriod).toLowerCase().includes('year') ? String(rawRetPeriod) : `${rawRetPeriod} Years`)
    : computedRetPeriod;

  const clientCorpusReq = formatInrFull(
    clientRet.corpus || clientRet.net_corpus || clientRet.total_corpus || summary.total_retirement_corpus_required || calcObj?.total_retirement_corpus_required
  );

  const clientExpToday = formatInrFull(
    clientRet.expenses_today_pm || clientRet.monthly_expense_today || clientRet.expenses_today || calcObj?.expenses_today_pm || formData.currentMonthlyExpense || formData.monthlyExpense
  );

  const clientExpAtRet = formatInrFull(
    clientRet.expenses_at_retirement_pm || clientRet.monthly_expense_at_ret || clientRet.expenses_at_retirement || calcObj?.expenses_at_retirement_pm
  );

  const clientMonthlySip = formatInrFull(
    clientRet.monthly_sip || summary.monthly_investment_required || calcObj?.monthly_sip
  );

  const clientLumpSum = formatInrFull(
    clientRet.lump_sum || calcObj?.lump_sum
  );

  const clientProvisionsMade = formatInrFull(
    clientRet.pf_corpus || clientRet.provisions_made || clientRet.pf_nps_sa || calcObj?.client_provisions_made || formData.provisionsMade || formData.pf_nps_sa
  );

  const hasClientRetirement = Boolean(
    (clientRet && (clientRet.monthly_sip?.raw > 0 || clientRet.corpus?.raw > 0)) ||
    (formData?.targetRetireAge && formData.targetRetireAge.toString().trim() !== '' && formData.targetRetireAge.toString().trim() !== '0') ||
    (clientMonthlySip && clientMonthlySip !== '₹0' && clientMonthlySip !== '—')
  );

  const hasSpouseRetirement = Boolean(
    calculationResult?.spouse && (calculationResult.spouse?.monthly_sip?.raw > 0 || calculationResult.spouse?.corpus?.raw > 0)
  );

  // Insurance
  const insuranceData = calculationResult?.insurance ||
                        calculationResult?.data?.insurance ||
                        calculationResult?.calculation?.insurance ||
                        reportData?.insurance ||
                        reportData?.data?.insurance ||
                        reportData?.calculation?.insurance ||
                        calcObj?.insurance || {};
  const totalInsuranceNeed = formatInrFull(
    insuranceData.total_required || summary.average_insurance_required
  );

  const getGoalIcon = (goalType = '') => {
    const t = goalType.toLowerCase();
    if (t.includes('renovation')) return '/assets/report/real_3d_home_renovation.png';
    if (t.includes('holiday')) return '/assets/report/real_3d_holiday_home.png';
    if (t.includes('house') || t.includes('home') || t.includes('property')) return '/assets/report/real_3d_house_purchase.png';
    if (t.includes('car') || t.includes('vehicle')) return '/assets/report/real_3d_car_purchase.png';
    if (t.includes('foreign') || t.includes('tour') || t.includes('travel') || t.includes('vacation')) return '/assets/report/foreign_tour_image1.png';
    if (t.includes('gift') || t.includes('gifting')) return '/assets/report/real_3d_family_gifting.png';
    if (t.includes('charity') || t.includes('donation')) return '/assets/report/real_3d_charity.png';
    if (t.includes('birth') || t.includes('baby')) return '/assets/report/real_3d_child_birth.png';
    if (t.includes('big') || t.includes('purchase')) return '/assets/report/real_3d_big_purchases.png';
    if (t.includes('estate')) return '/assets/report/real_3d_estate_for_children.png';
    if (t.includes('post') || t.includes('master') || t.includes('career')) return '/assets/report/real_3d_post_graduation.png';
    if (t.includes('graduation') || t.includes('education') || t.includes('studies') || t.includes('college') || t.includes('school')) return '/assets/report/real_3d_child_graduation.png';
    if (t.includes('marriage') || t.includes('wedding')) return '/assets/report/real_3d_child_marriage.png';
    if (t.includes('child')) return '/assets/report/real_3d_child_other.png';
    return '/assets/report/real_3d_other_goals.png';
  };

  const GOAL_SPEECHES = {
    house: [
      "Based on the timeline and projected cost of this goal, we suggest prioritising disciplined investments to ensure your home purchase remains a planned milestone rather than a financial burden.",
      "Owning a home often involves one of life's largest commitments. Starting early can provide greater flexibility and reduce pressure as the goal approaches.",
      "A structured approach towards this goal can help you achieve the home you envision without compromising your other financial priorities."
    ],
    car: [
      "Since this goal directly impacts your lifestyle and convenience, a dedicated investment plan can help you make this purchase comfortably when required.",
      "Planning in advance for this purchase may help you avoid dipping into emergency reserves or disrupting long-term wealth creation.",
      "We suggest treating this goal as a planned expense so that future decisions can be made based on preference rather than financial constraints."
    ],
    renovation: [
      "Home improvement expenses often arise when least expected. Preparing for them in advance can help preserve both comfort and financial stability.",
      "Setting aside dedicated resources for this goal can allow you to enhance your living space without affecting other important commitments.",
      "A planned approach to renovation ensures that lifestyle upgrades happen on your terms and timeline."
    ],
    foreign: [
      "Experiences and travel aspirations deserve the same financial attention as other life goals. Planning ahead can make them more enjoyable and stress-free.",
      "By allocating resources towards this goal today, you can look forward to future travel without compromising ongoing financial objectives.",
      "We suggest building this goal systematically so that memorable experiences do not become unexpected financial obligations."
    ],
    holiday: [
      "A holiday home is a meaningful lifestyle aspiration, and achieving it becomes more practical through disciplined preparation.",
      "Since this goal requires significant capital, early planning can provide greater flexibility and choice in the future.",
      "A dedicated investment strategy can help balance this aspiration alongside your essential financial goals."
    ],
    gifting: [
      "Celebrating important relationships often involves meaningful gestures, and planned giving helps preserve the joy behind them.",
      "We suggest budgeting for these milestones in advance so that generosity never comes at the cost of financial comfort.",
      "Thoughtful preparation can ensure that important occasions remain memorable without creating financial strain."
    ],
    charity: [
      "If giving back is important to you, incorporating it into your financial plan can help make your contributions both meaningful and sustainable.",
      "Planning for charitable goals ensures that your values are reflected in your financial decisions over time.",
      "A structured approach towards philanthropy allows you to create an impact while maintaining overall financial balance."
    ],
    birth: [
      "This phase often brings multiple planned and unplanned expenses, making early preparation especially valuable.",
      "Building a dedicated corpus for this goal can allow you to focus on the transition ahead with greater confidence.",
      "We suggest planning for these expenses in advance to minimize financial stress during an important life event."
    ],
    big: [
      "Major purchases can significantly influence cash flows, making advance planning an important part of financial well-being.",
      "We suggest preparing for large expenses systematically to avoid disrupting long-term investment goals.",
      "A dedicated strategy for significant purchases can help maintain financial discipline while meeting evolving needs."
    ],
    estate: [
      "Creating an estate is not only about transferring wealth but also about building a lasting financial legacy.",
      "We suggest approaching this goal with a long-term perspective to ensure future generations benefit from today's planning.",
      "Thoughtful preparation today can help provide security, opportunities, and continuity for those you care about."
    ],
    retirement: [
      "Retirement planning is ultimately about preserving independence and maintaining your desired lifestyle in the future.",
      "The earlier this goal is prioritized, the greater the opportunity to benefit from consistency and compounding.",
      "We suggest reviewing this goal periodically to ensure your retirement aspirations remain on track."
    ],
    graduation: [
      "Educational expenses continue to evolve, making early preparation essential for maintaining flexibility and choice.",
      "We suggest building this corpus steadily so that future academic opportunities can be pursued with confidence.",
      "Planning ahead can help ensure that financial considerations do not limit educational aspirations."
    ],
    post: [
      "Higher education often requires substantial resources, and a dedicated plan can make these aspirations more achievable.",
      "We suggest beginning preparations early to provide greater flexibility when important decisions arise.",
      "A disciplined approach towards this goal can help support future educational ambitions without compromising other priorities."
    ],
    marriage: [
      "Significant family celebrations deserve thoughtful planning to preserve both their meaning and financial balance.",
      "We suggest preparing for this milestone gradually so that the occasion can be celebrated with confidence and peace of mind.",
      "Early planning can help manage future expenses without affecting long-term financial security."
    ],
    child_other: [
      "Every aspiration is unique, and a flexible financial plan can help accommodate evolving priorities over time.",
      "We suggest revisiting this goal periodically to ensure that changing needs continue to be adequately supported.",
      "Preparing for future possibilities today can provide the confidence to pursue opportunities as they emerge."
    ]
  };

  const getGoalAdvisoryQuote = (goalType = '') => {
    const t = String(goalType).toLowerCase();
    let quotes = GOAL_SPEECHES.child_other;

    if (t.includes('renovation')) quotes = GOAL_SPEECHES.renovation;
    else if (t.includes('holiday')) quotes = GOAL_SPEECHES.holiday;
    else if (t.includes('house') || t.includes('home') || t.includes('property')) quotes = GOAL_SPEECHES.house;
    else if (t.includes('car') || t.includes('vehicle')) quotes = GOAL_SPEECHES.car;
    else if (t.includes('foreign') || t.includes('tour') || t.includes('travel') || t.includes('vacation')) quotes = GOAL_SPEECHES.foreign;
    else if (t.includes('gift') || t.includes('gifting')) quotes = GOAL_SPEECHES.gifting;
    else if (t.includes('charity') || t.includes('donation')) quotes = GOAL_SPEECHES.charity;
    else if (t.includes('birth') || t.includes('baby')) quotes = GOAL_SPEECHES.birth;
    else if (t.includes('big') || t.includes('purchase')) quotes = GOAL_SPEECHES.big;
    else if (t.includes('estate')) quotes = GOAL_SPEECHES.estate;
    else if (t.includes('retirement')) quotes = GOAL_SPEECHES.retirement;
    else if (t.includes('post') || t.includes('master')) quotes = GOAL_SPEECHES.post;
    else if (t.includes('graduation') || t.includes('education') || t.includes('college') || t.includes('school')) quotes = GOAL_SPEECHES.graduation;
    else if (t.includes('marriage') || t.includes('wedding')) quotes = GOAL_SPEECHES.marriage;

    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };

  const getCountryCodeByName = (name = '') => {
    const n = String(name).toLowerCase();
    if (n.includes('nepal')) return 'np';
    if (n.includes('sri lanka')) return 'lk';
    if (n.includes('thailand')) return 'th';
    if (n.includes('bhutan')) return 'bt';
    if (n.includes('vietnam')) return 'vn';
    if (n.includes('bali') || n.includes('indonesia')) return 'id';
    if (n.includes('malaysia')) return 'my';
    if (n.includes('dubai') || n.includes('uae') || n.includes('emirates')) return 'ae';
    if (n.includes('singapore')) return 'sg';
    if (n.includes('maldives')) return 'mv';
    if (n.includes('egypt')) return 'eg';
    if (n.includes('turkey')) return 'tr';
    if (n.includes('mauritius')) return 'mu';
    if (n.includes('china')) return 'cn';
    if (n.includes('south africa')) return 'za';
    if (n.includes('kenya')) return 'ke';
    if (n.includes('seychelles')) return 'sc';
    if (n.includes('korea')) return 'kr';
    if (n.includes('greece')) return 'gr';
    if (n.includes('germany')) return 'de';
    if (n.includes('spain')) return 'es';
    if (n.includes('italy')) return 'it';
    if (n.includes('japan')) return 'jp';
    if (n.includes('france')) return 'fr';
    if (n.includes('uk') || n.includes('kingdom') || n.includes('england') || n.includes('london')) return 'gb';
    if (n.includes('australia')) return 'au';
    if (n.includes('canada')) return 'ca';
    if (n.includes('switzerland') || n.includes('swiss')) return 'ch';
    if (n.includes('zealand')) return 'nz';
    if (n.includes('us') || n.includes('states') || n.includes('america')) return 'us';
    return 'un';
  };

  const DB_TOUR_DESTINATIONS = [
    { name: 'Nepal', budget: 90000, code: 'np', flag: '🇳🇵' },
    { name: 'Sri Lanka', budget: 110000, code: 'lk', flag: '🇱🇰' },
    { name: 'Thailand', budget: 120000, code: 'th', flag: '🇹🇭' },
    { name: 'Bhutan', budget: 120000, code: 'bt', flag: '🇧🇹' },
    { name: 'Vietnam', budget: 130000, code: 'vn', flag: '🇻🇳' },
    { name: 'Bali (Indonesia)', budget: 140000, code: 'id', flag: '🇮🇩' },
    { name: 'Malaysia', budget: 150000, code: 'my', flag: '🇲🇾' },
    { name: 'Dubai (UAE)', budget: 160000, code: 'ae', flag: '🇦🇪' },
    { name: 'Singapore', budget: 180000, code: 'sg', flag: '🇸🇬' },
    { name: 'Maldives', budget: 220000, code: 'mv', flag: '🇲🇻' },
    { name: 'Egypt', budget: 230000, code: 'eg', flag: '🇪🇬' },
    { name: 'Turkey', budget: 240000, code: 'tr', flag: '🇹🇷' },
    { name: 'Mauritius', budget: 250000, code: 'mu', flag: '🇲🇺' },
    { name: 'China', budget: 270000, code: 'cn', flag: '🇨🇳' },
    { name: 'South Africa', budget: 280000, code: 'za', flag: '🇿🇦' },
    { name: 'Kenya', budget: 300000, code: 'ke', flag: '🇰🇪' },
    { name: 'Seychelles', budget: 320000, code: 'sc', flag: '🇸🇨' },
    { name: 'South Korea', budget: 320000, code: 'kr', flag: '🇰🇷' },
    { name: 'Greece', budget: 320000, code: 'gr', flag: '🇬🇷' },
    { name: 'Germany', budget: 340000, code: 'de', flag: '🇩🇪' },
    { name: 'Spain', budget: 350000, code: 'es', flag: '🇪🇸' },
    { name: 'Italy', budget: 360000, code: 'it', flag: '🇮🇹' },
    { name: 'Japan', budget: 380000, code: 'jp', flag: '🇯🇵' },
    { name: 'France', budget: 380000, code: 'fr', flag: '🇫🇷' },
    { name: 'United Kingdom', budget: 390000, code: 'gb', flag: '🇬🇧' },
    { name: 'Australia', budget: 420000, code: 'au', flag: '🇦🇺' },
    { name: 'Canada', budget: 430000, code: 'ca', flag: '🇨🇦' },
    { name: 'Switzerland', budget: 450000, code: 'ch', flag: '🇨🇭' },
    { name: 'New Zealand', budget: 480000, code: 'nz', flag: '🇳🇿' },
    { name: 'United States', budget: 520000, code: 'us', flag: '🇺🇸' },
  ];

  const DB_UNIVERSITIES = [
    { name: 'IIT Bombay', cost: 1500000 },
    { name: 'IIT Delhi', cost: 1600000 },
    { name: 'IIT Madras', cost: 1550000 },
    { name: 'Shri Ram College of Commerce (SRCC)', cost: 1200000 },
    { name: 'IIM Ahmedabad', cost: 2500000 },
    { name: 'IIM Bangalore', cost: 2450000 },
    { name: 'AIIMS New Delhi', cost: 1800000 },
    { name: 'Maulana Azad Institute of Dental Sciences', cost: 3500000 },
    { name: 'Manipal Academy of Higher Education', cost: 2800000 },
    { name: 'BITS Pilani', cost: 2200000 },
    { name: 'St. Xavier\'s College, Mumbai', cost: 1000000 },
    { name: 'Christ University, Bangalore', cost: 1400000 },
    { name: 'Kazakh National Medical University', cost: 4000000 },
    { name: 'First Moscow State Medical University', cost: 4500000 },
    { name: 'University of Oxford (UK)', cost: 6500000 },
    { name: 'Harvard University (USA)', cost: 8500000 },
    { name: 'Stanford University (USA)', cost: 9000000 },
    { name: 'National University of Singapore (NUS)', cost: 5500000 },
    { name: 'University of Toronto (Canada)', cost: 8000000 },
    { name: 'Technical University of Denmark', cost: 8000000 },
    { name: 'Singapore Management University', cost: 8000000 },
    { name: 'Politecnico di Milano', cost: 8000000 },
    { name: 'USC School of Cinematic Arts', cost: 8000000 },
    { name: 'University of Toronto Faculty of Dentistry', cost: 8000000 },
    { name: 'London Business School', cost: 8000000 },
    { name: 'MIT', cost: 9000000 },
    { name: 'University of Melbourne (Australia)', cost: 5800000 },
  ];

  const fmtInrRange = (bInr) => {
    const low = Math.round(bInr * 0.85);
    const high = Math.round(bInr * 1.15);
    return `₹${low.toLocaleString('en-IN')} - ₹${high.toLocaleString('en-IN')}`;
  };

  const extractTargetBudget = (goalObj, defaultVal) => {
    let raw =
      goalObj?.todaysCost ||
      goalObj?.today_cost ||
      goalObj?.current_cost?.inr ||
      goalObj?.current_cost?.raw ||
      goalObj?.current_cost ||
      goalObj?.cost ||
      goalObj?.budget;

    if (raw != null) {
      if (typeof raw === 'number' && raw > 0) return raw;
      if (typeof raw === 'object' && raw.raw && typeof raw.raw === 'number') return raw.raw;
      if (typeof raw === 'string') {
        const cleaned = raw.replace(/[^0-9.]/g, '');
        const parsed = parseFloat(cleaned);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
    }
    return defaultVal;
  };

  const findFormGoal = (gObj, fObj, cData = []) => {
    if (!fObj && !cData) return null;
    const rawGType = gObj?.goal_type || gObj?.title || gObj?.goal || '';
    const gType = String(rawGType).toLowerCase();
    const isEdu = gType.includes('education') || gType.includes('graduation') || gType.includes('college');
    const isTour = gType.includes('tour') || gType.includes('foreign') || gType.includes('vacation') || gType.includes('trip');

    const goalsList = [
      ...(Array.isArray(fObj?.goals) ? fObj.goals : []),
      ...(Array.isArray(fObj?.activeGoals) ? fObj.activeGoals : []),
      ...(Array.isArray(fObj?.lifestyleGoals) ? fObj.lifestyleGoals : []),
    ];

    for (let fg of goalsList) {
      if (!fg) continue;
      const rawFg = fg?.goalType || fg?.goal_type || fg?.title || fg?.name || fg?.id || '';
      const fgType = String(rawFg).toLowerCase();

      if (isEdu && (fgType.includes('education') || fgType.includes('graduation') || fgType.includes('college'))) {
        return fg;
      }
      if (isTour && (fgType.includes('tour') || fgType.includes('foreign') || fgType.includes('vacation') || fgType.includes('trip'))) {
        return fg;
      }
      if (fgType && (gType.includes(fgType) || fgType.includes(gType))) {
        return fg;
      }
    }

    const childrenList = [
      ...(Array.isArray(cData) ? cData : []),
      ...(Array.isArray(fObj?.children) ? fObj.children : []),
      ...(Array.isArray(fObj?.childrenData) ? fObj.childrenData : []),
    ];

    for (let child of childrenList) {
      if (!child) continue;
      if (isEdu && (child.selectedColleges || child.selected_colleges || child.budgetOptions)) {
        return child;
      }
      if (Array.isArray(child.goals)) {
        for (let fg of child.goals) {
          if (!fg) continue;
          const rawFg = fg?.goalType || fg?.goal_type || fg?.title || fg?.name || fg?.id || '';
          const fgType = String(rawFg).toLowerCase();
          if (isEdu && (fgType.includes('education') || fgType.includes('graduation') || fgType.includes('college') || fg.selectedColleges || fg.budgetOptions)) {
            return fg;
          }
        }
      }
    }

    return null;
  };

  const getDynamicTourOptions = (goalObj, formObj, calcObj, cData = []) => {
    const matchedFormGoal = findFormGoal(goalObj, formObj, cData);
    const combinedGoal = { ...matchedFormGoal, ...goalObj };

    let explicit =
      combinedGoal?.selectedDestinations ||
      combinedGoal?.selected_destinations ||
      combinedGoal?.destinations ||
      combinedGoal?.suggested_tours ||
      combinedGoal?.tour_slots ||
      combinedGoal?.selected_countries ||
      combinedGoal?.countries ||
      combinedGoal?.budgetOptions ||
      combinedGoal?.budget_options ||
      formObj?.foreignTourDestinations ||
      formObj?.selectedDestinations ||
      [];

    if ((!explicit || explicit.length === 0) && Array.isArray(formObj?.goals)) {
      formObj.goals.forEach(g => {
        if ((g.selectedDestinations && g.selectedDestinations.length > 0) || (g.budgetOptions && g.budgetOptions.length > 0)) {
          explicit = g.selectedDestinations || g.budgetOptions;
        }
      });
    }

    if (typeof explicit === 'string') {
      try { explicit = JSON.parse(explicit); } catch (e) { explicit = explicit.split(',').map(s => s.trim()); }
    }

    if (Array.isArray(explicit) && explicit.length > 0) {
      const list = [];
      explicit.forEach(item => {
        if (typeof item === 'object' && item && (item.name || item.destination || item.country)) {
          const destName = item.name || item.destination || item.country;
          let matched = DB_TOUR_DESTINATIONS.find(d => d.name.toLowerCase().includes(destName.toLowerCase()));
          const code = item.code || (matched ? matched.code : getCountryCodeByName(destName));
          list.push({
            flag: item.flag || (matched ? matched.flag : '✈️'),
            code,
            name: destName,
            cost: item.cost ? (typeof item.cost === 'number' ? `₹${item.cost.toLocaleString('en-IN')} (per person)` : (String(item.cost).toLowerCase().includes('per person') ? String(item.cost) : `${item.cost} (per person)`)) : (matched ? `${fmtInrRange(matched.budget)} (per person)` : '₹3,50,000 - ₹5,00,000 (per person)'),
          });
        } else if (typeof item === 'string' && item) {
          let matched = DB_TOUR_DESTINATIONS.find(d => d.name.toLowerCase().includes(item.toLowerCase()) || item.toLowerCase().includes(d.name.toLowerCase()));
          const code = matched ? matched.code : getCountryCodeByName(item);
          list.push({
            flag: matched ? matched.flag : '✈️',
            code,
            name: matched ? matched.name : item,
            cost: matched ? `${fmtInrRange(matched.budget)} (per person)` : '₹3,50,000 - ₹5,00,000 (per person)',
          });
        }
      });
      if (list.length > 0) {
        const selectedNames = new Set(list.map(l => l.name.toLowerCase()));
        const rawBudget = extractTargetBudget(combinedGoal, 900000);
        const travellers = Number(combinedGoal?.travellers || formObj?.travellers || 3);
        const perPersonBudget = rawBudget > 150000 ? Math.round(rawBudget / travellers) : rawBudget;

        const fillers = [...DB_TOUR_DESTINATIONS]
          .sort((a, b) => Math.abs(a.budget - perPersonBudget) - Math.abs(b.budget - perPersonBudget))
          .filter(d => !selectedNames.has(d.name.toLowerCase()))
          .map(d => ({ flag: d.flag, code: d.code, name: d.name, cost: `${fmtInrRange(d.budget)} (per person)` }));

        const final5 = [...list, ...fillers].slice(0, 5);
        console.log('🚀 [REPORT LOGGER] Top 5 Tour Options for Report:', final5.map(x => x.name));
        return final5;
      }
    }

    // Dynamic budget distance calculation
    const rawBudget = extractTargetBudget(combinedGoal, 900000);
    const travellers = Number(combinedGoal?.travellers || formObj?.travellers || 3);
    const perPersonBudget = rawBudget > 150000 ? Math.round(rawBudget / travellers) : rawBudget;
    const sorted = [...DB_TOUR_DESTINATIONS].sort((a, b) => Math.abs(a.budget - perPersonBudget) - Math.abs(b.budget - perPersonBudget));

    const final5 = sorted.slice(0, 5).map(d => ({
      flag: d.flag,
      code: d.code,
      name: d.name,
      cost: `${fmtInrRange(d.budget)} (per person)`,
    }));
    console.log('🚀 [REPORT LOGGER] Top 5 Tour Options for Report (Calculated):', final5.map(x => x.name));
    return final5;
  };

  const getDynamicUniversities = (goalObj, formObj, calcObj, cData = []) => {
    const matchedFormGoal = findFormGoal(goalObj, formObj, cData);
    const combinedGoal = { ...matchedFormGoal, ...goalObj };

    let explicit =
      combinedGoal?.selectedColleges ||
      combinedGoal?.selected_colleges ||
      combinedGoal?.colleges ||
      combinedGoal?.college_list ||
      combinedGoal?.budgetOptions ||
      combinedGoal?.budget_options ||
      formObj?.selectedColleges ||
      formObj?.education_colleges ||
      [];

    const childrenList = [
      ...(Array.isArray(cData) ? cData : []),
      ...(Array.isArray(formObj?.children) ? formObj.children : []),
      ...(Array.isArray(formObj?.childrenData) ? formObj.childrenData : []),
    ];

    if (!explicit || explicit.length === 0) {
      childrenList.forEach(c => {
        if (Array.isArray(c.selectedColleges) && c.selectedColleges.length > 0) {
          explicit = c.selectedColleges;
        } else if (Array.isArray(c.budgetOptions) && c.budgetOptions.length > 0) {
          explicit = c.budgetOptions;
        } else if (Array.isArray(c.goals)) {
          c.goals.forEach(cg => {
            if (cg.selectedColleges && cg.selectedColleges.length > 0) explicit = cg.selectedColleges;
            else if (cg.budgetOptions && cg.budgetOptions.length > 0) explicit = cg.budgetOptions;
          });
        }
      });
    }

    if (Array.isArray(formObj?.goals)) {
      formObj.goals.forEach(g => {
        if ((!explicit || explicit.length === 0) && g.selectedColleges && g.selectedColleges.length > 0) {
          explicit = g.selectedColleges;
        }
      });
    }

    if (typeof explicit === 'string') {
      try { explicit = JSON.parse(explicit); } catch (e) { explicit = [explicit]; }
    }

    if (Array.isArray(explicit) && explicit.length > 0) {
      const list = explicit.map(c => {
        if (typeof c === 'object' && c) {
          const cName = c.name || c.college_name || c.college || c.university || 'Selected University';
          const cCost = c.cost || c.todaysCost || c.today_cost || c.budget;
          return {
            name: cName,
            cost: cCost ? (typeof cCost === 'number' ? `₹${cCost.toLocaleString('en-IN')}` : String(cCost)) : '₹20,00,000'
          };
        }
        return { name: String(c), cost: '₹20,00,000' };
      });

      if (list.length > 0) {
        const selectedNames = new Set(list.map(l => l.name.toLowerCase()));
        const budgetVal = extractTargetBudget(combinedGoal, 6000000);

        const fillerColleges = [...DB_UNIVERSITIES]
          .sort((a, b) => Math.abs(a.cost - budgetVal) - Math.abs(b.cost - budgetVal))
          .filter(u => !selectedNames.has(u.name.toLowerCase()))
          .map(u => ({ name: u.name, cost: `₹${u.cost.toLocaleString('en-IN')}` }));

        const final5 = [...list, ...fillerColleges].slice(0, 5);
        console.log('🚀 [REPORT LOGGER] Top 5 Universities for Report:', final5.map(x => x.name));
        return final5;
      }
    }

    // Dynamic budget distance calculation
    const budgetVal = extractTargetBudget(goalObj, 6000000);
    const sorted = [...DB_UNIVERSITIES].sort((a, b) => Math.abs(a.cost - budgetVal) - Math.abs(b.cost - budgetVal));

    const final5 = sorted.slice(0, 5).map(u => ({
      name: u.name,
      cost: `₹${u.cost.toLocaleString('en-IN')}`,
    }));
    console.log('🚀 [REPORT LOGGER] Top 5 Universities for Report (Calculated):', final5.map(x => x.name));
    return final5;
  };

  const firstForeignTourGoalIndex = goals.findIndex((g) => {
    const t = String(g.goal_type || g.goal || g.title || '').toLowerCase();
    return t.includes('foreign') || (t.includes('tour') && !t.includes('home'));
  });

  return (
    <div
      ref={ref}
      id="full-report-capture-container"
      style={{
        width: '595px',
        backgroundColor: '#ffffff',
        margin: '0 auto',
        fontFamily: '"Montserrat", "Segoe UI", Helvetica, Arial, sans-serif',
        color: '#1c1b1a',
      }}
    >
      {/* PAGE 1: COVER PAGE (100% Exact Visual Replica of Reference Image) */}
      <div
        className="report-page"
        style={{
          width: '595px',
          height: '842px',
          backgroundColor: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
          margin: 0,
          padding: 0,
          fontFamily: '"Montserrat", "Segoe UI", Helvetica, Arial, sans-serif',
          pageBreakAfter: 'always',
          breakAfter: 'page',
        }}
      >
        {/* 1. Pure SVG Vector Background Shapes - Mathematically Precise Parallel Geometry */}
        <svg
          style={{ position: 'absolute', top: 0, left: 0, width: '595px', height: '842px', zIndex: 1 }}
          viewBox="0 0 595 842"
        >
          {/* Base Page Canvas */}
          <rect width="595" height="842" fill="#ffffff" />

          {/* TOP-LEFT LAYER 1: Cerulean Blue Wedge (#01569e) */}
          <polygon points="0,0 169,0 0,220" fill="#01569e" />
          {/* TOP-LEFT LAYER 2: Deep Classic Navy Slice (#00297c) */}
          <polygon points="0,0 92,0 0,120" fill="#00297c" />

          {/* BOTTOM-RIGHT LAYER 1: Parallel Light Grey Diagonal Stripe (#efefef) */}
          <polygon points="595,186 595,266 152,842 91,842" fill="#efefef" />

          {/* BOTTOM-RIGHT LAYER 2: Main Cerulean Blue Diagonal Band (#01569e) */}
          <polygon points="595,266 595,646 445,842 152,842" fill="#01569e" />

          {/* BOTTOM-RIGHT LAYER 3: Corner Deep Classic Navy Wedge (#00297c) */}
          <polygon points="595,646 595,842 445,842" fill="#00297c" />
        </svg>

        {/* 2. Top-Right Wealth Wisdom Crest Logo */}
        <div style={{ position: 'absolute', top: '35px', right: '40px', zIndex: 10, textAlign: 'right' }}>
          <img
            src="/assets/wealth-wisdom-logo.png"
            alt="Wealth Wisdom Logo"
            style={{ height: '62px', objectFit: 'contain', display: 'block' }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>

        {/* 3. Dynamic Client Text Block */}
        <div style={{ position: 'absolute', top: '220px', left: '55px', width: '330px', zIndex: 10 }}>
          <h2
            style={{
              fontSize: '23px',
              fontWeight: 800,
              fontStyle: 'italic',
              color: '#01569e',
              margin: '0 0 10px 0',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
            }}
          >
            Goal Analysis Report
          </h2>
          <h1
            style={{
              fontSize: '44px',
              fontWeight: 900,
              fontStyle: 'italic',
              color: '#000000',
              margin: '0 0 16px 0',
              lineHeight: 1.1,
              wordBreak: 'break-word',
              maxWidth: '320px',
              letterSpacing: '-0.02em',
            }}
          >
            {clientName}
          </h1>
          <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>
            Generated on: {reportDate}
          </div>
        </div>

        {/* 4. Circular Photo Frame with Thick White Border */}
        <div
          style={{
            position: 'absolute',
            bottom: '35px',
            right: '25px',
            width: '360px',
            height: '360px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '10px solid #ffffff',
            boxShadow: '0 14px 36px rgba(0, 41, 124, 0.22)',
            zIndex: 5,
            backgroundColor: '#ffffff',
          }}
        >
          <img
            src="/assets/report/cover_photo_gemini_real.png"
            alt="Real Financial Planning Meeting"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      </div>

      {/* DYNAMIC ROADMAP */}
      <RoadmapTemplate goals={goals} childrenData={activeChildren} clientName={clientName} />

      {/* PAGES 3..N: INDIVIDUAL GOAL PAGES */}
      {goals.map((g, idx) => {
          const rawTitle = g.goal_type || g.goal || 'Financial Goal';
          const goalName = formatGoalTitle(g, activeChildren, goals);
          const childName = getActualChildName(g, activeChildren, goals);

          const targetYear = ensureString(g.target_year || g.year, '—');
          const currentCost = formatDisplayVal(g.current_cost || g.today_cost || g.todaysCost, '₹0');
          const futureCost = formatDisplayVal(g.future_cost, '₹0');
          const monthlySip = formatDisplayVal(g.monthly_sip, '₹0');
          const iconPath = getGoalIcon(rawTitle + ' ' + goalName);
          const advisoryQuote = getGoalAdvisoryQuote(rawTitle + ' ' + goalName);

          const isForeignTour = idx === firstForeignTourGoalIndex;
          const shouldRenderForeignTourPage = isForeignTour;

          const isTourGoal =
            goalName.toLowerCase().includes('tour') ||
            goalName.toLowerCase().includes('foreign') ||
            goalName.toLowerCase().includes('vacation') ||
            goalName.toLowerCase().includes('trip') ||
            rawTitle.toLowerCase().includes('tour') ||
            rawTitle.toLowerCase().includes('foreign') ||
            rawTitle.toLowerCase().includes('vacation') ||
            rawTitle.toLowerCase().includes('trip');

          let tourTotalCost = currentCost;
          if (isTourGoal) {
            const perPersonRaw = Number(g.costPerPerson || g.cost_per_person || 0);
            const travellersCount = Number(g.travellers || g.people || formData?.travellers || 0);
            const totalRaw = Number(g.todaysCost || g.today_cost || g.current_cost || 0);

            if (totalRaw > 0 && perPersonRaw > 0 && totalRaw === perPersonRaw && travellersCount > 1) {
              tourTotalCost = `₹${Math.round(perPersonRaw * travellersCount).toLocaleString('en-IN')}`;
            } else if (totalRaw > 0) {
              tourTotalCost = formatDisplayVal(totalRaw, currentCost);
            } else if (perPersonRaw > 0 && travellersCount > 1) {
              tourTotalCost = `₹${Math.round(perPersonRaw * travellersCount).toLocaleString('en-IN')}`;
            }
          }


          const isEducation =
            goalName.toLowerCase().includes('education') ||
            goalName.toLowerCase().includes('graduation') ||
            goalName.toLowerCase().includes('higher studies') ||
            goalName.toLowerCase().includes('studies') ||
            goalName.toLowerCase().includes('college') ||
            goalName.toLowerCase().includes('university') ||
            goalName.toLowerCase().includes('school') ||
            rawTitle.toLowerCase().includes('education') ||
            rawTitle.toLowerCase().includes('graduation') ||
            rawTitle.toLowerCase().includes('higher studies') ||
            rawTitle.toLowerCase().includes('studies') ||
            rawTitle.toLowerCase().includes('college') ||
            rawTitle.toLowerCase().includes('university') ||
            rawTitle.toLowerCase().includes('school');

        return (
          <React.Fragment key={idx}>
            <div
              className="report-page"
              style={{
                width: '595px',
                height: '842px',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box',
                padding: '30px 40px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                pageBreakAfter: 'always',
              }}
            >
              {/* Header Logo */}
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <img src="/assets/wealth-wisdom-logo.png" alt="Wealth Wisdom Logo" style={{ height: '48px', objectFit: 'contain', margin: '0 auto' }} />
              </div>

              {/* Title and 3D Icon Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <h1 style={{ fontSize: '42px', fontWeight: 900, color: '#0f172a', lineHeight: 1.05, margin: 0, maxWidth: '270px', letterSpacing: '-0.02em' }}>
                  {goalName}
                </h1>
                <div style={{ width: '210px', height: '190px', marginTop: '-10px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <img src={iconPath} alt={goalName} style={{ maxWidth: '210px', maxHeight: '190px', width: 'auto', height: 'auto', objectFit: 'contain', display: 'block' }} />
                </div>
              </div>

              {/* Middle Content Row: Left Column (Target Year + Speech Bubble) vs Right Column (Current Cost + Future Cost) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', marginBottom: '16px' }}>
                {/* LEFT COLUMN: Target Year D-Pill + Speech Bubble PNG */}
                <div style={{ width: '235px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Target Year D-Shaped Half-Capsule Pill (Pure HTML/CSS - Flush at x = 0) */}
                  <div
                    style={{
                      position: 'relative',
                      width: '215px',
                      backgroundColor: '#ffffff',
                      border: '3px solid #0E2C7E',
                      borderLeft: 'none',
                      borderRadius: '0 50px 50px 0',
                      padding: '12px 20px 12px 58px',
                      marginLeft: '-40px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div style={{ fontSize: '16px', color: '#2459D2', fontWeight: 700, lineHeight: 1.1 }}>
                      Target Year
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 900, color: '#0E2C7E', marginTop: '4px', lineHeight: 1.1 }}>
                      {targetYear}
                    </div>
                  </div>

                  {/* Dynamic Speech Bubble Frame with Overlay Quote Text */}
                  <div style={{ position: 'relative', width: '235px', height: '220px' }}>
                    <img
                      src="/assets/report/speech_bubble_blank.png"
                      alt="Goal Advisory Quote Bubble"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        right: '24px',
                        bottom: '38px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        padding: '4px',
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '13.5px',
                          lineHeight: 1.4,
                          fontWeight: 400,
                          fontStyle: 'italic',
                          color: '#000000',
                          margin: 0,
                          fontFamily: '"Montserrat", "Segoe UI", Helvetica, Arial, sans-serif',
                          textAlign: 'left',
                          letterSpacing: '-0.01em',
                          WebkitFontSmoothing: 'antialiased',
                        }}
                      >
                        {advisoryQuote}
                      </p>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Current Cost & Future Cost Pills */}
                <div style={{ width: '260px', display: 'flex', flexDirection: 'column', gap: '18px', justifyContent: 'center' }}>
                  {/* Current Cost Pill */}
                  <div
                    style={{
                      border: '3px solid #0E2C7E',
                      borderRadius: '24px',
                      padding: '14px 20px',
                      textAlign: 'center',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <div style={{ fontSize: '15px', color: '#2459D2', fontWeight: 700 }}>
                      {isTourGoal ? "Current Total Cost" : isEducation ? "Approx. Current Cost" : "Current Cost"}
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: 900, color: '#0E2C7E', marginTop: '2px' }}>
                      {isTourGoal ? tourTotalCost : currentCost}
                    </div>
                  </div>

                  {/* Future Cost Pill */}
                  <div
                    style={{
                      border: '3px solid #0E2C7E',
                      borderRadius: '24px',
                      padding: '14px 20px',
                      textAlign: 'center',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <div style={{ fontSize: '16px', color: '#2459D2', fontWeight: 700 }}>Future Cost</div>
                    <div style={{ fontSize: '26px', fontWeight: 900, color: '#0E2C7E', marginTop: '2px' }}>{futureCost}</div>
                  </div>
                </div>
              </div>

              {/* Bottom Full-Width Monthly Investment Required Pill */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #1A46C4 0%, #0E2C7E 100%)',
                  borderRadius: '36px',
                  padding: '16px 24px',
                  textAlign: 'center',
                  marginTop: 'auto',
                }}
              >
                <div style={{ fontSize: '16px', color: '#BAE0FF', fontWeight: 700, letterSpacing: '0.02em' }}>
                  Monthly Investment Required
                </div>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', marginTop: '4px' }}>
                  {monthlySip}
                </div>
              </div>
            </div>

            {/* If Foreign Tour Goal & Not Rendered Yet -> Add Suggested Foreign Tour Options Page (Max 1 across report) */}
            {shouldRenderForeignTourPage && (
              <div
                className="report-page"
                style={{
                  width: '595px',
                  height: '842px',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box',
                  padding: '30px 40px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  pageBreakAfter: 'always',
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                  <img src="/assets/wealth-wisdom-logo.png" alt="Wealth Wisdom Logo" style={{ height: '48px', objectFit: 'contain', margin: '0 auto' }} />
                </div>

                <div>
                  <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', margin: '0 0 20px 0', textAlign: 'center' }}>
                    Suggested Foreign<br />Tour Options
                  </h1>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '440px', margin: '0 auto' }}>
                    {getDynamicTourOptions(g, formData, calculationResult, childrenData).map((cOpt, cIdx) => (
                      <div key={cIdx} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div
                          style={{
                            width: '42px',
                            height: '28px',
                            borderRadius: '5px',
                            overflow: 'hidden',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                            border: '1px solid #cbd5e1',
                            flexShrink: 0,
                            backgroundColor: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <img
                            src={`https://flagcdn.com/w80/${cOpt.code || getCountryCodeByName(cOpt.name)}.png`}
                            alt={cOpt.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              if (e.currentTarget.parentElement) {
                                e.currentTarget.parentElement.innerText = cOpt.flag || '✈️';
                              }
                            }}
                          />
                        </div>
                        <div>
                          <div style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>{cOpt.name}</div>
                          <div style={{ fontSize: '15px', fontWeight: 600, color: '#334155' }}>
                            {cOpt.cost ? (String(cOpt.cost).toLowerCase().includes('per person') ? String(cOpt.cost) : `${cOpt.cost} (per person)`) : ''}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ alignSelf: 'flex-end', width: '210px', height: '180px', marginTop: '10px', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                  <img src="/assets/report/real_3d_paper_plane.png" alt="Paper Plane" style={{ maxWidth: '210px', maxHeight: '180px', width: 'auto', height: 'auto', objectFit: 'contain', display: 'block' }} />
                </div>
              </div>
            )}

            {/* If Education -> Add Suggested Universities Page */}
            {isEducation && (
              <div
                className="report-page"
                style={{
                  width: '595px',
                  height: '842px',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box',
                  padding: '35px 40px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  pageBreakAfter: 'always',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <img src="/assets/wealth-wisdom-logo.png" alt="Wealth Wisdom Logo" style={{ height: '48px', objectFit: 'contain', margin: '0 auto' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h1 style={{ fontSize: '38px', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1.15 }}>
                    Suggested<br />Universities &amp; Colleges
                  </h1>

                  <div style={{ width: '180px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <img src="/assets/report/real_3d_suggested_uni.png" alt="School Building" style={{ maxWidth: '180px', maxHeight: '150px', width: 'auto', height: 'auto', objectFit: 'contain', display: 'block' }} />
                  </div>
                </div>

                {/* Prominent Centered Personalized Options Banner */}
                <div
                  style={{
                    backgroundColor: '#001a66',
                    borderRadius: '20px',
                    padding: '14px 20px',
                    textAlign: 'center',
                    color: '#ffffff',
                    margin: '6px 0',
                    boxShadow: '0 4px 12px rgba(0, 26, 102, 0.12)',
                  }}
                >
                  <div style={{ fontSize: '13px', color: '#BAE0FF', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Personalized For {childName ? childName : 'You'}
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 900, color: '#ffffff', marginTop: '2px', letterSpacing: '-0.01em' }}>
                    Most Relevant Options
                  </div>
                </div>

                {/* Top 5 Colleges Table Equally Spaced Below */}
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px', marginTop: '6px' }}>
                  <tbody>
                    {getDynamicUniversities(g, formData, calculationResult, childrenData).map((uni, uIdx) => (
                      <tr key={uIdx} style={{ borderBottom: '1px solid #cbd5e1' }}>
                        <td style={{ padding: '16px 0', fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>{uni.name}</td>
                        <td style={{ padding: '16px 0', textAlign: 'right', fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>{uni.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </React.Fragment>
        );
      })}

      {/* PAGE 9: RETIREMENT PLANNING PAGE (Only rendered if retirement details are filled) */}
      {hasClientRetirement && (
        <div
          className="report-page"
          style={{
            width: '595px',
            height: '842px',
            backgroundColor: '#ffffff',
            boxSizing: 'border-box',
            padding: '30px 40px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            pageBreakAfter: 'always',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <img src="/assets/wealth-wisdom-logo.png" alt="Wealth Wisdom Logo" style={{ height: '48px', objectFit: 'contain', margin: '0 auto' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h1 style={{ fontSize: '38px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              Retirement<br />Planning
            </h1>
            <div style={{ width: '190px', height: '170px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <img src="/assets/report/real_3d_retirement.png" alt="Beach Chair" style={{ maxWidth: '190px', maxHeight: '170px', width: 'auto', height: 'auto', objectFit: 'contain', display: 'block' }} />
            </div>
          </div>

          {/* 3 Top Pure Vector SVG Bubbly Inset Cards Row */}
          <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
            {[
              { label: 'Retirement Age', val: clientRetAge },
              { label: 'Retirement Period', val: clientRetPeriod },
              { label: 'Years to Retirement', val: clientYearsToRet },
            ].map((card, idx) => (
              <div
                key={idx}
                style={{
                  flex: 1,
                  height: '95px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxSizing: 'border-box',
                }}
              >
                <svg
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 1,
                    borderRadius: '22px',
                    overflow: 'hidden',
                  }}
                >
                  <defs>
                    <filter id={`neu-inset-${idx}`} x="-20%" y="-20%" width="140%" height="140%">
                      <feOffset dx="3" dy="3" />
                      <feGaussianBlur stdDeviation="3.5" result="offset-blur" />
                      <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                      <feFlood flood-color="#94a3b8" flood-opacity="0.7" result="color" />
                      <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                      <feComposite operator="over" in="shadow" in2="SourceGraphic" />
                    </filter>
                  </defs>
                  <rect width="100%" height="100%" rx="22" fill="#e6ebf2" stroke="#cbd5e1" strokeWidth="1.5" filter={`url(#neu-inset-${idx})`} />
                </svg>

                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#475569',
                      textAlign: 'center',
                      lineHeight: 1.2,
                      marginBottom: '6px',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {card.label}
                  </div>
                  <div
                    style={{
                      fontSize: String(card.val || '').length > 6 ? '19px' : '26px',
                      fontWeight: 900,
                      color: '#0f172a',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {card.val}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dark Blue Corpus Pill */}
          <div style={{ background: 'linear-gradient(135deg, #1A46C4 0%, #0E2C7E 100%)', borderRadius: '24px', padding: '16px', textAlign: 'center', color: '#ffffff' }}>
            <div style={{ fontSize: '14px', color: '#BAE0FF', fontWeight: 600 }}>Total Retirement Corpus</div>
            <div style={{ fontSize: '30px', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>{clientCorpusReq}</div>
          </div>

          {/* Provisions Made (PF, NPS & SA) */}
          <div style={{ background: 'linear-gradient(135deg, #1A46C4 0%, #0E2C7E 100%)', borderRadius: '18px', padding: '14px 20px', textAlign: 'center', color: '#ffffff' }}>
            <div style={{ color: '#BAE0FF', fontSize: '14px', fontWeight: 700 }}>Provisions Made (PF, NPS &amp; SA)</div>
            <div style={{ color: '#ffffff', fontSize: '24px', fontWeight: 900, marginTop: '4px' }}>{clientProvisionsMade}</div>
          </div>

          {/* Expense Pills Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ border: '2.5px solid #0E2C7E', borderRadius: '18px', padding: '10px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#2459D2', fontWeight: 700 }}>Expense at today's rate (P.M.)</div>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#0E2C7E', marginTop: '2px' }}>{clientExpToday}</div>
            </div>
            <div style={{ border: '2.5px solid #0E2C7E', borderRadius: '18px', padding: '10px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#2459D2', fontWeight: 700 }}>Expense at Retirement (P.M.)</div>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#0E2C7E', marginTop: '2px' }}>{clientExpAtRet}</div>
            </div>
            <div style={{ border: '2.5px solid #0E2C7E', borderRadius: '18px', padding: '10px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#2459D2', fontWeight: 700 }}>Monthly Investment Required</div>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#0E2C7E', marginTop: '2px' }}>{clientMonthlySip}</div>
            </div>
            <div style={{ border: '2.5px solid #0E2C7E', borderRadius: '18px', padding: '10px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#2459D2', fontWeight: 700 }}>Lump Sum Investment Required</div>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#0E2C7E', marginTop: '2px' }}>{clientLumpSum}</div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 10: INSURANCE CALCULATIONS PAGE */}
      <div
        className="report-page"
        style={{
          width: '595px',
          height: '842px',
          backgroundColor: '#ffffff',
          boxSizing: 'border-box',
          padding: '35px 40px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          pageBreakAfter: 'always',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <img src="/assets/wealth-wisdom-logo.png" alt="Wealth Wisdom Logo" style={{ height: '48px', objectFit: 'contain', margin: '0 auto' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1.1 }}>
            Insurance Need<br />Calculations
          </h1>
          <div style={{ width: '150px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <img src="/assets/report/real_3d_insurance.png" alt="Shield Hand" style={{ maxWidth: '150px', maxHeight: '130px', width: 'auto', height: 'auto', objectFit: 'contain', display: 'block' }} />
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px', border: '1px solid #cbd5e1', marginTop: '8px', tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ backgroundColor: '#2459D2', color: '#ffffff', fontWeight: 800, textAlign: 'center' }}>
              <th style={{ width: '23%', padding: '10px 4px', border: '1px solid #cbd5e1', lineHeight: '1.2' }}>Goals to be protected</th>
              <th style={{ width: '12%', padding: '10px 4px', border: '1px solid #cbd5e1', lineHeight: '1.2' }}>For/ After years</th>
              <th style={{ width: '24%', padding: '10px 4px', border: '1px solid #cbd5e1', lineHeight: '1.2' }}>Amount</th>
              <th style={{ width: '14%', padding: '10px 4px', border: '1px solid #cbd5e1', lineHeight: '1.2' }}>Today's/ Future cost</th>
              <th style={{ width: '27%', padding: '10px 4px', border: '1px solid #cbd5e1', lineHeight: '1.2' }}>INSURANCE REQUIRED</th>
            </tr>
          </thead>
          <tbody>
            {insuranceData?.items && Array.isArray(insuranceData.items) && insuranceData.items.length > 0 ? (
              insuranceData.items.map((ins, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '10px 6px', border: '1px solid #cbd5e1', fontWeight: 600 }}>
                    {ins.need || ins.goal || 'Insurance Need'}
                  </td>
                  <td style={{ padding: '10px 4px', border: '1px solid #cbd5e1', textAlign: 'center' }}>
                    {ins.years !== undefined && ins.years !== null ? ins.years : '—'}
                  </td>
                  <td style={{ padding: '10px 6px', border: '1px solid #cbd5e1', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {formatInrFull(ins.amount, '₹0')}
                  </td>
                  <td style={{ padding: '10px 4px', border: '1px solid #cbd5e1', textAlign: 'center' }}>
                    {ins.type || 'Today'}
                  </td>
                  <td style={{ padding: '10px 6px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {formatInrFull(ins.pv || ins.insurance_required || ins.amount, '₹0')}
                  </td>
                </tr>
              ))
            ) : (
              <>
                {(() => {
                  const insItems = calculationResult?.insurance?.items || calculationResult?.data?.insurance?.items || reportData?.insurance?.items || reportData?.data?.insurance?.items || [];
                  const householdItem = insItems.find(i => i && i.need && i.need.toLowerCase().includes('household')) || insItems[0] || {};
                  const retirementItem = insItems.find(i => i && i.need && i.need.toLowerCase().includes('retirement')) || insItems[2] || {};

                  const rawMonthlyExp = parseFloat(String(clientExpToday || '0').replace(/[^0-9.]/g, '')) || 8249;
                  const yearsToRetNum = parseInt(String(clientYearsToRet || '8'), 10) || 8;

                  const calcHouseholdAmt = Math.round(rawMonthlyExp * 12);
                  const calcHouseholdPv = Math.round(rawMonthlyExp * 12 * yearsToRetNum);

                  const calcRetirementAmt = Math.round(rawMonthlyExp * 6);
                  const calcRetirementPv = Math.round(rawMonthlyExp * 6 * yearsToRetNum);

                  const householdAmt = householdItem.amount || calculationResult?.insurance?.household_expense?.amount || `₹${calcHouseholdAmt.toLocaleString('en-IN')}`;
                  const householdPv = householdItem.pv || householdItem.insurance_required || calculationResult?.insurance?.household_expense?.insurance_required || `₹${calcHouseholdPv.toLocaleString('en-IN')}`;

                  const retirementAmt = retirementItem.amount || calculationResult?.insurance?.retirement_income?.amount || `₹${calcRetirementAmt.toLocaleString('en-IN')}`;
                  const retirementPv = retirementItem.pv || retirementItem.insurance_required || calculationResult?.insurance?.retirement_income?.insurance_required || `₹${calcRetirementPv.toLocaleString('en-IN')}`;
                  return (
                    <>
                      <tr>
                        <td style={{ padding: '10px 6px', border: '1px solid #cbd5e1', fontWeight: 600 }}>Household Expenses</td>
                        <td style={{ padding: '10px 4px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{householdItem.years || clientYearsToRet || 14}</td>
                        <td style={{ padding: '10px 6px', border: '1px solid #cbd5e1', textAlign: 'right', whiteSpace: 'nowrap' }}>{formatInrFull(householdAmt, '₹0')}</td>
                        <td style={{ padding: '10px 4px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{householdItem.type || 'Today\'s Value'}</td>
                        <td style={{ padding: '10px 6px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: 700, whiteSpace: 'nowrap' }}>{formatInrFull(householdPv, '₹0')}</td>
                      </tr>
                      {goals.map((g, idx) => {
                        const goalTitle = formatGoalTitle(g, activeChildren, goals) || g.goal_type || g.title || g.goal || 'Lifestyle & Child Goals';
                        return (
                          <tr key={idx}>
                            <td style={{ padding: '10px 6px', border: '1px solid #cbd5e1', fontWeight: 600 }}>{goalTitle}</td>
                            <td style={{ padding: '10px 4px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{g.target_year || g.year || 1}</td>
                            <td style={{ padding: '10px 6px', border: '1px solid #cbd5e1', textAlign: 'right', whiteSpace: 'nowrap' }}>{formatInrFull(g.future_cost, '₹0')}</td>
                            <td style={{ padding: '10px 4px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Future</td>
                            <td style={{ padding: '10px 6px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: 700, whiteSpace: 'nowrap' }}>{formatInrFull(g.insurance_required || g.required_insurance || g.insurance_need || g.future_cost, '₹0')}</td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td style={{ padding: '10px 6px', border: '1px solid #cbd5e1', fontWeight: 600 }}>Retirement Income (50%)</td>
                        <td style={{ padding: '10px 4px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{retirementItem.years || clientYearsToRet || 14}</td>
                        <td style={{ padding: '10px 6px', border: '1px solid #cbd5e1', textAlign: 'right', whiteSpace: 'nowrap' }}>{formatInrFull(retirementAmt, '₹0')}</td>
                        <td style={{ padding: '10px 4px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{retirementItem.type || 'Today\'s Value'}</td>
                        <td style={{ padding: '10px 6px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: 700, whiteSpace: 'nowrap' }}>{formatInrFull(retirementPv, '₹0')}</td>
                      </tr>
                    </>
                  );
                })()}
              </>
            )}
            <tr style={{ backgroundColor: '#2459D2', fontWeight: 900 }}>
              <td colSpan="4" style={{ padding: '12px 10px', border: '1px solid #cbd5e1', fontSize: '12px', color: '#ffffff' }}>Total insurance need</td>
              <td style={{ padding: '12px 10px', border: '1px solid #cbd5e1', textAlign: 'right', fontSize: '14px', color: '#ffffff', whiteSpace: 'nowrap' }}>
                {formatInrFull(insuranceData.total_required || totalInsuranceNeed, '₹0')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* PAGE 11: SUMMARY PAGE */}
      <div
        className="report-page"
        style={{
          width: '595px',
          height: '842px',
          backgroundColor: '#ffffff',
          boxSizing: 'border-box',
          padding: '15px 40px 25px 40px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          pageBreakAfter: 'always',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <img src="/assets/wealth-wisdom-logo.png" alt="Wealth Wisdom Logo" style={{ height: '42px', objectFit: 'contain', margin: '0 auto' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
            Investment Summary
          </h1>
          <div style={{ width: '130px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <img
              src="/assets/report/summary_checklist_image.png"
              alt="Summary Checklist"
              style={{ maxWidth: '130px', maxHeight: '80px', width: 'auto', height: 'auto', objectFit: 'contain', display: 'block' }}
            />
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', border: '1px solid #cbd5e1', marginTop: '4px' }}>
          <thead>
            <tr style={{ backgroundColor: '#2459D2', color: '#ffffff', fontWeight: 800, textAlign: 'center' }}>
              <th style={{ padding: '12px 10px', border: '1px solid #cbd5e1' }}>Goals</th>
              <th style={{ padding: '12px 10px', border: '1px solid #cbd5e1' }}>Target Year</th>
              <th style={{ padding: '12px 10px', border: '1px solid #cbd5e1' }}>Monthly Investment</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              let rowsToRender = [];
              if (invSummary?.rows && Array.isArray(invSummary.rows) && invSummary.rows.length > 0) {
                rowsToRender = [...invSummary.rows];
                if (!hasClientRetirement) {
                  rowsToRender = rowsToRender.filter(row => !row.is_retirement && !String(row.goal || row.goal_name || '').toLowerCase().includes('retirement'));
                }
              }

              const containsRetirementRow = rowsToRender.some(row => row.is_retirement || String(row.goal || row.goal_name || '').toLowerCase().includes('retirement'));

              const finalRows = [];
              if (hasClientRetirement && !containsRetirementRow) {
                finalRows.push({
                  goal: hasSpouseRetirement ? 'Retirement Planning (Client)' : 'Retirement Planning',
                  target_year: clientRet?.target_year || clientRet?.target_retirement_year || (clientRetAge && clientRetAge !== '—' ? (String(clientRetAge).length === 4 ? clientRetAge : `${clientRetAge} Yrs`) : '—'),
                  monthly_investment: clientRet?.monthly_sip || clientMonthlySip,
                  is_retirement: true,
                });
                if (hasSpouseRetirement) {
                  finalRows.push({
                    goal: 'Retirement Planning (Spouse)',
                    target_year: calculationResult.spouse?.target_year || ensureString(formData.spouseTargetRetireAge || calculationResult.spouse?.retirement_age, '—'),
                    monthly_investment: calculationResult.spouse?.monthly_sip,
                    is_retirement: true,
                  });
                }
              }

              if (rowsToRender.length > 0) {
                finalRows.push(...rowsToRender);
              } else {
                goals.forEach(g => {
                  finalRows.push({
                    goal: formatGoalTitle(g, activeChildren, goals),
                    target_year: ensureString(g.target_year || g.year, '—'),
                    monthly_investment: g.monthly_sip,
                  });
                });
              }

              return finalRows.map((row, idx) => {
                const goalTitle = row.goal || row.goal_name || row.name || 'Goal';
                const targetYear = row.target_year !== undefined && row.target_year !== null && row.target_year !== '' ? String(row.target_year) : '—';
                const monthlyInvest = formatInrFull(row.monthly_investment, '₹0');

                return (
                  <tr key={idx}>
                    <td style={{ padding: '12px 10px', border: '1px solid #cbd5e1', fontWeight: row.is_retirement ? 800 : 700, color: '#0f172a' }}>
                      {goalTitle}
                    </td>
                    <td style={{ padding: '12px 10px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 700 }}>
                      {targetYear}
                    </td>
                    <td style={{ padding: '12px 10px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap' }}>
                      {monthlyInvest}
                    </td>
                  </tr>
                );
              });
            })()}

            {/* Combined Total Monthly Investment Row */}
            <tr style={{ backgroundColor: '#2459D2', fontWeight: 900 }}>
              <td colSpan="2" style={{ padding: '14px 12px', border: '1px solid #cbd5e1', fontSize: '14px', color: '#ffffff' }}>Total Monthly Investment</td>
              <td style={{ padding: '14px 12px', border: '1px solid #cbd5e1', textAlign: 'right', fontSize: '16px', color: '#ffffff', whiteSpace: 'nowrap' }}>
                {formatInrFull(
                  invSummary?.total_monthly_investment ||
                  summary?.monthly_investment_required ||
                  totalGoalsMonthlySip,
                  '₹0'
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* PAGE 12: WHAT WE ASSUME? PAGE */}
      <div
        className="report-page"
        style={{
          width: '595px',
          height: '842px',
          backgroundColor: '#ffffff',
          boxSizing: 'border-box',
          padding: '15px 40px 25px 40px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          pageBreakAfter: 'always',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <img src="/assets/wealth-wisdom-logo.png" alt="Wealth Wisdom Logo" style={{ height: '42px', objectFit: 'contain', margin: '0 auto' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1.1 }}>
            What we<br />assume?
          </h1>
          <div style={{ width: '130px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <img src="/assets/report/real_3d_scroll.png" alt="Scroll Ribbon" style={{ maxWidth: '130px', maxHeight: '80px', width: 'auto', height: 'auto', objectFit: 'contain', display: 'block' }} />
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', border: '1px solid #cbd5e1', marginTop: '8px' }}>
          <thead>
            <tr style={{ backgroundColor: '#2459D2', color: '#ffffff', fontWeight: 800 }}>
              <th style={{ padding: '14px 16px', border: '1px solid #cbd5e1', textAlign: 'left' }}>Assumptions</th>
              <th style={{ padding: '14px 16px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Values</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '13px 16px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Life Expectancy (Years)</td>
              <td style={{ padding: '13px 16px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 800, fontSize: '15px' }}>80</td>
            </tr>
            <tr>
              <td style={{ padding: '13px 16px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Inflation (Post Retirement)</td>
              <td style={{ padding: '13px 16px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 800, fontSize: '15px' }}>6.0%</td>
            </tr>
            <tr>
              <td style={{ padding: '13px 16px', border: '1px solid #cbd5e1', fontWeight: 700 }}>ROI (Post Retirement)</td>
              <td style={{ padding: '13px 16px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 800, fontSize: '15px' }}>8.0%</td>
            </tr>
            <tr>
              <td style={{ padding: '13px 16px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Inflation (Pre Retirement)</td>
              <td style={{ padding: '13px 16px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 800, fontSize: '15px' }}>6.0%</td>
            </tr>
            <tr>
              <td style={{ padding: '13px 16px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Return On Investment</td>
              <td style={{ padding: '13px 16px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 800, fontSize: '15px' }}>12.0%</td>
            </tr>
            <tr>
              <td style={{ padding: '13px 16px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Yearly Increse in PF Contribution</td>
              <td style={{ padding: '13px 16px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 800, fontSize: '15px' }}>5%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* DYNAMIC OUR SERVICES PAGES */}
      {servicePages.map((pageServices, pageIdx) => (
        <div
          key={`services-page-${pageIdx}`}
          className="report-page"
          style={{
            width: '595px',
            height: '842px',
            backgroundColor: '#ffffff',
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box',
            padding: '25px 40px 30px 40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            pageBreakAfter: 'always',
          }}
        >
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '220px', height: '220px', zIndex: 1 }} viewBox="0 0 220 220">
            <polygon points="0,0 220,0 0,220" fill="#002b80" />
          </svg>

          <svg style={{ position: 'absolute', bottom: 0, right: 0, width: '360px', height: '360px', zIndex: 1 }} viewBox="0 0 360 360">
            <polygon points="360,0 360,360 0,360" fill="#2459D2" />
          </svg>

          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
            <img src="/assets/wealth-wisdom-logo.png" alt="Wealth Wisdom Logo" style={{ height: '48px', objectFit: 'contain', margin: '0 auto' }} />
          </div>

          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
            <h1 style={{ fontSize: '44px', fontWeight: 900, color: '#000000', textAlign: 'center', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
              Our Services {servicePages.length > 1 ? `(${pageIdx + 1}/${servicePages.length})` : ''}
            </h1>
            <div style={{ width: '80px', height: '4px', backgroundColor: '#2459D2', margin: '0 auto 24px auto', borderRadius: '2px' }} />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', maxWidth: '440px', margin: '0 auto' }}>
              {pageServices.map((srv, idx) => (
                <div
                  key={idx}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '18px',
                    padding: '10px 22px',
                    borderRadius: '20px',
                    backgroundColor: '#f8fafc',
                    boxShadow: '4px 4px 12px rgba(0, 26, 102, 0.06), -4px -4px 12px rgba(255, 255, 255, 0.9)',
                    boxSizing: 'border-box',
                  }}
                >
                  {/* 3D Neomorphic Tick Badge */}
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: '#e6effd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '3px 3px 8px rgba(0, 26, 102, 0.15), -3px -3px 8px rgba(255, 255, 255, 0.9), inset 1.5px 1.5px 3px rgba(255, 255, 255, 0.9), inset -1.5px -1.5px 3px rgba(0, 26, 102, 0.08)',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ color: '#002b80', fontSize: '18px', fontWeight: 900 }}>✓</span>
                  </div>

                  <span style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em', textAlign: 'left' }}>
                    {srv}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* DYNAMIC TESTIMONIALS PAGES */}
      {testimonialPages.map((pageTestimonials, pageIdx) => (
        <div
          key={`testimonials-page-${pageIdx}`}
          className="report-page"
          style={{
            width: '595px',
            height: '842px',
            backgroundColor: '#ffffff',
            boxSizing: 'border-box',
            padding: '25px 40px 30px 40px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            pageBreakAfter: 'always',
            overflow: 'hidden',
          }}
        >
          {/* Top-Left Dark Blue Geometric Accent */}
          <svg
            style={{ position: 'absolute', top: 0, left: 0, width: '190px', height: '190px', zIndex: 1 }}
            viewBox="0 0 190 190"
          >
            <polygon points="0,0 190,0 0,190" fill="#001866" />
          </svg>

          {/* Top Header Logo */}
          <div style={{ textAlign: 'center', zIndex: 2 }}>
            <img src="/assets/wealth-wisdom-logo.png" alt="Wealth Wisdom Logo" style={{ height: '50px', objectFit: 'contain', margin: '0 auto' }} />
          </div>

          {/* Main Title */}
          <h1 style={{ fontSize: '44px', fontWeight: 900, color: '#111827', textAlign: 'center', margin: '10px 0', zIndex: 2, letterSpacing: '-0.02em' }}>
            Testimonials {testimonialPages.length > 1 ? `(${pageIdx + 1}/${testimonialPages.length})` : ''}
          </h1>

          {/* Staggered Speech Bubble Testimonial Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 2, marginBottom: '16px' }}>
            {pageTestimonials.map((item, tIdx) => {
              const layoutOptions = [
                { indentLeft: '0px', indentRight: '45px', tailMargin: '0 0 0 60px', tailAlign: 'flex-start' },
                { indentLeft: '45px', indentRight: '0px', tailMargin: '0 60px 0 0', tailAlign: 'flex-end' },
                { indentLeft: '0px', indentRight: '45px', tailMargin: '0 0 0 60px', tailAlign: 'flex-start' },
              ];
              const styleOpt = layoutOptions[tIdx % layoutOptions.length];

              return (
                <div
                  key={tIdx}
                  style={{
                    marginLeft: styleOpt.indentLeft,
                    marginRight: styleOpt.indentRight,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: styleOpt.tailAlign,
                  }}
                >
                  <div
                    style={{
                      backgroundColor: '#F0F6FE',
                      border: '2.5px solid #00297c',
                      borderRadius: '24px',
                      padding: '16px 20px 12px 20px',
                      boxShadow: '4px 5px 0px #00297c',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  >
                    {/* Single Dark Blue Quotation Icon */}
                    <div style={{ fontSize: '34px', color: '#01569e', lineHeight: 0.9, marginBottom: '4px', fontWeight: 900 }}>
                      ❝
                    </div>
                    {/* Quote Text */}
                    <p style={{ fontSize: '11.5px', fontWeight: 700, lineHeight: 1.4, margin: '0 0 8px 0', color: '#0f172a' }}>
                      {item.quote}
                    </p>
                    {/* Author Details */}
                    <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#01569e', textAlign: 'right' }}>
                      -{item.author}{item.designation ? `, ${item.designation}` : ''}
                    </div>
                  </div>

                  {/* Speech Bubble Triangular Pointer Notch */}
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: '12px solid transparent',
                      borderRight: '12px solid transparent',
                      borderTop: '14px solid #F0F6FE',
                      margin: styleOpt.tailMargin,
                      marginTop: '-2px',
                      filter: 'drop-shadow(2px 3px 0px #00297c)',
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* PAGE 15: CONTACT BACK COVER PAGE (100% Exact Replica of Reference Image) */}
      <div
        className="report-page"
        style={{
          width: '595px',
          height: '842px',
          backgroundColor: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
          margin: 0,
          padding: 0,
          fontFamily: '"Montserrat", "Segoe UI", Helvetica, Arial, sans-serif',
        }}
      >
        {/* 1. Pure SVG Vector Background Shapes - EXACTLY Identical to Cover Page (Page 1) */}
        <svg
          style={{ position: 'absolute', top: 0, left: 0, width: '595px', height: '842px', zIndex: 1 }}
          viewBox="0 0 595 842"
        >
          {/* Base Page Canvas */}
          <rect width="595" height="842" fill="#ffffff" />

          {/* TOP-LEFT LAYER 1: Cerulean Blue Wedge (#01569e) */}
          <polygon points="0,0 169,0 0,220" fill="#01569e" />
          {/* TOP-LEFT LAYER 2: Deep Classic Navy Slice (#00297c) */}
          <polygon points="0,0 92,0 0,120" fill="#00297c" />

          {/* BOTTOM-RIGHT LAYER 1: Parallel Light Grey Diagonal Stripe (#efefef) */}
          <polygon points="595,186 595,266 152,842 91,842" fill="#efefef" />

          {/* BOTTOM-RIGHT LAYER 2: Main Cerulean Blue Diagonal Band (#01569e) */}
          <polygon points="595,266 595,646 445,842 152,842" fill="#01569e" />

          {/* BOTTOM-RIGHT LAYER 3: Corner Deep Classic Navy Wedge (#00297c) */}
          <polygon points="595,646 595,842 445,842" fill="#00297c" />
        </svg>

        {/* 2. Content Container (Left Side) */}
        <div
          style={{
            position: 'absolute',
            top: '110px',
            left: '60px',
            width: '310px',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Wealth Wisdom Logo */}
          <div style={{ marginBottom: '22px' }}>
            <img
              src="/assets/wealth-wisdom-logo.png"
              alt="Wealth Wisdom Logo"
              style={{ height: '68px', objectFit: 'contain', display: 'block' }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>

          {/* Headline */}
          <h2
            style={{
              fontSize: '19px',
              fontWeight: 800,
              fontStyle: 'italic',
              color: '#01569e',
              margin: '0 0 24px 0',
              lineHeight: 1.3,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
            }}
          >
            GET IN TOUCH FOR DETAILED<br />INVESTMENT PLANNING
          </h2>

          {/* Contact Details Directory */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* Phone */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: '#01569e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#ffffff">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </div>
              <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#00297c', letterSpacing: '-0.01em' }}>
                +91 94222 03162, +91 86239 12149
              </div>
            </div>

            {/* WhatsApp */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: '#01569e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#ffffff">
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
                </svg>
              </div>
              <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#00297c', letterSpacing: '-0.01em' }}>
                +91 95611 15408
              </div>
            </div>

            {/* Email */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '11px' }}>
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: '#01569e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px',
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#ffffff">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#00297c', lineHeight: 1.35, letterSpacing: '-0.01em' }}>
                <div>kailashmalpani@wealthwisdom.com</div>
                <div>keshavmalpani@wealthwisdom.com</div>
              </div>
            </div>

            {/* Address 1 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '11px' }}>
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: '#01569e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px',
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#ffffff">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <div style={{ fontSize: '10px', fontWeight: 500, color: '#00297c', lineHeight: 1.35, letterSpacing: '-0.01em' }}>
                D 614, FREEDOM TOWERS, Behind<br />
                Asian Hospital, Akashwani square,<br />
                Chhatrapati Sambhaji Nagar<br />
                (Aurangabad) 431005
              </div>
            </div>

            {/* Address 2 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '11px' }}>
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: '#01569e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px',
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#ffffff">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <div style={{ fontSize: '10px', fontWeight: 500, color: '#00297c', lineHeight: 1.35, letterSpacing: '-0.01em' }}>
                1st Floor, MASSIA Building More Chowk,<br />
                Waluj MIDC Chh. Sambhajinagar<br />
                (Aurangabad) – 431136
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

FullReportTemplate.displayName = 'FullReportTemplate';
