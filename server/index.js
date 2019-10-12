require('dotenv').config()

const express = require('express');
const path = require('path');
const TeleSignSDK = require('telesignsdk');

const app = new express();
const PORT = process.env.PORT || 80;
const customerId = process.env.CUSTOMER_ID;
const apiKey = process.env.API_KEY;
const rest_endpoint = "https://rest-api.telesign.com";
const timeout = 10 * 1000;

const client = new TeleSignSDK(customerId,
  apiKey,
  rest_endpoint,
  timeout
);

app.use(express.static(path.join(__dirname, '../client/')));

app.get('/script', (req, res) => {
  let responseBody;

  res.setHeader('Content-Type', 'text/xml');
  res.send(responseBody);
});

app.get('/sms', (req, res) => {
  const {
    phoneNumber,
    message
  } = req.query;

  const messageType = "ARN";

  function messageCallback(error, responseBody) {
    let response;
    if (error === null) {
      response = `Messaging response for messaging phone number: ${phoneNumber}` +
        ` => code: ${responseBody['status']['code']}` +
        `, description: ${responseBody['status']['description']}`;
    } else {
      response = "Unable to send message. " + error;
    }

    res.send(response);
  }
  client.sms.message(messageCallback, phoneNumber, message, messageType);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
})
