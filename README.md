# Memory Game 


This game was built as part of the Udacity FEND nanodegree. 

## How to Load the game

- Clone the **[repo](https://github.com/ElisaCovato/Memory-game---FEND-nanodegree)** and open index.html -- or --
- Play on GitHub.io: **[Memory Game](https://elisacovato.github.io/Memory-game---FEND-nanodegree/)**

## How the game works

The game board consists of sixteen "cards" arranged randomly in a grid. The deck is made up of eight different pairs of cards, each with different symbols on one side. The cards are arranged randomly on the grid with the symbol face down. Aim of the game is to find all the matching pairs.


On each turn:

- The player flips one card over to reveal its underlying symbol;
- The player then turns over a second card, trying to find the corresponding card with the same symbol;
- If the cards match, both cards stay flipped over;
- If the cards do not match, both cards are returned to their initial hidden state.

The game ends once all cards have been correctly matched.



## Special Features

- The game features a timer to keep track of the time spent playing. It stops when the game finishs.
- The player starts out with a three star rating -- but the rating drops the more moves it take to complete the game with the following logic :
    - Between 18 and 24 moves, the player gets 2 stars;
    - Between 24 and 30, the player gets 1 star;
    - More than 30 moves, the player doesn't get any star.
- The game can be restarted. When clicking the restart button the game is paused and  a pop-up appears asking the player to confirm the choice. If the "Cancel" button is pressed, the player can go back to the paused game; if the player press "Yes, restart" the game is restarded with new shuffled cards, the time is set to zero and the rating starts back from 3;
- When the game ends, a pop-up appears with the  time spent playing, final star rating and a "Play again" button. 

## Resources used to create the game:

### Array shuffle:

- <http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array>

### Card Flipping CSS:


- <http://callmenick.com/post/css-transitions-transforms-animations-flipping-card>


### Modal / Sweet Alert

- https://sweetalert.js.org/



#### Udacity Resources:

- [Project Rubric](https://review.udacity.com/#!/rubrics/591/view)


## License
[MIT License](LICENSE.MIT)