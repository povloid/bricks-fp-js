const constant = v => () => v

const flow = (...fns) => {
  const f = fns.pop()
  return f ? v => f(flow(...fns)(v)) : v => v
}

const thread = (arg, ...fns) => flow(...fns)(arg)

module.exports = {
  constant,
  flow,
  thread
}
