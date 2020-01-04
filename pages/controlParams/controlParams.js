import Toast from "../../miniprogram_npm/vant-weapp/toast/toast";

const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    reference_params: app.convertAddress(["375", "376", "377", "378", "379"]),

    control_params: app.convertAddress(["499", "500", "501", "502", "503", "504", "505", "506", "507", "508", "509", "510", "511", "512", "513", "514", "515", "516", "517", "518", "519"]),

    protect_params: app.convertAddress(["728", "729", "730", "731", "732", "733", "734", "735", "736", "737", "739", "740", "741", "742", "743", "744", "745", "746", "747", "748"]),

    capallocation_params: app.convertAddress(["603", "604", "605", "606", "607", "608", "609", "610", "611", "612", "613", "614"]),

    record_params: app.convertAddress(["116", "117", "119"]),

    currentItem: {},
    show: false,
    spinnerShow: false,
    inputValue: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '控制参数'
    })

    //初次进入页面读取首页数据
    // 获取参考值
    this.getCkz();
    console.log(this.data)
  },

  // 输入框点击事件
  onInputClick(event) {
    console.log(event)
    this.setData({
      currentItem: event.detail.item,
      show: true
    })
  },
  // 
  // 输入框点击事件
  onActionClick(event) {
    console.log(event)
    this.setData({
      currentItem: event.detail.item,
      spinnerShow: true
    })
  },
  onChange(event) {
    console.log("切换到标签", event.detail.name)

    console.log(event.detail.name)
    if (event.detail.name == "0") {
      // 获取参考值
      this.getCkz();
    } else if (event.detail.name == "1") {
      //获取控制参数
      this.getKzcs();
    } else if (event.detail.name == "2") {
      // 获取保护参数
      this.getBhcs();
    } else if (event.detail.name == "3") {
      // 获取容量分配参数
      this.getRlfp();
    } else if (event.detail.name == "4") {
      // 获取调试数据

    } else if (event.detail.name == "5") {
      // 获取录波数据
      this.getLbsj();
    }else {
      
    }
  },

  onConfirm() {
    console.log("onConfirm", this.data.inputValue, this.data)
    // 判断value是否为空
    var value = this.data.inputValue;

    if (value === "") {
      this.setData({ show: false, inputValue: "" })
      Toast.fail("输入数据为空")
      return;
    }
    // 判断value是否在范围内

    if (value > parseInt(this.data.currentItem.max) || value < parseInt(this.data.currentItem.min)) {
      this.setData({ show: false, inputValue: "" })
      Toast.fail('输入数据应在' + this.data.currentItem.min + " 到 " + this.data.currentItem.max + "之间")
      return;
    }

    // 写报文
    var addressByteArr = app.getAddressFrame(this.data.currentItem.address)
    var valueByteArr = app.getAddressFrame(value * this.data.currentItem.bs)

    var sendData = ["00", "06"].concat(addressByteArr, valueByteArr);
    app.write(sendData, (obj, frame) => {
      console.log("---------")
      console.log(obj, frame)
      this.setData({
        reference_params: Object.assign(this.data.reference_params, obj.data),
        show: false,
        inputValue: ""
      })
      Toast.fail("设置成功")
      console.log(this.data)
    });
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  onClose(e) {
    if (e.detail == "cancel" || e.detail == "overlay") {
      this.setData({ show: false, inputValue: "" })
    }
  },
  onActionClose() {
    this.setData({ spinnerShow: false });
  },
  onActionSelect(event) {
    //写报文
    var addressByteArr = app.getAddressFrame(this.data.currentItem.address)
    var valueByteArr = app.getAddressFrame(event.detail.value)
    var sendData = ["00", "06"].concat(addressByteArr, valueByteArr);
    app.write(sendData, (obj, frame) => {
      console.log("---------")
      console.log(obj, frame)
      this.setData({
        spinnerShow: false,
      })
      Toast.fail("设置成功")
      console.log(this.data)
    });
  },
  // 获取参考值
  getCkz() {
    var sendData = ["00", "03", "01", "77", "00", "05"];
    app.write(sendData, (obj, frame) => {
      console.log("----获取参考值-----")
      console.log(obj, frame)
      this.setData({
        reference_params: app.copyObject(this.data.reference_params, obj.data)
      })
      console.log(this.data)
    });
  },
  // 获取控制参数
  getKzcs() {
    var sendData = ["00", "03", "01", "f3", "00", "75"];
    app.write(sendData, (obj, frame) => {
      console.log("----获取控制参数-----")
      console.log(obj, frame)
      this.setData({
        control_params: app.copyObject(this.data.control_params, obj.data)
      })
      console.log(this.data)
    });
  },
  // 获取保护参数
  getBhcs() {
    var sendData = ["00", "03", "02", "D8", "00", "17"];
    app.write(sendData, (obj, frame) => {
      console.log("----获取保护参数-----")
      console.log(obj, frame)
      this.setData({
        protect_params: app.copyObject(this.data.protect_params, obj.data)
      })
      console.log(this.data)
    });
  },
  // 获取容量分配数据
  getRlfp() {
    var sendData = ["00", "03", "02", "5b", "00", "0d"];
    app.write(sendData, (obj, frame) => {
      console.log("----获取容量分配参数-----")
      console.log(obj, frame)
      this.setData({
        capallocation_params: app.copyObject(this.data.capallocation_params, obj.data)
      })
      console.log(this.data)
    });
  },
  // 获取录波数据
  getLbsj() {
    var sendData = ["00", "03", "00", "74", "00", "04"];
    app.write(sendData, (obj, frame) => {
      console.log("获取录波信息成功", obj, frame)
      this.setData({
        record_debug: app.copyObject(this.data.record_debug, obj.data)
      })
      console.log(this.data)
    });
  },
  //按钮回调函数
  //还原参数
  hycs: function () {
    //写报文
    var sendData = ["00", "06", "03", "02", "00", "01"];
    app.write(sendData, (obj, frame) => {
      console.log("---------")
      console.log(obj, frame)
      this.setData({
        spinnerShow: false,
      })
      Toast.fail("设置成功")
      console.log(this.data)
    });
  },
  //cpu复位
  cpufw: function () {
    //写报文
    var sendData = ["00", "06", "02", "FE", "00", "01"];
    app.write(sendData, (obj, frame) => {
      console.log("---------")
      console.log(obj, frame)
      this.setData({
        spinnerShow: false,
      })
      Toast.fail("设置成功")
      console.log(this.data)
    });
  },
  //历史事件擦除
  lssjcc: function () {
    //写报文
    var sendData = ["00", "06", "00", "7B", "00", "01"];
    app.write(sendData, (obj, frame) => {
      console.log("---------")
      console.log(obj, frame)
      this.setData({
        spinnerShow: false,
      })
      Toast.fail("设置成功")
      console.log(this.data)
    });
  },
  //手动录波
  record_man: function () {
    //写报文
    var sendData = ["00", "06", "00", "73", "00", "01"];
    app.write(sendData, (obj, frame) => {
      console.log("---------")
      console.log(obj, frame)
      this.setData({
        spinnerShow: false,
      })
      Toast.fail("设置成功")
      console.log(this.data)
    });
  },
  //数据导出
  dataexport: function () {
    //写报文
    var sendData = ["00", "06", "00", "76", "00", "01"];
    app.write(sendData, (obj, frame) => {
      console.log("---------")
      console.log(obj, frame)
      this.setData({
        spinnerShow: false,
      })
      Toast.fail("设置成功")
      console.log(this.data)
    });
  },




})