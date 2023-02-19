import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  RequireAuth,
  ValidateRequest,
  BadRequestError,
  NotAuthorizedError,
  NotFound,
  OrderStatus,
} from "@mandeezticketing/common/build";
import { stripe } from "../stripe";
import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/payments",
  RequireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  ValidateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFound();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for an cancelled order");
    }
    if (order.status === OrderStatus.Complete) {
      throw new BadRequestError("this order is already been paid");
    }

    const charge = await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100,
      source: token,
    });
    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });
    await payment.save();
    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });
    console.log(order.version)
    order.set({ status: OrderStatus.Complete});
    await order.save();
    console.log(order.version)
    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
