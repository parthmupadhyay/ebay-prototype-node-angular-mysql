/**
 * Created by Parth on 30-09-2016.
 */
var signApp=angular.module("signApp",['ngRoute']);

signApp.config(function($routeProvider) {
    $routeProvider

    // route for the home page
        .when('/', {
            templateUrl : '/signin',
            controller  : 'signCtrl'
        })

        .when('/signup', {
            templateUrl : '/signup',
            controller  : 'signCtrl'
        })

        .when('/add', {
            templateUrl : '/user-details',
            controller  : 'signCtrl'
        })
});

signApp.factory('formData',function ()
{
   var object= new Object();


    return object;
});

/*signApp.controller('signUpCtrl', function($scope) {
    // create a message to display in our view
    console.log($scope.formdata);
});

signApp.controller('detailCtrl', function($scope) {
    console.log($scope.formdata);
}); */

signApp.controller("signCtrl",function ($scope,$http,formData,$window)
{
    $scope.username_exists=true;
    $scope.email_exists=true;
    $scope.username_available=true;
    $scope.password_mismatch=true;
    $scope.firstNameValidate=true;
    $scope.lastNameValidate=true;
    $scope.emailValidate=true;
    $scope.passwordValidate=true;
    $scope.rePasswordValidate=true;
    $scope.formdata= formData;
    $scope.checkUserName=function ()
    {
        if($scope.username==undefined)
        {
            $scope.username_available=true;
        }
        else {
            $http
            ({
                method: "POST",
                url: '/checkUserName',
                data: {
                    "username": $scope.username
                }
            }).success(function (data) {
                if (data.statusCode == 401) {
                    $scope.username_exists = false;
                    $scope.username_available = true;
                }
                else if (data.statusCode == 200) {
                    $scope.username_available = false;
                    $scope.username_exists = true;
                }

            });
        }

    };

    $scope.matchPassword=function ()
    {
        if($scope.password!=$scope.repassword)
        {
            $scope.password_mismatch=false;
        }
        else
        {
            $scope.password_mismatch=true;
        }
    };

    $scope.checkEmail=function ()
    {
        $http
        ({
            method:"POST",
            url:'/checkEmail',
            data:
            {
                "email":$scope.email
            }
        }).success(function (data)
        {
            if(data.statusCode==401)
            {
                $scope.email_exists=false;

            }
            else if(data.statusCode==200)
            {

                $scope.email_exists=true;
            }

        });

    };

    $scope.saveSignUpData=function ()
    {
        console.log("Saving data");

        formData.firstName=$scope.firstName;
        formData.lastName=$scope.lastName;
        formData.email=$scope.email;
        formData.password=$scope.password;

        console.log(formData);
        //$window.location.assign("#/add");

    };


    $scope.checkFormData=function()
    {
        if($scope.firstName==""||$scope.firstName==undefined)
        {
            $scope.firstNameValidate=false;
            return;
        }
        else
        {
            $scope.firstNameValidate=true;
        }

        if($scope.lastName==""||$scope.lastName==undefined)
        {
            $scope.lastNameValidate=false;
            return;
        }
        else
        {
            $scope.lastNameValidate=true;
        }

        if($scope.email==""||$scope.email==undefined)
        {
            $scope.emailValidate=false;
            return;
        }
        else
        {
            $scope.emailValidate=true;
        }

        if($scope.password==""||$scope.password==undefined)
        {
            $scope.passwordValidate=false;
            return;
        }
        else
        {
            $scope.passwordValidate=true;
        }

        if($scope.repassword==""||$scope.repassword==undefined)
        {
            $scope.rePasswordValidate=false;
            return;
        }
        else
        {
            $scope.rePasswordValidate=true;
        }

        if($scope.firstNameValidate&&
        $scope.lastNameValidate&&$scope.emailValidate&&
        $scope.passwordValidate&&$scope.rePasswordValidate)
        {
            $window.location.assign("#/add");
        }
    }


});