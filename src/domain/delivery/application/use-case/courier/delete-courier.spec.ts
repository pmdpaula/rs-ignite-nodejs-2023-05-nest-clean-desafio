import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeCourier } from "test/factories/make-courier";
import { InMemoryCouriersRepository } from "test/repositories/in-memory-couriers-repository";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";

import { DeleteCourierUseCase } from "./delete-courier";

let inMemoryCouriersRepository: InMemoryCouriersRepository;

let sut: DeleteCourierUseCase;
// eslint-disable-next-line
let fakeHasher: FakeHasher;

describe("Delete Courier", () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository();
    fakeHasher = new FakeHasher();

    sut = new DeleteCourierUseCase(inMemoryCouriersRepository);
  });

  it("should be able to delete a courier", async () => {
    // Arrange
    const courier1 = makeCourier(
      {
        role: "COURIER",
      },
      new UniqueEntityID("1111"),
    );

    const courier2 = makeCourier(
      {
        role: "COURIER",
      },
      new UniqueEntityID("2222"),
    );

    await inMemoryCouriersRepository.create(courier1);
    await inMemoryCouriersRepository.create(courier2);

    expect(inMemoryCouriersRepository.items).toHaveLength(2);

    // Act
    await sut.execute({
      id: "1111",
    });

    // Assert
    expect(inMemoryCouriersRepository.items).toHaveLength(1);
  });
});
