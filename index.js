export const constant = v => () => v
export const flow = (...args) => {
  const f = args.pop()
  if (f) return v => f(flow(...args)(v))
  else return v => v
}
