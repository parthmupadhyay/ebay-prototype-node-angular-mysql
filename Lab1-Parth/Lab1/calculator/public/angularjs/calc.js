/**
 * Created by Parth on 26-09-2016.
 */
var calcApp=angular.module("calcApp",[]);

calcApp.controller("calcCtrl",function ($scope,$http)
{
    $scope.calculate= function (buttonEvent)
    {
        $http
        ({
            method:"post",
            url:'/'+buttonEvent.target.getAttribute('value'),
            data:
            {
                "num1":$scope.num1,
                "num2":$scope.num2
            }


        }).success(function (data)
        {
            if(data.statusCode==200)
            {
                $scope.result=data.data;
            }
            else if(data.statusCode==402)
            {
                $scope.result="Divide by 0!! Take infinity"
            }
            else
            {
                $scope.result="invalid values"
            }

        });
    };

});