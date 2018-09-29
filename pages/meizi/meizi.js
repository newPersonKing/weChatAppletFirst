// pages/meizi/meizi.js

var Api = require('../../network/api.js');

Page({
  page : 1,
  /**
   * 页面的初始数据
   */
  data: {
    meizis: [],
    loadingHidden: false,
    singleImage: "",
    singleImageHidden: true,
    opacity: 0,
    opacityAnimation: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.animation=wx.createAnimation({
      duration:500,
      /**
       * linear 
       */
      timingFunction:"ease"
    }).opacity(1)
    this.fetchData(true)
  }, 

  onItemClick: function (event) {
    this.setData({
      singleImage: event.currentTarget.dataset.src,
      singleImageHidden: false
    })
  },

  onImageLoad: function (event) {
    this.setData({
      opacityAnimation: this.animation.step().export()
    })
  },

  onTouchMove: function (event) {
    // Empty
    // 用于屏蔽底层页面滚动
  },

  onSingleImageClick: function (event) {
    this.setData({
      singleImage: "",
      opacity: 0,
      singleImageHidden: true
    })
  },

  saveImage: function (event) {
    wx.showLoading({
      title: "正在下载图片",
      /**
       * 是否显示透明蒙层，防止触摸穿透，默认：false
       */
      mask:true
    })
    wx.downloadFile({
      url: this.data.singleImage,
      success:res=>{
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success:()=>{
            wx.showToast({
              title: "图片已保存到相册",
              icon: "none"
            })
          },
          fail: () => {
            wx.showToast({
              title: "图片保存失败",
              icon: "none"
            })
          }
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  onTabItemTap: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
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
    this.fetchData(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.fetchData(false)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
 
  fetchData: function (clear) {
    this.page=clear?1:++this.page
    Api.fetchData("福利", this.page,{
      success:res=>{
        var items = clear ? res.data.results :this.data.meizis.concat(res.data.results)
        this.setData({
          meizis: items,
          loadingHidden: items.length < Api.PAGE_SIZE
        })
      },
      complete:()=>{
        if(clear){
          setTimeout(()=>{
            wx.stopPullDownRefresh()
          })
        }
      }
    });
  }
})