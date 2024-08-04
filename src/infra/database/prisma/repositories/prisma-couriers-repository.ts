import { Injectable } from "@nestjs/common";

import { Courier } from "@/domain/delivery/enterprise/entities/courier";

import { PrismaCourierMapper } from "../mappers/prisma-courier-mapper";
// import { CouriersRepository } from "@/domain/delivery/application/repositories/couriers-repository";
// import { Courier } from "@/domain/forum/enterprise/entities/courier";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaCouriersRepository implements PrismaCouriersRepository {
  // eslint-disable-next-line no-unused-vars
  constructor(private prisma: PrismaService) {}

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

  async create(courier: Courier): Promise<void> {
    const data = PrismaCourierMapper.toPrisma(courier);

    await this.prisma.user.create({
      data,
    });
  }
}
