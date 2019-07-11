// ==UserScript==
// @name           jira-enhancements
// @description    Old view Jira enhancements
// @include        https://*.atlassian.net/browse/UNTY*
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

      // Add Custom Styles
      console.log('--- [PK] New Bug View Changes ---');
      console.log('[PK] Finding classnames..');
      var status = findParent(contains('h2', /^Status$/)[0], '');
      var reporter = findParent(contains('h2', /^Reporter$/)[0], '');
      var components = findParent(contains('h2', /^Components$/)[0], '');
      var sideBar = status.parentElement;
      var sideBarCls = className(sideBar);
      var labelCls = className(status.childNodes[0]);
      var statusCls = className(status.childNodes[1]);
      var peopleCls = className(reporter.childNodes[1]);
      var valueCls = className(components.childNodes[1]);
      var sideBarValues = components.parentElement;
      var sideBarValuesCls = className(sideBarValues);
      console.log('  sideBarCls: '+ sideBarCls);
      console.log('  sideBarValuesCls: '+ sideBarValuesCls);
      console.log('  labelCls: '+ labelCls);
      console.log('  statusCls: '+ statusCls);
      console.log('  peopleCls: '+ peopleCls);
      console.log('  valueCls: '+ valueCls);
      console.log('[PK] Adding Custom Stylesheet..');
      var sheet = document.createElement('style');
      sheet.innerHTML = `
        .${sideBarCls} .${labelCls} { float:left; width:150px; padding-top:12px; }
        .${sideBarCls} .${statusCls} { padding-top:12px; padding-bottom:12px; }
        .${sideBarCls} .${peopleCls} { margin-left:150px; margin-bottom:5px; }
        .${sideBarCls} .${valueCls} { margin-left:150px; margin-bottom:5px; }
        .${sideBarValuesCls} > div { margin-bottom:0px !important; }
      `;
      document.body.appendChild(sheet);

      // Hide None Values
      console.log('[PK] Hide none values..');
      var noneValues = contains(`.${sideBarValuesCls} span`, /^None$/);
      for (let i=0; i<noneValues.length; i++) {
        noneValues[i] = gotoParent(noneValues[i], sideBarValues);
        noneValues[i].style.display = 'none';
      }
      // Add Menu Item to Show Hidden Values
      console.log('[PK] Show hidden values when clicking Show more');
      var showMore = contains('span', /^Show more$/)[0];
      console.log(showMore);
      showMore.addEventListener('click', function() {
        console.log('CLICK!!!');
        for (let i=0; i<noneValues.length; i++) {
          noneValues[i].style.display = 'block';
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

    }, 1000);
  })();
  