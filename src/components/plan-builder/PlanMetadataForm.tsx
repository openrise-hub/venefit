import React, { memo } from 'react';
import { Input, Button } from '@heroui/react';

const DURATION_PRESETS = [
  { label: '1 Semana', days: 7 },
  { label: '1 Mes (30 días)', days: 30 },
  { label: '3 Meses (Trimestral)', days: 90 },
  { label: '6 Meses (Semestral)', days: 180 }
];

interface PlanMetadataFormProps {
  planName: string;
  onPlanNameChange: (name: string) => void;
  startDateStr: string;
  onStartDateChange: (date: string) => void;
  endDateStr: string;
  onEndDateChange: (date: string) => void;
  onPresetSelect: (days: number) => void;
}

function PlanMetadataForm({
  planName,
  onPlanNameChange,
  startDateStr,
  onStartDateChange,
  endDateStr,
  onEndDateChange,
  onPresetSelect
}: PlanMetadataFormProps) {
  return (
    <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-3">
      <div className="space-y-1">
        <label className="text-xs text-slate-400 font-medium">Nombre del Plan</label>
        <Input
          placeholder="Ej. Hipertrofia 12 Semanas"
          value={planName}
          onChange={(e) => onPlanNameChange(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-slate-400 font-medium">Fecha de Inicio</label>
          <Input
            type="date"
            value={startDateStr}
            onChange={(e) => onStartDateChange(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-400 font-medium">Fecha Final</label>
          <Input
            type="date"
            value={endDateStr}
            onChange={(e) => onEndDateChange(e.target.value)}
          />
        </div>
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
              variant="ghost"
              onPress={() => onPresetSelect(preset.days)}
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
