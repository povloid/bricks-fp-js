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
    reduce,
    size,
    isEmpty,
    chunk,
    reverse,
    sort,
    some,
    join,
    includes,
    filter,
    concat
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

test('test map for object', () => {
    expect(map(null, (x) => x + 1)).toStrictEqual([])
    expect(map([1, 2, 3, 4, 5], (x) => x + 1)).toStrictEqual([2, 3, 4, 5, 6])
})

test('test reduce', () => {
    expect(reduce(null, (a, x) => a + x, 0)).toStrictEqual(0)
    expect(reduce([1, 2, 3, 4, 5], (a, x) => a + x, 0)).toBe(15)
})

test('test reduce object', () => {
    expect(reduce({ a: 1, b: 2, c: 3 }, (a, [k, v]) => a + v, 0)).toBe(6)
    expect(reduce({ a: 1, b: 2, c: 3 }, (a, [k]) => a + k, '')).toBe('abc')
})

test('test pick', () => {
    expect(pick(null, ['a', 'e'])).toStrictEqual({})
    expect(pick({ a: 1, b: { c: { d: 1 } }, e: '3' }, ['a', 'e'])).toStrictEqual({ a: 1, e: '3' })
})

test('test omit', () => {
    expect(omit(null, ['b'])).toStrictEqual({})
    expect(omit({ a: 1, b: { c: { d: 1 } }, e: '3' }, ['b'])).toStrictEqual({ a: 1, e: '3' })
})

test('test size', () => {
    expect(size(null)).toBe(0)
    expect(size([])).toBe(0)
    expect(size('')).toBe(0)
    expect(size([1])).toBe(1)
    expect(size('1')).toBe(1)
    expect(size([1, 3, 33, 4])).toBe(4)
    expect(size('a bc')).toBe(4)
})

test('test isEmpty', () => {
    expect(isEmpty(null)).toBe(true)
    expect(isEmpty([])).toBe(true)
    expect(isEmpty('')).toBe(true)
    expect(isEmpty([1])).toBe(false)
    expect(isEmpty('1')).toBe(false)
})

test('test chunk', () => {
    expect(chunk(null)).toStrictEqual([])
    expect(chunk([], null)).toStrictEqual([])
    expect(chunk([1, 2, 3, 4, 5], 3)).toStrictEqual([
        [1, 2, 3],
        [4, 5]
    ])
    expect(chunk([1, 2, 3, 4, 5], 1)).toStrictEqual([[1], [2], [3], [4], [5]])
})

test('test reverse', () => {
    expect(reverse(null)).toStrictEqual([])
    expect(reverse([])).toStrictEqual([])
    expect(reverse([1, 2, 3, 4, 5])).toStrictEqual([5, 4, 3, 2, 1])
})

test('test sort', () => {
    expect(sort(null)).toStrictEqual([])
    expect(sort([])).toStrictEqual([])
    expect(sort([3, 2, 4, 1, 5])).toStrictEqual([1, 2, 3, 4, 5])
    expect(
        sort(
            [
                { a: 2, b: '2' },
                { a: 1, b: '1' },
                { a: 4, b: '4' },
                { a: 5, b: '5' },
                { a: 3, b: '3' }
            ],
            ({ a: a1 }, { a: a2 }) => {
                if (a1 > a2) {
                    return 1
                }
                if (a1 < a2) {
                    return -1
                }
                return 0
            }
        )
    ).toStrictEqual([
        { a: 1, b: '1' },
        { a: 2, b: '2' },
        { a: 3, b: '3' },
        { a: 4, b: '4' },
        { a: 5, b: '5' }
    ])
})

test('test some', () => {
    const pred = (x) => x > 3
    expect(some(null, pred)).toStrictEqual(false)
    expect(some([], pred)).toStrictEqual(false)
    expect(some([1, 2, 3], pred)).toStrictEqual(false)
    expect(some([1, 2, 3, 3, 3, 4, 1], pred)).toStrictEqual(true)
})

test('test join', () => {
    expect(join(null, ',')).toStrictEqual('')
    expect(join([], ',')).toStrictEqual('')
    expect(join([1, 2, 3], ',')).toStrictEqual('1,2,3')
})

test('test includes', () => {
    expect(includes(null, 1)).toStrictEqual(false)
    expect(includes([], 1)).toStrictEqual(false)
    expect(includes([1, 2, 3], 2)).toStrictEqual(true)
})

test('test filter', () => {
    const pred = (x) => x > 3
    expect(filter(null, pred)).toStrictEqual([])
    expect(filter([], pred)).toStrictEqual([])
    expect(filter([1, 2, 3], pred)).toStrictEqual([])
    expect(filter([1, 2, 3, 3, 3, 4, 1], pred)).toStrictEqual([4])
})

test('test concat', () => {
    expect(concat(null, [])).toStrictEqual([null])
    expect(concat(null, [2, 4])).toStrictEqual([null, 2, 4])
    expect(concat([], [])).toStrictEqual([])
    expect(concat([1, 2, 3], [4])).toStrictEqual([1, 2, 3, 4])
    expect(concat([1, 2, 3], [4, 5], [6])).toStrictEqual([1, 2, 3, 4, 5, 6])
})
