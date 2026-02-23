let balance = 100;
const playBtn = document.getElementById("playBtn");
const resultText = document.getElementById("result");
const balanceDisplay = document.getElementById("balanceDisplay");
const betInput = document.getElementById("betAmount");
const diceImage = document.getElementById("diceImage");
const diceImages = [
    "https://upload.wikimedia.org/wikipedia/commons/1/1b/Dice-1-b.svg",
    "https://upload.wikimedia.org/wikipedia/commons/5/5f/Dice-2-b.svg",
    "https://upload.wikimedia.org/wikipedia/commons/b/b1/Dice-3-b.svg",
    "https://upload.wikimedia.org/wikipedia/commons/f/fd/Dice-4-b.svg",
    "https://upload.wikimedia.org/wikipedia/commons/0/08/Dice-5-b.svg",
    "https://upload.wikimedia.org/wikipedia/commons/2/26/Dice-6-b.svg"
];

function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function updateBalanceDisplay() {
    balanceDisplay.textContent = "Balance: $" + balance;
}

playBtn.addEventListener("click", function () {

    let bet = parseInt(betInput.value);

    if (isNaN(bet) || bet <= 0) {
        resultText.textContent = "Enter a valid bet amount!";
        resultText.className = "";
        return;
    }

    if (bet > balance) {
        resultText.textContent = "Not enough balance!";
        resultText.className = "";
        return;
    }

    let playerRoll = rollDice();
    let computerRoll = rollDice();

    diceImage.src = diceImages[playerRoll - 1];

    if (playerRoll > computerRoll) {
        balance += bet;
        resultText.textContent = "You rolled " + playerRoll + 
            ", Computer rolled " + computerRoll + ". You Win!";
        resultText.className = "win";
        document.body.style.backgroundColor = "#004d00";
    } else if (playerRoll < computerRoll) {
        balance -= bet;
        resultText.textContent = "You rolled " + playerRoll + 
            ", Computer rolled " + computerRoll + ". You Lose!";
        resultText.className = "lose";
        document.body.style.backgroundColor = "#4d0000";
    } else {
        resultText.textContent = "Tie! No money lost.";
        resultText.className = "";
        document.body.style.backgroundColor = "#1e1e2f";
    }

    updateBalanceDisplay();
});
betInput.addEventListener("input", function () {
    if (betInput.value > balance) {
        betInput.style.border = "3px solid red";
    } else {
        betInput.style.border = "none";
    }
});
