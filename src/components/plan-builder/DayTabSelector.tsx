import React, { memo } from 'react';
import { Tabs, Tab, Button } from '@heroui/react';

const DAYS_OF_WEEK = [
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
  activeDayTab: number;
  onToggleDay: (dayId: number) => void;
  onSelectActiveTab: (dayId: number) => void;
}

function DayTabSelector({
  selectedDaysOfWeek,
  activeDayTab,
  onToggleDay,
  onSelectActiveTab
}: DayTabSelectorProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-bold text-slate-300 block mb-2">
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

      {selectedDaysOfWeek.length > 0 && (
        <div className="pt-1 overflow-x-auto">
          <Tabs
            selectedKey={String(activeDayTab)}
            onSelectionChange={(key) => onSelectActiveTab(Number(key))}
          >
            {selectedDaysOfWeek.map((dayId) => {
              const dayObj = DAYS_OF_WEEK.find(d => d.id === dayId);
              return (
                <Tab key={String(dayId)}>
                  {dayObj ? dayObj.name : 'Día'}
                </Tab>
              );
            })}
          </Tabs>
        </div>
      )}
    </div>
  );
}

export default memo(DayTabSelector);
