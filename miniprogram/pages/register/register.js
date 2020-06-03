// pages/register/register.js
const app = getApp();
const db = wx.cloud.database();
const drivers = db.collection('drivers')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: "",
    phonenumber: "",
    password: "",
    passwordack: "",
    namerr: "",
    phoneerr: "",
    pwserr: "",
    pws2err: ""
  },
  signin: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  regist: function (e) {
    var that = this
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    that.setData({
      namerr: "",
      phoneerr: "",
      pwserr: "",
      pws2err: ""
    })
    var flag = true;
    if (that.data.username == '') {
      that.setData({
        namerr: "请输入用户名!"
      })
      flag=false
    } 
    if (that.data.password == '') {
      that.setData({
        pwserr: "请输入密码!"
      })
      flag=false
    } 
    if (that.data.passwordack == '') {
      that.setData({
        pws2err: "请输入确认密码!"
      })
      flag=false
    } else if (that.data.password != that.data.passwordack) {
      that.setData({
        pws2err: "两次输入密码不一致!"
      })
      flag=false
    } 
    if (that.data.phonenumber == '') {
      that.setData({
        phoneerr: "请输入手机号!"
      })
      flag=false
    } else if (that.data.phonenumber.length != 11) {
      that.setData({
        phoneerr: "手机号长度有误!"
      })
      flag=false
    } else if(!myreg.test(that.data.phonenumber)) {
      that.setData({
        phoneerr: "手机号格式错误!"
      })
      flag=false
    } else{
      drivers.where({
        driverPhone: that.data.phonenumber
      }).get({
        success:function(res){
          console.log(res.data)
          if (res.data.length !== 0) {
            that.setData({
              phoneerr: "该手机号已注册!"
            })
            flag=false
          }else if(flag){
            drivers.add({
              data: {
                driverName: that.data.username,
                driverPhone: that.data.phonenumber,
                pws: that.data.password,
                finishOrders: 0, //完成订单数
                earnMoney: 0 //完成订单金额
              },
              success(res) {
                console.log(res),
                  wx.showToast({
                    title: '注册成功',
                    icon: 'success',
                    duration: 2000,
                    success() {
                      setTimeout(function () {
                        wx.redirectTo({
                          url: '/pages/driverLogin/driverLogin',
                        })
                      }, 2000)
                    }
                  })
              }
            })
          }
        }
      })
    }
  },

  usernameInput: function (e) {
    this.data.username = e.detail.value
  },

  phonenumberInput: function (e) {
    this.data.phonenumber = e.detail.value
  },

  passwordInput: function (e) {
    this.data.password = e.detail.value
  },

  passwordInputAck: function (e) {
    this.data.passwordack = e.detail.value
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