/**
 * Created by Parth on 30-09-2016.
 */

var routeApp = angular.module('indexApp', ['ngRoute']);

// configure our routes
routeApp.config(function($routeProvider) {
    $routeProvider

        .when('/addAdvertisement', {
            templateUrl : 'addAdvertisement',
            controller  : 'indexCtrl'
        })

        .when('/orderHistory', {
            templateUrl : 'orderHistory',
            controller  : 'indexCtrl'
        })

});



// create the controller and inject Angular's $scope
routeApp.controller('indexCtrl', function($scope,$http,$window)
{
    //$scope.productDetail=true;
    $scope.test="test";
    $scope.cart=true;
    $scope.checkout=true;
    $scope.ccnumberValidate=true;
    $scope.expDateValidate=true;
    $scope.cvvValidate=true;
    $scope.orderHistoryContainer=true;
    /*$scope.userAds=true;*/
    $scope.showCheckOut=function ()
    {
        $scope.userAds=true;
        $scope.pro=true;
        $scope.productDetail=true;
        $scope.cart=true;
        $scope.checkout=false;
        $scope.orderHistoryContainer=true;
    }

    $scope.showAddAdvertise=function()
    {
        $scope.pro=true;
        $scope.userAds=true;
        $scope.productDetail=true;
        $scope.cart=true;
        $scope.orderHistoryContainer=true;
    }
    $scope.showProducts=function ()
    {
        $scope.pro=false;
        $scope.userAds=true;
        $scope.productDetail=true;
        $scope.cart=true;
        $scope.orderHistoryContainer=true;
    }
    $scope.showUserAds=function ()
    {
        $scope.userAds=false;
        $scope.pro=true;
        $scope.productDetail=true;
        $scope.cart=true;
        $scope.orderHistoryContainer=true;
    }
    $scope.showOrderDetails=function () {
        $scope.userAds=true;
        $scope.pro=true;
        $scope.productDetail=true;
        $scope.cart=true;
        $scope.orderHistoryContainer=false;
    }
    $scope.showProductDetail=function()
    {
        $scope.userAds=true;
        $scope.pro=true;
        $scope.productDetail=false;
        $scope.cart=true;
        $scope.orderHistoryContainer=true;
    }

    $scope.showCart=function()
    {
        $scope.userAds=true;
        $scope.pro=true;
        $scope.productDetail=true;
        $scope.cart=false;
        $scope.checkout=true;
        $scope.orderHistoryContainer=true;
    }

    $scope.checkCCNumber=function()
    {
        var cardRegex=new RegExp("^4[0-9]{12}(?:[0-9]{3})?$","g");
        if(cardRegex.test($scope.ccnumber))
        {
            $scope.ccnumberValidate=true;
        }
        else
        {
            $scope.ccnumberValidate=false;
        }
    }
    $scope.checkExpDate=function()
    {
        var expDateRegex=new RegExp("^(0[1-9]|1[0-2])\/([0-9]{2})$","g");
        if(expDateRegex.test($scope.expDate))
        {
            $scope.expDateValidate=true;
        }
        else
        {
            $scope.expDateValidate=false;
        }
    }

    $scope.checkCvv=function()
    {
        var cvvRegex=new RegExp("^[0-9]{3,4}$","g");
        if(cvvRegex.test($scope.cvv))
        {
            $scope.cvvValidate=true;
        }
        else
        {
            $scope.cvvValidate=false;
        }
    }



    $scope.getTotal=function ()
    {
        var total=0;
        for(var i=0;i<$scope.cartData.length;i++)
        {
            total=total+$scope.cartData[i].price;
        }
        return total;
    }

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
                //$window.location.assign('../pages/cartModal.html');
                //$scope.cartModalB="works";
                initiateClick();
                            }

        });
    }

    $scope.loadCart=function()
    {
        console.log("loading cart");
        $http
        ({
            method: "POST",
            url: '/loadCart',

        }).success(function (data) {
            if (data.statusCode == 401) {
                console.log("failed to load cart")
            }
            else if (data.statusCode == 200)
            {
                $scope.cartData=data.cartData;
            }

        });

    }



});

routeApp.controller('homeCtrl', function($scope) {
    $scope.message = 'Look! I am an about page.';
});



routeApp.controller('orderHistoryCtrl', function($scope) {
    $scope.message = 'Contact us! JK. This is just a demo.';
});