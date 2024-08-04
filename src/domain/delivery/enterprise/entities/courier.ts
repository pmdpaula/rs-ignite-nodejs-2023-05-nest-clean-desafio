import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface CourierProps {
  name: string;
  registerNumber: string;
  password: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Courier extends Entity<CourierProps> {
  get name() {
    return this.props.name;
  }

  get registerNumber() {
    return this.props.registerNumber;
  }

  get password() {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: Optional<CourierProps, "createdAt">, id?: UniqueEntityID) {
    const courier = new Courier(
      { ...props, createdAt: props.createdAt ?? new Date() },
      id,
    );

    return courier;
  }
}
