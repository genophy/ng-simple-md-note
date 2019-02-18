export class ApiUtil {

  /**
   * @param data
   * @returns {any}
   */
  static responseStatus(data): any {
    let res: any;

    switch (data['code']) {

      case 1:  // success
        res = {isSuccess: true, code: data['code'], msg: data['msg'], data: data['data']};
        break;

      case -1:
        res = {isSuccess: false, code: data['code'], msg: data['msg'], data: data};
        break;

      default:
        res = {isSuccess: false, code: data['code'], msg: data['msg'], data: data};
        break;
    }

    return res;

  }

  /**
   * @param {{}} params
   * @returns {any}
   */
  static convertUrlParamsToString(params: {} = {}) {
    const arr = [];
    for (const key in params) {
      if (key && undefined !== params[key] && '' !== params[key]) {
        arr.push(`${key}=${params[key]}`);
      }
    }
    return arr.join('&');
  }
}
