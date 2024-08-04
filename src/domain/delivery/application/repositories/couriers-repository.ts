/* eslint-disable no-unused-vars */
import { Courier } from "../../enterprise/entities/courier";

export abstract class CouriersRepository {
  abstract findByRegisterNumber(email: string): Promise<Courier | null>;
  abstract create(courier: Courier): Promise<void>;
}
