// HTML WRITING VARIABLES
var userText = document.getElementById("user");
var playerTwoText = document.getElementById("playerTwo");
var result = document.getElementById("result");
var userScore = document.getElementById("userScore");
var playerTwoScore = document.getElementById("playerTwoScore");
var html_user_image = document.getElementById("user_image");
var html_p2_image = document.getElementById("p2_image");
var num_games = document.getElementById("games");

// GAME READY DOM
function gameChoiceReset() {
  html_user_image.src = "images/placeholder.jpg"
  html_p2_image.src = "images/placeholder.jpg"
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
  playerTwoScore.textContent = playerTwoScore_count;
}

// SET THE FIREBASE VARIABLES
var fbRef = firebase.database().ref();

fbRef.set({
  playerName1: '',
  playerName2: '',
  playerPick1: '',
  playerPick2: '',
  gamesPlayed: 0,
  playerWins1: 0,
  playerWins2: 0,
  ties: 0,
})

// OPEN A LOG IN MODAL
$(window).on('load', function () {
  // can we wrap this in an 'if' to check local storage for a username?
  $('#usernameModal').modal('show');
});

// save username to local var and to database // !!!! UPDATE TO MY PARAMS !!!!!
$(document).on("click", ".username-btn", function () {
  username = $("#username").val().trim();
  var fNameRef = database.ref('users/' + username);
  fNameRef.transaction(function (currentData) {
    if (currentData === null) {
      return { fChoice: "" };
    } else {
      console.log('User already exists.');
      $('#usernameModalTitle').text('That name is already in use.')
      return; // Abort the transaction.
    }
  }, function (error, committed) {
    if (error) {
      console.log('Transaction failed abnormally!', error);
    } else if (!committed) {
      console.log('We aborted the transaction (because ' + username + ' already exists).');
    } else {
      console.log('User ' + username + ' added!');
      // check and create roomnumber
      findRoom();
      database.ref('users/' + username).onDisconnect().remove();
      $('#usernameModal').modal('hide');
    }
  });
});

// SET THE USER AND COMPUTER VARIABLES      
var computerChoices = ["rock", "paper", "scissors"];
var userScore_count = 0;
var playerTwoScore_count = 0;
var num_games_count = 0;
var userGuess;
var computerGuess = function () { return computerChoices[Math.floor(Math.random() * computerChoices.length)]; }
var computerReturn = function (play) {
  var text;
  switch (play) {
    case "rock":
      text = "ROCK"
      html_p2_image.src = "images/rock.jpg"
      break;
    case "paper":
      text = "PAPER"
      html_p2_image.src = "images/paper.jpg"
      break;
    case "scissors":
      text = "SCISSORS"
      html_p2_image.src = "images/scissors.jpg"
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
      playerTwoScore_count = playerTwoScore_count + 1;
      resultTextUpdate('lose');
    }
  } else if (user == "paper") {
    if (computer == "rock") {
      userScore_count = userScore_count + 1;
      resultTextUpdate('win');
    } else if (computer == "scissors") {
      playerTwoScore_count = playerTwoScore_count + 1;
      resultTextUpdate('lose');
    }
  } else if (user == "scissors") {
    if (computer == "paper") {
      userScore_count++;
      resultTextUpdate('win');

    } else if (computer == "rock") {
      playerTwoScore_count = playerTwoScore_count + 1;
      resultTextUpdate('lose');
    }
  }
  scoreUpdates();
}


// MODAL POPS UP TO TAKE PLAYER NAME

// GAME CHECKS AGAINST FBDB TO SEE IF NAME EXISTS AND IF THERE ARE 2 PLAYERS TO START GAME
// INITIALIZE FBDB OBJECT TO KEEP SCORE AND STORE PICKS
// MODAL IS GONE
// DOM PROVIDES 3 PICKS TO CHOOSE FROM
// USER'S SELECTION UPDATES FBDB
// FBDB WAITS FOR BOTH USERS TO SUBMIT, THEN RUNS GAME LOGIC TO FIND WINNER
// DOM READS FBDB OBJECT TO SELECT AND WRITE WIN/LOSE MESSAGE ON USERS CLIENT, UPDATE GAME, W/L COUNTS
// RESET BUTTON TO SET DOM TO ALLOW PICKS FOR NEXT GAME AND REPEAT


// PLAYER 2 FOR WHEN THE GAME STARTS
{/* <div class="col-md-6">
        <div class="card score_card" style="width: 18rem;">
          <div class="card-body">
            <h5 class="card-title">COMPUTER:</h5><img alt="rock paper scissors image" class="game_image" id="p2_image"
              src="images/placeholder.jpg">
            <h1 class="text_result" id="computer"></h1><span class="text_result">score:</span> <span class="score_keep"
              id="playerTwoScore"></span>
          </div>
        </div>
      </div> */}