/*
 *   Name: BizAgi Utils
 *   Author: Diego Parra
 *   Comments:
 *   -   This class will provide misc helpers to all modules
 */

// Create or Define BizAgi namespace
bizagi = (typeof (bizagi) !== "undefined") ? bizagi : {};
bizagi.util = (typeof (bizagi.util) !== "undefined") ? bizagi.util : {};
bizagi.context = (typeof (bizagi.context) !== "undefined") ? bizagi.context : {};

/*
 *   Generates a random guid
 */
Math.guid = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

bizagi.util.sanitizeHTML = function (str) {
    var temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
};


/*
 *   Creates a replace all method that is left from the String Class
 */
bizagi.util.replaceAll = function(text, pcFrom, pcTo) {
    // Call the method located in bizagi.loader
    return bizagi.replaceAll(text, pcFrom, pcTo);
};
// Also append it to the string class
String.prototype.replaceAll = function(pcFrom, pcTo) {
    return bizagi.util.replaceAll(this, pcFrom, pcTo);
};

/*
*   Reads the query string parameters
*/
bizagi.readQueryString = function () {
    var queryString = window.location.search.substring(1);
    var splitQueryString = queryString.split("&");
    var queryStringHashTable = {};
    for (var i = 0; i < splitQueryString.length; i++) {
        var singleKeyValue = splitQueryString[i].split("=");
        queryStringHashTable[singleKeyValue[0]] = singleKeyValue[1];
    }
    return queryStringHashTable;
};

function printf(msg) {
    var args = Array.prototype.slice.call(arguments, 1), arg;
    return msg.replace(/(%[disv])/g, function(a, val) {
        arg = args.shift();
        if (arg !== undefined) {
            switch (val.charCodeAt(1)) {
                case 100:
                    return +arg; // d
                case 105:
                    return Math.round(+arg); // i
                case 115:
                    return String(arg); // s
                case 118:
                    return arg; // v
            }
        }
        return val;
    });
}

/*
* Use localStorage in html5 verfiy supports and operations 
* http://dev.w3.org/html5/webstorage/#dom-storage-setitem
*/

bizagi.util.browserSupportLocalStorage = function () {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
};

/*
*set the item  in the local storage
*/
bizagi.util.setItemLocalStorage = function (key, value) {
    if (bizagi.util.browserSupportLocalStorage()) {
        localStorage.setItem(key, value);
        return true;
    } else {
        return false;
    }
};
bizagi.util.getItemLocalStorage = function (key) {
    return localStorage.getItem(key);
};
bizagi.util.removeItemLocalStorage = function (key) {
    localStorage.removeItem(key);
};
bizagi.util.clearLocalStorage = function () {
    if (bizagi.util.browserSupportLocalStorage())
        localStorage.clear();
};

bizagi.util.sanitizeHTML = function (str) {
    var temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
};

bizagi.util.upVersion = function(saved, actual){
    var response = false;

    if(saved === actual){
        return false;
    }
    

    var a = saved.split('.'),
        b = actual.split('.'),
        len = Math.max(a.length, b.length);
        
    var validate = function(a,b, index){
        var comp = {isMajor:false, isMinor: false, isEqual: false};
        var A = a[index]; B = b[index];
        if(A > B){
            comp.isMinor = true;
        }else if(B > A){
            comp.isMajor = true;
        }else{
            comp.isEqual = true;
        }
        return comp;
    };

    var equalLenght = function(longInit, longReq, arr){
        for(var i=longInit;i<longReq; i++){
            arr.push('0');
        }
        return arr;
    };

    if(a.length > b.length){
        b = equalLenght(b.length, a.length, b);

    }else if(a.length< b.length){
        a = equalLenght(a.length, b.length, a);
    }


    for(var i=0; i<a.length; i++){
        var res = validate(a, b, i);
        if(res.isMajor){
            response = true;
            break;
        }else if(res.isMinor){
            response = false;
            break;
        }else if(res.isEqual){
            response = false;
        }
    }


    return response;
};