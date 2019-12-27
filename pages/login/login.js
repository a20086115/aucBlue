// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:""
  },
  login: function(){
    console.log(this.data.username)
    console.log(this.data.password)

    if (this.data.username == ''){
      wx: wx.showToast({
        title: '请输入用户名'
      })
      return false     
    }
    else if (this.data.password == '') {
      wx: wx.showToast({
        title: '请输入密码'
      })
      return false
    }
    else{}

    if (this.data.username == 'admin'){
      if (this.data.password != '111'){
        wx: wx.showToast({
          title: '密码不正确'
        })
        return false
      }
      else{
        wx.navigateTo({
        url: '../search/search'
      })
      }
    }
    else{
      wx: wx.showToast({
        title: '用户名不正确'
      })
    }
  },
  c: function (e){
    console.log(e)
    this.data.username = e.detail
  },
  p: function (e) {
    console.log(e)
    this.data.password = e.detail
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
})