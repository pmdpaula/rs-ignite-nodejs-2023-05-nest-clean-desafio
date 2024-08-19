import { Injectable } from "@nestjs/common";

import { DomainEvents } from "@/core/events/domain-events";
import { ReceiversRepository } from "@/domain/delivery/application/repositories/receivers-repository";
import { Receiver } from "@/domain/delivery/enterprise/entities/receiver";

import { PrismaReceiverMapper } from "../mappers/prisma-receiver-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaReceiversRepository implements ReceiversRepository {
  // eslint-disable-next-line no-unused-vars
  constructor(private prisma: PrismaService) {}

  async create(receiver: Receiver): Promise<void> {
    const data = PrismaReceiverMapper.toPrisma(receiver);

    await this.prisma.receiver.create({
      data,
    });
  }

  async save(receiver: Receiver): Promise<void> {
    const data = PrismaReceiverMapper.toPrisma(receiver);

    await this.prisma.receiver.update({
      where: {
        id: receiver.id.toString(),
      },
      data,
    });

    DomainEvents.dispatchEventsForAggregate(receiver.id);
  }

  async findById(id: string): Promise<Receiver | null> {
    const receiver = await this.prisma.receiver.findUnique({
      where: {
        id,
      },
    });

    if (!receiver) {
      return null;
    }

    return PrismaReceiverMapper.toDomain(receiver);
  }

  async findByPhone(phone: string): Promise<Receiver | null> {
    const receiver = await this.prisma.receiver.findUnique({
      where: {
        phone,
      },
    });

    if (!receiver) {
      return null;
    }

    return PrismaReceiverMapper.toDomain(receiver);
  }
}
