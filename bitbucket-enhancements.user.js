// ==UserScript==
// @name           bitbucket-enhancements
// @description    Bitbucket enhancements
// @include        https://git.nasuni.net/*/pull-requests/*
// @version        2019.07.10
// ==/UserScript==
(function() {
    'use strict';

    // Create a custom stylesheet
    console.log('[PK] Move image to top of description..');
    var details = document.querySelectorAll('div.description.markup')[0];
    var container = document.createElement('div');
    container.className = "imgs";
    details.prepend(container);

    var imgs = details.querySelectorAll('img');
    for (var i=0; i<imgs.length; i++) {
      var link = imgs[i].parentElement;
      container.prepend(link);
    }

    console.log('[PK] Adding Custom Stylesheet..');
    var sheet = document.createElement('style');
    sheet.innerHTML = `
      div.description.markup .imgs {
        width: 320px;
        float: right;
      }
      div.description.markup .imgs img {
        max-height: 300px;
        max-width: 300px;
        border: 3px solid #ddd;
        border-radius: 3px;
        margin: 5px;
        float: right;
      }
      div.description.markup img:hover {
        border: 3px solid #999;
      }
    `;
    document.body.appendChild(sheet);
  })();
  