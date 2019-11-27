// my_components/data_input/data_input.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: { // 
      type: String,
      value: '数值'
    },
    title: { // 
      type: String,
      value: '标题'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap: function () {
      console.log("onTaponTaponTap")
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.setData({
        show: true
      })
      // this.triggerEvent('myevent', myEventDetail, myEventOption)
    },
    onConfirm(){

    },
    onClose(){

    },
    onCancel(){

    }
  }
})
