import { Publisher, OrderCreatedEvent, Subjects } from "@mandeezticketing/common/build";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
