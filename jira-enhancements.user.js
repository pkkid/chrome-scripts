// ==UserScript==
// @name           jira-enhancements
// @description    New view Jira enhancements
// @include        https://*.atlassian.net/browse/*
// @version        2019.07.10
// ==/UserScript==
(function() {
  'use strict';

  setTimeout(function() {
    
    // Find elements that contain text. Text is a regex /^sometext$/
    // https://stackoverflow.com/questions/37098405
    var contains = function(selector, text) {
      var elements = document.querySelectorAll(selector);
      return Array.prototype.filter.call(elements, function(element){
        return RegExp(text).test(element.textContent);
      });
    };

    // Find the parent with the specified cls
    var findParent = function(elem, cls) {
      elem = elem.parentElement;
      while ((elem.className != cls) && (elem.nodeName != 'BODY')) {
        elem = elem.parentElement;
      }
      return elem;
    };

    // Find the top item still within parent
    var gotoParent = function(elem, parent) {
      while ((elem.parentElement != parent) && (elem.nodeName != 'BODY')) {
        elem = elem.parentElement;
      }
      return elem;
    };

    // Extract a single className from the element
    var className = function(elem, maxLength) {
      maxLength = maxLength || 6;
      var classNames = elem.className.split(' ');
      for (var i=0; i<classNames.length; i++) {
        if (classNames[i].length <= maxLength) {
          return classNames[i];
        }
      }
      return null;
    };

    // Spelunk through the DOM to find a few key class names
    console.log('--- [PK] New Bug View Changes ---');
    console.log('[PK] Finding classnames..');
    var status = contains('h2', /^Status$/)[0].parentElement.parentElement;  // Status wrapper (inside sidebar)
    var statusCls = className(status.childNodes[1]);
      console.log('  statusCls: '+ statusCls);
    var labelCls = className(status.childNodes[0]);
      console.log('  labelCls: '+ labelCls);
    var sideBar = status.parentElement;
    var sideBarCls = className(sideBar);
      console.log('  sideBarCls: '+ sideBarCls);
    var components = findParent(contains('h2', /^Team Assigned$/)[0], '');
    var sideBarValues = components.parentElement;
    var sideBarValuesCls = className(sideBarValues);
      console.log('  sideBarValuesCls: '+ sideBarValuesCls);
    var valueCls = className(components.childNodes[1].childNodes[0]);
      console.log('  valueCls: '+ valueCls);
    var reporter = findParent(contains('h2', /^Reporter$/)[0], '');
    var peopleCls = className(reporter.childNodes[1]);
      console.log('  peopleCls: '+ peopleCls);
    var description = contains('h2', /^Description$/)[0].parentElement.parentElement;
    var descriptionCls = className(description);
      console.log('  descriptionCls: '+ descriptionCls);
    var content = description.parentElement;
    var contentValuesCls = className(description.nextSibling.childNodes[0]);
      console.log('  contentValuesCls: '+ contentValuesCls);
    
    // Create a custom stylesheet
    console.log('[PK] Adding Custom Stylesheet..');
    var sheet = document.createElement('style');
    sheet.innerHTML = `
      .${sideBarCls} .${labelCls} { float:left; width:150px; padding-top:12px; }
      .${sideBarCls} .${statusCls} { padding-top:12px; padding-bottom:12px; }
      .${sideBarCls} .${peopleCls} { margin-left:150px; margin-bottom:5px; }
      .${sideBarCls} .${valueCls} { margin-left:150px; margin-bottom:5px; }
      .${sideBarValuesCls} > div { margin-bottom:0px !important; }
      div[class^="Content-"]:hover { background-color: transparent !important; }
    `;
    document.body.appendChild(sheet);

    // Hide None Values in Sidebar
    console.log('[PK] Hide none values..');
    var hidden = [];
    var noneValues = contains(`.${sideBarValuesCls} span`, /^None$/);
    for (let i=0; i<noneValues.length; i++) {
      let elem = gotoParent(noneValues[i], sideBarValues);
      if (elem.nodeName != 'BODY') {
        elem.style.display = 'none';
        hidden.push(elem);
      }
    }
    // Hide None Value in Content
    noneValues = contains(`.${contentValuesCls} span`, /^None$/);
    for (let i=0; i<noneValues.length; i++) {
      let elem = gotoParent(noneValues[i], content);
      if (elem.nodeName != 'BODY') {
        elem.style.display = 'none';
        hidden.push(elem);
      }
    }
    
    // Add Menu Item to Show Hidden Values
    console.log('[PK] Show hidden values when clicking Show more');
    var showMore = contains('span', /^Show more$/)[0];
    showMore.addEventListener('click', function() {
      for (let i=0; i<hidden.length; i++) {
        hidden[i].style.display = 'block';
      }
    });

    // Require Doubleclick to Edit Description..
    console.log('[PK] Require doubleclick to edit description..');
    var description = findParent(contains('h2', /^Description$/)[0], '');
    var descriptionClone = description.cloneNode(true);
    description.parentNode.replaceChild(descriptionClone, description);
    descriptionClone.addEventListener("dblclick", function() {
      descriptionClone.parentNode.replaceChild(description, descriptionClone);
      setTimeout(function() { description.click(); }, 400);
    });

    // Hide BETA Warning
    //console.log('[PK] Hide beta warning..');
    //document.querySelector('#jira-issue-header').previousSibling.style.display = 'none';

  }, 1000);
})();
