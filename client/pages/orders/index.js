import axios from 'axios';
import { useEffect, useState } from 'react';
import useRequest from '../../hooks/use-request';

const OrderIndex = () => {
  const [orders, setorders] = useState(null);
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'get',
  });

  useEffect(() => {
    const fetchOrders = async () => {
      setorders(await doRequest());
    };
    fetchOrders();
  }, []);
  return (
    <div className="container">
      <ul>
        {orders &&
          orders.map((order) => {
            return (
              <li key={order.id}>
                {order.ticket.title} - {order.status}
              </li>
            );
          })}
      </ul>
      {errors}
    </div>
  );
};

export default OrderIndex;
