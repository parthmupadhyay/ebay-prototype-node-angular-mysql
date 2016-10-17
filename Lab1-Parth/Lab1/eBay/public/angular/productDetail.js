/**
 * Created by Parth on 06-10-2016.
 */
var productDetailApp = angular.module('productDetailApp', []);

productDetailApp.controller("productDetailCtrl",function ($scope,$http,$window) {

    $scope.addToCart=function()
    {
        console.log($scope.product_name);
        $http
        ({
            method: "POST",
            url: '/addToCart',
            data:
            {
                "product_id":$scope.product_id,
                "quantity":$scope.quantity,
                "price":$scope.price,
                "product_name":$scope.product_name,
                "seller_id":$scope.seller_id
            }
        }).success(function (data) {
            if (data.statusCode == 401) {
                console.log("failed to add to cart")
            }
            else if (data.statusCode == 200) {
                console.log("Successfully added to cart");
                initiateCartModal();

            }

        });
    }

    $scope.bidnow=function ()
    {
        console.log($scope.bidAmount);
        $http
        ({
            method: "POST",
            url: '/bidForProduct',
            data:
            {
                "product_id":$scope.product_id,
                "bidAmount":$scope.bidAmount
            }
        }).success(function (data) {
            if (data.statusCode == 401) {
                console.log("bidding failed")
            }
            else if (data.statusCode == 200) {
                console.log("Successfully bid placed");
                initiateBidModal();

            }

        });
    }

});
