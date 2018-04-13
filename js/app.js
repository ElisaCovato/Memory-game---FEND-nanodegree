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


deck = document.querySelector(".deck");

function createHTML(cardClass) {
    (deckSymb = document.createElement("i")).className = cardClass;
    (deckCard = document.createElement("li")).className = cardState.CLOSED;

    deckCard.appendChild(deckSymb)
    deck.appendChild(deckCard);    
}

shuffleCards.map(createHTML);

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/*
Event listener for a card
*/

deck.addEventListener('click', function(event) {
    if (event.target.matches(".card") && !event.target.matches(".match")) {
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

// This function check if 2 cards match
function matchCards(card) {
    if (cardDeck.opened.length > 1) {
        cardClass = card.children[0].className;

        var cardOpen = cardDeck.opened[cardDeck.opened.length-2];
        cardClassOpen = cardOpen.children[0].className;

        if (cardClass === cardClassOpen) {
          lockMatch(card, cardOpen);
          cardDeck.matched++; 
        } else {
            setTimeout (function() {
                hideCards(card, cardOpen);
            }, 800);
        }
        cardDeck.opened = [];
    }
}

// If the cards match, it keeps the card open, increase the pairs counter and remove them from the open list
function lockMatch(card1, card2) {
    card1.className = cardState.MATCHED;
    card2.className = cardState.MATCHED;
}

// If the cards do NOT match, it hides the cards and remove them from the open list
function hideCards(card1, card2) {
    card1.className = cardState.CLOSED;
    card2.className = cardState.CLOSED;
}
