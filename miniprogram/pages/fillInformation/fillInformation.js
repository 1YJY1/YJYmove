// pages/fillInformation/fillInformation.js
const app = getApp()

const db = wx.cloud.database();
const order = db.collection('orders')
const coupons = db.collection('coupons')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"请输入姓名",
    phone:"请输入手机号",
    remarks:"备注",
    coupon:"不使用优惠券"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //console.log(app.globalData);
    var that=this
    //利用排序查询获取未使用的最大数值优惠券
    coupons.where({ _openid: app.globalData.openid,isUse:false}).orderBy('coupon', 'desc').get({  
        success(res){
          //console.log(res.data[0])

          app.globalData.coupon=res.data[0].coupon,
          app.globalData.couponID=res.data[0]._id
          that.setData({
            coupon: app.globalData.coupon,
            couponID: app.globalData.couponID
          })
        }
      })
    
    that.setData({
      type: app.globalData.type,
      startAddress: app.globalData.startAddress,
      endAddress: app.globalData.endAddress,
      time: app.globalData.time,
      name:app.globalData.userInfo.nickName,
      price: app.globalData.price,
    })
  },

  //获取姓名
  getName:function(e){
    console.log(e.detail.value)
      this.setData({
        name: e.detail.value
      })
    app.globalData.name = this.data.name
    //console.log(this.data.name)
  },

  //获取手机号
  getPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
    app.globalData.phone = e.detail.value
    //console.log(this.data.phone)
  },

  //获取备注
  getRemarks: function (e) {
    this.setData({
      remarks: e.detail.value
    })
    app.globalData.remarks = e.detail.value
    //console.log(this.data.remarks)
  },

  //选择优惠券
  chooseCoupon:function(e){
    wx.navigateTo({
      url: '/pages/coupon/coupon?way=2'
    })
  },

  //提交订单
  submit:function(e){
    app.globalData.name = this.data.name  //没有填写姓名的话，传入微信ID
    //订单集合插入记录
    order.add({            
      data: {
        type: app.globalData.type,
        startAddress: app.globalData.startAddress,
        endAddress: app.globalData.endAddress,
        remarks: app.globalData.remarks,
        time: app.globalData.time,
        name: app.globalData.name,
        phone: app.globalData.phone,
        price: app.globalData.price,
        coupon: app.globalData.coupon,
        status:0           //订单状态：0--待接单，1--服务中，2--待付款，3--已完成，4--已取消
      },
      success(res){
        console.log(res),
        app.globalData.orderID=res._id,
        app.globalData.status=0,
        wx.redirectTo({
          url: '/pages/orderSuccess/orderSuccess',
        })
      }
    }),
    //优惠券集合修改选中的优惠券状态
      coupons.doc(this.data.couponID).update({
        data: {
          isUse: true
        },
        success: function (re) {
          //console.log(re),
          app.globalData.couponID == true
        }
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
    //console.log(app.globalData)

    this.setData({
      coupon: app.globalData.coupon,
      couponID: app.globalData.couponID
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