let phoneNumber = prompt("Please enter your phone number:");

if (phoneNumber) {
	console.log(`Phone number entered: ${phoneNumber}`);
	document.querySelector('#phone-number').innerHTML = `Phone number: ${phoneNumber}`;
  } else {
	console.log("No phone number entered.");
  }


const form = document.querySelector('form');
const attempts = document.querySelector('#attempts');
const hint = document.querySelector('#hint');
const balance = document.querySelector('#balance');
let accountBalance = 50;
balance.innerHTML = `$${accountBalance.toFixed(2)}`;
let generatedNumber = 0;
let guessCount = 0;
let stakeLocked = false;
let numAttempts = 0;

function generateRandomNumber() {
	// Generate a random 3-digit number
	const firstDigit = Math.floor(Math.random() * 9) + 1;
	const secondDigit = Math.floor(Math.random() * 3) + 1;
	const lastDigit = Math.floor(Math.random() * 10);
	return parseInt(`${firstDigit}${secondDigit}${lastDigit}`);
}

form.addEventListener('submit', (event) => {
	event.preventDefault();
	const number1 = parseInt(document.querySelector('#number1').value);
	const number2 = parseInt(document.querySelector('#number2').value);
	const number3 = parseInt(document.querySelector('#number3').value);
	const stake = parseInt(document.querySelector('#stake').value);
	const guessedNumber = parseInt(`${number1}${number2}${number3}`); // combine the input values into a single number
	if (guessCount === 0) {
		generatedNumber = generateRandomNumber(); // generate a random 3-digit number on the first guess
		stakeLocked = true; // lock the stake after the first guess attempt
	}
	if (accountBalance < stake) {
		alert(`Sorry, you don't have enough balance to stake $${stake}. Your account balance is $${accountBalance.toFixed(2)}.`);
		return;
	}
	if (guessedNumber === generatedNumber) {
		const result = (stake * guessedNumber) / 100; // divide the guessed number by 100 and multiply it by the stake
		accountBalance += result;
		balance.innerHTML = `$${accountBalance.toFixed(2)}`;
		alert(`Congratulations! You guessed the number and won $${result.toFixed(2)}!`);
		hint.innerHTML = '';
		guessCount = 0;
		stakeLocked = false;
		form.reset();
        numAttempts++;
		attempts.innerHTML = `${numAttempts} attempt(s)`;

		// fetch('http://localhost:3000/attempts', {
		// 			method: 'POST',
		// 			headers: {
		// 				'Content-Type': 'application/json'
		// 			},
		// 			body: JSON.stringify({ attemptsCount, phoneNumber })
					
		// 			})
		// 			.then(response => {
		// 				if (response.ok) {
		// 				console.log('Attempts count sent successfully');
		// 				} else {
		// 				console.error('Failed to send attempts count');
		// 				}
		// 			})
		// 			.catch(error => {
		// 				console.error('Error sending attempts count', error);
		// 			});


	} else {
		guessCount++;
		if (guessCount === 3) {
			accountBalance -= stake;
			balance.innerHTML = `$${accountBalance.toFixed(2)}`;
			hint.innerHTML = `Hint: The correct number was ${generatedNumber}. Please try again.`;
			guessCount = 0;
			stakeLocked = true;
			form.reset();
            numAttempts++;
		    attempts.innerHTML = `${numAttempts} attempt(s)`;
			const attemptsCount = numAttempts; // replace with the actual attempts count

					fetch('http://localhost:3000/attempts', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ attemptsCount, phoneNumber })
					
					})
					.then(response => {
						if (response.ok) {
						console.log('Attempts count sent successfully');
						} else {
						console.error('Failed to send attempts count');
						}
					})
					.catch(error => {
						console.error('Error sending attempts count', error);
					});

  console.log(attemptsCount)
  console.log(phoneNumber)
		} else {
			accountBalance -= stake;			balance.innerHTML = `$${accountBalance.toFixed(2)}`;
			const firstDigit = generatedNumber.toString()[0];
			const secondDigit = generatedNumber.toString()[1];
			const lastDigit = generatedNumber.toString()[2];
			const minSecondDigit = Math.max(1, parseInt(secondDigit) - 1);
			const maxSecondDigit = Math.min(9, parseInt(secondDigit) + 1);
			const hintText = `Hint: The first digit of the number is ${firstDigit}. The second digit of the number is between ${minSecondDigit} and ${maxSecondDigit}. The last digit of the number is ${lastDigit}. ${(guessedNumber < generatedNumber) ? 'Higher' : 'Lower'}. ${3 - guessCount} guesses remaining.`;
			hint.innerHTML = hintText;
            if (stakeLocked) {
				alert(`You can't change your stake after the first guess attempt.`);
				return;
			}
		}
	}
});




