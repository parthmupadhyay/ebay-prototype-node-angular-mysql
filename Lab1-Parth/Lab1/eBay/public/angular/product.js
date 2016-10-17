/**
 * Created by Parth on 06-10-2016.
 */
var productApp = angular.module('productsApp', []);

productApp.controller("productsCtrl",function ($scope,$http,$window)
{

    $scope.loadProducts=function()
    {
        console.log("loading products");
        $http
        ({
            method: "GET",
            url: '/loadProducts'


        }).success(function (data) {
            if (data.statusCode == 401)
            {
                $window.location.assign("../pages/signin");
            }
            else if (data.statusCode == 200)
            {
                console.log("products loaded loaded");
                $scope.products=data.products;
            }

        });
    }

});