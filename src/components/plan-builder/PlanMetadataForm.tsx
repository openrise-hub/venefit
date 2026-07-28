import React, { memo } from 'react';
import { Input, Button } from '@heroui/react';

const DURATION_PRESETS = [
  { label: '1 Semana', days: 7 },
  { label: '1 Mes (30 días)', days: 30 },
  { label: '3 Meses (Trimestral)', days: 90 },
  { label: '6 Meses (Semestral)', days: 180 }
];

function PlanMetadataForm({
  planName,
  onPlanNameChange,
  startDateStr,
  onStartDateChange,
  endDateStr,
  onEndDateChange,
  onPresetSelect
}) {
  return (
    <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-3">
      <Input
        label="Nombre del Plan"
        placeholder="Ej. Hipertrofia 12 Semanas"
        value={planName}
        onChange={(e) => onPlanNameChange(e.target.value)}
        variant="bordered"
        size="sm"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          type="date"
          label="Fecha de Inicio"
          value={startDateStr}
          onChange={(e) => onStartDateChange(e.target.value)}
          variant="bordered"
          size="sm"
        />

        <Input
          type="date"
          label="Fecha Final"
          value={endDateStr}
          onChange={(e) => onEndDateChange(e.target.value)}
          variant="bordered"
          size="sm"
        />
      </div>

      <div>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
          Atajos de Duración:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {DURATION_PRESETS.map((preset) => (
            <Button
              key={preset.label}
              size="sm"
              variant="flat"
              color="success"
              onPress={() => onPresetSelect(preset.days)}
              className="font-semibold text-xs h-7 min-w-0"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(PlanMetadataForm);
