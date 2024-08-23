import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeCourier } from "test/factories/make-courier";
import { InMemoryCouriersRepository } from "test/repositories/in-memory-couriers-repository";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";

import { EditCourierUseCase } from "./edit-courier";

let inMemoryCouriersRepository: InMemoryCouriersRepository;
let sut: EditCourierUseCase;
// eslint-disable-next-line
let fakeHasher: FakeHasher;

describe("EditCourier", () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository();
    fakeHasher = new FakeHasher();

    sut = new EditCourierUseCase(inMemoryCouriersRepository);
  });

  it("should be able to edit a courier", async () => {
    const newCourier = makeCourier(
      {
        role: "COURIER",
      },
      new UniqueEntityID("111111"),
    );

    await inMemoryCouriersRepository.create(newCourier);

    await sut.execute({
      id: newCourier.id.toValue(),
      name: "New Name",
      role: "ADMIN",
    });

    expect(inMemoryCouriersRepository.items[0]).toMatchObject({
      name: "New Name",
      role: "ADMIN",
    });
  });

  it("should not be able to edit a courier that does not exist", async () => {
    const result = await sut.execute({
      id: "123",
      name: "New Name",
      role: "ADMIN",
    });

    expect(result.isLeft()).toBe(true);
  });
});
