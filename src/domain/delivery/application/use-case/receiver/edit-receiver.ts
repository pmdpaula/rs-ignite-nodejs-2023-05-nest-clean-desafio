import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Receiver } from "@/domain/delivery/enterprise/entities/receiver";

import { ReceiversRepository } from "../../repositories/receivers-repository";

interface EditReceiverUseCaseRequest {
  id: string;
  name?: string;
  phone?: string;
}

type EditReceiverUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    receiver: Receiver;
  }
>;

@Injectable()
export class EditReceiverUseCase {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly receiversRepository: ReceiversRepository) {}

  async execute({
    id,
    name,
    phone,
  }: EditReceiverUseCaseRequest): Promise<EditReceiverUseCaseResponse> {
    const receiver = await this.receiversRepository.findById(id);

    if (!receiver) {
      return left(new ResourceNotFoundError());
    }

    receiver.name = name || receiver.name;
    receiver.phone = phone || receiver.phone;

    await this.receiversRepository.save(receiver);

    return right({ receiver });
  }
}
