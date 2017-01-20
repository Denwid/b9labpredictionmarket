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

  it("can accept a first bet on a second question", function(done) {
    var m = PredictionMarket.deployed();
    return m.betQuestion(1, false, {value: 17, from:accounts[1]}).then(done())
  });

  it("can accept a second bet on the second question", function(done) {
    var m = PredictionMarket.deployed();
    m.betQuestion(1, false, {value: 6, from:accounts[2]}).then(done())
  })

  it("can accept a third bet on the second question", function(done) {
    var m = PredictionMarket.deployed();
    m.betQuestion(1, true, {value: 100, from:accounts[3]}).then(done())
  })

  it("can resolve the second question", function(done){
    var m = PredictionMarket.deployed();

    var before = {
      A: web3.eth.getBalance(accounts[1]),
      B: web3.eth.getBalance(accounts[2]),
      C: web3.eth.getBalance(accounts[3])
    }
    //console.log(before)

    return m.resolveQuestion(1, false)
    .then(function() {
      var after = {
        A: web3.eth.getBalance(accounts[1]),
        B: web3.eth.getBalance(accounts[2]),
        C: web3.eth.getBalance(accounts[3])
      }

      differenceA = after.A.minus(before.A).toNumber();
      differenceB = after.B.minus(before.B).toNumber();
      differenceC = after.C.minus(before.C).toNumber();

      return assert.equal(differenceA, 90)
      && assert.equal(differenceB, 32)
      && assert.equal(differenceC, -100);
    })
    .then(done());
  });
});