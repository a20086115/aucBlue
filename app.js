//app.js
var bletools = require('./utils/bletools.js');
var constants = require('./utils/constants.js');
var CRC = require('./utils/crc.js');
var aucConstants = require('./utils/aucConstants.js');
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
    cbMap:{},
    callback:null,
    frameBuffer:[]
  },
  convertAddress(arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i] = aucConstants.addressMap.get(arr[i])
    }
  },
  // 添加任务到队列中
  addTask(task){
    this.globalData.taskList.push(task);
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
      console.log({
        deviceId: that.globalData.connectedDeviceId,
        serviceId: that.globalData.UUID_SERVICE, //services[1].uuid,
        characteristicId: that.globalData.UUID_CONFIRM, //characteristics[1].uuid
      })
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
  // // 从列表中选择蓝牙后开始进行连接。
  // initBle(){
  //   var that = this;
  //   //获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备。
  //   wx.getBLEDeviceServices({
  //     deviceId: that.globalData.connectedDeviceId,
  //     success: function (res) {
  //       console.log(res.services)
  //       wx.getBLEDeviceCharacteristics({
  //         deviceId: that.globalData.connectedDeviceId,
  //         serviceId: that.globalData.UUID_SERVICE, //res.services[1].uuid,
  //         success: function (res) {
  //           console.log(res.characteristics)
  //           wx.notifyBLECharacteristicValueChange({
  //             state: true,
  //             deviceId: that.globalData.connectedDeviceId,
  //             serviceId: that.globalData.UUID_SERVICE, //that.data.services[1].uuid,
  //             characteristicId: that.globalData.UUID_NOTIFICATION, //characteristics[1].uuid,
  //             success: function (res) {
  //               console.log('启用notify成功')
  //               that.startAuth(); // 开始蓝牙连接认证
  //               // that.Send();
  //             }
  //           })
  //         }
  //       })
  //     },
  //     fail: function(){
  //       console.log('获取服务失败')
  //     }
  //   })
  //   wx.onBLEConnectionStateChange(function (res) {
  //     console.log("onBLEConnectionStateChange" + res.connected)
  //     console.log(res)
  //     // that.setData({
  //     //   connected: res.connected
  //     // })
  //   })
  //   wx.onBLECharacteristicValueChange(function (characteristic) {
  //     console.log("接收到特征值变化", characteristic)
  //     var receiveText = that.buf2string(characteristic.value)
  //     console.log('接收到数据：' + receiveText)


  //     //解析蓝牙返回数据
  //     let buffer = characteristic.value
  //     let dataView = new DataView(buffer)
  //     console.log("接收字节长度:" + dataView.byteLength)
  //     var str = ""
  //     for (var i = 0; i < dataView.byteLength; i++) {
  //       // str += String.fromCharCode(dataView.getUint8(i))
  //       str += dataView.getUint8(i).toString(16) + ','
  //       // console.log(dataView.getUint8(i))
  //       // console.log(str)
  //     }
  //     console.log(parseInt(str, 16))
  //     str = "收到数据:" + str;
  //     console.log(str)
  //     that.sendData("ff 43 42 44 49 47 42 45 48 45 43 43 47 48 43 44 48")

  //   })
  // },
  // 蓝牙认证， 发送aa后 发送ff 43...
  startAuth(){
    console.log(" 蓝牙认证， 发送aa后 发送ff 43")
    bletools.write(["aa"]);
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

  /**
    * 在页面退出时 销毁蓝牙适配器
    */
  clearBle: function () {
    bletools.clear();
  },
  // 开始扫描
  startScanBle(cb) {
    bletools.startScanBle(cb);
  },
  // 结束扫描
  stopScanBle(){
    bletools.stopBluetoothDevicesDiscovery()
  },
  // 连接设备
  connectBle(device) {
    bletools.connectBle(device);
  },
  // 蓝牙发送方法
  write(data, cb, f) {
    this.globalData.callback = cb;
    // 添加crc字节
    var crc = CRC.CRC.CRC16(data);
    data.push(crc.substring(0, 2))
    data.push(crc.substring(2, 4))
    data.push("55")
    if(f){
      data.unshift("80")
    }
    // 80 00 03 00 41 00 1c 15 c6 55
    bletools.write(data);
  },
  /**
   * 发送数据结果 true or false
   * 如果为false msg是失败原因
   */
  writeListener: function (result, writeData, msg) {
    //此处可以执行自己的逻辑 比如一些提示
    console.log(result ? '发送数据成功' : msg)
    if(writeData.length > 3 && writeData[3] == "03"){
      wx.showToast({
        title: `设置成功`,
        icon: 'none'
      });
    }
  },

  /**
   * 接收数据 
   */
  notifyListener: function (data) {
    console.log('接收到数据')
    console.log(data)
    var firstData = data[0];
    console.log(firstData)
    if (firstData == "ff") { //蓝牙设备发来的加密串，
      console.log("加密认证中"); 
      bletools.write(["ff", "43", "42", "44", "49", "47", "42", "45", "48", "45", "43", "43", "47", "48", "43", "44", "48"]);
    } else if (firstData== "fe") { //加密认证过程完成
      console.log("加密认证过程完成"); 
    } else {
      this.addFrame(data);
    }
  },
  // 加入一帧
  addFrame(frame) {
    var firstByte = frame[0];
    //如果是一个报文的第一帧，清空当前缓冲区数据
    if (firstByte == "00") {
      this.globalData.frameBuffer = [];
    }
    this.globalData.frameBuffer.push(frame);
    //判断第一个字节是否是结束帧，如果是，组织一个完整的报文
    if (firstByte == "80") {
      if ((frame[1] == 0x00) && (frame[2] == 0x0a)) {
        if (frame[3] == 0) {
          this.makeACompleteFrame();
        }
      } else {
        this.makeACompleteFrame();
      }
    }
  },
  // 组成完整帧进行回调
  makeACompleteFrame(){
    console.log("完整帧")
    console.log(this.globalData.frameBuffer)
  },

  /**
   * ble状态监听
   */
  bleStateListener: function (state) {
    console.log("ble状态监听")
    switch (state) {
      case constants.STATE_DISCONNECTED: //设备连接断开
        console.log('设备连接断开')
        break;
      case constants.STATE_SCANNING: //设备正在扫描
        this.setData({
          titleText: constants.SCANING
        })
        this.Modal.showModal();
        console.log('设备正在扫描')
        break;
      case constants.STATE_SCANNED: //设备扫描结束
        console.log('设备扫描结束')
        //改下ui显示
        this.setData({
          titleText: constants.SCANED
        })
        break;
      case constants.STATE_CONNECTING: //设备正在连接
        console.log('设备正在连接')
        wx.showLoading({
          title: '连接蓝牙设备中...',
        })
        break;
      case constants.STATE_CONNECTED: //设备连接成功
        wx.hideLoading()
        wx.showToast({
          title: '连接成功',
          icon: 'success',
          duration: 1000
        })
        console.log('设备连接成功')
        wx.navigateTo({
          url: '../device/device'
        })
        break;
      case constants.STATE_CONNECTING_ERROR: //连接失败
        console.log('连接失败')      
        wx.hideLoading()
        wx.showToast({
          title: '连接失败',
          icon: 'success',
          duration: 1000
        })
        break;
      case constants.STATE_NOTIFY_SUCCESS: //开启notify成功
        console.log('开启notify成功')
        this.startAuth(); // 发送认证相关
        break;
      case constants.STATE_NOTIFY_FAIL: //开启notify失败
        console.log('开启notify失败')
        break;
      case constants.STATE_CLOSE_BLE: //蓝牙未打开 关闭状态
        showModal(constants.NOT_BLE)
        break;
      case constants.STATE_NOTBLE_WCHAT_VERSION: //微信版本过低 不支持ble
        showModal(constants.NOT_PERMISSION2)
        break;
      case constants.STATE_NOTBLE_SYSTEM_VERSION: //系统版本过低 不支持ble
        showModal(constants.NOT_PERMISSION1)
        break;
    }
  },

})
/**
 * 对一些告警信息弹窗显示
 */
function showModal(content) {
  wx.showModal({
    title: constants.ALARM_TITLE,
    content: content,
    showCancel: false,
    success(res) {
      if (res.confirm) {
        //回到上一页面
        wx.navigateBack({
          delta: 1
        })
      }
    }
  })
}