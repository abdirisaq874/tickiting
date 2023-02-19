import { Subjects, Publisher, OrderCancelledEvent } from "@mandeezticketing/common/build";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
