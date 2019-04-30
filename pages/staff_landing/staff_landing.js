const Bmob_new = require('../../utils/bmob_new.js');
const Bmob = require('../../utils/bmob.js')
let that;
let phone_number='';
let password='';
Page({

  /*** 页面的初始数据*/
  data: {
    
  },

  get_InputPhone:function(e)
  {
    phone_number = e.detail.value;
  },

  get_PassWord:function(e)
  {
    password = e.detail.value;
  },

  getUserInfo: function (e) {
    //console.log(e)
    //console.log(phone_number,password)
    if (phone_number.length < 11) {
      wx.showToast({ title: '手机格式错误', icon: "none" })
    } else if (password.length < 1) {
      wx.showToast({ title: '密码未填写', icon: "none" })
    } else {
      wx.showLoading({ title: '登录中...', })
      const query = Bmob_new.Query("staffs");
      query.equalTo("mobilePhoneNumber", "==", phone_number);
      query.equalTo("password", "==", password);
      query.find().then(res => {
        console.log(res)
        //wx.hideLoading();
        let masterid = res[0].masterId.objectId;
        let rights = res[0].rights;
        let staffid = res[0].objectId;

        if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
          wx.showToast({
            title: '您取消了授权',
            icon: 'none'
          })
        } else {
          try {
            var value = wx.getStorageSync('openid')
            if (value) {
              console.log("已登录")
              wx.showToast({
                title: '已登录',
                icon: 'none'
              })
              that.setData({
                hasUserInfo: true
              })
            } else {
              wx.login({
                success: function (res) {
                  if (res.code) {
                    Bmob.User.requestOpenId(res.code, {
                      success: function (userData) {
                        wx.getUserInfo({
                          success: function (result) {
                            var userInfo = result.userInfo
                            var nickName = userInfo.nickName
                            var avatarUrl = userInfo.avatarUrl
                            var sex = userInfo.gender
                            Bmob.User.logIn(nickName, userData.openid, {
                              success: function (user) {
                                try {
                                  console.log("登录成功");
                                  wx.showToast({
                                    title: '授权成功',
                                    icon: 'none'
                                  })
                                  that.setData({
                                    userInfo: user,
                                    hasUserInfo: true
                                  })
                                  wx.setStorageSync('openid', user.get('userData').openid)
                                  wx.setStorageSync('userid', user.id)
                                  wx.setStorageSync('masterid', (user.get("masterId") == null) ? user.id : user.get("masterId").id);//判断是老板还是员工
                                  wx.setStorageSync('staff', (user.get("staffId") == null) ? user.id : user.get("staffId").id)
                                  wx.setStorageSync('nickName', user.get("nickName"))
                                  wx.setStorageSync('username', user.get("username"))
                                  wx.setStorageSync('sex', user.get("sex"))
                                  wx.setStorageSync('avatarUrl', user.get("avatarUrl"))
                                  wx.setStorageSync('country', userInfo.country)
                                  wx.setStorageSync('province', userInfo.province)
                                  wx.setStorageSync('city', userInfo.city)
                                  wx.setStorageSync('rights', rights)

                                  setTimeout(function () { wx.switchTab({ url: '/pages/index/index', }) }, 500)

                                } catch (e) {
                                  console.log("登录失败")
                                  wx.showToast({
                                    title: '授权失败',
                                    icon: 'none'
                                  })
                                }
                              },
                              error: function (user, error) {
                                if (error.code == '101') {
                                  var User = Bmob.Object.extend("_User");
                                  var query = new Bmob.Query(User);
                                  query.equalTo("openid", userData.openid);
                                  query.first({
                                    success: function (object) {
                                      if (object == null) {

                                        var Staff = Bmob.Object.extend("staffs");
                                        var staff = new Staff();
                                        staff.id = staffid;

                                        var Master = Bmob.Object.extend("_User");
                                        var master = new Master();
                                        master.id = masterid;

                                        var user = new Bmob.User();//开始注册用户
                                        user.set('username', nickName);
                                        user.set('password', userData.openid);
                                        user.set('openid', userData.openid);
                                        user.set("nickName", nickName);
                                        user.set("avatarUrl", avatarUrl);
                                        user.set("userData", userData);
                                        user.set('sex', sex);
                                        user.set("masterId", master);
                                        user.set("staffId", staff);
                                        user.set("rights", rights);
                                        user.set("mobilePhoneNumber", phone_number);
                                        user.signUp(null, {
                                          success: function (result) {
                                            try {//将返回的3rd_session存储到缓存中
                                              console.log('注册成功');
                                              wx.showToast({
                                                title: '授权成功',
                                                icon: 'none'
                                              })
                                              that.setData({
                                                userInfo: user,
                                                hasUserInfo: true
                                              })
                                              //console.log(user.get("masterId"), user.get("masterId").objectId,user.id)
                                              wx.setStorageSync('openid', user.get('userData').openid)
                                              wx.setStorageSync('userid', user.id)
                                              wx.setStorageSync('masterid', (user.get("masterId") == null) ? user.id : user.get("masterId").id)
                                              wx.setStorageSync('staff', (user.get("staffId") == null) ? user.id : user.get("staffId").id)
                                              wx.setStorageSync('nickName', user.get("nickName"))
                                              wx.setStorageSync('username', user.get("username"))
                                              wx.setStorageSync('sex', user.get("sex"))
                                              wx.setStorageSync('avatarUrl', user.get("avatarUrl"))
                                              wx.setStorageSync('country', userInfo.country)
                                              wx.setStorageSync('province', userInfo.province)
                                              wx.setStorageSync('city', userInfo.city)
                                              wx.setStorageSync('rights', rights)

                                              setTimeout(function () { wx.switchTab({ url: '/pages/index/index', }) }, 500)
                                            } catch (e) {
                                              console.log("注册失败")
                                              wx.showToast({
                                                title: '授权失败',
                                                icon: 'none'
                                              })
                                            }
                                          },
                                          error: function (userData, error) {
                                            if (error.code == '202') {
                                              wx.getUserInfo({
                                                success: res => {
                                                  console.log("已登录")
                                                  wx.showToast({
                                                    title: '已登录',
                                                    icon: 'none'
                                                  })
                                                  var query = new Bmob.Query(Bmob.User);
                                                  console.log(userData)
                                                  query.equalTo('password', userData.get('userData').openid);
                                                  query.find({
                                                    success: function (user) {
                                                      console.log(user)
                                                    }
                                                  });
                                                  wx.setStorageSync('openid', userData.get('userData').openid)
                                                  wx.setStorageSync('masterid', (user.get("masterId") == null) ? user.id : user.get("masterId").id)
                                                  wx.setStorageSync('staff', (user.get("staffId") == null) ? user.id : user.get("staffId").id)
                                                  wx.setStorageSync('userid', userData.id)
                                                  wx.setStorageSync('nickName', userData.get("nickName"))
                                                  wx.setStorageSync('username', userData.get("username"))
                                                  wx.setStorageSync('sex', userData.get("sex"))
                                                  wx.setStorageSync('avatarUrl', userData.get("avatarUrl"))
                                                  wx.setStorageSync('country', res.userInfo.country)
                                                  wx.setStorageSync('province', res.userInfo.province)
                                                  wx.setStorageSync('city', res.userInfo.city)
                                                  that.setData({
                                                    userInfo: res.userInfo,
                                                    hasUserInfo: true
                                                  })
                                                  setTimeout(function () { wx.switchTab({ url: '/pages/index/index', }) }, 500)
                                                }
                                              })
                                            }

                                          }
                                        });
                                      } else {
                                        var user = Bmob.User.logIn(object.get("username"), userData.openid, {
                                          success: function (user) {
                                            user.set("username", nickName);
                                            user.set("nickName", nickName);
                                            user.save(null, {
                                              success: function (user) {
                                                var query = new Bmob.Query(Bmob.User);
                                                query.get(user.objectId, {
                                                  success: function (userAgain) {
                                                    userAgain.set("username", nickName);
                                                    userAgain.save(null, {
                                                      error: function (userAgain, error) {
                                                        that.setData({
                                                          userInfo: user,
                                                          hasUserInfo: true
                                                        })
                                                        wx.setStorageSync('openid', user.get('userData').openid)
                                                        wx.setStorageSync('userid', user.id)
                                                        wx.setStorageSync('nickName', user.get("nickName"))
                                                        wx.setStorageSync('username', user.get("username"))
                                                        wx.setStorageSync('masterid', (user.get("masterId") == null) ? user.id : user.get("masterId").id)
                                                        wx.setStorageSync('staff', (user.get("staffId") == null) ? user.id : user.get("staffId").id)
                                                        wx.setStorageSync('sex', user.get("sex"))
                                                        wx.setStorageSync('avatarUrl', user.get("avatarUrl"))
                                                        wx.setStorageSync('country', userInfo.country)
                                                        wx.setStorageSync('province', userInfo.province)
                                                        wx.setStorageSync('city', userInfo.city)
                                                        setTimeout(function () { wx.switchTab({ url: '/pages/index/index', }) }, 500)
                                                      }
                                                    });
                                                  }
                                                });
                                              }
                                            });
                                          }
                                        });
                                      }
                                    },
                                    error: function (error) {
                                      console.log("查询失败: " + error.code + " " + error.message);
                                    }
                                  });
                                }
                              }
                            });
                          }
                        })
                      },
                      error: function (error) {
                        console.log("Error: " + error.code + " " + error.message);
                      }
                    });
                  } else {
                    console.log('获取用户登录态失败！' + res.errMsg)
                  }
                }
              });
            }
          } catch (e) {
            console.log("登录失败")
          }
        }
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