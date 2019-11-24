## 蓝牙连接步骤
1. 在app.js导入bletools.js工具文件，并在onLunch中调用蓝牙初始化方法：initBle()

 ```
  var bletools = require('./utils/bletools.js');
  var constants = require('./utils/constants.js');

  onLaunch: function () {
    // 第一步 initBle() 初始化蓝牙模块,判断版本是否支持，如果版本不支持，会进行提示。
    bletools.initBle(this);
  }

 ```
2. 在search界面进行蓝牙搜索，点击蓝牙进行连接