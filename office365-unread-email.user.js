// ==UserScript==
// @name           office365-unread-email
// @description    Update favicon and title to indicate the number of unread messages in the Inbox.
// @include        https://outlook.office.com/mail/inbox*
// @include        https://outlook.office.com/mail/*
// @version        2019.07.10
// @grant          none
// ==/UserScript==

(function() {
    'use strict';
  
    var prevIcon;
    var read = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAnFBMVEUAAAAAUJ8GUJoDZLgLLnAnqOkbk9gGUJsoqOpQ2f8DZLgIa7wTbrwjd8Erc4cygcXQ4vL////g7PYobH/A2O3v9ftSlM5Ci8qBstwUVHUhjM0jlNUbb7AYcbYSfMkTTm8dd7kYbK8Wg84UkN8MNFYXfMQKQ2gEY7QMRmkSg8sTi9gefrAjnuIWiM4Thc4Ujdsgmd0Tg8oTh9Enpui5+UlZAAAAB3RSTlMAEO/v3+/vHayLZAAAAAFiS0dEEeK1PboAAAAHdElNRQfjBhQDFDrm20ZaAAAAiklEQVQY01XP1xKDIBCF4dX0TVE2QjTNxE3v5f3fLUCA0f+CYb6LMwAAUdwLxaCL+raBzQA0oYWuoQNzH43NOfGQpEJQgjj1kEk1I6qByBFzgVjo5Xm7AYvlaq2BpFIyQyw324rZjNJ/dLdntuA7sIXwsOPpfDEAULiut/vjyeErttf7o6FTk2/3BzUmDoj0P16mAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTA2LTIwVDEwOjIwOjU4LTA3OjAwaBBFywAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wNi0yMFQxMDoyMDo1OC0wNzowMBlN/XcAAAAASUVORK5CYII=';
    var unread = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABBVBMVEUAAAAAUJ8GUJoDZLh9Kl8nqOkbk9gGUJsWTJRZP33OKFTOKVTNJlLMJlHPJVXMJFHNJlMoqOpAltV9Z57OJ1TNKVPLJ1POJ1PPKFU1nNxscqvMJVHNJ1PPKFTPKVQDZLgqWKSKP3jOJlLPJ1TPKVUTbrwjd8EvVJ62MFoygcXQ4vL////g7PZxS2nHMl7NKFTA2O3v9ftSlM5Ci8oobH+HirC4Q23PJ1PNKFOBstwUVHU/k9FzbqWEUIYjlNUbb7Ama60tcLgTTm8dd7kYbK8Wg84UkN8MNFYXfMQKQ2gEY7QMRmkSg8sTi9gefrAjnuIWiM4Thc4Ujdsgmd0Tg8oTh9EnpuhGPC9TAAAAB3RSTlMAEO/v8O/vLr2KuQAAAAFiS0dEKyS55AgAAAAHdElNRQfjBhQDFDrm20ZaAAAAxUlEQVQY02NgYGBkYmdn5+Dk4ubh5eMXYAAKCAKBkLCIqJi4hLg4UIABJCApxSMtIysnK87ALA8BCopKyrIqsrIMII6qGpBQ11CWUJEACWhqaWvraMrL6+rJqnDpAwUMDI2MdXTk5U1Mzcx5LIAC2pby8pba8vJWgtY2tiwoAnb2Do5AAR1DIyNDA3l5J2cXVzc3kKE6EEPdPdzcwAIw4OkGFoA5TN7L28cXJMDAYAUFfv4BgUFuUK9AQXBIKFCAFUkkjA0AhkMjlwsLkhkAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDYtMjBUMTA6MjA6NTgtMDc6MDBoEEXLAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTA2LTIwVDEwOjIwOjU4LTA3OjAwGU39dwAAAABJRU5ErkJggg==';
  
    var createIcon = function(count) {
      var icon = document.createElement("link");
      icon.type = "image/x-icon";
      icon.rel = "shortcut icon";
      icon.href = count >= 1 ? unread : read;
      console.log(icon.href);
      return icon;
    };
  
    var updateIcon = function(count) {
      console.log('[PK] update icon: '+ count);
      var index = (count > 98) ? 99 : count;
      var newIcon = createIcon(index);
      prevIcon = document.querySelector('link[rel="shortcut icon"]');
      if (prevIcon) { document.head.removeChild(prevIcon); }
      document.head.appendChild(newIcon);
      prevIcon = newIcon;
    };
  
    // Check for past events every minute
    window.addEventListener('load', function() {
      console.log('[PK] Loading Office365 Email Favicon');
      // Remove existing favicon links
      var links = document.head.querySelectorAll("link[rel=icon]");
      Array.prototype.forEach.call(links, function(link) {
        link.parentNode.removeChild(link);
      });
      // Update the favicon
      setInterval(function() {
        var count = document.querySelectorAll('div[aria-label^="Unread "]').length;
        updateIcon(count);
      }, 2000);
    });
  
  })();
  
