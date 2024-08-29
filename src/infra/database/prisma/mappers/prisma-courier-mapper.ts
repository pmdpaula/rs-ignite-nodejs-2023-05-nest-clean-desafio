import { Prisma, User as PrismaUser } from "@prisma/client";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Courier } from "@/domain/delivery/enterprise/entities/courier";

export class PrismaCourierMapper {
  static toDomain(raw: PrismaUser): Courier {
    return Courier.create(
      {
        name: raw.name,
        registerNumber: raw.registerNumber,
        password: raw.password,
        role: raw.role,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(courier: Courier): Prisma.UserUncheckedCreateInput {
    return {
      id: courier.id.toString(),
      name: courier.name,
      registerNumber: courier.registerNumber,
      password: courier.password,
      role: courier.role,
    };
  }
}
