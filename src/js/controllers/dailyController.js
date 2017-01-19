angular.module('RDash').controller("dailyController", function ($scope, Data) {
    $scope.disable = false;
    $scope.definition = [];
    $scope.show = function (date) {
        if (date) {

            $scope.disable = true;
            

            Data.get('daily').then(function (data) {
               $scope.students = data;
               $scope.definition = ['בזמן', 'מאחר']
            })

            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
             for (var j = 0; j < 3; j++) {
                 var texta = "";
                 var textb = "";
                 var textc = "";
                 for (var i = 0; i < 5; i++) {
                     texta += possible.charAt(Math.floor(Math.random() * possible.length));
                     textb += possible.charAt(Math.floor(Math.random() * possible.length));
                     textc += possible.charAt(Math.floor(Math.random() * possible.length));

                 }
                 $scope.students[j] = {
                     first: texta,
                     last: textb,
                     phone: textc
                 }
                 $scope.definition[j] = texta + textb;
             }
        }
    }
    
    $scope.students = [{first : 'אני', last : 'ואתה', phone : 'נשנה'}];
    $scope.viewDate = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
    }
});