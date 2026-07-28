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

function DayTabSelector({
  selectedDaysOfWeek,
  activeDayTab,
  onToggleDay,
  onSelectActiveTab
}) {
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
                color={isSelected ? "success" : "default"}
                variant={isSelected ? "solid" : "bordered"}
                onPress={() => onToggleDay(d.id)}
                className={`font-bold text-xs ${isSelected ? 'text-slate-950 shadow-md' : 'border-slate-800 text-slate-400'}`}
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
            color="success"
            variant="flat"
            size="sm"
          >
            {selectedDaysOfWeek.map((dayId) => {
              const dayObj = DAYS_OF_WEEK.find(d => d.id === dayId);
              return (
                <Tab
                  key={String(dayId)}
                  title={dayObj ? dayObj.name : 'Día'}
                />
              );
            })}
          </Tabs>
        </div>
      )}
    </div>
  );
}

export default memo(DayTabSelector);
