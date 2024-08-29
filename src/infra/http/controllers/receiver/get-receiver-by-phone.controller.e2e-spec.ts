import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { ReceiverFactory } from "test/factories/make-receiver";

import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";

describe("Get Receiver By Phone (E2E)", () => {
  let app: INestApplication;
  let receiverFactory: ReceiverFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ReceiverFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    receiverFactory = moduleRef.get(ReceiverFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[GET] /receiver/phone/:phone", async () => {
    const receiver = await receiverFactory.makePrismaReceiver({
      name: "John Doe",
      phone: "0214965424",
    });

    const accessToken = jwt.sign({ sub: receiver.id.toString() });

    const response = await request(app.getHttpServer())
      .get("/receiver/phone/0214965424")
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    // expect(response.body).toEqual({
    //   receiver: expect.objectContaining({
    //     phone: "0214965424",
    //   }),
    // });
  });
});
