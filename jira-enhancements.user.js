// ==UserScript==
// @name           jira-enhancements
// @description    Old view Jira enhancements
// @include        https://*.atlassian.net/browse/UNTY*
// @version        2019.07.10
// ==/UserScript==
(function() {
    'use strict';
  
    // Find elements that contain text. Text is a regex /^sometext$/
    // https://stackoverflow.com/questions/37098405
    var contains = function(selector, text) {
      var elements = document.querySelectorAll(selector);
      return Array.prototype.filter.call(elements, function(element){
        return RegExp(text).test(element.textContent);
      });
    };
  
  
    if (document.querySelector('body').classList.contains('aui-layout')) {
  
      //-----------------------------------------------------------
      // Old Bug View Changes
      //-----------------------------------------------------------
      console.log('--- [PK] Old Bug View Changes ---');
      console.log('[PK] Collect important elements');
      let agilepanel = document.querySelector('#greenhopper-agile-issue-web-panel');
      let attachments = document.querySelector('#attachmentmodule');
      let customfields = document.querySelector('#customfieldmodule');
      let dates = document.querySelector('#datesmodule');
      let description = document.querySelector('#description-val');
      let devstatus = document.querySelector('#viewissue-devstatus-panel');
      let people = document.querySelector('#peoplemodule');
      let sidebar = document.querySelector('#viewissuesidebar');
  
      console.log('[PK] Remove stupid plugin shit!');
      document.querySelector('div[id^="com.kanoah.test-manager"]').remove();
      document.querySelector('div[id^="com.servicerocket.jira.salesforce"]').remove();
      document.querySelector('#asset-fields-panel').remove();
  
      console.log('[PK] Remove stupid toggle titles!');
      var titles = document.querySelectorAll('h2.toggle-title');
      for (let i=0; i < titles.length; i++) {
        titles[i].remove();
      }
  
      console.log('[PK] Make comments not impossible to read!');
      setInterval(function() {
        var comments = document.querySelectorAll('.activity-comment');
        var images = document.querySelectorAll('.activity-comment img');
        for (let i=0; i < comments.length; i++) { comments[i].setAttribute('style', 'background-color:#F4F5F7; border:1px solid #ddd; margin-bottom:10px;'); }
        for (let i=0; i < images.length; i++) { }
      }, 500);
  
      console.log('[PK] Stop fading the description when I hover it!');
      description.setAttribute('style', 'background-color:#F4F5F7; border:1px solid #ddd; margin-bottom:10px; padding:10px; width:100%; margin-left:0px;');
      attachments.querySelector('#attachmentmodule_heading').remove();
      attachments.setAttribute('style', 'padding:0px; margin:0px;');
  
      console.log('[PK] Move custom fields to the sidebar!');
      dates.parentNode.insertBefore(customfields, devstatus);
      var items = customfields.querySelectorAll('li.item');
      var values = customfields.querySelectorAll('div.value');
      var labels = sidebar.querySelectorAll('.item-details dl>dt');
      for (let i=0; i < items.length; i++) { items[i].setAttribute('style', 'margin:10px 0px;'); }
      for (let i=0; i < values.length; i++) { values[i].setAttribute('style', 'min-height:20px; min-width:60px;'); }
      for (let i=0; i < labels.length; i++) { labels[i].setAttribute('style', 'width:150px;'); }
      agilepanel.setAttribute('style', 'padding:0px; margin:0px;');
  
      console.log('[PK] Disable click to edit description bullshit!');
      setTimeout(function() {
        var descriptionClone = description.cloneNode(true);
        description.parentNode.replaceChild(descriptionClone, description);
        descriptionClone.addEventListener("dblclick", function() {
          descriptionClone.parentNode.replaceChild(description, descriptionClone);
          setTimeout(function() { description.click(); }, 200);
        });
      }, 1000);
    } else {
  
      //-----------------------------------------------------------
      // New Bug View Changes
      //-----------------------------------------------------------
      console.log('--- [PK] New Bug View Changes ---');
  
      console.log('[PK] Adding Custom Stylesheet');
      var sheet = document.createElement('style');
      sheet.innerHTML = `
        .iGyYHq .dAtTjS { float:left; width:150px; padding-top:12px; }  /* Sidebar headers */
        .iGyYHq .igPjYz { padding-top: 12px; padding-bottom: 12px; }    /* Status chooser */
        .iGyYHq .ehGzOz { margin-left:150px; margin-bottom:5px; }       /* People pickers */
        .iGyYHq .gKBQVf { margin-left:150px; margin-bottom:5px; }       /* Regular fields */
      `;
      document.body.appendChild(sheet);
    }
  
  })();
  
  