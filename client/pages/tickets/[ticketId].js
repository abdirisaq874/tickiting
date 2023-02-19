import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import TicketDetails from '../../components/TicketDetails';
import useRequest from '../../hooks/use-request';

const TicketShow = () => {
  const [ticket, setticket] = useState([]);
  const router = useRouter();
  const { ticketId } = router.query;
  const { doRequest, errors } = useRequest({
    url: `/api/tickets/${ticketId}`,
    method: 'get',
    body: {
      ticketId,
    },
  });

  useEffect(() => {
    const fetchticket = async () => {
      setticket(await doRequest());
    };
    fetchticket();
  }, []);

  return (
    <div className="container">
      {errors ? errors : <TicketDetails ticket={ticket} />}
    </div>
  );
};

export default TicketShow;
