contract('PredictionMarket', function(accounts) {
  it("should assert true", function(done) {
    var m = PredictionMarket.deployed();
    assert.isTrue(true);
    done();
  });

  it("sets admin account correctly", function() {
    var m = PredictionMarket.deployed();
    return m.admin.call().then(function(outAdminAddress) {
      return assert.equal(outAdminAddress , accounts[0]);
    })
  });

  it("allows to add a question", function(done) {
    var m = PredictionMarket.deployed();
    return m.addQuestion("Will Trump be a good president?").then(done());
  });

  it("allows to add another question", function(done) {
    var m = PredictionMarket.deployed();
    return m.addQuestion("Will you get rich?").then(done());
  });

  it("shows the new question", function() {
    var m = PredictionMarket.deployed();
    return m.questions.call(0).then(function(q) {
      return assert.equal(q[1]  , "Will Trump be a good president?")
    });
  });

  it("can read the text of the second question", function() {
    var m = PredictionMarket.deployed();
    return m.getQuestionText.call(0).then(function(questionText) {
      return assert.equal(questionText, "Will Trump be a good president?");
    });
  });

  it("can accept a bet on a question", function(done) {
    var m = PredictionMarket.deployed();
    return m.betQuestion(0, false).then(done());
  });

  it("can read the submitted bet", function() {
    var m = PredictionMarket.deployed();
    return m.getQuestionBet.call(0, 0).then(function(bets) {
      accountsCorrect = (bets[0] == accounts[0]);
      valueCorrect = (bets[1] == 0);
      predictionCorrect = (bets[2] == false);
      lengthsMatch = (bets.length == 3)
      return assert.isTrue(lengthsMatch && accountsCorrect && valueCorrect && predictionCorrect);
    });
  });
});