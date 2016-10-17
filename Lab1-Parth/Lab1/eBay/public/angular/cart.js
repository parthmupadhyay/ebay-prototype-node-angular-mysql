/**
 * Created by Parth on 07-10-2016.
 */

var cartApp = angular.module('cartApp', []);

cartApp.controller("cartCtrl",function ($scope,$http,$window) {

    $scope.emptycart=true;
    $scope.avcart=true;
    $scope.loadCart = function () {
        console.log("loading cart");
        $http
        ({
            method: "get",
            url: '/loadCart',

        }).success(function (data) {
            if (data.statusCode == 401) {
                console.log("failed to load cart")
            }
            else if (data.statusCode == 200) {
                $scope.cartData = data.cartData;
                console.log($scope.cartData);
                if($scope.cartData[0]==undefined)
                {
                    $scope.emptycart=false;
                    $scope.avcart=true;
                }
                else
                {
                    $scope.avcart=false;
                    $scope.emptycart=true;
                    $scope.setTotal();
                }
            }

        });

    }

    $scope.updateQuantity=function(index,currentQty,qty,maxQty)
    {
        $scope.cartData[index].quantity=$scope.cartData[index].quantity+(qty-currentQty);
        $scope.setTotal();
        $http
        ({
            method: "post",
            url: '/updateCartItem',
            data:
            {
                "cart_id":$scope.cartData[index].cart_id,
                "quantity":$scope.cartData[index].quantity
            }

        }).success(function (data) {
            if (data.statusCode == 401) {
                console.log("failed to update cart")
            }
            else if (data.statusCode == 200)
            {
                console.log("updated cart");
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

    $scope.removeFromCart=function(cart_id,index)
    {
        console.log("cart_id:"+cart_id);
        $http
        ({
            method: "post",
            url: '/removeFromCart',
            data:
            {
                "cart_id":cart_id
            }

        }).success(function (data) {
            if (data.statusCode == 401) {
                console.log("failed to remove from cart")
            }
            else if (data.statusCode == 200)
            {
                console.log("removed from cart");
                $scope.cartData.splice(index,1);
                $scope.loadCart();
            }

        });
    }

});