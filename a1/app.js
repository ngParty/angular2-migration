var boxesApp = angular
  .module('boxes', [])
  .directive('boxApp', BoxAppDirective)
  .directive('boxList', BoxListDirective)
  .service('boxService', BoxService);

function BoxService() {
  this.boxes = [{ value: 1 }];
  this.boxSubject = new Rx.ReplaySubject();
  this.boxSubject.onNext(this.boxes);
}
BoxService.prototype.add = function add() {
  this.boxes.push({ value: this.boxes.length + 1 });
  this.boxSubject.onNext(this.boxes);
};


function BoxAppDirective() {
  return {
    templateUrl: 'box-app.html',
    controllerAs: 'box',
    controller: BoxCtrl
  };
}

function BoxCtrl(boxService) {
  boxService.boxSubject.subscribe(function (boxes) {
    this.boxes = boxes;
  }.bind(this));
}
BoxCtrl.$inject = ['boxService'];

function BoxListDirective() {
  return {
    templateUrl: 'box-list.html',
    controllerAs: 'boxList',
    controller: ['$scope', '$attrs', 'boxService', function ($scope, $attrs, boxService) {
      this.boxes = $scope.$eval($attrs.boxes);

      this.add = function add() {
        boxService.add();
      };

    }]
  };
}


angular.bootstrap(document,[boxesApp.name]);
