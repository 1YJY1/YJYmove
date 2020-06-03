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
  onLoad: function (options) {
    var that = this

    console.log(options.way)
    that.setData({
      way: options.way //判断是从哪个页面跳转来的，c-用户订单，d-司机订单
    })

    wx.showLoading({
      title: '加载中',
    })

    if (that.data.way === 'c') {
      //云函数从数据库中获取用户所有历史订单
      wx.cloud.callFunction({
        name: "getOrderList",
        data: {
          openid: app.globalData.openid
        },
        success(res) {
          console.log(res.result.data)
          that.setData({
            orderList: res.result.data
          })
        }
      })
    }else{
      //从数据库中获取司机除订单
      order.where({
        driverPhone:app.globalData.driverPhone
      }).orderBy('time', 'desc').get({
        success: function (res){
          console.log(res)
        that.setData({
          orderList: res.data
        })
        }
      })
    }

    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
  },

  //跳转到订单详情页
  toOrderDetail: function (e) {
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
    app.globalData.status = orderInf.status,
    app.globalData.driverName=orderInf.driverName,
    app.globalData.driverPhone=orderInf.driverPhone

    //console.log(app.globalData)
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?way='+this.data.way,
    })
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