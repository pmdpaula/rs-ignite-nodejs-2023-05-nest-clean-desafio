/* eslint-disable no-unused-vars */
import { Courier } from "../../enterprise/entities/courier";

export abstract class CouriersRepository {
  abstract findById(id: string): Promise<Courier | null>;
  abstract findByRegisterNumber(email: string): Promise<Courier | null>;
  abstract create(courier: Courier): Promise<void>;
  abstract save(courier: Courier): Promise<void>;
  abstract delete(courier: Courier): Promise<void>;
}
