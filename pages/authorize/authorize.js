//index.js
//获取应用实例
const app = getApp()
const Bmob = require('../../utils/bmob.js')
Page({
  data: {
    remind: '加载中',
    angle: 0,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  linkToIndex:function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  onReady:function(){
    var that = this;
    setTimeout(function () {
      that.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function (res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) { angle = 14; }
      else if (angle < -14) { angle = -14; }
      if (that.data.angle !== angle) {
        that.setData({
          angle: angle
        });
      }
    });
  },
  onLoad: function () {
    var that = this
    var value = wx.getStorageSync('openid')
    if (value) {
      that.setData({
        userInfo: { avatarUrl: wx.getStorageSync('avatarUrl')},
        hasUserInfo: true
      })
    }
  },
  
})
