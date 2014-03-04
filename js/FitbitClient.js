
window.App = window.App || {};
 
(function($, app) {
 
    var FitbitClient = function(url, version) {
        this.API_VERSION = version ? version : 1;
        this.API_URL     = (url ? url : 'http://api.fitbit.com/') + this.API_VERSION;
        
        this.oauth = ChromeExOAuth.initBackgroundPage({
            'request_url':     'http://api.fitbit.com/oauth/request_token',
            'authorize_url':   'http://www.fitbit.com/oauth/authorize',
            'access_url':      'http://api.fitbit.com/oauth/access_token',
            'consumer_key':    '1d3b2a1c9d51474a942e306346ac62e0',
            'consumer_secret': '2a296448841f485586c3ff76e0914e9d',
            'scope':           '',
            'app_name':        'Chromebit Alarm'
        });
    }
 
    FitbitClient.prototype.getUserInfo = function(user_id) {
        return this.doRequest('GET', "/user/" + this.safeId(user_id) + "/profile.json", {});
    }
 
    FitbitClient.prototype.getDevices = function(user_id) {
        return this.doRequest('GET', "/user/" + this.safeId(user_id) + "/devices.json", {});
    }
    
    FitbitClient.prototype.getAlarms = function(device_id, user_id) {
        return this.doRequest('GET', "/user/" + this.safeId(user_id) + "/devices/tracker/" + device_id + "/alarms.json", {});
    }
 
    FitbitClient.prototype.pushAlarm = function(alarm, device_id, user_id) {
        return this.doRequest(
            'POST'
            , "/user/" + this.safeId(user_id) + "/devices/tracker/" + device_id + "/alarms.json"
            , $.extend(true, {}, this.defaultAlarm, alarm)
        );
    }
    
    FitbitClient.prototype.deleteAlarm = function(alarm_id, device_id, user_id) {
        return this.doRequest(
            'DELETE'
            , "/1/user/" + this.safeId(user_id) + "/devices/tracker/" + device_id + "/alarms/" + alarm_id + " .json"
            , {}
        );
    }
    
    FitbitClient.prototype.safeId = function(id) {
        return id ? id : '-';
    }
    
    FitbitClient.prototype.doRequest = function(method, url, params) {
        var that = this;
        this.oauth.authorize(function(token, secret) {;
            that.oauth.sendSignedRequest(that.API_URL + url, $.proxy(that.onSuccess, that), { method: method, parameters: params });
        });
    }
    
    FitbitClient.prototype.onFail = function(xhr, statusText) {
        $(this).trigger('onFail', [this, statusText, xhr]);
    }
    
    FitbitClient.prototype.onSuccess = function(response, xhr) {
        $(this).trigger('onSuccess', [this, response, xhr]);
    }
    
    FitbitClient.prototype.buildParamString = function(params) {
      if (!params || $.isEmptyObject(params)) {
        return;
      }
      
      var result = "";
      for (var i in params) {
        result += i + "=" + params[i] + "&";
      }
      
      console.log(result.substr(0, result.length-1));
      return result.substr(0, result.length-1);
    }
    
    FitbitClient.prototype.defaultAlarm = {
        // Time format is XX:XX+XX:XX
        time: '12:00-06:00',
        enabled: true,
        recurring: false,
        // Monday, Tuesday, Wednesday, etc.. the days the alarm is active
        weekDays: [], 
        label: '',
        snoozeLength: 5, // minutes
        snoozeCount: 3,
        vibe: 'DEFAULT'
    }
    
    app.FitbitClient = FitbitClient;
    
})(window.jQuery, window.App);