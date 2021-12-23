import { Publisher, Subjects, TicketCreatedEvent } from '@gbticket/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
