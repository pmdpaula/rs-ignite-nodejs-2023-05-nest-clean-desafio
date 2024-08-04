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

const authenticateBodySchema = z.object({
  registerNumber: z.string(),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller("/sessions")
@Public()
export class AuthenticateController {
  // eslint-disable-next-line no-unused-vars
  constructor(private authenticateCourier: AuthenticateCourierUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
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
