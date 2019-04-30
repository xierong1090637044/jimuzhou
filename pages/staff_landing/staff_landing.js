const Bmob = require('../../utils/bmob_new.js');
let that;
Page({

  /*** 页面的初始数据*/
  data: {
    
  },


  //登陆提交
  formSubmit(e) {
    console.log(e)
    let phone = e.detail.value.phone;
    let sms_code = e.detail.value.sms_code;

    if (e.detail.value.phone.length < 11) {
      wx.showToast({ title: '手机格式错误', icon: "none" })
    } else if (e.detail.value.sms_code < 1) {
      wx.showToast({ title: '密码未填写', icon: "none" })
    } else {
      wx.showLoading({title: '登录中...',})
      const query = Bmob.Query("staffs");
      query.equalTo("mobilePhoneNumber", "==", phone);
      query.equalTo("password", "==", sms_code);
      query.find().then(res => {
        wx.setStorageSync('now_user', res[0]);
        wx.setStorageSync('username', res[0].username);
        wx.setStorageSync('userid', res[0].objectId);
        wx.setStorageSync('avatarUrl', res[0].avatarUrl)
        wx.setStorageSync('openid', res[0].password); 
        wx.setStorageSync('mobilePhoneNumber', res[0].mobilePhoneNumber);
        wx.setStorageSync('password', res[0].password);
        wx.setStorageSync('masterid', res[0].masterId.objectId);
        wx.setStorageSync('country', res[0].address);
        wx.setStorageSync('rights', res[0].rights)

        setTimeout(function () { wx.switchTab({ url: '/pages/index/index', }) }, 500)
        wx.hideLoading();
      });
    }

  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    that = this;
  },

  /*** 生命周期函数--监听页面初次渲染完成*/
  onReady: function () {

  },

  /*** 生命周期函数--监听页面显示*/
  onShow: function () {

  },

  /*** 生命周期函数--监听页面隐藏*/
  onHide: function () {

  },

  /*** 生命周期函数--监听页面卸载*/
  onUnload: function () {

  },

  /*** 页面相关事件处理函数--监听用户下拉动作*/
  onPullDownRefresh: function () {

  },

  /*** 页面上拉触底事件的处理函数*/
  onReachBottom: function () {

  },

  /*** 用户点击右上角分享*/
  onShareAppMessage: function () {

  }
})