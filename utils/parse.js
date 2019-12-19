var aucConstants = require('./aucConstants.js');
var parse = function (allFrame, sendFrame){
  //
  // 80 00 03 00 41 00 1c 15 c6 55
  console.log("parse:", allFrame)
  var result = true;
  var data = {};
  if (allFrame.length > 1) {
    //报文校验，取有效报文，写操作报文长度6个字固定值，读操作 第三个字节代表字节长度
    //第二个字节是操作码，0x03是读 0x06是写
    var afn = allFrame[1];
    if (afn == 0x03) {//读操作
      if (allFrame.length > 3) {
        var len = parseInt(allFrame[2], 16);
        // 应返回的数据项长度 不等于allFrame实际长度（存在丢帧的问题）
        if (len != allFrame.length - 5) {
          result = false;
        }else{
          // 挨个解析
          var startAddress = getStartAddress(sendFrame);
          var currentAddress = startAddress
          var pos = 3;
          for (var i = 0; i < len / 2; i++) {
            var value1 = parseInt(allFrame[pos + 2 * i], 16);
            var value2 = parseInt(allFrame[pos + 2 * i + 1], 16);
            var value = (value1 << 8) + value2;
            data[currentAddress + i] = convertFrameByte(value, currentAddress + i);
          } 
        }
      }

    } else if (afn == 0x06) {//写操作
      var value1 = parseInt(allFrame[4], 16);
      var value2 = parseInt(allFrame[5], 16);
      var value = (value1 << 8) + value2;
      var currentAddress = parseInt(allFrame[2] + allFrame[3], 16);
      data[currentAddress] = convertFrameByte(value, currentAddress);
    } else {

    }
    // } else if (afn == 0x06) {//写操作
  
    // } else if (afn == 0x05) {//
     
    // } else if (afn == 0x08) {//升级
     
    // } else if (afn == 0x10) {//写多个地址
  
    // } else {

    // }
  } else {
    result = false;
  }

  console.log({
    result: result,
    frame: allFrame,
    data: data
  })
  return {
    result : result,
    frame: allFrame,
    data: data
  }
}


// 根据发送报文得到从哪个地址开始读
function getStartAddress(sendFrame){
  return parseInt(sendFrame[3] + sendFrame[4], 16)
}

function convertFrameByte(value, address){
  var str = aucConstants.addressMap.get(address + "");
  if(str){
    var arr = str.split("_");
    var bs = arr[3]; // 倍数   
    var type = arr[6];
    var actions = [];
    if (type == "select") {
      // 如果是下拉框， 获取其spinner
      actions = aucConstants.selectMap[address]
    }
    if(value >= 37628){
      value = value - 65536
    }
    return {
      value: (value / bs).toFixed(bs.length - 1),
      title: arr[0],
      key: arr[1],
      address: address,
      bs: arr[3],
      min: arr[4],
      max: arr[5],
      type: arr[6],
      actions: actions
    }
  }else{
    return {
      value: "",
      title: "未知",
      key: "unknown",
      address: "0",
      bs: 1,
      min: 0,
      max: 65535,
      type: "text",
      actions: []
    }
  }
}

export {
  parse, convertFrameByte
}