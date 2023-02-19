import { ticket } from "../tickets";

it("implements optimistic concurrency control", async () => {
  // Create an instance of a ticket
  const Ticket = ticket.build({
    title: "concert",
    price: 5,
    UserId: "123",
  });

  // Save the ticket to the database
  await Ticket.save();

  // fetch the ticket twice
  const firstInstance = await ticket.findById(Ticket.id);
  const secondInstance = await ticket.findById(Ticket.id);

  // make two separate changes to the tickets we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  // save the first fetched ticket
  await firstInstance!.save();

  // save the second fetched ticket and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error("Should not reach this point");
});

it("increments the version number on multiple saves", async () => {
  const Ticket = ticket.build({
    title: "concert",
    price: 20,
    UserId: "123",
  });

  await Ticket.save();
  expect(Ticket.version).toEqual(0);
  await Ticket.save();
  expect(Ticket.version).toEqual(1);
  await Ticket.save();
  expect(Ticket.version).toEqual(2);
});
