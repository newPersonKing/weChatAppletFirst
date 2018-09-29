//自定义控件
Component({
    properties: {

    },
    data : {

    },
    methods : {
        onClick : function () {
            wx.navigateTo({
              url: '../../pages/search/search'
            })
        }        
    }
})