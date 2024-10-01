import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';

dayjs.extend(customParseFormat);
dayjs.extend(localeData);
dayjs.locale('en');

export function formatDate(unixTimestamp) {
  return dayjs.unix(unixTimestamp).format('D MMMM YYYY');
}
