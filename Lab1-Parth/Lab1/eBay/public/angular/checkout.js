
/**
 * Created by Parth on 11-10-2016.
 */
var checkoutApp = angular.module('checkoutApp', []);

checkoutApp.controller("checkoutCtrl",function ($scope,$http,$window) {

    $scope.ccnumberValidate=true;
    $scope.expDateValidate=true;
    $scope.cvvValidate=true;

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



});