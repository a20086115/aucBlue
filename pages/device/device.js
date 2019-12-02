const app = getApp()
Page({
  data: {
    name: '',
    connectedDeviceId: '',
    services: {},
    characteristics: {},
    connected: true,
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
        url: "/pages/dashboard/index",
        name: "测量值",
        icon: "../../../images/measuredvalue.png"
    }, {
        url: "/pages/dashboard/index",
        name: "设备信息",
        icon: "../../../images/deviceinformation.png"
    }, {
        url: "/pages/dashboard/index",
        name: "事件",
        icon: "../../../images/event.png"
    }, {
        url: "/pages/dashboard/index",
        name: "控制参数",
        icon: "../../../images/controlparameter.png"
    }]
  },
  showPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  openTap(){
    this.onClose();
    app.write(["00", "06", "00", "d5", "00", "01"], function () {
      console.log("!11")
    }, true);
  },
  closeTap(){

    this.onClose();
    app.write(["00", "03", "00", "41", "00", "12"], function(){
      
    });
  },
  resetTap(){
    this.onClose();
    app.write(["00", "03", "02", "f1", "00", "01"], function(){
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