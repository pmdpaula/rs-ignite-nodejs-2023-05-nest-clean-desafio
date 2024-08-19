import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeReceiver } from "test/factories/make-receiver";
import { InMemoryReceiversRepository } from "test/repositories/in-memory-receivers-repository";

import { WrongCredentialsError } from "../errors/wrong-credentials-error";
import { AuthenticateReceiverUseCase } from "./authenticate-receiver";

let inMemoryReceiversRepository: InMemoryReceiversRepository;
let fakeHasher: FakeHasher;
let encrypter: FakeEncrypter;

let sut: AuthenticateReceiverUseCase;

describe("Authenticate Receiver", () => {
  beforeEach(() => {
    inMemoryReceiversRepository = new InMemoryReceiversRepository();
    fakeHasher = new FakeHasher();
    encrypter = new FakeEncrypter();

    sut = new AuthenticateReceiverUseCase(
      inMemoryReceiversRepository,
      fakeHasher,
      encrypter,
    );
  });

  it("should be able to authenticate a receiver", async () => {
    const receiver = makeReceiver({
      phone: "02581254855",
      password: await fakeHasher.hash("123456"),
    });

    inMemoryReceiversRepository.items.push(receiver);

    const result = await sut.execute({
      phone: "02581254855",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });

  it("should not be able to authenticate a receiver with wrong password", async () => {
    const receiver = makeReceiver({
      phone: "02581254855",
      password: await fakeHasher.hash("123456"),
    });

    inMemoryReceiversRepository.items.push(receiver);

    const result = await sut.execute({
      phone: "02581254855",
      password: "wrong",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });

  it("should not be able to authenticate with an unregister receiver", async () => {
    const result = await sut.execute({
      phone: "02581254855",
      password: "wrong",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });
});
