const isNil = (value) => value == null
const isBoolean = (value) => value === true || value === false
const isNumber = (value) => typeof value == 'number'
const isString = (value) => typeof value == 'string'
const isArray = (value) => value instanceof Array
const isObject = (value) => value instanceof Object
const isFunction = (value) => value instanceof Function

const constant = (v) => () => v

const flow = (...fns) => {
    const f = fns.pop()
    return f ? (v) => f(flow(...fns)(v)) : (v) => v
}

const thread_ = flow
const thread = (arg, ...fns) => flow(...fns)(arg)

const get_ = (path, defaultValue) =>
    flow((o) => o || defaultValue, ...path.map((k) => (o) => isNil(o) ? o : o[k]))

const get = (o, path, defaultValue) => get_(path, defaultValue)(o)

const set_ = (path, value) => (o) => {
    const setByKey = (o, [k, ...keys], value) => {
        if ((k && isObject(o)) || isArray(o)) {
            o[k] = setByKey(o[k] || {}, keys, value)
            return o
        } else return value
    }
    return setByKey(o, path, value)
}

const set = (o, path, value) => set_(path, value)(o)

const update_ =
    (path, fun, ...args) =>
    (o) =>
        flow(
            get_(path),
            (v) => fun(v, ...args),
            (v) => set_(path, v)(o)
        )(o)

const update = (o, path, fun, ...args) => update_(path, fun, ...args)(o)

const path_ =
    (...keys) =>
    (...nextKeys) =>
        keys.concat(nextKeys)

const path = (...keys) => keys

const map_ = (fun) => (coll1) => {
    if (coll1 && fun) {
        let coll2 = []
        const items = coll1 instanceof Array ? coll1 : Object.entries(coll1)
        for (const e of items) {
            coll2.push(fun(e))
        }
        return coll2
    } else {
        return []
    }
}

const map = (coll, fun) => map_(fun)(coll)

const reduce_ = (fun, acc) => (coll) => {
    if (coll && fun) {
        const items = coll instanceof Array ? coll : Object.entries(coll)
        for (const e of items) {
            acc = fun(acc, e)
        }
        return acc
    } else {
        return acc
    }
}

const reduce = (coll, fun, acc) => reduce_(fun, acc)(coll)

const reduceRight_ = (fun, acc) => (coll) => {
    if (coll && fun) {
        const items = coll instanceof Array ? coll : Object.entries(coll)
        for (const e of items) {
            acc = fun(acc, e)
        }
        return acc
    } else {
        return acc
    }
}

const reduceRight = (coll, fun, acc) => reduceRight_(fun, acc)(coll)

const pick_ = (keys) => (obj) =>
    obj && keys
        ? reduce(
              keys,
              (acc, key) => {
                  acc[key] = obj[key]
                  return acc
              },
              {}
          )
        : {}

const pick = (obj, keys) => pick_(keys)(obj)

const omit_ = (keys) => (obj) =>
    obj && keys
        ? reduce(
              keys,
              (obj, key) => {
                  delete obj[key]
                  return obj
              },
              obj
          )
        : {}

const omit = (obj, keys) => omit_(keys)(obj)

const size = (value) => (value == null ? 0 : value.length)

const isEmpty = (value) => (value == null ? true : !value.length)

const chunk_ = (size) => (coll) => {
    if (isEmpty(coll)) return []
    if (isNil(size)) return []
    if (size === 0) return []

    const items = coll instanceof Array ? coll : Object.entries(coll)
    let result = []
    let offset = 0

    while (offset <= items.length - 1) {
        result.push(items.slice(offset, offset + size))
        offset += size
    }

    return result
}

const chunk = (coll, size) => chunk_(size)(coll)

const reverse = (coll) => {
    if (coll) {
        coll.reverse()
        return coll
    } else {
        return []
    }
}

const sort_ =
    (...args) =>
    (coll) =>
        coll ? coll.sort(...args) : []
const sort = (coll, ...args) => sort_(...args)(coll)

const some_ =
    (...args) =>
    (coll) =>
        coll ? coll.some(...args) : false
const some = (coll, ...args) => (some ? some_(...args)(coll) : false)

const join_ = (separator) => (coll) => coll ? coll.join(separator) : ''
const join = (coll, separator) => join_(separator)(coll)

const includes_ =
    (...args) =>
    (coll) =>
        coll ? coll.includes(...args) : false

const includes = (coll, ...args) => includes_(...args)(coll)

const filter_ = (fun) => (coll) => coll ? coll.filter(fun) : []
const filter = (coll, fun) => filter_(fun)(coll)

const concat_ =
    (...args) =>
    (coll) =>
        (coll ? coll : [coll]).concat(...args)

const concat = (coll, ...args) => concat_(...args)(coll)

const every_ =
    (...args) =>
    (coll) =>
        coll ? coll.every(...args) : false

const every = (coll, ...args) => every_(...args)(coll)

const find_ =
    (...args) =>
    (coll) =>
        coll ? coll.find(...args) : undefined

const find = (coll, ...args) => find_(...args)(coll)

const fill_ =
    (...args) =>
    (coll) =>
        coll.fill(...args)

const fill = (coll, ...args) => fill_(...args)(coll)

const flat_ =
    (...args) =>
    (coll) =>
        coll.flat(...args)

const flat = (coll, ...args) => flat_(...args)(coll)

const arrayFrom_ = () => (coll) => Array.from(coll)
const arrayFrom = (coll) => arrayFrom_()(coll)

const push_ =
    (...args) =>
    (coll) => {
        coll.push(...args)
        return coll
    }
const push = (coll, ...args) => push_(...args)(coll)

const slice_ =
    (...args) =>
    (coll) =>
        coll.slice(...args)

const slice = (coll, ...args) => slice_(...args)(coll)

const head = (array) => (array && array.length ? array[0] : undefined)
const first = head

const last = (array) => {
    var length = array == null ? 0 : array.length
    return length ? array[length - 1] : undefined
}

const assign_ =
    (...args) =>
    (obj) =>
        Object.assign(obj, ...args)

const assign = (obj, ...args) => assign_(...args)(obj)

const entries = (obj) => Object.entries(obj)

const fromEntries = (fromEntries) => Object.fromEntries(fromEntries)

const keys = (obj) => Object.keys(obj)
const values = (obj) => Object.values(obj)

module.exports = {
    constant,
    flow,
    thread_,
    thread,
    isNil,
    isBoolean,
    isNumber,
    isString,
    isArray,
    isObject,
    isFunction,
    get_,
    get,
    set_,
    set,
    update_,
    update,
    path_,
    path,
    map_,
    map,
    reduce_,
    reduce,
    reduceRight_,
    reduceRight,
    pick_,
    pick,
    omit_,
    omit,
    size,
    isEmpty,
    chunk_,
    chunk,
    reverse,
    sort_,
    sort,
    some_,
    some,
    filter,
    join,
    includes_,
    includes,
    concat_,
    concat,
    every_,
    every,
    find_,
    find,
    fill_,
    fill,
    flat_,
    flat,
    arrayFrom_,
    arrayFrom,
    push_,
    push,
    slice_,
    slice,
    head,
    last,
    assign_,
    assign,
    entries,
    keys,
    values,
    fromEntries
}
