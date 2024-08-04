import { UniqueEntityID } from "@/core/entities/unique-entity-id";

import { CreateOrderUseCase } from "./create-order";

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: CreateOrderUseCase;

describe("Create Order", () => {
  beforeEach(() => {
    inMemoryOrderAttachmentsRepository = new InMemoryOrderAttachmentsRepository();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    );
    sut = new CreateOrderUseCase(inMemoryOrdersRepository);
  });

  it("should be able to create a order", async () => {
    const result = await sut.execute({
      authorId: "1",
      title: "Nova pergunta",
      content: "Conteúdo da pergunta",
      attachmentsIds: ["1", "2"],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryOrdersRepository.items[0]).toEqual(result.value?.order);
    expect(inMemoryOrdersRepository.items[0].attachments.currentItems).toHaveLength(2);
    expect(inMemoryOrdersRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityID("2") }),
    ]);
  });

  it("should persist attachments when creating a new order", async () => {
    const result = await sut.execute({
      authorId: "1",
      title: "Nova pergunta",
      content: "Conteúdo da pergunta",
      attachmentsIds: ["1", "2"],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryOrderAttachmentsRepository.items).toHaveLength(2);
    expect(inMemoryOrderAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID("1"),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID("1"),
        }),
      ]),
    );
  });
});
