/* eslint-disable no-unused-vars */
export abstract class HashComparer {
  abstract compare(plain: string, hash: string): Promise<boolean>;
}
