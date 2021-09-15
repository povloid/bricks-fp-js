/**
 * @jest-environment node
 */
import { jest, test, expect } from '@jest/globals'
import { constant, flow } from '../index'

jest.setTimeout(30000)

test('test fp', () => {
  const inc = i => i + 1
  const dec = i => i - 1
  const square = i => i * i

  const primer1Flow = flow(inc, inc, dec, inc, inc, square, o => `result ${o}`)

  console.log(primer1Flow(1))
})
