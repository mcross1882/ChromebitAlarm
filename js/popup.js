
(function($) {

  var PopupController = function() {
    this.deviceList = [];
  }
  
  PopupController.prototype.start = function() {
    this.registerEvents();
  }
  
  PopupController.prototype.registerEvents = function() {
    var that = this;
    chrome.runtime.sendMessage({action: 'getDevices'}, function(res) {
      if (res.errors && res.errors.length > 0) {
        console.log('Failed to get devices from Fitbit API service.');
        return;
      }
      that.deviceList = JSON.parse(res.items);
      that.requestAlarms();
    });
  }
  
  PopupController.prototype.requestAlarms = function() {
    var that = this;
    for (var i in this.deviceList) {
      chrome.runtime.sendMessage({action: 'getAlarms', args: { deviceId: this.deviceList[i].id }}, function(res) {
        if (res.errors && res.errors.length > 0) {
          console.log('Failed to get alarms from Fitbit API service.');
          return;
        }
        that.deviceList[i].alarms = JSON.parse(res.items).trackerAlarms || [];
        that.buildDeviceList(that.deviceList);
      });
    }
  }
  
  PopupController.prototype.buildDeviceList = function(devices) {
    var list = $('.device-list');
    for (var i in devices) {
      list.append(
        $('<div>')
          .addClass('device')
          .attr('data-id', devices[i].id)
          .append($('<strong>').text(devices[i].deviceVersion))
          .append(this.buildAlarmList(devices[i].alarms))
      );
    }
  }
  
  PopupController.prototype.buildAlarmList = function(alarms) {
    console.log(alarms);
    var list = $('<ul>').addClass('alarm-list');
    for (var i in alarms) {
        list.append(
          $('<li>')
            .addClass('alarm')
            .attr('data-id', alarms[i].alarmId)
            .text(alarms[i].time)
            .append(this.buildRemoveLink())
        );
    }
    return list;
  }
  
  PopupController.prototype.buildRemoveLink = function() {
    return $('<a>')
      .attr('href', '#')
      .addClass('remove')
      .text('Remove')
      .click(this.removeAlarm);
  }
  
  PopupController.prototype.removeAlarm = function() {
      var device_id = $(this).parents('.device').data('id');
      var alarm_id = $(this).parents('.alarm').data('id');
      
      chrome.runtime.sendMessage({action: 'getAlarms', args: { deviceId: device_id, alarmId: alarm_id }, function(res) {
  }
  
  $(document).ready(function() {
    var controller = new PopupController();
    controller.start();
  });
  
})(window.jQuery);
