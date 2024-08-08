/**
 * Name: Bizagi Workportal Task Options
* 
* @author Kvn Alvarado
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.task.options", {}, {
    /**
     * Constructor
     */
    init: function (workportalFacade, dataService, params) {
        var self = this;
        
        // Call base
        self._super(workportalFacade, dataService, params);
    },

    /**
     * return a jquery promise for widgets needs taskOptions call
     * if the idWorkitem is 0 request is not necessary
     * @param {Int} idCase 
     * @param {Int} idWorkitem 
     */
    _start: function (idCase, idWorkitem) {
        var self = this,
            defer;
        if (idWorkitem === 0) {
            defer = $.Deferred();
            defer.resolve(self.pipeResponse({}));
        } else {
            defer = self.request(idCase, idWorkitem);
        }
         return defer;
    },

    /**
     * wait for render and start request
     * @param {Int} idCase 
     * @param {Int} idWorkitem 
     */
    getTaskOptions: function (idCase, idWorkitem) {
        var self = this,
            _renderDefer = self._wait4Render(true),
            _defer = new $.Deferred();

        _renderDefer.done(function() {
            self._start(idCase, idWorkitem).done(_defer.resolve);
        })
        return _defer;
    },

    /**
     * create a promise for wait for render endpoint ends
     * @param {Boolean} start if true the promise is new, false the promise resolves
     */
    _wait4Render: function(start) {
        var self = this,
            _finish = start !== true && self._wait4RenderDefer !== undefined;
        if (_finish) {
            self._wait4RenderDefer.resolve();
        }
        if (start) {
            self._wait4RenderDefer = new $.Deferred();
        }
        return self._wait4RenderDefer;
    },

    /**
     * ends to wait for render
     */
    renderEnds: function() {
        var self = this;
        self._wait4Render(false);
    },

    /**
     * make request for get taskOptions
     * @param {Int} idCase
     * @param {Int} idWorkitem 
     */
    request: function (idCase, idWorkitem) {
        var self = this,
            params = {
                idCase: idCase,
                idWorkitem: idWorkitem
            };
        return $.when(self.dataService.getTaskOptions(params)).pipe(function (data) {
            if (data.allowTakeOwnership === true && data.allowRelease === true){
                throw "can't get both allowTakeOwnership and allowTakeOwnership properties equal true";
            }
            return self.pipeResponse(data);
        });
    },

    /**
     * return the correct params or the default
     * @param {JSON} params taskOptions response
     */
    pipeResponse: function (params) {
        return {
            showTakeOwnership: params.allowTakeOwnership || false,
            showRelease: params.allowRelease || false,
            showCancelCase: params.allowCaseCancel || false,
        };
    },

    clean: function () {
        var self = this;
    }
  
 });
 
 bizagi.injector.register('bizagi.workportal.widgets.task.options', ['workportalFacade', 'dataService', bizagi.workportal.widgets.task.options]);
 