import { PlannerTripPlan, Language } from '../types';

/**
 * Generate a Google Calendar Web Intent URL for the trip plan
 */
export function getGoogleCalendarUrl(plan: PlannerTripPlan, language: Language): string {
  const isVi = language === 'vi';
  const title = encodeURIComponent(isVi ? `[HeritageVibe] ${plan.titleVi}` : `[HeritageVibe] ${plan.titleEn}`);
  
  // Construct dates based on selected month
  const targetMonth = plan.requestParams?.month || new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const yearToUse = targetMonth < (new Date().getMonth() + 1) ? currentYear + 1 : currentYear;
  
  const startDay = 15; // mid month default
  const endDay = startDay + (plan.days.length || 3);
  
  const startMonthStr = String(targetMonth).padStart(2, '0');
  const startDayStr = String(startDay).padStart(2, '0');
  const endDayStr = String(endDay).padStart(2, '0');
  
  const startDateStr = `${yearToUse}${startMonthStr}${startDayStr}T080000Z`;
  const endDateStr = `${yearToUse}${startMonthStr}${endDayStr}T180000Z`;
  
  // Format itinerary details
  let details = isVi ? `${plan.overviewSummaryVi}\n\nLỊCH TRÌNH:\n` : `${plan.overviewSummaryEn}\n\nITINERARY:\n`;
  plan.days.forEach(day => {
    details += `\n* ${isVi ? day.titleVi : day.titleEn} (${isVi ? day.themeVi : day.themeEn}):\n`;
    day.destinations.forEach(d => {
      details += `  - [${d.timeSlot || '08:30'}] ${isVi ? d.nameVi : d.nameEn}\n`;
    });
  });
  
  details += `\n\n${isVi ? 'Được lên lịch tự động bởi HeritageVibe AI Planner.' : 'Auto-scheduled by HeritageVibe AI Planner.'}`;
  
  const location = encodeURIComponent('Việt Nam');
  const encodedDetails = encodeURIComponent(details);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateStr}/${endDateStr}&details=${encodedDetails}&location=${location}`;
}

/**
 * Generate and download an iCalendar (.ics) file compatible with Apple, Google, and Outlook Calendars
 */
export function exportTripToIcs(plan: PlannerTripPlan, language: Language): void {
  const isVi = language === 'vi';
  const title = isVi ? plan.titleVi : plan.titleEn;
  const targetMonth = plan.requestParams?.month || new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const yearToUse = targetMonth < (new Date().getMonth() + 1) ? currentYear + 1 : currentYear;
  
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HeritageVibe//Vietnam Heritage Planner//VI',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];

  plan.days.forEach((day, index) => {
    const dayNum = 15 + index;
    const monthStr = String(targetMonth).padStart(2, '0');
    const dayStr = String(dayNum).padStart(2, '0');
    const dtStart = `${yearToUse}${monthStr}${dayStr}T080000Z`;
    const dtEnd = `${yearToUse}${monthStr}${dayStr}T180000Z`;

    const dayTitle = isVi ? `N${day.day}: ${day.titleVi}` : `Day ${day.day}: ${day.titleEn}`;
    let desc = `${isVi ? 'Chủ đề' : 'Theme'}: ${isVi ? day.themeVi : day.themeEn}\\n\\n${isVi ? 'ĐIỂM ĐẾN' : 'DESTINATIONS'}:\\n`;
    
    day.destinations.forEach(d => {
      desc += `- [${d.timeSlot || '08:30'}] ${isVi ? d.nameVi : d.nameEn}: ${isVi ? d.descriptionVi : d.descriptionEn}\\n`;
    });

    if (day.mealsVi) {
      desc += `\\n${isVi ? 'Ẩm thực' : 'Meals'}: ${(isVi ? day.mealsVi : day.mealsEn || day.mealsVi).join(', ')}`;
    }

    icsContent.push('BEGIN:VEVENT');
    icsContent.push(`UID:heritagevibe-trip-${Date.now()}-d${day.day}@heritagevibe.vn`);
    icsContent.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);
    icsContent.push(`DTSTART:${dtStart}`);
    icsContent.push(`DTEND:${dtEnd}`);
    icsContent.push(`SUMMARY:${title} - ${dayTitle}`);
    icsContent.push(`DESCRIPTION:${desc}`);
    icsContent.push(`LOCATION:Việt Nam`);
    icsContent.push('STATUS:CONFIRMED');
    icsContent.push('END:VEVENT');
  });

  icsContent.push('END:VCALENDAR');

  const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `HeritageVibe_${title.replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF]/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
