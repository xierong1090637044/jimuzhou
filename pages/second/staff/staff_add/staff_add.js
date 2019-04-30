// pages/goods/goods-add/goods-add.js
var { $Message } = require('../../../../component/base/index');
const Bmob = require('../../../../utils/bmob_new.js');
var that;
let friendId;
let rights={};
Page({

  /*** 页面的初始数*/
  data: {
    manage: [
    {id: 1,name: '员工管理'}, 
    {id: 2,name: '产品管理'}, 
    {id: 3,name: '客户管理'}, 
    {id: 4,name: '供货商管理'}, 
    {id: 5,name: '仓库管理'}, 
    {id: 6,name: '产品类别管理'}
    ],
    recode:[
      { id: 1, name: '入库记录' },
      { id: 2, name: '出库记录' },
      { id: 3, name: '客户退货记录' },
      { id: 4, name: '盘点记录' },
      { id: 5, name: '货损记录' },
    ],
    current: [],
    recodecurrent: [],
  },

  //管理页面的权限
  handlemanageChange({ detail = {} }) {
    const index = this.data.current.indexOf(detail.value);
    index === -1 ? this.data.current.push(detail.value) : this.data.current.splice(index, 1);
    this.setData({
      current: this.data.current
    });
    rights.current = this.data.current;
  },

  //记录页面的权限
  handlerecodeChange({ detail = {} }) {
    const index = this.data.recodecurrent.indexOf(detail.value);
    index === -1 ? this.data.recodecurrent.push(detail.value) : this.data.recodecurrent.splice(index, 1);
    this.setData({
      recodecurrent: this.data.recodecurrent
    });
    rights.recodecurrent = this.data.recodecurrent;
  },

  handleAddstaffs: function (e) {
    var goodsForm = e.detail.value

    console.log(goodsForm)
    //先进行表单非空验证
    if (goodsForm.staff_type == null) {
      $Message({
        content: '请输入员工编号',
        type: 'warning',
        duration: 5
      });
    } else if (goodsForm.staff_name == null) {
      $Message({
        content: '请输入员工姓名',
        type: 'warning',
        duration: 5
      });
    } else if (goodsForm.staff_phone == null) {
      $Message({
        content: '请输入员工手机账号',
        type: 'warning',
        duration: 5
      });
    } else {

      const userid = wx.getStorageSync("masterid");
      const pointer = Bmob.Pointer('_User');
      let poiID = pointer.set(userid); 
      
      const query = Bmob.Query('staffs');
      query.set("staff_type", that.daxie(goodsForm.staff_type));
      query.set("username", goodsForm.staff_name);
      query.set("nickName", goodsForm.staff_name);
      query.set("password", goodsForm.staff_phone);
      query.set("mobilePhoneNumber", goodsForm.staff_phone);
      query.set("rights", rights);
      query.set("address", (goodsForm.staff_address == null) ? '' : goodsForm.staff_address);
      query.set("avatarUrl", "http://bmob-cdn-23134.b0.upaiyun.com/2019/04/29/4705b31340bfff8080c068f52fd17e2c.png");
      query.set("masterId", poiID);
      (that.data.staff != null) ? query.set("id", that.data.staff.objectId) : null;
      query.save().then(res => {
        wx.setStorageSync("is_add", true);
        if (that.data.staff != null) {
          wx.showToast({
            title: '修改成功',
          })
        } else {
          wx.showToast({
            title: '添加成功',
          })
          that.setData({ staff: null })
        }
      }).catch(err => {
        console.log(err)
        if (err.code == 202 || err.code == 301 || err.code == 209) {
          $Message({
            content: err.error,
            type: 'warning',
            duration: 5
          });
        }
      })

    }
  },

  //删除这条记录
  _delete: function () {
    wx.showModal({
      title: '提示',
      content: '是否删除此客户',
      success(res) {
        if (res.confirm) {
          const query = Bmob.Query('staffs');
          query.destroy(that.data.staff.objectId).then(res => {
            console.log(res)
            wx.showToast({
              title: '删除成功',
              duration: 1000,
              success: function () {
                wx.navigateBack();
                wx.setStorageSync("is_add", true);
              }
            })
          }).catch(err => {
            console.log(err)
          })
        }
      }
    })
  },

  daxie: function (value) {
    var value = value.toString();
    return value.toUpperCase()
  },

  //联系他点击
  make_phone: function () {
    wx.makePhoneCall({
      phoneNumber: that.data.staff.staff_phone
    })
  },

  //查看来往记录点击
  getmoney_detail: function () {
    wx.navigateTo({
      url: '../../../order_history/order_history?staff_id=' + that.data.staff.objectId,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var id = options.id;
    rights.current = [];
    rights.recodecurrent = [];
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