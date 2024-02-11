const { CreatePaymentRequest, Client, Environment} = require('square');
const schedule = require('node-schedule');
const {randomUUID} = require("crypto");
const {getBookedAppointment} = require("./booking");

const { paymentsApi } = new Client({
    accessToken: process.env.SQUAREUP_ACCESS,
    environment: Environment.Production,
    timeout: 30000
});

const createPaymentRequest = async (customerId, cardId, bookingId, accessToken) => {
    const bookingData = await getBookedAppointment(bookingId, accessToken);
    console.log(bookingData, 14);
    return null;
    const paymentRequest = {
        customerId: customerId,
        sourceId: cardId,
        amountMoney: {
            amount: 10000,
            currency: 'USD',
        },
        idempotencyKey: randomUUID(),
    };

    // Make the API call to create the payment
    paymentsApi.createPayment(paymentRequest)
        .then(({ result }) => {
            console.log('Payment Successful:', result.payment);
        })
        .catch(error => {
            console.error('Payment Error:', error);
        });
}

module.exports = {createPaymentRequest};