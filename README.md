
## Installation

npm package: [@emmveqz/js-utils](https://www.npmjs.com/package/@emmveqz/js-utils)

```sh
npm install @emmveqz/js-utils
```

### [racePromisesIterator()](./src/utils/index.ts)

Returns an iterator, yielding the value of `'fulfilled'` promises first.  
In case a promise is rejected, the iterator will yield an `Error` instance instead.

#### Usage:

```typescript
const promises: Promise<string>[] = [
  new Promise((resolve) => {
    setTimeout(() => {
      resolve('this will yield second')
    }, 3500)
  }),
  new Promise((resolve) => {
    setTimeout(() => {
      resolve('end')
    }, 7500)
  }),
  new Promise((_, reject) => {
    setTimeout(() => {
      reject('this will yield an error')
    }, 5500)
  }),
  new Promise((resolve) => {
    setTimeout(() => {
      resolve('this will yield first')
    }, 1500)
  }),
]

const someAsyncFunc = async () => {
  const itor = racePromisesIterator(promises)
  let result = await itor.next()

  while (!result.done) {
    console.log(result.value instanceof Error
      ? result.value.message
      : result.value)

    result = await itor.next()
  }
}
```
