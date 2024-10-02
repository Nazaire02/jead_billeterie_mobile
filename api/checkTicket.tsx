export const checkTicket = async (ticketId: string) => {
    try {
      const response = await fetch("http://192.168.1.69:8081/api/customers/check-ticket", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            ticketId: ticketId,
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Une erreur inconnue est survenue.');
    }
  };
  