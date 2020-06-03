// pages/mine/mine.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isAuthorize:false,
    isLogin: false,
    userID: "未登录",
    logintext: "登录享受优质服务",
    avatar: "/icons/mine.png",
    btnText: "微信登录"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    wx.cloud.callFunction({
      name: "login",
      success(res) {
        console.log(res.result.openid)
        
        app.globalData.openid = res.result.openid  //保存openid到全局变量
      }
    })

    wx.showLoading({
      title: '加载中',
    })

    wx.login({
      success(res) {
        if (res.code) {
          wx.getSetting({
            success(res) {
              if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                wx.getUserInfo({
                  success: function(res) {
                    //console.log(res.userInfo)
                    app.globalData.userInfo = res.userInfo,
                      that.setData({
                        isAuthorize: true,
                        isLogin: true,
                        userID: app.globalData.userInfo.nickName,
                        logintext: "欢迎使用YJY搬家",
                        avatar: app.globalData.userInfo.avatarUrl,
                        btnText: "退出登录"
                      })
                  }
                })
              }
            }
          })
          //console.log(res.code)
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })

    setTimeout(function () {
      wx.hideLoading()
    }, 1000)

  },
  getPhoneNumber(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },
  //用户授权
  bindGetUserInfo(e) {
    if (!this.data.isAuthorize && !this.data.isLogin  ){ 
      this.onLoad(e)      //授权后刷新页面
    }else if (!this.data.isLogin) {
      this.setData({
        isLogin: true,
        userID: app.globalData.userInfo.nickName,
        logintext: "欢迎使用YJY搬家",
        avatar: app.globalData.userInfo.avatarUrl,
        btnText: "退出登录"
      })
    } else{
      this.setData({
          isLogin: false,
          userID: "未登录",
          logintext: "登录享受优质服务",
          avatar: "/icons/mine.png",
          btnText: "微信登录"
        })
    }
  },

  //跳转到我的订单
  toOrderList: function() {
    if(!this.data.isLogin){
      wx.showToast({
        image: "/icons/warn.png",
        title: '请先登录',
      })
    }else{
      wx.navigateTo({
        url: '/pages/orderList/orderList?way=c',
      })
    }
  },

  //跳转到优惠券
  toCoupon: function() {
    if (!this.data.isLogin) {
      wx.showToast({
        image: "/icons/warn.png",
        title: '请先登录',
      })
    }else{
      wx.navigateTo({
        url: '/pages/coupon/coupon?way=1',  //way记录跳转到优惠券页面的方式
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              console.log(scope)
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})