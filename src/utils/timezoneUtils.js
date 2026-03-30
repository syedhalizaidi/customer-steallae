/**
 * Returns a Date object that represents the target "wall time" in UTC.
 * This ensures that JSON.stringify(date) shows the selected business time (e.g. 15:00 -> 15:00Z)
 * 
 * @param {Date} date - The date object from calendar
 * @param {string} timeString - "HH:mm"
 * @returns {Date} - A "Wall Time" Date object (Fake UTC)
 */
export const getWallDateTime = (date, timeString) => {
  if (!timeString) return null;
  const [hours, minutes] = timeString.split(':').map(Number);
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes));
};

/**
 * Converts a "Wall Time" Date object (Fake UTC) into a Real UTC Date object.
 */
export const wallToRealUTC = (wallDate, timezone) => {
  if (!wallDate) return null;
  
  // We need to find what 15:00 in "timezone" is in real UTC
  const year = wallDate.getUTCFullYear();
  const month = wallDate.getUTCMonth();
  const day = wallDate.getUTCDate();
  const hours = wallDate.getUTCHours();
  const minutes = wallDate.getUTCMinutes();

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false
  });

  const targetWallMillis = Date.UTC(year, month, day, hours, minutes);
  let utcMillis = targetWallMillis;
  
  for (let i = 0; i < 2; i++) {
    const parts = formatter.formatToParts(new Date(utcMillis));
    const p = {};
    parts.forEach(part => p[part.type] = part.value);
    
    const currentLocalMillis = Date.UTC(
      parseInt(p.year), 
      parseInt(p.month) - 1, 
      parseInt(p.day),
      parseInt(p.hour) === 24 ? 0 : parseInt(p.hour), 
      parseInt(p.minute)
    );
    
    const diff = currentLocalMillis - targetWallMillis;
    utcMillis -= diff;
  }
  
  return new Date(utcMillis);
};

/**
 * Returns the local time string for a wall-time date.
 */
export const getLocalTimeFromWall = (wallDate, timezone) => {
    const realUTC = wallToRealUTC(wallDate, timezone);
    if (!realUTC) return '';
    return realUTC.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

/**
 * Formats a date object into a time string for a specific timezone.
 * 
 * @param {Date} date 
 * @param {string} timezone 
 * @returns {string} - "HH:mm"
 */
export const formatInTimezone = (date, timezone) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(date);
  
  const p = {};
  parts.forEach(part => p[part.type] = part.value);
  return `${p.hour}:${p.minute}`;
};

/**
 * Returns the timezone offset string (e.g., "GMT-8" or "GMT+5") for a given timezone.
 * 
 * @param {string} timezone 
 * @returns {string}
 */
export const getTimezoneOffset = (timezone) => {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'longOffset'
    }).formatToParts(new Date());
    
    const val = parts.find(p => p.type === 'timeZoneName')?.value || '';
    return val.replace('GMT', 'UTC');
  } catch (e) {
    return '';
  }
};

/**
 * Returns the local time string for the user's current browser timezone.
 * 
 * @param {Date} date 
 * @returns {string} - e.g., "10:00 PM"
 */
export const getLocalTime = (date) => {
  if (!date) return '';
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};
