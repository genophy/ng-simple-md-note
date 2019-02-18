const hostNames = location.hostname.match(/[^.]*.com$/) || [];
const ROOT_DOMAIN = hostNames[0] || location.hostname;

export class CookieUtil {

  // 配置
  public static config = {
    defaults: {},
  };
  private static pluses = /\\+/g;

  /**
   * @param key
   * @param value
   * @param options
   */
  public static cookie(key, value?, options?) {

    if (value !== undefined && !this.isFunction(value)) {
      options = Object.assign({}, this.config.defaults, options);
      // const docCookieStr =
      (document.cookie = [
        this.encode(key), '=', this.stringifyCookieValue(value),
        options['max-age'] ? '; max-age=' + options['max-age'] : '; max-age=72000', // use max-age , but is not supported by IE ，默认10小时
        options.path ? '; path=' + options.path : '; path=/',
        options.domain ? '; domain=' + options.domain : `; domain=${ROOT_DOMAIN}`,
        options.secure ? '; secure' : '',
      ].join(''));
      return '';
    }

    // Read

    let result = key ? undefined : '';

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all. Also prevents odd result when
    // calling CookieUtils.cookie().
    const cookies = document.cookie ? document.cookie.split('; ') : [];

    for (let i = 0, l = cookies.length; i < l; i++) {
      const parts = cookies[i].split('=');
      const name = this.decode(parts.shift());
      const cookie = parts.join('=');

      if (key && key === name) {
        // If second argument (value) is a function it's a converter...
        result = this.read(cookie, value);
        result = 'null' === result ? null : result;
        break;
      }
    }

    return result;

  }

  /**
   *
   */
  public static cookies() {
    const result = {};

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all. Also prevents odd result when
    // calling CookieUtils.cookie().
    const cookies = document.cookie ? document.cookie.split('; ') : [];

    for (let i = 0, l = cookies.length; i < l; i++) {
      const parts = cookies[i].split('=');
      const name = this.decode(parts.shift());
      let cookie = parts.join('=');
      if ((cookie = this.read(cookie)) !== undefined) {
        result[name] = cookie;
      }
    }

    return result;
  }

  public static removeCookie(key, options) {
    if (this.cookie(key) === undefined) {
      return false;
    }

    // Must not alter options, thus extending a fresh object...
    this.cookie(key, '', Object.assign({}, options, {'max-age': 0}));
    return !this.cookie(key);
  }

  /**
   *
   * @param fn
   */
  private static isFunction(fn: any) {
    return 'function' === typeof fn;

  }

  private static encode(s) {
    return this.config['raw'] ? s : encodeURIComponent(s);
  }

  private static decode(s) {
    return this.config['raw'] ? s : decodeURIComponent(s);
  }

  private static stringifyCookieValue(value) {
    return this.encode(this.config['json'] ? JSON.stringify(value) : String(value));
  }

  private static parseCookieValue(s) {
    if (s.indexOf('"') === 0) {
      // This is a quoted cookie as according to RFC2068, unescape...
      s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }

    try {
      // Replace server-side written pluses with spaces.
      // If we can't decode the cookie, ignore it, it's unusable.
      // If we can't parse the cookie, ignore it, it's unusable.
      s = decodeURIComponent(s.replace(this.pluses, ' '));
      return this.config['json'] ? JSON.parse(s) : s;
    } catch (e) {
    }
  }

  private static read(s, converter?) {
    const value = this.config['raw'] ? s : this.parseCookieValue(s);
    return this.isFunction(converter) ? converter(value) : value;
  }

}
