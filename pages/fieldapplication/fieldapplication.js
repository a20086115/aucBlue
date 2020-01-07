import Toast from "../../miniprogram_npm/vant-weapp/toast/toast";
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    basic_params: app.convertAddress(["65", "66", "70", "71", "67", "68", "753", "79", "80", "83", "69", "84", "92"]),

    commu_params: app.convertAddress(["81", "82", "93", "752"]),

    field_debug: app.convertAddress(["52", "53"]),

    currentIndex: "0",
    currentItem:{},
    show:false,
    spinnerShow: false,
    inputValue:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '现场应用'
    })
    
    //初次进入页面读取首页数据
    // 获取基本参数
    this.getJbcs();
    // 获取心跳时间
    this.getXtsj();

    console.log(this.data)
  },

  // 输入框点击事件
  onInputClick(event){
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
    console.log("切换到标签", event.detail.name )
    this.data.currentIndex = event.detail.name;
    this.getTapData();
  },
  getTapData(){
    if (this.data.currentIndex == "0") {
      // 获取基本参数
      this.getJbcs();
      // 获取心跳时间
      app.globalData.field_switch_name = 0;
      // console.log("页面", app.globalData.switch_name)
    } else if (this.data.currentIndex == "1") {
      //获取通信参数
      this.getTxcs();
      //获取模块号
      this.getMkh();
      app.globalData.field_switch_name = 1;
      // console.log("页面", app.globalData.switch_name)
    } else {
      // 获取现场调整信息
      this.getXctzxx();
      app.globalData.field_switch_name = 2;
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
      this.setData({show: false,inputValue: ""})
      Toast.fail('输入数据应在' + this.data.currentItem.min + " 到 " + this.data.currentItem.max + "之间")
      return;
    }

    // 写报文
    var addressByteArr = app.getAddressFrame(this.data.currentItem.address)
    var valueByteArr = app.getAddressFrame(value * this.data.currentItem.bs)
    var sendData = ["00", "06"].concat(addressByteArr, valueByteArr);
    app.write(sendData, (obj, frame) => {
      console.log(obj, frame)
      this.setData({
        show:false,
        inputValue: "",
      })
      // Toast.success("设置成功")
      this.getTapData();
    });
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  onClose(e){
    if (e.detail == "cancel" || e.detail == "overlay"){
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
      // Toast.fail("设置成功")
      this.getTapData();
    });
  },
  // 获取基本参数
  getJbcs() {
    console.log("----获取基本参数1111-----")
    console.log(this.data)
    var sendData = ["00", "03", "00", "41", "00", "1c"];
    app.write(sendData, (obj, frame) => {
      console.log("----获取基本参数-----")
      console.log(obj, frame)
      this.setData({
        basic_params: app.copyObject(this.data.basic_params, obj.data)
      })
      console.log(this.data)
    });
  },
  // 获取心跳时间
  getXtsj() {
    var sendData = ["00", "03", "02", "f1", "00", "01"];
    app.write(sendData, (obj, frame) => {
      console.log("----获取心跳时间-----")
      console.log(obj, frame)
      this.setData({
        basic_params: app.copyObject(this.data.basic_params, obj.data)
      })
      console.log(this.data)
    });
  },
  // 获取通信参数
  getTxcs() {
    var sendData = ["00", "03", "00", "51", "00", "0D"];
    app.write(sendData, (obj, frame) => {
      console.log("----获取通信参数-----")
      console.log(obj, frame)
      this.setData({
        commu_params: app.copyObject(this.data.commu_params, obj.data)
      })
      console.log(this.data)
    });
  },
  // 获取模块号
  getMkh() {
    var sendData = ["00", "03", "02", "F0", "00", "01"];
    app.write(sendData, (obj, frame) => {
      console.log("----获取模块号-----")
      console.log(obj, frame)
      this.setData({
        commu_params: app.copyObject(this.data.commu_params, obj.data)
      })
      console.log(this.data)
    });
  },
  // 获取现场调整信息
  getXctzxx() {
    var sendData = ["00", "03", "00", "0e", "00", "28"];
    app.write(sendData, (obj, frame) => {
      console.log("获取现场调整信息成功", obj, frame)
      this.setData({
        field_debug: app.copyObject(this.data.field_debug, obj.data)
      })
      console.log(this.data)
    });
  }
})