import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";

import { HashGenerator } from "../../cryptography/hash-generator";
import { CouriersRepository } from "../../repositories/couriers-repository";

interface ChangePasswordCourierUseCaseRequest {
  id: string;
  password: string;
}

type ChangePasswordCourierUseCaseResponse = Either<ResourceNotFoundError, null>;

@Injectable()
export class ChangePasswordCourierUseCase {
  constructor(
    // eslint-disable-next-line
    private readonly couriersRepository: CouriersRepository,
    // eslint-disable-next-line
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    id,
    password,
  }: ChangePasswordCourierUseCaseRequest): Promise<ChangePasswordCourierUseCaseResponse> {
    const courier = await this.couriersRepository.findById(id);

    if (!courier) {
      return left(new ResourceNotFoundError());
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    courier.password = hashedPassword;

    await this.couriersRepository.save(courier);

    return right(null);
  }
}
