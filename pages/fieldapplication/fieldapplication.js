import Toast from "../../miniprogram_npm/vant-weapp/toast/toast";

const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    basic_params_address: ["65", "70", "67", "68", "753", "80", "83", "69", "84"],
    basic_params: app.convertAddress(["65", "70", "67", "68", "753", "80", "83", "69", "84"]),

    commu_params_address: ["81", "82", "93", "94", "752"],
    commu_params: app.convertAddress(["81", "82", "93", "94", "752"]),

    field_debug_address: ["52", "53"],
    field_debug: app.convertAddress(["52", "53"]),


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
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none'
    });
    console.log(event.detail.name)
    if (event.detail.name == "0"){
     // app.write(["00","03","00","41","00","1c"]);
      // 获取心跳时间
      this.getXtsj();
    } else if (event.detail.name == "1") {
      app.write(["00", "03", "00", "41", "00", "1c"],function(){
        console.log("!11")
      },true);
    } else {
      // 获取现场调整信息
      this.getXctzxx();
    }
  },
  // 获取心跳时间
  getXtsj(){
    var sendData = ["00", "03", "02", "f1", "00", "01"];
    app.write(sendData, (obj, frame) => {
      console.log("---------")
      console.log(obj, frame)
      this.setData({
          basic_params: Object.assign(this.data.basic_params, obj.data)
      })
      console.log(this.data)
    });
  },
  // 获取现场调整信息
  getXctzxx(){
    var sendData = ["00", "03", "00", "0e", "00", "28"];
    app.write(sendData, (obj, frame) => {
      console.log("获取现场调整信息成功", obj, frame)
      this.setData({
        field_debug: Object.assign(this.data.field_debug, obj.data)
      })
      console.log(this.data)
    });
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
      console.log("---------")
      console.log(obj, frame)
      this.setData({
        basic_params: Object.assign(this.data.basic_params, obj.data),
        show:false,
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
      Toast.fail("设置成功")
      console.log(this.data)
    });
  }
})