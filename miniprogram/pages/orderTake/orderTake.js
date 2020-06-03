// pages/orderTake/orderTake.js
const db = wx.cloud.database();
const order = db.collection('orders')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    firimg: "/icons/orders.png",
    secimg: "/icons/person2.png",
    firco: "#1088A2",
    secco: "#bfbfbf"
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    order.where({
      status: 0
    }).orderBy('time', 'desc').get({
      success: function (res) {
        console.log(res)
        that.setData({
          orderList: res.data
        })
      }
    })
  },

  //接单
  take: function (e) {
    var that = this
    //console.log(e.currentTarget.dataset.order)
    //先将对象转换为字符串进行传递
    var od=JSON.stringify(e.currentTarget.dataset.order)
    //console.log(od)
    wx.navigateTo({
      url: '/pages/confirmOrder/confirmOrder?order='+od,
    })
  },
  //点击接单
  first_select: function (e) {

  },
  //点击我的
  second_select: function (e) {
    wx.redirectTo({
      url: '/pages/driver/driver',
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