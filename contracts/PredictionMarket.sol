pragma solidity ^0.4.2;

contract owned {
    function owned() { owner = msg.sender; }
    address owner;
}

contract mortal is owned {
    function kill() {
        if (msg.sender == owner) selfdestruct(owner);
    }
}

contract PredictionMarket is mortal {
    Question[] public questions;

    struct Bet {
        address bettor;
        uint stake;
        bool predictedOutcome;
    }

    struct Question {
        uint questionId;
        string text;
        bool resolved;
        bool truth;
        Bet[] bets;
    }

    function admin() returns (address) {
        return owner;
    }

    function addQuestion(string questionText) returns (uint id) {
        if (msg.sender != admin()) { throw; }
        id = questions.length++;
        questions[id].questionId = id;
        questions[id].text = questionText;
        questions[id].resolved = false;
        questions[id].truth = false;
        return id;
    }

    function getQuestionText(uint questionId) returns (string text) {
        return questions[questionId].text;
    }

    function getQuestionBet(uint questionId, uint betId) returns (address bettor, uint stake, bool predictedOutcome) {
        bettor = questions[questionId].bets[betId].bettor;
        stake = questions[questionId].bets[betId].stake;
        predictedOutcome = questions[questionId].bets[betId].predictedOutcome;
        return (bettor, stake, predictedOutcome);
    }

    function betQuestion(uint questionId, bool opinion) payable returns (uint betId) {
        if (questions[questionId].resolved == true) { throw; }
        betId = questions[questionId].bets.length;
        questions[questionId].bets.push(Bet(msg.sender, msg.value, opinion));
        return betId;
    }

    function resolveQuestion(uint questionId, bool truth) {
        if (msg.sender != admin()) { throw; }
        questions[questionId].truth = truth;
        questions[questionId].resolved = true;
        payoutQuestion(questionId);
    }

    function payoutQuestion(uint questionId) internal returns (uint leftover) {
        if (questions[questionId].resolved == false) { throw; }
        uint i;
        uint totalValue;
        uint totalValueWrongBets;
        uint totalValueCorrectBets;
        for (i = 0; i < questions[questionId].bets.length; i++) {
            totalValue += questions[questionId].bets[i].stake;
            if (questions[questionId].bets[i].predictedOutcome != questions[questionId].truth) {
                totalValueWrongBets += questions[questionId].bets[i].stake;
            } else {
                totalValueCorrectBets += questions[questionId].bets[i].stake;
            }
        }

        for (i = 0; i < questions[questionId].bets.length; i++) {
            if (questions[questionId].bets[i].predictedOutcome == questions[questionId].truth) {
                uint payout = questions[questionId].bets[i].stake*totalValue/totalValueCorrectBets;
                if (questions[questionId].bets[i].bettor.send(payout) == false) { throw; }
            }
        }
    }
}