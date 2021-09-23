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

const thread = (arg, ...fns) => flow(...fns)(arg)

const getFlow = (path, defaultValue) =>
    flow((o) => o || defaultValue, ...path.map((k) => (o) => isNil(o) ? o : o[k]))

const get = (o, path, defaultValue) => getFlow(path, defaultValue)(o)

const setFlow = (path, value) => (o) => {
    const setByKey = (o, [k, ...keys], value) => {
        if ((k && isObject(o)) || isArray(o)) {
            o[k] = setByKey(o[k] || {}, keys, value)
            return o
        } else return value
    }
    return setByKey(o, path, value)
}

const set = (o, path, value) => setFlow(path, value)(o)

const updateFlow =
    (path, fun, ...args) =>
    (o) =>
        flow(
            getFlow(path),
            (v) => fun(v, ...args),
            (v) => setFlow(path, v)(o)
        )(o)

const update = (o, path, fun, ...args) => updateFlow(path, fun, ...args)(o)

const pathFlow =
    (...keys) =>
    (...nextKeys) =>
        keys.concat(nextKeys)

const path = (...keys) => pathFlow(...keys)

const mapFlow = (fun) => (coll1) => {
    if (coll1 && fun) {
        let coll2 = []
        const items = coll1 instanceof Array ? coll1 : Object.entries(coll1)
        for (const e of items) {
            coll2.push(fun(e))
        }
        return coll2
    } else {
        return coll1
    }
}

const map = (coll, fun) => mapFlow(fun)(coll)

const reduceFlow = (fun, acc) => (coll) => {
    if (coll && fun) {
        const items = coll instanceof Array ? coll : Object.entries(coll)
        for (const e of items) {
            acc = fun(acc, e)
        }
        return acc
    } else {
        return coll
    }
}

const reduce = (coll, fun, acc) => reduceFlow(fun, acc)(coll)

const pickFlow = (keys) => (obj) =>
    obj && keys
        ? reduce(
              keys,
              (acc, key) => {
                  acc[key] = obj[key]
                  return acc
              },
              {}
          )
        : obj

const pick = (obj, keys) => pickFlow(keys)(obj)

const omitFlow = (keys) => (obj) =>
    obj && keys
        ? reduce(
              keys,
              (obj, key) => {
                  delete obj[key]
                  return obj
              },
              obj
          )
        : obj

const omit = (obj, keys) => omitFlow(keys)(obj)

module.exports = {
    constant,
    flow,
    thread,
    isNil,
    isBoolean,
    isNumber,
    isString,
    isArray,
    isObject,
    getFlow,
    get,
    setFlow,
    set,
    updateFlow,
    update,
    pathFlow,
    path,
    mapFlow,
    map,
    reduceFlow,
    reduce,
    pickFlow,
    pick,
    omitFlow,
    omit
}
