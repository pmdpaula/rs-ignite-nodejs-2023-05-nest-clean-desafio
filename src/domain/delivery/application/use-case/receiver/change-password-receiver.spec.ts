import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeReceiver } from "test/factories/make-receiver";
import { InMemoryReceiversRepository } from "test/repositories/in-memory-receivers-repository";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";

import { ChangePasswordReceiverUseCase } from "./change-password-receiver";

let inMemoryReceiversRepository: InMemoryReceiversRepository;

let sut: ChangePasswordReceiverUseCase;

let fakeHasher: FakeHasher;

describe("Change Password Receiver", () => {
  beforeEach(() => {
    inMemoryReceiversRepository = new InMemoryReceiversRepository();
    fakeHasher = new FakeHasher();

    sut = new ChangePasswordReceiverUseCase(inMemoryReceiversRepository, fakeHasher);
  });

  it("should be able to change the password of a receiver", async () => {
    // Arrange
    const receiver = await makeReceiver(
      {
        password: await fakeHasher.hash("old-password"),
      },
      new UniqueEntityID("1111"),
    );

    await inMemoryReceiversRepository.create(receiver);

    // Act
    await sut.execute({
      id: "1111",
      password: "new-password",
    });

    // Assert
    const updatedReceiver = await inMemoryReceiversRepository.findById("1111");

    if (!updatedReceiver) {
      throw new Error("Receiver not found");
    }

    const isPasswordCorrect = await fakeHasher.compare(
      "new-password",
      updatedReceiver.password,
    );

    expect(isPasswordCorrect).toBeTruthy();
  });
});
