'use strict';
app.service('LichSuHanhTrinhService', ['BaseServices', function(BaseServices) {
  var urls = {
    getListLichSu: "lshtagl?action=list"
  }
  function getListLichSu(data) {
    return BaseServices.callAPI(urls.getListLichSu, 'POST', data);
  }

  var service = {
    getListLichSu: getListLichSu
  };
  return service;
}]);
