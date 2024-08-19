import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from "@nestjs/common";
import { z } from "zod";

import { AuthenticateCourierUseCase } from "@/domain/delivery/application/use-case/courier/authenticate-courier";
import { WrongCredentialsError } from "@/domain/delivery/application/use-case/errors/wrong-credentials-error";
import { Public } from "@/infra/auth/public";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";

const authenticateCourierBodySchema = z.object({
  registerNumber: z.string(),
  password: z.string(),
});

type AuthenticateCourierBodySchema = z.infer<typeof authenticateCourierBodySchema>;

@Controller("/courier/sessions")
@Public()
export class AuthenticateCourierController {
  // eslint-disable-next-line no-unused-vars
  constructor(private authenticateCourier: AuthenticateCourierUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateCourierBodySchema))
  async handle(@Body() body: AuthenticateCourierBodySchema) {
    const { registerNumber, password } = body;

    const result = await this.authenticateCourier.execute({
      registerNumber,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken } = result.value;

    return {
      access_token: accessToken,
    };
  }
}
