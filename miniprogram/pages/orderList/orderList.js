// pages/orderList/orderList.js
const app = getApp()

const db = wx.cloud.database();
const order = db.collection('orders')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this

    wx.showLoading({
      title: '加载中',
    })

    //云函数从数据库中获取订单列表
    wx.cloud.callFunction({
      name: "getOrderList",
      data:{
        openid: app.globalData.openid
      },
      success(res) {
        console.log(res.result.data)
        that.setData({
          orderList: res.result.data
        })
      }
    })

    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
  },

  //跳转到订单详情页
  toOrderDetail: function(e) {
    //console.log(e.currentTarget.dataset.order)

    var orderInf = e.currentTarget.dataset.order;
    app.globalData.type = orderInf.type,
    app.globalData.startAddress = orderInf.startAddress,
    app.globalData.endAddress = orderInf.endAddress,
    app.globalData.remarks = orderInf.remarks,
    app.globalData.time = orderInf.time,
    app.globalData.price = orderInf.price,
    app.globalData.coupon = orderInf.coupon,
    app.globalData.orderID = orderInf._id,
    app.globalData.name = orderInf.name,
    app.globalData.phone = orderInf.phone
    app.globalData.status = orderInf.status

    //console.log(app.globalData)
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail',
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