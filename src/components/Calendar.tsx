import React, { useState, useEffect, useRef } from 'react';
import { format, addDays, subDays, isSameDay, startOfToday } from 'date-fns';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function Calendar({ selectedDate, onDateSelect }: CalendarProps) {
  const [dates, setDates] = useState<Date[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const today = startOfToday();

  useEffect(() => {
    // Generate dates: 30 days before, 30 days after
    const newDates = [];
    for (let i = -30; i <= 30; i++) {
      newDates.push(addDays(today, i));
    }
    setDates(newDates);
  }, []);

  // Scroll to today on mount
  useEffect(() => {
    if (scrollRef.current) {
      const todayElement = scrollRef.current.querySelector('[data-today="true"]');
      if (todayElement) {
        todayElement.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      }
    }
  }, [dates]);

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-4 px-2 bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
      <div ref={scrollRef} className="flex gap-3 px-4">
        {dates.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          const isPast = date < today && !isToday;

          return (
            <motion.button
              key={date.toISOString()}
              data-today={isToday}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDateSelect(date)}
              className={cn(
                "flex flex-col items-center justify-center min-w-[60px] h-[80px] rounded-2xl transition-all duration-200",
                isSelected 
                  ? "bg-[#2a6df4] text-white shadow-lg shadow-[#2a6df4]/30" 
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100",
                isPast && !isSelected && "opacity-60"
              )}
            >
              <span className="text-[10px] font-medium uppercase tracking-wider mb-1">
                {format(date, 'EEE')}
              </span>
              <span className="text-lg font-bold">
                {format(date, 'd')}
              </span>
              {isToday && !isSelected && (
                <div className="w-1 h-1 bg-[#2a6df4] rounded-full mt-1" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
