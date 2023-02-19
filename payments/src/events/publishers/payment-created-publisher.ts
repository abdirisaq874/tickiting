import { Subjects, Publisher, PaymentCreatedEvent } from "@mandeezticketing/common/build";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
