import Toast from "../../miniprogram_npm/vant-weapp/toast/toast";
var util = require('../../utils/util.js');
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    basic_params: app.convertAddress(["65", "66", "70", "71", "67", "68","79", "80", "83", "69", "84", "92"]),

    net_params: app.convertAddress(["1039", "1000", "1032", "1035", "1036", "1037", "1038", "1003","1001","1040","1043","1046","1049","1052","1055","1058","1061","1064","1067"]),

    commu_params: app.convertAddress(["81", "82", "93", "752"]),

    field_debug: app.convertAddress(["49","50","51","52", "53"]),

    system_time: app.convertAddress(["14"]),

    currentIndex: "0",
    currentItem:{},
    show:false,
    spinnerShow: false,
    inputValue:"",
    time:""
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
  // 下拉框点击事件
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
      app.globalData.field_switch_name = 0;
      // console.log("页面", app.globalData.switch_name)
    } else if (this.data.currentIndex == "1") {
      //获取组网参数
      this.getnetparams();
      app.globalData.field_switch_name = 1;
    }
     else if (this.data.currentIndex == "2") {
      //获取通信参数
      this.getTxcs();
      //获取模块号
      this.getMkh();
      app.globalData.field_switch_name = 2;
      // console.log("页面", app.globalData.switch_name)
    } else {
      // 获取现场调整信息
      this.getXctzxx();
      //获取系统时间
      this.getxtsj();
      app.globalData.field_switch_name = 3;
    }
  },
  
  onConfirm() {
    console.log("onConfirm", this.data.inputValue, this.data)
    // 判断value是否为空
    var value = this.data.inputValue;
    console.log("onConfirm", value)
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
    var address = (parseInt(addressByteArr[0], 16) << 8) + parseInt(addressByteArr[1], 16)
    console.log(address)

    //地址介于1040-1067为出厂编号设置，使用10报文，其他使用06报文
    if ((address < 1040) || (address > 1067)){
      var valueByteArr = app.getAddressFrame(value * this.data.currentItem.bs)
      var sendData = ["00", "06"].concat(addressByteArr, valueByteArr);
      app.write(sendData, (obj, frame) => {
        console.log(obj, frame)
        this.setData({
          show: false,
          inputValue: "",
        })
        // Toast.success("设置成功")
        app.globalData.save_flag = 1;
        this.getTapData();
      });
    }else{
      //低于12位的输入丢弃并提示
      // console.log(value.length)
      if(value.length < 12)
      {
        this.setData({ show: false, inputValue: "" })
        Toast.fail('输入数据应为12位')
        return;
      }

      //取输入字符串
      var dataValue1 = []
      var dataValue2 = []
      var dataValue3 = []

      dataValue1[0] = (parseInt(value.substr(0, 4)) >> 8).toString(16)
      dataValue1[1] = (parseInt(value.substr(0, 4)) & 0x00FF).toString(16)
      dataValue2[0] = (parseInt(value.substr(4, 4)) >> 8).toString(16)
      dataValue2[1] = (parseInt(value.substr(4, 4)) & 0x00FF).toString(16)
      dataValue3[0] = (parseInt(value.substr(8, 4)) >> 8).toString(16)
      dataValue3[1] = (parseInt(value.substr(8, 4)) & 0x00FF).toString(16)
      
      var sendData = ["00", "10"].concat(addressByteArr, "00", "03", "06", dataValue1[0], dataValue1[1], dataValue2[0], dataValue2[1], dataValue3[0], dataValue3[1]);
      console.log("-----从机编号1----")
      console.log(sendData)    

      app.write(sendData, (obj, frame) => {
        console.log(obj, frame)
        this.setData({
          show: false,
          inputValue: "",
        })
        // Toast.success("设置成功")
        app.globalData.save_flag = 1;
        this.getTapData();
      });
    }
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
      app.globalData.save_flag = 1;
      this.getTapData();
    });
  },
  // 获取基本参数
  getJbcs() {
    console.log("----获取基本参数1111-----")
    console.log(this.data)
    var sendData = ["00", "03", "00", "41", "00", "1c"];
    app.write(sendData, (obj, frame) => {
      // console.log("----获取基本参数-----")
      console.log(obj, frame)
      this.setData({
        basic_params: app.copyObject(this.data.basic_params, obj.data)
      })
      console.log(this.data)
    });
  },
  // 获取心跳时间
  // getXtsj() {
  //   var sendData = ["00", "03", "02", "f1", "00", "01"];
  //   app.write(sendData, (obj, frame) => {
  //     console.log("----获取心跳时间-----")
  //     console.log(obj, frame)
  //     this.setData({
  //       basic_params: app.copyObject(this.data.basic_params, obj.data)
  //     })
  //     console.log(this.data)
  //   });
  // },
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
    var sendData = ["00", "03", "00", "31", "00", "06"];
    app.write(sendData, (obj, frame) => {
      console.log("获取现场调整信息成功", obj, frame)
      this.setData({
        field_debug: app.copyObject(this.data.field_debug, obj.data)
      })
      console.log(this.data)
    });
  },
  // 获取系统时间
  getxtsj() {
    var sendData = ["00", "03", "00", "0E", "00", "06"];
    app.write(sendData, (obj, frame) => {
      console.log("获取系统时间", obj, frame)

      //对接收到的系统时间进行合并
      obj.data["14"].value = obj.data["14"].value + "/" +
        obj.data["15"].value + "/" + obj.data["16"].value + " " + obj.data["17"].value + ":" + obj.data["18"].value + ":" + obj.data["19"].value;
      delete obj.data[15]
      delete obj.data[16]
      delete obj.data[17]
      delete obj.data[18]
      delete obj.data[19]

      this.setData({
        system_time: app.copyObject(this.data.system_time, obj.data)
      })
      console.log(this.data)
    });
  },
  // 获取组网信息参数
  getnetparams() {
    var sendData = ["00", "03", "03", "e8", "00", "46"];
    app.write(sendData, (obj, frame) => {
      console.log("获取组网参数信息成功", obj, frame)

      //对接收的到从机编号数据进行合并，10组数据
      obj.data["1040"].value = app.buling(obj.data["1040"].value,4) +
        app.buling(obj.data["1041"].value,4) + app.buling(obj.data["1042"].value,4);
      delete obj.data[1041]
      delete obj.data[1042]

      obj.data["1043"].value = app.buling(obj.data["1043"].value, 4) +
        app.buling(obj.data["1044"].value, 4) + app.buling(obj.data["1045"].value, 4);
      delete obj.data[1044]
      delete obj.data[1045]

      obj.data["1046"].value = app.buling(obj.data["1046"].value, 4) +
        app.buling(obj.data["1047"].value, 4) + app.buling(obj.data["1048"].value, 4);
      delete obj.data[1047]
      delete obj.data[1048]

      obj.data["1049"].value = app.buling(obj.data["1049"].value, 4) +
        app.buling(obj.data["1050"].value, 4) + app.buling(obj.data["1051"].value, 4);
      delete obj.data[1050]
      delete obj.data[1051]

      obj.data["1052"].value = app.buling(obj.data["1052"].value, 4) +
        app.buling(obj.data["1053"].value, 4) + app.buling(obj.data["1054"].value, 4);
      delete obj.data[1053]
      delete obj.data[1054]

      obj.data["1055"].value = app.buling(obj.data["1055"].value, 4) +
        app.buling(obj.data["1056"].value, 4) + app.buling(obj.data["1057"].value, 4);
      delete obj.data[1056]
      delete obj.data[1057]

      obj.data["1058"].value = app.buling(obj.data["1058"].value, 4) +
        app.buling(obj.data["1059"].value, 4) + app.buling(obj.data["1060"].value, 4);
      delete obj.data[1059]
      delete obj.data[1060]

      obj.data["1061"].value = app.buling(obj.data["1061"].value, 4) +
        app.buling(obj.data["1062"].value, 4) + app.buling(obj.data["1063"].value, 4);
      delete obj.data[1062]
      delete obj.data[1063]

      obj.data["1064"].value = app.buling(obj.data["1064"].value, 4) +
        app.buling(obj.data["1065"].value, 4) + app.buling(obj.data["1066"].value, 4);
      delete obj.data[1065]
      delete obj.data[1066]

      obj.data["1067"].value = app.buling(obj.data["1067"].value, 4) +
        app.buling(obj.data["1068"].value, 4) + app.buling(obj.data["1069"].value, 4);
      delete obj.data[1068]
      delete obj.data[1069]

      console.log(obj.data)

      this.setData({
        net_params: app.copyObject(this.data.net_params, obj.data)
      })
      console.log(this.data)
    });
  },
  //系统时间校时
  xtsj: function () {
    //获取当前时间
    var time = util.formatTime(new Date());
    // time = new Date()
    console.log("打印时间")
    console.log(time)
    var time1 = []
    var time2 = []
    var time3 = []
    var time4 = []
    var time5 = []
    var time6 = []

    time1[0] = (parseInt(time.substr(0, 4)) >> 8).toString(16)
    time1[1] = (parseInt(time.substr(0, 4)) & 0x00FF).toString(16)
    time2[0] = (parseInt(time.substr(5, 2)) >> 8).toString(16)
    time2[1] = (parseInt(time.substr(5, 2)) & 0x00FF).toString(16)
    time3[0] = (parseInt(time.substr(8, 2)) >> 8).toString(16)
    time3[1] = (parseInt(time.substr(8, 2)) & 0x00FF).toString(16)
    time4[0] = (parseInt(time.substr(11, 2)) >> 8).toString(16)
    time4[1] = (parseInt(time.substr(11, 2)) & 0x00FF).toString(16)
    time5[0] = (parseInt(time.substr(14, 2)) >> 8).toString(16)
    time5[1] = (parseInt(time.substr(14, 2)) & 0x00FF).toString(16)
    time6[0] = (parseInt(time.substr(17, 2)) >> 8).toString(16)
    time6[1] = (parseInt(time.substr(17, 2)) & 0x00FF).toString(16)

    //写报文
    var sendData = ["00", "10", "00", "22", "00", "06", "0C", time1[0], time1[1], time2[0], time2[1], time3[0], time3[1], time4[0], time4[1], time5[0], time5[1], time6[0], time6[1]];
    app.write(sendData, (obj, frame) => {
      console.log("---------")
      console.log(obj, frame)
      this.setData({
        spinnerShow: false,
      })
      console.log(this.data)
      this.save_time();
    });
  },
//时间生效标志
  save_time: function (){
    var sendData = ["00", "06", "00", "28", "00", "01"];
    app.write(sendData, (obj, frame) => {
      console.log("---------")
      console.log(obj, frame)
      this.setData({
        spinnerShow: false,
      })
      console.log(this.data)
      // Toast.success("设置成功")
      app.globalData.save_flag = 1;
      this.getTapData();
    });
  }

})