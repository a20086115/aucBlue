const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    basic_address: ["21", "27", "28", "30", "31", "32", "33"],
    basic_params: app.convertAddress(["21", "27", "28", "30", "31", "32", "33"]),
    bluItem:{
      value: "V 1.0.0",
      type: "text",
      title: "蓝牙版本"
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
  },
  // 获取设备信息
  getDeviceInfo() {
    var sendData = ["00", "03", "00", "15", "00", "0D"];
    app.write(sendData, (obj, receiveFrame) => {
      // 获取设备信息成功
      // 硬件版本占两个字节
      obj.data[28].value += obj.data[29].value;
      delete obj.data[29]
      this.setData({
        basic_params: Object.assign(this.data.basic_params, obj.data)
      })
      this.getNumber();
    });
  },
    // 获取出场编号
  getNumber() {
      var sendData = ["00", "03", "03", "CA", "00", "0D"];
      app.write(sendData, (obj, receiveFrame) => {
       
    });
  }
})