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