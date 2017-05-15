/**
 * Created by truda on 13/05/2017.
 */

module.exports = function($state, $game, $scope) {


    $scope.playerInputs = {};
    $scope.game = $game.getGame();

    console.log($scope.game);

    var player = $game.getPlayer();

    $.each($scope.game.inputs, function(key, value) {
        $scope.playerInputs[key] = value;

        $scope.$watch('playerInputs.' + key, function(oldValue, newValue) {
            $game.input(key, newValue);
        });
    })

};