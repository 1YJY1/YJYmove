// pages/dirver/dirver.js
const app = getApp()
const db = wx.cloud.database();
const drivers = db.collection('drivers')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    driverName:"",
    firimg: "/icons/orders2.png",
    secimg: "/icons/person.png",
    secco: "#1088A2",
    firco: "#bfbfbf"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    drivers.where({
      driverPhone:app.globalData.driverPhone
    }).get({
      success:function(res){
        //console.log(res.data[0])
        that.setData({
          driverName:app.globalData.driverName,
          finishOrders:res.data[0].finishOrders,
          earnMoney:res.data[0].earnMoney
        })
      }
    })
  },

  //司机订单
  toOrderList:function(e){
    wx.navigateTo({
      url: '/pages/orderList/orderList?way=d',
    })
  },

  //修改密码
  changePws:function(e){
    wx.showToast({
      title: '该功能暂未开发',
      image: "/icons/warn.png"
    })
  },

  //退出登录
  toRoles:function(e){
    app.globalData.driverName="",
    app.globalData.driverPhone ="",
    wx.redirectTo({
      url: '/pages/roles/roles',
    })
  },
  //点击接单
  first_select: function (e) {
    wx.redirectTo({
      url: '/pages/orderTake/orderTake',
    })
  },
  //点击我的
  second_select: function (e) {
    
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