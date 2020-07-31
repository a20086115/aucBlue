import Toast from "../../miniprogram_npm/vant-weapp/toast/toast";
wx.cloud.init()
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    reference_params: app.convertAddress(["375", "376", "377", "378", "379"]),

    control_params: app.convertAddress(["499", "500", "501", "502", "503", "504", "505", "506", "507", "508", "509", "510", "511", "512", "513", "514", "515", "516", "517", "518", "519"]),

    protect_params: app.convertAddress(["728", "729", "730", "731", "732", "733", "734", "735", "736", "737", "739", "740", "741", "742", "743", "744", "745", "746", "747", "748"]),

    capallocation_params: app.convertAddress(["603", "604", "605", "606", "607", "608", "609", "610", "611", "612", "613", "614"]),

    record_params: app.convertAddress(["116", "117", "119"]),

    currentIndex: "0",
    currentItem: {},
    show: false,
    spinnerShow: false,
    inputValue: "",
    percentValue:0,
    file_num:0,
    percent_real:0,

    updateFileVersion: "", // 文件升级选择的版本
    updateFileConfig: {}, // 可供选择的升级文件对象
    updateFileArray: [] // 可供选择的升级文件名称数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '控制参数'
    })
    this.update()

    //初次进入页面读取首页数据
    // 获取参考值
    this.getCkz();
    console.log(this.data)

    wx.cloud.init({
      
    })
    
    setInterval(() => {
      this.data.percent_real = app.globalData.percent / this.data.file_num
      this.data.percent_real = (this.data.percent_real.toFixed(2)) * 100
      if(app.globalData.sendfile_flag == 2)
      {
        this.data.percent_real = 100
        app.globalData.sendfile_flag = 0
      }
      console.log(this.data.file_num)
      console.log(this.data.percent_real)
      this.setData({
        percentValue: this.data.percent_real,
       
      })
      
      console.log(app.globalData.percent)
      
    },1000)

  },
    

  // 输入框点击事件
  onInputClick(event) {
    console.log(event)
    this.setData({
      currentItem: event.detail.item,
      show: true
    })
  },
  // 
  // 输入框点击事件
  onActionClick(event) {
    console.log(event)
    this.setData({
      currentItem: event.detail.item,
      spinnerShow: true
    })
  },
  onChange(event) {
    console.log("切换到标签", event.detail.name)
    this.data.currentIndex = event.detail.name;
    this.gettapname();
    this.data.percent_real = 0;
  },

  gettapname() {
    if (this.data.currentIndex == "0") {
      // 获取参考值
      this.getCkz();
    } else if (this.data.currentIndex == "1") {
      //获取控制参数
      this.getKzcs();
    } else if (this.data.currentIndex == "2") {
      // 获取保护参数
      this.getBhcs();
    } else if (this.data.currentIndex == "3") {
      // 获取容量分配参数
      this.getRlfp();
    } else if (this.data.currentIndex == "4") {
      // 获取调试数据

    } else if (this.data.currentIndex == "5") {
      // 获取录波数据
      this.getLbsj();
    } else {

    }
  },
  onConfirm() {
    console.log("onConfirm", this.data.inputValue, this.data)
    // 判断value是否为空
    var value = this.data.inputValue;

    if (value === "") {
      this.setData({ show: false, inputValue: "" })
      Toast.fail("输入数据为空")
      return;
    }
    // 判断value是否在范围内

    if (value > parseInt(this.data.currentItem.max) || value < parseInt(this.data.currentItem.min)) {
      this.setData({ show: false, inputValue: "" })
      Toast.fail('输入数据应在' + this.data.currentItem.min + " 到 " + this.data.currentItem.max + "之间")
      return;
    }

    // 写报文
    var addressByteArr = app.getAddressFrame(this.data.currentItem.address)
    var valueByteArr = app.getAddressFrame(value * this.data.currentItem.bs)

    var sendData = ["00", "06"].concat(addressByteArr, valueByteArr);
    app.write(sendData, (obj, frame) => {
      console.log("---------")
      console.log(obj, frame)
      this.setData({
        reference_params: Object.assign(this.data.reference_params, obj.data),
        show: false,
        inputValue: ""
      })
      // Toast.fail("设置成功")
      console.log(this.data)
      this.gettapname();
      app.globalData.save_flag = 1;
    });
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  onClose(e) {
    if (e.detail == "cancel" || e.detail == "overlay") {
      this.setData({ show: false, inputValue: "" })
    }
  },
  onActionClose() {
    this.setData({ spinnerShow: false });
  },
  onActionSelect(event) {
    //写报文
    var addressByteArr = app.getAddressFrame(this.data.currentItem.address)
    var valueByteArr = app.getAddressFrame(event.detail.value)
    var sendData = ["00", "06"].concat(addressByteArr, valueByteArr);
    app.write(sendData, (obj, frame) => {
      console.log("---------")
      console.log(obj, frame)
      this.setData({
        spinnerShow: false,
      })
      // Toast.fail("设置成功")
      console.log(this.data)
      this.gettapname();
      app.globalData.save_flag = 1;
    });
  },
  // 获取参考值
  getCkz() {
    var sendData = ["00", "03", "01", "77", "00", "05"];
    app.write(sendData, (obj, frame) => {
      console.log("----获取参考值-----")
      console.log(obj, frame)
      this.setData({
        reference_params: app.copyObject(this.data.reference_params, obj.data)
      })
      console.log(this.data)
    });
  },
  // 获取控制参数
  getKzcs() {
    var sendData = ["00", "03", "01", "f3", "00", "75"];
    app.write(sendData, (obj, frame) => {
      console.log("----获取控制参数-----")
      console.log(obj, frame)
      this.setData({
        control_params: app.copyObject(this.data.control_params, obj.data)
      })
      console.log(this.data)
    });
  },
  // 获取保护参数
  getBhcs() {
    var sendData = ["00", "03", "02", "D8", "00", "17"];
    app.write(sendData, (obj, frame) => {
      console.log("----获取保护参数-----")
      console.log(obj, frame)
      this.setData({
        protect_params: app.copyObject(this.data.protect_params, obj.data)
      })
      console.log(this.data)
    });
  },
  // 获取容量分配数据
  getRlfp() {
    var sendData = ["00", "03", "02", "5b", "00", "0d"];
    app.write(sendData, (obj, frame) => {
      console.log("----获取容量分配参数-----")
      console.log(obj, frame)
      this.setData({
        capallocation_params: app.copyObject(this.data.capallocation_params, obj.data)
      })
      console.log(this.data)
    });
  },
  // 获取录波数据
  getLbsj() {
    var sendData = ["00", "03", "00", "74", "00", "04"];
    app.write(sendData, (obj, frame) => {
      console.log("获取录波信息成功", obj, frame)
      this.setData({
        record_debug: app.copyObject(this.data.record_debug, obj.data)
      })
      console.log(this.data)
    });
  },
  //升级按钮
  update: function () {
    // 如果是软件升级，自动从云开发中读取config.json, 获取配置的可升级文件列表
      wx.cloud.downloadFile({
        fileID: 'cloud://aucble-ig4pz.6175-aucble-ig4pz-1302704672/config.json',
        success: res => {
          let fsm = wx.getFileSystemManager();

          // console.log("res.tempFilePath")
          // console.log(fsm)

          fsm.readFile({
            filePath: res.tempFilePath,
            encoding: "utf8",
            success: (res) => {
              var config = JSON.parse(res.data)
              this.setData({
                updateFileArray: Object.keys(config),
                updateFileConfig: config
              })
            }
          })
        }
      })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      updateFileVersion: this.data.updateFileArray[e.detail.value]
    })

    // 展示弹框
    wx.showModal({
      title: '提示',
      content: '确定使用' + this.data.updateFileVersion + "进行升级？",
      success: res => {
        if (res.confirm) {
          this.downBinFile(); // 下载升级文件
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  downBinFile: function () {
    console.log(this.data)
    var filePath = this.data.updateFileConfig[this.data.updateFileVersion];
    console.log(filePath)
    if (!filePath) {
      // 如果文件地址不存在 
      return;
    }
    wx.cloud.downloadFile({
      fileID: filePath,
      success: res => {
        let fsm = wx.getFileSystemManager();
        fsm.readFile({
          filePath: res.tempFilePath,
          success: (res) => {
            let buffer = res.data
            let dataView = new DataView(buffer)
            let dataResult = []
            var dataResult1 = [187]
            for (let i = 0; i < dataView.byteLength; i++) {
              dataResult.push(("00" + dataView.getUint8(i).toString(16)).slice(-2))
            }
            this.data.percent_real = 0;
            app.globalData.percent = 0;
            console.log("buff1 = " + dataView)
            console.log("buff2 = " + dataResult)
            console.log("buff = " + this.ab2hext(dataView.buffer));

            //发送文件标志
            app.globalData.sendfile_flag = 1
            //文件下载成功后进行分包发送
            // updatefilesend();
            var Frame_length = 176
            var count = parseInt((dataResult.length - 32) / Frame_length)
            this.data.file_num = count
            var sylen = dataResult.length - 32
            var offset = 32

            if (((dataResult.length - 32) % Frame_length) != 0)
            {
              count = count + 1
            }
            console.log("剩余包数 = " + count)

            //第一包数据
            dataResult1[0] = 0x00;
            dataResult1[1] = 0xFF;
            dataResult1[2] = 0x08;
            dataResult1[3] = 0x00;
            dataResult1[4] = 0x00;
            dataResult1[5] = 0x00;
            dataResult1[6] = 0x20;
            dataResult1[7] = (count >> 8) & 0x00FF;
            dataResult1[8] = count & 0x00FF;
            dataResult1[9] = 0x00;
            dataResult1[10] = 0x00;

            for(let i = 0; i < 11; i++)
            {
              dataResult1[i] = dataResult1[i].toString(16)
            }

            for(let i = 0; i < 32; i++)
            {
              dataResult1[11+i] = dataResult[i]
              // console.log("buff3 = " + dataResult1)
            }

            app.write(dataResult1, (obj, frame) => {
              // console.log("----第一包数据-----")
              // console.log(obj, frame)
              this.setData({
                spinnerShow: false,
              })
              // Toast.fail("设置成功")
              console.log(this.data)
            });

            setTimeout(function(){    
              //轮询发送后续文件
              // this.sendfile(dataResult1)
              for (let i = 1; i < (count+1); i++)
              {
                dataResult1 = []
                dataResult1[0] = i;//文件分包-包号
                dataResult1[1] = 0xFF;
                dataResult1[2] = 0x08;//AFN
                dataResult1[3] = (i >> 8) & 0x00FF;//当前包号
                dataResult1[4] = i & 0x00FF;
                // dataResult1[5] = 0x00;//当前包字节数
                // dataResult1[6] = 0xB0;
                dataResult1[7] = ((count - i) >> 8) & 0x00FF;//剩余包数
                dataResult1[8] = (count-i) & 0x00FF;
                dataResult1[9] = 0x00;
                dataResult1[10] = 0x00;

                if ((sylen / (Frame_length+1)) < 1)
                {
                  dataResult1[0] = 0x80 | i 
                  sylen = sylen % (Frame_length + 1)
                  dataResult1[5] = 0x00;//当前包字节数
                  dataResult1[6] = sylen;

                  for (let i = 0; i < sylen; i++) {
                    dataResult1[11 + i] = dataResult[i + offset]
                  }
                }
                else
                {
                  sylen = sylen - Frame_length
                  dataResult1[5] = 0x00;//当前包字节数
                  dataResult1[6] = 0xB0;

                  for (let i = 0; i < 176; i++) {
                    dataResult1[11 + i] = dataResult[i + offset]
                  }
                }

                for (let i = 0; i < 11; i++) {
                  dataResult1[i] = dataResult1[i].toString(16)
                }
                console.log("-----从机编号22----")
                console.log(dataResult1)  
                offset = offset + Frame_length
                app.write(dataResult1, (obj, frame) => {
                  // console.log("----第一包数据-----")
                  // console.log(obj, frame)
                  this.setData({
                    spinnerShow: false,
                  })
                  // Toast.fail("设置成功")
                  console.log(this.data)
                });

              }

            },2000)



          }
        })
      }
    })
  },
  //发送剩余升级文件
  // sendfile:function(buffer)
  // {
  //   setInterval(() => {
  //     dataResult1[0] = 0xFF;
  //     dataResult1[1] = 0x08;
  //     dataResult1[2] = 0x00;
  //     dataResult1[3] = 0x00;
  //     dataResult1[4] = 0x00;
  //     dataResult1[5] = 0x20;
  //     dataResult1[6] = (count >> 8) & 0x00FF;
  //     dataResult1[7] = count & 0x00FF;
  //     dataResult1[8] = 0x00;
  //     dataResult1[9] = 0x00;


  //   }, 200);
  // }, 
   /**
   * 生成16进制字符串
   */
  ab2hext:function(buffer) {
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function(bit) {
        return ('00' + bit.toString(16)).slice(-2);
      }
    )
    return hexArr.join(' ');
  },
  //按钮回调函数
  //还原参数
  hycs: function () {
    //写报文
    var sendData = ["00", "06", "03", "02", "00", "01"];
    app.write(sendData, (obj, frame) => {
      console.log("---------")
      console.log(obj, frame)
      this.setData({
        spinnerShow: false,
      })
      // Toast.fail("设置成功")
      console.log(this.data)
    });
  },
  //cpu复位
  cpufw: function () {
    //写报文
    var sendData = ["00", "06", "02", "FE", "00", "01"];
    app.write(sendData, (obj, frame) => {
      console.log("---------")
      console.log(obj, frame)
      this.setData({
        spinnerShow: false,
      })
      // Toast.fail("设置成功")
      console.log(this.data)
    });
  },
  //历史事件擦除
  lssjcc: function () {
    //写报文
    var sendData = ["00", "06", "00", "7B", "00", "01"];
    app.write(sendData, (obj, frame) => {
      console.log("---------")
      console.log(obj, frame)
      this.setData({
        spinnerShow: false,
      })
      // Toast.fail("设置成功")
      console.log(this.data)
    });
  },
  //手动录波
  record_man: function () {
    //写报文
    var sendData = ["00", "06", "00", "73", "00", "01"];
    app.write(sendData, (obj, frame) => {
      console.log("---------")
      console.log(obj, frame)
      this.setData({
        spinnerShow: false,
      })
      // Toast.fail("设置成功")
      console.log(this.data)
    });
  },
  //数据导出
  dataexport: function () {
    //写报文
    var sendData = ["00", "06", "00", "76", "00", "01"];
    app.write(sendData, (obj, frame) => {
      console.log("---------")
      console.log(obj, frame)
      this.setData({
        spinnerShow: false,
      })
      // Toast.fail("设置成功")
      console.log(this.data)
    });
  },




})