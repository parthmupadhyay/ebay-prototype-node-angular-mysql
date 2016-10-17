/**
 * Created by Parth on 06-10-2016.
 */
var userAdApp = angular.module('userAdApp', []);


userAdApp.controller("userAdCtrl",function ($scope,$http,$window)
{
    $scope.test="Hello";
    $scope.loadUserAds=function()
    {
        console.log("loading user ads");
        $http
        ({
            method: "GET",
            url: '/userAdvertisements'


        }).success(function (data) {
            if (data.statusCode == 401) {
                console.log("failed to load user ads")
            }
            else if (data.statusCode == 200)
            {
                console.log("ads loaded");
                $scope.userAds=data.userAds;
            }

        });

    }

});