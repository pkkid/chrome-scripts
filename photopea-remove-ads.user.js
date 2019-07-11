// ==UserScript==
// @name         photopea-remove-ads
// @description  Remove ads from Photopea
// @include      https://www.photopea.com/*
// @version      2019.07.10
// ==/UserScript==

(function() {
    'use strict';
    var TOOLBAR_WIDTH = 360;
  
    setTimeout(function() {
      var ads = document.querySelector('div.photopea');
      var block = document.querySelector('div.mainblock.panelblock div.block');
      var workarea = block.children[1];
      ads.children[1].display = 'none';
      workarea.style.width = (window.innerWidth - TOOLBAR_WIDTH) + 'px';
      var observer = new window.MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          var newValue = workarea.getAttribute('style');
          if (mutation.oldValue != newValue) {
            workarea.style.width = (window.innerWidth - TOOLBAR_WIDTH) + 'px';
          }
        });
      });
      observer.observe(workarea, {
        attributes: true,
        attributeFilter: ['style'],
        attributeOldValue: true,
      });
    }, 1000);
  
  })();
