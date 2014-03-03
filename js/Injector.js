
(function() {

  var Injector = function() {
    this.addPageContent();
    this.registerEvents();
  }
  
  Injector.prototype.registerEvents = function() {
    chrome.runtime.sendMessage({ action: 'getUserInfo' }, function(res) {
      console.log('getUserInfo Response', res);
    });
  }
  
  Injector.prototype.addPageContent = function() {
  
  }
  
  new Injector();
  
})();
