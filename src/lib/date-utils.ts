
export function getNextWeekday(dayName: 'Monday' | 'Thursday') {
    const dayMap = {
        'Monday': 1,
        'Thursday': 4
    };

    const targetDay = dayMap[dayName];
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday...

    let daysUntil = (targetDay - currentDay + 7) % 7;

    // If today is the target day, we might want the NEXT one if it's past noon
    // but for simplicity, if it's today, we'll return today
    if (daysUntil === 0) {
        // optional: check time. if after 12pm, maybe next week?
        // let's stick to the next occurrence for now
    }

    const resultDate = new Date(today);
    resultDate.setDate(today.getDate() + daysUntil);
    resultDate.setHours(0, 0, 0, 0);

    return resultDate;
}

export function formatDate(date: Date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
    });
}

export function getISOString(date: Date) {
    // Use local date parts to avoid UTC timezone shift
    // e.g. in EST, midnight local = 05:00 UTC = previous day in ISO
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function getNearestActiveDay(mondayActive: boolean, thursdayActive: boolean) {
    if (!mondayActive && !thursdayActive) return null;
    if (mondayActive && !thursdayActive) return 'monday';
    if (!mondayActive && thursdayActive) return 'thursday';

    const nextMonday = getNextWeekday('Monday');
    const nextThursday = getNextWeekday('Thursday');

    return nextMonday.getTime() <= nextThursday.getTime() ? 'monday' : 'thursday';
}
