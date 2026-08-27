import React, { createContext, useState, useEffect } from "react";
import * as assessmentService from "../api/assessmentService";
import * as reportService from "../api/reportService";
import { buildCalcPayload } from "../utils/formatters";

export const AssessmentContext = createContext(null);

const initialFormData = {
  mobile: "",
  email: "",
  spouseMobile: "",
  spouseEmail: "",
  address: "",
  consent: false,
  name: "",
  occupation: "",
  designation: "",
  companyName: "",
  dob: "",
  monthlyExpense: "",
  spouseName: "",
  spouseOccupation: "",
  spouseDesignation: "",
  spouseCompanyName: "",
  spouseDob: "",
  targetRetireAge: "",
  yearsUntilRetirement: "",
  requiredAnnualIncome: "",
  epfEmployerShare: "",
  epfEmployeeShare: "",
  epfTotalCorpus: "",
  npsEmployerShare: "",
  npsEmployeeShare: "",
  npsTotalCorpus: "",
  superEmployerShare: "",
  superTotalCorpus: "",
};

const initialChildren = [
  { name: "", occupation: "", dependent: "Yes", dob: "", age: "", goalType: "", targetYear: "", todaysCost: "", goals: [{ id: "g-init-1", goalType: "", targetYear: "", todaysCost: "" }] },
  { name: "", occupation: "", dependent: "Yes", dob: "", age: "", goalType: "", targetYear: "", todaysCost: "", goals: [{ id: "g-init-2", goalType: "", targetYear: "", todaysCost: "" }] },
  { name: "", occupation: "", dependent: "Yes", dob: "", age: "", goalType: "", targetYear: "", todaysCost: "", goals: [{ id: "g-init-3", goalType: "", targetYear: "", todaysCost: "" }] },
  { name: "", occupation: "", dependent: "Yes", dob: "", age: "", goalType: "", targetYear: "", todaysCost: "", goals: [{ id: "g-init-4", goalType: "", targetYear: "", todaysCost: "" }] },
];

const initialGoals = [];

// --- sessionStorage helpers ---
const SS_KEY = "ww_assessment_state";

function loadFromSession() {
  try {
    const raw = sessionStorage.getItem(SS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveToSession(patch) {
  try {
    const existing = loadFromSession() || {};
    sessionStorage.setItem(SS_KEY, JSON.stringify({ ...existing, ...patch }));
  } catch { /* ignore quota errors */ }
}
// --------------------------------

export default function AssessmentProvider({ children }) {
  const [step, setStepState] = useState(() => {
    const urlStep = parseInt(new URLSearchParams(window.location.search).get("step")) || 1;
    return urlStep >= 1 && urlStep <= 5 ? urlStep : 1;
  });

  // Use pushState so each step creates a browser history entry,
  // meaning the browser back button navigates between steps.
  // sessionStorage persistence (below) ensures formData survives any remount.
  const setStep = (n) => {
    setStepState(n);
    const url = new URL(window.location);
    url.searchParams.set("step", n);
    window.history.pushState({ step: n }, "", url);
  };

  // Restore all persisted state from sessionStorage on mount
  const _session = loadFromSession();

  const [assessmentId, setAssessmentId] = useState(() => _session?.assessmentId || localStorage.getItem("ww_assessment_id") || null);
  const [formData, setFormData] = useState(() => _session?.formData ? { ...initialFormData, ..._session.formData } : initialFormData);
  const [childrenCount, setChildrenCountState] = useState(() => _session?.childrenCount ?? 2);
  const [childrenData, setChildrenData] = useState(() => _session?.childrenData || initialChildren);
  const [activeGoals, setActiveGoals] = useState(() => _session?.activeGoals || initialGoals);
  const [calculationResult, setCalculationResult] = useState(() => _session?.calculationResult || null);
  const [services, setServices] = useState(() => _session?.services || []);
  const [testimonials, setTestimonials] = useState(() => _session?.testimonials || []);
  const [reportData, setReportData] = useState(() => _session?.reportData || null);
  const [reportId, setReportId] = useState(() => _session?.reportId || null);
  const [reportMessage, setReportMessage] = useState(() => _session?.reportMessage || null);
  const [showReport, setShowReport] = useState(() => _session?.showReport || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);

  // Persist critical state to sessionStorage whenever it changes
  useEffect(() => { saveToSession({ assessmentId }); }, [assessmentId]);
  useEffect(() => { saveToSession({ formData }); }, [formData]);
  useEffect(() => { saveToSession({ childrenCount }); }, [childrenCount]);
  useEffect(() => { 
    saveToSession({ childrenData }); 
    if (typeof window !== 'undefined') {
      window.__WW_CHILDREN_DATA__ = childrenData;
    }
  }, [childrenData]);
  useEffect(() => { saveToSession({ activeGoals }); }, [activeGoals]);
  useEffect(() => { saveToSession({ calculationResult }); }, [calculationResult]);
  useEffect(() => { saveToSession({ services }); }, [services]);
  useEffect(() => { saveToSession({ testimonials }); }, [testimonials]);
  useEffect(() => { saveToSession({ reportData }); }, [reportData]);
  useEffect(() => { saveToSession({ reportId }); }, [reportId]);
  useEffect(() => { saveToSession({ reportMessage }); }, [reportMessage]);
  useEffect(() => { saveToSession({ showReport }); }, [showReport]);

  // Block browser back/forward — we manage navigation via replaceState
  useEffect(() => {
    const handlePopState = (e) => {
      // Prevent browser from going to a different route;
      // just re-sync step from URL if it's still on /assessment
      const urlStep = parseInt(new URLSearchParams(window.location.search).get("step")) || 1;
      const validStep = urlStep >= 1 && urlStep <= 5 ? urlStep : 1;
      setStepState(validStep);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);



  const updateFormData = (fields) => {
    setFormData((prev) => {
      const updated = { ...prev, ...fields };

      // Auto calculate years until retirement when targetRetireAge changes
      if (fields.hasOwnProperty("targetRetireAge")) {
        const retireAgeVal = parseInt(fields.targetRetireAge, 10);
        if (updated.dob) {
          const parts = updated.dob.split("/");
          if (parts.length === 3) {
            const birthYear = parseInt(parts[2], 10);
            const currentYear = new Date().getFullYear();
            const currentAge = currentYear - birthYear;
            if (!isNaN(retireAgeVal) && !isNaN(currentAge)) {
              updated.yearsUntilRetirement = String(Math.max(0, retireAgeVal - currentAge));
            }
          }
        }
      }
      return updated;
    });
  };

  const updateChild = (index, fields) => {
    setChildrenData((prev) => {
      const updated = [...prev];
      if (!updated[index]) {
        updated[index] = { name: "", occupation: "", dependent: "Yes", dob: "", age: "", goalType: "", targetYear: "", todaysCost: "", goals: [{ id: Date.now() + Math.random(), goalType: "", targetYear: "", todaysCost: "" }] };
      }
      
      const child = { ...updated[index] };

      if (fields.hasOwnProperty("goals") && Array.isArray(fields.goals)) {
        child.goals = fields.goals;
        if (fields.goals.length > 0) {
          const firstGoal = fields.goals[0];
          child.goalType = firstGoal.goalType || "";
          child.targetYear = firstGoal.targetYear || "";
          child.todaysCost = firstGoal.todaysCost || "";
        }
      } else if (fields.hasOwnProperty("goalType") || fields.hasOwnProperty("targetYear") || fields.hasOwnProperty("todaysCost")) {
        const goalsList = child.goals && Array.isArray(child.goals) ? [...child.goals] : [];
        if (goalsList.length === 0) {
          goalsList.push({ id: Date.now() + Math.random(), goalType: "", targetYear: "", todaysCost: "" });
        }
        goalsList[0] = {
          ...goalsList[0],
          ...(fields.hasOwnProperty("goalType") ? { goalType: fields.goalType } : {}),
          ...(fields.hasOwnProperty("targetYear") ? { targetYear: fields.targetYear } : {}),
          ...(fields.hasOwnProperty("todaysCost") ? { todaysCost: fields.todaysCost } : {}),
        };
        child.goals = goalsList;
        if (fields.hasOwnProperty("goalType")) child.goalType = fields.goalType;
        if (fields.hasOwnProperty("targetYear")) child.targetYear = fields.targetYear;
        if (fields.hasOwnProperty("todaysCost")) child.todaysCost = fields.todaysCost;
      }

      Object.keys(fields).forEach((key) => {
        if (key !== "goals" && key !== "goalType" && key !== "targetYear" && key !== "todaysCost") {
          child[key] = fields[key];
        }
      });

      if (fields.hasOwnProperty("dob") && fields.dob) {
        const parts = fields.dob.split("/");
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const year = parseInt(parts[2], 10);
          const currentYear = new Date().getFullYear();
          if (!isNaN(day) && !isNaN(month) && !isNaN(year) && year > 1900 && year <= currentYear) {
            const birthDate = new Date(year, month, day);
            const today = new Date();
            let ageVal = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
              ageVal--;
            }
            child.age = ageVal >= 0 ? `${ageVal} Years` : "0 Years";
          } else {
            child.age = "";
          }
        } else {
          child.age = "";
        }
      }
      updated[index] = child;
      return updated;
    });
  };

  const setChildrenCount = (n) => {
    setChildrenCountState(n);
  };

  const addGoal = (type, customData = {}) => {
    const newGoal = {
      id: Date.now() + Math.random(),
      type,
      targetYear: customData.targetYear || "",
      todaysCost: customData.todaysCost || "",
      goalName: customData.goalName || "",
      ...customData,
    };
    setActiveGoals((prev) => [...prev, newGoal]);
  };

  const removeGoal = (id) => {
    setActiveGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const updateGoal = (id, fields) => {
    setActiveGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...fields } : g))
    );
  };

  const goToStep = (n) => {
    setStep(n);
    if (n < 5) {
      setShowReport(false);
      setReportId(null);
      setReportMessage(null);
    }
  };

  const nextStep = () => {
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitStep1 = async () => {
    setApiError(null);
    setIsSubmitting(true);
    try {
      let currentId = assessmentId;
      if (!currentId) {
        // Clear any stale session from a previous assessment run
        try { sessionStorage.removeItem(SS_KEY); } catch { /* noop */ }
        await assessmentService.getRates();
        const createRes = await assessmentService.createAssessment();
        currentId = createRes.data.assessment_id;
        setAssessmentId(currentId);
        localStorage.setItem("ww_assessment_id", currentId);
      }
      const payload = {
        mobile: formData.mobile,
        email: formData.email,
        consent: formData.consent,
      };
      if (formData.spouseMobile && formData.spouseMobile.trim()) {
        payload.spouse_mobile = formData.spouseMobile;
      }
      if (formData.spouseEmail && formData.spouseEmail.trim()) {
        payload.spouse_email = formData.spouseEmail;
      }
      if (formData.address && formData.address.trim()) {
        payload.residential_address = formData.address;
      }
      await assessmentService.submitFlow1(currentId, payload);
      nextStep();
    } catch (err) {
      console.error(err);
      setApiError(err.message || "Failed to save step 1 details. Please review your settings.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitStep2 = async () => {
    setApiError(null);
    setIsSubmitting(true);
    try {
      const payload = {
        client_name: formData.name,
        client_occupation: formData.occupation,
        client_designation: formData.designation,
        client_company: formData.companyName,
        client_dob: formData.dob,
        client_retirement_age: formData.targetRetireAge ? (parseInt(formData.targetRetireAge, 10) || 0) : 0,
        spouse_retirement_age: 0,
      };
      if (formData.spouseName && formData.spouseName.trim()) {
        payload.spouse_name = formData.spouseName;
      }
      if (formData.spouseOccupation && formData.spouseOccupation.trim()) {
        payload.spouse_occupation = formData.spouseOccupation;
      }
      if (formData.spouseDesignation && formData.spouseDesignation.trim()) {
        payload.spouse_designation = formData.spouseDesignation;
      }
      if (formData.spouseCompanyName && formData.spouseCompanyName.trim()) {
        payload.spouse_company = formData.spouseCompanyName;
      }
      if (formData.spouseDob && formData.spouseDob.trim()) {
        payload.spouse_dob = formData.spouseDob;
      }
      await assessmentService.submitFlow2(assessmentId, payload);
      console.log("%c ✅ [STEP 2 DONE] monthlyExpense in formData =", "background:#1a1a1a;color:#ED8B36;font-size:14px;font-weight:bold;padding:4px 8px;border-radius:4px;", formData.monthlyExpense, "| Full formData snapshot:", JSON.parse(JSON.stringify(formData)));
      nextStep();
    } catch (err) {
      console.error(err);
      setApiError(err.message || "Failed to save step 2 details. Please review your settings.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitStep3 = async () => {
    setApiError(null);
    setIsSubmitting(true);
    try {
      const activeChildren = childrenData.slice(0, childrenCount).map((c, idx) => {
        const childObj = {
          child_number: idx + 1,
          child_name: c.name,
          financially_dependent: c.dependent === "Yes",
        };
        if (c.occupation && c.occupation.trim()) {
          childObj.occupation = c.occupation;
        }
        if (c.dob && c.dob.trim()) {
          childObj.date_of_birth = c.dob;
        }
        return childObj;
      });
      const res = await assessmentService.submitFlow3(assessmentId, {
        number_of_children: childrenCount,
        children: activeChildren,
      });

      if (res && res.data && res.data.children) {
        setChildrenData((prev) => {
          const updated = [...prev];
          res.data.children.forEach((savedChild) => {
            const idx = savedChild.child_number - 1;
            if (updated[idx]) {
              updated[idx].id = savedChild.id;
            }
          });
          return updated;
        });
      }

      nextStep();
    } catch (err) {
      console.error(err);
      setApiError(err.message || "Failed to save step 3 details. Please review your settings.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const submitStep4 = async () => {
    setApiError(null);
    setIsSubmitting(true);
    try {
      const apiGoals = [];

      // Child education & milestone goals
      childrenData.slice(0, childrenCount).forEach((c, idx) => {
        if (!c) return;
        
        const goalsToSubmit = c.goals && Array.isArray(c.goals) && c.goals.length > 0 ? c.goals : [
          { goalType: c.goalType, targetYear: c.targetYear, todaysCost: c.todaysCost }
        ];

        goalsToSubmit.forEach((g, gIdx) => {
          if (g.goalType && g.targetYear && g.todaysCost) {
            const mappedType =
              (g.goalType === "Higher Education" || g.goalType === "Higher Studies" || g.goalType === "Graduation")
                ? "Graduation"
                : g.goalType === "Marriage"
                ? "Marriage"
                : "Other";
            
            const childRealName = (c.name || '').trim() || `Child ${idx + 1}`;

            const goalObj = {
              category: "child_goal",
              goal_type: mappedType,
              target_year: parseInt(g.targetYear),
              today_cost: parseFloat(g.todaysCost),
              inflation_rate: 0.06,
            };
            if (c.id) {
              goalObj.child_id = c.id;
            }
            const customChildGoalName = (g.goalName || g.name || g.goal_name || "").toString().trim();
            if (customChildGoalName) {
              goalObj.goal_name = customChildGoalName;
            } else if (g.goalType === "Others" || g.goalType === "Other") {
              goalObj.goal_name = `${childRealName}'s Other Goal`;
            } else {
              const displayType = mappedType === "Graduation" ? "Higher Studies" : (g.goalType || mappedType);
              goalObj.goal_name = `${childRealName}'s ${displayType}`;
            }
            apiGoals.push(goalObj);
          }
        });
      });

      // Lifestyle goals
      activeGoals.forEach((g) => {
        if (g.type && g.targetYear && g.todaysCost) {
          let mappedType = g.type;
          if (mappedType === "Estate for Children") {
            mappedType = "Estate For Children";
          } else if (mappedType === "Others" || mappedType === "Other") {
            mappedType = "Other";
          }
          const goalObj = {
            category: "lifestyle",
            goal_type: mappedType,
            target_year: parseInt(g.targetYear),
            today_cost: parseFloat(g.todaysCost),
            inflation_rate: 0.06,
          };
          const customName = (g.goalName || g.name || g.goal_name || "").toString().trim();
          if (customName) {
            goalObj.goal_name = customName;
          } else if (mappedType === "Other") {
            goalObj.goal_name = "Custom Goal";
          }
          apiGoals.push(goalObj);
        }
      });

      // Submit goals (even if empty, as requested)
      await assessmentService.submitFlow4(assessmentId, {
        goals: apiGoals,
      });
      nextStep();
    } catch (err) {
      console.error(err);
      setApiError(err.message || "Failed to save step 4 details. Please review your settings.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitStep5 = async () => {
    setApiError(null);
    setIsCalculating(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    let finalFormData = { ...formData };

    try {
      // 1. Submit Flow 2 again with final retirement age
      const flow2Payload = {
        client_name: finalFormData.name,
        client_occupation: finalFormData.occupation,
        client_designation: finalFormData.designation,
        client_company: finalFormData.companyName,
        client_dob: finalFormData.dob,
        client_retirement_age: finalFormData.targetRetireAge ? (parseInt(finalFormData.targetRetireAge, 10) || 0) : 0,
        spouse_retirement_age: 0,
      };
      if (finalFormData.spouseName && finalFormData.spouseName.trim()) {
        flow2Payload.spouse_name = finalFormData.spouseName;
      }
      if (finalFormData.spouseOccupation && finalFormData.spouseOccupation.trim()) {
        flow2Payload.spouse_occupation = finalFormData.spouseOccupation;
      }
      if (finalFormData.spouseDesignation && finalFormData.spouseDesignation.trim()) {
        flow2Payload.spouse_designation = finalFormData.spouseDesignation;
      }
      if (finalFormData.spouseCompanyName && finalFormData.spouseCompanyName.trim()) {
        flow2Payload.spouse_company = finalFormData.spouseCompanyName;
      }
      if (finalFormData.spouseDob && finalFormData.spouseDob.trim()) {
        flow2Payload.spouse_dob = finalFormData.spouseDob;
      }
      await assessmentService.submitFlow2(assessmentId, flow2Payload);

      // 1b. Submit Flow 5 raw user entries (strictly user-entered values, no frontend defaults)
      const flow5Payload = {};
      const addFlow5 = (key, rawVal, isNum = false) => {
        if (rawVal !== undefined && rawVal !== null && rawVal.toString().trim() !== "") {
          if (isNum) {
            const parsed = parseFloat(rawVal);
            if (!isNaN(parsed)) flow5Payload[key] = parsed;
          } else {
            flow5Payload[key] = rawVal;
          }
        }
      };

      addFlow5("monthlyExpense", finalFormData.monthlyExpense);
      addFlow5("monthly_expense", finalFormData.monthlyExpense);
      addFlow5("requiredAnnualIncome", finalFormData.requiredAnnualIncome);
      addFlow5("required_annual_income", finalFormData.requiredAnnualIncome);

      // EPF
      addFlow5("epfCorpus", finalFormData.epfTotalCorpus);
      addFlow5("epf_total_corpus", finalFormData.epfTotalCorpus);
      addFlow5("epfTotalCorpus", finalFormData.epfTotalCorpus);
      addFlow5("epf_corpus", finalFormData.epfTotalCorpus);
      addFlow5("epfEmployer", finalFormData.epfEmployerShare);
      addFlow5("epf_employer_share", finalFormData.epfEmployerShare);
      addFlow5("epfEmployerShare", finalFormData.epfEmployerShare);
      addFlow5("epf_employer", finalFormData.epfEmployerShare);
      addFlow5("epfEmployee", finalFormData.epfEmployeeShare);
      addFlow5("epf_employee_share", finalFormData.epfEmployeeShare);
      addFlow5("epfEmployeeShare", finalFormData.epfEmployeeShare);
      addFlow5("epf_employee", finalFormData.epfEmployeeShare);

      // NPS (OpenAPI params + aliases)
      addFlow5("employer_nps_pm", finalFormData.npsEmployerShare, true);
      addFlow5("self_nps_pm", finalFormData.npsEmployeeShare, true);
      addFlow5("current_nps_accum", finalFormData.npsTotalCorpus, true);
      addFlow5("npsCorpus", finalFormData.npsTotalCorpus);
      addFlow5("nps_total_corpus", finalFormData.npsTotalCorpus);
      addFlow5("npsTotalCorpus", finalFormData.npsTotalCorpus);
      addFlow5("nps_corpus", finalFormData.npsTotalCorpus);
      addFlow5("npsEmployer", finalFormData.npsEmployerShare);
      addFlow5("nps_employer_share", finalFormData.npsEmployerShare);
      addFlow5("npsEmployerShare", finalFormData.npsEmployerShare);
      addFlow5("nps_employer", finalFormData.npsEmployerShare);
      addFlow5("npsEmployee", finalFormData.npsEmployeeShare);
      addFlow5("nps_employee_share", finalFormData.npsEmployeeShare);
      addFlow5("npsEmployeeShare", finalFormData.npsEmployeeShare);
      addFlow5("nps_employee", finalFormData.npsEmployeeShare);

      // Superannuation / SA (OpenAPI params + aliases)
      addFlow5("sa_pm", finalFormData.superEmployerShare, true);
      addFlow5("current_sa_accum", finalFormData.superTotalCorpus, true);
      addFlow5("superCorpus", finalFormData.superTotalCorpus);
      addFlow5("super_total_corpus", finalFormData.superTotalCorpus);
      addFlow5("superTotalCorpus", finalFormData.superTotalCorpus);
      addFlow5("super_corpus", finalFormData.superTotalCorpus);
      addFlow5("saCorpus", finalFormData.superTotalCorpus);
      addFlow5("sa_total_corpus", finalFormData.superTotalCorpus);
      addFlow5("saTotalCorpus", finalFormData.superTotalCorpus);
      addFlow5("sa_corpus", finalFormData.superTotalCorpus);
      addFlow5("superEmployer", finalFormData.superEmployerShare);
      addFlow5("super_employer_share", finalFormData.superEmployerShare);
      addFlow5("superEmployerShare", finalFormData.superEmployerShare);
      addFlow5("super_employer", finalFormData.superEmployerShare);
      addFlow5("saEmployer", finalFormData.superEmployerShare);
      addFlow5("sa_employer_share", finalFormData.superEmployerShare);
      addFlow5("sa_employer", finalFormData.superEmployerShare);

      addFlow5("targetRetireAge", finalFormData.targetRetireAge);
      addFlow5("target_retirement_age", finalFormData.targetRetireAge);
      addFlow5("yearsUntilRetirement", finalFormData.yearsUntilRetirement);
      addFlow5("years_until_retirement", finalFormData.yearsUntilRetirement);

      await assessmentService.submitFlow5(assessmentId, flow5Payload);

      // 2. Perform calculation payload building & API call
      const calcPayload = buildCalcPayload(finalFormData);
      console.log("%c 🧮 [STEP 5 CALC PAYLOAD]", "background:#1a1a1a;color:#4ade80;font-size:14px;font-weight:bold;padding:4px 8px;border-radius:4px;", {
        household_monthly: calcPayload.household_monthly,
        client_annual_ret_reqd: calcPayload.client_annual_ret_reqd,
        client_epf_annual: calcPayload.client_epf_annual,
        fullPayload: calcPayload,
        monthlyExpense_fromFormData: finalFormData.monthlyExpense,
        requiredAnnualIncome_fromFormData: finalFormData.requiredAnnualIncome,
      });
      const calcRes = await assessmentService.calculateRetirement(assessmentId, calcPayload);
      const initialCalcResult = calcRes?.data || calcRes;
      setCalculationResult(initialCalcResult);

      // 3. Fetch full report dataset (flow1..flow4, calculation, services, testimonials)
      setReportMessage("Preparing financial blueprint...");
      try {
        console.log("[submitStep5] Fetching report data for assessmentId:", assessmentId);
        const reportDataRes = await reportService.getReportData(assessmentId);
        console.log("[submitStep5] getReportData response:", reportDataRes);
        const payloadData = reportDataRes?.data || reportDataRes;

        if (payloadData) {
          setReportData(payloadData);
          if (payloadData.services && Array.isArray(payloadData.services)) {
            setServices(payloadData.services);
          }
          if (payloadData.testimonials && Array.isArray(payloadData.testimonials)) {
            setTestimonials(payloadData.testimonials);
          }
          if (payloadData.calculation) {
            const calcObj = {
              ...initialCalcResult,
              ...payloadData.calculation,
              insurance: payloadData.insurance || payloadData.calculation.insurance || initialCalcResult?.insurance,
              investment_summary: payloadData.investment_summary || payloadData.calculation.investment_summary || initialCalcResult?.investment_summary
            };
            setCalculationResult(calcObj);
          } else if (payloadData.investment_summary || payloadData.insurance) {
            setCalculationResult((prev) => prev ? {
              ...prev,
              insurance: payloadData.insurance || prev.insurance,
              investment_summary: payloadData.investment_summary || prev.investment_summary
            } : prev);
          }
        }
      } catch (reportDataErr) {
        console.warn("[submitStep5] Failed to fetch /report-data, falling back to calculation result:", reportDataErr);
      }

      setShowReport(true);
    } catch (err) {
      console.error(err);
      setApiError(err.message || "Failed to calculate retirement plan. Please review your settings.");
    } finally {
      setIsCalculating(false);
    }
  };

  const downloadReport = async () => {
    let currentReportId = reportId;

    if (!assessmentId) {
      throw new Error("Assessment session not found.");
    }

    if (!currentReportId) {
      console.log("[downloadReport] reportId not set, calling generateReport for assessmentId:", assessmentId);
      const res = await reportService.generateReport(assessmentId);
      const data = res?.data || res;
      currentReportId = data?.report_id || data?.data?.report_id;
      if (currentReportId) {
        setReportId(currentReportId);
      }
    }

    if (!currentReportId) {
      throw new Error("Your report is currently generating. Please try downloading again in a few seconds.");
    }

    const reportBlob = await reportService.downloadGeneratedReport(assessmentId, currentReportId);
    const download = reportService.createReportDownload(reportBlob, assessmentId);
    const link = document.createElement("a");
    link.href = download.url;
    link.download = download.fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(download.url), 60_000);
  };

  const contextValue = {
    step,
    assessmentId,
    formData,
    childrenCount,
    childrenData,
    activeGoals,
    calculationResult,
    services,
    testimonials,
    reportData,
    reportId,
    reportMessage,
    showReport,
    isSubmitting,
    isCalculating,
    apiError,
    pdfBlob,
    setPdfBlob,
    isUploaded,
    setIsUploaded,
    updateFormData,
    updateChild,
    setChildrenCount,
    addGoal,
    removeGoal,
    updateGoal,
    goToStep,
    nextStep,
    prevStep,
    setApiError,
    submitStep1,
    submitStep2,
    submitStep3,
    submitStep4,
    submitStep5,
    downloadReport,
  };

  return (
    <AssessmentContext.Provider value={contextValue}>
      {children}
    </AssessmentContext.Provider>
  );
}
