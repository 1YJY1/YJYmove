// pages/orderDetail/orderDetail.js
const app = getApp()

const db = wx.cloud.database();
const order = db.collection('orders');
const drivers = db.collection('drivers')
const m = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    haveDriver:false,
    statusText:"待接单",
    startPrice:99,
    coupon:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.way)    //判断是什么端的订单详情，c--顾客端，d--司机端

    this.setData({
      way:options.way
    })

    this.setData({
      type: app.globalData.type,
      startAddress: app.globalData.startAddress,
      endAddress: app.globalData.endAddress,
      remarks: app.globalData.remarks,
      time: app.globalData.time,
      price: app.globalData.price,
      coupon: app.globalData.coupon,
      name: app.globalData.name,
      phone: app.globalData.phone,
      driverName:app.globalData.driverName,
      driverPhone:app.globalData.driverPhone
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
        statusText: "服务中",
        haveDriver:true
      })
    } else if (app.globalData.status == 2) {
      this.setData({
        statusText: "待付款",
        haveDriver:true
      })
    }else if (app.globalData.status == 3) {
      this.setData({
        statusText: "已完成",
        haveDriver:true
      })
    }else if (app.globalData.status == 4){
      this.setData({
        statusText: "已取消",
      })
      if(app.globalData.driverPhone){
        this.setData({
          haveDriver:true
        })
      }
    }

    if(this.data.way=='d'){  //司机端不展示司机信息
      this.setData({
        haveDriver:false
      })
    }
  },

  //跳转到取消订单页
  toCancel:function(e){
    wx.navigateTo({
      url: '/pages/cancelOrder/cancelOrder',
    })
  },

  //支付账单
  toPay:function(e){
    var that=this

    wx.showModal({
      title: '提示',
      content: '确定订单已完成',
      success(res) {
        if (res.confirm) {
          //订单状态变为已完成
          order.doc(that.data.orderID).update({
            data: {
              status: 3
            },
            success:function(re) {
              console.log(app.globalData.driverPhone),
              //更新司机完成订单的数据
              drivers.where({
                driverPhone:app.globalData.driverPhone
              }).update({
                data:{
                  finishOrders:m.inc(1),
                  earnMoney:m.inc(that.data.price)
                }
              })
              app.globalData.status == 3,
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
              status: 2
            },
            success:function(re) {
              console.log(re),
              app.globalData.status == 2,
              that.setData({
                statusText: "待付款"
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

  //去接单
  toTake:function(e){
    wx.redirectTo({
      url: '/pages/orderTake/orderTake',
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