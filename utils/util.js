const getAddressFrame = address => {
  var str = parseInt(currentItem.address).toString(16);
  while(str.length < 4){
    str = "0" + str;
  }
  return [str.substr(0, 2), str.substr(2, 2)]
}

export {
  getAddressFrame
}
