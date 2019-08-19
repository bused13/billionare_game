/////////////////////////////////////////////////////////////////
///////////////// Declare Variables Global /////////////////////
////////////////////////////////////////////////////////////////
player = {
  score: 0,
  incorrect: 0,
  correct: 0,
  questionsAsked: 0,
}
let allOptions = [];
let allQu = [];
let correctAnswers = [];
let questions = []; // Global Array of Objects (each Object representing a Question)
var questionNumber = 0;

document.querySelector("#quiz").style.display = "none";

// Call this in the beginning to make automatic new random categories
randomCats();

// Hide audience panel
$('#audienceParticipation').hide();

// Pop up new game modal every game //
$(document).ready(function () {
  // timer.stop(); *****************************************************************************
  $("#myBtn").click(function () {
    $("#newGameModal").modal();
    resetStats(player);
  });
});

/////////////////////////////////////////////////////
/////////////// Countdown Timer /////////////////////
////////////////////////////////////////////////////

var count = 30;
var selected30s = 0;

//Called when user wants to play again
function resetVariables() {
  questionNumber = 0;
  totalWrong = 0;
  totalRight = 0;
  selected5050 = 0;
  selected30s = 0;
  selectedAudience = 0;
  optionSelected = 0;
  allQu = []
  correctAnswers = []
  allOptions = []
  count = 30;
  visCount = count * 10 / 3;
  bank = 0;
  cashOut = 0;
}


function userSelection() {
  var counter = setInterval(timer, 1000);

  function timer(action) {
    count--;

    $('#countdown').text("Time Left: " + count + " s");
    if (count <= 0) {

      //User can no longer make a selection
      turnOffOptions();
      clearInterval(counter);

      //Highlight question that was answered wrong
      $(".option").css({
        "background-color": "red",
      })

      return;
    }

    $('.quiz-ans-btn').click(function () {
      clearInterval(counter)
    });
    //Lifeline to add 30s to the countdown
    $('#ask-friend').click(function () {
      selected30s++;

      //Prevents double clicking and adding more than 30s
      if (selected30s == 1) {
        count += 30;

        //Can no longer selected lifeline
        $('#ask-friend').prop('disabled', true);
        $('#ask-friend').css('backgroundColor', 'red');
        $('#timer').fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200);
      }
    })
  }
  //Reset timers
  count = 30;
}

// Function to control time's up from countdown
function turnOffOptions() {
  $('#countdown').html('OUT OF TIME!');
  player.incorrect++;
  updateLocalStats(player);
  setTimeout(() => {
    const correctAnswerId = "quiz-ans-" + questions[0].answers.findIndex(elem => elem.isCorrect);
    document.querySelector("#" + correctAnswerId).classList.add("correct");
    setTimeout(() => {
      nextQuestion(questions);
    }, 1500);
  });
}

//Ask the audience lifeline - these numbers are randomly generated to simulate an audience
function askTheAudience() {
  // $("#audienceParticipation").show();
  // $('#askAudience').fadeOut(1000);
  //Weighting for answers, so correct answer is most likely to be chosen - NOT ALL THE TIME THOUGH!
  var weightCorrect = 0.5;
  var weightWrong1 = 0.2;
  var weightWrong2 = 0.2;
  var weightWrong3 = 0.1;
  // Random propoababilty of options being chosen by "audience"
  var scoreCorrect = weightCorrect * Math.random();
  var scoreWrong1 = weightWrong1 * Math.random();
  var scoreWrong2 = weightWrong2 * Math.random();
  var scoreWrong3 = weightWrong3 * Math.random();
  var totalRandom = scoreCorrect + scoreWrong1 + scoreWrong2 + scoreWrong3
  // Make sure that the sum of score add up to 100 so can be represented on a bar chart
  var audienceCorrect = Math.round(100 * scoreCorrect / totalRandom)
  var audienceWrong1 = Math.round(100 * scoreWrong1 / totalRandom)
  var audienceWrong2 = Math.round(100 * scoreWrong2 / totalRandom)
  var audienceWrong3 = Math.round(100 * scoreWrong3 / totalRandom)
  var summing = audienceCorrect + audienceWrong1 + audienceWrong2 + audienceWrong3;
  //Label bar chart
  $('#heading0').off().text(questions[0].answers[0].answer)
  $('#heading1').off().text(questions[0].answers[1].answer)
  $('#heading2').off().text(questions[0].answers[2].answer)
  $('#heading3').off().text(questions[0].answers[3].answer)


  $('.zero').off().text(questions[0].answers[0].answer.isCorrect);
  //Assign correct probabilty to the correct answer location. Distrubute wrong probabailities to other variables.
  switch (locationCorrect) {
    case 0:
      //Correct Answer at location 0
      $('.zero').css("width", audienceCorrect + "%");
      $('.zero').text(audienceCorrect + "%")
      $('.one').css("width", wrongAudience[0] + "%");
      $('.one').text(wrongAudience[0] + "%")
      $('.two').css("width", wrongAudience[1] + "%");
      $('.two').text(wrongAudience[1] + "%")
      $('.three').text(wrongAudience[2] + "%")
      $('.three').css("width", wrongAudience[2] + "%");
      break;
    case 1:
      //Correct Answer at location 1
      $('.one').css("width", audienceCorrect + "%");
      $('.one').text(audienceCorrect + "%")
      $('.zero').css("width", wrongAudience[0] + "%");
      $('.zero').text(wrongAudience[0] + "%")
      $('.two').css("width", wrongAudience[1] + "%");
      $('.two').text(wrongAudience[1] + "%")
      $('.three').text(wrongAudience[2] + "%")
      $('.three').css("width", wrongAudience[2] + "%");
      break;
    case 2:
      //Correct Answer at location 2
      $('.two').css("width", audienceCorrect + "%");
      $('.two').text(audienceCorrect + "%")
      $('.one').css("width", wrongAudience[0] + "%");
      $('.one').text(wrongAudience[0] + "%")
      $('.zero').text(wrongAudience[1] + "%")
      $('.zero').css("width", wrongAudience[1] + "%");
      $('.three').text(wrongAudience[2] + "%")
      $('.three').css("width", wrongAudience[2] + "%");
      break;
    case 3:
      //Correct Answer at location 3
      $('.three').css("width", audienceCorrect + "%");
      $('.three').text(audienceCorrect + "%")
      $('.one').css("width", wrongAudience[0] + "%");
      $('.one').text(wrongAudience[0] + "%")
      $('.two').css("width", wrongAudience[1] + "%");
      $('.two').text(wrongAudience[1] + "%")
      $('.zero').text(wrongAudience[2] + "%")
      $('.zero').css("width", wrongAudience[2] + "%");
      break;
  }
}

/////////////////////////////////////////////////////////////////
//////////// Generate Random Categories /////////////////////////
////////////////////////////////////////////////////////////////
function randomCats() {
  fetch('https://opentdb.com/api_category.php')
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      let newCatArray = [];
      let catNameArray = [];
      for (let i = 0; i < 4; i++) {
        let random = Math.floor(Math.random() * (23 - 0)) + 0;
        if (!newCatArray.includes(myJson.trivia_categories[random].id)) {
          newCatArray.push(myJson.trivia_categories[random].id)
          catNameArray.push(myJson.trivia_categories[random].name)
        } else {
          newCatArray.push(myJson.trivia_categories[Math.floor(Math.random() * (23 - 0)) + 0].id)
          catNameArray.push(myJson.trivia_categories[Math.floor(Math.random() * (23 - 0)) + 0].name)
        }
      }
      localStorage.categories = newCatArray;
      localStorage.catnames = catNameArray;
      return newCatArray;
    });
}
let randomCatNames = localStorage.catnames.split(",");
let randomCategories = localStorage.categories.split(",");

/////////////////////////////////////////////////////////////////
//////////// Attach Random Categories /////////////////////////
////////////////////////////////////////////////////////////////
let domCategories = attachRandomCats(randomCatNames, randomCategories);
console.log(domCategories);
$.each(domCategories, function (i, val) {
  $(val).appendTo('#categories');
});

function attachRandomCats(category, id) {
  let categoryArray = [];
  for (let i = 0; i < category.length; i++) {
    let listItem = `<option value=${id[i]}>${category[i]}</option>`;
    categoryArray.push(listItem);
  }
  return categoryArray;
}

/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
* ++++++++++++++++++++++ Click Functions ++++++++++++++++++++++
* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
/////////////////////////////////////////////////////////////////
///////////////////// Handle Save/Exit Trivia ///////////////////
////////////////////////////////////////////////////////////////
function closeWindow(e) {
  localStorage.setItem('triviaName', JSON.stringify(player.name));
  localStorage.setItem('score', JSON.stringify(player.score));
  localStorage.setItem('correct', JSON.stringify(player.correct));
  localStorage.setItem('incorrect', JSON.stringify(player.incorrect));
  localStorage.setItem('questionsAsked', JSON.stringify(player.questionsAsked));

  $('#quiz-question').html('Thank You For Playing!');
  $('#quiz-options').empty();
}

/////////////////////////////////////////////////////////////////
///////////////////// Quit Game Button //////////////////////////
////////////////////////////////////////////////////////////////
$('#quit-modal').on('click', function () {
  $('#new-game').hide();
  $('#game-over-header').html('Are you sure you want to leave?');
  $('#GameOverModal').modal('show');

});

/////////////////////////////////////////////////////////////////
///////////////////// Handle Stats Button ///////////////////////
////////////////////////////////////////////////////////////////
$('#stats-modal').on('click', function () {
  $('#game-over-header').html('Your Current Score and Stats');
  $('#GameOverModal').modal('show');
});

/////////////////////////////////////////////////////////////////
///////////////////// Handle New Game  //////////////////////////
////////////////////////////////////////////////////////////////
$('#new-game').on('click', function () {
  // timer.stop(); **********************************************************************
  document.querySelector("#myBtn").style.display = "block";

  $('#quiz-options').empty();
  $('#quiz-question').empty();
  $('#GameOverModal').modal('hide');
  resetStats(player);
});

/////////////////////////////////////////////////////////////////
///////////////////// Handle Player Form ///////////////////////
////////////////////////////////////////////////////////////////
$('#startGame').on('submit', function (e) {
  e.preventDefault();

  if ($('#playerName').val().length <= 0) {
    alert('please enter your name!');
  } else {
    // Set the players name in Local Storage //

    localStorage.setItem('triviaName', $('#playerName').val()); // Set name in local storage
    player.name = localStorage.triviaName; // set player name in object player
    // Grab the selected category //
    let selectedCategory = $('#categories').val();
    if (selectedCategory) {
      localStorage.bonusCategory = selectedCategory;
      document.querySelector("#myBtn").style.display = "none";
      document.querySelector("#quiz").style.display = "block";
      initiateGame(questions);
      // timer.start({ countdown: true, startValues: { seconds: 30 } }); ******************************************************
      $('#player-name').html($('#playerName').val()); // Update player name in the DOM
      $('#newGameModal').modal('hide'); // Hide the modal
    }
  }
});

/////////////////////////////////////////////////////////////////
////////// Event Handlers / Update Scores ///////////////////////
////////////////////////////////////////////////////////////////
document.addEventListener("click", function (event) { // This way of handling is useful for dynamically created elements
  if (event.target.classList.contains("quiz-ans-btn")) { // Handle ".quiz-ans-btn" click
    Array.from(document.querySelectorAll(".quiz-ans-btn")).forEach(btn => btn.disabled = true); // Disable buttons
    event.target.blur();
    const choice = Number(event.target.id.split("-")[2]);
    if (questions[0].answers[choice].isCorrect) {
      event.target.classList.add("pulse", "correct");
      // timer.stop() // <=============== STOP TIMER WHEN QUESTION IS SELECTED *****************************************************
      if (questions[0].difficulty === 'hard') {
        // Hard question + 3 points //
        player.correct++; // add one to correct
        player.score += 3;
        updateLocalStats(player);
      } else if (questions[0].difficulty === 'medium') {
        // Medium question + 2 points
        player.correct++; // add one to correct
        player.score += 2;
        updateLocalStats(player);
      } else {
        // Easy question + 1 point
        player.correct++; // add one to correct
        player.score += 1;
        updateLocalStats(player);
      }
      setTimeout(() => {
        nextQuestion(questions);
      }, 1250);
    }
    else {
      event.target.classList.add("shake", "incorrect");
      // timer.stop() // <=============== STOP TIMER WHEN QUESTION IS SELECTED ********************************************************
      player.incorrect++;
      updateLocalStats(player);
      setTimeout(() => {
        const correctAnswerId = "quiz-ans-" + questions[0].answers.findIndex(elem => elem.isCorrect);
        document.querySelector("#" + correctAnswerId).classList.add("correct");
        setTimeout(() => {
          nextQuestion(questions);
        }, 1500);
      }, 750);
    }
    displayStats(player);
  }
});

/////////////////////////////////////////////////////////////////
////////////////////// Play Again Button ///////////////////////
////////////////////////////////////////////////////////////////
document.querySelector("#quiz-play-again-btn").addEventListener("click", function () {

  $('#newGameModal').modal('show');
  resetStats(player);
  $('#quiz-options').empty();
  document.querySelector("#quiz-play-again-btn").classList.remove("infinite", "pulse");
  document.querySelector("#quiz-play-again-btn").classList.add("flipOutX");
  setTimeout(() => {
    document.querySelector("#quiz-play-again-btn").classList.remove("flipOutX");
    document.querySelector("#quiz-play-again").style.display = "none";
    questions = [];
    resetStats(player);
    $('#player-score').html(player.score);
    $('#player-triviaName').html(player.name);
    $('#player-correct').html(player.correct);
    $('#player-incorrect').html(player.incorrect);
    $('#player-asked').html(player.questionsAsked);
    displayStats(player);
  }, 750);
});

/////////////////////////////////////////////////////////////////
//////////////////////// Lifeline Buttons ///////////////////////
////////////////////////////////////////////////////////////////
$('#lifeline').on('click', function () {
  $('#lifeline').prop('disabled', true);
  $('#lifeline').css('backgroundColor', 'red');
  for (let i = 0; i < questions[0].answers.length; i++) {
    if (questions[0].answers[i].answer == $('#quiz-ans-' + i).html() && questions[0].answers[i].incorrectCounter >= 1) {
      $('#quiz-ans-' + i).prop('disabled', true).addClass("shake").css('backgroundColor', 'red');
    }
  }
});

$('#ask-host').on('click', function () {
  $('#ask-host').prop('disabled', true);
  $('#ask-host').css('backgroundColor', 'red');
  askTheAudience();

})
/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
* ++++++++++++++++++ Auxiliary Functions ++++++++++++++++++++++
* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

/////////////////////////////////////////////////////////////////
////////////////////// Check Player Exists //////////////////////
////////////////////////////////////////////////////////////////
function checkPlayerExists(player) {
  if (localStorage.triviaName) {
    $('#player-name').html(localStorage.triviaName);
    player.name = localStorage.triviaName;
    return true;
  } else {
    player.name = 'Player';
    return false;
  }
}

/////////////////////////////////////////////////////////////////
//////////////////  Reset player stats //////////////////////////
////////////////////////////////////////////////////////////////
function resetStats(player) {
  player.score = player.questionsAsked = player.correct = player.incorrect = 0;
  localStorage.score = localStorage.correct = localStorage.incorrect = localStorage.questionsAsked = 0;
  return;
}

/////////////////////////////////////////////////////////////////
////////////////////// Update Stats /////////////////////////////
////////////////////////////////////////////////////////////////
function updateLocalStats(player) {
  localStorage.triviaName = player.name;
  localStorage.correct = player.correct;
  localStorage.incorrect = player.incorrect;
  localStorage.score = player.score;
  localStorage.questionsAsked = player.questionsAsked;
}

/////////////////////////////////////////////////////////////////
////////////////////// Update Return Stats /////////////////////
////////////////////////////////////////////////////////////////
function updateReturnStats(player) {
  player.name = localStorage.triviaName
  player.correct = parseInt(localStorage.correct);
  player.incorrect = parseInt(localStorage.incorrect);
  player.score = parseInt(localStorage.score);
  player.questionsAsked = parseInt(localStorage.questionsAsked);
}

/////////////////////////////////////////////////////////////////
/////////////////////// Initiate New Game ///////////////////////
////////////////////////////////////////////////////////////////
//////////// randomCategoryNumber = 9 through 32 //////////////
console.log(randomCategories[0]);
function initiateGame(questions, category = randomCategories) {

  const urls = [
    "https://opentdb.com/api.php?amount=3&category=" + category[0],
    "https://opentdb.com/api.php?amount=3&category=" + category[1],
    "https://opentdb.com/api.php?amount=2&category=" + category[2],
    "https://opentdb.com/api.php?amount=2&category=" + category[3]
  ];

  Promise.all(urls.map(url =>
    fetch(url)
      .then(checkStatus)
      .then(parseJSON)
      .catch(error => console.log('There was a problem!', error))
  ))
    .then(data => {
      let resultsArray = data[0].results.concat(data[1].results, data[2].results, data[3].results);
      for (let i = 0; i < resultsArray.length; i++) {
        questions.push({
          category: resultsArray[i].category,
          difficulty: resultsArray[i].difficulty,
          type: resultsArray[i].type,
          question: resultsArray[i].question,
          answers: createAnswersArray(resultsArray[i].correct_answer, resultsArray[i].incorrect_answers)
        });
      }
      if (localStorage.score) {
        updateReturnStats(player);
        displayQuestion(questions[0]);
        displayStats(player);
      } else {
        displayQuestion(questions[0]);
      }
    })
}

// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------

function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

function parseJSON(response) {
  return response.json();
}
/////////////////////////////////////////////////////////////////
//////////////////  Create Answers Array ///////////////////////
////////////////////////////////////////////////////////////////
function createAnswersArray(correct_answer, incorrect_answers) {
  const totalAnswers = incorrect_answers.length + 1;
  const correct_answer_index = Math.floor(Math.random() * totalAnswers);
  let answersArray = [];
  let x = 0;
  for (let i = 0; i < incorrect_answers.length; i++) {
    allOptions.push(incorrect_answers[i]);
    answersArray.push({
      answer: incorrect_answers[i],
      isCorrect: false,
      incorrectCounter: x++
    });
  }
  correctAnswers.push(correct_answer);
  answersArray.splice(correct_answer_index, 0, { answer: correct_answer, isCorrect: true });
  if (totalAnswers === 2) { // => Boolean -> Preferably always show True(1st) - False(2nd) (or Yes - No) -> sort in descending order since both "True" and "Yes" are alphabetically greater than ("False" and "No")
    answersArray.sort((a, b) => a.answer < b.answer);
  } 4
  return answersArray;
}

/////////////////////////////////////////////////////////////////
/////////////////////////// Display Question ////////////////////
////////////////////////////////////////////////////////////////
function displayQuestion(questionObject) {
  userSelection();
  $('#player-score').html(player.score);
  $('#player-triviaName').html(player.name);
  $('#player-correct').html(player.correct);
  $('#player-incorrect').html(player.incorrect);
  $('#player-asked').html(player.questionsAsked);
  document.querySelector("#quiz-question").innerHTML = questionObject.question;
  document.querySelector("#quiz-question").classList.remove("zoomOut");
  document.querySelector("#quiz-question").classList.add("zoomIn");
  setTimeout(() => {
    document.querySelector("#quiz-question").classList.remove("zoomIn");
    player.questionsAsked++; // questionsAsked update
    player.currentTime = new Date();
  }, 1000);

  for (let i = 0; i < questionObject.answers.length; i++) {
    let button = document.createElement("button");
    button.disabled = true;
    button.id = "quiz-ans-" + i;
    button.classList.add("btn", "quiz-ans-btn", "animated", i % 2 === 0 ? "fadeInLeft" : "fadeInRight");
    button.innerHTML = questionObject.answers[i].answer;
    document.querySelector("#quiz-options").appendChild(button);
    setTimeout(() => {
      button.disabled = false;
      button.classList.remove(i % 2 === 0 ? "fadeInLeft" : "fadeInRight");
    }, 1200);
  }
}

/////////////////////////////////////////////////////////////////
/////////////////////////// Next Question ///////////////////////
////////////////////////////////////////////////////////////////
function nextQuestion(questions) {
  document.querySelector("#quiz-question").classList.add("zoomOut");
  for (let i = 0; i < questions[0].answers.length; i++) {
    document.querySelector("#quiz-ans-" + i).classList.add(i % 2 === 0 ? "fadeOutLeft" : "fadeOutRight");
  }
  setTimeout(() => {
    const quizOptions = document.querySelector("#quiz-options");
    while (quizOptions.firstChild) { quizOptions.removeChild(quizOptions.firstChild); }
    //***** If player has less than 3 right and still has questions, keep going *****//
    if (questions.length > 1 && player.incorrect < 3) {
      questions.shift();
      displayQuestion(questions[0]);
    }
    else if (player.incorrect == 3) {
      $('#player-incorrect').html(localStorage.incorrect);
      $('#player-score').html(localStorage.score)
      $('#GameOverModal').modal('show');
      $('#close-modal').hide();
    }
    //***** Else display the play again button ******//
    else {
      document.querySelector("#quiz-play-again").style.display = "block";
      document.querySelector("#quiz-play-again-btn").classList.add("flipInX");
      setTimeout(() => {
        document.querySelector("#quiz-play-again-btn").classList.remove("flipInX");
        document.querySelector("#quiz-play-again-btn").classList.add("infinite", "pulse");
      }, 1000);
    }
  }, 1000);
}

/////////////////////////////////////////////////////////////////
/////////////////////////// Display Stats ///////////////////////
////////////////////////////////////////////////////////////////
function displayStats(player) {
  document.querySelectorAll("#quiz-stats>div>span").forEach(el => el.classList.add("fadeOut"));
  setTimeout(() => {
    document.querySelector("#rate-span").innerHTML = "correct: " + player.correct + " incorrect: " + player.incorrect;
    document.querySelector("#streak-span").innerHTML = player.score;
    document.querySelectorAll("#quiz-stats>div>span").forEach(el => { el.classList.remove("fadeOut"); el.classList.add("fadeIn"); });
    setTimeout(() => {
      document.querySelectorAll("#quiz-stats>div>span").forEach(el => el.classList.remove("fadeIn"));
    }, 375);
  }, 375);
}

/////////////////////////////////////////////////////////////////
///////////////////// Auxiliry Rounding Function ///////////////
////////////////////////////////////////////////////////////////
function round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
} // Note: decimals>=0, Example: round(1.005, 2); -> 1.01