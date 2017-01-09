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

  it("allows to add 2 new questions", function() {
    var m = PredictionMarket.deployed();
    Q1Added = m.addQuestion.call("Will Trump be a good president?").then(function(questionId) {
      return assert.strictEqual(questionId.valueOf(), 0);
    });
    Q2Added = m.addQuestion.call("Will you get rich?").then(function(questionId) {
      return assert.strictEqual(questionId.valueOf(), 1);
    });
    return Q1Added && Q2Added;
  });

  it("can read the two questions", function() {
    var m = PredictionMarket.deployed();
    return m.getQuestion(0).then(function(questionText) {
      return assert.equal(questionText, "Will Trump be a good president?");
    });
  });

  it("can accept bets on a question", function() {
    var m = PredictionMarket.deployed();
    return m.betQuestion(0, 0).then(function(betId) {
      return assert.equal(betId, 0);
    })
  });
});