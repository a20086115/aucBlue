/**
 *  match config 过滤蓝牙名称
 *  SCANTIME  扫描超时时间 单位ms 默认5秒
 */
module.exports = {
  // string config
  'NOT_BLE': '您的蓝牙未打开 请打开你的蓝牙后再进入该页面操作',
  'NOT_PERMISSION1': '您的系统版本过低 不支持蓝牙的使用',
  'NOT_PERMISSION2': '您的微信版本过低 不支持蓝牙的使用',
  'SCANING': '设备扫描中...',
  'SCANED': '已停止扫描',
  'ALARM_TITLE': '告警提示',
  // uuid config
  'SERUUID': '0000FFF0-0000-1000-8000-00805F9B34FB',
  'NOTIFYUUID': '0000FFF4-0000-1000-8000-00805F9B34FB',
  'WRITEUUID': '0000FFF6-0000-1000-8000-00805F9B34FB',
  'CONFIRMUUID': "0000FFF3-0000-1000-8000-00805F9B34FB", //2
  // var config
  'STATE_DISCONNECTED': 0,
  'STATE_SCANNING': 1,
  'STATE_SCANNED': 2,
  'STATE_CONNECTING': 3,
  'STATE_CONNECTED': 4,
  'STATE_CONNECTING_ERROR': 6,
  'STATE_NOTIFY_SUCCESS': 7,
  'STATE_NOTIFY_FAIL': 8,
  'STATE_CLOSE_BLE': 9,
  'STATE_NOTBLE_SYSTEM_VERSION': 10,
  'STATE_NOTBLE_WCHAT_VERSION': 11,
  // match config
  'CONDITION': 'TC',
  // scan connect config  unit:ms
  'CONNECTTIME': 5000,
  'SCANTIME': 5000,
}



