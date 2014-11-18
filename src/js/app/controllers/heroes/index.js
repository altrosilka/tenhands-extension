angular.module('App').controller('C_heroes', [function() {
  var ctr = this;

  ctr.selectedSpecObject = {};

  ctr.selectSpec = function(name){
    //ctr.selectedSpecObject = {};
    //ctr.selectedSpecObject[name] = true; 
  }

  return ctr;
}]);
