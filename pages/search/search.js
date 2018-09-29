// pages/search/search.js
var Api = require('../../network/api.js')
var dateFormat = require('../../utils/dateformat.js')

Page({

  keyword: "",
  page: 1,

  /**
   * 页面的初始数据
   */
  data: {
    results: [],
    loadingHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  },
  onSearch: function (event){
    this.keyword = event.detail.value
    if(this.keyword!=""){
      wx.showToast({
        title: '搜索中',
        mask : "true"
      })
    }
    this.doSearch(true)
  },
  doSearch: function(clear) {
    if (this.keyword == "") {
      if (this.data.results.length > 0) {
        this.setData({
          results: [],
          loadingHidden: true
        })
      }
      wx.showToast({
        title: '关键词不能为空',
        icon:"none"
      })
    }
    wx.stopPullDownRefresh()
    return

    this.page=clear? 1 : ++this.page

    Api.search(this.keyword, this.page, {
      success: res => {
        res.data.results = res.data.results.map(result => {
          result.publishedAt = dateFormat(new Date(result.publishedAt), "yyyy-mm-dd HH:MM")
          return result
        })
        var items = clear ? res.data.results : this.data.results.concat(res.data.results)
        if (items.length == 0) {
          wx.showToast({
            title: "啥都没有",
            icon: "none"
          })
        }
        this.setData({
          results: items,
          loadingHidden: items.length < Api.PAGE_SIZE
        })
      },
      complete: () => {
        if (clear) {
          setTimeout(() => {
            wx.hideLoading()
            wx.stopPullDownRefresh()
          }, 1000)
        }
      }
    })
  }
})