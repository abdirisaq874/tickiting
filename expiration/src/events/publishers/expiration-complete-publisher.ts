import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@mandeezticketing/common/build";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
