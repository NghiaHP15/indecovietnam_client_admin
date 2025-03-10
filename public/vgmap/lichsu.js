function viewModel() {
  //Khoi tao bien
  var self = this;
  self.tBodyTable = $("table.table-history-content tbody");
  self.infos = {};
  self.datas = [];
  self.isPlay = false;
  self.pause = false;
  self.index = 0;
  self.interval = null;
  self.speed = 1000;
  self.zoom = 10;
  self.latlngs = [];
  self.marker = {};

  //Khoi tao Vmap
  self.initVGMap = function() {
    self.mapCore = new VGMap.VGMapCore('map' /* id chứa map */ , {
      center: new VGMap.VGLatLng(21.19601, 105.9536), // tâm mặc định
      zoom: 10, // mức zoom mặc định
      minZoom: 6, // mức zoom lớn nhất
      maxZoom: 15, // mức zoom nhỏ nhất
      draggable: true, // cho phép kéo thả bản đồ
      zoomControl: true, // hiển thị thanh công cụ zoom
    });
  }

  // Khoi tao nano scroller
  self.initNanoScroller = function() {
    $(".nano").nanoScroller();
  }
  // Xoa nano scroller
  self.destroyNanoScroller = function() {
    $(".nano").nanoScroller({
      destroy: true
    });
  }
  // Click nut start
  self.startClicked = function() {
    self.isPlay = true;
    self.speed = $("#play-speed option:selected").val();
    $(".x-btn-control").removeClass("x-btn-show");
    $(".x-btn-stop").addClass("x-btn-show");
    self.interval = setInterval(function() {
      // Active list lich su xe chay
      if (self.index < self.datas.length) {
        $(".x-row-tr").removeClass("active");
        var currentRow = $("[tab=" + self.index + "]");
        currentRow.addClass("active");
        self.showInfoDetail(self.datas[self.index]);
        $(".nano").nanoScroller({
          scrollTo: currentRow
        });
        // Ve ban do
        self.setMakerOnMap(self.datas[self.index]);
        self.index = self.index + 1;
      } else {
        self.stopDrawClicked();
      }
    }, parseInt(self.speed));
  }
  // Click nut pause
  self.pauseClicked = function() {
    self.isPlay = false;
    window.clearInterval(self.interval);
    $(".x-btn-control").removeClass("x-btn-show");
    $(".x-btn-play").addClass("x-btn-show");
  }
  // Dung ve ban do
  self.stopDrawClicked = function() {
    window.clearInterval(self.interval);
    $(".x-btn-control").removeClass("x-btn-show");
    $(".x-btn-play").addClass("x-btn-show");
    $(".x-row-tr").removeClass("active");
    self.index = 0;
    $(".nano").nanoScroller({
      scroll: 'top'
    });
    self.hideInfoDetail();
    // lam moi & tao maker xe dau tien
    self.setMakerOnMap(self.datas[self.index]);
    self.isPlay = false;
    // console.log("Tong so ban ghi: " + self.datas.length);
  }
  //Click vao row table
  self.rowTableClick = function(e) {
    if (self.isPlay == false) {
      var i = e.index();
      self.index = i;
      self.showInfoDetail(self.datas[self.index]);
      $(".x-row-tr").removeClass("active");
      var currentRow = $("[tab=" + self.index + "]");
      currentRow.addClass("active");
      $(".nano").nanoScroller({
        scrollTo: currentRow
      });
      // Zoom map
      self.setMakerOnMap(self.datas[self.index]);
    }
  }
  //Hover vao row table
  self.rowTableHover = function(e) {
    if (self.isPlay == false) {
      var i = e.index();
      self.index = i;
      self.showInfoDetail(self.datas[self.index]);
      self.showTooltipDetail(e, self.datas[self.index]);
      $(".x-row-tr").removeClass("active");
      $("[tab=" + i + "]").addClass("active");
      // Zoom map
      self.setMakerOnMap(self.datas[self.index]);
    }
  }

  //Show thong tin chi tiet
  self.showInfoDetail = function(d) {
    $("#item-device-info .lat-long").html('<b>Vĩ độ - Kinh độ:</b> ' + d.latitude.toFixed(5) + ' - ' + d.longitude.toFixed(5));
    $("#item-device-info .address").html('<b>Tên đường:</b> ' + d.address);
    $("#item-device-info .rinder").html('<b>Tốc độ:</b> ' + d.speed + ' km/h  <b>Hướng:</b> ' + d.heading);
    $("#item-device-info .time-info").html('<b>Thời gian:</b> ' + d.stime);
    $("#item-device-info").addClass("x-btn-show");
  }
  //Hide thong tin chi tiet
  self.hideInfoDetail = function() {
    $("#item-device-info").removeClass("x-btn-show");
  }
  //Show tooltip thong tin xe
  self.showTooltipDetail = function(e, d) {
    e.mousemove(function(event) {
      $("#x-tooltip-info").css("left", event.pageX + 10);
    });
    $("#x-tooltip-info .lat-long").html('<b>Vĩ độ - Kinh độ:</b> ' + d.latitude.toFixed(5) + ' - ' + d.longitude.toFixed(5));
    $("#x-tooltip-info .address").html('<b>Tên đường:</b> ' + d.address);
    $("#x-tooltip-info .rinder").html('<b>Tốc độ:</b> ' + d.speed + ' km/h  <b>Hướng:</b> ' + d.heading);
    $("#x-tooltip-info .time-info").html('<b>Thời gian:</b> ' + d.stime);
    $("#x-tooltip-info").addClass("x-btn-show");
  }
  //Hide tooltip thong tin xe
  self.hideTooltipDetail = function() {
    $("#x-tooltip-info").removeClass("x-btn-show");
  }
  // Set icon xe tren map
  self.setMakerOnMap = function(d) {
    var latlng = new VGMap.VGLatLng(d.latitude, d.longitude);
    self.marker.setLatLng(latlng);
    self.marker.setAttributes(d);
    self.marker.setStyle(self.styleChangeFunc(d));
    self.marker.setBearing(d.heading);
    // self.mapCore.setCenter(latlng, self.zoom);
    if (self.mapCore.getBounds().pad(-0.1).contains(latlng) === false) {
      self.mapCore.panTo(latlng);
    }
  }

  //Style mau toc do
  self.styleColorFunc = function(d) {
    var isOverSpeed = d.is_over_speed;
    var speed = parseFloat(d.speed);
    var color = "cl-green";
    if (isOverSpeed == true) {
      color = "cl-carpurple";
    } else {
      if (speed > 0) {
        color = "cl-green";
      } else {
        color = "cl-yellow";
      }
    }
    return color;
  }
  // Style maker
  self.styleFunc = function(e) {
    var attributes = e.attributes;
    var speed = parseFloat(attributes.speed);
    var isOverSpeed = attributes.is_over_speed;
    if (isOverSpeed == true) {
      return new VGMap.VGPointStyle({
        imageUrl: 'bando/images/car/12/carpurple_12x12.png',
        size: [12, 12],
      });
    } else {
      if (speed > 0) {
        return new VGMap.VGPointStyle({
          imageUrl: 'bando/images/car/12/cargreen_12x12.png',
          size: [12, 12],
        });
      } else {
        return new VGMap.VGPointStyle({
          imageUrl: 'bando/images/car/12/caryellow_12x12.png',
          size: [12, 12],
        });
      }
    }
  }
  // Toa moi maker thu vien
  self.createMaker = function(d) {
    self.marker = new VGMap.VGFeature({
      bearing: 0, // độ nghiêng của feature
      geometry: new VGMap.VGPoint(new VGMap.VGLatLng(d.latitude, d.longitude)), // geometry dạng Point
      style: self.styleFunc,
      attributes: d
    }).addTo(self.mapCore);
    return self.marker;
  }
  //Update style khi set lai toa do Lat, Lng
  self.styleChangeFunc = function(d) {
    var speed = parseFloat(d.speed);
    var isOverSpeed = d.is_over_speed;
    if (isOverSpeed == true) {
      return new VGMap.VGPointStyle({
        imageUrl: 'bando/images/car/12/carpurple_12x12.png',
        size: [12, 12],
      });
    } else {
      if (speed > 0) {
        return new VGMap.VGPointStyle({
          imageUrl: 'bando/images/car/12/cargreen_12x12.png',
          size: [12, 12],
        });
      } else {
        return new VGMap.VGPointStyle({
          imageUrl: 'bando/images/car/12/caryellow_12x12.png',
          size: [12, 12],
        });
      }
    }
  }
  // Tao duong line tren ban do
  self.createLineByLatLong = function(latlngs) {
    new VGMap.VGFeature({
      geometry: new VGMap.VGPolyline(latlngs, {
        showArrows: true,
        vertexFn: function(latLng) {
          var isOverSpeed = latLng.metadata.is_over_speed;
          var speed = parseFloat(latLng.metadata.speed);
          var i = 0;
          if (isOverSpeed == true) {
            i = 2;
          } else {
            if (speed > 0) {
              i = 1;
            } else {
              i = 0;
            }
          }
          return i;
        },
        vertexThresholdsColors: [{
          color: '#e0da63'
        }, {
          color: '#32CD32'
        }, {
          color: '#a932cd'
        }, ]
      })
    }).addTo(self.mapCore);
  }
  //Insert du lieu thong tin xe
  self.initInfo = function(dataInfo) {
    if (dataInfo) {
      self.infos = JSON.parse(dataInfo);
    } else {
      console.log("khong co thong tin xe");
      return false;
    }
    $("#device-company .deviceLGroup-Info .deviceLGroup-Administrator").text(self.infos.departmentName);
    $("#device-company .deviceLGroup-Info .deviceLGroup-Provider").text(self.infos.providerName);
    $("#device-company .deviceLGroup-Info .deviceLGroup-Business").text(self.infos.companyName);
    $("#device-company .deviceLGroup-Info .deviceLGroup-Phone").text(self.infos.phone);
    $("#device-company .deviceLGroup-CarNumber .CarNumber").text(self.infos.vehicle);
    $("#device-company .deviceLGroup-Type .deviceType").text("Loại xe: " + self.infos.vehicleTypeString);
  }

  // Insert du lieu danh sach lich su xe
  self.insertData = function(dataStored) {
    self.latlngs = [];
    self.mapCore.clearFeatures();
    if (dataStored) {
      self.datas = JSON.parse(dataStored);
    } else {
      self.datas = [];
      console.log("khong co data");
      return false;
    }
    var html = "";
    $.each(self.datas, function(idx, d) {
      // Khoi tao data
      var randomColor = self.styleColorFunc(d);
      var stime = moment(d.stime, "YYYY-MM-DD HH:mm:ss").format("HH:mm:ss");
      html += '<tr class="x-row-tr" tab="' + idx + '">' +
        '<td class="x-gred-td x-td-col1">' +
        '<div class="x-grid-cell-inner">' + d.address + '</div>' +
        '</td>' +
        '<td class="x-gred-td x-td-col2">' +
        '<div class="x-grid-cell-inner">' +
        '<span class="' + randomColor + '">' + d.speed + ' km/h</span>' +
        '</div>' +
        '</td>' +
        '<td class="x-gred-td x-td-col3">' +
        '<div class="x-grid-cell-inner">' + stime + '</div>' +
        '</td>' +
        '</tr>';
      // Them toa do vao array
      var latlng = new VGMap.VGLatLng(d.latitude, d.longitude);
      latlng.metadata = d;
      self.latlngs.push(latlng);
      if (idx === 0) {
        self.createMaker(d);
      }
    });
    self.tBodyTable.html("");
    self.tBodyTable.append(html);
    // load thu vien scroller
    self.initNanoScroller();
    // ve duong line cua xe chay
    self.createLineByLatLong(self.latlngs);
    self.mapCore.fitBounds(self.latlngs, 0);
    self.mapCore.setCenter(new VGMap.VGLatLng(self.datas[0].latitude, self.datas[0].longitude));
  }
}
