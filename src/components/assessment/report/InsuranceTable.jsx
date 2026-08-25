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

export function InsuranceTable({ calculationResult }) {
  if (!calculationResult || !calculationResult.insurance || calculationResult.insurance.items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-[#2459D2] uppercase tracking-wider flex items-center gap-2">
        <span className="w-1.5 h-4 bg-[#2459D2] rounded-full inline-block"></span>
        Risk Protection & Insurance Needs
      </h3>
      <div className="overflow-x-auto border border-[#77B1EC]/30 rounded-2xl p-1 bg-white/50 backdrop-blur-md">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#77B1EC]/30 text-[#0E2C7E] font-bold">
              <th className="px-4 py-3.5">Insurance Need Type</th>
              <th className="px-4 py-3.5 text-center">Duration</th>
              <th className="px-4 py-3.5 text-right">Required Cover</th>
              <th className="px-4 py-3.5 text-center min-w-[130px]" style={{ minWidth: '130px' }}>Protection Type</th>
              <th className="px-4 py-3.5 text-right">Present Value (PV)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#77B1EC]/20 text-[#0E2C7E]">
            {calculationResult.insurance.items.map((ins, idx) => (
              <tr key={idx} className="bg-white/60 hover:bg-white/90 transition-colors">
                <td className="px-4 py-3 font-semibold">{ins.need}</td>
                <td className="px-4 py-3 text-center text-slate-600 whitespace-nowrap">{ins.years} Years</td>
                <td className="px-4 py-3 text-right font-medium whitespace-nowrap">{formatInrFullString(ins.amount)}</td>
                <td className="px-4 py-3 text-center whitespace-nowrap min-w-[130px]" style={{ minWidth: '130px' }}>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#77B1EC]/20 text-[#2459D2] border border-[#77B1EC]/40 font-sans inline-flex items-center justify-center"
                    style={{ whiteSpace: 'nowrap', display: 'inline-flex' }}
                  >
                    {ins.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-bold whitespace-nowrap">{formatInrFullString(ins.pv)}</td>
              </tr>
            ))}
            <tr className="bg-white/80 font-bold border-t border-[#77B1EC]/30">
              <td colSpan="4" className="px-4 py-3.5 text-right text-[#0E2C7E]">Total Life Coverage Recommended</td>
              <td className="px-4 py-3.5 text-right text-sm text-[#0E2C7E]">{formatInrFullString(calculationResult.insurance.total_required)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
