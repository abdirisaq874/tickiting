import { Publisher, Subjects, TicketUpdatedEvent } from "@mandeezticketing/common/build";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
