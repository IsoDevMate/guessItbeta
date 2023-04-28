const express = require('express');
const bodyParser = require('body-parser');
// const africasTalking = require('africastalking');
const cors = require('cors');

const credentials = {
    apiKey: '44e9f0e669a7674dd32d256079c913228f78dc9a91e4a3800de1f8dd4d540f3a',
    username: 'testprime',  
}
// Set up the Africa's Talking API
const connectAt = require('africastalking')(credentials);
// console.log(connectAt);
const airtime = connectAt.AIRTIME;

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Route to handle user attempts
app.post('/attempts', (req, res) => {
    // numAttempts++;
    const { attemptsCount, phoneNumber } = req.body; //frontend
    console.log(`Attempts count received: ${attemptsCount}` );
    console.log(phoneNumber);
    if (attemptsCount % 2 === 0) {
        // const phoneNumber = req.body.phoneNumber;
        const amount = 5; // award of 2 KES airtime
        const currencyCode = 'KES';
        const options = {
            maxNumRetry: 3, // Will retry the transaction every 60seconds for the next 3 hours.
            recipients: [{
                phoneNumber: phoneNumber,
                currencyCode: currencyCode,
                amount: amount
            }]
        };
    
        airtime.send(options)
            .then(response => {
                console.log(response);
                res.status(200).json({ message: 'Airtime awarded successfully.' });
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({ message: 'Failed to award airtime.' });
            });
    } else {
        res.status(200).json({ message: 'Attempts recorded.' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
