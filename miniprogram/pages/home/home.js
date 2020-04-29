// pages/home/home.js
const app = getApp()

// 引入SDK核心类
var QQMapWX = require('/../../wxSDK/qqmap-wx-jssdk.min.js');

// 实例化API核心类
var moveMap = new QQMapWX({
  key: '44VBZ-7J6WP-UL6D5-VBZMC-HHIYS-ROB52' // 必填
});

var date = new Date();
//年
var Y = date.getFullYear();

var currentHours = date.getHours();
var currentMinute = date.getMinutes();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    typeName: [{
      name: "面包小搬"
    }, {
      name: "金杯中搬"
    }, {
      name: "货车大搬"
    }, {
      name: "精致搬家"
    }],
    cars: [{
      image: "/images/xiaoban.png"
    }, {
      image: "/images/zhongban.png"
    }, {
      image: "/images/daban.png"
    }, {
      image: "/images/jingzhi.png"
    }],


    multiArray: [['今天', '明天', '3-2', '3-3', '3-4', '3-5'], [0, 1, 2, 3, 4, 5, 6], [0, 10, 20]],
    multiIndex: [0, 0, 0],


    latitude: "",
    longitude: "",
    scale: 14,

    currentTab: 0,
    index: 0,
    startAdd: "请输入搬出地址",
    endAdd: "请输入搬入地址",
    currentAddress: "", //当前地址
    startlatitude: "",
    startlongitude: "",
    endlatitude: "",
    endlongitude: "",
    distance: 0,
    price: 99
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.getLocation({ //获取当前位置
      type: 'wgs84',
      success: function(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        that.onGetAddress()
      }
    })
  },

  //跳转到个人中心
  toMine: function() {
    wx.navigateTo({
      url: '/pages/mine/mine'
    })
  },

  //获得当前位置的文字描述
  onGetAddress: function() {
    moveMap.reverseGeocoder({
      location: {
        latitude: this.data.latitude,
        longitude: this.data.longitude
      },
      success: addressRes => {
        //console.log(addressRes.result)
        //获取用户当前所在城市
        app.globalData.city = addressRes.result.address_component.city

        const address = addressRes.result.formatted_addresses.recommend;
        this.setData({
          currentAddress: address
        })
      }
    });
    //console.log(this.data.currentAddress)
  },


  //移动选点
  viewChange: function(e) {
    var self = this;
    if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
      self.mapCtx.getCenterLocation({
        success: function(res) {
          //console.log(res)
          self.setData({
            latitude: res.latitude,
            longitude: res.longitude,
          })
          self.onGetAddress()
        }
      })
    }
  },

  //快速填入地址信息
  fillAdd: function(e) {
    if (this.data.startAdd == "请输入搬出地址") {
      this.setData({ //修改搬出地址信息
        startAdd: this.data.currentAddress,
        startlatitude: this.data.latitude,
        startlongitude: this.data.longitude
      })
      app.globalData.startAddress = this.data.currentAddress,
        app.globalData.startAddLat = this.data.latitude,
        app.globalData.startAddLng = this.data.longitude
    } else if (this.data.currentAddress != this.data.startAdd) {
      this.setData({ //修改搬入地址信息
        endAdd: this.data.currentAddress,
        endlatitude: this.data.latitude,
        endlongitude: this.data.longitude
      })
      app.globalData.endAddress = this.data.currentAddress,
        app.globalData.endAddLat = this.data.latitude,
        app.globalData.endAddLng = this.data.longitude
      this.distance();
    } else {
      wx.showToast({
        image: "/icons/warn.png",
        title: '请更改搬入地址',
      })
    }
  },

  //回到当前位置
  backCurrentPos: function(e) {
    this.mapCtx.moveToLocation()
    this.setData({
      scale: 14
    })
  },

  //起始地址距离
  distance: function() {
    var that = this;

    moveMap.direction({
      mode: "driving", //驾车
      from: {
        latitude: that.data.startlatitude,
        longitude: that.data.startlongitude
      },
      to: {
        latitude: that.data.endlatitude,
        longitude: that.data.endlongitude
      },
      success: function(res) { //成功后的回调
        var destinationDistance = res.result.routes[0].distance;
        var distanceKm = (destinationDistance / 1000);
        //console.log(distanceKm);
        that.setData({
          distance: Math.round(distanceKm) //取整，以免价格有小数
        })
        that.getPrice(that.data.index) //价格实时改变
        //console.log(that.data.distance);
      },
      fail: function(res) {
        //console.log(res);
      }
    })
  },

  //金额
  getPrice: function(index) {
    var beyDis = 0; //超出里程数
    if (this.data.distance > 10) {
      beyDis = this.data.distance - 10
    }
    if (index == 0) {
      this.setData({
        price: 99 + beyDis * 5
      })
    } else if (index == 1) {
      this.setData({
        price: 199 + beyDis * 10
      })
    } else if (index == 2) {
      this.setData({
        price: 399 + beyDis * 30
      })
    } else {
      this.setData({
        price: 599 + beyDis * 50
      })
    }
  },

  //点击选择车型
  clickType: function(e) {
    if (this.data.currentTab === e.target.dataset.current) {
      return;
    } else {
      this.setData({
        currentTab: e.currentTarget.dataset.current,
        index: e.currentTarget.dataset.current
      })
    }
    this.getPrice(this.data.index)
  },

  //滑动图片选择车型
  bindChange: function(e) {
    // console.log( e.detail)
    if (e.detail.source == 'touch') {
      this.setData({
        currentTab: e.detail.current,
        index: e.detail.current
      })
    }
    this.getPrice(this.data.index)
  },

  //点击图片跳转到对应的车型介绍页
  toDetail: function(e) {
    var cur = this.data.currentTab
    if (cur == 0) {
      wx.navigateTo({
        url: '/pages/typeDetail/xbDetail/xbDetail',
      })
    } else if (cur == 1) {
      wx.navigateTo({
        url: '/pages/typeDetail/zbDetail/zbDetail',
      })
    } else if (cur == 2) {
      wx.navigateTo({
        url: '/pages/typeDetail/dbDetail/dbDetail',
      })
    } else {
      wx.navigateTo({
        url: '/pages/typeDetail/jzDetail/jzDetail',
      })
    }
  },

  //跳转到地址搜索页
  fillStartAdd:function(e){
    wx.navigateTo({
      url: '/pages/searchAddress/searchAddress?add=1',  //用add来标记是搜索哪个地址
    })
  },

  fillEndAdd:function(e){
    wx.navigateTo({
      url: '/pages/searchAddress/searchAddress?add=2',
    })
  },

  //点击下一步按钮(不采用了))
  toFillInf: function(e) {
    //console.log(app.globalData.userInfo)
    if (!app.globalData.userInfo) {
      wx.showModal({
        title: '提示',
        content: '您还未登录',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/mine/mine',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else if (this.data.startAdd == "请输入搬出地址" || this.data.endAdd == "请输入搬入地址") {
      wx.showToast({
        title: "地址信息不全",
        image: "/icons/warn.png"
      })
    } else {
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      //console.log("当前时间戳为：" + timestamp);
      //获取当前时间作为预约时间
      var n = timestamp * 1000;
      var date = new Date(n);
      //年
      var Y = date.getFullYear();
      //月
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      //日
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      //时
      var h = date.getHours();      //为了保证获取订单列表时，按时间逆序展示
      if(h<10){
        h='0'+h
      }
      //分
      var m = date.getMinutes();

      var time = Y + "-" + M + "-" + D + " " + h + ":" + m;
      app.globalData.time=time;
      console.log("当前时间：" + time)
      
      
      app.globalData.type = this.data.typeName[this.data.index].name,
        app.globalData.startAddress = this.data.startAdd,
        app.globalData.endAddress = this.data.endAdd,
        app.globalData.distance = this.data.distance,
        app.globalData.price = this.data.price,
        wx.navigateTo({
          url: '/pages/fillInformation/fillInformation',
        })
    }
  },

  //预约时间部分
  pickerTap: function () {
    date = new Date();

    var monthDay = ['今天', '明天'];
    var hours = [];
    var minute = [];

    currentHours = date.getHours();
    currentMinute = date.getMinutes();

    // 月-日
    for (var i = 2; i <= 7; i++) {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + i);
      var md = (date1.getMonth() + 1) + "-" + date1.getDate();
      monthDay.push(md);
    }

    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };

    if (data.multiIndex[0] === 0) {
      if (data.multiIndex[1] === 0) {
        this.loadData(hours, minute);
      } else {
        this.loadMinute(hours, minute);
      }
    } else {
      this.loadHoursMinute(hours, minute);
    }

    data.multiArray[0] = monthDay;
    data.multiArray[1] = hours;
    data.multiArray[2] = minute;

    this.setData(data);
  },




  bindMultiPickerColumnChange: function (e) {
    date = new Date();

    var that = this;

    var monthDay = ['今天', '明天'];
    var hours = [];
    var minute = [];

    currentHours = date.getHours();
    currentMinute = date.getMinutes();

    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    // 把选择的对应值赋值给 multiIndex
    data.multiIndex[e.detail.column] = e.detail.value;

    // 然后再判断当前改变的是哪一列,如果是第1列改变
    if (e.detail.column === 0) {
      // 如果第一列滚动到第一行
      if (e.detail.value === 0) {

        that.loadData(hours, minute);

      } else {
        that.loadHoursMinute(hours, minute);
      }

      data.multiIndex[1] = 0;
      data.multiIndex[2] = 0;

      // 如果是第2列改变
    } else if (e.detail.column === 1) {

      // 如果第一列为今天
      if (data.multiIndex[0] === 0) {
        if (e.detail.value === 0) {
          that.loadData(hours, minute);
        } else {
          that.loadMinute(hours, minute);
        }
        // 第一列不为今天
      } else {
        that.loadHoursMinute(hours, minute);
      }
      data.multiIndex[2] = 0;

      // 如果是第3列改变
    } else {
      // 如果第一列为'今天'
      if (data.multiIndex[0] === 0) {

        // 如果第一列为 '今天'并且第二列为当前时间
        if (data.multiIndex[1] === 0) {
          that.loadData(hours, minute);
        } else {
          that.loadMinute(hours, minute);
        }
      } else {
        that.loadHoursMinute(hours, minute);
      }
    }
    data.multiArray[1] = hours;
    data.multiArray[2] = minute;
    this.setData(data);
  },

  loadData: function (hours, minute) {

    var minuteIndex;
    if (currentMinute > 0 && currentMinute <= 10) {
      minuteIndex = 10;
    } else if (currentMinute > 10 && currentMinute <= 20) {
      minuteIndex = 20;
    } else if (currentMinute > 20 && currentMinute <= 30) {
      minuteIndex = 30;
    } else if (currentMinute > 30 && currentMinute <= 40) {
      minuteIndex = 40;
    } else if (currentMinute > 40 && currentMinute <= 50) {
      minuteIndex = 50;
    } else {
      minuteIndex = 60;
    }

    if (minuteIndex == 60) {
      // 时
      for (var i = currentHours + 1; i < 24; i++) {
        hours.push(i);
      }
      // 分
      for (var i = 0; i < 60; i += 10) {
        minute.push(i);
      }
    } else {
      // 时
      for (var i = currentHours; i < 24; i++) {
        hours.push(i);
      }
      // 分
      for (var i = minuteIndex; i < 60; i += 10) {
        minute.push(i);
      }
    }
  },

  loadHoursMinute: function (hours, minute) {
    // 时
    for (var i = 0; i < 24; i++) {
      hours.push(i);
    }
    // 分
    for (var i = 0; i < 60; i += 10) {
      minute.push(i);
    }
  },

  loadMinute: function (hours, minute) {
    var minuteIndex;
    if (currentMinute > 0 && currentMinute <= 10) {
      minuteIndex = 10;
    } else if (currentMinute > 10 && currentMinute <= 20) {
      minuteIndex = 20;
    } else if (currentMinute > 20 && currentMinute <= 30) {
      minuteIndex = 30;
    } else if (currentMinute > 30 && currentMinute <= 40) {
      minuteIndex = 40;
    } else if (currentMinute > 40 && currentMinute <= 50) {
      minuteIndex = 50;
    } else {
      minuteIndex = 60;
    }

    if (minuteIndex == 60) {
      // 时
      for (var i = currentHours + 1; i < 24; i++) {
        hours.push(i);
      }
    } else {
      // 时
      for (var i = currentHours; i < 24; i++) {
        hours.push(i);
      }
    }
    // 分
    for (var i = 0; i < 60; i += 10) {
      minute.push(i);
    }
  },

  bindStartMultiPickerChange: function (e) {

    var that = this;
    if (!app.globalData.userInfo) {  //判断是否登录
      wx.showModal({
        title: '提示',
        content: '您还未登录',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/mine/mine',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else if (that.data.startAdd == "请输入搬出地址" || that.data.endAdd == "请输入搬入地址") {
      wx.showToast({
        title: "地址信息不全",
        image: "/icons/warn.png"
      })
    }else{
      var monthDay = that.data.multiArray[0][e.detail.value[0]];
      var hours = that.data.multiArray[1][e.detail.value[1]];
      if(hours<'10'){
        hours='0'+hours
      }
      var minute = that.data.multiArray[2][e.detail.value[2]];
      if (minute < '10') {
        minute = '0' + minute
      }

      if (monthDay === "今天") {
        var month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        monthDay = month + "-" + day;
      } else if (monthDay === "明天") {
        var date1 = new Date(date);
        date1.setDate(date.getDate() + 1);
        monthDay = ((date1.getMonth() + 1 < 10 ? '0' + (date1.getMonth() + 1) : date1.getMonth() + 1)) + "-" + (date1.getDate() < 10 ? '0' + date1.getDate() : date1.getDate());
      } else {
        var month = monthDay.split("-")[0]; // 返回月
        if(month<10){
          month='0'+month
        }
    
        var day = monthDay.split("-")[1]; // 返回日
        if(day<10){
          day='0'+day
        }
        monthDay = month + "-" + day;
      }
      

      var startDate = Y+"-"+monthDay + " " + hours + ":" + minute;

    console.log(startDate)

      app.globalData.time = startDate;
      app.globalData.type = this.data.typeName[this.data.index].name,
        app.globalData.startAddress = this.data.startAdd,
        app.globalData.endAddress = this.data.endAdd,
        app.globalData.distance = this.data.distance,
        app.globalData.price = this.data.price,
        wx.navigateTo({
          url: '/pages/fillInformation/fillInformation',
        })
     }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.mapCtx = wx.createMapContext('myMap')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({       //修改起始地址信息
      startAdd: app.globalData.startAddress,
      startlatitude: app.globalData.startAddLat,
      startlongitude: app.globalData.startAddLng,
      endAdd: app.globalData.endAddress,
      endlatitude: app.globalData.endAddLat,
      endlongitude: app.globalData.endAddLng
    })

    this.distance();
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
    return{
      title: "邀请您一起使用YJY搬家"
    }
  }
})