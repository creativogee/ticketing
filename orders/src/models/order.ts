import mongoose from 'mongoose';
import { OrderStatus } from '@gbticket/common';
import { TicketDoc } from './ticket';

interface IOrder {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
  version: number; //add version to the interface
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: IOrder): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },

    expiresAt: mongoose.Schema.Types.Date,

    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    optimisticConcurrency: true, //enable optimistic concurrency
    versionKey: 'version', //replace '__v' with 'version' as the versioning field
  },
);

orderSchema.statics.build = (attrs: IOrder) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order, OrderStatus };
