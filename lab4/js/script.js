let randomNumber;
let attempts;
let maxAttempts = 7;
let wins = 0;
let losses = 0;

const guessInput = document.querySelector("#guessInput");
const guessButton = document.querySelector("#guessButton");
const resetButton = document.querySelector("#resetButton");

const guessResult = document.querySelector("#guessResult");
const highlow = document.querySelector("#highlow");
const attemptsLeft = document.querySelector("#attemptsLeft");
const score = document.querySelector("#score");

guessButton.addEventListener("click", checkGuess);
resetButton.addEventListener("click", initializeGame);

initializeGame();

function initializeGame() {
    randomNumber = Math.floor(Math.random() * 99) + 1;
    attempts = 0;

    guessResult.textContent = "";
    highlow.textContent = "";
    attemptsLeft.textContent = "Attempts Left: " + maxAttempts;
    score.textContent = "Wins: " + wins + " | Losses: " + losses;

    guessInput.value = "";
    guessInput.focus();

    guessButton.style.display = "inline-block";
    resetButton.style.display = "none";

    console.log("Random Number:", randomNumber);
}

function checkGuess() {
    let guess = Number(guessInput.value);

    if (guess < 1 || guess > 99 || isNaN(guess)) {
        guessResult.textContent = "Enter a valid number between 1 and 99!";
        guessResult.style.color = "red";
        return;
    }

    attempts++;
    attemptsLeft.textContent = "Attempts Left: " + (maxAttempts - attempts);

    if (guess === randomNumber) {
        guessResult.textContent = "🎉 Correct! You guessed it!";
        guessResult.style.color = "green";
        highlow.textContent = "";
        wins++;
        endGame();
    } 
    else if (attempts === maxAttempts) {
        guessResult.textContent = " You lost! Number was " + randomNumber;
        guessResult.style.color = "red";
        highlow.textContent = "";
        losses++;
        endGame();
    } 
    else if (guess < randomNumber) {
        guessResult.textContent = "";
        highlow.textContent = "Too Low! Try Higher.";
    } 
    else {
        guessResult.textContent = "";
        highlow.textContent = "Too High! Try Lower.";
    }

    score.textContent = "Wins: " + wins + " | Losses: " + losses;
    guessInput.value = "";
    guessInput.focus();
}

function endGame() {
    guessButton.style.display = "none";
    resetButton.style.display = "inline-block";
}
