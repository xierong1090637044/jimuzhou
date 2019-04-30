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
      { name: '入库记录', icon: 'document', url: '/pages/record/order_history/order_history?type=1', color: "#2ca879" },
      { name: '出库记录', icon: 'document', url: '/pages/record/order_history/order_history?type=-1', color: "#f30" },
      { name: '客户退货记录', icon: 'document', url: '/pages/record/order_history/order_history?type=2', color: "#b3b242" },
      { name: '盘点记录', icon: 'document', url: '/pages/record/order_history/order_history?type=3', color: "#b3424a" },
      { name: '货损记录', icon: 'document', url: '/pages/record/bad_history/bad_history', color: "#426ab3" },
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
    let recodeRights = wx.getStorageSync("rights").recodecurrent;
    if (recodeRights != null)//此时可以判断他是老板还是员工了
    {
      let staff_options = [];
      for (let n of recodeRights) {
        staff_options.push(that.data.options[n - 1]);
      }
      that.setData({ optionsLists: staff_options });

      const query = Bmob.Query("staffs");
      query.get(wx.getStorageSync("staff")).then(res => {
        wx.setStorageSync('rights', res.rights);
      }).catch(err => {
        console.log(err)
      })
    }else{
      that.setData({
        optionsLists: [
          { name: '入库记录', icon: 'document', url: '/pages/record/order_history/order_history?type=1', color: "#2ca879" },
          { name: '出库记录', icon: 'document', url: '/pages/record/order_history/order_history?type=-1', color: "#f30" },
          { name: '客户退货记录', icon: 'document', url: '/pages/record/order_history/order_history?type=2', color: "#b3b242" },
          { name: '盘点记录', icon: 'document', url: '/pages/record/order_history/order_history?type=3', color: "#b3424a" },
          { name: '货损记录', icon: 'document', url: '/pages/record/bad_history/bad_history', color: "#426ab3" },
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