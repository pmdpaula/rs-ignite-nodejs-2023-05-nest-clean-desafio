import { Attachment, OrderStatus } from "@prisma/client";

import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface OrderProps {
  authorId: UniqueEntityID;
  address: string;
  latitude: number;
  longitude: number;
  status: OrderStatus;
  attachments: Attachment[];
  courierId?: UniqueEntityID | null;
  createdAt: Date;
  updatedAt?: Date;
}

export class Order extends Entity<OrderProps> {
  get authorId() {
    return this.props.authorId;
  }

  get address() {
    return this.props.address;
  }

  get latitude() {
    return this.props.latitude;
  }

  set latitude(latitude: number) {
    this.props.latitude = latitude;
  }

  get longitude() {
    return this.props.longitude;
  }

  set longitude(longitude: number) {
    this.props.longitude = longitude;
  }

  get status() {
    return this.props.status;
  }

  set status(status: OrderStatus) {
    this.props.status = status;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get attachments() {
    return this.props.attachments;
  }

  set attachments(attachments: Attachment[]) {
    this.props.attachments = attachments;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<OrderProps, "createdAt" | "courierId" | "status" | "attachments">,
    id?: UniqueEntityID,
  ) {
    const order = new Order(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        status: "PENDING",
        attachments: [],
      },
      id,
    );

    return order;
  }
}
