export const isNil = (value) => value == null
export const isBoolean = (value) => value === true || value === false
export const isNumber = (value) => typeof value == 'number'
export const isString = (value) => typeof value == 'string'
export const isArray = (value) => value instanceof Array
export const isObject = (value) => value instanceof Object
export const isFunction = (value) => value instanceof Function

export const constant = (v) => () => v

export const flow = (...fns) => {
    const f = fns.pop()
    return f ? (v) => f(flow(...fns)(v)) : (v) => v
}

export const thread_ = flow
export const thread = (arg, ...fns) => flow(...fns)(arg)

export const get_ = (path, defaultValue) =>
    flow((o) => o || defaultValue, ...path.map((k) => (o) => isNil(o) ? o : o[k]))

export const get = (o, path, defaultValue) => get_(path, defaultValue)(o)

export const set_ = (path, value) => (o) => {
    const setByKey = (o, [k, ...keys], value) => {
        if ((k && isObject(o)) || isArray(o)) {
            o[k] = setByKey(o[k] || {}, keys, value)
            return o
        } else return value
    }
    return setByKey(o, path, value)
}

export const set = (o, path, value) => set_(path, value)(o)

export const update_ =
    (path, fun, ...args) =>
    (o) =>
        flow(
            get_(path),
            (v) => fun(v, ...args),
            (v) => set_(path, v)(o)
        )(o)

export const update = (o, path, fun, ...args) => update_(path, fun, ...args)(o)

export const path_ =
    (...keys) =>
    (...nextKeys) =>
        keys.concat(nextKeys)

export const path = (...keys) => keys

export const map_ = (fun) => (coll1) => {
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

export const map = (coll, fun) => map_(fun)(coll)

export const reduce_ = (fun, acc) => (coll) => {
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

export const reduce = (coll, fun, acc) => reduce_(fun, acc)(coll)

export const reduceRight_ = (fun, acc) => (coll) => {
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

export const reduceRight = (coll, fun, acc) => reduceRight_(fun, acc)(coll)

export const pick_ = (keys) => (obj) =>
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

export const pick = (obj, keys) => pick_(keys)(obj)

export const omit_ = (keys) => (obj) =>
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

export const omit = (obj, keys) => omit_(keys)(obj)

export const size = (value) => (value == null ? 0 : value.length)

export const isEmpty = (value) => (value == null ? true : !value.length)

export const chunk_ = (size) => (coll) => {
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

export const chunk = (coll, size) => chunk_(size)(coll)

export const reverse = (coll) => {
    if (coll) {
        coll.reverse()
        return coll
    } else {
        return []
    }
}

export const sort_ =
    (...args) =>
    (coll) =>
        coll ? coll.sort(...args) : []
export const sort = (coll, ...args) => sort_(...args)(coll)

export const some_ =
    (...args) =>
    (coll) =>
        coll ? coll.some(...args) : false
export const some = (coll, ...args) => (some ? some_(...args)(coll) : false)

export const join_ = (separator) => (coll) => coll ? coll.join(separator) : ''
export const join = (coll, separator) => join_(separator)(coll)

export const includes_ =
    (...args) =>
    (coll) =>
        coll ? coll.includes(...args) : false

export const includes = (coll, ...args) => includes_(...args)(coll)

export const filter_ = (fun) => (coll) => coll ? coll.filter(fun) : []
export const filter = (coll, fun) => filter_(fun)(coll)

export const concat_ =
    (...args) =>
    (coll) =>
        (coll ? coll : [coll]).concat(...args)

export const concat = (coll, ...args) => concat_(...args)(coll)

export const every_ =
    (...args) =>
    (coll) =>
        coll ? coll.every(...args) : false

export const every = (coll, ...args) => every_(...args)(coll)

export const find_ =
    (...args) =>
    (coll) =>
        coll ? coll.find(...args) : undefined

export const find = (coll, ...args) => find_(...args)(coll)

export const fill_ =
    (...args) =>
    (coll) =>
        coll.fill(...args)

export const fill = (coll, ...args) => fill_(...args)(coll)

export const flat_ =
    (...args) =>
    (coll) =>
        coll.flat(...args)

export const flat = (coll, ...args) => flat_(...args)(coll)

export const arrayFrom_ = () => (coll) => Array.from(coll)
export const arrayFrom = (coll) => arrayFrom_()(coll)

export const push_ =
    (...args) =>
    (coll) => {
        coll.push(...args)
        return coll
    }
export const push = (coll, ...args) => push_(...args)(coll)

export const slice_ =
    (...args) =>
    (coll) =>
        coll.slice(...args)

export const slice = (coll, ...args) => slice_(...args)(coll)

export const head = (array) => (array && array.length ? array[0] : undefined)
export const first = head

export const last = (array) => {
    var length = array == null ? 0 : array.length
    return length ? array[length - 1] : undefined
}

export const assign_ =
    (...args) =>
    (obj) =>
        Object.assign(obj, ...args)

export const assign = (obj, ...args) => assign_(...args)(obj)

export const entries = (obj) => Object.entries(obj)

export const fromEntries = (fromEntries) => Object.fromEntries(fromEntries)

export const keys = (obj) => Object.keys(obj)
export const values = (obj) => Object.values(obj)

export const join2_ =
    (x) =>
    ([head, ...rest]) =>
        rest.reduce((a, b) => a.concat([x, b]), [head])

export const join2 = (coll, x) => join2_(x)(coll)
