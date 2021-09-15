/**
 * @jest-environment node
 */
import { jest, test, expect } from '@jest/globals'
import { constant, flow } from '../index'

jest.setTimeout(30000)

test('test constant', () => {
  expect(constant(10)()).toBe(10)
})

test('test flow', () => {
  const inc = i => i + 1
  const dec = i => i - 1
  const square = i => i * i

  const primer1Flow = flow(inc, inc, dec, inc, inc, square, o => `result ${o}`)

  const result = primer1Flow(1)

  expect(result).toBe('result 16')
})

test('test thread', () => {
  const inc = i => i + 1
  const dec = i => i - 1
  const square = i => i * i

  const primer1Flow = flow(inc, inc, dec, inc, inc, square, o => `result ${o}`)

  const result = primer1Flow(1)

  expect(result).toBe('result 16')
})
