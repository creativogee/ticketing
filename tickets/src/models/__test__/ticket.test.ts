import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
  //create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });

  //save the ticket to the database
  await ticket.save();

  //fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  //make two separate changes to the tickets we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  //save the first fetched ticket
  await firstInstance!.save();

  //save the second fetched ticket and expect an
  try {
    await secondInstance!.save();
  } catch (error) {
    return;
  }
});

it('increments the version number on multiple save', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  //introduce changes 1
  ticket.title = 'movie';
  await ticket.save();
  expect(ticket.version).toEqual(1);

  //introduce changes 2
  ticket.price = 10;
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
