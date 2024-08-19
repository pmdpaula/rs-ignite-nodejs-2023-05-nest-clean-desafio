import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";
import { ReceiverFactory } from "test/factories/make-receiver";

import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";

describe("Authenticate (E2E)", () => {
  let app: INestApplication;
  let receiverFactory: ReceiverFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ReceiverFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    receiverFactory = moduleRef.get(ReceiverFactory);

    await app.init();
  });

  test("[POST] /receiver/sessions", async () => {
    await receiverFactory.makePrismaReceiver({
      phone: "0214965424",
      password: await hash("123456", 8),
    });

    const response = await request(app.getHttpServer()).post("/receiver/sessions").send({
      phone: "0214965424",
      password: "123456",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });

  test("[POST] /receiver/sessions", async () => {
    await receiverFactory.makePrismaReceiver({
      phone: "0214965425",
      password: await hash("123456", 8),
    });

    const response = await request(app.getHttpServer()).post("/receiver/sessions").send({
      phone: "0214965425",
      password: "wrong",
    });

    expect(response.statusCode).toBe(401);
    // expect(response).instanceOf(UnauthorizedException);
  });
});
