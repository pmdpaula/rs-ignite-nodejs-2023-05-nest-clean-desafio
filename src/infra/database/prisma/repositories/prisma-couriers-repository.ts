import { Injectable } from "@nestjs/common";

import { DomainEvents } from "@/core/events/domain-events";
import { CouriersRepository } from "@/domain/delivery/application/repositories/couriers-repository";
import { Courier } from "@/domain/delivery/enterprise/entities/courier";

import { PrismaCourierMapper } from "../mappers/prisma-courier-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaCouriersRepository implements CouriersRepository {
  // eslint-disable-next-line no-unused-vars
  constructor(private prisma: PrismaService) {}

  async create(courier: Courier): Promise<void> {
    const data = PrismaCourierMapper.toPrisma(courier);

    await this.prisma.user.create({
      data,
    });
  }

  async save(courier: Courier): Promise<void> {
    const data = PrismaCourierMapper.toPrisma(courier);

    await this.prisma.user.update({
      where: {
        id: courier.id.toString(),
      },
      data,
    });

    DomainEvents.dispatchEventsForAggregate(courier.id);
  }

  async findByRegisterNumber(registerNumber: string): Promise<Courier | null> {
    const courier = await this.prisma.user.findUnique({
      where: {
        registerNumber,
      },
    });

    if (!courier) {
      return null;
    }

    return PrismaCourierMapper.toDomain(courier);
  }
}
