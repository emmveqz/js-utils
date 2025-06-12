//

/* eslint-disable no-await-in-loop */

//

import {
  IArrayEl,
  IAsyncTryCatch,
  ICtxAsyncTryCatch,
  ICtxTryCatch,
  IEnumLike,
  IFuncArgs,
  ITryCatch,
  IValOf,
  IWithAsyncTryCatch,
  IWithTryCatch,
  MyAsyncGenerator,
} from '../types'

//

/**
 * This relies blindly that `Promise.race(promises)` will resolve with `promises[0]`
 *
 * even if all `promises` were resolved when passed.
 */
export const getPromiseState = <T>(promise: Promise<T>): Promise<
  | 'pending'
  | 'fulfilled'
  | 'rejected'
> => {
  const pending = Symbol('pending') as T

  return Promise
    .race<T>([promise, Promise.resolve(pending)])
    .then((value) => (value === pending ? 'pending' : 'fulfilled'))
    .catch(() => 'rejected')
}

/**
 * Returns an iterator, yielding the value of `'fulfilled'` promises first.
 *
 * In case a promise is rejected, the iterator will yield an `Error` object instead.
 */
export async function* racePromisesIterator<T>(
  promises: Promise<T>[],
): MyAsyncGenerator<T|Error> {
  const pending = promises.concat([])

  while (pending.length) {
    await Promise.race(pending)

    for (let idx = 0; idx < pending.length; idx++) {
      const state = await getPromiseState(pending[idx])

      if (state === 'pending') {
        continue
      }

      const value = await pending[idx]

      const nextRequest = yield (state === 'fulfilled'
        ? value
        : new Error(String(value))
      )

      if (nextRequest?.abort) {
        return
      }

      pending.splice(idx, 1)
      await nextRequest?.waitFor
      break
    }
  }
}

export const arrayUniqueByProp = <T extends Record<string, unknown>>(arr: Array<T>, prop: keyof T): Array<T> => {
  return arr.filter((val, idx, arr2) => arr2
    .findIndex((val2) => val2[prop] === val[prop]) === idx)
}

/**
 * If you are not certain of the types for the `arr` values,
 *
 * consider validating the result with `Number.isNaN(result)`
 */
export const arraySum = <T extends Array<unknown>>(arr: T): IArrayEl<T> extends number ? number : never => {
  return !arr.length ? 0 as never : arr.reduce(
    (total, val) => (Number.isSafeInteger(val) ? (total as number || 0) + (val as number) : total),
    Number.isSafeInteger(arr[0]) ? 0 : NaN,
  ) as never
}

/**
 * Returns a copy of the `arr` which halts at the first `false` occurence for `predicate`.
 */
export const arrayFilterHalt = <T>(arr: Array<T>, predicate: IFuncArgs<Array<T>['findIndex']>[0]): Array<T> => {
  const idx = arr.findIndex(predicate)

  return arr.slice(0, idx)
}

/**
 * Consider using `new Set(arr)`
 */
export const arrayUnique = <T>(arr: Array<T>): Array<T> => {
  return arr.filter((val, idx, arr2) => arr2.indexOf(val) === idx)
}

export const extractEnumNumbers = <T extends IEnumLike>(en: T): Array< IValOf<T, string> > => {
  return Object
    .values(en as { [prop: string]: IValOf<T, string> })
    .filter((val) => typeof val === typeof 1)
}

export const tryCatch: ITryCatch = (func, ...args) => {
  try {
    return func(...args)
  } catch (ex) {
    return new Error((ex as Error).message)
  }
}

export const ctxTryCatch: ICtxTryCatch = (ctx, func, ...args) => {
  try {
    return func.call(ctx, ...args)
  } catch (ex) {
    return new Error((ex as Error).message)
  }
}

export const asyncTryCatch: IAsyncTryCatch = async (func, ...args) => {
  try {
    return await func(...args)
  } catch (ex) {
    return new Error((ex as Error).message)
  }
}

export const ctxAsyncTryCatch: ICtxAsyncTryCatch = async (ctx, func, ...args) => {
  try {
    return await func.call(ctx, ...args)
  } catch (ex) {
    return new Error((ex as Error).message)
  }
}

export const withTryCatch: IWithTryCatch = (func) => {
  return (...args) => tryCatch(func, ...args)
}

export const withAsyncTryCatch: IWithAsyncTryCatch = (func) => {
  return (...args) => asyncTryCatch(func, ...args)
}
