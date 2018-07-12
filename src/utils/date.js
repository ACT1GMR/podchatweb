import moment from "moment";
import PersianDate from "persian-date";

function getMomentDate(date) {
  return moment(date)
}

const date =
  {
    isToday(date) {
      const momentDate = getMomentDate(date);
      const today = getMomentDate().startOf("day");
      return momentDate.isSame(today, "d");
    },
    isYesterday(date) {
      const yesterday = getMomentDate().subtract(1, "days").startOf("day");
      return getMomentDate(date).isSame(yesterday, "d");
    },
    isWithinAWeek(date) {
      const A_WEEK_OLD = getMomentDate().subtract(7, "days").startOf("day");
      return getMomentDate(date).isAfter(A_WEEK_OLD);
    },
    isTwoWeeksOrMore(date) {
      return getMomentDate(date).isAfter(A_WEEK_OLD);
    },
    format(date, format, locale){
      if(locale === "en"){
        return getMomentDate(date).format(format);
      } else {
        PersianDate.toLocale("fa");
        return new PersianDate(date).format(format);
      }
    }
  };
export default date;