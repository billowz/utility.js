import * as _ from '../util'

describe("util", () => {
    it("is", () => {
      expect(_.isDefine(null)).to.equal(true)
      expect(_.isDefine(undefined)).to.equal(false)

      expect(_.isNull(null)).to.equal(true)
      expect(_.isNull(undefined)).to.equal(false)


      expect(_.isNil(null)).to.equal(true)
      expect(_.isNil(undefined)).to.equal(true)
      expect(_.isNil(0)).to.equal(false)

      expect(_.isFunc(() => {})).to.equal(true)

      expect(_.isNumber(0)).to.equal(true)
      expect(_.isNumber(NaN)).to.equal(true)
      expect(_.isNumber('0')).to.equal(false)

      expect(_.isBool(true)).to.equal(true)
      expect(_.isBool('')).to.equal(false)

      expect(_.isDate(new Date())).to.equal(true)

      expect(_.isString('')).to.equal(true)

      expect(_.isObject({})).to.equal(true)
      expect(_.isObject(Object)).to.equal(false)

      expect(_.isRegExp(/^a/)).to.equal(true)

      expect(_.isArray([])).to.equal(true)

      expect(_.isArrayLike([])).to.equal(true)

      function arg() {
        expect(_.isArray(arguments)).to.equal(false)
        expect(_.isArrayLike(arguments)).to.equal(true)
      }
      arg()
    })
    it('array', () => {
      var t = []
      _.each([1, 2, 3], (val) => {
        t.push(val)
      })
      expect(t).to.eql([1, 2, 3])
      expect(_.map([1, 2, 3], (val) => val + 1)).to.eql([2, 3, 4])
    })

    it('object', () => {
      expect(_.hasOwnProp({
        a: 1
      }, 'a')).to.equal(true)
      expect(_.hasOwnProp({
        a: 1
      }, 'toString')).to.equal(false)
    })
    it('string', () => {

    })
    it('class', () => {
      let root = _.dynamicClass({
          constructor(val) {
            this.val = val
          },
          value() {
            return this.val
          }
        }),
        parent = _.dynamicClass({
          extend: root,
          constructor(val, val2) {
            this.super([val])
            this.val2 = v2
            expect(this.superclass()).to.equal(root)
          },
          value() {
            expect(this.super()).to.equal(this.val)
            return this.val2
          }
        }),
        child = _.dynamicClass({
          extend: parent,
        }),
        class4 = _.dynamicClass({
          statics: {
            a: 1
          }
        })

      expect(_.isExtendOf(parent, Object)).to.equal(true)
      expect(_.isExtendOf(parent, root)).to.equal(true)
      expect(_.isExtendOf(child, parent)).to.equal(true)
      expect(_.isExtendOf(child, root)).to.equal(true)
      expect(_.isExtendOf(child, class4)).to.equal(false)
      expect(class4.a).to.equal(1)
    })
  })
  /*each: each,
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
  dynamicClass: dynamicClass*/
