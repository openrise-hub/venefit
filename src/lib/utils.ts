export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
  return date.toLocaleDateString('es-ES', options);
}

export function getWeekDays(centerDateStr: string): Array<{ dateStr: string; dayName: string; dayNum: number; isToday: boolean }> {
  const centerDate = new Date(centerDateStr + 'T00:00:00');
  const dayOfWeek = centerDate.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(centerDate);
  monday.setDate(centerDate.getDate() + diffToMonday);

  const todayStr = formatDateISO(new Date());
  const week = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dStr = formatDateISO(d);

    const dayNameShort = d.toLocaleDateString('es-ES', { weekday: 'short' });
    const capitalized = dayNameShort.charAt(0).toUpperCase() + dayNameShort.slice(1);

    week.push({
      dateStr: dStr,
      dayName: capitalized,
      dayNum: d.getDate(),
      isToday: dStr === todayStr
    });
  }

  return week;
}

export const getWeekDates = getWeekDays;

export function convertWeight(val: string | number, fromUnit: 'kg' | 'lb', toUnit: 'kg' | 'lb'): string {
  if (!val || isNaN(Number(val))) return '';
  const num = parseFloat(String(val));
  if (fromUnit === toUnit) return String(num);

  if (fromUnit === 'kg' && toUnit === 'lb') {
    return (num * 2.20462).toFixed(1);
  } else if (fromUnit === 'lb' && toUnit === 'kg') {
    return (num / 2.20462).toFixed(1);
  }

  return String(num);
}

export function generateReplicatedDates(
  startDateStr: string,
  endDateStr: string,
  selectedDaysOfWeek: number[]
): Array<{ dateStr: string; dayOfWeek: number }> {
  const start = new Date(startDateStr + 'T00:00:00');
  const end = new Date(endDateStr + 'T00:00:00');
  const result = [];

  const current = new Date(start);
  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (selectedDaysOfWeek.includes(dayOfWeek)) {
      result.push({
        dateStr: formatDateISO(current),
        dayOfWeek
      });
    }
    current.setDate(current.getDate() + 1);
  }

  return result;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
