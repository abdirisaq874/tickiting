import { Publisher, Subjects, TicketCreatedEvent } from "@mandeezticketing/common/build";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
