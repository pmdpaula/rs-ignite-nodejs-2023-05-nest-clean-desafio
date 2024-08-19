import { Prisma, Receiver as PrismaReceiver } from "@prisma/client";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Receiver } from "@/domain/delivery/enterprise/entities/receiver";

export class PrismaReceiverMapper {
  static toDomain(raw: PrismaReceiver): Receiver {
    return Receiver.create(
      {
        name: raw.name,
        phone: raw.phone,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(receiver: Receiver): Prisma.ReceiverUncheckedCreateInput {
    return {
      id: receiver.id.toString(),
      name: receiver.name,
      phone: receiver.phone,
      password: receiver.password,
      createdAt: receiver.createdAt,
      updatedAt: receiver.updatedAt,
    };
  }
}
