import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryCouriersRepository } from "test/repositories/in-memory-couriers-repository";

import { RegisterCourierUseCase } from "./register-courier";

let inMemoryCouriersRepository: InMemoryCouriersRepository;
let fakeHasher: FakeHasher;

let sut: RegisterCourierUseCase;

describe("Register Courier", () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository();
    fakeHasher = new FakeHasher();

    sut = new RegisterCourierUseCase(inMemoryCouriersRepository, fakeHasher);
  });

  it("should be able to register a new courier", async () => {
    const result = await sut.execute({
      name: "John Doe",
      registerNumber: "johndoe@example.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courier: inMemoryCouriersRepository.items[0],
    });
  });

  it("should be able to register a new Admin", async () => {
    const result = await sut.execute({
      name: "Chefão",
      registerNumber: "1111",
      password: "123456",
      role: "ADMIN",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courier: expect.objectContaining({
        role: "ADMIN",
      }),
    });
  });

  it("should hash courier password upon registration", async () => {
    const result = await sut.execute({
      name: "John Doe",
      registerNumber: "johndoe@example.com",
      password: "123456",
    });

    const hashedPassword = await fakeHasher.hash("123456");

    expect(result.isRight()).toBe(true);
    expect(inMemoryCouriersRepository.items[0].password).toEqual(hashedPassword);
  });
});
