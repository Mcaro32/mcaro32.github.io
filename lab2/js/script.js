//alert("running external JS code!")

// Event listeners
document.querySelector("#guessBtn").addEventListener("click", checkGuess);
document.querySelector("#resetBtn").addEventListener("click", initializeGame);
//Global variables
let randomNumber;
let attempts = 0;
let wins = 0;
let losses = 0;
const maxAttempts = 7;

initializeGame();

function initializeGame() {
  randomNumber = Math.floor(Math.random() * 99) + 1;
  console.log("Random Number: " + randomNumber);
  attempts = 0;
  document.querySelector("#attemptsLeft").textContent = maxAttempts;
  // Hiding the reset button
  document.querySelector("#resetBtn").style.display = "none";

// Showing the guess button
document.querySelector("#guessBtn").style.display = "inline";

let playerGuess = document.querySelector("#playerGuess");
playerGuess.focus(); // adding focus to textbox
playerGuess.value = ""; // Clearing the textbox

let feedback = document.querySelector("#feedback");
feedback.textContent = ""; //Clearing the feedback
feedback.style.color = "white";
//clearing previous guesses
document.querySelector("#guesses").textContent = "";

}

function checkGuess() {
  let feedback = document.querySelector("#feedback");
  feedback.textContent = "";

  let guess = document.querySelector("#playerGuess").value;
  guess = Number(guess);
  console.log("player guess: " + guess);

  if (guess < 1 || guess > 99) {
    feedback.textContent = "Enter a number between 1 and 99";
    feedback.style.color = "red";
    return; // Exits the function if an error message is shown
}
    attempts++;
    console.log("Attempts: " + attempts);
    document.querySelector("#attemptsLeft").textContent = maxAttempts - attempts;
    document.querySelector("#playerGuess").value = "";
    document.querySelector("#playerGuess").focus();
    feedback.style.color = "orange";
    if (guess == randomNumber) {
      feedback.textContent = "You guessed it! You won!";
      feedback.style.color = "darkgreen";
      wins++;
      document.querySelector("#wins").textContent = wins;
      gameOver();
    } else {
      document.querySelector("#guesses").textContent += guess + " ";
      if (attempts == maxAttempts) {
        feedback.textContent = "Sorry, you lost! The number was " + randomNumber;
        feedback.style.color = "red";
        losses++;
        document.querySelector("#losses").textContent = losses;
        gameOver();
      } else if (guess > randomNumber) {
        feedback.textContent = "Guess was high";
      } else {
      feedback.textContent = "Guess was low";
    }
  }
}

function gameOver() {
  let guessBtn = document.querySelector("#guessBtn");
  let resetBtn = document.querySelector("#resetBtn");
  guessBtn.style.display = "none"; // hides guess button
  resetBtn.style.display = "inline"; // displays reset button
}
