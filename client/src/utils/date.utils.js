import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localeData from 'dayjs/plugin/localeData';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localeData);
dayjs.locale('en');

// Set the timezone to WIB (UTC+7)
dayjs.tz.setDefault('Asia/Jakarta');

export function formatDate(unixTimestamp) {
  return dayjs.unix(unixTimestamp).tz('Asia/Jakarta').format('D MMMM YYYY HH:mm:ss');
}
