import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  ValidateRequest,
  NotFound,
  RequireAuth,
  NotAuthorizedError,
  BadRequestError,
} from "@mandeezticketing/common/build";
import { ticket } from "../models/tickets";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  RequireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be provided and must be greater than 0"),
  ],
  ValidateRequest,
  async (req: Request, res: Response) => {
    const Ticket = await ticket.findById(req.params.id);

    if (!Ticket) {
      throw new NotFound();
    }

    if (Ticket.orderId) {
      throw new BadRequestError("Cannot edit a reserved ticket");
    }
    
    if (Ticket.UserId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    Ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await Ticket.save();
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: Ticket.id,
      title: Ticket.title,
      price: Ticket.price,
      userId: Ticket.UserId,
      version: Ticket.version,
    });
    res.send(Ticket);
  }
);

export { router as updateTicketRouter };
