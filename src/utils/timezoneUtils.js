/**
 * Converts a date and time string into a UTC Date object that represents 
 * that specific time in the target timezone.
 * 
 * @param {Date} date - The date object (year/month/day)
 * @param {string} timeString - Time in "HH:mm" format
 * @param {string} timezone - IANA timezone string (e.g., "America/Juneau")
 * @returns {Date} - A Date object correctly aligned to UTC
 */
export const getUTCDateTime = (date, timeString, timezone = 'UTC') => {
  if (!timeString) return null;
  
  const [hours, minutes] = timeString.split(':').map(Number);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false
  });

  // Target "wall time" as UTC millis for calculation
  const targetWallMillis = Date.UTC(year, month, day, hours, minutes);
  
  // Initial guess
  let utcMillis = targetWallMillis;
  
  // Refine estimate to account for timezone offset
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
