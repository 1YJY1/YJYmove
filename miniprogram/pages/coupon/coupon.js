// pages/coupon/coupon.js
const app = getApp()

const db = wx.cloud.database();
const coupons = db.collection('coupons')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this

    //console.log(options.way)
    that.setData({
      way: options.way //判断是从哪个页面跳转来的，1-个人中心，2-填写信息页
    })

    coupons.where({
      _openid:app.globalData.openid,
      isUse: false
    }).get({
      success: function(res) {
        console.log(res)
        that.setData({
          couponList: res.data
        })
      }
    })
  },

  //填写优惠券的金额
  inputNumber: function(e) {
    this.setData({
      couponNum: e.detail.value
    })
  },

  //兑换优惠券
  exchange: function(e) { //填入10、20、50即可兑换相应数值的优惠券，并保存到数据库中
    var that = this
    var num = that.data.couponNum;
    //console.log(num)
    if (num == 10 || num == 20 || num == 50) {
      coupons.add({
        data: {
          coupon: num,
          isUse: false //优惠券的状态
        },
        success(res) {
          console.log(res)

          wx.showToast({
            title: '兑换成功!',
            icon: 'success',
            duration: 1000
          })

          that.onLoad(e) //重新加载页面
        }
      })
    } else {
      wx.showToast({
        image: "/icons/warn.png",
        title: '兑换码错误',
      })
    }
  },

  //选中优惠券
  selected: function(e) {
    if (this.data.way == 2) { //从填写信息页跳转来的
      //console.log(e.currentTarget.dataset.onecoupon)
      app.globalData.coupon = e.currentTarget.dataset.onecoupon.coupon,
        //用于提交订单后改优惠券状态
        app.globalData.couponID = e.currentTarget.dataset.onecoupon._id,
        wx.navigateBack({ //返回填写信息页
          delta: 1
        })
    }
  },

  //不使用优惠券
  noUse: function(e) {
    app.globalData.coupon = 0,
      app.globalData.couponID = ""
    wx.navigateBack({ //返回填写信息页
      delta: 1
    })
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