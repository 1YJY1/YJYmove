//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    var that=this

    wx.login({
      success(res) {
        if (res.code) {
          wx.getSetting({
            success(res) {
              if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                wx.getUserInfo({
                  success: function (res) {
                    //console.log(res.userInfo)
                    that.globalData.userInfo = res.userInfo
                  }
                })
              }
            }
          })
          //console.log(res.code)
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
      this.globalData.startAddress ="请输入搬出地址",
      this.globalData.endAddress ="请输入搬入地址"
  },

  globalData:{
    openid:"",
    userInfo: {}, //微信获取用户信息
    type:"",
    startAddress:"",
    startAddLat:"",
    startAddLng: "",
    endAddress:"",
    endAddLat: "",
    endAddLng: "",
    distance:0,
    price:0,
    time:"",
    name:"",
    phone:"",
    coupon:0,
    remarks:"",
    status:0,
    orderID:"",
    couponID:"",
    city:"",
    driverPhone:"",
    driverName:""
  },

  

})
