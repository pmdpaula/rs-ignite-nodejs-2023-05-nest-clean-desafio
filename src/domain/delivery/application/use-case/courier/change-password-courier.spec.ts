import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeCourier } from "test/factories/make-courier";
import { InMemoryCouriersRepository } from "test/repositories/in-memory-couriers-repository";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";

import { ChangePasswordCourierUseCase } from "./change-password-courier";

let inMemoryCouriersRepository: InMemoryCouriersRepository;

let sut: ChangePasswordCourierUseCase;

let fakeHasher: FakeHasher;

describe("Change Password Courier", () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository();
    fakeHasher = new FakeHasher();

    sut = new ChangePasswordCourierUseCase(inMemoryCouriersRepository, fakeHasher);
  });

  it("should be able to change the password of a courier", async () => {
    // Arrange
    const courier = await makeCourier(
      {
        password: await fakeHasher.hash("old-password"),
      },
      new UniqueEntityID("1111"),
    );

    await inMemoryCouriersRepository.create(courier);

    // Act
    await sut.execute({
      id: "1111",
      password: "new-password",
    });

    // Assert
    const updatedCourier = await inMemoryCouriersRepository.findById("1111");

    if (!updatedCourier) {
      throw new Error("Courier not found");
    }

    const isPasswordCorrect = await fakeHasher.compare(
      "new-password",
      updatedCourier.password,
    );

    expect(isPasswordCorrect).toBeTruthy();
  });
});
