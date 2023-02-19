import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { useRouter } from 'next/router';
import useRequest from '../../hooks/use-request';
import axios from 'axios';

const OrderShow = ({ currentUser }) => {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setorder] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest,errors,setErrors } = useRequest({
    url: `https://ticketing.dev/api/orders/${orderId}`,
    // method: 'post',
    // body: {
    //   orderId: order.id,
    // },
    onSuccess: () => router.push('/orders'),
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `https://ticketing.dev/api/orders/${orderId}`
        );
        return setorder(response.data);
      } catch (err) {
        setErrors(
          <div className="alert alert-danger">
            <h4>Ooops....</h4>
            <ul className="my-0">
              {err.response.data.errors ? (
                err.response.data.errors.map((err) => (
                  <li key={err.message}>{err.message}</li>
                ))
              ) : (
                <li>{err.response.data.message} </li>
              )}
            </ul>
          </div>
        );
      }
    };
    fetchOrders();
  }, [order]);

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div className="container">
      {order && (
        <div>
          Time left to pay: {timeLeft} seconds
          <StripeCheckout
            token={({ id }) => doRequest({ token: id })}
            stripeKey="pk_test_n4VaCuuITVb3MRu8A9KuME5x00eWPlsuGB"
            amount={order.ticket.price * 100}
            email={currentUser && currentUser.email}
          />
        </div>
      )}
      {errors}
    </div>
  );
};

export default OrderShow;
