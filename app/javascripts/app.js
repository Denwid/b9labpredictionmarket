var app = angular.module('predictionMarketApp', []);

app.controller("predictionMarketController", [ '$scope', '$window', '$timeout', function($scope, $window, $timeout) {
        $scope.accounts = [];
        $scope.account = "";
        $scope.balance = "";

        $scope.questions = [
            {id: 0, text: "dummy question?", resolved: false, truth: undefined}
        ]

        $scope.updateBalance = function() {
           $scope.balance = web3.eth.getBalance($scope.account);
        }

        $scope.getAccounts = function() {
            web3.eth.getAccounts(function(err, accs) {
                    if (err != null) {
                        alert("There was an error fetching accounts.");
                        return;
                    }

                    if (accs.length == 0) {
                        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                        return;
                    }

                    console.log(accs);
                    $scope.accounts = accs;
                    $scope.account = $scope.accounts[0];
                    $scope.updateBalance();
            })
        }

        $scope.getQuestions = function() {
           m =  PredictionMarket.deployed()
        };

        $window.onload = function () {
            $scope.getAccounts();
            $scope.getQuestions();
        }

}]);