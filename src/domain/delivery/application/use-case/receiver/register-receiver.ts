import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";
import { Receiver } from "@/domain/delivery/enterprise/entities/receiver";

import { HashGenerator } from "../../cryptography/hash-generator";
import { ReceiversRepository } from "../../repositories/receivers-repository";
import { ReceiverAlreadyExistsError } from "../errors/receiver-already-exists-error";

interface RegisterReceiverUseCaseRequest {
  name: string;
  phone: string;
  password: string;
}

type RegisterReceiverUseCaseResponse = Either<
  ReceiverAlreadyExistsError,
  {
    receiver: Receiver;
  }
>;

@Injectable()
export class RegisterReceiverUseCase {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private receiversRepository: ReceiversRepository,
    // eslint-disable-next-line no-unused-vars
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    phone,
    password,
  }: RegisterReceiverUseCaseRequest): Promise<RegisterReceiverUseCaseResponse> {
    const receiverWithSamePhone = await this.receiversRepository.findByPhone(phone);

    if (receiverWithSamePhone) {
      return left(new ReceiverAlreadyExistsError(phone));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const receiver = Receiver.create({
      name,
      phone,
      password: hashedPassword,
    });

    await this.receiversRepository.create(receiver);

    return right({
      receiver,
    });
  }
}
