const isNil = (value) => value == null
const isBoolean = (value) => value === true || value === false
const isNumber = (value) => typeof value == 'number'
const isString = (value) => typeof value == 'string'
const isArray = Array.isArray
const isObject = (value) => {
    const type = typeof value
    return value != null && (type == 'object' || type == 'function')
}

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

const updateFlow = (path, fun) => (o) => flow(getFlow(path), fun, (v) => setFlow(path, v)(o))(o)

const update = (o, path, fun) => updateFlow(path, fun)(o)

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
    update
}
