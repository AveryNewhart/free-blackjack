(function () {

    var game = new Game(),
        player = new Player(),
        dealer = new Player(),
        running = false,
        blackjack = false,
        insured = 0,
        deal;



    function Player(){
        var hand = [],
            wager =0,
            cash = 1000,
            bank = 0,
            ele = '',
            score = '';

        this.getElement = function(){
            if(this === player){
                ele = '#phand';
                score = '#pcard-0 . popover-content';


            }else{
                ele = '#dhand';
                score = '#dhand-0 . popover-content';
            }

            return {'ele': ele, 'score' : score};
        }

        this.getHand = function() {
            return hand;
        }

        this.setHand = function(card){
            hand.push(card);
        }

        this.resetHand = function(){
            hand = [];
        }

        this.getWager = function(){
            wager += parseInt(money, 0);
        }

        this.resetWager = function(){
            wager = 0;
        }

        this.checkWager = function() {
            return wager <= cash ? true : false;
        }

        this.getCash = function() {
            return cash.formatMoney(2, '.', ',');
        }

        this.setCash = function(money){
            cash += money;
            this.updateBoard();
        }

        this.getBank = function(){
            $('#bank').html('Winnings : $' + bank.formatMoney(2, '.', ','));
            if(bank < 0){
                $('#bank').html(`Winnings : <span>-$${bank.formatMoney(2, '.', ',').
                toString().replace('-')}</span>`);
            }
        }

        this.setBank = function(money) {
            bank += money;
            this.updateBoard();
        }

        this.flipCard = function(){
            $('.down').each(function(){
                $(this).removeClass('down').addClass('up');
                renderCard(false, false, false, $(this));
            })

            $('#dcard-0 . popover-content').html(dealer.getScore());
        }
    }

    function Deck() {
        var ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
            suits = []
    }

    function Game(){
        this.newGame = function(){
            var wager = $.trim($('#wager').val());


        }
    }


});