import React from 'react';

export function MetricCards({ displayInsurance, displayCorpus, displayMonthly }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Insurance Card */}
      <div className="glass-morphism-card rounded-3xl p-6 flex items-start gap-4 transition-all duration-300">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-[#2459D2] bg-white border border-slate-200/80 shadow-xs">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold text-[#64748B] tracking-wider uppercase block">AVERAGE INSURANCE REQUIRED</span>
          <span className="text-xl sm:text-2xl font-black text-[#0F172A] block">{displayInsurance}</span>
          <span className="text-[11px] text-[#475569] leading-relaxed block pt-1">Recommended life cover based on your current profile.</span>
        </div>
      </div>

      {/* Corpus Card */}
      <div className="glass-morphism-card rounded-3xl p-6 flex items-start gap-4 transition-all duration-300">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-[#2459D2] bg-white border border-slate-200/80 shadow-xs">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold text-[#64748B] tracking-wider uppercase block">TOTAL RETIREMENT CORPUS</span>
          <span className="text-xl sm:text-2xl font-black text-[#0F172A] block">{displayCorpus}</span>
          <span className="text-[11px] text-[#475569] leading-relaxed block pt-1">Estimated total corpus needed to achieve all your goals.</span>
        </div>
      </div>

      {/* Monthly Investment Card */}
      <div className="glass-morphism-card rounded-3xl p-6 flex items-start gap-4 transition-all duration-300">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-[#2459D2] bg-white border border-slate-200/80 shadow-xs">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold text-[#64748B] tracking-wider uppercase block">MONTHLY INVESTMENT REQUIRED TO ACHIEVE ALL THE GOALS</span>
          <span className="text-xl sm:text-2xl font-black text-[#0F172A] block">{displayMonthly}</span>
          <span className="text-[11px] text-[#475569] leading-relaxed block pt-1">Suggested monthly investment to achieve all the goals.</span>
        </div>
      </div>

    </div>
  );
}
