//app.js
App({
  buf2hex: function (buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('')
  },
  buf2string: function (buffer) {
    var arr = Array.prototype.map.call(new Uint8Array(buffer), x => x)
    var str = ''
    for (var i = 0; i < arr.length; i++) {
      str += String.fromCharCode(arr[i])
    }
    return str
  },
  onLaunch: function () {
    this.globalData.SystemInfo = wx.getSystemInfoSync()
    console.log(this.globalData.SystemInfo)
  },
  globalData: {
    SystemInfo: {},
    status: false, // 连接状态    
    name: '',
    connectedDeviceId: '',
    UUID_SERVICE: "0000FFF0-0000-1000-8000-00805F9B34FB",
    UUID_WRITE: "0000FFF6-0000-1000-8000-00805F9B34FB", // 1
    UUID_NOTIFICATION: "0000FFF4-0000-1000-8000-00805F9B34FB", // 0
    UUID_CONFIRM: "0000FFF3-0000-1000-8000-00805F9B34FB", //2
    UUID_NOTIFICATION_DES2: "00002902-0000-1000-8000-00805f9b34fb"
  },
  sendData: function (hex, cb){
    var that = this
    if (that.globalData.status) {
      var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
        // console.log(parseInt(h, 16))
        return parseInt(h, 16)
      }))
      var buffer = typedArray.buffer
      console.log(buffer)
      wx.writeBLECharacteristicValue({
        deviceId: that.globalData.connectedDeviceId,
        serviceId: that.globalData.UUID_SERVICE, //services[1].uuid,
        characteristicId: that.globalData.UUID_CONFIRM, //characteristics[1].uuid,
        value: buffer,
        success: function (res) {
          console.log('发送成功')
          console.log(res)
          cb(res)
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
  initBle(){
    var that = this;
    wx.getBLEDeviceServices({
      deviceId: that.globalData.connectedDeviceId,
      success: function (res) {
        console.log(res.services)
        wx.getBLEDeviceCharacteristics({
          deviceId: that.globalData.connectedDeviceId,
          serviceId: that.globalData.UUID_SERVICE, //res.services[1].uuid,
          success: function (res) {
            console.log(res.characteristics)
            wx.notifyBLECharacteristicValueChange({
              state: true,
              deviceId: that.globalData.connectedDeviceId,
              serviceId: that.globalData.UUID_SERVICE, //that.data.services[1].uuid,
              characteristicId: that.globalData.UUID_NOTIFICATION, //characteristics[1].uuid,
              success: function (res) {
                console.log('启用notify成功')
                startAuth(); // 开始蓝牙连接认证
                // that.Send();
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
      str = "收到数据:" + str;
      console.log(str)
      that.setData({
        receiveText: that.data.receiveText + str
      })
      that.sendData("ff 43 42 44 49 47 42 45 48 45 43 43 47 48 43 44 48")

    })
  },
  getBlueService: function(){
    wx.notifyBLECharacteristicValueChange({
      state: true,
      deviceId: that.data.connectedDeviceId,
      serviceId: that.data.UUID_SERVICE, //that.data.services[1].uuid,
      characteristicId: that.data.UUID_NOTIFICATION, //characteristics[1].uuid,
      success: function (res) {
        console.log('启用notify成功')
        that.Send();
      }
    })
  },

})