import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

interface ITicket {
  id?: string;
  title: string;
  price: number;
}

interface IEvent {
  id: string;
  version: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number; //add version to the interface
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: ITicket): TicketDoc;
  findByEvent(event: IEvent): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        (ret.id = ret._id), delete ret._id;
      },
    },
    optimisticConcurrency: true, //enable optimistic concurrency
    versionKey: 'version',
  },
);

ticketSchema.statics.build = (attrs: ITicket) => {
  return new Ticket({ ...attrs, _id: attrs.id });
};

ticketSchema.statics.findByEvent = (event: IEvent) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this as any,
    status: {
      $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete],
    },
  });

  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
