window.App = window.App || {};

(function($, app) {
  var client = new app.FitbitClient();
  
  function processAction(action) {
    switch (action) {
      case 'getUserInfo':
        client.getUserInfo();
        break;
    }
  }

  chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
    $(client).on('onSuccess', function(client, response, xhr) {
      sendResponse({ res: response });
    });
    processAction(req.action);
  });

})(window.jQuery, window.App);
