/*
 * utility.js v0.0.11 built in Thu, 11 Aug 2016 10:21:07 GMT
 * Copyright (c) 2016 Tao Zeng <tao.zeng.zt@gmail.com>
 * Released under the MIT license
 * support IE6+ and other browsers
 *https://github.com/tao-zeng/utility.js
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('utility', factory) :
  (global.utility = factory());
}(this, function () {

  var lastTime = void 0;

  function request(callback) {
    var currTime = new Date().getTime(),
        timeToCall = Math.max(0, 16 - (currTime - lastTime)),
        reqId = setTimeout(function () {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return reqId;
  }

  function cancel(reqId) {
    clearTimeout(reqId);
  }

  var timeoutframe = {
    request: request,
    cancel: cancel
  };

  window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || timeoutframe.request;

  window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || timeoutframe.cancel;

  function fixProto(Type, prop, val) {
    if (!Type.prototype[prop]) Type.prototype[prop] = val;
  }

  fixProto(Function, 'bind', function bind(scope) {
    var fn = this,
        args = Array.prototype.slice.call(arguments, 1);
    return function () {
      return fn.apply(scope, args.concat(Array.prototype.slice.call(arguments)));
    };
  });

  if (!Object.freeze) Object.freeze = function freeze(obj) {
    return obj;
  };

  var toStr = Object.prototype.toString;
  var hasOwn = Object.prototype.hasOwnProperty;

  function overrideHasOwnProlicy(fn) {
    if (isFunc(fn)) hasOwn = fn;
  }

  function hasOwnProlicy() {
    return hasOwn;
  }

  function hasOwnProp(obj, prop) {
    return hasOwn.call(obj, prop);
  }

  // ==============================================
  // type utils
  // ==============================================
  var argsType = '[object Arguments]';
  var arrayType = '[object Array]';
  var funcType = '[object Function]';
  var boolType = '[object Boolean]';
  var numberType = '[object Number]';
  var dateType = '[object Date]';
  var stringType = '[object String]';
  var objectType = '[object Object]';
  var regexpType = '[object RegExp]';
  var nodeListType = '[object NodeList]';
  function isDefine(obj) {
    return obj !== undefined;
  }

  function isNull(obj) {
    return obj === null;
  }

  function isNil(obj) {
    return obj === undefined || obj === null;
  }

  function isArray(obj) {
    return toStr.call(obj) === arrayType;
  }

  function isFunc(obj) {
    return toStr.call(obj) === funcType;
  }

  function isNumber(obj) {
    return toStr.call(obj) === numberType;
  }

  function isBool(obj) {
    return toStr.call(obj) === boolType;
  }

  function isDate(obj) {
    return toStr.call(obj) === dateType;
  }

  function isString(obj) {
    return toStr.call(obj) === stringType;
  }

  function isObject(obj) {
    return toStr.call(obj) === objectType;
  }

  function isRegExp(obj) {
    return toStr.call(obj) === regexpType;
  }

  function isArrayLike(obj) {
    var type = toStr.call(obj);
    switch (type) {
      case argsType:
      case arrayType:
      case stringType:
      case nodeListType:
        return true;
      default:
        if (obj) {
          var length = obj.length;
          return isNumber(length) && (length ? length > 0 && length - 1 in obj : length === 0);
        }
        return false;
    }
  }

  // ==============================================
  // array utils
  // ==============================================
  function _eachObj(obj, callback, scope, own) {
    var key = void 0,
        isOwn = void 0;

    scope = scope || obj;
    for (key in obj) {
      isOwn = hasOwnProp(obj, key);
      if (own === false || isOwn) {
        if (callback.call(scope, obj[key], key, obj, isOwn) === false) return false;
      }
    }
    return true;
  }

  function _eachArray(obj, callback, scope) {
    var i = 0,
        j = obj.length;

    scope = scope || obj;
    for (; i < j; i++) {
      if (callback.call(scope, obj[i], i, obj, true) === false) return false;
    }
    return true;
  }

  function each(obj, callback, scope, own) {
    if (isArrayLike(obj)) {
      return _eachArray(obj, callback, scope);
    } else if (!isNil(obj)) {
      return _eachObj(obj, callback, scope, own);
    }
    return true;
  }

  function map(obj, callback, scope, own) {
    var ret = void 0;

    function cb(val, key) {
      ret[key] = callback.apply(this, arguments);
    }

    if (isArrayLike(obj)) {
      ret = [];
      _eachArray(obj, cb, scope);
    } else {
      ret = {};
      if (!isNil(obj)) _eachObj(obj, cb, scope, own);
    }
    return ret;
  }

  function filter(obj, callback, scope, own) {
    var ret = void 0;

    if (isArrayLike(obj)) {
      ret = [];
      _eachArray(obj, function (val) {
        if (callback.apply(this, arguments)) ret.push(val);
      }, scope);
    } else {
      ret = {};
      if (!isNil(obj)) _eachObj(obj, function (val, key) {
        if (callback.apply(this, arguments)) ret[key] = val;
      }, scope, own);
    }
    return ret;
  }

  function aggregate(obj, callback, defVal, scope, own) {
    var rs = defVal;

    each(obj, function (val, key, obj, isOwn) {
      rs = callback.call(this, rs, val, key, obj, isOwn);
    }, scope, own);
    return rs;
  }

  function keys(obj, filter, scope, own) {
    var keys = [];

    each(obj, function (val, key) {
      if (!filter || filter.apply(this, arguments)) keys.push(key);
    }, scope, own);
    return keys;
  }

  function _indexOfArray(array, val) {
    var i = 0,
        l = array.length;

    for (; i < l; i++) {
      if (array[i] === val) return i;
    }
    return -1;
  }

  function _lastIndexOfArray(array, val) {
    var i = array.length;

    while (i-- > 0) {
      if (array[i] === val) return i;
    }
  }

  function _indexOfObj(obj, val, own) {
    for (key in obj) {
      if (own === false || hasOwnProp(obj, key)) {
        if (obj[key] === val) return key;
      }
    }
    return undefined;
  }

  function indexOf(obj, val, own) {
    if (isArrayLike(obj)) {
      return _indexOfArray(obj, val);
    } else {
      return _indexOfObj(obj, val, own);
    }
  }

  function lastIndexOf(obj, val, own) {
    if (isArrayLike(obj)) {
      return _lastIndexOfArray(obj, val);
    } else {
      return _indexOfObj(obj, val, own);
    }
  }

  function convert(obj, keyGen, valGen, scope, own) {
    var o = {};

    each(obj, function (val, key) {
      o[keyGen ? keyGen.apply(this, arguments) : key] = valGen ? valGen.apply(this, arguments) : val;
    }, scope, own);
    return o;
  }

  function reverseConvert(obj, valGen, scope, own) {
    var o = {};

    each(obj, function (val, key) {
      o[val] = valGen ? valGen.apply(this, arguments) : key;
    }, scope, own);
    return o;
  }

  // ==============================================
  // string utils
  // ==============================================
  var regFirstChar = /^[a-z]/;
  var regLeftTrim = /^\s+/;
  var regRightTrim = /\s+$/;
  var regTrim = /(^\s+)|(\s+$)/g;
  function _uppercase(k) {
    return k.toUpperCase();
  }

  function upperFirst(str) {
    return str.replace(regFirstChar, _uppercase);
  }

  function ltrim(str) {
    return str.replace(regLeftTrim, '');
  }

  function rtrim(str) {
    return str.replace(regRightTrim, '');
  }

  function trim(str) {
    return str.replace(regTrim, '');
  }

  var regFormat = /%%|%(\d+\$)?([-+#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuidfegpEGP])/g;

  function pad(str, len, chr, leftJustify) {
    var padding = str.length >= len ? '' : Array(1 + len - str.length >>> 0).join(chr);

    return leftJustify ? str + padding : padding + str;
  }

  function justify(value, prefix, leftJustify, minWidth, zeroPad) {
    var diff = minWidth - value.length;

    if (diff > 0) return leftJustify || !zeroPad ? pad(value, minWidth, ' ', leftJustify) : value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
    return value;
  }

  function format(str) {
    return _format(str, Array.prototype.slice.call(arguments, 1)).format;
  }

  function _format(str, args) {
    var i = 0;
    str = str.replace(regFormat, function (substring, valueIndex, flags, minWidth, _, precision, type) {
      if (substring == '%%') return '%';

      var leftJustify = false,
          positivePrefix = '',
          zeroPad = false,
          prefixBaseX = false;

      if (flags) each(flags, function (c) {
        switch (c) {
          case ' ':
            positivePrefix = ' ';
            break;
          case '+':
            positivePrefix = '+';
            break;
          case '-':
            leftJustify = true;
            break;
          case '0':
            zeroPad = true;
            break;
          case '#':
            prefixBaseX = true;
            break;
        }
      });

      if (!minWidth) {
        minWidth = 0;
      } else if (minWidth == '*') {
        minWidth = +args[i++];
      } else if (minWidth.charAt(0) == '*') {
        minWidth = +args[minWidth.slice(1, -1)];
      } else {
        minWidth = +minWidth;
      }

      if (minWidth < 0) {
        minWidth = -minWidth;
        leftJustify = true;
      }

      if (!isFinite(minWidth)) throw new Error('sprintf: (minimum-)width must be finite');

      if (precision && precision.charAt(0) == '*') {
        precision = +args[precision == '*' ? i++ : precision.slice(1, -1)];
        if (precision < 0) precision = null;
      }

      if (precision == null) {
        precision = 'fFeE'.indexOf(type) > -1 ? 6 : type == 'd' ? 0 : void 0;
      } else {
        precision = +precision;
      }

      var value = valueIndex ? args[valueIndex.slice(0, -1)] : args[i++],
          prefix = void 0,
          base = void 0;

      switch (type) {
        case 'c':
          value = String.fromCharCode(+value);
        case 's':
          {
            value = String(value);
            if (precision != null) value = value.slice(0, precision);
            prefix = '';
            break;
          }
        case 'b':
          base = 2;
          break;
        case 'o':
          base = 8;
          break;
        case 'u':
          base = 10;
          break;
        case 'x':
        case 'X':
          base = 16;
          break;
        case 'i':
        case 'd':
          {
            var _number = parseInt(+value);
            if (isNaN(_number)) return '';
            prefix = _number < 0 ? '-' : positivePrefix;
            value = prefix + pad(String(Math.abs(_number)), precision, '0', false);
            break;
          }
        case 'e':
        case 'E':
        case 'f':
        case 'F':
        case 'g':
        case 'G':
        case 'p':
        case 'P':
          {
            var _number2 = +value;
            if (isNaN(_number2)) return '';
            prefix = _number2 < 0 ? '-' : positivePrefix;
            var method = void 0;
            if ('p' != type.toLowerCase()) {
              method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
            } else {
              // Count significant-figures, taking special-care of zeroes ('0' vs '0.00' etc.)
              var sf = String(value).replace(/[eE].*|[^\d]/g, '');
              sf = (_number2 ? sf.replace(/^0+/, '') : sf).length;
              precision = precision ? Math.min(precision, sf) : precision;
              method = !precision || precision <= sf ? 'toPrecision' : 'toExponential';
            }
            var number_str = Math.abs(_number2)[method](precision);
            // number_str = thousandSeparation ? thousand_separate(number_str): number_str
            value = prefix + number_str;
            break;
          }
        case 'n':
          return '';
        default:
          return substring;
      }

      if (base) {
        var number = value >>> 0;
        prefix = prefixBaseX && base != 10 && number && ['0b', '0', '0x'][base >> 3] || '';
        value = prefix + pad(number.toString(base), precision || 0, '0', false);
      }
      var justified = justify(value, prefix, leftJustify, minWidth, zeroPad);
      return 'EFGPX'.indexOf(type) > -1 ? justified.toUpperCase() : justified;
    });
    return {
      format: str,
      formatArgCount: i
    };
  }

  // ==============================================
  // object utils
  // ==============================================
  var exprCache = {};
  var regPropertyName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;
  var regEscapeChar = /\\(\\)?/g;
  function parseExpr(expr, autoCache) {
    if (isArray(expr)) {
      return expr;
    } else if (isString(expr)) {
      var _ret = function () {
        var rs = exprCache[expr];

        if (rs) return {
            v: rs
          };
        rs = autoCache ? exprCache[expr] = [] : [];
        expr.replace(regPropertyName, function (match, number, quote, string) {
          rs.push(quote ? string.replace(regEscapeChar, '$1') : number || match);
        });
        return {
          v: rs
        };
      }();

      if (typeof _ret === "object") return _ret.v;
    } else {
      return [];
    }
  }

  function get(obj, expr, defVal, lastOwn, own) {
    var i = 0,
        path = parseExpr(expr, true),
        l = path.length - 1,
        prop = void 0;

    while (!isNil(obj) && i < l) {
      prop = path[i++];
      if (own && !hasOwnProp(obj, prop)) return defVal;
      obj = obj[prop];
    }
    prop = path[i];
    return i == l && !isNil(obj) && (own ? hasOwnProp(obj, prop) : prop in obj) ? obj[prop] : defVal;
  }

  function has(obj, expr, lastOwn, own) {
    var i = 0,
        path = parseExpr(expr, true),
        l = path.length - 1,
        prop = void 0;

    while (!isNil(obj) && i < l) {
      prop = path[i++];
      if (own && !hasOwnProp(obj, prop)) return false;
      obj = obj[prop];
    }
    prop = path[i];
    return i == l && !isNil(obj) && (own ? hasOwnProp(obj, prop) : prop in obj);
  }

  function set(obj, expr, value) {
    var i = 0,
        path = parseExpr(expr, true),
        l = path.length - 1,
        prop = path[0],
        _obj = obj;

    for (; i < l; i++) {
      if (isNil(_obj[prop])) {
        _obj = _obj[prop] = {};
      } else {
        _obj = _obj[prop];
      }
      prop = path[i + 1];
    }
    _obj[prop] = value;
    return obj;
  }

  function getOwnProp(obj, key) {
    return hasOwnProp(obj, key) ? obj[key] : undefined;
  }

  var prototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(obj) {
    return obj.__proto__;
  };

  var setPrototypeOf = Object.setPrototypeOf || function setPrototypeOf(obj, proto) {
    obj.__proto__ = proto;
  };

  var assign = Object.assign || function assign(target) {
    var source = void 0,
        key = void 0,
        i = 1,
        l = arguments.length;

    for (; i < l; i++) {
      source = arguments[i];
      for (key in source) {
        if (hasOwnProp(source, key)) target[key] = source[key];
      }
    }
    return target;
  };

  function assignIf(target) {
    var source = void 0,
        key = void 0,
        i = 1,
        l = arguments.length;

    for (; i < l; i++) {
      source = arguments[i];
      for (key in source) {
        if (hasOwnProp(source, key) && !hasOwnProp(target, key)) target[key] = source[key];
      }
    }
    return target;
  }

  function emptyFunc() {}

  var create = Object.create || function (parent, props) {
    emptyFunc.prototype = parent;
    var obj = new emptyFunc();
    emptyFunc.prototype = undefined;
    if (props) each(props, function (prop, name) {
      obj[name] = prop.value;
    });
    return obj;
  };

  function isExtendOf(cls, parent) {
    if (!isFunc(cls)) return cls instanceof parent;

    var proto = cls;

    while ((proto = prototypeOf(proto)) && proto !== Object) {
      if (proto === parent) return true;
    }
    return parent === Object;
  }

  // ==============================================
  // dynamicClass
  // ==============================================
  var Base = function () {};
  assign(Base.prototype, {
    'super': function (args) {
      var method = arguments.callee.caller;
      method.$owner.superclass[method.$name].apply(this, args);
    },
    superclass: function () {
      var method = arguments.callee.caller;
      return method.$owner.superclass;
    }
  });
  assign(Base, {
    extend: function (overrides) {
      var _this = this;

      if (overrides) {
        (function () {
          var proto = _this.prototype;
          each(overrides, function (member, name) {
            if (isFunc(member)) {
              member.$owner = _this;
              member.$name = name;
            }
            proto[name] = member;
          });
          _this.assign(overrides.statics);
        })();
      }
      return this;
    },
    assign: function (statics) {
      if (statics) assign(this, statics);
      return this;
    }
  });

  function dynamicClass(overrides) {
    var cls = function DynamicClass() {
      this.constructor.apply(this, arguments);
    },
        superclass = overrides.extend,
        superproto = void 0,
        proto = void 0;

    assign(cls, Base);

    if (!isFunc(superclass) || superclass === Object) superclass = Base;

    superproto = superclass.prototype;

    proto = create(superproto);

    cls.superclass = superproto;
    cls.prototype = proto;
    setPrototypeOf(cls, superclass);

    delete overrides.extend;
    return cls.extend(overrides);
  }

var _ = Object.freeze({
    overrideHasOwnProlicy: overrideHasOwnProlicy,
    hasOwnProlicy: hasOwnProlicy,
    hasOwnProp: hasOwnProp,
    isDefine: isDefine,
    isNull: isNull,
    isNil: isNil,
    isArray: isArray,
    isFunc: isFunc,
    isNumber: isNumber,
    isBool: isBool,
    isDate: isDate,
    isString: isString,
    isObject: isObject,
    isRegExp: isRegExp,
    isArrayLike: isArrayLike,
    each: each,
    map: map,
    filter: filter,
    aggregate: aggregate,
    keys: keys,
    indexOf: indexOf,
    lastIndexOf: lastIndexOf,
    convert: convert,
    reverseConvert: reverseConvert,
    upperFirst: upperFirst,
    ltrim: ltrim,
    rtrim: rtrim,
    trim: trim,
    format: format,
    _format: _format,
    parseExpr: parseExpr,
    get: get,
    has: has,
    set: set,
    getOwnProp: getOwnProp,
    prototypeOf: prototypeOf,
    setPrototypeOf: setPrototypeOf,
    assign: assign,
    assignIf: assignIf,
    emptyFunc: emptyFunc,
    create: create,
    isExtendOf: isExtendOf,
    dynamicClass: dynamicClass
  });

  var Configuration = dynamicClass({
    constructor: function (def) {
      this.cfg = def || {};
    },
    register: function (name, defVal) {
      var _this = this;

      if (arguments.length == 1) {
        each(name, function (val, name) {
          _this.cfg[name] = val;
        });
      } else {
        this.cfg[name] = defVal;
      }
      return this;
    },
    config: function (cfg) {
      var _this2 = this;

      if (cfg) each(this.cfg, function (val, key) {
        if (hasOwnProp(cfg, key)) _this2.cfg[key] = cfg[key];
      });
      return this;
    },
    get: function (name) {
      return arguments.length ? this.cfg[name] : create(this.cfg);
    }
  });

  var logLevels = ['debug', 'info', 'warn', 'error'];
  var tmpEl = document.createElement('div');
  var slice = Array.prototype.slice;
  var SimulationConsole = dynamicClass({
    constructor: function () {
      tmpEl.innerHTML = '<div id="simulation_console"\n    style="position:absolute; top:0; right:0; font-family:courier,monospace; background:#eee; font-size:10px; padding:10px; width:200px; height:200px;">\n  <a style="float:right; padding-left:1em; padding-bottom:.5em; text-align:right;">Clear</a>\n  <div id="simulation_console_body"></div>\n</div>';
      this.el = tmpEl.childNodes[0];
      this.clearEl = this.el.childNodes[0];
      this.bodyEl = this.el.childNodes[1];
    },
    appendTo: function (el) {
      el.appendChild(this.el);
    },
    log: function (style, msg) {
      tmpEl.innerHTML = '<span style="' + style + '">' + msg + '</span>';
      this.bodyEl.appendChild(tmpEl.childNodes[0]);
    },
    parseMsg: function (args) {
      var msg = args[0];
      if (isString(msg)) {
        var f = _format.apply(null, args);
        return [f.format].concat(slice.call(args, f.formatArgCount)).join(' ');
      }
      return args.join(' ');
    },
    debug: function () {
      this.log('color: red;', this.parseMsg(arguments));
    },
    info: function () {
      this.log('color: red;', this.parseMsg(arguments));
    },
    warn: function () {
      this.log('color: red;', this.parseMsg(arguments));
    },
    error: function () {
      this.log('color: red;', this.parseMsg(arguments));
    },
    clear: function () {
      this.bodyEl.innerHTML = '';
    }
  });
  var console = window.console;
  if (console && !console.debug) console.debug = function () {
    Function.apply.call(console.log, console, arguments);
  };

  var Logger = dynamicClass({
    statics: {
      enableSimulationConsole: function () {
        if (!console) {
          console = new SimulationConsole();
          console.appendTo(document.body);
        }
      }
    },
    constructor: function (_module, level) {
      this.module = _module;
      this.level = indexOf(logLevels, level || 'info');
    },
    setLevel: function (level) {
      this.level = indexOf(logLevels, level || 'info');
    },
    getLevel: function () {
      return logLevels[this.level];
    },
    _print: function (level, args, trace) {
      Function.apply.call(console[level], console, args);
      if (trace && console.trace) console.trace();
    },
    _log: function (level, args, trace) {
      if (level < this.level || !console) return;
      var msg = '[%s] %s -' + (isString(args[0]) ? ' ' + args.shift() : ''),
          errors = [];
      args = filter(args, function (arg) {
        if (arg instanceof Error) {
          errors.push(arg);
          return false;
        }
        return true;
      });
      each(errors, function (err) {
        args.push.call(args, err.message, '\n', err.stack);
      });
      level = logLevels[level];
      this._print(level, [msg, level, this.module].concat(args), trace);
    },
    debug: function () {
      this._log(0, slice.call(arguments, 0));
    },
    info: function () {
      this._log(1, slice.call(arguments, 0));
    },
    warn: function () {
      this._log(2, slice.call(arguments, 0));
    },
    error: function () {
      this._log(3, slice.call(arguments, 0));
    }
  });

  Logger.logger = new Logger('default', 'info');

  var index = assignIf({
    timeoutframe: timeoutframe,
    Configuration: Configuration,
    Logger: Logger
  }, _);

  return index;

}));
//# sourceMappingURL=utility.js.map