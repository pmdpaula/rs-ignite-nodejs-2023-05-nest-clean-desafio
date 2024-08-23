import { UserRole } from "@prisma/client";

import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface CourierProps {
  name: string;
  registerNumber: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt?: Date;
}

export class Courier extends AggregateRoot<CourierProps> {
  get name() {
    return this.props.name;
  }
  set name(name: string) {
    this.props.name = name;
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

  get role() {
    return this.props.role;
  }

  set role(role: UserRole) {
    this.props.role = role;
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
