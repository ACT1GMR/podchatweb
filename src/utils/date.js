import moment from "moment";
import PersianDate from "persian-date";
import strings from "../constants/localization";

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
    format(date, format, locale) {
      if (locale === "en") {
        return getMomentDate(date).format(format);
      } else {
        PersianDate.toLocale("fa");
        return new PersianDate(date).format(format);
      }
    },
    prettifySince(date) {
      const seconds = Math.floor(date / 1000);
      let interval = Math.floor(seconds / 31536000);
      if (interval > 1) {
        return `${interval} ${strings.years}`;
      }
      interval = Math.floor(seconds / 2592000);
      if (interval > 1) {
        return `${interval} ${strings.months}`;
      }
      interval = Math.floor(seconds / 86400);
      if (interval > 1) {
        return `${interval} ${strings.days}`;
      }
      interval = Math.floor(seconds / 3600);
      if (interval > 1) {
        return `${interval} ${strings.hours}`;
      }
      interval = Math.floor(seconds / 60);
      if (interval > 1) {
        return `${interval} ${strings.minutes}`;
      }
      if(interval > 1){
        return `${interval} ${strings.seconds}`;
      }
      return strings.recently;
    }
  };
export default date;