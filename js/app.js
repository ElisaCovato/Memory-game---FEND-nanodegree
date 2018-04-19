/*
Useful variables
*/

const deck = document.querySelector(".deck");
const moves = document.querySelector(".moves");
const stars = document.querySelector(".stars");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const restart = document.querySelector(".restart");
const timer = document.querySelector(".timer");

// Set the value for clicks counter and timer
let clicks = 0;
let timeTotal = 0;
let timeInt;
let hour = 0;
let minute = 0;
let second = 0;
let isPaused = true;
let startTime;

// Set number of stars accordingly to number of moves
const stars1 = 30;
const stars2 = 24;
const stars3 = 18;



/*
 * Deck of cards
 */

// Symbols on the cards
const cardSymbols = {
    ANCHOR: 'fa fa-anchor',
    BICYCLE: 'fa fa-bicycle',
    BOLT: 'fa fa-bolt',
    BOMB: 'fa fa-bomb',
    CUBE: 'fa fa-cube',
    DIAMOND: 'fa fa-diamond',
    LEAF: 'fa fa-leaf',
    PLANE: 'fa fa-paper-plane-o',
}

// Card states
const cardState = {
    CLOSED: 'card',
    OPENED: 'card open show',
    MATCHED: 'card open match',
}

// Deck of cards
const cardDeck = {
    cards: [cardSymbols.ANCHOR, cardSymbols.ANCHOR, cardSymbols.BICYCLE, cardSymbols.BICYCLE, cardSymbols.BOLT, cardSymbols.BOLT, cardSymbols.BOMB, cardSymbols.BOMB, cardSymbols.CUBE, cardSymbols.CUBE, cardSymbols.DIAMOND, cardSymbols.DIAMOND, cardSymbols.LEAF, cardSymbols.LEAF, cardSymbols.PLANE, cardSymbols.PLANE],
    opened: [],
    matched: 0,
    isAnimating: false,
}



/*
 * Display the cards on the page after shuffling them
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
let shuffleCards = shuffle(cardDeck.cards);

// Create HTML for the deck of cards (display them)
function createHTML(cardClass) {
    (deckSymb = document.createElement("i")).className = cardClass;
    (deckCard = document.createElement("li")).className = cardState.CLOSED;
    deckCard.appendChild(deckSymb)
    deck.appendChild(deckCard);
}
shuffleCards.map(createHTML);



/*
 * START the game
 *  (roughly) If a card is clicked:
 *  - display the card's symbol 
 *  - add the card to a *list* of "open" cards 
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position 
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol
 *    + increment the move counter and display it on the page 
 *    + if all cards have matched, display a message with the final score 
 */

deck.addEventListener('click', function(event) {
    if (!cardDeck.isAnimating && event.target.matches(".card") && !event.target.matches(".open") && cardDeck.opened.length <= 1) {
        // timer starts
        if (timeTotal === 0) {
            startTime = Date.now();
            resetTimer()
            startTimer(startTime);
        };
        // flip cards, store the opened ones, check if the cards match
        flip(event.target);
        storeOpen(event.target);
        matchCards(event.target);
        // if all the cards are matched shows the finishing-game message 
        if (cardDeck.matched === cardDeck.cards.length / 2) {
            finishGame();
        };
    }
});



/*
 * RESTART the game
 */
restart.addEventListener('click', function() {
    let pauseTime = Date.now();
    stopTimer();
    warningModal(pauseTime);
});



/*
FUNCTIONS
*/



/* Restart game */
function restartGame() {
    // Clear the deck of cards, empty the list of open cards, and reset counter for matched cards
    deck.innerHTML = "";
    cardDeck.opened = [];
    cardDeck.matched = 0;
    // Shuffle the cards and re-create their HTML
    let shuffleCards = shuffle(cardDeck.cards);
    shuffleCards.map(createHTML);
    // Reset counter of moves 
    clicks = 0;
    moves.innerHTML = clicks;
    // Reset score in the game 
    stars.children[2].children[0].classList.replace("fa-star-o", "fa-star");
    stars.children[1].children[0].classList.replace("fa-star-o", "fa-star");
    // Reset time
    resetTimer();
}



/* FINISH game : It shows a popup winning message + score in a modal box when the game finishes*/
function finishGame() {
    stopTimer();
    winningModal();
}

/*Cards functions*/

// Flip the cards when it's clicked
function flip(card) {
    card.className = cardState.OPENED;
}

// Store the flipped cards in an array
function storeOpen(card) {
    cardDeck.opened.push(card);
}

// This function check if 2 cards match. If they do it keeps them opened, otherwise hide them. 
//It then increase the moves counter and change the star rating accordingly
function matchCards(card) {
    if (cardDeck.opened.length > 1) {
        cardClass = card.children[0].className;
        var cardOpen = cardDeck.opened[cardDeck.opened.length - 2];
        cardClassOpen = cardOpen.children[0].className;
        // check if the cards match or not
        if (cardClass === cardClassOpen) {
            lockMatch(card, cardOpen);
            // empty the list of open cards
            cardDeck.opened = [];
            cardDeck.matched++;
        } else {
            setTimeout(function() {
                hideCards(card, cardOpen);
                cardDeck.opened = [];
            }, 320);
        }
        // increase the click counter
        clicksCounter();
        // change star rating according to the numbers of moves
        ratingStars();
    }
}

// It animates matching cards 
function animateMatch(card) {
    cardDeck.isAnimating = true;
    card.className = cardState.MATCHED;
    card.className += " animated infinite rubberBand";
    setTimeout(function() {
        card.classList.remove("animated", "infinite", "rubberBand");
        cardDeck.isAnimating = false;
    }, 1000);
}

// It animates the cards when they don't match and they it closes them 
function animateHide(card) {
    cardDeck.isAnimating = true;
    card.className += " notmatch animated infinite wobble";
    setTimeout(function() {
        card.className = cardState.CLOSED;
        cardDeck.isAnimating = false;
    }, 1000);
}

// If the cards match, it keeps the card open and animate them
function lockMatch(card1, card2) {
    animateMatch(card1);
    animateMatch(card2);
}

// If the cards do NOT match, it hides the cards and remove them from the open list
function hideCards(card1, card2) {
    animateHide(card1);
    animateHide(card2);
}



/*Timer functions*/

// This function starts the time
function startTimer(startTime) {
    //let startTime = Date.now();
    timeInt = setInterval(function() {
        timeTotal = Math.floor((Date.now() - startTime) / 1000);
        displayTimer(timeTotal);
    }, 1000);
}

// This function reset the timer
function resetTimer() {
    stopTimer();
    timeTotal = 0;
    displayTimer(timeTotal);
}

// This function display the timer
function displayTimer(timeTotal) {
    hour = Math.floor(timeTotal / 3600);
    minute = Math.floor((timeTotal - hour * 3600) / 60);
    second = timeTotal - hour * 3600 - minute * 60;
    if (hour < 10) hour = '0' + hour;
    if (minute < 10) minute = '0' + minute;
    if (second < 10) second = '0' + second;
    timer.innerHTML = hour + ':' + minute + ':' + second;
}

// This function stops the time
function stopTimer() {
    clearInterval(timeInt);
}

// this function gets the time to add to the modal
function getTimeModal() {
    let time = timer.cloneNode(true);
    let showTime = document.createElement("div");
    let textTime = document.createTextNode("Your time :");
    showTime.appendChild(textTime);
    showTime.appendChild(time);
    showTime.className = "timeModal";
    return showTime;
}



/* Score functions */

// This function increments the move counter
function clicksCounter() {
    clicks += 1;
    moves.innerHTML = clicks;
}

// This function gives the star rating according to the number of moves
function ratingStars() {
    if (clicks > stars3 && clicks <= stars2) {
        stars.children[2].children[0].classList.replace("fa-star", "fa-star-o");
    } else if (clicks > stars2 && clicks <= stars1) {
        stars.children[1].children[0].classList.replace("fa-star", "fa-star-o");
    }
}

// This function clones the score to add to the modal
function getScoreModal() {
    let score = stars.cloneNode(true);
    let showScore = document.createElement("div");
    let textScore = document.createTextNode("Your score :");
    showScore.appendChild(textScore);
    showScore.appendChild(score);
    showScore.className = "scoreModal";
    return showScore;
}



/*
MODAL
*/

// This function puts together the score and the time in a unique block to put in the winning modal
function finishScoreTime() {
    let finishBlock = document.createElement("div");
    let showScore = getScoreModal();
    let showTime = getTimeModal();
    finishBlock.appendChild(showScore);
    finishBlock.appendChild(showTime);
    return finishBlock;
}

// This function show a winning sweet alert
function winningModal() {
    let finishBlock = finishScoreTime();
    swal({
        title: "Congratulations! You won!",
        icon: "success",
        button: "Play again!",
        content: finishBlock,
    }).then(function(isConfirm) {
        if (isConfirm) {
            restartGame();
        }
    });
}

// This function shows a warning sweet alert when pressing the restart button
function warningModal(pauseTime) {
    swal({
        title: "Are you sure?",
        text: "Your progresses will be lost!",
        icon: "warning",
        buttons: {
            cancel: "Cancel",
            confirm: {
                text: "Yes, restart",
                value: "restart",
            },
        }
    }).then((value) => {
        switch (value) {
            case "restart":
                restartGame();
                break;
            default:
                let delayTime = Date.now() - pauseTime;
                startTime = startTime + delayTime;
                startTimer(startTime);
                break;
        }
    });
}


if (!Element.prototype.matches) {
    Element.prototype.matches = 
        Element.prototype.matchesSelector || 
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector || 
        Element.prototype.oMatchesSelector || 
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;            
        };
}