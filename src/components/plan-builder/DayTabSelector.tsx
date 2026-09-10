import React, { memo } from 'react';
import { Button } from '@heroui/react';

export const DAYS_OF_WEEK = [
  { id: 1, name: 'Lunes', short: 'Lun' },
  { id: 2, name: 'Martes', short: 'Mar' },
  { id: 3, name: 'Miércoles', short: 'Mié' },
  { id: 4, name: 'Jueves', short: 'Jue' },
  { id: 5, name: 'Viernes', short: 'Vie' },
  { id: 6, name: 'Sábado', short: 'Sáb' },
  { id: 0, name: 'Domingo', short: 'Dom' }
];

interface DayTabSelectorProps {
  selectedDaysOfWeek: number[];
  activeDayTab?: number;
  onToggleDay: (dayId: number) => void;
  onSelectActiveTab?: (dayId: number) => void;
  hideActiveTabs?: boolean;
}

function DayTabSelector({
  selectedDaysOfWeek,
  activeDayTab,
  onToggleDay,
  onSelectActiveTab,
  hideActiveTabs = false
}: DayTabSelectorProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-bold block mb-2 opacity-80">
          Días de la semana a entrenar:
        </label>
        <div className="grid grid-cols-7 gap-1.5">
          {DAYS_OF_WEEK.map((d) => {
            const isSelected = selectedDaysOfWeek.includes(d.id);
            return (
              <Button
                key={d.id}
                size="sm"
                variant={isSelected ? "primary" : "ghost"}
                onPress={() => onToggleDay(d.id)}
              >
                {d.short}
              </Button>
            );
          })}
        </div>
      </div>

      {!hideActiveTabs && onSelectActiveTab && selectedDaysOfWeek.length > 0 && (
        <div className="flex items-center gap-1.5 p-1 rounded-2xl border overflow-x-auto">
          {selectedDaysOfWeek.map((dayId) => {
            const dayObj = DAYS_OF_WEEK.find(d => d.id === dayId);
            const isActive = activeDayTab === dayId;
            return (
              <Button
                key={dayId}
                size="sm"
                variant={isActive ? "primary" : "ghost"}
                className="shrink-0 font-bold text-xs"
                onPress={() => onSelectActiveTab(dayId)}
              >
                {dayObj ? dayObj.name : `Día ${dayId}`}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default memo(DayTabSelector);
