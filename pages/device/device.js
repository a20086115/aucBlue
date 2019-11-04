const app = getApp()
Page({
  data: {
    inputText: 'Hello World!',
    receiveText: '',
    name: '',
    connectedDeviceId: '',
    services: {},
    characteristics: {},
    connected: true,
    UUID_SERVICE: "0000FFF0-0000-1000-8000-00805F9B34FB",
    UUID_WRITE: "0000FFF6-0000-1000-8000-00805F9B34FB", // 1
    UUID_NOTIFICATION: "0000FFF4-0000-1000-8000-00805F9B34FB", // 0
    UUID_CONFIRM: "0000FFF3-0000-1000-8000-00805F9B34FB", //2
    UUID_NOTIFICATION_DES2: "00002902-0000-1000-8000-00805f9b34fb"
  },
  bindInput: function (e) {
    this.setData({
      inputText: e.detail.value
    })
    console.log(e.detail.value)
  },
  Send: function () {
    var that = this
    if (that.data.connected) {
      // var buffer = new ArrayBuffer(that.data.inputText.length)
      // var dataView = new Uint8Array(buffer)
      // for (var i = 0; i < that.data.inputText.length; i++) {
      //   dataView[i] = that.data.inputText.charCodeAt(i)
      // }
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
    }
    else {
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
  onLoad: function (options) {
    var that = this
    console.log(options)
    that.setData({
      name: options.name,
      connectedDeviceId: options.connectedDeviceId
    })
    wx.getBLEDeviceServices({
      deviceId: that.data.connectedDeviceId,
      success: function (res) {
        console.log(res.services)
        that.setData({
          services: res.services
        })
        wx.getBLEDeviceCharacteristics({
          deviceId: options.connectedDeviceId,
          serviceId: that.data.UUID_SERVICE, //res.services[1].uuid,
          success: function (res) {
            console.log(res.characteristics)
            that.setData({
              characteristics: res.characteristics
            })
            wx.notifyBLECharacteristicValueChange({
              state: true,
              deviceId: options.connectedDeviceId,
              serviceId: that.data.UUID_SERVICE, //that.data.services[1].uuid,
              characteristicId: that.data.UUID_NOTIFICATION, //characteristics[1].uuid,
              success: function (res) {
                console.log('启用notify成功')
                that.Send();
              }
            })
          }
        })
      }
    })
    wx.onBLEConnectionStateChange(function (res) {
      console.log(res)
      // that.setData({
      //   connected: res.connected
      // })
    })
    wx.onBLECharacteristicValueChange(function (characteristic) {
      console.log("接收到特征值变化", characteristic)
      var receiveText = app.buf2string(characteristic.value)
      console.log('接收到数据：' + receiveText)
    

      //解析蓝牙返回数据
      let buffer = characteristic.value
      let dataView = new DataView(buffer)
      console.log("接收字节长度:" + dataView.byteLength)
      var str = ""
      for (var i = 0; i < dataView.byteLength; i++) {
        // str += String.fromCharCode(dataView.getUint8(i))
        str += dataView.getUint8(i).toString(16) + ','
        // console.log(dataView.getUint8(i))
        // console.log(str)
      }
      console.log(parseInt(str, 16))
      str =  "收到数据:" + str;
      console.log(str)
      that.setData({
        receiveText: that.data.receiveText + str
      })
      that.sendData("ff 43 42 44 49 47 42 45 48 45 43 43 47 48 43 44 48")

    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

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