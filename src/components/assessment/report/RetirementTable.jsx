import React from 'react';
import { stripSalutation } from '../../../utils/formatters';

const formatInrFullString = (val, defaultVal = '₹0') => {
  if (val === null || val === undefined) return defaultVal;
  if (typeof val === 'number') return `₹${Math.round(val).toLocaleString('en-IN')}`;
  if (typeof val === 'object') {
    if (val.raw !== undefined && typeof val.raw === 'number') {
      return `₹${Math.round(val.raw).toLocaleString('en-IN')}`;
    }
    if (val.inr && typeof val.inr === 'string') return formatInrFullString(val.inr, defaultVal);
    if (val.formatted && typeof val.formatted === 'string') return formatInrFullString(val.formatted, defaultVal);
    if (val.display && typeof val.display === 'string') return formatInrFullString(val.display, defaultVal);
    if (val.value !== undefined) return formatInrFullString(val.value, defaultVal);
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

export function RetirementTable({ formData, calculationResult }) {
  if (!calculationResult) return null;

  const clientRet = calculationResult.client || calculationResult.data?.client;
  const spouseRet = calculationResult.spouse || calculationResult.data?.spouse;

  if (!clientRet) return null;

  const clientTargetAge = formData.targetRetireAge || clientRet.retirement_age || clientRet.target_retirement_age;
  const spouseTargetAge = formData.spouseTargetRetireAge || spouseRet?.retirement_age || spouseRet?.target_retirement_age;

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-bold text-[#2459D2] uppercase tracking-wider flex items-center gap-2">
        <span className="w-1.5 h-4 bg-[#2459D2] rounded-full inline-block"></span>
        Retirement Income & Corpus Planning
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Client card */}
        <div className="glass-morphism-card rounded-2xl p-5 space-y-4">
          <div className="font-heading text-base font-bold text-[#0E2C7E] border-b border-[#77B1EC]/30 pb-2">
            Client ({stripSalutation(formData?.name) || 'Primary Client'})
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[#64748B] block">Target Retirement Age</span>
              <span className="font-bold text-[#0E2C7E]">{clientTargetAge ? `${clientTargetAge} Years` : '—'}</span>
            </div>
            <div>
              <span className="text-[#64748B] block">Years to Retirement</span>
              <span className="font-bold text-[#0E2C7E]">{clientRet.years_to_retirement ? `${clientRet.years_to_retirement} Years` : '—'}</span>
            </div>
            <div>
              <span className="text-[#64748B] block">Monthly Expense P.M. (Today)</span>
              <span className="font-bold text-[#0E2C7E]">{formatInrFullString(clientRet.expenses_today_pm)}</span>
            </div>
            <div>
              <span className="text-[#64748B] block">Inflation-Adjusted Expense (P.M.)</span>
              <span className="font-bold text-[#0E2C7E]">{formatInrFullString(clientRet.expenses_at_retirement_pm)}</span>
            </div>
            <div className="col-span-2 border-t border-[#77B1EC]/30 pt-3">
              <span className="text-[#64748B] block">Total Required Corpus</span>
              <span className="font-extrabold text-base text-[#0E2C7E]">{formatInrFullString(clientRet.corpus)}</span>
            </div>
            <div>
              <span className="text-[#64748B] block">Projected PF Corpus</span>
              <span className="font-bold text-slate-700">{formatInrFullString(clientRet.pf_corpus)}</span>
            </div>
            <div>
              <span className="text-[#64748B] block">Corpus Deficit Gap</span>
              <span className="font-bold text-[#2459D2]">{formatInrFullString(clientRet.net_corpus)}</span>
            </div>
            <div className="col-span-2 border-t border-[#77B1EC]/30 pt-3 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[#64748B] block">Monthly SIP Required</span>
                <span className="font-bold text-[#2459D2]">{formatInrFullString(clientRet.monthly_sip)} / mo</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Lump Sum Alternative</span>
                <span className="font-bold text-slate-800">{formatInrFullString(clientRet.lump_sum)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Spouse card */}
        {spouseRet && spouseRet.corpus?.raw > 0 ? (
          <div className="glass-morphism-card rounded-2xl p-5 space-y-4">
            <div className="font-heading text-base font-bold text-[#0E2C7E] border-b border-[#77B1EC]/30 pb-2">
              Spouse ({stripSalutation(formData?.spouseName) || 'Spouse'})
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#64748B] block">Target Retirement Age</span>
                <span className="font-bold text-[#0E2C7E]">{spouseTargetAge} Years</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Years to Retirement</span>
                <span className="font-bold text-[#0E2C7E]">{spouseRet.years_to_retirement || 0} Years</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Monthly Expense P.M. (Today)</span>
                <span className="font-bold text-[#0E2C7E]">{formatInrFullString(spouseRet.expenses_today_pm)}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Inflation-Adjusted Expense (P.M.)</span>
                <span className="font-bold text-[#0E2C7E]">{formatInrFullString(spouseRet.expenses_at_retirement_pm)}</span>
              </div>
              <div className="col-span-2 border-t border-[#77B1EC]/30 pt-3">
                <span className="text-[#64748B] block">Total Required Corpus</span>
                <span className="font-extrabold text-base text-[#0E2C7E]">{formatInrFullString(spouseRet.corpus)}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Projected PF Corpus</span>
                <span className="font-bold text-slate-700">{formatInrFullString(spouseRet.pf_corpus)}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Corpus Deficit Gap</span>
                <span className="font-bold text-[#2459D2]">{formatInrFullString(spouseRet.net_corpus)}</span>
              </div>
              <div className="col-span-2 border-t border-[#77B1EC]/30 pt-3 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[#64748B] block">Monthly SIP Required</span>
                  <span className="font-bold text-[#2459D2]">{formatInrFullString(spouseRet.monthly_sip)} / mo</span>
                </div>
                <div>
                  <span className="text-[#64748B] block">Lump Sum Alternative</span>
                  <span className="font-bold text-slate-800">{formatInrFullString(spouseRet.lump_sum)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-[#77B1EC]/30 bg-white/40 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2">
            <svg className="w-8 h-8 text-[#77B1EC]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <span className="text-xs font-bold text-[#0E2C7E] block">No Spouse Retirement Plan Included</span>
            <p className="text-[10px] text-[#64748B] leading-relaxed max-w-[200px]">
              Assessment runs calculations on client profile only.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
