import React, { memo } from 'react';
import { Card, CardContent, Input, Button } from '@heroui/react';

const DURATION_PRESETS = [
  { label: '1 Semana', days: 7 },
  { label: '4 Semanas (1 Mes)', days: 28 },
  { label: '8 Semanas (2 Meses)', days: 56 },
  { label: '12 Semanas (Trimestral)', days: 84 }
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
    <Card className="p-3.5 sm:p-4">
      <CardContent className="p-0 space-y-3.5">
        <div className="space-y-1">
          <label className="text-xs font-semibold opacity-80 block">Nombre del Mesociclo / Plan</label>
          <Input
            placeholder="Ej. Hipertrofia 8 Semanas"
            value={planName}
            onChange={(e) => onPlanNameChange(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold opacity-80 block">Inicio del Mesociclo</label>
            <Input
              type="date"
              value={startDateStr}
              onChange={(e) => onStartDateChange(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold opacity-80 block">Término del Mesociclo</label>
            <Input
              type="date"
              value={endDateStr}
              onChange={(e) => onEndDateChange(e.target.value)}
            />
          </div>
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider block mb-1.5 opacity-70">
            Duración del Mesociclo:
          </span>
          <div className="flex flex-wrap gap-2">
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
      </CardContent>
    </Card>
  );
}

export default memo(PlanMetadataForm);
