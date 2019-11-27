const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    basic_params: ["65", "70", "67", "68", "753", "80", "83", "69", "84"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.convertAddress(this.data.basic_params);
    console.log(this.data.basic_params)
  },

  onChange(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none'
    });
    console.log(event.detail.name)
    if (event.detail.name == "0"){
      app.write(["00","03","00","41","00","1c"]);
    } else if (event.detail.name == "1") {
      app.write(["00", "03", "00", "41", "00", "1c"],function(){
        console.log("!11")
      },true);
    } else {

    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})