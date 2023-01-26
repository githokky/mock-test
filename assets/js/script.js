/* Main Variables*/
var timerTag = document.querySelector("#timerTag"); 
var timerPTag  = document.querySelector("header").children[1];
var submitHighscoreBtn = document.querySelector("#submitHighscoreBtn");
var viewHighscoresBtn = document.querySelector("#viewHighscoresBtn");
var clearHighscoreBtn = document.querySelector("#clearHighscoreBtn"); 
var answerButtonLst = document.body.querySelector("ul"); 
var goBackHighscoreBtn = document.querySelector("#goBackBtn"); 
var startBtn = document.querySelector("#startBtn"); 
var titleTag = document.querySelector("#title"); 
var resultsEl = document.querySelector("#results");
/*question and answers*/ 
var questionObj = { 
    questions: [
        "Commonly used data types do NOT include:",
        "The condition in an if / else statement is enclosed within ____.",
        "Arrays in Javascript can be used to store ____.",
        "String values must be enclosed within ____ when being assigned to variables.",
        "A very useful tool used during development and debugging for printing content to the debugger is:",
    ],
    answers: [ 
        ["1. strings", "correct:2. booleans", "3. alerts", "4. numbers"],
        ["correct:1. quotes", "2. curly brackets", "3. parentheses", "4. square brackets"],
        ["1. numbers and strings", "2. other arrays", "correct:3. booleans", "4. all of the above"],
        ["1. commmas", "correct:2. curly brackets", "3. quotes", "4. parentheses"],
        ["1. Javascript", "2. terminal/bash", "correct:3. for loops", "4. console.log"],
    ] 
}
/* Game Timer*/
var globalTimerPreset = 75;

/* Game Variables*/
var questionIndexNumber = 0; 
var timeLeft = globalTimerPreset; 
var score = 0; 
var gameEnded = true; 

/* Inital start of game */
function setUpGame() {
    timeLeft = globalTimerPreset; 
    timerTag.textContent = globalTimerPreset; 
    document.querySelector("#display-highscore-div").style.display = "none"; 
    titleTag.textContent = "Coding Quiz Challenge";
    titleTag.style.display = "block";
    document.querySelector("#instructions").style.display = "block"; 
    viewHighscoresBtn.style.display = "block"; 
    startBtn.style.display = "block"; 

    return;
}

/* Start game click */
function startGame() {
    gameEnded = false; 
    questionIndexNumber = 0; 
    /* Hides items */
    viewHighscoresBtn.style.display = "none"; 
    startBtn.style.display = "none"; 
    document.querySelector("#instructions").style.display = "none"; 
    /* Moves timer */
    timerPTag.style.display = "block"; 

    /*Generates questions */
    showQuestions(questionIndexNumber); 
    startTimer(); 

    return;
}

/* Game Timer */
function startTimer() {
    var timerInterval = setInterval(function() {
        if(gameEnded === true) { 
            clearInterval(timerInterval); 
            return;
        }
        if(timeLeft < 1) { 
            clearInterval(timerInterval); 
            endGame(); 
        }

        timerTag.textContent = timeLeft; 
        timeLeft--; 
    }, 1000); 

    return;
}

function showQuestions(currentQuestionIndex) {
    titleTag.textContent = questionObj.questions[currentQuestionIndex]; 
    createAnswerElements(currentQuestionIndex); 

    return;
}

/*cycling answer lists*/
function createAnswerElements(currentQuestionIndex) {
    answerButtonLst.innerHTML = ''; 

    for (let answerIndex = 0; answerIndex < questionObj.answers[currentQuestionIndex].length; answerIndex++) { 
        var currentAnswerListItem = document.createElement("li"); 
        var tempStr = questionObj.answers[currentQuestionIndex][answerIndex];
       
        if (questionObj.answers[currentQuestionIndex][answerIndex].includes("correct:")){
            tempStr = questionObj.answers[currentQuestionIndex][answerIndex].substring(8, questionObj.answers[currentQuestionIndex][answerIndex].length);
            currentAnswerListItem.id = "correct:"; 
        }
/* adding answers*/
        currentAnswerListItem.textContent = tempStr; 
        answerButtonLst.appendChild(currentAnswerListItem); 
    }

    return;
}

/*moving on to the next question*/
function nextQuestion() {
    questionIndexNumber++; 
    if (questionIndexNumber >= questionObj.questions.length){ 
        endGame(); 
    } else { 
        showQuestions(questionIndexNumber); 
    } 

    return;
}

/* end the game and calculate score */
function endGame() { 
    gameEnded = true; 
    score = timeLeft; 
/*hide unnecessary elements*/
    timerPTag.style.display = "none"; 
    titleTag.style.display = "none"; 
    answerButtonLst.innerHTML = "";
    /*display*/
    document.querySelector("#scoreSpan").textContent = score; 
    document.querySelector("#submit-highscore-div").style.display = "block"; 
    return;
}




/* Answer list clickable */
function checkAnswer(event) {
    /* Adding results confirmation */
    resultsEl.style.display = "block";
    let p = document.createElement("p");
    resultsEl.appendChild(p);

    setTimeout(function() {
        p.style.display = "none";
    }, 1000);
    
    
    if (event.target.id.includes("correct:")) {
        p.textContent = "Correct!";
    }

    if (event.target != answerButtonLst){ 

        if (!(event.target.id.includes("correct:"))){ 
            timeLeft -= 10;
            p.textContent = "Wrong!"; 
        }

        nextQuestion();
    }

    return;
}
/*High Score clickable*/
function storeScoreAndName() {
    var highscoreTextbox = document.querySelector("input"); 
    var tempArrayOfObjects = [];

    if (highscoreTextbox.value != "" || highscoreTextbox.value != null) { 
        var tempObject = { 
            names: highscoreTextbox.value, 
            scores: score,
        }
    /*Sorting of highscores*/
        if(window.localStorage.getItem("highscores") == null) { 
            tempArrayOfObjects.push(tempObject); 
            window.localStorage.setItem("highscores", JSON.stringify(tempArrayOfObjects)); 

        } else { 
            tempArrayOfObjects = JSON.parse(window.localStorage.getItem("highscores")); 

            for (let index = 0; index <= tempArrayOfObjects.length; index++) { 
                if (index == tempArrayOfObjects.length) {
                    tempArrayOfObjects.push(tempObject) 
                    break; 
                } else if (tempArrayOfObjects[index].scores < score) { 
                    tempArrayOfObjects.splice(index, 0, tempObject); 
                    break;
                }
            }
            /* Turned into array and stored into local storage */
            window.localStorage.setItem("highscores", JSON.stringify(tempArrayOfObjects))
        } 
        /*Reset*/
        document.querySelector("input").value = ""; 
        score = 0; 

        showHighscores(); 
    }

    return;
}

/* Hides elements and shows highscore values stored */
function showHighscores() {
    titleTag.style.display = "none"; 
    startBtn.style.display = "none"; 
    document.querySelector("header").children[0].style.display = "none"; 
    document.querySelector("#instructions").style.display = "none"; 
    document.querySelector("#submit-highscore-div").style.display = "none"; 
    document.querySelector("#display-highscore-div").style.display = "block";
    tempOrderedList = document.querySelector("ol"); 
    tempOrderedList.innerHTML = "";
/* Parse local storage */
    tempArrayOfObjects = JSON.parse(window.localStorage.getItem("highscores")); 
    if (tempArrayOfObjects != null) {
        for (let index = 0; index < tempArrayOfObjects.length; index++) { 
            var newLi = document.createElement("li") 
            newLi.textContent = tempArrayOfObjects[index].names + " - " + tempArrayOfObjects[index].scores; 
            tempOrderedList.appendChild(newLi);
        }
    } else {
        var newLi = document.createElement("p");
        newLi.textContent = "No Highscores"; 
        tempOrderedList.appendChild(newLi);
    }

    return;
}

/*Clear highscores clickable*/
function clearHighscores() {
    document.querySelector("ol").innerHTML = ""; 
    window.localStorage.clear(); 

    setUpGame();

    return;
}
/* Event Listeners */
function init() {
    startBtn.addEventListener("click", startGame); 
    answerButtonLst.addEventListener("click", checkAnswer); 
    viewHighscoresBtn.addEventListener("click", showHighscores); 
    submitHighscoreBtn.addEventListener("click", storeScoreAndName); 
    clearHighscoreBtn.addEventListener("click", clearHighscores); 
    goBackHighscoreBtn.addEventListener("click", setUpGame); 

    setUpGame(); 

    return;
}

init();