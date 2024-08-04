export abstract class HashGenerator {
  // eslint-disable-next-line no-unused-vars
  abstract hash(plain: string): Promise<string>;
}
