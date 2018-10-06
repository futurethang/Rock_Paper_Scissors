// HTML WRITING VARIABLES
var userText = document.getElementById("user");
var computerText = document.getElementById("computer");
var result = document.getElementById("result");
var userScore = document.getElementById("userScore");
var computerScore = document.getElementById("computerScore");
var html_user_image = document.getElementById("user_image");
var html_cpu_image = document.getElementById("cpu_image");
var num_games = document.getElementById("games");

// GAME READY DOM
function gameChoiceReset() {
  html_user_image.src = "images/placeholder.jpg"
  html_cpu_image.src = "images/placeholder.jpg"
}

// GAME DOM UPDATES
function updateImage(image) {
  html_user_image.src = "images/" + image + ".jpg"
}

function updateUserTextUnderImage(text) {
  userText.textContent = text.toUpperCase();
}

function updateComputerTextUnderImage(text) {
  computerText.textContent = text.toUpperCase();
}

function resultTextUpdate(winLose) {
  if (winLose === "win") {
    result.textContent = "WIN";
    result.style = "color: rgb(245, 188, 74)";
  } else {
    result.textContent = "YOU LOSE";
    result.style = "color: rgb(243, 102, 82)";
  }
}

function scoreUpdates() {
  userScore.textContent = userScore_count;
  computerScore.textContent = computerScore_count;
}

// SET THE FIREBASE VARIABLES
var fbRef = firebase.database().ref();

fbRef.set(
  {
    player1pick: '',
    computerpick: '',
    bothSubmitted: false,
    winner: '',
  }
)
// the user selects a play and hits "submit"
// requires action to store the selection in variable to send to fbRef
// requires submit DOM element
// "Submit" writes the user choice to the right firebase ref for that player
// fbRef.push(player1selection, player2selection,);
// it waits for a second input to move forward
// once a choice is made by both players, it runs to compare the selections
// game(player1selection, player2selection);
// displays are updated for each player
// 
// values for games won/lost are written to fbRef
// fbRef.set(winner, loser);
// new game ready

// SET THE USER AND COMPUTER VARIABLES      
var computerChoices = ["rock", "paper", "scissors"];
var userScore_count = 0;
var computerScore_count = 0;
var num_games_count = 0;
var userGuess;
var computerGuess = function () { return computerChoices[Math.floor(Math.random() * computerChoices.length)]; }
var computerReturn = function (play) {
  var text;
  switch (play) {
    case "rock":
      text = "ROCK"
      html_cpu_image.src = "images/rock.jpg"
      break;
    case "paper":
      text = "PAPER"
      html_cpu_image.src = "images/paper.jpg"
      break;
    case "scissors":
      text = "SCISSORS"
      html_cpu_image.src = "images/scissors.jpg"
      break;
  }
  return text;
}

$(".rps_pick").on("click", function () {
  userGuess = $(this).prop('id');
  updateUserTextUnderImage(userGuess);
  updateImage(userGuess);
  let play = computerGuess();

  fbRef.set({
    player1pick: userGuess,
    computerpick: play
  })

  updateComputerTextUnderImage(computerReturn(play));
  return game(userGuess, play);
})

// THIS FUNCTION RUNS THE GAME CONDITIONS
let game = function (user, computer) {
  num_games_count++;
  num_games.textContent = num_games_count;

  if (user == computer) {
    result.textContent = "Tie!";
    result.style = "color: rgb(99, 189, 187)";
  } else if (user == "rock") {
    if (computer == "scissors") {
      userScore_count = userScore_count + 1;
      resultTextUpdate('win');
    } else if (computer == "paper") {
      computerScore_count = computerScore_count + 1;
      resultTextUpdate('lose');
    }
  } else if (user == "paper") {
    if (computer == "rock") {
      userScore_count = userScore_count + 1;
      resultTextUpdate('win');
    } else if (computer == "scissors") {
      computerScore_count = computerScore_count + 1;
      resultTextUpdate('lose');
    }
  } else if (user == "scissors") {
    if (computer == "paper") {
      userScore_count++;
      resultTextUpdate('win');

    } else if (computer == "rock") {
      computerScore_count = computerScore_count + 1;
      resultTextUpdate('lose');
    }
  }
  scoreUpdates();
}


// MODAL POPS UP TO TAKE PLAYER NAME
// GAME CHECKS AGAINST FBDB TO SEE IF NAME EXISTS AND IF THERE ARE 2 PLAYERS TO START GAME
fbRef.set({
  playerName1: '',
  playerName2: '',
  playerPick1: '',
  playerPick2: '',
  gamesPlayed: 0,
  playerWins1: 0,
  playerWins2: 0,
  ties: 0,
}
// INITIALIZE FBDB OBJECT TO KEEP SCORE AND STORE PICKS
// MODAL IS GONE
// DOM PROVIDES 3 PICKS TO CHOOSE FROM
// USER'S SELECTION UPDATES FBDB
// FBDB WAITS FOR BOTH USERS TO SUBMIT, THEN RUNS GAME LOGIC TO FIND WINNER
// DOM READS FBDB OBJECT TO SELECT AND WRITE WIN/LOSE MESSAGE ON USERS CLIENT, UPDATE GAME, W/L COUNTS
// RESET BUTTON TO SET DOM TO ALLOW PICKS FOR NEXT GAME AND REPEAT

