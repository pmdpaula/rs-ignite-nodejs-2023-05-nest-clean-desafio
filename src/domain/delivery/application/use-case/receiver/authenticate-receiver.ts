import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";

import { Encrypter } from "../../cryptography/encrypter";
import { HashComparer } from "../../cryptography/hash-comparer";
import { ReceiversRepository } from "../../repositories/receivers-repository";
import { WrongCredentialsError } from "../errors/wrong-credentials-error";

interface AuthenticateReceiverUseCaseRequest {
  phone: string;
  password: string;
}

type AuthenticateReceiverUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string;
  }
>;

@Injectable()
export class AuthenticateReceiverUseCase {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private receiversRepository: ReceiversRepository,
    // eslint-disable-next-line no-unused-vars
    private hashComparer: HashComparer,
    // eslint-disable-next-line no-unused-vars
    private encrypter: Encrypter,
  ) {}

  async execute({
    phone,
    password,
  }: AuthenticateReceiverUseCaseRequest): Promise<AuthenticateReceiverUseCaseResponse> {
    const receiver = await this.receiversRepository.findByPhone(phone);

    if (!receiver) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hashComparer.compare(password, receiver.password);

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: receiver.id.toString(),
    });

    return right({
      accessToken,
    });
  }
}
