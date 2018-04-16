/*
Useful variables
*/

const deck = document.querySelector(".deck");
const moves = document.querySelector(".moves");
const stars = document.querySelector(".stars");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const rating = document.querySelector(".rating");
const restart = document.querySelector(".restart");


let clicks = 0;

/*
 * Deck of cards
 */



// Symbols on the cards
const cardSymbols = {
    ANCHOR : 'fa fa-anchor',
    BICYCLE : 'fa fa-bicycle',
    BOLT : 'fa fa-bolt',
    BOMB : 'fa fa-bomb',
    CUBE : 'fa fa-cube',
    DIAMOND : 'fa fa-diamond',
    LEAF : 'fa fa-leaf',
    PLANE : 'fa fa-paper-plane-o',    
}

// Card states
const cardState = {
    CLOSED : 'card',
    OPENED : 'card open show',
    MATCHED : 'card open match',
}

// Deck of cards
const cardDeck = {
	cards : [cardSymbols.ANCHOR, cardSymbols.ANCHOR, cardSymbols.BICYCLE, cardSymbols.BICYCLE, cardSymbols.BOLT, cardSymbols.BOLT, cardSymbols.BOMB, cardSymbols.BOMB, cardSymbols.CUBE, cardSymbols.CUBE, cardSymbols.DIAMOND, cardSymbols.DIAMOND, cardSymbols.LEAF, cardSymbols.LEAF, cardSymbols.PLANE, cardSymbols.PLANE],
	opened : [],
    matched : 0,
    isAnimating : false,
}

/*
 * Display the cards on the page after shuffling them
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

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
Event listener for a card
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
    if (!cardDeck.isAnimating && event.target.matches(".card") && !event.target.matches(".match", ".show")) {
        flip(event.target);
        storeOpen(event.target);
        matchCards(event.target);
    }
});

// Flip the cards when it's clicked
function flip(card) {
    card.className = cardState.OPENED;
} 

// Store the flipped cards in an array
function storeOpen(card) {
    cardDeck.opened.push(card);
}

// This function check if 2 cards match. If they do it locks them opened, otherwise hide them. It then increase the moves counter and change the star rating accoridngly
function matchCards(card) {
    if (cardDeck.opened.length > 1) {
        cardClass = card.children[0].className;
        var cardOpen = cardDeck.opened[cardDeck.opened.length-2];
        cardClassOpen = cardOpen.children[0].className;

        // check if the cards match or not
        if (cardClass === cardClassOpen) {
          lockMatch(card, cardOpen);
          cardDeck.matched++; 
        } else {
            setTimeout (function() {
                hideCards(card, cardOpen);
            }, 320);
        }
        // empty the list of open cards
        cardDeck.opened = [];
        // increase the click counter
        clicksCounter();
        // change star rating accorindgly to the numbers of moves
        ratingStars();
        // if all the cards are matched shows the finishing-game message
        if (cardDeck.matched === cardDeck.cards.length/2) {
            finishGame();
        }
    }
}

// It animates matching cards 
function animateMatch (card) {
    cardDeck.isAnimating = true;
    card.className = cardState.MATCHED;
    card.className += " animated infinite rubberBand";
    setTimeout (function() {
        card.classList.remove("animated", "infinite", "rubberBand");
        cardDeck.isAnimating = false;
    }, 1000);
}

// If the cards match, it keeps the card open and animate them
function lockMatch(card1, card2) {
    animateMatch(card1);
    animateMatch(card2);
}

// It animates the cards when they don't match and they it closes them 
function animateHide(card) {
    cardDeck.isAnimating = true;
    card.className += " notmatch animated infinite wobble";
    setTimeout (function() {
       card.className = cardState.CLOSED; 
       cardDeck.isAnimating = false;
    }, 1000);
}


// If the cards do NOT match, it hides the cards and remove them from the open list
function hideCards(card1, card2) {
    animateHide(card1);
    animateHide(card2);
}

// This function increments the move counter
function clicksCounter(){
    clicks +=  1;
    moves.innerHTML = clicks;
}

// This function gives the star rating according to the number of moves
function ratingStars(){
    if (clicks > 16 && clicks <= 20) {
        stars.children[2].children[0].classList.replace("fa-star", "fa-star-o");
    } else if (clicks > 20 && clicks <= 24) {
        stars.children[1].children[0].classList.replace("fa-star", "fa-star-o");
    }
}

// This function clones the score and adds it to the modal
function getScore() {
    let score = stars.cloneNode(true);
    rating.append(score);
}


// This function show a popup winning message + score in a modal box when the game finishes
function finishGame() {
    //function clone score in the popup message
    getScore();

    modal.style.display = "block";
    close.addEventListener('click', function() {
        modal.style.display = "none";
    });
} 



/*
Restart game
*/

// Set initial game
// Initial Game
function initGame() {
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

    // Reset score in the game and in the modal
    stars.children[2].children[0].classList.replace("fa-star-o", "fa-star");
    stars.children[1].children[0].classList.replace("fa-star-o", "fa-star");
    rating.innerHTML = "";
}

restart.addEventListener('click', function() {
    initGame();
})


