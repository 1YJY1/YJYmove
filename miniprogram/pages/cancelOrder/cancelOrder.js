// pages/cancelOrder/cancelOrder.js
const app = getApp()

const db = wx.cloud.database();
const order = db.collection('orders')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    reasons: [{
        reason: "计划变更",
        id: 1
      },
      {
        reason: "价格太贵",
        id: 2
      },
      {
        reason: "改约车型",
        id: 3
      },
      {
        reason: "其他原因",
        id: 4
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  //选择取消原因
  switchTab: function (e) {
    //console.log(e.currentTarget.dataset.index, e.currentTarget.dataset.id);
    this.setData({
      index: e.currentTarget.dataset.index,
      id: e.currentTarget.dataset.id
    })
  },

  //取消订单
  cancelOrder:function(e){
    var that = this

    console.log(that.data.id)
    if (!that.data.id){
      wx.showToast({
        title: "请先选择原因",
        image: "/icons/warn.png"
      })
    }else{
      order.doc(app.globalData.orderID).update({
        data: {
          status: 4
        },
        success: function (re) {
          console.log(re),
            app.globalData.status == 2,
            wx.reLaunch({
            url: '/pages/cancelSuccess/cancelSuccess',
            })
        }
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