pragma solidity ^0.4.2;

import "Mortal.sol";

contract PredictionMarket is Mortal {
    Question[] public questions;

    struct Bet {
        address bettor;
        bool predictedOutcome;
        uint stake;
    }

    struct Question {
        uint questionId;
        string text;
        bool resolved;
        bool truth;
        uint totalValue;
        uint totalValueWrongBets;
        uint totalValueCorrectBets;
        Bet[] bets;
    }

    function getAdmin() constant returns (address) {
        return owner;
    }

    modifier adminOnly() {
        if (msg.sender == getAdmin()) _;
    }

    function addQuestion(string questionText) adminOnly returns (uint id) {
        id = questions.length;
        questions.length++;
        theQuestion = questions[id]
        theQuestion.questionId = id;
        theQuestion.text = questionText;
        theQuestion.resolved = false;
        theQuestion.truth = false;
        theQuestion.totalValue = 0;
        return id;
    }

    function getQuestionText(uint questionId) constant returns (string text) {
        return questions[questionId].text;
    }

    function getQuestionBet(uint questionId, uint betId) constant returns (address bettor, bool predictedOutcome, uint stake) {
        bettor = questions[questionId].bets[betId].bettor;
        stake = questions[questionId].bets[betId].stake;
        predictedOutcome = questions[questionId].bets[betId].predictedOutcome;
        return (bettor, predictedOutcome, stake);
    }

    function betQuestion(uint questionId, bool opinion) payable returns (uint betId) {
        if (questions[questionId].resolved == true) { throw; }
        theQuestion = questions[questionId]
        theQuestion.totalValue += msg.value;
        return theQuestion.bets.push(Bet({
            bettor: msg.sender,
            predictedOutcome: opinion,
            stake: msg.value
        }));
    }

    event TotalToDistribute(uint totalValue, uint totalValueCorrectBets, uint totalValueWrongBets);
    event Sending(uint amount, address receiver);

    function resolveQuestion(uint questionId, bool truth) {
        if (msg.sender != getAdmin()) { throw; }
        theQuestion = questions[questionId];
        if (theQuestion.resolved == true) { throw; }
        theQuestion.truth = truth;
        theQuestion.resolved = true;
    }

    function calculateContribution(uint questionId, uint betId) {
        Question theQuestion = questions[questionId];
        if (theQuestion.resolved == false) { throw; }
        Bet theBet = theQuestion.bets[betId];
        if (theBet.predictedOutcome != theQuestion.truth) {
            totalValueWrongBets += theBet.stake;
        } else {
            totalValueCorrectBets += theBet.stake;
        }
        TotalToDistribute(theQuestion.totalValue, theQuestion.totalValueCorrectBets, theQuestion.totalValueWrongBets);
    }

    function cashOut(uint questionId, uint betId)
        if (questions[questionId].resolved == false) { throw; }
        Question theQuestion = questions[questionId];
        if (theQuestion.totalValueCorrectBets + theQuestion.totalValueWrongBets < theQuestion.totalValue) { throw; }
        Bet theBet = theQuestion.bets[betId];
        if (theBet.bettor != msg.sender) { throw; }
        if (theBet.predictedOutcome != theQuestion.truth) { throw; }
        
        uint payout = theBet.stake*theQuestion.totalValue/theQuestion.totalValueCorrectBets;
        uint leftover = 
        if (msg.sender.send(payout) == false) { throw; }
        Sending(payout, receiver);
    }

    function drainLeftover() {

    }
}