// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: "admin",
    password: "111"
  },
  login: function () {
    console.log(this.data.username)
    console.log(this.data.password)

    if (this.data.username == '') {
      wx.showToast({
        title: '请输入用户名',
        icon: "none"
      })
      return false
    }
    else if (this.data.password == '') {
      wx.showToast({
        title: '请输入密码',
        icon: "none"
      })
      return false
    }
    else { }

    if (this.data.username == 'admin') {
      if (this.data.password != '111') {
        wx.showToast({
          title: '密码不正确'
        })
        return false
      }else {
        wx.navigateTo({
          url: '../search/search'
        })
      }
    }else {
      wx: wx.showToast({
        title: '用户名不正确'
      })
    }
  },
  c: function (e) {
    console.log(e)
    this.data.username = e.detail
  },
  p: function (e) {
    console.log(e)
    this.data.password = e.detail
  }
})