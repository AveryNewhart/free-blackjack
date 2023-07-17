(function () {

    var game = new Game();


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
    }

    function Game(){
        this.newGame = function(){
            var wager = $.trim($('#wager').val());


        }
    }


});