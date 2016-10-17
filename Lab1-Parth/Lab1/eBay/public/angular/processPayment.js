var processPaymentApp = angular.module('processPaymentApp', []);

processPaymentApp.controller("processPaymentCtrl",function ($scope,$http,$window)
{

    $scope.process=false;
    $scope.placed=true;
    $scope.getCartData=function ()
    {
        $http
        ({
            method: "get",
            url: '/loadCart',

        }).success(function (data) {
            if (data.statusCode == 200)
            {
                $scope.cartData=data.cartData;
                $scope.setTotal();
                $scope.placeOrder();
            }
        });
    }

    $scope.setTotal=function()
    {
        var total=0
        for(var i=0;i<$scope.cartData.length;i++)
        {
            total=total+($scope.cartData[i].quantity*$scope.cartData[i].price);
        }
        $scope.total=total;
    }

    $scope.placeOrder=function ()
    {
        $http
        ({
            method: "POST",
            url: '/addOrderEntry',
            data:
            {
                "total":$scope.total
            }
        }).success(function (data)
        {
            if (data.statusCode == 401)
            {
                console.log("order entry failed")
            }
            else if (data.statusCode == 200)
            {
                console.log("order entry successful");
                $scope.addOrderDetails(data.order_id);

            }

        });
    }

    $scope.addOrderDetails=function (order_id)
    {
        $http
        ({
            method: "POST",
            url: '/addOrderDetails',
            data:
            {
                "order_id":order_id,
                "cartData":$scope.cartData
            }
        }).success(function (data)
        {
            if (data.statusCode == 401)
            {
                console.log("order details entry failed")
            }
            else if (data.statusCode == 200)
            {
                console.log("order details entry successful");
                $scope.updateSellers();


            }

        });
    }

    $scope.updateSellers=function()
    {
        $http
        ({
            method: "POST",
            url: '/updateSellers',
            data:
            {
                "cartData":$scope.cartData
            }
        }).success(function (data)
        {
            if (data.statusCode == 401)
            {
                console.log("seller updation failed")
            }
            else if (data.statusCode == 200)
            {
                console.log("seller updation successful");
                $scope.emptyCart();

            }

        });
    }

    $scope.emptyCart=function()
    {
        $http
        ({
            method: "POST",
            url: '/emptyCart',
            data:
            {

            }
        }).success(function (data)
        {
            if (data.statusCode == 401)
            {
                console.log("cart empty failed")
            }
            else if (data.statusCode == 200)
            {
                console.log("cart empty");
                //$window.location.assign('../pages/success.html');
                $scope.process=true;
                $scope.placed=false;

            }

        });
    }
});