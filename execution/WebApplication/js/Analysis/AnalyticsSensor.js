
//------------------------------- Constants ----------------------------//

var ReportSetId = 5;
var _sensorAnalytics_TreeIconArray = ["../../img/analysis/WfClasses.png", "../../img/analysis/step_add.png", "../../img/analysis/stopwatch.png"];
var _sensorAnalytics_TreeStyleCssUrl =  "../../css/Analysis/jquery/themes/tree/apple/style.css";
var _sensorAnalytics_EditSensorsUrl = "./SensorEdit.aspx";
var _sensorAnalytics_AjaxGatewayUrl = "../Ajax/AJAXGateway.aspx";
var _SensorAnalytics_AjaxActionCode = "1616";


//----------------------------- Globals ---------------------------------//

var _SensorAnalytics_PendingLoads = 3; //sensor tree, slicer panel and timefilter (iframe)
var _SensorAnalytics_LastSelectedNodeId = "";



//------------------------------------------------------------------------ 
//Startup function
//----------------

$(function () {

    //Notice when time filter frame is ready
    $("#iframeTimeFilter").ready(function () { _SensorAnalytics_PendingLoads--; });


    //Apply tabs plugin to process sensors
    var tabContainer = $("#reportTabGroup-processSensors").tabs();
    //Layout in report screen
    var layoutOptions = {
        "west": {
            "size": 220,
            "resizable": false,
            "closable": false,
            "spacing_open": 5,
            "spacing_closed": 5
        }
    };
    $('#panelReportScreen').layout(layoutOptions);
    //Init Slicers
    SLC_InitSlicerPanel();
    --_SensorAnalytics_PendingLoads;
    //Init Sensor tree        
    InitTree();
    --_SensorAnalytics_PendingLoads;

    //Insert counter type switch radios
    CreateCounterTypeSwitchRadios();

    $("#panelReportMenu").css("display", "block");
    
});

//-------------------------------------------------------------------//

function CreateCounterTypeSwitchRadios(){

    //Add radios to switch between counter report types
    $(".divCaseCounterReports, .divAbsoluteCounterReports").each(function(){
        var self = $(this);
        
        var radioContainer = $("<div/>").addClass("sensor-radio-container").addClass("ui-widget").addClass("ui-state-default");
        
        self.prepend(radioContainer);
        
        
        var oRadio1 = $("<input type = 'radio'/>").addClass("radGoToCaseCounters");
        var oRadio2 = $("<input type = 'radio'/>").addClass("radGoToAbsoluteCounters"); 

        var oRadioLabel1 = $("<label/>").html($("#hidMsgViewCaseCounts").val());
        var oRadioLabel2 = $("<label/>").html($("#hidMsgViewAbsoluteCounts").val());
        var oSelectLabel = $("<label/>").html($("#hidMsgSelectCountType").val());

        var oHintRadio1 = $("<div/>").addClass("imgInformationHint").addClass("hintRadio1").attr("title", $("#hidDescCaseCounts").val());
        var oHintRadio2 = $("<div/>").addClass("imgInformationHint").addClass("hintRadio2").attr("title", $("#hidDescAbsoluteCounts").val());

        var oRadLine1 = $("<div/>").addClass("sensor-radio-line").append(oRadio1).append(oRadioLabel1).append(oHintRadio1);
        var oRadLine2 = $("<div/>").addClass("sensor-radio-line").append(oRadio2).append(oRadioLabel2).append(oHintRadio2);
        var oSelectLine = $("<div/>").addClass("sensor-radio-line").addClass("sensor-radio-line-title").append(oSelectLabel);
        
                
        radioContainer.append(oSelectLine);
        radioContainer.append(oRadLine1);
        radioContainer.append(oRadLine2);      
    });
    
    $(".imgInformationHint").tooltip( {
        track: true, 
        delay: 0, 
        extraClass: "sensorsToolTip", 
        top: 5, 
        left: 20,
        fade: 250 
        });
    
    
    
    
    //Disable default selected option
    $(".radGoToCaseCounters").attr("checked", "false");

    
    
    //Bind click events to switch between counter types
    $(".radGoToAbsoluteCounters").click(function(){ 
                    $(".divAbsoluteCounterReports").show(); 
                    $(".divCaseCounterReports").hide(); 
                    $(".radGoToAbsoluteCounters").attr("checked", "true");
                    $(".radGoToCaseCounters").removeAttr("checked");
                    });
                    
    $(".radGoToCaseCounters").click(function(){ 
                    $(".divAbsoluteCounterReports").hide(); 
                    $(".divCaseCounterReports").show(); 
                    $(".radGoToAbsoluteCounters").removeAttr("checked");
                    $(".radGoToCaseCounters").attr("checked", "true");
                    });
}

//------------------------------- Static sensor model: processes and sensors ----------------------------//

function GetSensorsModel(){
    var sModel = $("#hidSensorModel").val();
    var oModel = BAEval("(" + sModel + ")");
    return oModel;
}

//-------------------------------------------------------------------------
//Converts the given sensor model into json input for building tree nodes 
//---------------------------

function BuildTreeModelFromSensorModel(arrSensorsModel){

    var arrTreeNodes = [];
    
    for (var iProcessModel in arrSensorsModel){
        
        var oProcessModel = arrSensorsModel[iProcessModel];
        
        if(oProcessModel.stopwatches.length == 0 && oProcessModel.counters.length==0)
            continue;
        
        var oNodeProcess = {
                "data" : oProcessModel.name,
                "attr" : {"rel": "process", "id": 'node_proc_' + oProcessModel.id},
                "state": "closed",
                "metadata": {
                    "id" : oProcessModel.id,
                    "name": oProcessModel.name,
                    "nodeType": "process"
                },
                "children":[]
            };
        
        
        
        //Add stopwatches as subnodes for oNodeProcess
        for(var iStopwatchModel in oProcessModel.stopwatches){
            
            var oStopwatchModel= oProcessModel.stopwatches[iStopwatchModel];
            
            var oNodeStopwatch = {
                        "data": oStopwatchModel.displayName,
                        "attr": { "rel": "stopwatch", "id": 'node_stopwatch_' + oStopwatchModel.id },
                        "metadata": {"nodeType": "stopwatch", "workflowId": oProcessModel.id}
                        };
            
            //All fields in stopwatch are added as metadata in the node
            $.extend(oNodeStopwatch.metadata, oStopwatchModel); 
            
            //Add current node to process_node children set
            oNodeProcess.children.push(oNodeStopwatch);
        }
        
        
        //Add counters as subnodes for oNodeProcess
        for(var iCounterModel in oProcessModel.counters){
        
            var oCounterModel = oProcessModel.counters[iCounterModel];

            var oNodeCounter = {
                        "data": oCounterModel.displayName,
                        "attr": { "rel": "counter", "id": 'node_counter_' + oCounterModel.id },
                        "metadata": {"nodeType": "counter", "workflowId": oProcessModel.id}
                        };
            
            //All fields in stopwatch are added as metadata in the node
             $.extend(oNodeCounter.metadata, oCounterModel); 
            
            //Add current node to process_node children set
            oNodeProcess.children.push(oNodeCounter);
        
        }
        
        //Add oNodeProcess as a node in the tree
        arrTreeNodes.push(oNodeProcess);
    }
    return arrTreeNodes;    
}

//-----------------------------------------------------------
//Build the tree nodes collection 
//----------------------------

function CreateTreeNodes(){
    var arrSensorsModel = GetSensorsModel();    
    var oNodes = BuildTreeModelFromSensorModel(arrSensorsModel);
    return oNodes;
}

//---------------- Get process node id containing the given sensor Id --------------------//

function GetSensorParentProcessName(sensorId){
    
    if(sensorId == null || sensorId == "")
        return "";
    
    var arrSensorsModel = GetSensorsModel();    

    for (var iProcessModel in arrSensorsModel){        
        var oProcessModel = arrSensorsModel[iProcessModel];    
        
        if(sensorId.indexOf("node_stopwatch") >= 0){
        
            for(var iStopwatchModel in oProcessModel.stopwatches){            
                var oStopwatchModel= oProcessModel.stopwatches[iStopwatchModel];
                if(parseInt(sensorId.substr(15)) == oStopwatchModel.id)
                    return "node_proc_" + oProcessModel.id;
            }
        }
        else if(sensorId.indexOf("node_counter") >= 0){
            for(var iCounterModel in oProcessModel.counters){            
                var oCounterModel= oProcessModel.counters[iCounterModel];
                if(parseInt(sensorId.substr(13)) == oCounterModel.id)
                    return "node_proc_" + oProcessModel.id;
            }
            
        }
    }
    
    return "";
}

//------------------------------------------------------------ 
//Init jQuery tree 
//-----------------

function InitTree(){
    
    var arrNodes = CreateTreeNodes();

    //Show no-sensors-defined message if sensor model is empty
    if(arrNodes.length == 0){
        $("#divSensorTree").addClass("NoSensorsDefinedMsgRegion").html($("#hidMsgNoSensorsDefined").val());
        return;
    }
        

    var _initiallySelect = arrNodes.length > 0 ?  ( $("#hidUserQuerySensorNode").val() != '' ? $("#hidUserQuerySensorNode").val() : arrNodes[0].attr.id) : "";
    
    var _initiallyOpen = _initiallySelect != "" ?  GetSensorParentProcessName(_initiallySelect) : arrNodes.length > 0 ? arrNodes[0].attr.id : "";
    
    
    $("#divSensorTree").jstree({   
    
        "types" : {
            "types" : { 
                "process" : {
                    "icon" : { "image" : _sensorAnalytics_TreeIconArray[0] }
                }
                ,
                "counter" : {
                    "icon" : { "image" : _sensorAnalytics_TreeIconArray[1] }
                }
                ,
                "stopwatch" : {
                    "icon" : { "image" : _sensorAnalytics_TreeIconArray[2] }
                }
            }
        }
        ,
        "json_data": {
            "data": arrNodes
        }
        ,
        "core":{
            "initially_open": [_initiallyOpen]
        }
        ,        
        "ui":{
            "initially_select": [_initiallySelect]
        }
        ,        
        "themes": {
            "url": _sensorAnalytics_TreeStyleCssUrl
            },
            
        "plugins" : [ "themes", "json_data", "ui", "types" ]  
        
    });
    

    //Tree theme
    $("#divSensorTree").jstree("set_theme","apple"); 
    
    //Bind on-node-select event
    $("#divSensorTree").bind("select_node.jstree", function(e, data){
            
            var oNodeSelected = data.inst.get_selected()[0];
            
            //Do nothing if click on the current selected node
            if(oNodeSelected.id == _SensorAnalytics_LastSelectedNodeId)
                return;
            
            //Clear slicer panel whenever node changes, but at the first time (to allow for saved queries)
            if(_SensorAnalytics_LastSelectedNodeId != "")
                ClearSlicerPanel();

            _SensorAnalytics_LastSelectedNodeId = oNodeSelected.id;
            ExecuteNewSearch();            
        }        
    ); 
}


function SelectSensorFromNodeId(sensorNodeId){

    var sParentNodeName = GetSensorParentProcessName(sensorNodeId);

    $("#divSensorTree").jstree("deselect_node", "#" + sParentNodeName);
    $("#divSensorTree").jstree("open_node", "#" + sParentNodeName);
    $("#divSensorTree").jstree("select_node", "#" + sensorNodeId);
}


//------------------------------------------------------------ 
//Get selected tree node
//----------------------------

function GetSelectedTreeNode(){
    var arrSelected = $("#divSensorTree").jstree("get_selected"); 
    if(arrSelected.length > 0)
        return arrSelected[0];
    return null;
}

//------------------------------------------------------------ 
//Invoque Ajax gateway to get a new reportset result
//----------------------------


function ExecuteNewSearch(){
    
    //Avoid search if not all elements have been loaded
    if(_SensorAnalytics_PendingLoads > 0)
        return;

    //Check if time filter is ready to provide time range        
    var bFilterIsLoaded = jQuery("#iframeTimeFilter").callInside(function(){ try {return bFilterIsLoaded;} catch(ex){return false;} }  );
    if(!bFilterIsLoaded)
        return;
    
    //Omit query if no process available to filter
    if(!IsQueryAvailable())
        return;
        
    ShowHideLoadingMsg(true);


    var oParams = GetReportParameters();

    //Get complete url    
    var url =  _sensorAnalytics_AjaxGatewayUrl + "?action=" + _SensorAnalytics_AjaxActionCode + "&ReportSetId=" + ReportSetId + "&date=" + new Date()
                + "&idWorkflow=" + oParams.workflowId
                + "&idWfClass=" + oParams.wfclassId
                + "&idStopwatch=" + oParams.stopwatchId
                + "&idCounter=" + oParams.counterId
                + "&userFilters=" + oParams.userFiltersString;

    if(oParams.dateFrom != ""){
        url +=     "&dtmFrom=" + oParams.dateFrom
                +   "&dtmTo=" + oParams.dateTo
    }


    
    //Request reports
    callAjaxForReports(url, UpdateAllCharts);
}

//------------------------------------------------------------------------------------
//Ajax callback to update all charts from the resulting JSON string
//---------------------

function UpdateAllCharts(oResult){
    ShowHideLoadingMsg(false);

    //Get result data
    var oJsonResult = oResult;
    if(oJsonResult.ERROR != null){
        window.alert("Error:\n" + oJsonResult.ERROR);
        return;
    }
    
    var oParams = GetReportParameters();

    if(oParams.workflowId > 0){
        if(oParams.stopwatchId == -1 && oParams.counterId == -1 ){
            // All process sensor reports

            //Hide other report containers    
            $("#divStopwatchReports").css("display", "none");
            $("#divCounterReports").css("display", "none");

            //Show appropiate  container
            $("#reportTabGroup-processSensors").css("display", "inline-block");
            //$("#reportTabGroup-processSensors").tabs( "select", 0); //By default show counters

            //Render reports
            RenderReportFromName(oJsonResult, "His_Sw_CycleTimeSummary" , "divRep_sw_CycleTimeSummary");
            RenderReportFromName(oJsonResult, "His_Sw_LevelOfService"   , "divRep_sw_LevelOfService");

            RenderReportFromName(oJsonResult, "His_Count_Summary"       , "divRep_count_Summary");
            RenderReportFromName(oJsonResult, "His_Count_Instances"     , "divRep_count_Instances");
            RenderReportFromName(oJsonResult, "His_Count_Absolute_Summary" , "divRep_count_Summary_Absolute");
            RenderReportFromName(oJsonResult, "His_Count_Absolute_Instances" , "divRep_count_Instances_Absolute");
        }
        else if(oParams.stopwatchId >= 0){
            //Stopwatch reports

            //Hide other report conmtainers    
            $("#reportTabGroup-processSensors").css("display", "none");
            $("#divCounterReports").css("display", "none");

            //Show appropiate  container
            $("#divStopwatchReports").css("display", "inline-block");
            
            //Render reports
            RenderReportFromName(oJsonResult, "His_Sw_CycleTimeSummary_Single"       , "divRep_sw_CycleTimeSummary_Single");
            RenderReportFromName(oJsonResult, "His_Sw_LevelOfService_Single"         , "divRep_sw_LevelOfService_Single");
            RenderReportFromName(oJsonResult, "His_Sw_DurationHistogram_Single"      , "divRep_sw_DurationHistogram_Single");
            RenderReportFromName(oJsonResult, "His_Sw_DurationTrend_Single"          , "divRep_sw_DurationTrend_Single");
            RenderReportFromName(oJsonResult, "His_Sw_ActivationClosingTrend_Single" , "divRep_sw_ActivationClosingTrend_Single");            
        }    
        else{    
            //Counter reports

            //Hide other report containers    
            $("#reportTabGroup-processSensors").css("display", "none");
            $("#divStopwatchReports").css("display", "none");

            //Show appropiate  container
            $("#divCounterReports").css("display", "inline-block");

            //Render reports
            RenderReportFromName(oJsonResult, "His_Count_Summary_Single"            , "divRep_count_Summary_Single");
            RenderReportFromName(oJsonResult, "His_Count_ActivationTrend_Single"    , "divRep_count_ActivationTrend_Single");
            RenderReportFromName(oJsonResult, "His_Count_Absolute_Summary_Single" , "divRep_count_Summary_Single_Absolute");
            RenderReportFromName(oJsonResult, "His_Count_Absolute_ActivationTrend_Single" , "divRep_count_ActivationTrend_Single_Absolute");
        }
    }
}


//----------------------------- Go to EditSensors page ----------------------------------//

function EditSensors(){
    if(GetSensorsModel().length > 0){        
        window.location = _sensorAnalytics_EditSensorsUrl;    
    }
}

//------------------------------------------------------------------------------------------//

function AutoResizeIframe(oFrame){
    jQuery(oFrame).iframeAutoHeight();
}