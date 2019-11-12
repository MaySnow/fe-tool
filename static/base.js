/**
 * Created by may on 16/04/2018.
 */
(function (screen) {
  var phoneWidth = parseInt(window.screen.width);
  var phoneScale = phoneWidth/screen;
  var ua = navigator.userAgent;
  if (/Android (\d+\.\d+)/.test(ua)){
    var version = parseFloat(RegExp.$1);
    // andriod 2.3
    if(version>2.3){
      document.write('<meta name="viewport" content="width='+screen+', minimum-scale = '+phoneScale+', maximum-scale = '+phoneScale+', target-densitydpi=device-dpi, minimal-ui, viewport-fit=cover">');
      // andriod 2.3以上
    }else{
      document.write('<meta name="viewport" content="width='+screen+', target-densitydpi=device-dpi, minimal-ui">');
    }
    // 其他系统
  } else {
    document.write('<meta name="viewport" content="width='+screen+', user-scalable=no, viewport-fit=cover">');
  }
})(750);
