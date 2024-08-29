import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeReceiver } from "test/factories/make-receiver";
import { InMemoryReceiversRepository } from "test/repositories/in-memory-receivers-repository";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";

import { EditReceiverUseCase } from "./edit-receiver";

let inMemoryReceiversRepository: InMemoryReceiversRepository;
let sut: EditReceiverUseCase;
// eslint-disable-next-line
let fakeHasher: FakeHasher;

describe("EditReceiver", () => {
  beforeEach(() => {
    inMemoryReceiversRepository = new InMemoryReceiversRepository();
    fakeHasher = new FakeHasher();

    sut = new EditReceiverUseCase(inMemoryReceiversRepository);
  });

  it("should be able to edit a receiver", async () => {
    const newReceiver = makeReceiver({}, new UniqueEntityID("111111"));

    await inMemoryReceiversRepository.create(newReceiver);

    await sut.execute({
      id: newReceiver.id.toValue(),
      phone: "021999999999",
    });

    expect(inMemoryReceiversRepository.items[0]).toMatchObject({
      phone: "021999999999",
    });
  });

  it("should not be able to edit a receiver that does not exist", async () => {
    const result = await sut.execute({
      id: "123",
      name: "New Name",
      phone: "021999999999",
    });

    expect(result.isLeft()).toBe(true);
  });
});
