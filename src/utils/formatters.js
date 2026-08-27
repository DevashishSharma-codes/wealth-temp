export const calculateCorpus = (formData) => {
  const years = parseInt(formData.yearsUntilRetirement, 10) || 30;
  const baseCorpus = (parseFloat(formData.requiredAnnualIncome) * 20) / 10000000 || 4.2;
  return Math.max(1.2, parseFloat(baseCorpus.toFixed(2)));
};

export const calculateReadinessScore = (formData) => {
  const totalSavings =
    (parseFloat(formData.epfTotalCorpus) || 0) +
    (parseFloat(formData.npsTotalCorpus) || 0) +
    (parseFloat(formData.superTotalCorpus) || 0);
  const scoreVal = Math.min(100, Math.round((totalSavings / 5000000) * 100));
  return scoreVal > 0 ? scoreVal : 72;
};

export const buildCalcPayload = (formData) => {
  // Check if retirement section was skipped (all fields empty)
  const fields = [
    'targetRetireAge', 'yearsUntilRetirement', 'requiredAnnualIncome',
    'epfEmployerShare', 'epfEmployeeShare', 'epfTotalCorpus',
    'npsEmployerShare', 'npsEmployeeShare', 'npsTotalCorpus',
    'superEmployerShare', 'superTotalCorpus',
  ];
  const isRetEmpty = fields.every(field => !formData[field] || formData[field].toString().trim() === '');

  if (isRetEmpty) {
    return {};
  }

  const parseNum = (val) => {
    if (val === undefined || val === null || val.toString().trim() === '') return undefined;
    const num = parseFloat(val);
    return isNaN(num) ? undefined : num;
  };

  const epfEmp = parseNum(formData.epfEmployerShare);
  const epfSelf = parseNum(formData.epfEmployeeShare);
  const epfAccum = parseNum(formData.epfTotalCorpus);

  const npsEmp = parseNum(formData.npsEmployerShare);
  const npsSelf = parseNum(formData.npsEmployeeShare);
  const npsAccum = parseNum(formData.npsTotalCorpus);

  const saEmp = parseNum(formData.superEmployerShare);
  const saAccum = parseNum(formData.superTotalCorpus);

  const reqIncome = parseNum(formData.requiredAnnualIncome);
  const hhMonthly = parseNum(formData.monthlyExpense);

  const epfAnnualShares = [epfEmp, epfSelf].filter(v => v !== undefined);
  const clientEpfAnnual = epfAnnualShares.length > 0 ? epfAnnualShares.reduce((a, b) => a + b, 0) : undefined;
  const clientEpfAccum = epfAccum;

  const payload = {};

  if (reqIncome !== undefined) payload.client_annual_ret_reqd = reqIncome;
  if (hhMonthly !== undefined) payload.household_monthly = hhMonthly;
  if (clientEpfAnnual !== undefined) payload.client_epf_annual = clientEpfAnnual;
  if (clientEpfAccum !== undefined) payload.client_epf_accum = clientEpfAccum;

  // OpenAPI standard parameters for NPS & Superannuation (SA) — strictly without frontend defaults
  if (npsEmp !== undefined) {
    payload.employer_nps_pm = npsEmp;
    payload.nps_employer_share = npsEmp;
  }
  if (npsSelf !== undefined) {
    payload.self_nps_pm = npsSelf;
    payload.nps_employee_share = npsSelf;
  }
  if (npsAccum !== undefined) {
    payload.current_nps_accum = npsAccum;
    payload.nps_total_corpus = npsAccum;
    payload.nps_corpus = npsAccum;
    payload.npsTotalCorpus = npsAccum;
    payload.npsCorpus = npsAccum;
  }

  if (saEmp !== undefined) {
    payload.sa_pm = saEmp;
    payload.super_employer_share = saEmp;
    payload.sa_employer_share = saEmp;
  }
  if (saAccum !== undefined) {
    payload.current_sa_accum = saAccum;
    payload.super_total_corpus = saAccum;
    payload.super_corpus = saAccum;
    payload.superTotalCorpus = saAccum;
    payload.superCorpus = saAccum;
    payload.sa_total_corpus = saAccum;
    payload.sa_corpus = saAccum;
    payload.saTotalCorpus = saAccum;
    payload.saCorpus = saAccum;
  }

  if (epfAccum !== undefined) {
    payload.epf_total_corpus = epfAccum;
    payload.epf_corpus = epfAccum;
    payload.epfTotalCorpus = epfAccum;
    payload.epfCorpus = epfAccum;
  }
  if (epfEmp !== undefined) payload.epf_employer_share = epfEmp;
  if (epfSelf !== undefined) payload.epf_employee_share = epfSelf;

  return payload;
};

/**
 * Determine if a goal is specifically a child goal (Education, Higher Studies, Marriage, Child-related).
 * Lifestyle goals (Foreign Tour, Car, House, Vacation, Retirement, Emergency Fund, etc.) are strictly NOT child goals.
 */
export const isChildGoal = (goal) => {
  if (!goal) return false;

  if (typeof goal === 'string') {
    const s = goal.toLowerCase().trim();
    // Explicit non-child indicators
    if (
      s.includes('tour') || 
      s.includes('foreign') || 
      s.includes('vacation') || 
      s.includes('trip') || 
      s.includes('travel') || 
      s.includes('car') || 
      s.includes('vehicle') || 
      s.includes('automobile') ||
      s.includes('house') || 
      s.includes('home') || 
      s.includes('property') || 
      s.includes('emergency') || 
      s.includes('retirement') || 
      s.includes('wealth') || 
      s.includes('business') ||
      s.includes('household')
    ) {
      return false;
    }
    return (
      s.includes('child') ||
      s.includes('education') ||
      s.includes('graduation') ||
      s.includes('studies') ||
      s.includes('school') ||
      s.includes('college')
    );
  }

  if (goal.category === 'lifestyle' || goal.category === 'retirement' || goal.is_retirement) {
    return false;
  }

  if (goal.category === 'child_goal' || goal.category === 'child') {
    return true;
  }

  if (goal.child_id || goal.child_number !== undefined || goal.child_index !== undefined) {
    return true;
  }

  const rawTitle = (goal.goal_name || goal.goal_type || goal.title || goal.goal || goal.name || goal.need || '').toLowerCase().trim();
  
  if (
    rawTitle.includes('tour') || 
    rawTitle.includes('foreign') || 
    rawTitle.includes('vacation') || 
    rawTitle.includes('trip') || 
    rawTitle.includes('travel') || 
    rawTitle.includes('car') || 
    rawTitle.includes('vehicle') || 
    rawTitle.includes('automobile') ||
    rawTitle.includes('house') || 
    rawTitle.includes('home') || 
    rawTitle.includes('property') || 
    rawTitle.includes('emergency') || 
    rawTitle.includes('retirement') || 
    rawTitle.includes('wealth') || 
    rawTitle.includes('business') ||
    rawTitle.includes('household')
  ) {
    return false;
  }

  return (
    rawTitle.includes('child') ||
    rawTitle.includes('education') ||
    rawTitle.includes('graduation') ||
    rawTitle.includes('studies') ||
    rawTitle.includes('school') ||
    rawTitle.includes('college')
  );
};

/**
 * Helper to infer the real child name from childrenData if child_name is missing or generic ("Child 1", "Child 2").
 * STRICTLY returns empty string for non-child goals (Tour, Car, House, etc.).
 */
export const getActualChildName = (goal = {}, childrenData = [], allGoals = []) => {
  if (!goal) return '';

  // If this is NOT a child goal, NEVER attach a child name!
  if (!isChildGoal(goal)) {
    return '';
  }

  // 1. Resolve childrenData if not provided or empty
  let effectiveChildren = Array.isArray(childrenData) && childrenData.length > 0 ? childrenData : [];
  if (effectiveChildren.length === 0 && typeof window !== 'undefined') {
    try {
      if (window.__WW_CHILDREN_DATA__ && Array.isArray(window.__WW_CHILDREN_DATA__) && window.__WW_CHILDREN_DATA__.length > 0) {
        effectiveChildren = window.__WW_CHILDREN_DATA__;
      } else {
        const rawState = sessionStorage.getItem("ww_assessment_state");
        if (rawState) {
          const parsed = JSON.parse(rawState);
          if (Array.isArray(parsed?.childrenData) && parsed.childrenData.length > 0) {
            effectiveChildren = parsed.childrenData;
          } else if (Array.isArray(parsed?.formData?.childrenData) && parsed.formData.childrenData.length > 0) {
            effectiveChildren = parsed.formData.childrenData;
          } else if (Array.isArray(parsed?.formData?.children) && parsed.formData.children.length > 0) {
            effectiveChildren = parsed.formData.children;
          }
        }
      }
    } catch (e) {
      // Ignore session storage errors
    }
  }

  // Also check if goal itself carries childrenData or children
  if (effectiveChildren.length === 0) {
    if (Array.isArray(goal.childrenData) && goal.childrenData.length > 0) effectiveChildren = goal.childrenData;
    else if (Array.isArray(goal.children) && goal.children.length > 0) effectiveChildren = goal.children;
    else if (Array.isArray(goal.formData?.childrenData) && goal.formData.childrenData.length > 0) effectiveChildren = goal.formData.childrenData;
    else if (Array.isArray(goal.formData?.children) && goal.formData.children.length > 0) effectiveChildren = goal.formData.children;
  }

  const isGenericName = (n) => !n || /^child\s*\d*('s)?$/i.test(String(n).trim());

  // 2. Check if goal has an explicit child_name or childName
  let name = (typeof goal === 'object' && goal ? (goal.child_name || goal.childName || '') : '').trim();

  // If raw title or goal_name starts with a name + "'s", e.g. "Aarav's Higher Studies"
  const rawTitle = (typeof goal === 'string' ? goal : (goal.goal_name || goal.goal_type || goal.title || goal.goal || goal.name || goal.need || '')).trim();
  const titleNameMatch = rawTitle.match(/^([A-Za-z0-9\s]+)'s\s+/i);
  if (titleNameMatch && titleNameMatch[1] && !isGenericName(titleNameMatch[1])) {
    name = titleNameMatch[1].trim();
  }

  // 3. If name is generic ("Child 1", "Child 2") or empty, look up in effectiveChildren
  if (isGenericName(name) && effectiveChildren.length > 0) {
    let childIdx = -1;

    // By child_id
    if (goal.child_id !== undefined && goal.child_id !== null) {
      childIdx = effectiveChildren.findIndex(c => c && String(c.id || c._id || c.child_id) === String(goal.child_id));
    }
    // By child_number
    if (childIdx < 0 && goal.child_number !== undefined && goal.child_number !== null) {
      childIdx = parseInt(goal.child_number, 10) - 1;
    }
    // By child_index
    if (childIdx < 0 && goal.child_index !== undefined && goal.child_index !== null) {
      childIdx = parseInt(goal.child_index, 10);
    }
    // By matching "Child 1", "Child 2" inside the string
    if (childIdx < 0) {
      const goalStr = `${rawTitle} ${goal.goal || ''} ${goal.goal_type || ''} ${goal.name || ''} ${goal.title || ''} ${goal.goal_name || ''} ${goal.need || ''}`;
      const match = goalStr.match(/child\s*(\d+)/i);
      if (match && match[1]) {
        childIdx = parseInt(match[1], 10) - 1;
      }
    }

    // By index in allGoals
    if (childIdx < 0 && Array.isArray(allGoals) && allGoals.length > 0) {
      const childGoalsOnly = allGoals.filter(isChildGoal);
      const foundPos = childGoalsOnly.indexOf(goal);
      if (foundPos >= 0) {
        childIdx = Math.min(foundPos, effectiveChildren.length - 1);
      }
    }

    // Single child fallback: ONLY if this is confirmed to be a child goal
    if (childIdx < 0 && effectiveChildren.length === 1 && isChildGoal(goal)) {
      childIdx = 0;
    }

    if (childIdx >= 0 && effectiveChildren[childIdx]) {
      const foundChild = effectiveChildren[childIdx];
      const realName = (typeof foundChild === 'string' ? foundChild : (foundChild.name || foundChild.child_name || foundChild.childName || '')).trim();
      if (realName && !isGenericName(realName)) {
        name = realName;
      }
    }
  }

  // 4. Fallback for child goals when generic name still remains (ONLY for child goals!)
  if (isGenericName(name) && effectiveChildren.length > 0 && isChildGoal(goal)) {
    let targetIdx = 0;
    if (goal.child_number) targetIdx = parseInt(goal.child_number, 10) - 1;
    else if (goal.child_index !== undefined) targetIdx = parseInt(goal.child_index, 10);
    else {
      const match = rawTitle.match(/child\s*(\d+)/i);
      if (match && match[1]) targetIdx = parseInt(match[1], 10) - 1;
    }

    const fallbackChild = effectiveChildren[targetIdx] || effectiveChildren[0];
    if (fallbackChild) {
      const realName = (typeof fallbackChild === 'string' ? fallbackChild : (fallbackChild.name || fallbackChild.child_name || fallbackChild.childName || '')).trim();
      if (realName && !isGenericName(realName)) {
        name = realName;
      }
    }
  }

  // If still generic or empty, assign a fallback name like "Child 1" / "Child 2" only if this is a child goal and no real name exists
  if (isGenericName(name) && isChildGoal(goal)) {
    if (goal.child_number) {
      name = `Child ${goal.child_number}`;
    } else if (goal.child_index !== undefined) {
      name = `Child ${parseInt(goal.child_index, 10) + 1}`;
    } else if (name) {
      // keep existing generic "Child 1", etc.
    } else if (goal.category === 'child_goal' || (typeof goal === 'string' && /child/i.test(goal))) {
      name = 'Child 1';
    } else {
      return '';
    }
  }

  return name ? name.replace(/'s$/i, '') : '';
};

/**
 * Format goal title uniformly across Roadmap, Goal Cards, and Report tables.
 * Replaces "Graduation", "Higher Education", "Education" with "Higher Studies".
 * Prefixes child-related goals with child's name (e.g. "Aarav's Higher Studies", "Priya's Marriage").
 * STRICTLY NEVER prefixes non-child goals (Foreign Tour, Car, House, etc.) with a child's name.
 */
export const formatGoalTitle = (goal = {}, childrenData = [], allGoals = []) => {
  if (!goal) return 'Financial Goal';

  const isChild = isChildGoal(goal);
  const childName = isChild ? getActualChildName(goal, childrenData, allGoals) : '';
  const isGeneric = !childName || /^child\s*\d*$/i.test(childName.trim());

  if (typeof goal === 'string') {
    let formatted = goal.trim();

    // If NOT a child goal, just return clean title without child name
    if (!isChild) {
      if (
        /^graduation(\s*fund)?$/i.test(formatted) ||
        /^higher\s*education$/i.test(formatted) ||
        /^higher\s*studies$/i.test(formatted)
      ) {
        return 'Higher Studies';
      }
      return formatted;
    }

    // If string has "Child 1's" / "Child 2's", strip generic child prefix
    if (childName && !isGeneric) {
      formatted = formatted.replace(/^child\s*\d+('s)?\s*[-–:]?\s*/i, '');
      formatted = formatted.replace(/^child\s*[-–:]?\s*/i, '');
    }

    if (
      /^[-–:]?\s*graduation(\s*fund)?$/i.test(formatted) ||
      /^[-–:]?\s*higher\s*education$/i.test(formatted) ||
      /^[-–:]?\s*education$/i.test(formatted) ||
      /^[-–:]?\s*child\s*education$/i.test(formatted) ||
      /^[-–:]?\s*higher\s*studies$/i.test(formatted)
    ) {
      return childName && !isGeneric ? `${childName}'s Higher Studies` : (childName ? `${childName}'s Higher Studies` : 'Higher Studies');
    }

    if (
      /^[-–:]?\s*marriage(\s*fund)?$/i.test(formatted) ||
      /^[-–:]?\s*wedding$/i.test(formatted) ||
      /^[-–:]?\s*child\s*marriage$/i.test(formatted)
    ) {
      return childName && !isGeneric ? `${childName}'s Marriage` : (childName ? `${childName}'s Marriage` : 'Marriage');
    }

    formatted = formatted
      .replace(/\bgraduation\b/gi, 'Higher Studies')
      .replace(/\bhigher education\b/gi, 'Higher Studies');

    if (childName && !isGeneric) {
      if (!formatted.toLowerCase().startsWith(childName.toLowerCase())) {
        return `${childName}'s ${formatted.replace(/^[-–:]\s*/, '')}`;
      }
    }
    return formatted;
  }

  const rawTitle = (goal.goal_name || goal.goal_type || goal.goal || goal.title || goal.name || goal.need || 'Financial Goal').trim();

  // If this is NOT a child goal, NEVER attach a child's name!
  if (!isChild) {
    if (
      /^graduation(\s*fund)?$/i.test(rawTitle) ||
      /^higher\s*education$/i.test(rawTitle) ||
      /^higher\s*studies$/i.test(rawTitle)
    ) {
      return 'Higher Studies';
    }
    return rawTitle;
  }

  let specificType = rawTitle;
  if (childName && rawTitle.toLowerCase().startsWith(`${childName.toLowerCase()}'s`)) {
    specificType = rawTitle.slice(`${childName.toLowerCase()}'s`.length).trim();
  } else {
    specificType = rawTitle
      .replace(/^child\s*\d+('s)?\s*[-–:]?\s*/i, '')
      .replace(/^child\s*[-–:]?\s*/i, '')
      .replace(/\s*goal$/i, '')
      .trim();
  }

  // Standardize Graduation / Education variants to "Higher Studies"
  if (
    /^graduation(\s*fund)?$/i.test(specificType) ||
    /^higher\s*education$/i.test(specificType) ||
    /^education$/i.test(specificType) ||
    /^child\s*education$/i.test(specificType) ||
    /^higher\s*studies$/i.test(specificType)
  ) {
    specificType = 'Higher Studies';
  } else if (
    /^marriage(\s*fund)?$/i.test(specificType) ||
    /^wedding$/i.test(specificType) ||
    /^child\s*marriage$/i.test(specificType)
  ) {
    specificType = 'Marriage';
  }

  if (childName && (specificType.toLowerCase() === childName.toLowerCase() || specificType.toLowerCase().includes(childName.toLowerCase()))) {
    specificType = 'Other Goal';
  } else if (!specificType || specificType.toLowerCase() === 'other') {
    specificType = 'Other Goal';
  }

  if (childName) {
    if (specificType === 'Other Goal') {
      return `${childName}'s Other Goal`;
    }
    return `${childName}'s ${specificType}`;
  }

  return specificType === 'Other Goal' ? (rawTitle.toLowerCase().includes('other') ? 'Other Goal' : rawTitle) : specificType;
};

/**
 * Removes salutations such as Mr., Ms., Mrs., Miss, Dr., Prof., Shri, Smt, Master from a name string.
 * @param {string} name 
 * @returns {string}
 */
export const stripSalutation = (name = '') => {
  if (!name || typeof name !== 'string') return '';
  const cleaned = name.replace(/^(mrs|miss|master|prof|shri|smt|mr|ms|dr)\.?\s*/i, '').trim();
  return cleaned || name;
};



