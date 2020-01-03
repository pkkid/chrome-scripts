// ==UserScript==
// @name         office365-dim-past-events
// @description  Dim past events in Office 365 Calendar.
// @include      https://outlook.office.com/calendar/*
// @include      https://outlook.office365.com/calendar/*
// @version      2019.07.10
// ==/UserScript==

(function() {
  'use strict';

  // Dim Past Events
  var checkForUpdate = function() {
    var events = document.querySelectorAll('div[aria-label^="event from"],div[aria-label^="all day event "]');
    var now = new Date();
    for (var i=0; i<events.length; i++) {
      var event = events[i];
      var allday = event.getAttribute('aria-label').includes('all day');
      var regex = allday ? / (for|from) (.*?20\d\d)/ : /event from (.*?[A|P]M)/;
      var dtstr = event.getAttribute('aria-label').match(regex);
      if (dtstr.length >= 2) {
        var dt = allday ? new Date(dtstr[2]) : new Date(dtstr[1]);
        dt.setHours(dt.getHours()+1);
        if (now > dt) {
          event.setAttribute('aria-label', event.getAttribute('aria-label').replace('event', 'evnt'));
          event.style.transition = "opacity 0.3s";
          event.style.opacity = 0.3;
        }
      }
    }
  };

  // Check for past events every minute
  window.addEventListener('load', function() {
    console.log('[PK] Loading Office365 Dim Past Events');
    setInterval(checkForUpdate, 500);
  });
  
})();
  