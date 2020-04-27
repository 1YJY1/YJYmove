// pages/orderDetail/orderDetail.js
const app = getApp()

const db = wx.cloud.database();
const order = db.collection('orders')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusText:"服务中",
    startPrice:99,
    coupon:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: app.globalData.type,
      startAddress: app.globalData.startAddress,
      endAddress: app.globalData.endAddress,
      remarks: app.globalData.remarks,
      time: app.globalData.time,
      price: app.globalData.price,
      coupon: app.globalData.coupon,
      name: app.globalData.name,
      phone: app.globalData.phone
    })
  
    if (app.globalData.orderID){
      this.setData({
        orderID: app.globalData.orderID,
      })
    }
    var name = app.globalData.type;
    if (name=="金杯中搬"){
      this.setData({
        startPrice: 199,
      })
    } else if (name == "货车大搬") {
      this.setData({
        startPrice: 399,
      })
    } else if (name == "精致搬家") {
      this.setData({
        startPrice: 599,
      })
    }

    if (app.globalData.status==1){
      this.setData({
        statusText: "已完成",
      })
    } else if (app.globalData.status == 2) {
      this.setData({
        statusText: "已取消",
      })
    }
  },

  //跳转到取消订单页
  toCancel:function(){
    wx.navigateTo({
      url: '/pages/cancelOrder/cancelOrder',
    })
  },

  //完成订单
  completeOrder:function(e){
    var that=this

    wx.showModal({
      title: '提示',
      content: '确定订单已完成',
      success(res) {
        if (res.confirm) {
          order.doc(that.data.orderID).update({
            data: {
              status: 1
            },
            success:function(re) {
              console.log(re),
              app.globalData.status == 1,
              that.setData({
                statusText: "已完成"
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //再来一单
  oneMore:function(e){
    wx.reLaunch({
      url: '/pages/home/home',
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