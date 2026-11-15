// convert a date object to a string in the format of YYYY-MM-DD
export function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// get the date in the format of YYYY-MM-DD from a date object 
export function fromDateKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// format the daate into human readable format, e.g. "Monday, January 1, 2023"
export function formatDate(key, options = { weekday: "long", month: "long", day: "numeric", year: "numeric" },) {
  return fromDateKey(key).toLocaleDateString("en-US", options);
}

// check if the date is in the past
export function isPastDay(key) {
  return key < toDateKey(new Date());
}

// check if the session is past based on the date and hour
export function isSessionPast(key, hour) {
  const d = fromDateKey(key);
  d.setHours(hour, 0, 0, 0);
  return d <= new Date();
}

// check for weekends, first and last day of the week. 
export function isWeekend(key) {
  const day = fromDateKey(key).getDay();
  return day === 0 || day === 6;
}

// get the next bookable date, which is the next weekday (Monday to Friday)
export function nextBookableDate() {
  const d = new Date();
  while (d.getDay() === 0 || d.getDay() === 6) // skip weekends. 
    d.setDate(d.getDate() + 1);
  return toDateKey(d);
}
