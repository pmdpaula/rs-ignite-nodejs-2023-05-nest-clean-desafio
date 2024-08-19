import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

describe("Create Account (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test("[POST] /receiver/accounts", async () => {
    const response = await request(app.getHttpServer()).post("/receiver/accounts").send({
      name: "John Doe",
      phone: "02581254855",
      password: "123456",
    });

    expect(response.statusCode).toBe(201);

    const receiverOnDatabase = await prisma.receiver.findUnique({
      where: {
        phone: "02581254855",
      },
    });

    expect(receiverOnDatabase).toBeTruthy();
  });
});
