import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import 'dayjs/locale/nb';

dayjs.extend(isoWeek);
dayjs.extend(dayOfYear);
dayjs.locale('nb');

export default dayjs;
