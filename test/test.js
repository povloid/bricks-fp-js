/**
 * @jest-environment node
 */
import { jest, test, expect } from '@jest/globals'
import {
    constant,
    flow,
    getFlow,
    get,
    setFlow,
    set,
    updateFlow,
    update,
    pathFlow,
    pick,
    omit,
    map,
    reduce
} from '../index'

jest.setTimeout(30000)

test('test constant', () => {
    expect(constant(10)()).toBe(10)
})

test('test flow', () => {
    const inc = (i) => i + 1
    const dec = (i) => i - 1
    const square = (i) => i * i

    const primer1F = flow(inc, inc, dec, inc, inc, square, (o) => `result ${o}`)

    const result = primer1F(1)

    expect(result).toBe('result 16')
})

test('test thread', () => {
    const inc = (i) => i + 1
    const dec = (i) => i - 1
    const square = (i) => i * i

    const primer1F = flow(inc, inc, dec, inc, inc, square, (o) => `result ${o}`)

    const result = primer1F(1)

    expect(result).toBe('result 16')
})

test('test get 1', () => {
    const obj = { a: 1, b: { c: 1 } }
    const path = ['b', 'c']
    const defaultValue = 222
    const getFlow1 = getFlow(path, defaultValue)

    expect(getFlow1(obj)).toBe(1)
    expect(get(obj, path, defaultValue)).toBe(1)
})

test('test get 2', () => {
    const obj = { a: 1, b: { c: [{ d: 1 }] } }
    const path = ['b', 'c', 0, 'd']
    const defaultValue = 222
    const getFlow1 = getFlow(path, defaultValue)

    expect(getFlow1(obj)).toBe(1)
    expect(get(obj, path, defaultValue)).toBe(1)
})

test('test set 1', () => {
    const obj = { a: 1, b: { c: { d: 1 } } }
    const path = ['b', 'c', 'd']
    const value = 222
    const setFlow1 = setFlow(path, value)

    setFlow1(obj)
    expect(obj.b.c.d).toBe(value)

    set(obj, [1, 2, 3, 4, 5], 6)
    expect(obj['1']['2']['3']['4']['5']).toBe(6)
})

test('test set 2', () => {
    const obj = { a: 1, b: { c: [{ d: 1 }] } }
    const path = ['b', 'c', 0, 'd']
    const value = 222
    const setFlow1 = setFlow(path, value)

    setFlow1(obj)
    expect(obj.b.c[0].d).toBe(value)
})

test('test update 1', () => {
    const obj = { a: 1, b: { c: { d: 1 } } }
    const path = ['b', 'c', 'd']
    const inc = (x) => x + 1
    const updateFlow1 = updateFlow(path, inc)
    const dec = (x) => x - 1
    const updateFlow2 = updateFlow(path, dec)

    updateFlow1(obj)
    expect(obj.b.c.d).toBe(2)

    updateFlow1(obj)
    expect(obj.b.c.d).toBe(3)

    updateFlow2(obj)
    expect(obj.b.c.d).toBe(2)

    update(obj, path, (x) => x * x)
    expect(obj.b.c.d).toBe(4)

    update(obj, [], (x) => {
        x.z = 1111
        return x
    })
    expect(obj.z).toBe(1111)

    update(obj, ['z'], (z, k) => z + k, 20)
    expect(obj.z).toBe(1111 + 20)

    update(obj, ['b', 'c', 'd'], (z, ...args) => args.reduce((a, i) => a + i, z), 1, 2, 3, 4)
    expect(obj.b.c.d).toBe(4 + 1 + 2 + 3 + 4)
})

test('test path 1', () => {
    const obj = { a: 1, b: { c: { d: 1 } } }

    const basePathF = pathFlow('b', 'c')
    const path = basePathF('d')

    const inc = (x) => x + 1
    const updateFlow1 = updateFlow(path, inc)
    const dec = (x) => x - 1
    const updateFlow2 = updateFlow(path, dec)

    updateFlow1(obj)
    expect(obj.b.c.d).toBe(2)

    updateFlow1(obj)
    expect(obj.b.c.d).toBe(3)

    updateFlow2(obj)
    expect(obj.b.c.d).toBe(2)

    update(obj, path, (x) => x * x)
    expect(obj.b.c.d).toBe(4)
})

test('test map for array', () => {
    expect(map([1, 2, 3, 4, 5], (x) => x + 1)).toStrictEqual([2, 3, 4, 5, 6])
})

test('test reduce', () => {
    expect(reduce([1, 2, 3, 4, 5], (a, x) => a + x, 0)).toBe(15)
})

test('test pick', () => {
    const obj = { a: 1, b: { c: { d: 1 } }, e: '3' }
    expect(pick(obj, ['a', 'e'])).toStrictEqual({ a: 1, e: '3' })
})

test('test omit', () => {
    const obj = { a: 1, b: { c: { d: 1 } }, e: '3' }
    expect(omit(obj, ['b'])).toStrictEqual({ a: 1, e: '3' })
})
