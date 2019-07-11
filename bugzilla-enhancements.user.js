// ==UserScript==
// @name     bugzilla-enhancements
// @version  2018.10.12
// @include  https://bugs.nasuni.net/*
// @require  http://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;
    console.log('Fixing Bugzilla');
  
    var DEFAULT_STATUS = 'assigned,new,reopened,retest,review,target,unconfirmed';
    var DONT_SHORTEN = ['qa_contact'];
    var EMPTY_SEARCH = '---';
    var REPLACEMENTS = {
      ANY: 'new,assigned,resolved,reopened,closed',
      RECENT: 'delta>-1w',
    };
  
    // Remove Useless Clutter
    $('hr').remove(); // Remove ALL <hr> tags
    $('.bz_query_timestamp').remove(); // Remove Quip DateTime'
    $('ul.related_actions').remove(); // Remove Related Actions
    $('#footer #links-actions').remove(); // Remove Duplicated Footer Links
    $('#footer .label').remove(); // Remove Footer Labels
  
    // Cleanup Annoying CSS Styles
    $('.bz_query_head').css({'border-bottom':'1px dotted #777', 'margin-bottom':'10px', 'padding-bottom':'10px'}); // Quip border
    $('pre').css('font-family', 'Liberation Mono, Monospace, Courier New, Courier'); // Pre fonts
    $('pre').css({'font-size':'13px', 'margin':'10px 0px', 'width':'auto'}); // Pre padding
    $('textarea').css('font-family', 'Liberation Mono, Monospace, Courier New, Courier'); // Textarea fonts
    $('textarea').css('padding', '5px'); // Textarea padding
    $('.bz_result_count').css({'display':'block', 'margin-top':'5px'}); // Footer margin
    $('.bz_query_buttons form').css('display', 'inline'); // Query buttons
    $('.bz_query_buttons input').css('font-size', '10px'); // Query button fonts
    $('#quicksearch_top').css({'width':'900px', 'font-size':'15px', 'font-weight':'bold',
      'font-family':'"liberation sans"', 'padding':'4px 5px', 'color':'#444', 'border-radius':'3px',
      'border-width':'0px', 'background-color':'rgba(255,255,255,0.5)'});
    $('#quicksearch_top').attr('autocomplete', 'off');
    $('#header .links').css({'border-bottom-left-radius':'0px', 'border-bottom-right-radius':'0px'});
  
    // Fix the Main Bug Layout
    $('#bz_show_bug_column_1 tbody').append('<tr><td colspan="2" class="bz_section_spacer"></td></tr>');
    $('#bz_show_bug_column_1 tbody').append($('#bz_show_bug_column_2 tbody tr'));
    $('#bz_show_bug_column_2').prev().remove(); // Remove Column Spacer
    $('#bz_show_bug_column_2').remove(); // Remove Column2 Contents
    $('.bz_time_tracking_table').remove(); // Remove Time Tracking Table
  
    // Collect major elements
    var buginfo = $('#bz_show_bug_column_1').parent().parent().parent();
    var comments = $('#comments');
    var newcomment = $('#bz_big_form_parts');
    var attachment_table = $('#attachment_table');
    var bugfoot = $('.navigation');
    var editform = $('table.edit_form');
  
    // Remove useless crap
    $('.bz_add_comment').remove();
    $('.bz_collapse_expand_comments').parent().remove();
    attachment_table.siblings('br').remove();
    $('#list_of_bugs').remove();
    $('.buglist_menu .bz_query_buttons').remove();
    $('.bz_query_links img').parents('a').remove();
    $('.bz_query_links').css({'float':'right', 'position':'relative', 'top':'15px'});
  
    // Remove calendar
    $('.calhead,.calweekdaycell,.calcell').closest('tr').remove();
  
    // Create a new layout to put new elements
    var leftcol = $('<div id="leftcol"><div id="scroller"></div></div>');
    var scroller = leftcol.find('#scroller');
    var rightcol = $('#comments');
    leftcol.css({'width':'550px', 'float':'left', 'margin-top':'3px'});
    rightcol.css({'margin-left':'560px'});
    rightcol.find('.bz_comment_table').css({'width':'100%'});
  
    // Move elements into the left column
    rightcol.before(leftcol);
    scroller.append(editform);
    scroller.append(attachment_table);
    editform.css({'border':'1px solid #C8C8BA', 'background-color':'#E8E8E8'});
    editform.find('td').css({'padding-right':'5px'});
    attachment_table.css({'margin':'10px 0px', 'width':'100%'});
  
    // Move elements into the right column
    rightcol.append(newcomment);
    bugfoot.css({'clear':'both'});
  
    // Rename a few labels
    $('th:contains("Affects Documentation:")').text('Affects Docs:');
    $('th:contains("Promote to Filer bug:")').text('Filer Bug:');
    $('th:contains("Release note items:")').text('Release Notes:');
    $('th:contains("Found by customer:")').text('Customer-Found:');
  
    // Fix Heights
    $('#bz_show_bug_column_1').find('th,td').css({'padding-top':'3px', 'padding-bottom':'3px'});
  
    // Fix label colors
    var tbody = $('#bz_show_bug_column_1 tbody');
    tbody.find('th').css({'padding-right':'5px', 'text-decoration':'none', 'color':'#333'});
    tbody.find('th a').css({'text-decoration':'none', 'color':'#333'});
    $('.bz_section_spacer').remove();
    tbody.find('th,td').css('{padding-bottom:2px;}');
  
    // Fix needinfo & needreview blocks
    var cells = $('label:contains("needinfo")').add('label:contains("needreview")').closest('td');
    cells.prev().remove();
    cells.css({'color':'#333', 'text-align':'right', 'font-weight':'bold'});
    $.each(cells, function(i, cell) {
      cell = $(cell); cell.next().next().insertBefore(cell.next());
    });
  
    // Fix the textarea
    $('#comment').css({'font-size':'12px'}).removeAttr('onfocus');
    $('#comment').attr('rows', 15).attr('cols', 90).css('margin-bottom', '5px');
    $('.bz_group_visibility_section').parents('td').remove();
  
    // Append Image Thumbnails to Comments
    // -----------------------------------
    // Create a List of Image Attachments
    var attachments = [];
    $('#attachment_table .bz_attach_extra_info').each(function() {
      if ($(this).text().indexOf("image") != -1) {
        var imagelink = $(this).prev().attr('href');
        var imagename = 'attach_' + imagelink.split('=')[1];
        attachments.push({name: imagename, link: imagelink});
      }
    });
    // Append to comments
    for (var i = 0; i < attachments.length; i += 1) {
      var comment = $('#comments a[name='+ attachments[i].name +']').parents('.bz_comment');
      var thumbnail = $('<img src="'+ attachments[i].link +'"/>');
      thumbnail.css({'max-width':'150px', 'max-height':'150px'});
      var thumblink = $('<a href="'+ attachments[i].link +'"></a>').append(thumbnail);
      var thumbwrap = $('<div class="thumb">').append(thumblink);
      thumbwrap.css({'float':'right', 'padding':'3px', 'background-color':'#e0e0e0', 'border':'1px solid #C8C8BA', 'margin':'5px'});
      comment.find('.bz_comment_head,.bz_first_comment_head').after(thumbwrap);
      comment.append($('<div style="clear:right"></div>'));
    }
  
    // Copy Links to Top
    // -----------------
    var html = $('#links-saved').html();
    html = $(html);
    html.find('br').nextAll('li').remove();
    html.find('br').remove();
    $('<div>').insertAfter('#header ul.links').html(html);
  
    // Better Quip Font
    // ----------------
    var font = 'Amatic SC';
    var fontname = font.replace(' ', '+');
    $('head').append('<link href="https://fonts.googleapis.com/css?family='+ fontname +'" rel="stylesheet" type="text/css">');
    $('.bz_quip a').css({'text-decoration':'none'});
    $('.bz_quip em').css({'font-family':font, 'font-style':'normal', 'font-size':'25px',
      'color':'rgba(0,0,0,0.5)', 'font-weight':'bold', 'line-height':'30px', 'letter-spacing':'1px'});
  
    // Copy Search Options to Search Bar
    // ---------------------------------
    var items = {};
    $.each($('.search_description').find('li'), function(i, li) {
      // Extract the key, value, op
      var parts = $(li).text().toLowerCase();
      var key = $.trim(parts.split(':')[0]).replace(' ','_');
      if (DONT_SHORTEN.indexOf(key) == -1) { key = key.split('_')[0]; }
      var vals = parts.split(':')[1].split(',').map($.trim);
      if (!(key in items)) { items[key] = {vals:[], op:':', neg:''}; }
      for(i=0; i<vals.length; i++) {
        vals[i] = vals[i].replace('\n', '');
        if (vals[i].startsWith('(does not contain the string)')) { vals[i] = $.trim(vals[i].split(')')[1]); items[key].neg = '-'; }
        if (vals[i].startsWith('(is greater than or equal to)')) { vals[i] = $.trim(vals[i].split(')')[1]); items[key].op = '>='; }
        if (vals[i].startsWith('(is less than or equal to)')) { vals[i] = $.trim(vals[i].split(')')[1]); items[key].op = '<='; }
        if (vals[i].startsWith('(is greater than)')) { vals[i] = $.trim(vals[i].split(')')[1]); items[key].op = '>'; }
        if (vals[i].startsWith('(is less than)')) { vals[i] = $.trim(vals[i].split(')')[1]); items[key].op = '<'; }
        if (vals[i].indexOf(' ') >= 0) { vals[i] = '"'+ vals[i] +'"'; }
      }
      console.log('adding '+ key + items[key].op + vals);
      items[key].vals = items[key].vals.concat(vals).sort();
    });
    // Remove generic and useless items
    if ('whiteboard' in items) {
      var toRemove = items.whiteboard;
      items.product.vals.splice($.inArray(toRemove, items.product.vals), 1);
      items.component.vals.splice($.inArray(toRemove, items.component.vals), 1);
      items.summary.vals.splice($.inArray(toRemove, items.summary.vals), 1);
      items.content.vals.splice($.inArray(toRemove, items.content.vals), 1);
      items.alias.vals.splice($.inArray(toRemove, items.alias.vals), 1);
    }
    console.log('query items: '+ items);
    // Build the search string and pop it in the input
    var query = '';
    $.each(items, function(key, item) {
      var valstr = item.vals.join(',');
      if (item.vals.length == 0) { return true; }
      if (item.vals[0] == EMPTY_SEARCH) { return true; }
      if (key == 'status' && valstr == DEFAULT_STATUS) { return true; }
      if (key == 'changed') { key = 'delta'; }
      if (key == 'personal') { key = 'tag'; }
      // put it together
      if (key == 'whiteboard') { query = $.trim(query +' '+ valstr); }
      else { query = $.trim(query +' '+ item.neg + key + item.op + valstr); }
    });
    console.log('query result: '+ query);
    $('#quicksearch_top').val(query);
  
    // Fancy Search Replacements
    setInterval(function() {
      var initstr = $('#quicksearch_top').val();
      var newstr = initstr.replace('','');
      for (var key in REPLACEMENTS) {
        if (!REPLACEMENTS.hasOwnProperty(key)) continue;
        newstr = newstr.replace(key, REPLACEMENTS[key]);
      }
      if (initstr != newstr) { $('#quicksearch_top').val(newstr); }
    }, 1000);
  })();
