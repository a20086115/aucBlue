//app.js
var bletools = require('./utils/bletools.js');
var constants = require('./utils/constants.js');
var CRC = require('./utils/crc.js');
var aucConstants = require('./utils/aucConstants.js');
import { parse, convertFrameByte } from './utils/parse.js';
// import { getAddressFrame } from './utils/util.js';
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
    //开启循环任务
    setInterval(() => {
      if (this.globalData.taskList.length == 0){
        console.log("当前任务队列为空")
        return
      }
      if (this.globalData.currentTask.used ) {
        console.log("当前任务已结束")
        this.globalData.currentTask = this.globalData.taskList.shift();
        this.globalData.currentTask.time = new Date().getTime();
        bletools.write(this.globalData.currentTask.sendFrame)
      } else if ( new Date().getTime() - this.globalData.currentTask.time > 1000 * 5) {
        console.log("当前任务已超时")
        this.globalData.currentTask = this.globalData.taskList.shift();
        this.globalData.currentTask.time = new Date().getTime();
        bletools.write(this.globalData.currentTask.sendFrame)
      } else{
        console.log("当前任务执行中")
      }
    },200);
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
    currentTask:{
      used: true,
      time: new Date().getTime()
    },
    frameBuffer:[],
    field_switch_name : 0,
    save_flag: 0
  },
  // 根据地址数组， 转换成界面需要的对象
  convertAddress(addressArray) {
    var result = [];
    for (var i = 0; i < addressArray.length; i++) {
      if(addressArray[i] === "xx"){
        result.push({});
      }else{
        result.push(convertFrameByte("", addressArray[i]))
      }
    }
    return result;
  },
  // 将地址转成字节数组
  getAddressFrame(address){
    var str = parseInt(address).toString(16);
    while (str.length < 4) {
      str = "0" + str;
    }
    return [str.substr(0, 2), str.substr(2, 2)]
  },
  // 添加任务到队列中
  addTask(task){
    console.log("添加任务",task)
    this.globalData.taskList.push(task);
  },
  startAuth(){
    console.log(" 蓝牙认证， 发送aa后 发送ff 43")
    setTimeout(() => {
      bletools.write(["aa"]);
      },100)
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
  write(data, callback) {
    //
    // 添加crc字节
    var crc = CRC.CRC.CRC16(data);
    data.push(crc.substring(0, 2))
    data.push(crc.substring(2, 4))
    data.push("55")
    data.unshift("80")
    // 80 00 03 00 41 00 1c 15 c6 55
    // bletools.write(data)
    // this.globalData.currentTask = {
    //   sendFrame: data,
    //   callback: callback,
    //   used: false
    // }
    console.log("-----从机编号11----")
    console.log(data)  
    this.addTask({
      sendFrame: data,
      callback: callback,
      used: false
    });
  },
  /**
   * 发送数据结果 true or false
   * 如果为false msg是失败原因
   */
  writeListener: function (result, writeData, msg) {
    //此处可以执行自己的逻辑 比如一些提示
    console.log(result ? '发送数据成功' : msg)
  
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
      bletools.write(["ff", "43", "42", "44", "49", "47", "42", "45", "48", "45", "43", "43", "47", "48", "43", "44", "48"]);
    } else if (firstData== "fe") { //加密认证过程完成
      wx.hideLoading()
      wx.showToast({
        title: '连接成功',
        icon: 'success',
        duration: 1000
      })
      wx.navigateTo({
        url: '../device/device'
      })
    } else {
      this.addFrame(data);
    }
  },
  // 加入一帧
  addFrame(frame) {
    var firstByte = frame[0];
    //如果是一个报文的第一帧，清空当前缓冲区数据
    if (firstByte == "00" || firstByte == "80") {
      this.globalData.frameBuffer = [];
    }
    this.globalData.frameBuffer.push(frame);
    //判断第一个字节是否是结束帧，如果是，组织一个完整的报文
    // if (firstByte == "80") {
    //   if ((frame[1] == 0x00) && (frame[2] == 0x0a)) {
    //     if (frame[3] == 0) {
    //       this.makeACompleteFrame();
    //     }
    //   } else {
    //     this.makeACompleteFrame();
    //   }
    // }
    if((parseInt(firstByte, "16") >> 7) == 1 ){
      // 说明是结束帧
      this.makeACompleteFrame();
    }
  },
  // 组成完整帧进行回调
  makeACompleteFrame(){
    console.log("完整帧")
    console.log(this.globalData.frameBuffer)

    // 遍历所有帧缓冲区，移除帧头
    for(var frame of this.globalData.frameBuffer){
      frame.shift();
    }

    // 合为一帧， 数组扁平化
    var completeFrame = Array.prototype.concat.apply([], this.globalData.frameBuffer)
    if (completeFrame.length > 2 && completeFrame[1] == "6") {
      if (parseInt(completeFrame[5],16) == parseInt(this.globalData.currentTask.sendFrame[6],16)) {
        if (completeFrame[3] == "76") {
          wx.showToast({ title: `保存成功`, icon: 'success' });
        } else {
          wx.showToast({ title: `设置成功`, icon: 'success' });
        }
      } else {
        wx.showToast({ title: `设置失败`, icon: 'fail' });
      }
    } 

    // 执行回调, 传回解析结果与保温
    this.globalData.currentTask.callback(parse(completeFrame, this.globalData.currentTask.sendFrame), completeFrame)
    this.globalData.currentTask.used = true;
    // 清空缓冲区
    this.globalData.frameBuffer.length = 0;
  },

  /**
   * ble状态监听
   */
  bleStateListener: function (state) {
    console.log("ble状态监听")
    switch (state) {
      case constants.STATE_DISCONNECTED: //设备连接断开
        console.log('设备连接断开')
        wx.showModal({
          title: '提示',
          content: '蓝牙连接断开，请重新连接',
        })
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
        console.log('设备连接成功')
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
  copyObject(obj1, obj2) {
    for (let item of obj1) {
      if (obj2[item.address]) {
        item.value = obj2[item.address].value;
      }
    }
    return obj1
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