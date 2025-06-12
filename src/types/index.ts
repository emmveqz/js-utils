//

export type IDateFormat = 'american'|'european'|'japanese'

export type JsVal = string | number | boolean | JsVal[] | null

export type JsonObj = { [prop: string]: JsVal | JsonObj }

export type IObj = Record<string, unknown>

export type NextRequest = { abort?: boolean, waitFor?: Promise<void> } | undefined

export type MyAsyncGenerator<T, R = void> = AsyncGenerator<T, R, NextRequest>

export type IFuncArgs<T> = T extends (...args: infer A) => any ? A : never

export type IArrayEl<A> = A extends Array<infer T> ? T : never

export type IKeyString<T extends {}> = Extract<keyof T, string>

export type Awaited<T> = T extends PromiseLike<infer U> ? U : T

export type ExtractAllBut<K, T, Except extends K> = K extends T ? (K extends Except ? never : K) : never

export type IDeclaredKeys<T> = {
  [K in keyof T]: string extends K ? never : (number extends K ? never : K)
} extends { [_ in keyof T]: infer U } ? U : never

export type IFunc<R = any> = (...args: any[]) => R

export type IAwaited<T> = T extends Promise<infer R> ? R : never

export type IAwaitedFunc<F> = F extends IFunc<infer R> ? IAwaited<R> : never

export type ITryCatch = <F extends IFunc>(func: F, ...args: IFuncArgs<F>) => ReturnType<F> | Error

export type ICtxTryCatch = <F extends IFunc>(ctx: IObj, func: F, ...args: IFuncArgs<F>) => ReturnType<F> | Error

export type IAsyncTryCatch = <F extends IFunc<Promise<any>>>(func: F, ...args: IFuncArgs<F>) => Promise<IAwaitedFunc<F> | Error>

export type ICtxAsyncTryCatch
  = <F extends IFunc<Promise<any>>>(ctx: IObj, func: F, ...args: IFuncArgs<F>) => Promise<IAwaitedFunc<F> | Error>

export type IWithTryCatch = <F extends IFunc>(func: F) =>
  (...args: IFuncArgs<F>) => ReturnType<F> | Error

export type IWithAsyncTryCatch = <F extends IFunc<Promise<any>>>(func: F) =>
  (...args: IFuncArgs<F>) => Promise<IAwaitedFunc<F> | Error>

export type INullableProps<T> = {
  [prop in keyof T]?: T[prop]
}

export type INonNullableProps<T> = {
  [prop in keyof Required<T>]: NonNullable<T[prop]>
}

export type FlagPropsType<T, TypeToFlag> = {
  [K in keyof T]: T[K] extends TypeToFlag ? never : K
}

export type FilterPropsNames<T, OmittedType> = FlagPropsType<T, OmittedType>[keyof T]

export type OmitProp<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type OmitPropsType<T, OmittedType> = Pick<T, FilterPropsNames<T, OmittedType>>

export type INewable<Constructor extends (...args: any[]) => ReturnType<Constructor>>
  = { new(...args: IFuncArgs<Constructor>): ReturnType<Constructor> }

export type IEnumLike<T = unknown> = {
  [name: string]: T | string,
  [idx: number]: string,
}

export type IValOf<T extends {}, substractType = undefined> = T extends { [prop in keyof T]: infer Val }
  ? substractType extends undefined
      ? Val
      : Val extends substractType
        ? never
        : Val
  : never
