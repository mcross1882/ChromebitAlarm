
(function($) {

  var Injector = function() {
    this.deviceList = [];
    this.registerEvents();
  }
  
  Injector.prototype.registerEvents = function() {
    var that = this;
    
    if (!this.deviceList || this.deviceList.length <= 0) {
      chrome.runtime.sendMessage({ action: 'getDevices' }, function(res) {
        that.deviceList = JSON.parse(res.items);
      });
    }
    
    $('.tg-mainwrapper').click($.proxy(this.addBubbleContent, this));
  }
  
  Injector.prototype.addBubbleContent = function(event) {
    $('.bubblecontent .cb-table tr:last-child')
      .before(
        $('<tr>')
          .append($('<td>').text('Fitbit'))
          .append(
            $('<td>').append(
              $('<input>').attr('type', 'checkbox')
                .addClass('form-control enable-fitbit-notifications')
            )
            .append(
              $('<label>').text('Send reminder to your Fitbit device?')
            )
          )
      );
      
    $('.bubblecontent .goog-imageless-button')
      .mousedown($.proxy(this.saveAlarm, this))
      .mouseup($.proxy(this.registerEvents, this));
  }
  
  Injector.prototype.saveAlarm = function() {
    if (!this.deviceList || this.deviceList.length <= 0 || !$('.enable-fitbit-notifications').prop('checked')) {
      return;
    }
    
    var deviceId = this.deviceList[0].id;
    
    var timeString = $('.bubblecontent .cb-table tr:first-child .cb-value').text();
    // Truncate the date string into a parseable format
    timeString = timeString.substr(0, timeString.lastIndexOf("–")).trim();
    timeString = moment(timeString, "dddd, MMMM D, h:ma");
    
    var time = timeString.subtract('minutes', 15).format("hh:mm+00:00");
    var weekday = timeString.format("dddd");
    
    chrome.runtime.sendMessage({ 
      action: 'saveAlarm', 
      args: { 
        deviceId: deviceId, 
        weekDay: weekday,
        time: time
      }
    }, function(res) {
      console.log('Saved alarm to Fitbit (Device: ' + deviceId + ')');
    });
  }
  
  $(document).ready(function() {  
    new Injector();
  });
  
})(window.jQuery);
