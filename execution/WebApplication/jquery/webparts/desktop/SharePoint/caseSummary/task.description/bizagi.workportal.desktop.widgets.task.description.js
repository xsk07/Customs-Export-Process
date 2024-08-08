/**
 * Name: Bizagi Workportal Task Description
* 
* @author Kvn Alvarado
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.task.description", {}, {
    /**
     * Constructor
     */
    init: function (workportalFacade, dataService, params) {
        var self = this;
        
        // Call base
        self._super(workportalFacade, dataService, params);

        self.fromWebpart = self.params.fromWebpart || false;
        if (!self.fromWebpart) {
            //Load template
            self.loadTemplates({
                "task-description": bizagi.getTemplate("bizagi.workportal.desktop.widgets.task.description").concat("#task-description")
            });
        }else{
            self.template=self.params.template;
            if(self.template===undefined)
                throw "if is from webpart needs template param";
        }

    },

    /**
     * render tmpl depends if comes from webpart or not
     */
    getContentOnRender:function() {
        var self = this;
        var template = self.template || self.getTemplate('task-description'),
        renderParams = {
            modalForDescription: self.isNecessaryModal
        };
        return self.fromWebpart? $.tmpl(template, renderParams) : template.render(renderParams);
    },
    
    renderContent: function(){
        var self = this;
        var width = self.params.width;
        if(DOMPurify){
            self.description = DOMPurify.sanitize(self.params.description);
        }
        self.isNecessaryModal = self.isNecessaryModalForDescription(self.description, width);
        self.content = self.getContentOnRender();
        return self.content;
    },
 
    postRender: function () {
        var self = this;
        self.params.container.html(self.content);
        if (self.isNecessaryModal && self.params.classNeedsModal) {
            self.params.container.addClass(self.params.classNeedsModal);
        }
        $("#ui-bizagi-wp-project-activity-description-text", self.content).append(self.description);
        $("#ui-bizagi-wp-project-activity-description-more-button > a", self.content).click(function() {
            self.showModalDescription();
        });
        var params = {
            baseUrl: bizagi.util.getPathUrl(''),
            container: $("#ui-bizagi-wp-project-activity-description-text", self.content)[0],
            callback: self.showConfirmationMessage
        };
        bizagi.validateTrustDomains(params);
    },
    
    /**
     * show simple modal with task description content
     */
    showModalDescription: function() {
        var self = this;
        var e=$("<div id='modalDescription'></div>");
        e.append(self.description);
        e.dialog({
            show: 'fade',
            width: 600,
            height: 500,
            modal: true,
            dialogClass: "",
            closeOnEscape: true,
            draggable: false,
            title: bizagi.localization.getResource("workportal-project-casedashboard-activity-description"),
            maximize: true,
            maximized: false,
            maximizeOnly: false,
            buttons: [{
                text: bizagi.localization.getResource("workportal-widget-dialog-box-close"),
                click: function () {
                    e.dialog('close');
                }
            }],
            close: function () {
                $(this).dialog('destroy');
                $(this).detach();
            },
            resizable: false
        });
        var params = {
            baseUrl: bizagi.util.getPathUrl(''),
            container: $("#modalDescription")[0],
            callback: self.showConfirmationMessage
        };
        bizagi.validateTrustDomains(params);
    },
    /**
     * show a confirmation message when user go to another domain
     */
    showConfirmationMessage: function () {
        var message = bizagi.localization.getResource("workportal-widget-task-description-confirm-message") +" <br><strong>"+bizagi.localization.getResource("workportal-widget-task-description-do-you-want-to-continue")+"</strong>",
            title = bizagi.localization.getResource("workportal-widget-task-description-confirm-title"),
            buttons = [
                { label: bizagi.localization.getResource("workportal-general-word-cancel"), action: "reject" }, 
                { label: bizagi.localization.getResource("workportal-general-word-continue"), action: "resolve" }
            ]
        return bizagi.showConfirmationBox(message, title, true, buttons);
    },

    /**
     * validate if the description is longer to it's container
     * in BizagiModeler is saved in p > span tags each new line so, is necessary to verify between them
     * @param {string} description task description text
     */
    isNecessaryModalForDescription: function (description, width) {
        var resp=false;
        /**
         * if width is undefined return true to show a modal
         */
        if(width == undefined){
            console.error("width is undefined");
            resp = true;
        }
        if (description) {
            var container = $("<div id='description' style='border: solid; width:"+width+"px; height:200px; box-sizing: border-box; border: hidden;'></div>");
            container.append(description);
            $("body").append(container);
            if(container[0].scrollWidth > width || container[0].scrollHeight > 200) {
                resp = true;
            }
            container.remove();
        }
        return resp;
    },

    /**
     * render all the bizagi.workportal.widgets.task.description widget in each currentState of case
     * @param {Array} currentStates 
     * @param {Jquery Template} renderedTemplate container template
     */
    renderManyTasksDescription: function (currentStates, renderedTemplate) {
        var self = this;
        var newWidgets=[];
                
        for (var i = 0; i < currentStates.length; i++) {
            var taskDescriptionParams = {
                container: $("#ui-bizagi-wp-app-inbox-description-task_description_container_"+i, renderedTemplate),
                description: currentStates[i].tskDescription,
                classNeedsModal: self.params.classNeedsModal,
                width: self.params.width,
                idWorkItem: self.params.idWorkItem,
                fromWebpart: self.fromWebpart,
                template: self.template
            };
            newWidgets.push(new bizagi.workportal.widgets.task.description(self.workportalFacade, self.dataService, taskDescriptionParams));
            newWidgets[i].render();
        }
        return newWidgets;
    },

    clean: function () {
        var self = this;
        $("#ui-bizagi-wp-project-activity-description-more-button > a", self.content).unbind("click");
    }
  
 });
 
 bizagi.injector.register('bizagi.workportal.widgets.task.description', ['workportalFacade', 'dataService', bizagi.workportal.widgets.task.description]);
 