
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
    return date.toISOString().split('T')[0];
}

export function getNearestActiveDay(mondayActive: boolean, thursdayActive: boolean) {
    if (!mondayActive && !thursdayActive) return null;
    if (mondayActive && !thursdayActive) return 'monday';
    if (!mondayActive && thursdayActive) return 'thursday';

    const nextMonday = getNextWeekday('Monday');
    const nextThursday = getNextWeekday('Thursday');

    return nextMonday.getTime() <= nextThursday.getTime() ? 'monday' : 'thursday';
}
