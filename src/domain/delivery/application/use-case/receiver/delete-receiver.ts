import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";

import { ReceiversRepository } from "../../repositories/receivers-repository";

interface RemoveReceiverUseCaseRequest {
  receiverId: string;
}

type DeleteReceiverUseCaseResponse = Either<ResourceNotFoundError, null>;

@Injectable()
export class DeleteReceiverUseCase {
  // eslint-disable-next-line no-unused-vars
  constructor(private receiversRepository: ReceiversRepository) {}

  async execute({
    receiverId,
  }: RemoveReceiverUseCaseRequest): Promise<DeleteReceiverUseCaseResponse> {
    const receiver = await this.receiversRepository.findById(receiverId);

    if (!receiver) {
      return left(new ResourceNotFoundError());
    }

    await this.receiversRepository.delete(receiver);

    return right(null);
  }
}
