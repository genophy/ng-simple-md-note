/**
 *
 */

export class DateUtil {

  /**
   *
   * @param {string} dateStr
   * @returns {Date}
   */
  static dateStrToDate(dateStr: string): Date {
    // return new Date(dateStr.replace(/(\.|\-)/g, '/'));
    if (dateStr) {
      if (/^\d+(-|\/)\d+$/.test(dateStr)) {
        dateStr += '-01';
      }
      return new Date(dateStr.replace(/(\.|\-)/g, '/'));
    }
    return undefined;
  }

  /**
   *
   * @param {string|Date} dateStr yyyy/MM/dd HH:mm:ss
   * @param {String} sFormat
   * @returns {string}
   */
  static dateStrObjFormat(dateStr: any, sFormat: string = 'yyyy-MM-dd HH:mm:ss'): string {
    if (dateStr) {
      if ('string' === typeof dateStr) {
        return this.dateFormat(this.dateStrToDate(dateStr), sFormat);
      } else if (dateStr.getDate()) {
        return this.dateFormat(dateStr, sFormat);
      }
    }
    return '';
  }

  /**

   * @param date
   * @param sFormat  yyyy-MM-dd HH:mm:ss
   * @example  dateFormat(new Date())                                "2017-02-28"
   * @example  dateFormat(new Date(),'yyyy-MM-dd')                   "2017-02-28"
   * @example  dateFormat(new Date(),'yyyy-MM-dd HH:mm:ss')         "2017-02-28 09:24:00"
   * @example  dateFormat(new Date(),'hh:mm')                       "09:24"
   * @example  dateFormat(new Date(),'yyyy-MM-ddThh:mm:ss+08:00')   "2017-02-28T09:24:00+08:00"
   * @returns {string}
   */
  static dateFormat(date: Date, sFormat: string = 'yyyy-MM-dd HH:mm:ss'): string {
    if (!date || (date && !date.getDate())) {
      return '';
    }
    const time = {
      Year       : 0,
      TYear      : '0',
      Month      : 0,
      TMonth     : '0',
      Day        : 0,
      TDay       : '0',
      Hour       : 0,
      THour      : '0',
      hour       : 0,
      Thour      : '0',
      Minute     : 0,
      TMinute    : '0',
      Second     : 0,
      TSecond    : '0',
      Millisecond: 0,
    };
    time.Year = date.getFullYear();
    time.TYear = String(time.Year).substr(2);
    time.Month = date.getMonth() + 1;
    time.TMonth = time.Month < 10 ? '0' + time.Month : String(time.Month);
    time.Day = date.getDate();
    time.TDay = time.Day < 10 ? '0' + time.Day : String(time.Day);
    time.Hour = date.getHours();
    time.THour = time.Hour < 10 ? '0' + time.Hour : String(time.Hour);
    time.hour = time.Hour < 13 ? time.Hour : time.Hour - 12;
    time.Thour = time.hour < 10 ? '0' + time.hour : String(time.hour);
    time.Minute = date.getMinutes();
    time.TMinute = time.Minute < 10 ? '0' + time.Minute : String(time.Minute);
    time.Second = date.getSeconds();
    time.TSecond = time.Second < 10 ? '0' + time.Second : String(time.Second);
    time.Millisecond = date.getMilliseconds();

    return sFormat.replace(/yyyy/ig, String(time.Year))
    .replace(/yyy/ig, String(time.Year))
    .replace(/yy/ig, time.TYear)
    .replace(/y/ig, time.TYear)
    .replace(/MM/g, time.TMonth)
    .replace(/M/g, String(time.Month))
    .replace(/dd/ig, time.TDay)
    .replace(/d/ig, String(time.Day))
    .replace(/HH/g, time.THour)
    .replace(/H/g, String(time.Hour))
    .replace(/hh/g, time.Thour)
    .replace(/h/g, String(time.hour))
    .replace(/mm/g, time.TMinute)
    .replace(/m/g, String(time.Minute))
    .replace(/ss/ig, time.TSecond)
    .replace(/s/ig, String(time.Second))
    .replace(/fff/ig, String(time.Millisecond));
  }

  /**
   * @param {Date} date1
   * @param {Date} date2
   * @param {string} formatStr
   * @returns {number} date2.time - date1.time (毫秒相减)
   */
  static compareDate(date1: Date, date2: Date, formatStr: string = 'yyyy-MM-dd HH:mm:ss') {
    if (!/yyyy/.test(formatStr)) {
      date1.setFullYear(2008);
      date2.setFullYear(2008);
    }
    if (!/MM/.test(formatStr)) {
      date1.setMonth(0);
      date2.setMonth(0);
    }
    if (!/dd/.test(formatStr)) {
      date1.setDate(1);
      date2.setDate(1);
    }
    if (!/HH/.test(formatStr)) {
      date1.setHours(0);
      date2.setHours(0);
    }
    if (!/mm/.test(formatStr)) {
      date1.setMinutes(0);
      date2.setMinutes(0);
    }
    if (!/ss/.test(formatStr)) {
      date1.setSeconds(0);
      date2.setSeconds(0);
    }

    const res = date2.getTime() - date1.getTime();
    if (Math.abs(res) < 1000) {
      return 0;
    }
    return date2.getTime() - date1.getTime();
  }

}
