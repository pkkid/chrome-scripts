// ==UserScript==
// @name           jira-enhancements
// @description    New view Jira enhancements
// @include        https://*.atlassian.net/browse/*
// @version        2019.07.10
// ==/UserScript==
(function() {
  'use strict';

  var fixEverything = function(event) {
    event.preventDefault();
    
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
    var cls = function(elem, maxLength) {
      maxLength = maxLength || 6;
      var classNames = elem.className.split(' ');
      for (var i=0; i<classNames.length; i++) {
        if (classNames[i].length <= maxLength) {
          return classNames[i];
        }
      }
      return null;
    };

    var
    _components,
    _reporter,
    description,
    mainPanel,
    status,
    sidePanel,
    sidePanelValues,
    labelCls,
    peopleCls,
    valueCls,
    developmentCls;

    // SidePanel - Spelunk through the DOM to find a few key class names
    try {
      console.log('[PK] --> Finding classnames..');
      _components = findParent(contains('h2', /^Team Assigned$/)[0], ''); console.log(_components);
      _reporter = findParent(contains('h2', /^Reporter$/)[0], ''); console.log(_reporter);
      description = contains('h2', /^Description$/)[0].parentElement.parentElement; console.log('[PK] description: '+ cls(description));
      mainPanel = description.parentElement; console.log('[PK] mainPanel: '+ cls(mainPanel));
      status = contains('h2', /^Status$/)[0].parentElement.parentElement; console.log('[PK] status: '+ cls(status));
      sidePanel = status.parentElement.parentElement; console.log('[PK] sidePanel: '+ cls(sidePanel));
      sidePanelValues = _components.parentElement; console.log('[PK] sidePanelValues: '+ cls(sidePanelValues));
      labelCls = cls(status.childNodes[0]); console.log('[PK] labelCls: '+ labelCls);
      peopleCls = cls(_reporter.childNodes[1]); console.log('[PK] peopleCls: '+ peopleCls);
      valueCls = cls(_components.childNodes[1].childNodes[0]); console.log('[PK] valueCls: '+ valueCls);
      developmentCls = cls(contains('h2', /^Development$/)[0]); console.log('[PK] developmentCls: '+ developmentCls);
    } catch(err) {
      console.log('[PK] ERROR: '+ err.message);
    }

    // Create a custom stylesheet
    try {
      console.log('[PK] --> Adding Custom Stylesheet..');
      var sheet = document.createElement('style');
      sheet.innerHTML = `
        .${cls(sidePanel)} .${labelCls} { float:left; width:150px; padding-top:12px; }
        .${cls(sidePanel)} .${cls(status)} { padding-top:45px; margin-bottom:-16px; }
        .${cls(sidePanel)} .${peopleCls} { margin-left:150px; margin-bottom:5px; }
        .${cls(sidePanel)} .${valueCls} { margin-left:150px; margin-bottom:5px; }
        .${cls(sidePanel)} .${developmentCls} { padding-top: 12px; }
        .${cls(sidePanelValues)} > div { margin-bottom:0px !important; }
        /* div[class^="LayoutStyles__Container-"] { background-color:#f8f8f8; padding:5px; border:1px solid #eee; border-radius:4px; margin-bottom:5px; } */
        div[class^="Content-"]:hover { background-color: transparent !important; }
      `;
      document.body.appendChild(sheet);
    } catch(err) {
      console.log('[PK] ERROR: '+ err.message);
    }

    // Append title to fixed header
    try {
      console.log('[PK] --> Appending issue title to fixed header..');
      var title = document.title.replace(' - JIRA', '').split('] ')[1]; console.log('[PK] title: '+ title);
      var issue = document.title.split(']')[0].replace('[', ''); console.log('[PK] issue: '+ issue);
      var headers = contains('span', /^UNTY/);
      var header = headers[headers.length - 1].parentElement.parentElement;  console.log('[PK] header: '+ cls(header));
      header.text = issue +' - '+ title;
    } catch(err) {
      console.log('[PK] ERROR: '+ err.message);
    }
    
    // Hide None Values in Sidebar
    try {
      console.log('[PK] --> Hide None values..');
      var hidden = [];
      var panels = [sidePanelValues, mainPanel];
      for (let p=0; p<panels.length; p++) {
        let nones = contains(`.${cls(panels[p])} span`, /^None$/);
        for (let i=0; i<nones.length; i++) {
          let elem = gotoParent(nones[i], panels[p]);
          if (elem.nodeName != 'BODY') {
            elem.style.display = 'none';
            hidden.push(elem);
          }
        }
      }
    } catch(err) {
      console.log('[PK] ERROR: '+ err.message);
    }

    // Require Doubleclick to Edit Description..
    // console.log('[PK] --> Require doubleclick to edit description..');
    // var descriptionBox = findParent(contains('h2', /^Description$/)[0], '');
    // var descriptionClone = descriptionBox.cloneNode(true);
    // descriptionBox.parentNode.replaceChild(descriptionClone, descriptionBox);

    // Doubleclick to Undo everything!
    // document.addEventListener('dblclick', function() {
    //   console.log('[PK] --> Undo description..');
    //   descriptionClone.parentNode.replaceChild(descriptionBox, descriptionClone);
    //   console.log('[PK] --> Show Hidden feilds..');
    //   for (let i=0; i<hidden.length; i++) { hidden[i].style.display = 'block'; }
    // });

  };

  var fixedit = false;
  document.addEventListener('dblclick', function(event) {
    if (!fixedit) {
      fixEverything(event);
      fixedit = true;
    }
  });

})();
