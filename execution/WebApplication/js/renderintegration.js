/*
	Document: renderintegration.css
	Created on: May 31, 2012
	Author: Jair Cardenas jair.tellez{_at_}bizagi.com
	Description: This document overrides the styles of the old render
*/
try{	
	var iFrame = document.getElementById('bz-wp-widget-oldrender').contentDocument,
	groupHeader = iFrame.getElementsByClassName('GroupHeader'),
	groupHeaderRight = iFrame.getElementsByClassName('GroupHeaderRight'),
	i = 0,
	groupHeaderLength = groupHeader.length;
	for ( ; i < groupHeaderLength; i++) {
		var groupHeaderParent = groupHeader[i].parentNode,
		testObj = groupHeaderParent.parentNode,
		parentWidth = '100%',
		count = 0;
		groupHeaderParent.className += 'GroupHeaderParent';
		var gHeaderRight = groupHeaderRight[i];
		groupHeaderParent.removeChild(groupHeaderRight[i]);
		groupHeaderParent.insertBefore(gHeaderRight, groupHeader[i]);
		while (testObj.getAttribute('width') != parentWidth || count < 3) {
			testObj = testObj.parentNode;
			count++;
			if ( count === 3 ) {
				testObj.className = 'group';
			}
		}
	}
	
	var q;
	$(function () {
	    q = $(document.getElementById('bz-wp-widget-oldrender').contentDocument);
	    var $right = q.find('.GroupHeaderRight img'),
		$rightSpan = $('<span class="right-span"></span>'),
		$save = q.find('[src*="drive.gif"]'),
		$saveSpan = $('<span class="save-span"></span>'),
		$gridNext = q.find('.gridline2').next();
	    $gridPrev = q.find('.gridline2').prev();
	    $rightSpan.click(function () {
	        $(this).toggleClass('right-span-hide');
	    });
	    q.find('.GroupHeaderRight img').wrap($rightSpan);
	    q.find($save).wrap($saveSpan);
	});        
}catch(e){}