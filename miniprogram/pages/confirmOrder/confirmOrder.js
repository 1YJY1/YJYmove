// pages/dirverOrder/dirverOrder.js
const app = getApp()
const db = wx.cloud.database();
const order = db.collection('orders')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options.order)
    var order = JSON.parse(options.order)
    console.log(order)
    this.setData({
      orderID: order._id,
      type: order.type,
      startAddress: order.startAddress,
      endAddress: order.endAddress,
      remarks: order.remarks,
      time: order.time,
      price: order.price,
      coupon: order.coupon,
      name: order.name,
      phone: order.phone
    })

    var name = order.type;
    if(name=="面包小搬"){
      this.setData({
        startPrice: 99,
      })
    }else if (name=="金杯中搬"){
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
    
    //解决优惠金额为NaN的情况
    if(!order.coupon){
      this.setData({
        coupon: 0,
      })
    }
  },

  //确认接单
  toTake: function (e) {
    var that=this
    order.doc(this.data.orderID).update({
      data: {
        status:1,
        driverName: app.globalData.driverName,
        driverPhone: app.globalData.driverPhone
      },
      success: function (e) {
        //跳转到订单详情
        app.globalData.type = that.data.type,
          app.globalData.startAddress = that.data.startAddress,
          app.globalData.endAddress = that.data.endAddress,
          app.globalData.remarks = that.data.remarks,
          app.globalData.time = that.data.time,
          app.globalData.price = that.data.price,
          app.globalData.coupon = that.data.coupon,
          app.globalData.orderID = that.data.orderID,
          app.globalData.name = that.data.name,
          app.globalData.phone = that.data.phone
          app.globalData.status = 1,
          app.globalData.driverName = app.globalData.driverName,
          app.globalData.driverPhone = app.globalData.driverPhone
        wx.showToast({
          title: '接单成功',
          icon: 'success',
          duration: 2000,
          success() {
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/orderDetail/orderDetail?way=d',
              })
            }, 2000)
          }
        })
      }
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