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
    var imgs = details.querySelectorAll('img');
    for (var i=0; i<imgs.length; i++) {
      var link = imgs[i].parentElement;
      details.prepend(link);
    }

    console.log('[PK] Adding Custom Stylesheet..');
    var sheet = document.createElement('style');
    sheet.innerHTML = `
      div.description.markup img {
        height: 150px;
        border: 1px solid #ddd;
        margin-right: 10px;
        float: right;
        transform: all 0.5s ease;
        box-shadow: 0px 1px 3px rgba(0,0,0,0.2);
      }
      div.description.markup img:hover {
        border: 1px solid #999;
      }
    `;
    document.body.appendChild(sheet);
  })();
  