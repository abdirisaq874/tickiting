import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  RequireAuth,
  ValidateRequest,
} from '@mandeezticketing/common/build';
import { ticket } from '../models/tickets';

const router = express.Router();
import { natsWrapper } from "../nats-wrapper";
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';


router.post(
  "/api/tickets",
  RequireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  ValidateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const Ticket = ticket.build({
      title,
      price,
      UserId: req.currentUser!.id,
    });
    await Ticket.save();
    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: Ticket.id,
      title: Ticket.title,
      price: Ticket.price,
      userId: Ticket.UserId,
      version: Ticket.version,
    });

    res.status(201).send(Ticket);
  }
);

export { router as createTicketRouter };
