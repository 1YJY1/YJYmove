// pages/driverLogin/driverLogin.js

const app = getApp();
const db = wx.cloud.database();
const drivers = db.collection('drivers')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    password: "",
    phoneerr: "",
    pwserr: ""
  },

  //去注册
  signup: function () {
    wx.navigateTo({
      url: '/pages/register/register'
    })
  },

  login: function () {
    var that = this
    that.setData({
      phoneerr: "",
      pwserr: ""
    })
    var flag = true;
    if (that.data.phone == '') {
      that.setData({
        phoneerr: "手机号不能为空!"
      })
      flag = false
    }
    if (that.data.password == '') {
      that.setData({
        pwserr: "密码不能为空!"
      })
      flag = false
    }
    if (flag) {
      drivers.where({
        driverPhone: that.data.phone
      }).get({
        success: function (res) {
          //console.log(res.data[0].pws===that.data.password)
          if (res.data.length === 0) {
            that.setData({
              phoneerr: "该账户不存在!"
            })
          } else if (res.data[0].pws !== that.data.password) {
            that.setData({
              pwserr: "密码错误!"
            })
          } else {
            app.globalData.driverPhone = that.data.phone,
            app.globalData.driverName = res.data[0].driverName,
            // console.log(app.globalData.driverPhone),
            // console.log(app.globalData.driverName),
            wx.redirectTo({
              url: "/pages/driver/driver"
            })
          }
        }
      })
    }
  },

  phoneInput: function (e) {
    this.data.phone = e.detail.value
  },

  passwordInput: function (e) {
    this.data.password = e.detail.value
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