import React, { useMemo } from 'react';
import { Select, ListBox } from '@heroui/react';
import type { Key } from '@react-types/shared';
import { Check, ChevronDown } from 'lucide-react';

const EMPTY_KEY_SENTINEL = '__VENEFIT_EMPTY__';

function encodeKey(value: string): string {
  return value === '' ? EMPTY_KEY_SENTINEL : value;
}

function decodeKey(key: Key): string {
  const str = String(key);
  return str === EMPTY_KEY_SENTINEL ? '' : str;
}

export interface VenefitSelectOption {
  value: string;
  label: string;
  /** Optional shorter label shown in the closed trigger button while keeping full label in menu */
  triggerLabel?: string;
  disabled?: boolean;
}

export interface VenefitSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: VenefitSelectOption[];
  placeholder?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  surfaceTone?: 'surface' | 'background';
  fullWidth?: boolean;
  compact?: boolean;
  className?: string;
  triggerClassName?: string;
  valueClassName?: string;
  popoverClassName?: string;
}

export default function VenefitSelect({
  id,
  value,
  onChange,
  options,
  placeholder = 'Seleccionar…',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  disabled = false,
  startIcon,
  surfaceTone = 'surface',
  fullWidth = true,
  compact = false,
  className,
  triggerClassName,
  valueClassName,
  popoverClassName
}: VenefitSelectProps) {
  const hasMatchingOption = useMemo(
    () => options.some((opt) => opt.value === value),
    [options, value]
  );

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  const selectedKey: Key | null = hasMatchingOption ? encodeKey(value) : null;

  const handleSelectionChange = (key: Key | null) => {
    if (key == null) return;
    onChange(decodeKey(key));
  };

  const toneClass =
    surfaceTone === 'background'
      ? 'bg-background hover:bg-surface-secondary/50'
      : 'bg-surface hover:bg-surface-secondary/70';

  const densityTriggerClass = compact
    ? 'min-h-0 h-9 pl-2 pr-5.5 text-xs font-bold'
    : 'min-h-0 h-9 sm:h-10 pl-3 pr-8 text-xs font-semibold';

  const indicatorPositionClass = compact ? 'end-1.5' : 'end-2.5';

  return (
    <Select
      fullWidth={fullWidth}
      value={selectedKey}
      onChange={handleSelectionChange}
      isDisabled={disabled}
      placeholder={placeholder}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={[fullWidth ? 'w-full min-w-0' : 'w-auto', className].filter(Boolean).join(' ')}
    >
      <Select.Trigger
        id={id}
        className={[
          'group relative flex items-center justify-between gap-1.5 rounded-xl border border-solid border-border text-foreground shadow-2xs outline-none cursor-pointer select-none',
          'transition-colors duration-150 motion-reduce:transition-none',
          'hover:border-emerald-500/45',
          'data-[pressed=true]:border-emerald-400 data-[pressed=true]:ring-2 data-[pressed=true]:ring-emerald-400/20',
          'focus-visible:outline-none focus-visible:border-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-400/35',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          fullWidth ? 'w-full' : 'w-auto',
          toneClass,
          densityTriggerClass,
          triggerClassName
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {startIcon ? (
          <span className="flex items-center gap-2 min-w-0 flex-1">
            <span className="shrink-0 flex items-center" aria-hidden="true">
              {startIcon}
            </span>
            <Select.Value
              className={[
                'min-w-0 flex-1 truncate text-start text-xs leading-tight text-foreground data-[placeholder=true]:text-muted',
                valueClassName
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {() => {
                if (selectedOption) {
                  return selectedOption.triggerLabel ?? selectedOption.label;
                }
                return value !== '' ? value : placeholder;
              }}
            </Select.Value>
          </span>
        ) : (
          <Select.Value
            className={[
              'min-w-0 flex-1 truncate text-start text-xs leading-tight text-foreground data-[placeholder=true]:text-muted',
              valueClassName
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {() => {
              if (selectedOption) {
                return selectedOption.triggerLabel ?? selectedOption.label;
              }
              return value !== '' ? value : placeholder;
            }}
          </Select.Value>
        )}

        <Select.Indicator
          className={[
            'text-muted transition-[transform,color] duration-150 motion-reduce:transition-none',
            'group-hover:text-foreground data-[open=true]:text-emerald-600 dark:data-[open=true]:text-emerald-400',
            compact ? 'w-3.5 h-3.5' : 'w-4 h-4',
            indicatorPositionClass
          ].join(' ')}
        >
          <ChevronDown aria-hidden="true" />
        </Select.Indicator>
      </Select.Trigger>

      <Select.Popover
        offset={6}
        containerPadding={12}
        className={[
          'z-[100] flex flex-col max-h-64 overflow-hidden rounded-2xl border border-solid border-border',
          'bg-surface/95 backdrop-blur-xl text-foreground shadow-2xl shadow-black/20 dark:shadow-black/70 p-0',
          popoverClassName
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <ListBox
          aria-label={ariaLabel}
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-1.5 space-y-0.5 outline-none"
        >
          {options.map((opt) => {
            const itemKey = encodeKey(opt.value);
            return (
              <ListBox.Item
                key={itemKey}
                id={itemKey}
                textValue={opt.label}
                isDisabled={opt.disabled}
                className={[
                  'group relative flex items-center justify-between gap-2.5 min-h-[44px] sm:min-h-9 rounded-xl px-2.5 py-2 sm:py-1.5',
                  'text-xs font-semibold text-foreground/90 border border-transparent',
                  'transition-colors duration-100 motion-reduce:transition-none cursor-pointer select-none outline-none',
                  'hover:bg-surface-secondary hover:text-foreground',
                  'data-[hovered=true]:bg-surface-secondary data-[hovered=true]:text-foreground',
                  'data-[focused=true]:bg-surface-secondary data-[focused=true]:text-foreground',
                  'data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-emerald-400/50',
                  'data-[selected=true]:bg-emerald-500/15 data-[selected=true]:text-emerald-700 dark:data-[selected=true]:text-emerald-300 data-[selected=true]:border-emerald-500/30 data-[selected=true]:font-bold',
                  'data-[disabled=true]:opacity-40 data-[disabled=true]:pointer-events-none'
                ].join(' ')}
              >
                <span className="truncate">{opt.label}</span>
                <ListBox.ItemIndicator className="static top-auto end-auto translate-y-0 ml-auto size-4 shrink-0 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  {({ isSelected }) =>
                    isSelected ? <Check className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" /> : null
                  }
                </ListBox.ItemIndicator>
              </ListBox.Item>
            );
          })}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
