import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeCourier } from "test/factories/make-courier";
import { InMemoryCouriersRepository } from "test/repositories/in-memory-couriers-repository";

import { WrongCredentialsError } from "../errors/wrong-credentials-error";
import { AuthenticateCourierUseCase } from "./authenticate-courier";

let inMemoryCouriersRepository: InMemoryCouriersRepository;
let fakeHasher: FakeHasher;
let encrypter: FakeEncrypter;

let sut: AuthenticateCourierUseCase;

describe("Authenticate Courier", () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository();
    fakeHasher = new FakeHasher();
    encrypter = new FakeEncrypter();

    sut = new AuthenticateCourierUseCase(
      inMemoryCouriersRepository,
      fakeHasher,
      encrypter,
    );
  });

  it("should be able to authenticate a courier", async () => {
    const courier = makeCourier({
      registerNumber: "02581254855",
      password: await fakeHasher.hash("123456"),
    });

    inMemoryCouriersRepository.items.push(courier);

    const result = await sut.execute({
      registerNumber: "02581254855",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });

  it("should not be able to authenticate a courier with wrong password", async () => {
    const courier = makeCourier({
      registerNumber: "02581254855",
      password: await fakeHasher.hash("123456"),
    });

    inMemoryCouriersRepository.items.push(courier);

    const result = await sut.execute({
      registerNumber: "02581254855",
      password: "wrong",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });

  it("should not be able to authenticate with an unregister courier", async () => {
    const result = await sut.execute({
      registerNumber: "02581254855",
      password: "wrong",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });
});
