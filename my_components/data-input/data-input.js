// my_components/data_input/data_input.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: { 
    onTap: function () {
      console.log("onTaponTaponTap")
      if(this.data.item.type == "input"){
        var myEventDetail = {
          item: this.data.item
        } // detail对象，提供给事件监听函数
        var myEventOption = {} // 触发事件的选项
        this.triggerEvent('myValueClick', myEventDetail, myEventOption)
      }
    },
 
  }
})
