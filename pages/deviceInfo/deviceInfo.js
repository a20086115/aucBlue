const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    device_info: app.convertAddress([ "27", "28", "30", "31", "32", "33"]),
    bluItem:{
      value: "V 1.0.0",
      type: "text",
      title: "蓝牙版本"
    },
    product_no:{
      value: "*************",
      type: "text",
      title: "出厂编号"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '设备信息'
    })
    this.sendData();
    console.log(this.data)
  },
  sendData(){
    this.getDeviceInfo();
    this.getNumber();
  },
  // 获取设备信息
  getDeviceInfo() {
    var sendData = ["00", "03", "00", "15", "00", "0D"];
    app.write(sendData, (obj, receiveFrame) => {
      // 获取设备信息成功
      // 硬件版本占两个字节
      console.log("获取设备信息成功",obj, receiveFrame)
      obj.data["28"].value += obj.data["29"].value;
      delete obj.data[29]
      this.setData({
        device_info: Object.assign(this.data.device_info, obj.data)
      })
    });
  },
    // 获取出场编号
  getNumber() {
    var sendData = ["00", "03", "03", "CA", "00", "0D"];
    app.write(sendData, (obj, receiveFrame) => {
      console.log("获取出厂编号成功", obj, receiveFrame)
      var text = ""
      for(var i=4; i<30;i=i+2){
        text += receiveFrame[i]
      }
       this.setData({
         "product_no.value": text
       })
    });
  }
})