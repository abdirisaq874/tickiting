import express, { Request, Response } from 'express';
import { ticket } from '../models/tickets';
const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
  const Tickets = await ticket.find({
    orderId:undefined
  });
  res.send(Tickets);
});

export { router as indexTicketRouter };
