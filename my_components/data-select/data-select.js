// my_components/data-select.js
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
    onTap() {
      this.triggerEvent('myValueClick', {
        item: this.data.item
      })
    },
 
  }
})
