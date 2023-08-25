// Global constants
// How long to pause in between clues
const cluePauseTime = 333;
// How long to wait before starting playback of the clue sequence
const nextClueWaitTime = 1000;

// Global Variables
var pattern = [1, 2, 4, 3, 1, 2, 1, 2];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.3;
var guessCounter = 0;
var buttonNumber = 1;
var clueHoldTime = 1000;
var difficultyLevel = 1;
var difficultyMultiplier = 0;
var mistakes = 0;

function changeDifficulty() {
  stopGame();

  if (difficultyLevel == 3) {
    difficultyLevel = 1;
  } else {
    difficultyLevel++;
  }

  switch (difficultyLevel) {
    case 1:
      difficultyMultiplier = 0;
      alert("Difficulty: Easy");
      break;
    case 2:
      difficultyMultiplier = 1;
      alert("Difficulty: Medium");
      break;
    case 3:
      difficultyMultiplier = 1.65;
      alert("Difficulty: Hard");
      break;
  }
}

function startGame() {
  // Initialize game variables
  console.log(difficultyLevel);
  console.log(difficultyMultiplier);

  clueHoldTime = 1000;
  progress = 0;
  guessCounter = 0;
  gamePlaying = true;
  mistakes = 0;

  // Make stop button appear and start button disappear
  document.getElementById("stopBtn").classList.remove("hidden");
  document.getElementById("startBtn").classList.add("hidden");

  playClueSequence();
}

function stopGame() {
  gamePlaying = false;

  // Make start button appear and stop button disappear.
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

function winGame() {
  stopGame();
  alert("Game Over. You won!!!");
}

function loseGame() {
  stopGame();
  alert("Game Over. You lost... :(");
}

function addButton() {
  stopGame();
  document.getElementById("remove").classList.remove("disabled");
  if (buttonNumber < 4) {
    console.log( 4 + buttonNumber);
    document
      .getElementById("button" + (buttonNumber + 4))
      .classList.remove("hidden");
    console.log("button appears");
    
    buttonNumber++;
  } else if (buttonNumber == 4) {
    document
      .getElementById("button" + (buttonNumber + 4))
      .classList.remove("hidden");
    console.log( 4 + buttonNumber);
    console.log("button appears");
    document.getElementById("add").classList.add("disabled");
  }
}

function removeButton() {
  stopGame();
  document.getElementById("add").classList.remove("disabled");
  if (buttonNumber > 1) {   
    console.log( 4 + buttonNumber);
    document
      .getElementById("button" + (buttonNumber + 4))
      .classList.add("hidden");
    console.log("button disappears")
    buttonNumber--;
    
  } else if (buttonNumber == 1) {
    document
      .getElementById("button" + (buttonNumber + 4))
      .classList.add("hidden");
    console.log( 4 + buttonNumber);
    console.log("button disappears")
    document.getElementById("remove").classList.add("disabled");
  }
}

function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}
function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

function guess(btn) {
  //console.log("user guessed: " + btn);
  if (!gamePlaying) {
    return;
  }

  /*
  What I need to achieve:
  
  Check if the guess is the right one in the sequence,
  Call loseGame() if guess is wrong,
  After making all the correct guesses for the sequence, call playClueSequence(,
  Call the winGame() function when the progress counter is equal to pattern.length
    (Check this in the playClueSequence() to prevent have to do last round twice),
  */

  // If guess is correct: continue game
  if (btn == pattern[guessCounter]) {
    console.log("before guessCounter: " + guessCounter);
    guessCounter++;
    console.log(" after guessCounter: " + guessCounter);

    if (guessCounter > progress) {
      console.log("before progress: " + progress);
      progress++;
      console.log(" after progress: " + progress);
      if (progress == pattern.length) {
        winGame();
      }
      playClueSequence();
    }
  } else {
    mistakes++;
    alert("You have " + (3 - mistakes) + " attempt(s) remaining.")
    if (mistakes >= 3) {
      loseGame();
      
    } 
    playClueSequence();
  }
}

// Sound Synthesis Functions
const freqMap = {
  1: 150,
  2: 200,
  3: 250,
  4: 300,
  5: 325,
  6: 350,
  7: 375,
  8: 400,
};
function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume();
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
}
function startTone(btn) {
  if (!tonePlaying) {
    context.resume();
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    context.resume();
    tonePlaying = true;
  }
}
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  guessCounter = 0;
  context.resume();
  // Set delay to initial wait time
  let delay = nextClueWaitTime;
  // For each clue that is revealed so far
  clueHoldTime -= (difficultyMultiplier * 40 * progress) / 2;
  console.log(clueHoldTime);
  for (let i = 0; i <= progress; i++) {
    //console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    // Set a timeout to play that clue
    setTimeout(playSingleClue, delay, pattern[i]);
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}
