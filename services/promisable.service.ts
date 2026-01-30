export default class Promisable {
  static asPromise(promise: Promise<any>) {
    return new Promise((resolve: (value: [any, null] | [null, any]) => void) => {
      promise.then(
        (res: any) => resolve([res, null]),
        (err: any) => resolve([null, err])
      );
    });
  }
}
