export const MONTHS = [
  { value: 0, name: "January", short: "Jan" },
  { value: 1, name: "February", short: "Feb" },
  { value: 2, name: "March", short: "Mar" },
  { value: 3, name: "April", short: "Apr" },
  { value: 4, name: "May", short: "May" },
  { value: 5, name: "June", short: "Jun" },
  { value: 6, name: "July", short: "Jul" },
  { value: 7, name: "August", short: "Aug" },
  { value: 8, name: "September", short: "Sep" },
  { value: 9, name: "October", short: "Oct" },
  { value: 10, name: "November", short: "Nov" },
  { value: 11, name: "December", short: "Dec" },
];

export function getDaysInMonth(year, monthIndex) {
  const y = parseInt(year, 10);
  const m = parseInt(monthIndex, 10);
  if (isNaN(y) || isNaN(m)) return 31;
  return new Date(y, m + 1, 0).getDate();
}

export function formatDisplayDate(date = new Date()) {
  const day = date.getDate();
  const month = MONTHS[date.getMonth()].name;
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export function pluralize(val, singular, plural) {
  return `${val.toLocaleString()} ${val === 1 ? singular : plural}`;
}

export function calculateDetailedAge(dobParts, targetParts) {
  const dobDay = parseInt(dobParts.day, 10);
  const dobMonth = parseInt(dobParts.month, 10); // 0-indexed
  const dobYear = parseInt(dobParts.year, 10);

  const targetDay = parseInt(targetParts.day, 10);
  const targetMonth = parseInt(targetParts.month, 10); // 0-indexed
  const targetYear = parseInt(targetParts.year, 10);

  if (isNaN(dobDay) || isNaN(dobMonth) || isNaN(dobYear)) {
    return { isValid: false, error: "Please enter a complete Date of Birth!" };
  }

  if (isNaN(targetDay) || isNaN(targetMonth) || isNaN(targetYear)) {
    return { isValid: false, error: "Please enter a complete Target Date!" };
  }

  if (dobYear < 100 || dobYear > 9999 || targetYear < 100 || targetYear > 9999) {
    return { isValid: false, error: "Please enter a valid 4-digit year!" };
  }

  // Validate days in month
  const maxDobDays = getDaysInMonth(dobYear, dobMonth);
  if (dobDay > maxDobDays) {
    return {
      isValid: false,
      error: `Invalid Date of Birth: ${MONTHS[dobMonth].name} ${dobYear} only has ${maxDobDays} days!`,
    };
  }

  const maxTargetDays = getDaysInMonth(targetYear, targetMonth);
  if (targetDay > maxTargetDays) {
    return {
      isValid: false,
      error: `Invalid Target Date: ${MONTHS[targetMonth].name} ${targetYear} only has ${maxTargetDays} days!`,
    };
  }

  const dobUtc = Date.UTC(dobYear, dobMonth, dobDay);
  const targetUtc = Date.UTC(targetYear, targetMonth, targetDay);

  if (dobUtc > targetUtc) {
    return {
      isValid: false,
      error: "Date of Birth cannot be in the future of the target date!",
    };
  }

  // Calculate year difference
  let yearAge = targetYear - dobYear;

  // Calculate month difference
  let monthAge;
  if (targetMonth >= dobMonth) {
    monthAge = targetMonth - dobMonth;
  } else {
    yearAge--;
    monthAge = 12 + targetMonth - dobMonth;
  }

  // Calculate day difference
  let dateAge;
  if (targetDay >= dobDay) {
    dateAge = targetDay - dobDay;
  } else {
    monthAge--;
    const daysInPrevMonth = new Date(targetYear, targetMonth, 0).getDate();
    dateAge = daysInPrevMonth + targetDay - dobDay;

    if (monthAge < 0) {
      monthAge = 11;
      yearAge--;
    }
  }

  // Total elapsed calculations
  const msPerDay = 24 * 60 * 60 * 1000;
  const totalDays = Math.floor((targetUtc - dobUtc) / msPerDay);
  const totalMonths = yearAge * 12 + monthAge;
  const totalWeeks = Math.floor(totalDays / 7);
  const remDays = totalDays % 7;
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;
  const totalSeconds = totalMinutes * 60;

  return {
    isValid: true,
    error: null,
    breakdown: {
      years: yearAge,
      months: monthAge,
      days: dateAge,
      totalMonths,
      totalWeeks,
      remDays,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
    },
  };
}
