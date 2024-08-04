import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";

import { Encrypter } from "../../cryptography/encrypter";
import { HashComparer } from "../../cryptography/hash-comparer";
import { CouriersRepository } from "../../repositories/couriers-repository";
import { WrongCredentialsError } from "../errors/wrong-credentials-error";

interface AuthenticateCourierUseCaseRequest {
  registerNumber: string;
  password: string;
}

type AuthenticateCourierUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string;
  }
>;

@Injectable()
export class AuthenticateCourierUseCase {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private couriersRepository: CouriersRepository,
    // eslint-disable-next-line no-unused-vars
    private hashComparer: HashComparer,
    // eslint-disable-next-line no-unused-vars
    private encrypter: Encrypter,
  ) {}

  async execute({
    registerNumber,
    password,
  }: AuthenticateCourierUseCaseRequest): Promise<AuthenticateCourierUseCaseResponse> {
    const courier = await this.couriersRepository.findByRegisterNumber(registerNumber);

    if (!courier) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hashComparer.compare(password, courier.password);

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: courier.id.toString(),
    });

    return right({
      accessToken,
    });
  }
}
