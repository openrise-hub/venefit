export function formatDateISO(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getWeekDates(targetDate = new Date()) {
  const curr = new Date(targetDate);
  const day = curr.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(curr);
  monday.setDate(curr.getDate() + diffToMonday);
  const week = [];

  const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(monday);
    nextDay.setDate(monday.getDate() + i);
    week.push({
      dateStr: formatDateISO(nextDay),
      dayName: dayNames[i],
      shortDay: dayNames[i].substring(0, 3),
      dayNumber: nextDay.getDate(),
      monthShort: nextDay.toLocaleString('es-ES', { month: 'short' }),
      dateObj: nextDay,
      dayOfWeekIndex: (i + 1) % 7
    });
  }

  return week;
}

export function generateReplicatedDates(startDateStr, endDateStr, selectedDaysOfWeek = []) {
  const dates = [];
  const start = new Date(startDateStr + 'T00:00:00');
  const end = new Date(endDateStr + 'T00:00:00');

  let current = new Date(start);

  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (selectedDaysOfWeek.includes(dayOfWeek)) {
      dates.push({
        dateStr: formatDateISO(current),
        dayOfWeek: dayOfWeek
      });
    }
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export function convertWeight(value, fromUnit, toUnit) {
  if (!value || isNaN(value)) return 0;
  const num = parseFloat(value);
  if (fromUnit === toUnit) return num;
  if (fromUnit === 'kg' && toUnit === 'lb') {
    return Math.round(num * 2.20462 * 10) / 10;
  }
  if (fromUnit === 'lb' && toUnit === 'kg') {
    return Math.round((num / 2.20462) * 10) / 10;
  }
  return num;
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
