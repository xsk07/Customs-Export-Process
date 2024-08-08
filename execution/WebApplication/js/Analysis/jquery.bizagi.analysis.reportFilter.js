(function($) {
    /* Ajax url to get member list based on a search string*/
    /* --------------
        Sends through querystring the "term" parameter, which contains the characters typed by the user 
        Server must return a JSON array : [{id:XXXX, text: XXXX}, {id:XXXX, text: XXXX}, ... ]
    */
    var MULTI_SEARCH_URL = "../Ajax/AJAXGateway.aspx?action=1652";   
    
    /* Number of characters typed before sending the Ajax request for multisearch control*/
    var MULTI_SEARCH_LETTER_COUNT = 1;
    
    /* Ajax url to get member list based on parent member (to fill the tree/list)*/
    /* --------------
        Sends through querystring the "parent" parameter, which contains the id of the node to be expanded ("parent" is blank when root level is requested)
        Server must return a JSON array : [{id:XXXX, text: XXXX}, {id:XXXX, text: XXXX}, ... ]
    */
    var MULTI_TREE_URL = "../Ajax/AJAXGateway.aspx?action=1653";
    
    
    
    
    var NONE = "Ninguno";
    var NONE_IDENTIFIER = 0;
    
    /* Icons for dimension combo */ 
    var DIMENSION_ICONS = [
					        {find: '.ui-analysis-fixed-dimension', icon: 'ui-analysis-fixed-dimension'},
					        {find: '.ui-analysis-system-dimension', icon: 'ui-analysis-system-dimension'},
					        {find: '.ui-analysis-administrable-dimension', icon: 'ui-analysis-administrable-dimension'}
				          ];
    
    $.fn.extend({
        runAnalysisReportFilterPlugin : function(){
            var self = $(this);
            
            // Get filter to edit from a hidden field 
            var data;
            var index = -1;
            var value = $("#ui-analysis-report-filter-detail-values", self).val(); 
            if (value && value.length > 0){
                //Is Edit mode
                data = eval("(" + $("#ui-analysis-report-filter-detail-values", self).val() + ")");
                index = data.index;
            }
            
            // Keep index value here until dialog closes
            self.data("index", index);
            
            
            // Create tabs
            var tabContainer = $(".ui-analysis-report-filter-detail-tabs", self).tabs();   
            tabContainer.tabs( "select", 1); //By default show list/tree

            // Select current dimension in combo if Edit mode 
            if (data){
                $(".ui-analysis-report-filter-detail-selectDimension >option", self).each(function(i){
                    var dimension = eval("(" + $(this).val() + ")");
                    if (dimension.Id == data.dimension.id && dimension.IsAdministrable == data.dimension.isAdministrable){
                        $(".ui-analysis-report-filter-detail-selectDimension", self).val($(this).val());        
                    }
                });
            }
            
            //Display selected dimension description
            var oFirstSelectedDimension = getSelectedDimension();
            $(".dimensionDescription label")[0].innerHTML= oFirstSelectedDimension.Description;


            // Bind change event to dimensions combo
            $(".ui-analysis-report-filter-detail-selectDimension").change(function(){
                clearControls();
                
                var dimension = getSelectedDimension();
                
                //Display selected dimension description
                $(".dimensionDescription label")[0].innerHTML=dimension.Description;
                               
                // If the selected dimension is an attribute dimension hide first tab page
                tabContainer.tabs( "select", 1); //Always start showing list/tree
                if (dimension.IsAttributeDimension){
                    tabContainer.tabs( "option", "disabled", [0] );
                } else  {
                    tabContainer.tabs( "option", "disabled", [] );
                }
            });
            
            
            //Apply select plugin to dimensions combo
            $(".ui-analysis-report-filter-detail-selectDimension", self).selectmenu({
                style: 'dropdown',
                icons: DIMENSION_ICONS,
                maxHeight: 289            
            });
            
            
            // Apply checkbox plugin
            if (data){
                var noneSelected = false;
                for(i=0; i<data.values.length; i++){
                    if (data.values[i].id == NONE_IDENTIFIER){
                        noneSelected = true;
                    }
                }
                // Remove from collection
                data.values = $.grep(data.values, function(value) { return value.id != NONE_IDENTIFIER;});                
                $("#ui-analysis-report-filter-detail-noneCheckbox", self).attr("checked", noneSelected);
            }
            $("#ui-analysis-report-filter-detail-noneCheckbox", self).customInput();
            
            
            // Render multi-search
            renderMultiSearch($(".ui-analysis-report-filter-detail-multiSearch", self));
            
            
            // Render multi-tree
            renderMultiTree($(".ui-analysis-report-filter-detail-multiTree", self));
            if (data){
                if(data.type == "tree")
                    $(".ui-analysis-report-filter-detail-tabs", self).tabs("option", "selected", "#ui-analysis-report-filter-detail-tab-tree");
                else
                    $(".ui-analysis-report-filter-detail-tabs", self).tabs("option", "selected", "#ui-analysis-report-filter-detail-tab-search");
            }
           
           
           
            
            /*
            *   Renders the multisearch control
            */
            function renderMultiSearch(multiSearch){
                // Draw hidden value
                var multiSearchHiddenInput = $('<input type="hidden">').
                    appendTo(multiSearch);
                // Draw multi-search control    
                var multiSearchInput = $('<input class="ui-analysis-multisearch" type="text">').
                    appendTo(multiSearch);
                    
                // Convert data
                if (data && data.type == "search"){
                    var newData = [];
                    $.each(data.values, function(i){
                        newData.push({id: data.values[i].id, value: data.values[i].text });
                    });
                    data.values = newData;
                    
                    // Serialize
                    $(multiSearchHiddenInput).val(JSON.encode(data.values));
                }
                    
                // Apply token list plugin
                multiSearchInput.tokenlist({
                    items: ((data && data.type == 'search') ? data.values : []), 
                    useAutocomplete: true,
                    validate: function (item) {
                        var data = jQuery.data(multiSearch, "suggestions");

                        if (data) {
                            var validData = [];
                            for (i = 0; i < data.length; i++) {
                                validData.push(data[i].id);
                            }

                            return $.inArray(item.id, validData) >= 0;
                        }
                        return false;
                    },
                    change: function (e, items) {
                        var values = [];
                        for (i = 0; i < items.length; i++) {
                            values.push({id:items[i].id, text: items[i].value});
                        }

                        $(multiSearchHiddenInput).val(JSON.encode(values));
                    },
                    renderTokenLabel: function (item) {
                        return item.value;
                    },
                    isDuplicated: function (item, items) {
                        for (i = 0; i < items.length; i++) {
                            if (items[i].id == item.id)
                                return true;
                        }

                        return false;
                    }
                })
                .each(function () {
                    var inputControl = $(this).tokenlist('input');

                    // Apply autocomplete for token
                    inputControl.autocomplete({
                        source: function (req, add) {
                            var url  = MULTI_SEARCH_URL;
                            
                            // parse current dimension
                            var dimension = getSelectedDimension();
                            url += "&idDimension=" + dimension.Id; 
                            url += "&isAdministrable=" + dimension.IsAdministrable; 
                            
                            //pass request to server   
                            $.getJSON(url, req, function (data) {

                                //create array for response objects   
                                var suggestions = [];

                                // set data in the control
                                jQuery.data(multiSearch, "suggestions", data);

                                // process response   
                                $.each(data, function (i, val) {
                                    suggestions.push({
                                        id: val.id,
                                        label: val.text.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(req.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>"),
                                        value: val.text
                                    });
                                });
                                
                                //pass array to callback   
                                add(suggestions);
                            });
                        },
                        minLength: MULTI_SEARCH_LETTER_COUNT  /* INDICA NUMERO DE LETRAS PARA ENVIAR REQUEST*/
                    });
                    
                     // Special rendering
                    inputControl.data("autocomplete")._renderItem = function (ul, item) {
                        return $('<li class="ui-analysis-multisearch-item"></li>')
			                .data("item.autocomplete", item)
                            .append('<a><label class="ui-analysis-multisearch-item-label">' + item.label + '</label></a>')
			                .appendTo(ul);
                    };
                    
                     // Bind click event
                    inputControl.click(function () {
                        // close if already visible
                        if (inputControl.autocomplete("widget").is(":visible")) {
                            inputControl.autocomplete("close");
                            return;
                        }

                        inputControl.autocomplete("search", $(inputControl).val());
                    });
                });    
            }
         
         
            
            /*
            *   Renders the multitree control
            */
            function renderMultiTree(multiTree){
                // Draw hidden value
                var multiTreeHiddenInput = $('<input type="hidden">').
                    appendTo(multiTree);
                                        
                // Creates tree layout
                var tree = $('<div class="ui-analysis-multiTree" />')
                .append('<ul/>')
                .data("value", [])
                .appendTo(multiTree);

                // Convert data
                if (data && data.type == "tree"){
                    var newData = [];
                    
                    // Verify paths to expand automatically
                    for (i=0;i<data.values.length; i++){
                        var needToExpand = false;
                        for (j=0;j<data.values.length; j++) {
                            var paths = data.values[j].path.split(".");
                            if (paths.length > 1) {
                                for (k=0;k<paths.length; k++) {   
                                    if (paths[k] == data.values[i].id && i!=j) {
                                        needToExpand = true;
                                    }
                                }
                            }
                        }
                        newData.push( $.extend(data.values[i], {needToExpand: needToExpand}));
                    }
                    
                    data.values = newData;
                    tree.data("value", data.values);
                    
                    // Serialize data
                    serializeMultiTree();                    
                }

                // Apply plugin
                tree.tree({
                    useCheckbox: true,
                    nodeIdTemplate: '#{id}',
                    ajaxRequestParams: {
                        parent: '#{id}'
                    },
                    ajaxOptions: {
                        dataType: 'json',
                        url  : MULTI_TREE_URL
                    },
                    'node-before-load': function (e, args){
                        var url  = MULTI_TREE_URL;
                                                
                        // parse current dimension
                        var dimension = getSelectedDimension();
                        url += "&idDimension=" + dimension.Id; 
                        url += "&isAdministrable=" + dimension.IsAdministrable; 
                            
                        // Set new url    
                        args.ajaxOptions.url = url;
                    },
                    'node-before-insert': function (e, args) {
                        // Executes for each node after the json is received
                        var checked = false;
                        var needToExpand = false;
                        if (data && data.type == "tree"){
                            for(j=0; j<data.values.length; j++){
                                var selectedItem = data.values[j];
                                
                                if (selectedItem.id == args.nodeContext.id){
                                    checked = true;
                                    needToExpand = data.values[j].needToExpand;
                                    break;
                                }
                            }
                        }
                        
                        args.nodeContext.id = args.nodeContext.id;
                        args.nodeContext.text = args.nodeContext.text;
                        args.nodeContext.attrs = { remote: true, collapsed: true, checked: checked, needToExpand: needToExpand};
                    },
                    'node-check-change': function (e, args) {
                        // Executes each time a node checkbox is selected or deselected
                        var id = tree.tree("nodeAttr", args.node, "id");
                        var values = tree.data("value") || [];
                        
                        if (args.checked) {
                            // Check duplicates
                            var bFound = false;
                            for (i=0; i< values.length; i++){
                                if (values[i].id == id){
                                    bFound = true;
                                    return;
                                }
                            } 

                            // Add value
                            var text = tree.tree("nodeAttr", args.node, "text");
                            var path= tree.tree("nodeAttr", args.node, "path");
                            values.push({id : id, text: text, path: path});
                        } else {
                            // Check that exists
                            var bFound = false;
                            for (i=0; i< values.length; i++){
                                if (values[i].id == id){
                                    bFound = true;
                                    break;
                                }
                            } 
                            
                            if (!bFound) return;
                            
                            // Remove from array
                            values = $.grep(values, function(value) { return value.id != id;});                
                        }
                        tree.data("value", values);
                        serializeMultiTree();
                    }

                });
                
                /* Serializes the milti-tree into a JSON*/ 
                function serializeMultiTree() {
                    var values = tree.data("value");
                    
                    // Serialize
                    multiTreeHiddenInput.val(JSON.encode(values));
                }
            }
            
            function clearControls(){
                 // Render multi-search
                var multiSearch = $(".ui-analysis-report-filter-detail-multiSearch", self);
                var multiTree = $(".ui-analysis-report-filter-detail-multiTree", self);
            
                // Clear multi-search
                $("input[type=hidden]", multiSearch).val("");
                $(".ui-autocomplete-input", multiSearch).val("");
                $(".ui-analysis-multisearch", multiSearch).tokenlist("option", "items", [])
                $(".ui-tokenlist-item", multiSearch).detach();
                
                // Clear multi-tree
                $(".ui-analysis-multiTree", multiTree)
                    .data("value", [])
                    .tree("reloadTree");
                $("input[type=hidden]", multiTree).val("");   
                 
                    
                // Clear data values
                if(data)
                    data.values = [];
            }
            
            function getSelectedDimension(){
                var select = $("select.ui-analysis-report-filter-detail-selectDimension", self);                            
                return eval("(" + select[0].options[select[0].selectedIndex].value + ")");
            }
        }, 
        
        setAnalysisReportFilter: function(data){
            var self = $(this);
            var serializedValue = JSON.encode(data);
            $("#ui-analysis-report-filter-detail-values", self).val(serializedValue); 
        },
        
        getAnalysisReportFilter: function(){
            var self = $(this);
            var select = $("select.ui-analysis-report-filter-detail-selectDimension", self);
            var tabs = $(".ui-analysis-report-filter-detail-tabs", self);
            var multisearchdata = $(".ui-analysis-report-filter-detail-multiSearch input[type=hidden]", self);
            var multitreedata = $(".ui-analysis-report-filter-detail-multiTree input[type=hidden]", self);
            var noneCheckbox = $("#ui-analysis-report-filter-detail-noneCheckbox", self);
            
            // Read options
            var index = self.data("index");
            var dimension = eval("(" + select[0].options[select[0].selectedIndex].value + ")");
            var dimensionText = select[0].options[select[0].selectedIndex].text;
            var type = tabs.tabs( "option", "selected") == 0 ? "search" : "tree";
            var noneSelected = noneCheckbox.attr("checked") || false;
            var values = [];            
            
            // Read values
            if (type == "search") {
                if (multisearchdata.val() != "" ){
                    values = eval("(" + multisearchdata.val() + ")");
                }
                if (noneSelected) values.push({id:0, text: NONE});
            
            } else {
                if (multitreedata.val() != "" ){
                    values = eval("(" + multitreedata.val() + ")");
                }
                if (noneSelected) values.push({id:0, text: NONE, path: '0'});
            }
            
            return {    index: index, 
                        dimension:{
                            id:dimension.Id, 
                            text: dimensionText, 
                            isAdministrable: dimension.IsAdministrable, 
                            isAttributeDimension: dimension.isAttributeDimension
                        }, 
                        type: type, 
                        values: values
                   };
        }
    });    
})(jQuery);

