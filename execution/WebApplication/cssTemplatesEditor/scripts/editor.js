/**
 * Created by RicardoPD on 1/27/2016.
 */

var editor = (function(){
    var editor = {};
    editor.myDataCodeMirror = CodeMirror(document.querySelector(".data"), {
        value: '',
        mode: "application/ld+json",
        theme: "blackboard"
    });

    editor.myHtmlCodeMirror = CodeMirror(document.querySelector(".html-code"), {
        value: "",
        theme: "blackboard",
        mode: "text/html"
    });

    editor.myCssCodeMirror = CodeMirror(document.querySelector(".css-code"), {
        value: "",
        theme: "blackboard",
        mode: "text/css"
    });

    var setData = function(data){
        editor.myDataCodeMirror.setValue(JSON.stringify(data, null, '\t'));
        autoFormat(editor.myDataCodeMirror);
    }

    var setHtml = function(html){
        editor.myHtmlCodeMirror.setValue(html);
        autoFormat(editor.myHtmlCodeMirror);
    }

    var setCSS = function(css){
        editor.myCssCodeMirror.setValue(css);
        autoFormat(editor.myCssCodeMirror);
    }

    function autoFormat(editor){
        var totalLines = editor.lineCount();
        editor.autoFormatRange({line:0, ch:0}, {line:totalLines});
    }

    function getData(){
        return JSON.parse(editor.myDataCodeMirror.getValue());
    }

    function getHtml(){
        return editor.myHtmlCodeMirror.getValue().replace(/[\n\r]+/g, '').replace(/\s{2,10}/g, ' ');
    }

    function getCSS(){
        return editor.myCssCodeMirror.getValue().replace(/[\n\r]+/g, '').replace(/\s{2,10}/g, ' ');
    }

    return {
        getData: getData,
        setData: setData,
        getHtml: getHtml,
        setHtml: setHtml,
        getCSS: getCSS,
        setCSS: setCSS
    };
})();
