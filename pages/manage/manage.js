// pages/index/index.js
const Bmob = require('../../utils/bmob_new.js');
let that;
let userid;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    optionsLists: [],
    options:[
      { name: '员工管理', icon: 'group', url: '/pages/second/staff/staff', color: "#b38c42" },
      { name: '产品管理', icon: 'label', url: '/pages/goods/goods', color: "#af42b3" },
      { name: '客户管理', icon: 'addressbook', url: '/pages/second/custom/custom', color: "#82b342" },
      { name: '供货商管理', icon: 'mine', url: '/pages/second/producer/producer', color: "#42b3af" },
      { name: '仓库管理', icon: 'homepage', url: '/pages/manage/add_warehouse/add_warehouse', color: "#b34742" },
      { name: '产品类别管理', icon: 'accessory', url: '/pages/manage/add_class/add_class', color: "#426ab3" },
    ]

  },

  /** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    that = this;
    userid = wx.getStorageSync("masterid");
  },

  /*** 生命周期函数--监听页面初次渲染完成*/
  onReady: function () {
  },

  /*** 生命周期函数--监听页面显示*/
  onShow: function () {
    let manageRights = wx.getStorageSync("rights").current;
    if (manageRights != null)//此时可以判断他是老板还是员工了
    {
      let staff_options = [];
      for (let n of manageRights) {
        staff_options.push(that.data.options[n - 1]);
      }
      that.setData({ optionsLists: staff_options })

      const query = Bmob.Query("staffs");
      query.get(wx.getStorageSync("staff")).then(res => {
        wx.setStorageSync('rights', res.rights);
      }).catch(err => {
        console.log(err)
      })
    } else {
      that.setData({
        optionsLists: [
          { name: '员工管理', icon: 'group', url: '/pages/second/staff/staff', color: "#b38c42" },
          { name: '产品管理', icon: 'label', url: '/pages/goods/goods', color: "#af42b3" },
          { name: '客户管理', icon: 'addressbook', url: '/pages/second/custom/custom', color: "#82b342" },
          { name: '供货商管理', icon: 'mine', url: '/pages/second/producer/producer', color: "#42b3af" },
          { name: '仓库管理', icon: 'homepage', url: '/pages/manage/add_warehouse/add_warehouse', color: "#b34742" },
          { name: '产品类别管理', icon: 'accessory', url: '/pages/manage/add_class/add_class', color: "#426ab3" },
        ],
      })
    }
  },

  /*** 生命周期函数--监听页面隐藏*/
  onHide: function () {
    that.setData({
      optionsLists: [],
    });
    
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

  },

  skip: function () {
    wx.navigateTo({
      url: '../mine/upgrade/upgrade',
    })
  },
})