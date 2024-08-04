export abstract class Encrypter {
  // eslint-disable-next-line no-unused-vars
  abstract encrypt(payload: Record<string, unknown>): Promise<string>;
}
