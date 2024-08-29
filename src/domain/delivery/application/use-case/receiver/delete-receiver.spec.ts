import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeReceiver } from "test/factories/make-receiver";
import { InMemoryReceiversRepository } from "test/repositories/in-memory-receivers-repository";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";

import { DeleteReceiverUseCase } from "./delete-receiver";

let inMemoryReceiversRepository: InMemoryReceiversRepository;

let sut: DeleteReceiverUseCase;
// eslint-disable-next-line
let fakeHasher: FakeHasher;

describe("Delete Receiver", () => {
  beforeEach(() => {
    inMemoryReceiversRepository = new InMemoryReceiversRepository();
    fakeHasher = new FakeHasher();

    sut = new DeleteReceiverUseCase(inMemoryReceiversRepository);
  });

  it("should be able to delete a receiver", async () => {
    // Arrange
    const receiver1 = makeReceiver({}, new UniqueEntityID("1111"));

    const receiver2 = makeReceiver({}, new UniqueEntityID("2222"));

    await inMemoryReceiversRepository.create(receiver1);
    await inMemoryReceiversRepository.create(receiver2);

    expect(inMemoryReceiversRepository.items).toHaveLength(2);

    // Act
    await sut.execute({
      receiverId: "1111",
    });

    // Assert
    expect(inMemoryReceiversRepository.items).toHaveLength(1);
  });
});
