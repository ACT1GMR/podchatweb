import moment from 'moment';

function getMomentDate(date) {
  return moment(date)
}

const date =
  {
    isToday(date) {
      let momentDate = getMomentDate(date);
      let today = getMomentDate().startOf('day');
      return momentDate.isSame(today, 'd');
    },
    isYesterday(date) {
      return getMomentDate(date).isSame(YESTERDAY, 'd');
    },
    isWithinAWeek(date) {
      return getMomentDate(date).isAfter(A_WEEK_OLD);
    },
    isTwoWeeksOrMore(date) {
      return getMomentDate(date).isAfter(A_WEEK_OLD);
    }
  };
export default date;