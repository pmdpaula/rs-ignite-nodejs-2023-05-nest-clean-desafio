import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Courier, CourierProps } from "@/domain/delivery/enterprise/entities/courier";
import { PrismaCourierMapper } from "@/infra/database/prisma/mappers/prisma-courier-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

export function makeCourier(override: Partial<CourierProps> = {}, id?: UniqueEntityID) {
  const courier = Courier.create(
    {
      name: faker.person.fullName(),
      registerNumber: faker.number.int(10).toString(),
      password: faker.internet.password(),
      role: "COURIER",
      ...override,
    },
    id,
  );

  return courier;
}

@Injectable()
export class CourierFactory {
  // eslint-disable-next-line no-unused-vars
  constructor(private prisma: PrismaService) {}

  async makePrismaCourier(data: Partial<CourierProps> = {}): Promise<Courier> {
    const courier = makeCourier(data);

    await this.prisma.user.create({
      data: PrismaCourierMapper.toPrisma(courier),
    });

    return courier;
  }
}
