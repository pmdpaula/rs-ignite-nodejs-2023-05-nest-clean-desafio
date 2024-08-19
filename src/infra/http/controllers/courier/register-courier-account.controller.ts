import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
} from "@nestjs/common";
import { z } from "zod";

import { RegisterCourierUseCase } from "@/domain/delivery/application/use-case/courier/register-courier";
import { CourierAlreadyExistsError } from "@/domain/delivery/application/use-case/errors/courier-already-exists-error";
import { Public } from "@/infra/auth/public";

import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";

const registerCourierAccountBodySchema = z.object({
  name: z.string(),
  registerNumber: z.string(),
  password: z.string().min(5),
});

const bodyValidationPipe = new ZodValidationPipe(registerCourierAccountBodySchema);

type RegisterCourierAccountBodySchema = z.infer<typeof registerCourierAccountBodySchema>;

@Controller("/courier/accounts")
@Public()
export class RegisterCourierAccountController {
  // eslint-disable-next-line no-unused-vars
  constructor(private registerCourier: RegisterCourierUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: RegisterCourierAccountBodySchema,
  ): Promise<void> {
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
