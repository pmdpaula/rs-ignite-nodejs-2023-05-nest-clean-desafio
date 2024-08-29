import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";

import { HashGenerator } from "../../cryptography/hash-generator";
import { ReceiversRepository } from "../../repositories/receivers-repository";

interface ChangePasswordReceiverUseCaseRequest {
  id: string;
  password: string;
}

type ChangePasswordReceiverUseCaseResponse = Either<ResourceNotFoundError, null>;

@Injectable()
export class ChangePasswordReceiverUseCase {
  constructor(
    // eslint-disable-next-line
    private readonly receiversRepository: ReceiversRepository,
    // eslint-disable-next-line
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    id,
    password,
  }: ChangePasswordReceiverUseCaseRequest): Promise<ChangePasswordReceiverUseCaseResponse> {
    const receiver = await this.receiversRepository.findById(id);

    if (!receiver) {
      return left(new ResourceNotFoundError());
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    receiver.password = hashedPassword;

    await this.receiversRepository.save(receiver);

    return right(null);
  }
}
