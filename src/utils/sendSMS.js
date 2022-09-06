import twilio from 'twilio';
import catchAsync from './catchAsync';
import AppError from './appError';

const sendSMS = catchAsync(async (options) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twillioPhone = process.env.TWILIO_PHONE_NUMBER;

  // eslint-disable-next-line new-cap
  const client = new twilio(accountSid, authToken);

  if (!options.clientPhone.startsWith('+250')) {
    return new AppError(
      'Invalid Phone number format please use +250... format',
      400
    );
  }

  await client.messages.create({
    body: `${options.message}`,
    from: `${twillioPhone}`,
    to: `${options.clientPhone}`,
  });
});

export default sendSMS;
