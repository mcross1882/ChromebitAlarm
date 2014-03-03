
(function($) {

  var Injector = function() {
    this.deviceList = [];
    this.registerEvents();
  }
  
  Injector.prototype.registerEvents = function() {
    var that = this;
    chrome.runtime.sendMessage({ action: 'getDevices' }, function(res) {
      that.deviceList = JSON.parse(res.items);
    });
    
    $('.tg-col-today, .tg-col').click($.proxy(this.addBubbleContent, this));
  }
  
  Injector.prototype.addBubbleContent = function(event) {
    $('.bubblemain .cb-table tr:last-child')
      .before(
        $('<tr>')
          .append($('<td>').text('Fitbit'))
          .append(
            $('<td>').append(
              $('<input>').attr('type', 'checkbox')
                .addClass('form-control')
                .change($.proxy(this.saveAlarm, this))
            )
            .append(
              $('<label>').text('Send reminder to your Fitbit device?')
            )
          )
      );
  }
  
  Injector.prototype.saveAlarm = function() {
    console.log(this.deviceList);
    if (!this.deviceList || this.deviceLength <= 0) {
      return;
    }
    
    var deviceId = this.deviceList[0].id;
    
    var timeString = $('.bubblemain .cb-table tr:first-child .cb-value').text();
    // Truncate the date string into a parseable format
    timeString = timeString.substr(0, timeString.lastIndexOf("–")).trim();
    timeString = moment(timeString, "ddd, MMMM D, h:ma");
    
    var time = timeString.format("hh:mm+00:00");
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
