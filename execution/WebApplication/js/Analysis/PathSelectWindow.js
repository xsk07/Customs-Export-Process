//------------------------------- Constants ----------------------------//
var _iAjaxActionCode = "1651";
var _iconArray = ["../../img/analysis/MasterEntity.png", "../../img/analysis/ParameterEntity.png", "../../img/analysis/SystemEntity.png", "../../img/analysis/checkbox.png"];
var _ajaxGatewayUrl = "../Ajax/AJAXGateway.aspx";
var _treeStyleCssUrl =  "../../css/Analysis/jquery/themes/tree/apple/style.css";
var _maxTreeDepth = 32;
//------------------------------- Global variables ----------------------------//
var urlParams = {}; 
var _selectedNodePath = "";     
var _wfClassId = -1;            

//------------------------------- Startup function ----------------------------//

$(function () {  
    GetUrlParams();
    InitTree(urlParams.wfClassId, urlParams.selectedNodePath);
});


//------------------------------- Init jQuery tree ----------------------------//
function InitTree(wfClassId, selectedNodePath){
    
    _selectedNodePath = selectedNodePath;
    _wfClassId = wfClassId;
    
    $("#divTree").jstree({   
    
        "types" : {
            "types" : { 
                "master_entity" : {
                    "icon" : { "image" : _iconArray[0] }
                }
                ,
                "parameter_entity" : {
                    "icon" : { "image" : _iconArray[1] }
                }
                ,
                "system_entity" : {
                    "icon" : { "image" : _iconArray[2] }
                }
                ,
                "boolean_attribute" : {
                    "icon" : { "image" : _iconArray[3] }
                }
            }
        }
        ,
        "json_data" : {  
            "ajax" : {  
                "url" : _ajaxGatewayUrl,  
                "data": 
                        function (n) { 
				            // the result is fed to the AJAX request `data` option
				            return { 
					            "action" : _iAjaxActionCode, 
					            "pathNodeType" : n.attr ? jQuery.data(n[0], "jstree").pathNodeType : "",  // "attribute" or "entity"
					            "idNode" : n.attr ? jQuery.data(n[0], "jstree").idNode : -1,              // EntityId/AttributeId
					            "nodeDisplayPath" : n.attr ? jQuery.data(n[0], "jstree").nodeDisplayPath : "", 
					            "nodePath" : n.attr ? jQuery.data(n[0], "jstree").nodePath : "", 
					            "selectedNodePath" : _selectedNodePath,
					            "wfClassId" : _wfClassId
				            }; 
				        },                        
                
                "error" : onError,
                
                "success" : onSuccess 
            }  
        },  
        "themes": {
            "url": _treeStyleCssUrl
            },
        
        "plugins" : [ "themes", "json_data", "ui", "types" ]  ,
        
        "initially_select": [GetNodeIdByPath(_selectedNodePath)]
        
    });  
    $("#divTree").jstree("set_theme","apple"); 
}

//--------  Given a node path returns the DOM (li) object representing a dimension in the tree -----//
function GetNodeIdByPath(nodePath){
    return "";
}


//------------------------------- Exist success AJAX-Tree callback functions ----------------------------//

function onError (data, t, e) { 
    window.alert(e); 
    return data; 
} 

function onSuccess(data) { 
    if(data.length > 0){
        
        //If max depth is reached return an empty array (meaning no children is added to the tree)
        var sDisplayPath = data[0].metadata.nodeDisplayPath;
        var iPathLength = sDisplayPath.split(".").length;
        
        if(iPathLength >= _maxTreeDepth)
            return [];
    }    

    return data; 
}  


//------------------------------- Returns aJSON object with the selected node ----------------------------//
function GetSelectedNodeJSON(){
    var arrSelected = $("#divTree").jstree("get_selected"); 

    if(arrSelected.length == 0)
        return null;
    
    var oNodeSelected = arrSelected[0];
    
    var oNodeJSON = {
        id: oNodeSelected.id,
        pathNodeType: jQuery.data(oNodeSelected, "jstree").pathNodeType,
        idNode: jQuery.data(oNodeSelected, "jstree").idNode,
        nodeDisplayPath: jQuery.data(oNodeSelected, "jstree").nodeDisplayPath,
        nodePath: jQuery.data(oNodeSelected, "jstree").nodePath
    };
    
    
    return oNodeJSON;
}


//------------------ Selects a node  with the specific DOM id -------------------------//
function SelectNode(nodeId){
    var nodeObj = $("#"+nodeId).val();
    $("#divTree").jstree("select_node", nodeObj, null, null); 
}



//----------- Util: fills urlParams object with the received url pamameters -------------//
function GetUrlParams() { 
    var e, 
        d = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); }, 
        q = window.location.search.substring(1), 
        r = /([^&=]+)=?([^&]*)/g; 
 
    while (e = r.exec(q)) 
       urlParams[d(e[1])] = d(e[2]); 
} 
