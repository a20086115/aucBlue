//app.js
var bletools = require('./utils/bletools.js');
var constants = require('./utils/constants.js');
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
    // 第一步 initBle() 初始化蓝牙模块,判断版本是否支持
    bletools.initBle(this);
  },
  searchBle(cb){

  },
  globalData: {
    SystemInfo: {},
    status: true, // 连接状态    
    name: '',
    connectedDeviceId: '',
    UUID_SERVICE: "0000FFF0-0000-1000-8000-00805F9B34FB",
    UUID_WRITE: "0000FFF6-0000-1000-8000-00805F9B34FB", // 1
    UUID_NOTIFICATION: "0000FFF4-0000-1000-8000-00805F9B34FB", // 0
    UUID_CONFIRM: "0000FFF3-0000-1000-8000-00805F9B34FB", //2
    UUID_NOTIFICATION_DES2: "00002902-0000-1000-8000-00805f9b34fb",
    taskList:[],
    cbMap:{}
  },
  // 添加任务到队列中
  addTask(task){
    this.globalData.taskList.push(task);
  },
  sendData1(){
    bletools.write();
  },
  notifyListener(){

  },
  sendData: function (hex, cb) {
    var that = this
    console.log("发送数据" + hex)
    if (!this.globalData.cbMap[hex]){
      this.globalData.cbMap[hex] = cb;
    }
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
          
        }
      })
    }
  },
  // 从列表中选择蓝牙后开始进行连接。
  initBle(){
    var that = this;
    //获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备。
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
                that.startAuth(); // 开始蓝牙连接认证
                // that.Send();
              }
            })
          }
        })
      },
      fail: function(){
        console.log('获取服务失败')
      }
    })
    wx.onBLEConnectionStateChange(function (res) {
      console.log("onBLEConnectionStateChange" + res.connected)
      console.log(res)
      // that.setData({
      //   connected: res.connected
      // })
    })
    wx.onBLECharacteristicValueChange(function (characteristic) {
      console.log("接收到特征值变化", characteristic)
      var receiveText = that.buf2string(characteristic.value)
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
      that.sendData("ff 43 42 44 49 47 42 45 48 45 43 43 47 48 43 44 48")

    })
  },
  // 蓝牙认证， 发送aa后 发送ff 43...
  startAuth(){
    console.log(" 蓝牙认证， 发送aa后 发送ff 43")
    var that = this;
    that.sendData("aa", function(){
      that.sendData("ff,43,42,44,49,47,42,45,48,45,43,43,47,48,43,44,48")
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