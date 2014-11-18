angular.module('utilsTools',[])
  .service('S_utils', [function() {
    var service = {};

    service.getUrlParameterValue = function(url, parameterName) {
      "use strict";

      var urlParameters = url.substr(url.indexOf("#") + 1),
        parameterValue = "",
        index,
        temp;

      urlParameters = urlParameters.split("&");

      for (index = 0; index < urlParameters.length; index += 1) {
        temp = urlParameters[index].split("=");

        if (temp[0] === parameterName) {
          return temp[1];
        }
      }

      return parameterValue;
    }

    return service;
  }]);
