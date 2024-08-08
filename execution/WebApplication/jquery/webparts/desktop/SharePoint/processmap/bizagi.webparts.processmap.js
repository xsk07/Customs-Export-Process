/*
*   Name: BizAgi Workportal ProcessMap Webpart
*   Author: Nessler Camargo
*/

bizagi.workportal.webparts.webpart.extend("bizagi.workportal.webparts.processmap", {}, {

	/**
	 * Constructor
	 * @param workportalFacade instance of facade, mandatory
	 * @param dataService instance of service tier, mandatory
	 * @param params extra params, its not mandatory
	 */
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call parent instance
        self._super(workportalFacade, dataService, params);
        self.instanceBizagiProcessMap = new bizagi.processMap(this);
    },
    /**
      * Render a content of the module
      * @return {string} html
      */
    renderContent: function () {
        var self = this;
		var template= self.instanceBizagiProcessMap.renderContent();
        self.content = $.tmpl(template, self.viewOptions);

        return self.content;
    },

	/**
	 * Set binding and set data
	 */
    postRender: function () {
        var self = this;
        self.instanceBizagiProcessMap.postRender();
        self.endWaiting();
    },

    /**
	 *  Binds events to handlers
	 */
    configureHandlers: function () {
        var self = this;
        self.instanceBizagiProcessMap.configureHandlers();
    },

	/**
	 * Process diagram handler
	 */
    onProcessDiagram: function () {
        var self = this;
        self.instanceBizagiProcessMap.onProcessDiagram();
    },

	/**
	 * Activity map handler
	 */
    onActivityMap: function () {
        var self = this;
        self.instanceBizagiProcessMap.onActivityMap();
    },

	/**
	 * Subprocess handler
	 */
    onSupprocess: function () {
        var self = this;
        self.instanceBizagiProcessMap.onSupprocess();
    },

	/**
	 * Manage navigation between the 3 diagrams
	 * @param template
	 * @param params
	 */
    navigationManager: function (template) {
        var self = this;
		var response = self.instanceBizagiProcessMap.navigationManager(template);
        response.container.html($.tmpl(response.template, response.viewOptions));
    },

	/**
	 * Render the process diagram in the process diagram container
	 */
    renderProcessDiagram: function () {
        var self = this;
        self.instanceBizagiProcessMap.renderProcessDiagram();
    },

    resize: function () {
        var self = this;
        self.instanceBizagiProcessMap.resize();
    },
	/**
	 * Set plugin activity map, draw sequence map
	 */
    renderActivityMap: function () {
        var self = this;
        self.instanceBizagiProcessMap.renderActivityMap();
    },

    renderSubProcessMap: function () {
        var self = this;
        self.instanceBizagiProcessMap.renderSubProcessMap();
    },

	/**
	 * Append the activity map zoom
	 */
    appendActivityMapZoom: function () {
        var self = this;
        self.instanceBizagiProcessMap.appendActivityMapZoom();
    },

	/**
	 * Append the process map zoom
	 */
    appendProcessMapZoom: function () {
        var self = this;
        self.instanceBizagiProcessMap.appendProcessMapZoom();
    },

	/**
	 * Append the subprocess zoom
	 */
    appendSubprocessZoom: function () {
        var self = this
        self.instanceBizagiProcessMap.appendSubprocessZoom();
    },
	/**
	 * Append the subprocess drag and scroll
	 */
    appendSubprocessDragScroll: function () {
        var self = this;
        self.instanceBizagiProcessMap.appendSubprocessDragScroll();

    },

	/**
	 * binds the tooltip to each activity in activity map
	 */
    bindTooltip: function (tooltipParams) {
        var self = this;
        self.instanceBizagiProcessMap.bindTooltip(tooltipParams);
    }
});