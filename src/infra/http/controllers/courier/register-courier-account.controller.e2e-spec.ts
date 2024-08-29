import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { CourierFactory } from "test/factories/make-courier";

import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

describe("Create Account (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  // eslint-disable-next-line
  let jwt: JwtService;
  // eslint-disable-next-line
  let courierFactory: CourierFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    courierFactory = moduleRef.get(CourierFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[PUT] /courier/:id", async () => {
    const response = await request(app.getHttpServer()).post("/courier/accounts").send({
      name: "John Doe",
      registerNumber: "02581254855",
      password: "123456",
    });

    expect(response.statusCode).toBe(201);

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        registerNumber: "02581254855",
      },
    });

    expect(userOnDatabase).toBeTruthy();
  });
});
