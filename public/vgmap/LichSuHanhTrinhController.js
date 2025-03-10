app.controller('LichSuHanhTrinhController', ['$scope', 'LichSuHanhTrinhService', function($scope, LichSuHanhTrinhService) {

  $scope.search = {};
  $scope.errorBienSo = false;
  $scope.errorTuNgay = false;
  $scope.errorDenNgay = false;
  $scope.errorMessage = '';

  document.title = 'Lịch sử hành trình';
  $('.datepicker').datepicker({
    format: 'dd/mm/yyyy',
    autoclose: false,
  });
  $('.select2').select2();
  $scope.objTuNgay = moment().format('DD/MM/YYYY');
  $scope.objDenNgay = moment().format('DD/MM/YYYY');
  $scope.isTimKiem = getCookie('timKiemLichSu');
  if ($scope.isTimKiem == '1') {
    $scope.search.bienSo = getCookie('objBienSo');
    $scope.objTuNgay = getCookie('objTuNgay');
    $scope.objDenNgay = getCookie('objDenNgay');
    $scope.objTuGio = getCookie('objTuGio');
    $scope.objDenGio = getCookie('objDenGio');
    $scope.search.tuNgay = moment($scope.objTuNgay + ' ' + $scope.objTuGio, 'DD/MM/YYYY HH:mm:ss').valueOf();
    $scope.search.denNgay = moment($scope.objDenNgay + ' ' + $scope.objDenGio, 'DD/MM/YYYY HH:mm:ss').valueOf();
    $scope.objTuGio = moment($scope.objTuGio, 'HH:mm:ss').format('HH:mm');
    $scope.objDenGio = moment($scope.objDenGio, 'HH:mm:ss').format('HH:mm');
    $('#objTuGio').val($scope.objTuGio);
    $('#objTuGio').trigger('change');
    $('#objDenGio').val($scope.objDenGio);
    $('#objDenGio').trigger('change');
  }
  $('#tuNgay').datepicker('setDate', $scope.objTuNgay);
  $('#denNgay').datepicker('setDate', $scope.objDenNgay);

  $scope.model = new viewModel();

  initData();
  initMap();

  function initMap() {
    $('body').addClass('sidebar-collapse');
    jQuery('#content_body').showLoading();
    $.when($scope.model.initVGMap()).then(
      jQuery('#content_body').hideLoading(),
    );

  }

  function initData() {
    jQuery('#content_body').showLoading();
    return LichSuHanhTrinhService.getListLichSu({
      'mapParam': $scope.search,
    }).then(function(data) {
      if (data.msg.errCode == '0') {
        $scope.model.initInfo(data.msg.object.infos);
        $scope.model.insertData(data.msg.object.listHistory);
      } else {
        $('#device-company .deviceLGroup-Info .deviceLGroup-Administrator').text('Chưa có thông tin');
        $('#device-company .deviceLGroup-Info .deviceLGroup-Provider').text('Chưa có thông tin');
        $('#device-company .deviceLGroup-Info .deviceLGroup-Business').text('Chưa có thông tin');
        $('#device-company .deviceLGroup-Info .deviceLGroup-Phone').text('Chưa có thông tin');
        $('#device-company .deviceLGroup-CarNumber .CarNumber').text($scope.search.bienSo);
        $('#device-company .deviceLGroup-Type .deviceType').text('Loại xe: Chưa có thông tin');
        if (data.msg.errCode == '4041') {
          alert('Biển số không tồn tại');
        } else if (data.msg.errCode == '4043') {
          alert('Bạn không có quyền xem dữ liệu');
        } else if (data.msg.errCode == '4042') {
          if (data.msg.object.infos != '' && data.msg.object.infos != undefined) {
            $scope.model.initInfo(data.msg.object.infos);
          }
          alert('Không có dữ liệu của xe trong thời gian đã chọn');
        } else {
          alert('Bạn không có quyền xem dữ liệu');
        }
      }
      jQuery('#content_body').hideLoading();
    }, function(error) {
      checkError(error);
    });
  }

  function setCookieTimKiem() {
    setCookie('objBienSo', $scope.search.bienSo);
    setCookie('objTuNgay', $scope.objTuNgay);
    setCookie('objDenNgay', $scope.objTuNgay);
    setCookie('objTuGio', $scope.objTuGio);
    setCookie('objDenGio', $scope.objDenGio);
  }

  $scope.checkInput = function() {
    $scope.errorBienSo = false;
    $scope.errorTuNgay = false;
    $scope.errorDenNgay = false;
    $scope.errorMessage = '';

    if (!$scope.search.bienSo) {
      $scope.errorBienSo = true;
      $scope.errorMessage = 'Bạn chưa nhập biển số xe!';
      $('#bienSo').focus();
      return false;
    }
    if ($scope.objTuNgay) {
      $scope.search.tuNgay = moment($scope.objTuNgay + ' ' + $scope.objTuGio, 'DD/MM/YYYY HH:mm:ss').valueOf();
    } else {
      $scope.errorTuNgay = true;
      $scope.errorMessage = 'Bạn chưa nhập ngày bắt đầu!';
      $('#tuNgay').focus();
      return false;
    }
    if ($scope.objDenNgay) {
      $scope.search.denNgay = moment($scope.objDenNgay + ' ' + $scope.objDenGio, 'DD/MM/YYYY HH:mm:ss').valueOf();
    } else {
      $scope.errorDenNgay = true;
      $scope.errorMessage = 'Bạn chưa nhập ngày kết thúc!';
      $('#denNgay').focus();
      return false;
    }
    if ($scope.search.tuNgay > $scope.search.denNgay) {
      $scope.errorDenNgay = true;
      $scope.errorMessage = 'Ngày bắt đầu không được nhỏ hơn ngày kết thúc!';
      $('#denNgay').focus();
      return false;
    }
    return true;
  };
  $scope.find = function() {
    if (!$scope.checkInput()) {
      return false;
    }
    setCookieTimKiem();
    $scope.search.tuNgay = moment($scope.objTuNgay + ' ' + $scope.objTuGio, 'D/M/YYYY HH:mm:ss').valueOf();
    $scope.search.denNgay = moment($scope.objDenNgay + ' ' + $scope.objDenGio, 'D/M/YYYY HH:mm:ss').valueOf();
    initData();
  };
  $scope.baocaochitiet = function() {
    setCookie('timKiemHanhTrinh', '1');
    setCookie('objBienSo', $scope.search.bienSo);
    setCookie('objTuNgay', moment($scope.search.tuNgay).format('YYYY/MM/DD HH:mm:ss'));
    setCookie('objDenNgay', moment($scope.search.denNgay).format('YYYY/MM/DD HH:mm:ss'));
    window.location.href = 'baocao-chitiet-lichsuhanhtrinh';
  };
  $scope.thoat = function() {
    window.location.href = 'main';

  };
  $(document).ready(function() {
    //Click to play buton
    $('.x-btn-play').click(function() {
      $scope.model.startClicked();
    });
    //Click to pause button
    $('.x-btn-stop').click(function() {
      $scope.model.pauseClicked();
    });
    // Click to row tr
    $(document).on('click', '.x-row-tr', function() {
      var e = $(this);
      $scope.model.rowTableClick(e);
    });
    // Hover to row tr
    $(document).on('mousemove', '.x-row-tr', function() {
      console.log('hover');
      var e = $(this);

      $scope.model.rowTableHover(e);
    });
    //Hover out to row tr
    $(document).on('mouseleave', '.x-row-tr', function() {
      console.log('mouseleave');

      var e = $(this);
      $scope.model.hideTooltipDetail(e);
    });
  });
}]);
