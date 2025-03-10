import {find } from "lodash"

const keysRainSynop: any = {
  "Mã khu vực mỏ": "locationCode",
  "Tên khu vực mỏ": "locationName",
  "Quận/Huyện, Tỉnh": "name",
  "Biểu tượng": "icon",
  "Hướng gió": "windDirection",
  "Khu vực": "region",
  "Lat": "lat",
  "Lon": "lng",
  "Mã Trạm": "code",
  "Nhiệt độ\r\n(độ C)": "temperature",
  "Tỉnh": "province",
  "Trạm": "district",
  "Tốc độ gió (m/s)": "speed",
  "Độ ẩm (%)": "humidity",
  "Lượng mưa 6h qua (mm)": "rainfall"
}

export const convertExcelRainSynop = (data: any[]) => {
  let values = find(data, { name: "RAIN SYNOP" })
  if (!values) {
    return []
  }
  return convertExcelData(values.data, keysRainSynop)
}

export const convertExcelData = (data: any[], keys: any) => {
  let rs: any[] = []
  data.map((o: any) => {
    let item: any = {}
    Object.keys(keys).map((key: string) => {
      if (o[key] != undefined) {
        item[keys[key]] = o[key]
      }
    })
    rs.push(item)
  })
  return rs
}

export const saveBook = (s: any) => {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xff;
  }
  return buf;
}


export const convertSecondsToHoursMinutes = (secondsStr: string) => {
  const totalSeconds = parseInt(secondsStr.replace('s', ''), 10);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h${minutes}p`;
}
