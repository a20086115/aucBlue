const app = getApp()
Page({
  data: {
    name: '',
    connectedDeviceId: '',
    services: {},
    characteristics: {},
    connected: true,
    backgroundStyle: "background-color: #e71f1f;",
    UUID_SERVICE: "0000FFF0-0000-1000-8000-00805F9B34FB",
    UUID_WRITE: "0000FFF6-0000-1000-8000-00805F9B34FB", // 1
    UUID_NOTIFICATION: "0000FFF4-0000-1000-8000-00805F9B34FB", // 0
    UUID_CONFIRM: "0000FFF3-0000-1000-8000-00805F9B34FB", //2
    UUID_NOTIFICATION_DES2: "00002902-0000-1000-8000-00805f9b34fb",
    show: false,
    modules: [{
      url:"/pages/fieldapplication/fieldapplication",
        name:"现场应用",
        icon:"../../../images/fieldapplication.png"
    }, {
        url: "/pages/measureValue/measureValue",
        name: "测量值",
        icon: "../../../images/measuredvalue.png"
    }, {
        url: "/pages/deviceInfo/deviceInfo",
        name: "设备信息",
        icon: "../../../images/deviceinformation.png"
    }, {
        url: "/pages/eventInfo/eventInfo",
        name: "事件",
        icon: "../../../images/event.png"
    }, {
        url: "/pages/controlParams/controlParams",
        name: "控制参数",
        icon: "../../../images/controlparameter.png"
    }]
  },
  onLoad(){
    this.setColor("1")
  },
  setColor(val) {
    if(val == "0"){
      this.setData({
        backgroundStyle: "background-color:#E3CF57" // 深林绿
      })
    }else if(val == "1"){
      this.setData({
        backgroundStyle: "background-color:#E3CF57" // 香蕉黄
      })
    } else if (val == "2") {
      this.setData({
        backgroundStyle: "background-color:red"
      })
    }
  },
  showPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  openTap(){
    this.onClose();
    app.write(["00", "06", "00", "d5", "00", "01"], function (receiveData) {
      console.log("openTap", receiveData)
    });
  },
  closeTap(){
    this.onClose();
    app.write(["00", "03", "00", "51", "00", "21"], function(receiveData) {
      console.log("closeTap", receiveData)
    });
  },
  resetTap(){
    this.onClose();
    app.write(["00", "03", "02", "f1", "00", "01"], function (receiveData) {
      console.log("resetTap", receiveData)
    });
  },
  setFrameLen(){
    this.onClose();
    app.write(["00", "06", "00", "19", "00", "01"], function (receiveData) {
      console.log("setFrameLen", receiveData)
    });
  },
  Send: function () {
    var that = this
    if (that.data.connected) {
      var hex = 'AA'
      var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
        // console.log(parseInt(h, 16))
        return parseInt(h, 16)
      }))
      var buffer = typedArray.buffer
      console.log(buffer)
      wx.writeBLECharacteristicValue({
        deviceId: that.data.connectedDeviceId,
        serviceId: that.data.UUID_SERVICE, //services[1].uuid,
        characteristicId: that.data.UUID_CONFIRM, //characteristics[1].uuid,
        value: buffer,
        success: function (res) {
          console.log('发送成功')
          console.log(res)
        },
        fail: function(res){
          console.log('发送失败')
          console.log(res)
        },
        complete: function(res){
          console.log("发送完成")
          console.log(res)
        }
      })
    }else {
      wx.showModal({
        title: '提示',
        content: '蓝牙已断开',
        showCancel: false,
        success: function (res) {
          that.setData({
            searching: false
          })
        }
      })
    }
  },
  onUnload(){
    console.log("unload")
    app.clearBle();
  },
  sendData: function (hex){
    var that = this;
    var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
      // console.log(parseInt(h, 16))
      return parseInt(h, 16)
    }))
    var buffer = typedArray.buffer

    console.log(buffer)
    wx.writeBLECharacteristicValue({
      deviceId: that.data.connectedDeviceId,
      serviceId: that.data.UUID_SERVICE, //services[1].uuid,
      characteristicId: that.data.UUID_WRITE, //characteristics[1].uuid,
      value: buffer,
      success: function (res) {
        console.log('发送成功')
        console.log(res)
      },
      fail: function (res) {
        console.log('发送失败')
        console.log(res)
      },
      complete: function (res) {
        console.log("发送完成")
        console.log(res)
      }
    })
  }
})