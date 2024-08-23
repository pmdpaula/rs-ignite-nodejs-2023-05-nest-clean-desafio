import { Injectable } from "@nestjs/common";
import { UserRole } from "@prisma/client";

import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Courier } from "@/domain/delivery/enterprise/entities/courier";

import { CouriersRepository } from "../../repositories/couriers-repository";

interface EditCourierUseCaseRequest {
  id: string;
  name: string;
  role: UserRole;
}

type EditCourierUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    courier: Courier;
  }
>;

@Injectable()
export class EditCourierUseCase {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly couriersRepository: CouriersRepository) {}

  async execute({
    id,
    name,
    role,
  }: EditCourierUseCaseRequest): Promise<EditCourierUseCaseResponse> {
    const courier = await this.couriersRepository.findById(id);

    if (!courier) {
      return left(new ResourceNotFoundError());
    }

    courier.name = name;
    courier.role = role;

    await this.couriersRepository.save(courier);

    return right({ courier });
  }
}
