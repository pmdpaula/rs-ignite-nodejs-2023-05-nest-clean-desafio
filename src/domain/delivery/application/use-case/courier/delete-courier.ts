import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";

import { CouriersRepository } from "../../repositories/couriers-repository";

interface DeleteCourierUseCaseRequest {
  courierId: string;
}

type DeleteCourierUseCaseResponse = Either<ResourceNotFoundError, null>;

@Injectable()
export class DeleteCourierUseCase {
  // eslint-disable-next-line no-unused-vars
  constructor(private couriersRepository: CouriersRepository) {}

  async execute({
    courierId,
  }: DeleteCourierUseCaseRequest): Promise<DeleteCourierUseCaseResponse> {
    const courier = await this.couriersRepository.findById(courierId);

    if (!courier) {
      return left(new ResourceNotFoundError());
    }

    await this.couriersRepository.delete(courier);

    return right(null);
  }
}
