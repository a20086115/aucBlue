// pages/measureValue/measureValue.js
import Toast from "../../miniprogram_npm/vant-weapp/toast/toast";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleArr:["A","B","C","总"],
    dwc_y_arr: ["视在功率（kVa）", "有功功率（kW）", "无功功率（kvar）"],
    sbc_y_arr: ["视在功率（kVa）"],
    titleArr1: ["A", "B", "C"],
    dwdy_y_arr: ["有效值（A）", "频率（HZ）", "THD（%）"],
    dwdl_y_arr: ["有效值（A）", "功率因数", "THD（%）"],
    bcdl_y_arr: ["有效值（A）"],
    // 常规数据中的数据
    dwdy: app.convertAddress(["133", "134", "135", "126", "126", "126", "127", "128", "129"]),
    dwdl: app.convertAddress(["136", "138", "140", "142", "150", "151", "152", "0", "144", "145", "146", "0"]),
    fzdl: app.convertAddress(["785", "787", "789", "791", "799", "800", "801", "0", "793", "794", "795", "0"]),
    bcdl: app.convertAddress(["10", "11", "12", "13"]),

    // 器件参数中的数据
    mxdy: app.convertAddress(["344", "345", "346"]),
    lcldy: app.convertAddress(["347", "348", "349"]),
    wd: app.convertAddress(["350", "351", "352", "353"]),
    nbdl: app.convertAddress(["368", "369", "370"]),

    // 电能质量分析中的数据
    sbc: app.convertAddress(["203", "204", "205", "206"]),
    fzc: app.convertAddress(["803", "804", "805", "806", "807", "808", "809", "810", "811", "812", "813", "814"]),
    dwc: app.convertAddress(["154", "155", "156", "157", "158", "159", "160", "161", "162", "163", "164", "165"]),
    analy_spinner: app.convertAddress(["285", "286", "287"]),
    gcxb: app.convertAddress(["235", "236", "237", "238", "239", "240", "241", "242", "243", "244", "245", "246", "247", "248", "249", "250", "251", "252", "253", "254", "255", "256", "257", "258", "259", "260", "261", "262", "263", "264", "265", "266", "267", "268", "269", "270", "271", "272", "273", "274", "275", "276", "277", "278", "279", "280", "281", "282", "283", "284"]),
    currentIndex: "0",
    currentItem: {},
    show: false,
    spinnerShow: false,
    inputValue: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '测量值'
    })
  },
  // 输入框点击事件
  onInputClick(event) {
    console.log("onInputClick",event)
    this.setData({
      currentItem: event.detail.item,
      show: true
    })
  },
  // 
  // 输入框点击事件
  onActionClick(event) {
    console.log("onActionClick",event)
    this.setData({
      currentItem: event.detail.item,
      spinnerShow: true
    })
  },
  onChange(event) {
    wx.showToast({ title: `切换到标签 ${event.detail.name}`, icon: 'none' });
    this.data.currentIndex = event.detail.name;
    this.getData();
  },
  getData(){
    if (this.data.currentIndex == "0") {
      this.getDwdyAndDwdl();
      this.getFzdl();
      this.getBcdl();
    } else if (this.data.currentIndex == "1") {
      this.getQjcs();
    } else if (this.data.currentIndex == "2")  {
      this.getDwc();
      this.getSbc();
      this.getFzc();
    } else{
      // 获取下拉框信息
      this.getSpinner();
      this.getGcxb();
    }
  },
  // 获取器件参数
  getQjcs(){
    var sendData = ["00", "03", "01", "58", "00", "1b"];
    app.write(sendData, (obj, frame) => {
      console.log("获取器件参数", obj, frame)
      this.setData({
        mxdy: this.copyObject(this.data.mxdy, obj.data),
        lcldy: this.copyObject(this.data.lcldy, obj.data),
        wd: this.copyObject(this.data.wd, obj.data),
        nbdl: this.copyObject(this.data.nbdl, obj.data)
      })
      console.log(this.data)
    });
  },
  // 获取质量分析-电网侧
  getDwc(){
    var sendData = ["00", "03", "00", "9a", "00", "0c"];
    app.write(sendData, (obj, frame) => {
      console.log("获取Dwc信息", obj, frame)
      this.setData({
        dwc: this.copyObject(this.data.dwc, obj.data)
      })
      console.log(this.data)
    });
  },
  // 获取质量分析-设备侧
  getSbc(){
    var sendData = ["00", "03", "00", "cb", "00", "04"];
    app.write(sendData, (obj, frame) => {
      console.log("获取设备侧信息", obj, frame)
      this.setData({
        sbc: this.copyObject(this.data.sbc, obj.data)
      })
      console.log(this.data)
    });
  },
   // 获取质量分析-负载侧
  getFzc(){
    var sendData = ["00", "03", "03", "23", "00", "0c"];
    app.write(sendData, (obj, frame) => {
      console.log("获取质量分析-负载侧", obj, frame)
      this.setData({
        fzc: this.copyObject(this.data.fzc, obj.data)
      })
      console.log(this.data)
    });
  },
  // 获取下拉框信息
  getSpinner() {
    var sendData = ["00", "03", "01", "1d", "00", "03"];
    app.write(sendData, (obj, frame) => {
      console.log("获取下拉框信息", obj, frame)
      this.setData({
        analy_spinner: this.copyObject(this.data.analy_spinner, obj.data)
      })
      console.log(this.data)
    });
  },  
  // 获取各次谐波信息
  getGcxb() {
    var sendData = ["00", "03", "00", "eb", "00", "32"];
    app.write(sendData, (obj, frame) => {
      console.log("获取各次谐波信息", obj, frame)
      this.setData({
        gcxb: this.copyObject(this.data.gcxb, obj.data)
      })
      console.log(this.data)
    });
  },
  copyObject(obj1, obj2){
    for(let key in obj1){
      if(obj2[key]){
        obj1[key] = obj2[key];
      }
    }
    return obj1
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
      this.setData({ show: false, inputValue: "" })
      Toast.fail('输入数据应在' + this.data.currentItem.min + " 到 " + this.data.currentItem.max + "之间")
      return;
    }

    // 写报文,将地址和值转为byte数组
    var addressByteArr = app.getAddressFrame(this.data.currentItem.address)
    var valueByteArr = app.getAddressFrame(value * this.data.currentItem.bs)

    var sendData = ["00", "06"].concat(addressByteArr, valueByteArr);
    app.write(sendData, (obj, frame) => {
      console.log("---------")
      console.log(obj, frame)
      this.setData({
        basic_params: Object.assign(this.data.basic_params, obj.data),
        show: false,
        inputValue: ""
      })
    });
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  onClose(e) {
    if (e.detail == "cancel" || e.detail == "overlay") {
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
      Toast.success("设置成功")
      console.log(this.data)
    });
  },
})