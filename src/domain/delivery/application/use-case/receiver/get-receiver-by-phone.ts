import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";
import { Receiver } from "@/domain/delivery/enterprise/entities/receiver";

import { ReceiversRepository } from "../../repositories/receivers-repository";

type GetReceiverByPhoneUseCaseResponse = Either<
  null,
  {
    receiver: Receiver;
  }
>;

@Injectable()
export class GetReceiverByPhoneUseCase {
  // eslint-disable-next-line no-unused-vars
  constructor(private receiversRepository: ReceiversRepository) {}

  async execute(phone: string): Promise<GetReceiverByPhoneUseCaseResponse> {
    const receiver = await this.receiversRepository.findByPhone(phone);

    if (!receiver) {
      return left(null);
    }

    return right({
      receiver,
    });
  }
}
