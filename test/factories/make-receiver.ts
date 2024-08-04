import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Receiver, ReceiverProps } from "@/domain/delivery/enterprise/entities/receiver";
import { PrismaReceiverMapper } from "@/infra/database/prisma/mappers/prisma-receiver-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

export function makeReceiver(override: Partial<ReceiverProps> = {}, id?: UniqueEntityID) {
  const receiver = Receiver.create(
    {
      name: faker.person.fullName(),
      phone: faker.phone.number(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  );

  return receiver;
}

@Injectable()
export class ReceiverFactory {
  // eslint-disable-next-line no-unused-vars
  constructor(private prisma: PrismaService) {}

  async makePrismaReceiver(data: Partial<ReceiverProps> = {}): Promise<Receiver> {
    const receiver = makeReceiver(data);

    await this.prisma.receiver.create({
      data: PrismaReceiverMapper.toPrisma(receiver),
    });

    return receiver;
  }
}
