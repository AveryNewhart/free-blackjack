(function () {
    // Game variables
    var deck = new Deck(),
        game = new Game(),
        player = new Player(deck), // Pass the deck object as a parameter to the Player constructor
        dealer = new Player(deck), // Pass the deck object as a parameter to the Player constructor
        running = false,
        blackjack = false,
        insured = 0,
        deal = new Deal(deck), // Pass the deck object as a parameter to the Deal constructor
        currentPlayer;

    // Set currentPlayer to the player object
    currentPlayer = player;


/**************************************************************************/
/************************** Player Constructor ****************************/
/**************************************************************************/
    function Player(deck) {

    this.hand = []; 
    this.wager = 0;
    this.cash = 1000;
    this.bank = 0;
    this.ele = '';
    this.score = '';
    this.hands = [];
    this.splitHands = [];

    // Get player's hand
    this.getHand = function () {
        return this.hand;
    };

    // Set a card to player's hand
    this.setHand = function (card) {
        this.hand.push(card);
    };

    // Reset player's hand
    this.resetHand = function () {
        this.hand = [];
        this.splitHands = [];
    };

    // Get player's wager
    this.getWager = function () {
        return this.wager;
    };

    // Set player's wager
    this.setWager = function (money) {
        // Convert the input money to an integer
        money = parseInt(money, 10);

    // Check if the player has enough cash to place the wager
    if (money <= this.cash) {
        // If yes, update the wager amount
        this.wager += money;
        } else {
            // If no, you can either show an error message or handle it as per your application's requirements
            console.log("Insufficient cash to place the wager.");
            // Alternatively, you can throw an error or take appropriate action.
        }
    };


    // Reset player's wager
    this.resetWager = function () {
        this.wager = 0;
    };

    // Check if player's wager is valid
    this.checkWager = function () {
        return this.wager <= this.cash ? true : false;
    };

    // Get player's cash
    this.getCash = function () {
        return this.cash.formatMoney(2, '.', ',');
    };

    // Set a card to player's hand
    this.addCard = function (card) {
        this.hand.push(card);
    };


    // Get HTML elements for player or dealer (defined as a prototype method)
    this.getElements = function () {
        var ele, score;
                
        if (this === player) {
            ele = '#phand';
            score = '#pcard-0 .popover-content';
        } else if (this === dealer) {
            ele = '#dhand';
            score = '#dcard-0 .popover-content';
        }
        return { 'ele': ele, 'score': score };
    };

    this.renderHands = function () {
        var i, j, hand;
    
        // Clear the existing hands on the UI
        $('#phand, #phand > div').html('');
    
        // Render the main hand cards
        hand = this.getHand(); // Get the current hand of the player
        for (j = 0; j < hand.length; j++) {
            renderCard('#phand', this, 'up', 'card-0-' + j);
        }
    
        // Loop through the player's split hands and render their cards
        for (i = 0; i < this.splitHands.length; i++) {
            hand = this.splitHands[i].getHand();
    
            for (j = 0; j < hand.length; j++) {
                renderCard('#phand', this.splitHands[i], 'up', 'card-' + (i + 1) + '-' + j);
            }
        }
    
        // Show the score for the main hand
        $('#pcard-0 .popover-content').html(this.getScore());
    };

    this.splitHand = function () {
        if (this.getHand().length === 2 && this.getHand()[0].rank === this.getHand()[1].rank) {
            var splitCard = this.getHand().pop(); // Remove one card from the original hand
            var newHand = new Player(deck); // Create a new Player instance to represent the split hand
    
            // Move the split card to the new hand
            newHand.setHand(splitCard);
    
            // Add the new hand to the player's splitHands array
            this.splitHands.push(newHand);
    
            // Add a new card to each hand
            this.setHand(deal.getCard(this));
            newHand.setHand(deal.getCard(newHand));
    
            // Render the updated hands on the UI
            this.renderHands();
    
            // Disable split button if the maximum number of hands is reached
            if (this.splitHands.length >= 4) {
                $('#split').prop('disabled', true);
            }
    
            // Deal cards to each hand
            deal.dealCard(2, 0, [this].concat(this.splitHands));
        }
    };
        
        // Set player's cash
        this.setCash = function (money) {
            this.cash += money;
            this.updateBoard();
        };

        // Get player's bank (winnings)
        this.getBank = function () {
            $('#bank').html('Winnings: $' + this.bank.formatMoney(2, '.', ','));

            if (this.bank < 0) {
                $('#bank').html('Winnings: <span style="color: #D90000">-$' +
                    this.bank.formatMoney(2, '.', ',').toString().replace('-', '') + '</span>');
            }
        };

        // Set player's bank (winnings)
        this.setBank = function (money) {
            this.bank += money;
            this.updateBoard();
        };

        this.updateBoard = function () {
            var scoreElement = this.getElements().score;
                $(scoreElement).html(this.getScore());
                $('#cash span').html(this.getCash());
        this.getBank();
        };

        // Flip dealer's facedown cards
        this.flipCards = function () {
            $('.down').each(function () {
                $(this).removeClass('down').addClass('up');
                renderCard(false, false, false, $(this));
            });

            $('#dcard-0 .popover-content').html(dealer.getScore());
        };
    }

/************************************************************************/
/************************** Deck Constructor ****************************/
/************************************************************************/
    function Deck() {
        var ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
            suits = ['&#9824;', '&#9827;', '&#9829;', '&#9670;'],
            deck = [],
            i, x, card;

        // Get the deck of cards
        this.getDeck = function () {
            return this.setDeck();
        };

        // Set the deck of cards
        this.setDeck = function () {
            for (i = 0; i < ranks.length; i++) {
                for (x = 0; x < suits.length; x++) {
                    card = new Card({ 'rank': ranks[i] });

                    deck.push({
                        'rank': ranks[i],
                        'suit': suits[x],
                        'value': card.getValue()
                    });
                }
            }

            return deck;
        };
    }

/***************************************************************************/
/************************** Shuffle Constructor ****************************/
/***************************************************************************/
    function Shuffle(deck) {
        var set = deck.getDeck(),
            shuffled = [],
            card;

        // Set the shuffled deck of cards
        this.setShuffle = function () {
            while (set.length > 0) {
                card = Math.floor(Math.random() * set.length);

                shuffled.push(set[card]);
                set.splice(card, 1);
            }

            return shuffled;
        };

        // Get the shuffled deck of cards
        this.getShuffle = function () {
            return this.setShuffle();
        };
    }

/************************************************************************/
/************************** Card Constructor ****************************/
/************************************************************************/
    function Card(card) {
        // Get the rank of the card
        this.getRank = function () {
            return card.rank;
        };

        // Get the suit of the card
        this.getSuit = function () {
            return card.suit;
        };

        // Get the value of the card
        this.getValue = function () {
            var rank = this.getRank(),
                value = 0;

            if (rank === 'A') {
                value = 11;
            } else if (rank === 'K') {
                value = 10;
            } else if (rank === 'Q') {
                value = 10;
            } else if (rank === 'J') {
                value = 10;
            } else {
                value = parseInt(rank, 0);
            }

            return value;
        };
    }

/************************************************************************/
/************************** Deal Constructor ****************************/
/************************************************************************/
    function Deal(deck) {
        var deck = new Deck(),
            shuffle = new Shuffle(deck),
            shuffled = shuffle.getShuffle(),
            card;


        // Get a card from the shuffled deck
        this.getCard = function (sender) {
            this.setCard(sender);
            return card;
        };

        // Set a card to the player's or dealer's hand
        this.setCard = function (sender, split) {
            console.log(sender)
            card = shuffled[0];
            shuffled.splice(0, 1);
            // sender.setHand(card);

            if (!split) {
                sender.setHand(card); // Deal to the main hand
            } else {
                sender.setHand(card); // Deal to the split hand
            }
        };

        // Deal cards to players and dealer
        this.dealCard = function (num, i, obj) {
            if (i >= num) { return false; }

            var sender = obj[i];

            if (sender.splitHands.length > 0) {
                // Deal cards to each split hand
                for (var j = 0; j < sender.splitHands.length; j++) {
                    var splitHand = sender.splitHands[j];
                    var splitElements = splitHand.getElements();
                    var splitScore = splitElements.score;
                    var splitEle = splitElements.ele;
        
                    this.setCard(splitHand, true);
        
                    renderCard(splitEle, splitHand, 'up');
                    $(splitScore).html(splitHand.getScore());
                }
            }
        
            // Deal cards to the main hand or the player/dealer if no split hands
            var elements = sender.getElements();
            var score = elements.score;
            var ele = elements.ele;
            var dhand = dealer.getHand();

            deal.getCard(sender, false);

            if (i < 3) {
                renderCard(ele, sender, 'up');
                $(score).html(sender.getScore());
            } else {
                renderCard(ele, sender, 'down');
            }

            // Update player's score display
            $('#pcard-0 .popover-content span').html(player.getScore());
            // Update dealer's score display
            $('#dcard-0 .popover-content span').html(dealer.getScore());

            if (player.getHand().length === 2 && player.getHand()[0].rank === player.getHand()[1].rank) {
                // Check if the player has two cards of the same rank to enable the split button
                setActions('run');
            }

            if (player.getHand().length < 3) {
                if (dhand.length > 0 && dhand[0].rank === 'A') {
                    setActions('insurance');
                }

                if (player.getScore() === 21) {
                    if (!blackjack) {
                        blackjack = true;
                        getWinner();
                    } else {
                        dealer.flipCards();
                        $('#dscore span').html(dealer.getScore());
                    }
                } else {
                    if (dhand.length > 1) {
                        setActions('run');
                    }
                }
            }
            
            // setTimeout(showCards, 250);
            setTimeout(function () {
                deal.dealCard(num, i + 1, obj);
            }, 250);
        };
    }

/************************************************************************/
/************************** Game Constructor ****************************/
/************************************************************************/
    function Game() {
        // Start a new game
        this.newGame = function () {
            var wager = $.trim($('#wager').val());

            player.resetWager();
            player.setWager(wager);

            if (player.checkWager()) {
                $('#deal').prop('disabled', true);
                resetBoard();
                player.setCash(-wager);

                deal = new Deal(deck);

                running = true;
                blackjack = false;
                insured = false;

                player.resetHand();
                dealer.resetHand();
                showBoard();
            } else {
                player.setWager(-wager);
                $('#alert').removeClass('alert-info alert-success').addClass('alert-error');
                showAlert('Wager cannot exceed available cash!');
            }
        };
    }

    /******************************************************************************/
    /************************* Extensions / Prototypes ****************************/
    /******************************************************************************/

    // Prototype functions for Player
    Player.prototype.hit = function (dbl) {
        var pscore;

        deal.dealCard(1, 0, [this]);
        pscore = player.getScore();

        if (dbl || pscore > 21) {
            running = false;

            setTimeout(function () {
                player.stand();
            }, 500);
        } else {
            this.getHand();
        }

        setActions();

        player.updateBoard();
    };

    Player.prototype.stand = function () {
        var timeout = 0;

        running = false;
        dealer.flipCards();

        function checkDScore() {
            if (dealer.getScore() < 17 && player.getScore() <= 21) {
                timeout += 200;

                setTimeout(function () {
                    dealer.hit();
                    checkDScore();
                }, 500);
            } else {
                setTimeout(function () {
                    getWinner();
                }, timeout);
            }
        }

        checkDScore();
    };

    Player.prototype.dbl = function () {
        var wager = this.getWager();

        if (this.checkWager(wager * 2)) {
            $('#double').prop('disabled', true);
            this.setWager(wager);
            this.setCash(-wager);

            this.hit(true);
        } else {
            $('#alert').removeClass('alert-info alert-success').addClass('alert-error');
            showAlert('You don\'t have enough cash to double down!');
        }
    };

    // Player.prototype.split = function () {
    //     $('#alert').removeClass('alert-info alert-success').addClass('alert-error');
    //     showAlert('Split function is not yet working.');
    // };

    Player.prototype.splitHand = function () {
        if (this.getHand().length === 2 && this.getHand()[0].rank === this.getHand()[1].rank) {
            var splitCard = this.getHand().pop(); // Remove one card from the original hand
            var newHand = new Player(deck); // Create a new Player instance to represent the split hand
    
            // Move the split card to the new hand
            newHand.setHand(splitCard);
    
            // Add the new hand to the player's splitHands array
            this.splitHands.push(newHand);
    
            // Add a new card to each hand
            this.setHand(deal.getCard(this));
            newHand.setHand(deal.getCard(newHand));
    
            // Render the updated hands on the UI
            this.renderHands();
    
            // Disable split button if the maximum number of hands is reached
            if (this.splitHands.length >= 4) {
                $('#split').prop('disabled', true);
            }
    
            // Deal cards to each hand
            deal.dealCard(2, 0, [this].concat(this.splitHands));
        }
    };
    

    Player.prototype.insure = function () {
        var wager = this.getWager() / 2,
            newWager = 0;

        $('#insurance').prop('disabled', true);
        this.setWager(wager);

        if (this.checkWager()) {
            newWager -= wager;
            this.setCash(newWager);
            insured = wager;
        } else {
            this.setWager(-wager);
            $('#alert').removeClass('alert-info alert-success').addClass('alert-error');
            showAlert('You don\'t have enough for insurance!');
        }
    };

    Player.prototype.getScore = function () {
        var hand = this.getHand(),
            score = 0,
            aces = 0,
            i;

        for (i = 0; i < hand.length; i++) {
            score += hand[i].value;

            if (hand[i].value === 11) { aces += 1; }

            if (score > 21 && aces > 0) {
                score -= 10;
                aces--;
            }
        }

        return score;
    };

    Player.prototype.updateBoard = function () {
        var score = '#dcard-0 .popover-content';

        if (this === player) {
            score = '#pcard-0 .popover-content';
        }

        $(score).html(this.getScore());
        $('#cash span').html(player.getCash());
        player.getBank();
    };

    // Get HTML elements for player or dealer (defined as a prototype method)
    Player.prototype.getElements = function () {
        var ele, score;
            
        if (this === player) {
            ele = '#phand';
            score = '#pcard-0 .popover-content';
        } else if (this === dealer) {
            ele = '#dhand';
            score = '#dcard-0 .popover-content';
        }
        return { 'ele': ele, 'score': score };
    };

    // Format number as money
    Number.prototype.formatMoney = function (c, d, t) {
        var n = this,
            s = n < 0 ? '-' : '',
            i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + '',
            j = i.length;
        j = j > 3 ? j % 3 : 0;
        return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
    };

    /*****************************************************************/
    /************************** Functions ****************************/
    /*****************************************************************/

    // Disable text selection for certain elements
    (function ($) {
        $.fn.disableSelection = function () {
            return this.attr('unselectable', 'on')
                .css('user-select', 'none')
                .on('selectstart', false);
        };
    }(jQuery));

    // Allow only numbers in input fields
    (function ($) {
        $.fn.numOnly = function () {
            this.on('keydown', function (e) {
                if (e.keyCode === 46 || e.keyCode === 8 || e.keyCode === 9 || e.keyCode === 27 || e.keyCode === 13 || (e.keyCode === 65 && e.ctrlKey === true) || (e.keyCode >= 35 && e.keyCode <= 39)) {
                    return true;
                } else {
                    if (e.shifKey || ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105))) {
                        e.preventDefault();
                    }
                }
            });
        };
    }(jQuery));

    // Show an alert message
    function showAlert(msg) {
        $('#alert span').html('<strong>' + msg + '</strong>');
        $('#alert').fadeIn();
    }

    // Set available actions based on game state
    function setActions() {
        var hand = player.getHand();
        var dhand = dealer.getHand();
    
        if (!running) {
            $('#deal').prop('disabled', false);
            $('#hit').prop('disabled', true);
            $('#stand').prop('disabled', true);
            $('#double').prop('disabled', true);
            $('#split').prop('disabled', true);
            $('#insurance').prop('disabled', true);
        }
    
        if (running && hand.length >= 2) {
            // Game is running, enable hit and stand
            $('#deal').prop('disabled', true);
            $('#hit').prop('disabled', false);
            $('#stand').prop('disabled', false);
    
            if (player.checkWager(player.getWager() * 2)) {
                // If player has enough cash to double down, enable double
                $('#double').prop('disabled', false);
            }
    
            if (dhand.length === 2 && dhand[0].rank === 'A') {
                // If dealer has an Ace, enable insurance
                $('#insurance').prop('disabled', false);
            }
    
            // Check if the player's two cards have the same rank (number) for enabling split
            if (hand.length === 2 && hand[0].rank === hand[1].rank) {
                $('#split').prop('disabled', false);
            } else {
                $('#split').prop('disabled', true);
            }
        }
    }
    
    // Show initial cards on the board
    function showBoard() {
        currentPlayer = player;
        deal.dealCard(4, 0, [player, dealer, player, dealer]);
    }

    // Render a card on the board
    function renderCard(ele, sender, type, item) {
        var hand, i, card;

        if (!item) {
            hand = sender.getHand();
            i = hand.length - 1;
            card = new Card(hand[i]);
        } else {
            hand = dealer.getHand();
            card = new Card(hand[1]);
        }

        var rank = card.getRank(),
            suit = card.getSuit(),
            color = 'red',
            posx = 402,
            posy = 182,
            speed = 200,
            cards = ele + ' .card-' + i;

        if (i > 0) {
            posx -= 50 * i;
        }

        if (!item) {
            $(ele).append(
                '<div class="card-' + i + ' ' + type + '">' +
                '<span class="pos-0">' +
                '<span class="rank">&nbsp;</span>' +
                '<span class="suit">&nbsp;</span>' +
                '</span>' +
                '<span class="pos-1">' +
                '<span class="rank">&nbsp;</span>' +
                '<span class="suit">&nbsp;</span>' +
                '</span>' +
                '</div>'
            );

            if (ele === '#phand') {
                posy = 360;
                speed = 500;
                $(ele + ' div.card-' + i).attr('id', 'pcard-' + i);

                if (hand.length < 2) {
                    $('#pcard-0').popover({
                        animation: false,
                        container: '#pcard-0',
                        content: player.getScore(),
                        placement: 'left',
                        title: 'You Have',
                        trigger: 'manual'
                    });

                    setTimeout(function () {
                        $('#pcard-0').popover('show');
                        $('#pcard-0 .popover').css('display', 'none').fadeIn();
                    }, 500);
                }
            } else {
                $(ele + ' div.card-' + i).attr('id', 'dcard-' + i);

                if (hand.length < 2) {
                    $('#dcard-0').popover({
                        container: '#dcard-0',
                        content: dealer.getScore(),
                        placement: 'left',
                        title: 'Dealer Has',
                        trigger: 'manual'
                    });

                    setTimeout(function () {
                        $('#dcard-0').popover('show');
                        $('#dcard-0 .popover').fadeIn();
                    }, 100);
                }
            }

            $(ele + ' .card-' + i).css('z-index', i);

            // Check for mobile screens and adjust card positioning
            if ($(window).width() < 768) {
                posx = (i > 0) ? 0 : 25;
                posy = 220 + (i * 50);
            }

            $(ele + ' .card-' + i).animate({
                'top': posy,
                'right': posx
            }, speed);

            $(ele).queue(function () {
                $(this).animate({ 'left': '-=25.5px' }, 100);
                $(this).dequeue();
            });
        } else {
            cards = item;
        }

        if (type === 'up' || item) {
            if (suit !== '&#9829;' && suit !== '&#9670;') {
                color = 'black';
            }

            $(cards).find('span[class*="pos"]').addClass(color);
            $(cards).find('span.rank').html(rank);
            $(cards).find('span.suit').html(suit);
        }
    }

    // Reset the game board
    function resetBoard() {
        $('#dhand').html('');
        $('#phand').html('');
        $('#result').html('');
        $('#phand, #dhand').css('left', 0);
    }

    // Determine the winner and update the board accordingly
    function getWinner() {
        var phand = player.getHand(),
            dhand = dealer.getHand(),
            pscore = player.getScore(),
            dscore = dealer.getScore(),
            wager = player.getWager(),
            winnings = 0,
            result;

        running = false;
        setActions();

        if (pscore > dscore) {
            if (pscore === 21 && phand.length < 3) {
                winnings = (wager * 2) + (wager / 2);
                player.setCash(winnings);
                player.setBank(winnings - wager);
                $('#alert').removeClass('alert-info alert-error').addClass('alert-success');
                result = 'Blackjack!';
            } else if (pscore <= 21) {
                winnings = wager * 2;
                player.setCash(winnings);
                player.setBank(winnings - wager);
                $('#alert').removeClass('alert-info alert-error').addClass('alert-success');
                result = 'You win!';
            } else if (pscore > 21) {
                winnings -= wager;
                player.setBank(winnings);
                $('#alert').removeClass('alert-info alert-success').addClass('alert-error');
                result = 'Bust';
            }
        } else if (pscore < dscore) {
            if (pscore <= 21 && dscore > 21) {
                winnings = wager * 2;
                player.setCash(winnings);
                player.setBank(winnings - wager);
                $('#alert').removeClass('alert-info alert-error').addClass('alert-success');
                result = 'You win - dealer bust!';
            } else if (dscore <= 21) {
                winnings -= wager;
                player.setBank(winnings);
                $('#alert').removeClass('alert-info alert-success').addClass('alert-error');
                result = 'You lose!';
            }
        } else if (pscore === dscore) {
            if (pscore <= 21) {
                if (dscore === 21 && dhand.length < 3 && phand.length > 2) {
                    winnings -= wager;
                    player.setBank(winnings);
                    $('#alert').removeClass('alert-info alert-success').addClass('alert-error');
                    result = 'You lose - dealer Blackjack!';
                } else {
                    winnings = wager;
                    $('#alert').removeClass('alert-error alert-success').addClass('alert-info');
                    player.setCash(winnings);
                    result = 'Push';
                }
            } else {
                winnings -= wager;
                player.setBank(winnings);
                $('#alert').removeClass('alert-info alert-success').addClass('alert-error');
                result = 'Bust';
            }
        }

        showAlert(result);

        dealer.flipCards();
        dealer.updateBoard();

        if (parseInt(player.getCash()) < 1) {
            $('#myModal').modal();
            $('#newGame').on('click', function () {
                player.setCash(1000);
                $(this).unbind('click');
                $('#myModal').modal('hide');
            });
        }
    }

    // Event handlers for game buttons
    $('#deal').on('click', function () {
        var cash = parseInt(player.getCash());

        $('#alert').fadeOut();

        if (cash > 0 && !running) {
            if ($.trim($('#wager').val()) > 0) {
                game.newGame();

                 // Enable or disable buttons based on game state
                setActions('run'); 
            } else {
                $('#alert').removeClass('alert-info alert-success').addClass('alert-error');
                showAlert('The minimum bet is $1.')
            }
        } else {
            $('#myModal').modal();
        }
    });

    $('#hit').on('click', function () {
        player.hit()
    })

    $('#stand').on('click', function () {
        player.stand();
    })

    $('#double').on('click', function () {
        player.dbl();
    })

    $('#split').on('click', function () {
        player.splitHand();
    })

    // $('#split').on('click', function () {
    //     currentPlayer.splitHand(); // Use currentPlayer instead of player to handle split for both player and split hands
    // });

    $('#insurance').on('click', function () {
        player.insure();
    })

    // Initialize the game
    player.updateBoard();
    $('#wager').numOnly();
    $('#cash').disableSelection();
    $('#bank').disableSelection();
})();
