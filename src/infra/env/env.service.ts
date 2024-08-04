import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Env } from "./env";

@Injectable()
export class EnvService {
  // eslint-disable-next-line no-unused-vars
  constructor(private configService: ConfigService<Env, true>) {}

  get<T extends keyof Env>(key: T) {
    return this.configService.get(key, { infer: true });
  }
}
