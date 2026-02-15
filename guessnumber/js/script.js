
document.querySelector("#guessBtn").addEventListener("click", checkGuess);
document.querySelector("#resetBtn").addEventListener("click", initializeGame);


let randomNumber;
let attempts;
let totalWins = 0;
let totalLosses = 0;
let maxAttempts = 7;

initializeGame();

function initializeGame() {
    randomNumber = Math.floor(Math.random() * 99) + 1;
    attempts = 0;

    console.log("Random Number: " + randomNumber);

    document.querySelector("#guessBtn").style.display = "inline-block";
    document.querySelector("#resetBtn").style.display = "none";

    document.querySelector("#playerGuess").value = "";
    document.querySelector("#playerGuess").focus();

    document.querySelector("#feedback").textContent = "";
    document.querySelector("#previousGuesses").textContent = "";
    document.querySelector("#attemptsLeft").textContent = 
        "Attempts Left: " + maxAttempts;

    updateScore();
}

function checkGuess() {
    let guess = Number(document.querySelector("#playerGuess").value);
    let feedback = document.querySelector("#feedback");
    let previous = document.querySelector("#previousGuesses");

    feedback.textContent = "";

    if (guess < 1 || guess > 99 || isNaN(guess)) {
        feedback.textContent = "⚠ Enter a number between 1 and 99.";
        feedback.style.color = "red";
        return;
    }

    attempts++;

    previous.textContent += guess + " ";
    document.querySelector("#attemptsLeft").textContent =
        "Attempts Left: " + (maxAttempts - attempts);

    if (guess === randomNumber) {
        feedback.textContent = 
            "🎉 You got it in " + attempts + " attempts!";
        feedback.style.color = "green";
        totalWins++;
        gameOver();
    }
    else if (attempts === maxAttempts) {
        feedback.textContent = 
            "❌ You lost! The number was " + randomNumber;
        feedback.style.color = "red";
        totalLosses++;
        gameOver();
    }
    else if (guess < randomNumber) {
        feedback.textContent = "⬆ Too low! Try higher.";
        feedback.style.color = "#1e88e5";
    }
    else {
        feedback.textContent = "⬇ Too high! Try lower.";
        feedback.style.color = "#1e88e5";
    }

    updateScore();
    document.querySelector("#playerGuess").value = "";
    document.querySelector("#playerGuess").focus();
}

function gameOver() {
    document.querySelector("#guessBtn").style.display = "none";
    document.querySelector("#resetBtn").style.display = "inline-block";
}

function updateScore() {
    document.querySelector("#score").textContent =
        "Wins: " + totalWins + " | Losses: " + totalLosses;
}
