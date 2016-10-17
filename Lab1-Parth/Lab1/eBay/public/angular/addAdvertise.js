
/**
 * Created by Parth on 07-10-2016.
 */
var addAdvertApp = angular.module('addAdvertApp', []);

addAdvertApp.controller("addAdvertCtrl",function ($scope,$http,$window) {
    $scope.loadFooter = function ()
    {
        console.log("loading footer");
        $http
        ({
            method: "get",
            url: '/loadFooterData'

        }).success(function (data) {
            $scope.username = data.username;
            $scope.lastloggin = data.lastloggin;
            console.log("in footer:"+$scope.lastloggin);

        });
    }
});