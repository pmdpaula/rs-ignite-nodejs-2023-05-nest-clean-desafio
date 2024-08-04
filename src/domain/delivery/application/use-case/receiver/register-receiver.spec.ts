import { faker } from "@faker-js/faker";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryReceiversRepository } from "test/repositories/in-memory-receivers-repository";

import { ReceiverAlreadyExistsError } from "../errors/receiver-already-exists-error";
import { RegisterReceiverUseCase } from "./register-receiver";

let inMemoryReceiversRepository: InMemoryReceiversRepository;
let fakeHasher: FakeHasher;

let sut: RegisterReceiverUseCase;

describe("CreateReceiver", () => {
  beforeEach(() => {
    inMemoryReceiversRepository = new InMemoryReceiversRepository();
    fakeHasher = new FakeHasher();

    sut = new RegisterReceiverUseCase(inMemoryReceiversRepository, fakeHasher);
  });

  it("should be able to create a receiver", async () => {
    // Act
    const result = await sut.execute({
      name: "John Doe",
      phone: faker.phone.number(),
      password: "123456",
    });

    // Assert
    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual(
      expect.objectContaining({
        receiver: expect.objectContaining({
          name: "John Doe",
        }),
      }),
    );
  });

  it("should hash receiver password upon registration", async () => {
    const result = await sut.execute({
      name: faker.person.fullName(),
      phone: faker.phone.number(),
      password: "123456",
    });

    const hashedPassword = await fakeHasher.hash("123456");

    expect(result.isRight()).toBe(true);
    expect(inMemoryReceiversRepository.items[0].password).toEqual(hashedPassword);
  });

  it("should not be able to create two receivers with same phone", async () => {
    // Arrange
    const phoneNumber = faker.phone.number();

    // Act
    await sut.execute({
      name: faker.person.fullName(),
      phone: phoneNumber,
      password: "123456",
    });

    const result = await sut.execute({
      name: faker.person.fullName(),
      phone: phoneNumber,
      password: "123456",
    });

    // Assert
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ReceiverAlreadyExistsError);
  });
});
