import {Constants}  from './constants';
import {CookieUtil} from './cookie-util';

export class Utils {

  static cookie = {
    set   : (name, value) => {
      const Days = 30;
      const exp = new Date();
      exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
      document.cookie = name + '=' + escape(value) + ';expires=' + exp.toISOString();
    },
    get   : (name) => {
      let arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
      if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
      } else {
        return null;
      }
    }
    ,
    delete: (name) => {
      const exp = new Date();
      exp.setTime(exp.getTime() - 1);
      const cVal = Utils.cookie.get(name);
      if (cVal != null) {
        document.cookie = name + '=' + cVal + ';expires=' + exp.toISOString();
      }

    },
  };

  /**
   * 反转路由地址，到根菜单,菜单对象
   *
   * @param {Array<any>} menuList 菜单列表
   * @param {string} routeUrl  路由地址
   * @returns {Promise<any>} {menuRoot:Menu,menu:Menu}
   */
  static reverseRouteUrl(menuList: Array<any>, routeUrl: string) {
    return new Promise(resolve => {
      // 若menuList是Array对象
      if (menuList && menuList instanceof Array) {
        menuList.every((menuRoot) => {
          const children = menuRoot['menuList'];
          // 若children是Array对象
          if (children && children instanceof Array) {
            return children.every((menu) => {
              //  若路由地址已经遍历到，则停止遍历，并且resolve
              if (routeUrl === menu['urlContent']) {
                resolve({menuRoot, menu});
                // 结束遍历
                return false;
              }
              // 继续遍历
              return true;
            });
          }
        });
      }
    });

  }

  /**
   * 将value(obj,string)中所有字符值，都进行trim操作
   * @param obj
   */
  static objTrimStr(value: object | string) {
    if ('string' === typeof value) {
      return value.trim();
    }
    const returnObj = {};
    for (const key in value) {
      if ('string' === typeof value[key]) {
        returnObj[key] = value[key].trim();
      } else {
        returnObj[key] = value[key];
      }
    }
    return returnObj;
  }

  /**
   * 拼接对象 （只要fromObj属性不为 undefined 和null就强行合并）
   * @param {object} toObj 被合并的对象
   * @param {object} fromObj 需要合并的对象
   * @returns {object}
   */
  static objConcat(toObj: object, ...fromObjs: object[]): any {
    const returnObj = Object.assign({}, toObj || {});
    if (fromObjs instanceof Array) {
      fromObjs.reverse().forEach(fromObj => {
        for (const key in fromObj) {
          // 当外来对象有值的时候，才合并
          if (Utils.valueAble(fromObj[key])) {
            returnObj[key] = fromObj[key];
          }
        }
      });
    }

    return returnObj;
  }

  /**
   * 合并对象,只从fromObj中拿toObj存在的属性,给toObj，并强行替换。若toObj中没有，则不进行合并
   * @param {object} toObj
   * @param {object} fromObj
   * @param {boolean} isExtend 是否扩展到fromObj
   * @returns {object}
   */
  static objMerge(toObj: object, fromObj: object, isExtend = false): any {
    const returnObj = toObj || {};
    for (const key in (isExtend ? fromObj : returnObj)) {
      // 当外来对象有值的时候，才合并
      // if (Utils.valueAble(fromObj[key])) {
      if (undefined !== fromObj[key]) {
        returnObj[key] = fromObj[key];
      }
    }
    return returnObj;
  }

  /**
   * 裁剪对象，发现对象的属性有null,'',[]等全部剔除
   * @param {object} obj
   */
  static objCut(obj: object, ...cutKeys: string[]): object {
    const returnObj = {};
    for (const key in obj) {
      if (Utils.valueAble(obj[key])) {
        // 若没有需要单独裁剪的key，则赋值
        if ((!cutKeys || !cutKeys.includes(key)) && '' !== obj[key] && [] !== obj[key]) {
          returnObj[key] = obj[key];
        }
      }
    }

    return returnObj;
  }

  /**
   * 移除对象属性,与 cut不同的是，obj不判断时候覅有值，都进行返回
   * @param {object} obj
   * @param {string} cutKeys
   * @returns {object}
   */
  static objRemoveKeys(obj: object, ...removeKeys: string[]): object {
    const returnObj = {};
    for (const key in obj) {
      // 若没有需要单独移除的key，则赋值
      if (!removeKeys || !removeKeys.includes(key)) {
        returnObj[key] = obj[key];
      }
    }

    return returnObj;
  }

  /**
   * 是否有值（不为undefined和null）
   * @param obj 对象
   * @returns {boolean}
   */
  static valueAble(obj: any) {
    return undefined !== obj && null !== obj && (obj instanceof Array ? obj.length > 0 : '' !== obj);
  }

  /**
   * 清空本机及会话存储
   */
  static clearAllStorage() {
    window.localStorage.clear();
    window.sessionStorage.clear();
    CookieUtil.cookie(Constants.COOKIE_USER_TOKEN, null);
  }

  /**
   * 填充成字符串前缀，不足位补充
   *
   * 如：
   *        numberPrefix(3,'000') ==> 003
   *        numberPrefix(32,'zzz') ==> z32
   *        numberPrefix(1234,'00') ==> 1234
   * @param {number} value
   * @param {string} formatStr 默认'0'
   * @returns {string}
   */
  static stringPrefix(value: string, formatStr?: string) {
    let prefix = '0';
    const res = '' + value;
    if (undefined !== value) {
      if (undefined !== formatStr) {
        prefix = formatStr;
      }
      if (prefix.length > res.length) {
        return prefix.slice(0, prefix.length - res.length) + res;
      }
    }
    return res;
  }

  /**
   * 数字小数点后几位填充填充(支持负数)
   * @param value
   * @param limit 几位小数
   * @param isForce 是否强制显示几位小数
   */
  static decimalFixZero(value: any, limit = 2, isForce = true) {
    if (undefined === value || null === value) {
      return '0.' + Array(limit + 1).join('0');
    }
    let res = '' + value;
    const pre = (res.match(/^-?\d*/) && res.match(/^-?\d*/)[0]) || '';
    const suf = (res.match(/\.\d*/) && res.match(/\.\d*/)[0].slice(0, limit + 2)) ? res.match(/\.\d*/)[0].slice(0, limit + 2) : '';

    if (isForce) {
      if (suf) {
        const tmpSufNum = Number('0' + suf);
        let tmpSufStr = '';
        if (tmpSufNum) {
          tmpSufStr = ('' + parseInt('' + (tmpSufNum * Math.pow(10, limit) + 0.5), 10) / Math.pow(10, limit));
          tmpSufStr = tmpSufStr.replace(/^0+/, '');
          res = '' + pre + tmpSufStr + Array(limit + 2 - tmpSufStr.length).join('0');
        }
      } else {
        res = pre + '.' + Array(limit + 1).join('0');
      }
    } else {
      res = pre + suf.slice(0, limit + 1);
    }
    return res;
  }

  /**
   *
   * @param id
   */
  static getImageUrl(id) {
    if (id) {
      return `${location.origin}/api/img/get?id=${id}`;
    }
    return '';
  }
}
