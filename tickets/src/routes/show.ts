import express, { Request, Response } from 'express';
import {
  NotFound,
} from '@mandeezticketing/common/build';
import { ticket } from '../models/tickets';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
    const Ticket = await ticket.findById(req.params.id);
    if (!Ticket) {
      throw new NotFound();
    }

    res.send(Ticket);
 
});

export { router as showTicketRouter };
