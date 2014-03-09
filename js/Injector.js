
(function($) {

  var Injector = function() {
    this.EVENT_TIMEOUT = 1000;
    this.deviceList = [];
    this.alarmList = [];
    this.registerEvents();
  }
  
  Injector.prototype.registerEvents = function() {
    var that = this;
    
    if (!this.deviceList || this.deviceList.length <= 0) {
      chrome.runtime.sendMessage({ action: 'getDevices' }, function(res) {
        that.deviceList = JSON.parse(res.items);
      });
    }
    
    setInterval(function() {
      var wrapper = $('.tg-mainwrapper');
      if (wrapper && !wrapper.hasClass('fitbit-injected')) {
        wrapper.addClass('fitbit-injected').click($.proxy(that.addBubbleContent, that));
      }
      
      var button = $('.qnb-container .goog-imageless-button');
      if (button && !button.hasClass('fitbit-injected')) {
        button.addClass('fitbit-injected').click($.proxy(that.addPageContent, that));
      }
    }, this.EVENT_TIMEOUT);
  }
  
  Injector.prototype.addBubbleContent = function(event) {
    $('.bubblecontent .cb-table tr:last-child')
      .before(
        $('<tr>')
          .append($('<td>').text('Fitbit'))
          .append($('<td>').append(this.buildCheckbox()))
      );
      
    $('.bubblecontent .goog-imageless-button')
      .mousedown($.proxy(this.saveBubbleAlarm, this));
  }
  
  Injector.prototype.addPageContent = function(event) {
    $('.gcal-reminder-method').append($('<option>').val('fitbit').text('Fitbit'));
      
    $('#chrome_cover2 .goog-imageless-button-content')
      .mousedown($.proxy(this.savePageAlarm, this));
  }
  
  Injector.prototype.buildCheckbox = function() {
    return $('<div>').addClass('fitbit-settings-input')
      .append(
        $('<input>').attr('type', 'checkbox').addClass('form-control enable-fitbit-notifications')
      )
      .append($('<label>').text('Send reminder to your Fitbit device?'));
  }
  
  Injector.prototype.saveBubbleAlarm = function() {
    if (!$('.enable-fitbit-notifications').prop('checked')) {
      return;
    }
    this.saveAlarm($('.bubblecontent .cb-table tr:first-child .cb-value').text());
  }
  
  Injector.prototype.savePageAlarm = function() {
    var reminders = [];
    $('.gcal-reminder').each(function() {
      if ($(this).find('gcal-reminder-method').val() == 'fitbit') {
        // xxx build time string and save alarm
      }
    });
  }
  
  Injector.prototype.saveAlarm = function(timeString) {
    if (!this.deviceList || this.deviceList.length <= 0) {
      return;
    }
    
    // Truncate the date string into a parseable format
    timeString = timeString.substr(0, timeString.lastIndexOf("–")).trim();
    timeString = moment(timeString, "dddd, MMMM D, h:ma");
    
    var deviceId = this.deviceList[0].id;
    var time = timeString.subtract('minutes', 15).format("HH:mmZ");
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
