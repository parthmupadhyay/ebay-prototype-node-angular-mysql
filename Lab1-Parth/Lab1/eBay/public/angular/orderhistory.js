/**
 * Created by Parth on 12-10-2016.
 */
var orderHistoryApp = angular.module('orderHistoryApp', []);

orderHistoryApp.controller("orderHistoryCtrl",function ($scope,$http,$window)
{

    $scope.loadOrders=function()
    {
        console.log("loading user orders");
        $http
        ({
            method: "GET",
            url: '/loadOrders'


        }).success(function (data) {
            if (data.statusCode == 401) {
                console.log("failed to load order ids")
            }
            else if (data.statusCode == 200)
            {
                console.log("Order id's loaded");
                console.log(data.orders);
                $scope.loadOrderDetails(data.orders);
            }

        });

    }

    $scope.loadOrderDetails=function(orders)
    {
        console.log("Loading order details");
        $http
        ({
            method: "POST",
            url: '/loadOrderDetails',
            data:
            {
                "orders":orders
            }

        }).success(function (data) {
            if (data.statusCode == 401) {
                console.log("failed to load order ids")
            }
            else if (data.statusCode == 200)
            {
                console.log("Order details loaded");
                /*for(var i=0;i<data.orderDetails.length;i++)
                 {
                 console.log(data.orderDetails[i].product_name);
                 }*/
                console.log(data.orderDetails);
                $scope.orderDetails=data.orderDetails;
            }

        });
    }


});