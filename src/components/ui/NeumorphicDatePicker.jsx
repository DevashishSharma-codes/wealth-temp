import React, { useState, useRef, useEffect } from 'react';

export function NeumorphicDatePicker({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder = "DD/MM/YYYY", 
  required = false,
  error = null,
  onBlur
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showYearGrid, setShowYearGrid] = useState(false);
  const containerRef = useRef(null);
  
  // Parse date from "DD/MM/YYYY" format
  const parseDateStr = (dateStr) => {
    if (!dateStr) return new Date();
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const d = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const y = parseInt(parts[2], 10);
      if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
        return new Date(y, m, d);
      }
    }
    return new Date();
  };

  const initialDate = parseDateStr(value);
  const [viewDate, setViewDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState(value ? initialDate : null);

  useEffect(() => {
    if (value) {
      setSelectedDate(parseDateStr(value));
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  // Close calendar dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowYearGrid(false);
        if (onBlur) {
          onBlur({ target: { name } });
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [name, onBlur]);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const monthsList = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleYearChange = (yearVal) => {
    setViewDate(new Date(yearVal, currentMonth, 1));
  };

  const handleMonthChange = (e) => {
    setViewDate(new Date(currentYear, parseInt(e.target.value, 10), 1));
  };

  const handleDateSelect = (day) => {
    const dayStr = String(day).padStart(2, '0');
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const formatted = `${dayStr}/${monthStr}/${currentYear}`;
    
    onChange({
      target: {
        name,
        value: formatted
      }
    });
    setIsOpen(false);
    setShowYearGrid(false);
  };

  const toggleOpen = () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    setShowYearGrid(false);
    if (!nextOpen && onBlur) {
      onBlur({ target: { name } });
    }
  };

  // Generate days array
  const totalDays = getDaysInMonth(currentYear, currentMonth);
  // Get starting day index (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  const daysGrid = [];
  // Fill initial blank days
  for (let i = 0; i < firstDayIndex; i++) {
    daysGrid.push(null);
  }
  // Fill actual days of the month
  for (let d = 1; d <= totalDays; d++) {
    daysGrid.push(d);
  }

  // Generate Year options (from 1940 to currentYear + 10)
  const years = [];
  const startYear = 1940;
  const endYear = new Date().getFullYear() + 10;
  for (let y = startYear; y <= endYear; y++) {
    years.push(y);
  }

  const isSelectedDay = (day) => {
    if (!selectedDate || !day) return false;
    return selectedDate.getDate() === day &&
           selectedDate.getMonth() === currentMonth &&
           selectedDate.getFullYear() === currentYear;
  };

  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const isFilled = value !== undefined && value !== null && value.toString().length > 0;

  return (
    <div className="space-y-1.5 w-full relative" ref={containerRef}>
      {label && (
        <label className="block text-[13px] font-bold tracking-wide text-[#0E2C7E] select-none">
          {label}
          {required && <span className="text-[#2459D2] font-bold ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          name={name}
          value={value || ''}
          onClick={toggleOpen}
          readOnly
          placeholder={placeholder}
          className={`${
            isFilled ? 'neu-field-filled' : 'neu-field'
          } ${isOpen ? 'neu-field-active' : ''} w-full px-5 py-3.5 sm:py-4 text-base font-medium rounded-full outline-none transition-all duration-250 pr-11 cursor-pointer ${
            error ? 'border-red-400 focus:box-shadow-none' : ''
          }`}
        />
        <div 
          onClick={toggleOpen}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2459D2] cursor-pointer"
        >
          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 left-0 mt-2 p-4 w-[285px] rounded-2xl glass-morphism-card text-[#0E2C7E] shadow-xl backdrop-blur-xl bg-white/95">
          <div className="flex items-center justify-between gap-1 pb-3 mb-2 border-b border-[#77B1EC]/30">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={showYearGrid}
              className="w-7 h-7 rounded-lg flex items-center justify-center neu-btn-flat-inactive font-bold text-xs cursor-pointer select-none disabled:opacity-30 disabled:cursor-not-allowed text-[#2459D2]"
            >
              &larr;
            </button>
            <div className="flex gap-1.5 items-center">
              <select
                value={currentMonth}
                onChange={handleMonthChange}
                disabled={showYearGrid}
                className="bg-white/80 border border-[#77B1EC]/40 rounded-lg px-1.5 py-1 text-[11px] font-bold focus:outline-none cursor-pointer text-[#0E2C7E] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {monthsList.map((m, idx) => (
                  <option key={m} value={idx}>{m}</option>
                ))}
              </select>
              
              <button
                type="button"
                onClick={() => setShowYearGrid(!showYearGrid)}
                className="bg-white/80 border border-[#77B1EC]/40 rounded-lg px-2 py-1 text-[11px] font-bold focus:outline-none cursor-pointer text-[#0E2C7E] hover:bg-[#77B1EC]/20 transition-colors flex items-center gap-0.5"
              >
                <span>{currentYear}</span>
                <span className="text-[8px] text-[#2459D2]">{showYearGrid ? '▲' : '▼'}</span>
              </button>
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              disabled={showYearGrid}
              className="w-7 h-7 rounded-lg flex items-center justify-center neu-btn-flat-inactive font-bold text-xs cursor-pointer select-none disabled:opacity-30 disabled:cursor-not-allowed text-[#2459D2]"
            >
              &rarr;
            </button>
          </div>

          {showYearGrid ? (
            <div className="max-h-[170px] overflow-y-auto grid grid-cols-4 gap-1 p-1 scrollbar-thin select-none">
              {years.map((y) => {
                const selected = y === currentYear;
                return (
                  <button
                    key={y}
                    type="button"
                    onClick={() => {
                      handleYearChange(y);
                      setShowYearGrid(false);
                    }}
                    className={`py-1.5 text-[11px] rounded-lg font-bold transition-all cursor-pointer ${
                      selected
                        ? 'glass-morphism-btn text-white'
                        : 'text-[#0E2C7E] hover:bg-[#77B1EC]/20 hover:text-[#2459D2]'
                    }`}
                  >
                    {y}
                  </button>
                );
              })}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-[#64748B] mb-2 select-none">
                {weekdays.map(day => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {daysGrid.map((day, idx) => {
                  if (day === null) {
                    return <div key={`empty-${idx}`} className="w-8 h-8" />;
                  }

                  const selected = isSelectedDay(day);

                  return (
                    <button
                      key={`day-${day}`}
                      type="button"
                      onClick={() => handleDateSelect(day)}
                      className={`w-8 h-8 text-[11px] rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                        selected
                          ? 'glass-morphism-btn text-white'
                          : 'text-[#0E2C7E] hover:bg-[#77B1EC]/20 hover:text-[#2459D2]'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
      {error && <span className="text-xs text-red-500 font-medium block mt-1">{error}</span>}
    </div>
  );
}
