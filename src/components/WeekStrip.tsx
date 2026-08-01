import React from 'react';
import { Card, CardContent, Button, Chip } from '@heroui/react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RotateCcw } from 'lucide-react';
import { getWeekDates, formatDateISO } from '../lib/utils';

interface WeekStripProps {
  selectedDateStr: string;
  onSelectDate: (dateStr: string) => void;
}

export default function WeekStrip({ selectedDateStr, onSelectDate }: WeekStripProps) {
  const todayStr = formatDateISO(new Date());
  const currentWeek = getWeekDates(selectedDateStr);

  const navigateWeek = (direction: number) => {
    const current = new Date(selectedDateStr + 'T00:00:00');
    current.setDate(current.getDate() + (direction * 7));
    onSelectDate(formatDateISO(current));
  };

  return (
    <Card className="mb-5">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={selectedDateStr}
              onChange={(e) => {
                if (e.target.value) onSelectDate(e.target.value);
              }}
              className="text-xs rounded-xl px-2 py-1 cursor-pointer border"
            />

            {selectedDateStr !== todayStr && (
              <Button
                size="sm"
                variant="ghost"
                onPress={() => onSelectDate(todayStr)}
              >
                <RotateCcw />
                <span>Hoy</span>
              </Button>
            )}

            <div className="flex items-center gap-0.5 border rounded-xl p-0.5">
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                onPress={() => navigateWeek(-1)}
              >
                <ChevronLeft />
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                onPress={() => navigateWeek(1)}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {currentWeek.map((day) => {
            const isSelected = day.dateStr === selectedDateStr;
            const isToday = day.dateStr === todayStr;

            return (
              <Button
                key={day.dateStr}
                variant={isSelected ? "primary" : isToday ? "outline" : "ghost"}
                size="sm"
                onPress={() => onSelectDate(day.dateStr)}
                className="flex flex-col h-auto py-2"
              >
                <span className="text-[10px] uppercase opacity-80">
                  {day.dayName}
                </span>
                <span className="text-sm font-black my-0.5">
                  {day.dayNum}
                </span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
