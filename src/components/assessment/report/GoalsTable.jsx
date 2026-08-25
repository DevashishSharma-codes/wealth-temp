import React from 'react';

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

export function GoalsTable({ calculationResult }) {
  if (!calculationResult) return null;

  const rawGoalItems = calculationResult.goals?.items || calculationResult.data?.goals?.items || [];
  const clientRet = calculationResult.client || calculationResult.data?.client;
  const spouseRet = calculationResult.spouse || calculationResult.data?.spouse;

  const items = [];

  // 1. Add Client Retirement if selected / calculated
  const clientSipVal = clientRet?.monthly_sip?.raw || (clientRet?.monthly_sip ? parseFloat(String(clientRet.monthly_sip).replace(/[^0-9.]/g, '')) : 0);
  const clientCorpusVal = clientRet?.corpus?.raw || (clientRet?.corpus ? parseFloat(String(clientRet.corpus).replace(/[^0-9.]/g, '')) : 0);

  if (clientRet && (clientSipVal > 0 || clientCorpusVal > 0)) {
    const currentYear = new Date().getFullYear();
    const targetYear = clientRet.years_to_retirement ? currentYear + clientRet.years_to_retirement : (clientRet.target_year || clientRet.target_retirement_year || 'Retirement');
    items.push({
      goal: 'Retirement Planning (Client)',
      target_year: targetYear,
      current_cost: formatInrFullString(clientRet.expenses_today_pm) + ' p.m.',
      future_cost: formatInrFullString(clientRet.corpus),
      monthly_sip: formatInrFullString(clientRet.monthly_sip),
    });
  }

  // 2. Add Spouse Retirement (if active)
  const spouseSipVal = spouseRet?.monthly_sip?.raw || (spouseRet?.monthly_sip ? parseFloat(String(spouseRet.monthly_sip).replace(/[^0-9.]/g, '')) : 0);
  const spouseCorpusVal = spouseRet?.corpus?.raw || (spouseRet?.corpus ? parseFloat(String(spouseRet.corpus).replace(/[^0-9.]/g, '')) : 0);

  if (spouseRet && (spouseSipVal > 0 || spouseCorpusVal > 0)) {
    const currentYear = new Date().getFullYear();
    const targetYear = spouseRet.years_to_retirement ? currentYear + spouseRet.years_to_retirement : (spouseRet.target_year || spouseRet.target_retirement_year || 'Retirement');
    items.push({
      goal: 'Retirement Planning (Spouse)',
      target_year: targetYear,
      current_cost: formatInrFullString(spouseRet.expenses_today_pm) + ' p.m.',
      future_cost: formatInrFullString(spouseRet.corpus),
      monthly_sip: formatInrFullString(spouseRet.monthly_sip),
    });
  }

  // 3. Add all other goals (Education, Foreign Tour, etc.)
  rawGoalItems.forEach((g) => {
    const rawG = String(g.goal || g.goal_type || g.title || '').toLowerCase();
    const isTour = rawG.includes('tour') || rawG.includes('foreign') || rawG.includes('vacation') || rawG.includes('trip');
    let costDisplay = formatInrFullString(g.current_cost || g.today_cost || g.todaysCost);
    if (isTour) {
      const perPersonAmt = Number(g.cost_per_person || g.costPerPerson || 0);
      const travellersCount = Number(g.travellers || g.people || 0);
      const totalRaw = Number(g.current_cost || g.today_cost || g.todaysCost || 0);

      if (totalRaw > 0 && perPersonAmt > 0 && totalRaw === perPersonAmt && travellersCount > 1) {
        costDisplay = formatInrFullString(perPersonAmt * travellersCount);
      } else if (totalRaw > 0) {
        costDisplay = formatInrFullString(totalRaw);
      } else if (perPersonAmt > 0 && travellersCount > 1) {
        costDisplay = formatInrFullString(perPersonAmt * travellersCount);
      }
    }
    items.push({
      ...g,
      current_cost_display: costDisplay,
      future_cost_display: formatInrFullString(g.future_cost),
      monthly_sip_display: formatInrFullString(g.monthly_sip),
    });
  });

  if (items.length === 0) return null;

  // Total monthly SIP display
  const invSummary = calculationResult?.investment_summary || 
                     calculationResult?.data?.investment_summary;
  const totalSipDisplay = formatInrFullString(
    invSummary?.total_monthly_investment ||
    calculationResult.summary?.monthly_investment_required ||
    calculationResult.goals?.total_monthly_sip
  );

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-[#2459D2] uppercase tracking-wider flex items-center gap-2">
        <span className="w-1.5 h-4 bg-[#2459D2] rounded-full inline-block"></span>
        Goal Achievement SIP Plan (Including Retirement)
      </h3>
      <div className="overflow-x-auto border border-[#77B1EC]/30 rounded-2xl p-1 bg-white/50 backdrop-blur-md">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#77B1EC]/30 text-[#0E2C7E] font-bold">
              <th className="px-4 py-3.5">Goal Description</th>
              <th className="px-4 py-3.5 text-center">Target Year</th>
              <th className="px-4 py-3.5 text-right">Cost (Today)</th>
              <th className="px-4 py-3.5 text-right">Future Cost (Inflated)</th>
              <th className="px-4 py-3.5 text-right text-[#2459D2]">Monthly SIP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#77B1EC]/20 text-[#0E2C7E]">
            {items.map((g, idx) => {
              const costDisplay = g.current_cost_display || g.current_cost || '₹0';
              const futureDisplay = g.future_cost_display || g.future_cost || '₹0';
              const sipDisplay = g.monthly_sip_display || g.monthly_sip || '₹0';
              return (
                <tr key={idx} className="bg-white/60 hover:bg-white/90 transition-colors">
                  <td className="px-4 py-3 font-semibold">{g.goal}</td>
                  <td className="px-4 py-3 text-center text-slate-600 whitespace-nowrap">{g.target_year}</td>
                  <td className="px-4 py-3 text-right font-medium whitespace-nowrap">
                    {costDisplay}
                  </td>
                  <td className="px-4 py-3 text-right font-medium whitespace-nowrap">{futureDisplay}</td>
                  <td className="px-4 py-3 text-right font-bold text-[#2459D2] whitespace-nowrap">{sipDisplay}</td>
                </tr>
              );
            })}
            <tr className="bg-white/80 font-bold border-t border-[#77B1EC]/30">
              <td colSpan="4" className="px-4 py-3.5 text-right text-[#0E2C7E]">Total Monthly SIP Required (All Goals)</td>
              <td className="px-4 py-3.5 text-right text-[#2459D2] text-sm">{totalSipDisplay}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
