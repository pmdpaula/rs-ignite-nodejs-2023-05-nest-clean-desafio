import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface ReceiverProps {
  name: string;
  phone: string;
  password: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Receiver extends AggregateRoot<ReceiverProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get phone() {
    return this.props.phone;
  }

  set phone(phone: string) {
    this.props.phone = phone;
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

  static create(props: Optional<ReceiverProps, "createdAt">, id?: UniqueEntityID) {
    const receiver = new Receiver(
      { ...props, createdAt: props.createdAt ?? new Date() },
      id,
    );

    return receiver;
  }
}
