import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from "@nestjs/common";
import { z } from "zod";

import { WrongCredentialsError } from "@/domain/delivery/application/use-case/errors/wrong-credentials-error";
import { AuthenticateReceiverUseCase } from "@/domain/delivery/application/use-case/receiver/authenticate-receiver";
import { Public } from "@/infra/auth/public";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";

const authenticateReceiverBodySchema = z.object({
  phone: z.string(),
  password: z.string(),
});

type AuthenticateReceiverBodySchema = z.infer<typeof authenticateReceiverBodySchema>;

@Controller("/receiver/sessions")
@Public()
export class AuthenticateReceiverController {
  // eslint-disable-next-line no-unused-vars
  constructor(private authenticateReceiver: AuthenticateReceiverUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateReceiverBodySchema))
  async handle(@Body() body: AuthenticateReceiverBodySchema) {
    const { phone, password } = body;

    const result = await this.authenticateReceiver.execute({
      phone,
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
