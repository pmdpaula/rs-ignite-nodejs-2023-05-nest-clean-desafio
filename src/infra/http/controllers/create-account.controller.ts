import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
} from "@nestjs/common";
import { z } from "zod";

import { CourierAlreadyExistsError } from "@/domain/delivery/application/use-case/errors/courier-already-exists-error";
import { RegisterCourierUseCase } from "@/domain/delivery/application/use-case/courier/register-courier";
import { Public } from "@/infra/auth/public";

import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

const createAccountBodySchema = z.object({
  name: z.string(),
  registerNumber: z.string(),
  password: z.string().min(5),
});

const bodyValidationPipe = new ZodValidationPipe(createAccountBodySchema);

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller("/accounts")
@Public()
export class CreateAccountController {
  // eslint-disable-next-line no-unused-vars
  constructor(private registerCourier: RegisterCourierUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: CreateAccountBodySchema): Promise<void> {
    const { name, registerNumber, password } = body;

    const result = await this.registerCourier.execute({
      name,
      registerNumber,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case CourierAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
