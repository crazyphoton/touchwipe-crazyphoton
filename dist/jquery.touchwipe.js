/*! jquery.touchwipe - v1.3.0 - 2015-01-08
* Copyright (c) 2015 Josh Stafford; Licensed MIT */
(function($) {
  $.fn.touchwipe = function(settings) {
    var config = {
      min_move_x: 20,
      min_move_y: 20,
      wipeLeft: function() { },
      wipeRight: function() { },
      wipeUp: function() { },
      wipeDown: function() { },
      preventDefaultEvents: false, // prevent default on swipe
      preventDefaultEventsX: true, // prevent default is touchwipe is triggered on horizontal movement
      preventDefaultEventsY: false // prevent default is touchwipe is triggered on vertical movement
    };

    if (settings) {
      $.extend(config, settings);
    }

    this.each(function() {
      var startX;
      var startY;
      var isMoving = false;
      var touchesX = [];
      var touchesY = [];
      var timer;
      function cancelTouch() {
        this.removeEventListener('touchmove', onTouchMove);
        startX = null;
        startY = null;
        isMoving = false;
      }

      function onTouchMove(e) {

        var dxFinal, dyFinal;

        if(config.preventDefaultEvents) {
          e.preventDefault();
        }

        if(isMoving) {
          var x = e.touches[0].pageX;
          var y = e.touches[0].pageY;
          var dx = startX - x;
          var dy = startY - y;
          if(Math.abs(dx) >= config.min_move_x) {
            if(config.preventDefaultEventsX) {
              e.preventDefault();
            }
            touchesX.push(dx);
            if(touchesX.length === 1){ // first call..
              timer=setTimeout(function(){ // wait a while incase we get other touchmove events
                cancelTouch();
                dxFinal = touchesX.pop();
                touchesX = []; // empty touches
                // call callbacks
                if(dxFinal > 0) {
                  config.wipeLeft(Math.abs(dxFinal));
                } else {
                  config.wipeRight(Math.abs(dxFinal));
                }
              },200);
            }
          } else if(Math.abs(dy) >= config.min_move_y) {
            if(config.preventDefaultEventsY) {
              e.preventDefault();
            }
            touchesY.push(dy);
            if(touchesY.length === 1){ // first call..
              timer=setTimeout(function(){ // wait a while incase we get other touchmove events
                cancelTouch();
                dyFinal = touchesY.pop();
                touchesY = []; // empty touches
                // call callbacks
                if(dyFinal > 0) {
                  config.wipeDown(Math.abs(dyFinal));
                } else {
                  config.wipeUp(Math.abs(dyFinal));
                }
              },200);
            }
          }
        }
      }

      function onTouchStart(e) {
        if (e.touches.length === 1) {
          startX = e.touches[0].pageX;
          startY = e.touches[0].pageY;
          isMoving = true;
          this.addEventListener('touchmove', onTouchMove, false);
        }
      }

      this.addEventListener('touchstart', onTouchStart, false);

    });

    return this;
  };

})(jQuery);
