// pages/eventInfo/eventINfo.js
var bitArray = [
  0b0000000000000001, 0b0000000000000010, 0b0000000000000100, 0b0000000000001000,
  0b0000000000010000, 0b0000000000100000, 0b0000000001000000, 0b0000000010000000,
  0b0000000100000000, 0b0000001000000000, 0b0000010000000000, 0b0000100000000000,
  0b0001000000000000, 0b0010000000000000, 0b0100000000000000, 0b1000000000000000
];
var error1 = [
  "A相电网电压缺相", "B相电网电压缺相", "C相电网电压缺相", "设备关机",
  "A相电网电压过压", "B相电网电压过压", "C相电网电压过压", "电网电压过压",
  "A相电网电压欠压", "B相电网电压欠压", "C相电网电压欠压", "电网电压欠压",
  "电网频率越上限", "电网频率越下限", "", "散热器过温"
];
var error2 = [
  "电感过温", "腔体过温", "", "", "",
  "电容过温", "", "",
  "5V电源电压异常", "15V电源电压异常", "24V电源电压异常", "电源供电异常",
  "ADC采样异常", "Flash存储异常"
];

var error3 = [
  "逆变过流(硬件)", "B相逆变过流(硬件)", "C相逆变过流(硬件)", "A2相逆变过流(硬件)",
  "B2相逆变过流(硬件)", "C2相逆变过流(硬件)", "A1相IGBT故障(硬件)", "B1相IGBT故障(硬件)",
  "C1相IGBT故障(硬件)", "A相逆变过流采样异常", "B相逆变过流采样异常)", "C相逆变过流采样异常",
  "Udc+直流过压(硬件)", "A相逆变过流采样异常", "B相逆变过流采样异常)", "C相逆变过流采样异常"
];

var error4 = [
  "A相逆变过流", "B相逆变过流", "C相逆变过流", "N线逆变过流（瞬时值）",
  "直流正电压过压", "直流负电压过压", "直流正电压欠压", "直流负电压欠压", "A相继电器闭合异常",
  "B相继电器闭合异常", "C相继电器闭合异常", "A相继电器断开异常", "B相继电器断开异常", "C相继电器断开异常",
  "N线逆变电流过流（有效值）"
];

var error5 = [
  "A1相逆变过流(软件)", "B1相逆变过流(软件)", "C1相逆变过流(软件)", "A2相逆变过流(软件)",
  "B2相逆变过流(软件)", "C2相逆变过流(软件)", "N线过流(瞬时值)", "N线过流(有效值)",
  "Udc+直流过压(软件)", "Udc-直流过压(软件)", "Udc+直流欠压(软件)", "Udc-直流欠压(软件)",
  "A相继电器闭合异常", "B相继电器闭合异常", "C相继电器闭合异常", "A相继电器断开异常"
];

var error6 = ["B相继电器断开异常", "C相继电器断开异常", "电网电压相序异常"];

var error7 = [
  "设备待机", "设备运行", "内部风扇1#异常", "内部风扇2#异常",
  "内部风扇3#异常", "内部风扇4#异常", "内部风扇5#异常", "内部风扇6#异常",
  "内部风扇7#异常", "内部风扇8#异常", "内部风扇9#异常", "主CT接线异常",
  "并机通信异常(CAN)", "CPU复位", "Flash参数擦除", "主从机参数不一致"
];

var error8 = [
  "当前设备获取主机权限", "临时切换主机权限", "SDRAM异常", "互锁停机",
  "A相电网电压骤降", "B相电网电压骤降", "C相电网电压骤降", "单CT并机参数设置异常", "电网电压相序异常",
  "自动重启停机", "母线预充电欠压"
];

//除AUC10之外设备使用的故障码，与error1、2、3、4、8对应
var error9 = [
  "A相电网电压缺相", "B相电网电压缺相", "C相电网电压缺相", "设备关机",
  "A相电网电压过压", "B相电网电压过压", "C相电网电压过压", "电网电压过压",
  "A相电网电压欠压", "B相电网电压欠压", "C相电网电压欠压", "电网电压欠压",
  "电网频率越上限", "电网频率越下限", "电网电压相序异常", "A1相IGBT过温"
];
var error10 = [
  "B1相IGBT过温", "C1相IGBT过温", "A2相IGBT过温", "B2相IGBT过温",
  "C2相IGBT过温", "下腔温度过温", "EMI温度过温", "备用温度过温",
  "5V电源电压异常", "15V电源电压异常", "24V电源电压异常", "电源供电异常",
  "ADC采样异常", "Flash存储异常"
];

var error11 = [
  "A1相逆变过流(硬件)", "B1相逆变过流(硬件)", "C1相逆变过流(硬件)", "A2相逆变过流(硬件)",
  "B2相逆变过流(硬件)", "C2相逆变过流(硬件)", "A1相IGBT故障(硬件)", "B1相IGBT故障(硬件)",
  "C1相IGBT故障(硬件)", "A2相IGBT故障(硬件)", "B2相IGBT故障(硬件)", "C2相IGBT故障(硬件)",
  "Udc+直流过压(硬件)", "Udc-直流过压(硬件)", "均压电路IGBT故障(硬件)", "人为制造的软件故障(硬件)"
];

var error12 = [
  "A相有源阻尼过压(硬件)", "B相有源阻尼过压(硬件)", "C相有源阻尼过压(硬件)", "",
  "", "", "", "",
  "", "", "", "",
  "", "", ""
];

var error13 = [
  "当前设备获取主机权限", "临时切换主机权限", "", "", "", "",
  "", "", "", "", ""
];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listDataMap: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '事件信息'
    })
    this.getDqsj();
  },
  // 读取当前事件相关数据
  getDqsj() {
    var sendData = ["00", "03", "00", "01", "00", "08"];
    var frame = ["00", "03", "10", "00", "08", "00", "00", "ff", "ff", "ff", "ff", "00", "00", "00", "00", "00", "00", "00", "00", "c5", "a6"];
    var resultList = this.parseFrame(frame);
    var listMap = [];
    var i = 0;
    var cpu1 = resultList[i++];
    for (var index = 0; index < bitArray.length && index < error1.length; index++) {
      if ((cpu1 & bitArray[index]) == bitArray[index]) {
        if (0) {
          listMap.push(error1[index]);
        } else {
          listMap.push(error9[index]);
        }
      }
    }

    let cpu2 = resultList[i++];
    for (let index = 0; index < bitArray.length && index < error2.length; index++) {
      if ((cpu2 & bitArray[index]) == bitArray[index]) {
        if (0) { // 判断
          listMap.push(error2[index]);
        } else {
          listMap.push(error10[index]);
        } 
      }
    }

    let cpu3 = resultList[i++];
    for (let index = 0; index < bitArray.length && index < error3.length; index++) {
      if ((cpu3 & bitArray[index]) == bitArray[index]) {
        if (true) { //todo  判断是否
          listMap.push(error3[index]);
        } else {
          listMap.push(error11[index]);
        }
      }
    }

    let cpu4 = resultList[i++];
    for (let index = 0; index < bitArray.length && index < error4.length; index++) {
      if ((cpu4 & bitArray[index]) == bitArray[index]) {
        if (0) {
          listMap.push(error4[index]);
        } else {
          listMap.push(error12[index]);
        }
      }
    }

    let cpu5 = resultList[i++];
    for (let index = 0; index < bitArray.length && index < error5.length; index++) {
      if ((cpu5 & bitArray[index]) == bitArray[index]) {
        listMap.push(error5[index]);
      }
    }

    let cpu6 = resultList[i++];
    for (let index = 0; index < bitArray.length && index < error6.length; index++) {
      if ((cpu6 & bitArray[index]) == bitArray[index]) {
        listMap.push(error6[index]);
      }
    }

    let cpu7 = resultList[i++];
    for (let index = 0; index < bitArray.length && index < error7.length; index++) {
      if ((cpu7 & bitArray[index]) == bitArray[index]) {
        listMap.push(error7[index]);
      }
    }

    let cpu8 = resultList[i++];
    for (let index = 0; index < bitArray.length && index < error8.length; index++) {
      if ((cpu8 & bitArray[index]) == bitArray[index]) {
        if (0) {
          listMap.push(error8[index]);
        } else {
          listMap.push(error13[index]);
        }
      }
    }
    console.log(listMap)
    this.setData({
      listDataMap: listMap
    })
    // app.write(sendData, (obj, frame) => {
    //   console.log("----读取当前事件相关数据-----")
    //   var cpu1 = frame[]];


    //   console.log(obj, frame)
    //   this.setData({
    //     basic_params: app.copyObject(this.data.basic_params, obj.data)
    //   })
    // });
  },
  parseFrame(allFrame) {
    console.log(allFrame)
    var array = [];
    var len = parseInt(allFrame[2], 16);
    // 应返回的数据项长度 不等于allFrame实际长度（存在丢帧的问题）
    if (len != allFrame.length - 5) {} else {
      // 挨个解析
      var pos = 3;
      for (var i = 0; i < len / 2; i++) {
        var value1 = parseInt(allFrame[pos + 2 * i], 16);
        var value2 = parseInt(allFrame[pos + 2 * i + 1], 16);
        var value = (value1 << 8) + value2;
        array.push(value)
      }
      return array
    }

  }
})