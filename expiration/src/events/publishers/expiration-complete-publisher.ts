import { Publisher, ExpirationCompleteEvent, Subjects } from '@gbticket/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
