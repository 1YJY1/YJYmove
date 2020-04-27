// pages/switchCity/switchCity.js
var city = require('/../../wxSDK/city.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchLetter: [],
    showLetter: "",
    winHeight: 0,
    // tHeight: 0,
    // bHeight: 0,
    cityList: [],
    isShowLetter: false,
    scrollTop: 0, //置顶高度
    scrollTopId: '', //置顶id
    myCity: "",
    hotcityList: [{
      cityCode: 110000,
      city: '北京市'
    }, {
      cityCode: 310000,
      city: '上海市'
    }, {
      cityCode: 440100,
      city: '广州市'
    }, {
      cityCode: 440300,
      city: '深圳市'
    }, {
      cityCode: 330100,
      city: '杭州市'
    }, {
      cityCode: 320100,
      city: '南京市'
    }, {
      cityCode: 420100,
      city: '武汉市'
    }, {
      cityCode: 410100,
      city: '郑州市'
    }, {
      cityCode: 120000,
      city: '天津市'
    }, {
      cityCode: 610100,
      city: '西安市'
    }, {
      cityCode: 510100,
      city: '成都市'
    }, {
      cityCode: 500000,
      city: '重庆市'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var searchLetter = city.searchLetter;
    var cityList = city.cityList();
    var sysInfo = wx.getSystemInfoSync();
    var winHeight = sysInfo.windowHeight;
    var itemH = winHeight / searchLetter.length;
    var tempObj = [];
    for (var i = 0; i < searchLetter.length; i++) {
      var temp = {};
      temp.name = searchLetter[i];
      temp.tHeight = i * itemH;
      temp.bHeight = (i + 1) * itemH;
      tempObj.push(temp)
    }
    this.setData({
      winHeight: winHeight,
      itemH: itemH,
      searchLetter: tempObj,
      cityList: cityList,

      myCity: app.globalData.city //当前城市
    })
  },

  //点击城市大写首字母
  clickLetter: function(e) {
    console.log(e.currentTarget.dataset.letter)
    var showLetter = e.currentTarget.dataset.letter;
    this.setData({
      showLetter: showLetter,
      isShowLetter: true,
      scrollTopId: showLetter,
    })
    var that = this;
    setTimeout(function() {
      that.setData({
        isShowLetter: false
      })
    }, 1000)
  },

  //选择城市
  bindCity: function(e) {
    console.log(e.currentTarget)
    this.setData({
      myCity: e.currentTarget.dataset.city
    })

    app.globalData.city = e.currentTarget.dataset.city; 
    wx.navigateBack({
      delta: 1
    })
  },

  //选择热门城市
  bindHotCity: function(e) {
    console.log(e.currentTarget.dataset)
    this.setData({
      myCity: e.currentTarget.dataset.city
    })
    
    app.globalData.city = e.currentTarget.dataset.city;
    wx.navigateBack({
      delta: 1
    })
  },
  //点击热门城市回到顶部
  hotCity: function() {
    this.setData({
      scrollTop: 0,
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