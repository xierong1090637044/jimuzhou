const app = getApp();
const Bmob = require('../../../utils/bmob_new.js');
var that;
var input_money;
var custom_id;
var friendId;
const userId = wx.getStorageSync("masterid");
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    hidden: true,
    customs: [],
    isEmpty: false,
    spinShow: true,
  },

  //得到客户列表
  getcustom_list: function (id) {
    const query = Bmob.Query("customs");
    query.order("custom_type");
    query.equalTo("parent", "==", id);
    query.find().then(res => {
      if (res.length == 0) {
        that.setData({
          isEmpty: true,
          spinShow: false
        });
      } else {
        that.setData({
          customs: res,
          isEmpty: false,
          spinShow: false
        });
      }
    });
  },

  //搜索
  complete: function (e) {
    var name = e.detail.value;
    if (name == '') {
      that.getcustom_list(userId);
    } else {
      const query = Bmob.Query("customs");
      query.equalTo("custom_name", "==", name);
      query.equalTo("parent", "==", userId);
      query.order("custom_type");
      query.find().then(res => {
        if (res.length == 0) {
          that.setData({
            isEmpty: true,
            spinShow: false
          });
        } else {
          that.setData({
            customs: res,
            isEmpty: false,
            spinShow: false
          });
        }
      });
    }
  },

  //点击查看详情
  getdetail: function (e) {
    if (friendId == null) {
      var id = e.currentTarget.dataset.id;
      wx.showActionSheet({
        itemList: ['查看详情', '收款', "收款记录"],
        success(res) {
          console.log(res.tapIndex)
          if (res.tapIndex == 0) {
            wx.navigateTo({
              url: 'custom_add/custom_add?id=' + id,
            })
          } else if (res.tapIndex == 1) {
            custom_id = id;
            that.setData({ visible: true })
          } else if (res.tapIndex == 2) {
            wx.navigateTo({
              url: 'debt_history/debt_history?id=' + id,
            })
          }
        },
        fail(res) {
          console.log(res.errMsg)
        }
      })
    }

  },

  onLoad(options) {
    that = this;
    that.getcustom_list(userId);
  },

  onReady() {

  },

  onShow: function () {
    var is_add = wx.getStorageSync("is_add");
    if (is_add) {
      that.getcustom_list(wx.getStorageSync("masterid"));
      wx.removeStorageSync("is_add");
    }
  },

  goto_add: function () {
    wx.navigateTo({
      url: 'staff_add/staff_add',
    })
  },
});