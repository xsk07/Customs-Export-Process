var globalInterval = [];

$(document).ready(function(){

    var bizagi = bizagi || {};
    bizagi.override = bizagi.override || {};
    bizagi.services = bizagi.services || {};

    $('.biz-theme-generator').theme({
    	previewPage:BIZAGI_THEME_WPORTAL,
    	previewWebparts:BIZAGI_THEME_WEBPARTS,
    	services:BIZAGI_THEME_SERVICES,
    	oneColorTheme: 'biz-one-color-theme',
    	mockjax:"libs/js/_debug/jquery.mockjax.js",
    	_savedThemes:'libs/js/json/theme.predefined.json.txt',
        _configTheme:'libs/js/json/theme.config.json.txt',
    	_exportThemeString:BIZAGI_THEME_DEBUG,
    	_debug:BIZAGI_THEME_DEBUG,
    	thumbs:4,
    	_dummies:false,
        _animations:true
    });
});

bizagi.cookie = function (key) {
    // key and possibly options given, get cookie...    
    var result;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decodeURIComponent(result[1]) : null;
};

/**
 * Get XSRF Value
 */
bizagi.getXSRFToken = function () {
	return !!window.sessionStorage ? (sessionStorage.getItem('XSRFToken') || '') : '';
};

/**
 * Get XSRF Value
 */
bizagi.getXSRFToken = function () {
	return !!window.sessionStorage ? (sessionStorage.getItem('XSRFToken') || '') : '';
};

/*
_themeLessString:'{"@background":"#a76e6e","@title":"#250b0b","@subtitle":"#250b0b","@text":"#381111","@link-primary":"#f8e9e9","@link-secondary":"#601c1c","@border-primary":"#9b2e2e","@border-secondary":"#601c1c","@menu-top":"#872828","@menu-bottom":"#732222","@menu-search":"#ffffff","@menu-search-hover":"#f3d5d5","@inbox-top":"#250b0b","@inbox-bottom":"#381111"}'

*/