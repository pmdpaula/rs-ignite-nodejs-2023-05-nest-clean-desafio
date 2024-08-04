import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { Encrypter } from "@/domain/delivery/application/cryptography/encrypter";

@Injectable()
export class JwtEncrypter implements Encrypter {
  // eslint-disable-next-line no-unused-vars
  constructor(private jwtService: JwtService) {}

  encrypt(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
