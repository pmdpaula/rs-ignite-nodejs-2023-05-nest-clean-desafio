import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";

import { Courier } from "../../../enterprise/entities/courier";
import { HashGenerator } from "../../cryptography/hash-generator";
import { CouriersRepository } from "../../repositories/couriers-repository";
import { CourierAlreadyExistsError } from "../errors/courier-already-exists-error";
import { ReceiverAlreadyExistsError } from "../errors/receiver-already-exists-error";

interface RegisterCourierUseCaseRequest {
  name: string;
  registerNumber: string;
  password: string;
}

type RegisterCourierUseCaseResponse = Either<
  ReceiverAlreadyExistsError,
  {
    courier: Courier;
  }
>;

@Injectable()
export class RegisterCourierUseCase {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private couriersRepository: CouriersRepository,
    // eslint-disable-next-line no-unused-vars
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    registerNumber,
    password,
  }: RegisterCourierUseCaseRequest): Promise<RegisterCourierUseCaseResponse> {
    const courierWithSameEmail =
      await this.couriersRepository.findByRegisterNumber(registerNumber);

    if (courierWithSameEmail) {
      return left(new CourierAlreadyExistsError(registerNumber));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const courier = Courier.create({
      name,
      registerNumber,
      password: hashedPassword,
    });

    await this.couriersRepository.create(courier);

    return right({
      courier,
    });
  }
}
