import { makeReceiver } from "test/factories/make-receiver";
import { InMemoryReceiversRepository } from "test/repositories/in-memory-receivers-repository";

import { GetReceiverByPhoneUseCase } from "./get-receiver-by-phone";

describe("Get Receiver By Phone", () => {
  it("should be able to get a receiver by phone", async () => {
    // Arrange
    const inMemoryReceiversRepository = new InMemoryReceiversRepository();
    const sut = new GetReceiverByPhoneUseCase(inMemoryReceiversRepository);

    const receiver = makeReceiver({
      phone: "02581254855",
    });

    inMemoryReceiversRepository.items.push(receiver);

    // Act
    const result = await sut.execute("02581254855");

    // Assert
    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        receiver: expect.objectContaining({ phone: "02581254855" }),
      }),
    );
  });

  it("should not be able to get a receiver with an unregister phone", async () => {
    // Arrange
    const inMemoryReceiversRepository = new InMemoryReceiversRepository();
    const sut = new GetReceiverByPhoneUseCase(inMemoryReceiversRepository);

    // Act
    const result = await sut.execute("02581254856");

    // Assert
    expect(result.isLeft()).toBe(true);
  });
});
