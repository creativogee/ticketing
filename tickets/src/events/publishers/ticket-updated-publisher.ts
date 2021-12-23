import { Publisher, Subjects, TicketUpdatedEvent } from '@gbticket/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
