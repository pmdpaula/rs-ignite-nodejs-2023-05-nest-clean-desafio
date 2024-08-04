import { UseCaseError } from "@/core/errors/use-case-error";

export class ReceiverAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Receiver "${identifier}" already exists.`);
  }
}
