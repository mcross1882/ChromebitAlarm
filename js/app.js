window.App = window.App || {};

(function($, app) {
  var client = new app.FitbitClient();
  
  function processAction(action, args) {
    switch (action) {
      case 'getUserInfo':
        client.getUserInfo();
        break;
        
      case 'getDevices':
        client.getDevices();
        break;
        
      case 'getAlarms':
        client.getAlarms(args.deviceId);
        break;
        
      case 'saveAlarm':
        client.pushAlarm({ time: args.time, weekDays: [args.weekDay] }, args.deviceId);
        break;
        
      case 'deleteAlarm':
        client.deleteAlarm(args.alarmId, args.deviceId);
        break;
    }
  }
  
  chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
    $(client).on('onSuccess', function(event, client, response, xhr) {
      sendResponse({ items: response });
    });
    processAction(req.action, req.args);
    return true;
  });

})(window.jQuery, window.App);
