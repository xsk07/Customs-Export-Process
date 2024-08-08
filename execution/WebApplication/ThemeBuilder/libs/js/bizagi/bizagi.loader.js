var bizagi = bizagi || {};
bizagi.override = bizagi.override || {};
bizagi.language = BIZAGI_LANGUAGE;
bizagi.enableCustomizations = false;

/*
*   Creates a replace all method that is left from the String Class
*/
bizagi.replaceAll = function (text, pcFrom, pcTo) {
    var temp = text;
    var index = temp.indexOf(pcFrom);
    while (index != -1) {
        temp = temp.replace(pcFrom, pcTo);
        index = temp.indexOf(pcFrom, index + pcTo.length);
    }
    return temp.toString();
};