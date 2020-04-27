// pages/searchAddress/searchAddress.js
const app = getApp()

// 引入SDK核心类
var QQMapWX = require('/../../wxSDK/qqmap-wx-jssdk.min.js');

// 实例化API核心类
var moveMap = new QQMapWX({
  key: '44VBZ-7J6WP-UL6D5-VBZMC-HHIYS-ROB52' // 必填
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: "",
    searchresult: [],
    scrollheight: 0,
    city: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      add: options.add  //判断是搜索什么地址，1-搬出地址，2-搬入地址
    })
    //console.log(this.data.add)
    this.onGetSuggestion();
    this.getscrollheight();
  },

  //获取搜索结果
  onGetSuggestion: function () {
    var that=this
    // 调用接口
    moveMap.getSuggestion({
      region: that.data.city,
      keyword: that.data.keyword,
      region_fix: 1,
      success: res => {
        console.log(res.data);
        that.setData({
          searchresult: res.data
        })
      },
      fail: function (res) {
        // console.log(res);
      },
      complete: function (res) {
        // console.log(res);
      }
    });
  },

  //取消
  toindex: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  //更换城市
  toswitchcity: function () {
    wx.navigateTo({
      url: '/pages/switchCity/switchCity'
    })
  },

  //实时取到搜索框的值传给keyword
  search: function (e) {
    // console.log(e.detail.value)
    const keyword = e.detail.value;
    this.setData({
      keyword
    });
    this.onGetSuggestion();
  },

  //获取滑动区域的高度
  getscrollheight: function () {
    wx.getSystemInfo({
      success: res => {
        // console.log(res.windowHeight) // 获取可使用窗口高度
        const windowHeight = (res.windowHeight * (750 / res.windowWidth)); //将高度乘以换算后的该设备的rpx与px的比例
        const scrollheight = windowHeight - 106
        this.setData({
          scrollheight
        })
      }
    })
  },

  //选中地址
  getAddress:function(e){
    var address = e.currentTarget.dataset.oneaddress
    console.log(address)
    if(this.data.add==1){   //修改搬出地址信息
      app.globalData.startAddress = address.title,
        app.globalData.startAddLat=address.location.lat,
        app.globalData.startAddLng = address.location.lng
    }else{
      app.globalData.endAddress = address.title,
        app.globalData.endAddLat = address.location.lat,
        app.globalData.endAddLng = address.location.lng
    }

    wx.navigateBack({      //回到主页
      delta: 1
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
    console.log(app.globalData.city)
    this.setData({
      city: app.globalData.city
    })
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