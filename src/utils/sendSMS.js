import twilio from 'twilio';

const sendSMS = async (options) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twillioPhone = process.env.TWILIO_PHONE_NUMBER;

  // eslint-disable-next-line new-cap
  const client = new twilio(accountSid, authToken);

  await client.messages.create({
    body: `${options.message}`,
    from: `${twillioPhone}`,
    to: `${options.clientPhone}`,
  });
};

export default sendSMS;
