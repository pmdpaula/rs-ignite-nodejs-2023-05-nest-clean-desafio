import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
} from "@nestjs/common";
import { z } from "zod";

// import { RegisterReceiverUseCase } from "@/domain/delivery/application/use-case/receiver/register-receiver";
import { ReceiverAlreadyExistsError } from "@/domain/delivery/application/use-case/errors/receiver-already-exists-error";
import { RegisterReceiverUseCase } from "@/domain/delivery/application/use-case/receiver/register-receiver";
import { Public } from "@/infra/auth/public";

import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";

const registerReceiverAccountBodySchema = z.object({
  name: z.string(),
  phone: z.string(),
  password: z.string().min(5),
});

const bodyValidationPipe = new ZodValidationPipe(registerReceiverAccountBodySchema);

type RegisterReceiverAccountBodySchema = z.infer<
  typeof registerReceiverAccountBodySchema
>;

@Controller("/receiver/accounts")
@Public()
export class RegisterReceiverAccountController {
  // eslint-disable-next-line no-unused-vars
  constructor(private registerReceiver: RegisterReceiverUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: RegisterReceiverAccountBodySchema,
  ): Promise<void> {
    const { name, phone, password } = body;

    const result = await this.registerReceiver.execute({
      name,
      phone,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ReceiverAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
