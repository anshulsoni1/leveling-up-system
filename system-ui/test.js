const datesObj = { "2026-02-25": 5, "2026-02-24": 15, "2026-02-23": 0, "2026-02-22": 10, "2026-02-21": 10, "2026-02-20": 10, "2026-02-19": 10 };
let dates = Object.keys(datesObj).filter(k => datesObj[k] > 0);
dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
console.log("Sorted dates:", dates);

let maxStreak = 1;
let currentRun = 1;

for (let i = 1; i < dates.length; i++) {
    const prevDate = new Date(dates[i - 1]);
    const currDate = new Date(dates[i]);
    prevDate.setHours(0,0,0,0);
    currDate.setHours(0,0,0,0);
    const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log(`${dates[i - 1]} to ${dates[i]} diffDays:`, diffDays);
    if (diffDays === 1) {
        currentRun++;
        if (currentRun > maxStreak) {
            maxStreak = currentRun;
        }
    } else if (diffDays > 1) {
        currentRun = 1;
    }
}
console.log("Best streak:", maxStreak);
