
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
    var compile = _.template($('#deviceTemplate').html());
    console.log(devices);
    for (var i in devices) {
      list.append($(compile({device: devices[i], batteryLabel: this.getBatteryLabel(devices[i])})));
    }
    $('.remove').click(this.removeAlarm);
  }
  
  PopupController.prototype.getBatteryLabel = function(device) {
    switch (device.battery) {
      case 'Full': case 'High':
        return 'label-success';
        
      case 'Medium':
        return 'label-warning';
      
      case 'Low': default:
        return 'label-danger';
    }
  }

  PopupController.prototype.removeAlarm = function() {
    var device_id = Number($(this).parents('.device').data('id'));
    var alarm_id = Number($(this).parents('.alarm').data('id'));
    
    chrome.runtime.sendMessage({
      action: 'deleteAlarm', 
      args: { 
        deviceId: device_id, 
        alarmId: alarm_id 
      }}, function(res) {
        console.log(res);
        console.log("Deleted alarm " + alarm_id + " from device " + device_id);
      });
      
    $(this).parent().fadeOut(function() {
      $(this).remove();
    });
  }
  
  $(document).ready(function() {
    var controller = new PopupController();
    controller.start();
  });
  
})(window.jQuery);
