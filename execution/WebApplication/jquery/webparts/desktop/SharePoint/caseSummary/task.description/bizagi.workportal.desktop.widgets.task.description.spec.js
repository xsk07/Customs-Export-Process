/**
 * Unit Testing bizagi.workportal.widgets.task.description
 *
 * @author Kvn Alvarado
 */

describe("Widget bizagi.workportal.widgets.task.description", function () {
    var widget,
        workportalFacade,
        dataService;

    beforeEach(function (done) {
        $.when(checkWorkportalDependencies()).done(function () {
            workportalFacade = bizagi.injector.get("workportalFacade");
            dataService = bizagi.injector.get("dataService");
            done();
        });
    });

    describe("Functions", function () {
        describe("renderContent", function () {
            
            function getHtmlContent(width, height) {
                var image = '<img src="testing.jpg" width="'+width+'px" height="'+height+'px">';
                return image;
            };
            function instanceWidget(parentWidth,descriptionContent){
                var deferred = $.Deferred();
                var params = { 
                    container: $("<div></div>"),
                    description: descriptionContent,
                    width: parentWidth
                };
                widget = new bizagi.workportal.widgets.task.description(workportalFacade, dataService, params);
                $.when(widget.areTemplatedLoaded()).done(function () {
                    $.when(widget.renderContent()).done(function (html) {
                        dependencies.canvas.empty();
                        dependencies.canvas.append(html);
                        widget.postRender();
                        deferred.resolve();
                    });
                });
                return deferred.promise();
            };

            it("show the task description if descriptionContent's width is less than or equal to parentWidth and its height less than or equal to 200px", function (done) {
                var parentWidth = 320;
                var descriptionContent=getHtmlContent(width = parentWidth, height = 190);
               
                $.when(instanceWidget(parentWidth,descriptionContent)).done(function () {
                    var modal = widget.isNecessaryModalForDescription(descriptionContent, parentWidth)
                    expect(modal).toBe(false);
                    expect(widget.content.find("#ui-bizagi-wp-project-activity-description-text").length).toBe(1);
                    done();
                });
            });
            
            it("show button description if descriptionContent's width is greater to parentWidth", function (done) {
                var descriptionContent=getHtmlContent(width = 520, height = 200);
                var parentWidth = 300;
                $.when(instanceWidget(parentWidth,descriptionContent)).done(function () {
                    var modal = widget.isNecessaryModalForDescription(descriptionContent, parentWidth)
                    expect(modal).toBe(true);
                    expect(widget.content.find("#ui-bizagi-wp-project-activity-description-text").length).toBe(0);
                    expect(widget.content.find("#ui-bizagi-wp-project-activity-description-more-button").length).toBe(1);
                    done();
                });
            });

            it("show button description and console.error if parentWidth is undefined", function (done) {
                var descriptionContent=getHtmlContent(width = 520, height = 200);
                var parentWidth = undefined;
                $.when(instanceWidget(parentWidth,descriptionContent)).done(function () {
                    var modal = widget.isNecessaryModalForDescription(descriptionContent, parentWidth)
                    expect(modal).toBe(true);
                    expect(widget.content.find("#ui-bizagi-wp-project-activity-description-text").length).toBe(0);
                    expect(widget.content.find("#ui-bizagi-wp-project-activity-description-more-button").length).toBe(1);
                    done();
                });
            });

            it("show button description descriptionContent's height is greater than 200px", function (done) {
                var descriptionContent=getHtmlContent(width = 320,height = 300);
                var parentWidth = 320;
                $.when(instanceWidget(parentWidth,descriptionContent)).done(function () {
                    var modal = widget.isNecessaryModalForDescription(descriptionContent, parentWidth)
                    expect(modal).toBe(true);
                    expect(widget.content.find("#ui-bizagi-wp-project-activity-description-text").length).toBe(0);
                    expect(widget.content.find("#ui-bizagi-wp-project-activity-description-more-button").length).toBe(1);
                    done();
                });
            });
        });
    });

});
