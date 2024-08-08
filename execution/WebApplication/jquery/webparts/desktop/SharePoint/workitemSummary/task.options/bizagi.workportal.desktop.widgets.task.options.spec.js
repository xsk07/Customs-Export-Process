/* eslint-disable no-undef */
/**
 * Unit Testing bizagi.workportal.widgets.task.options
 *
 * @author Kvn Alvarado
 */

describe("Widget bizagi.workportal.widgets.task.options", function () {
    var widget,
        workportalFacade,
        dataService;

    beforeEach(function (done) {
        $.when(checkWorkportalDependencies()).done(function () {
            workportalFacade = bizagi.injector.get("workportalFacade");
            dataService = bizagi.injector.get("dataService");
            var params = {};
            widget = new bizagi.workportal.widgets.task.options(workportalFacade, dataService, params);
            $.when(widget.areTemplatedLoaded()).done(function () {
                $.when(widget.renderContent()).done(function (html) {
                    dependencies.canvas.empty();
                    dependencies.canvas.append(html);
                    widget.postRender();
                    done();
                });
            });
            done();
        });
    });

    describe("Functions", function () {
        describe("getTaskOptions", function () {

            beforeEach(() => {
                spyOn(widget, "_wait4Render").and.callFake(() => {
                    var defer = $.Deferred();
                    defer.resolve();
                    return defer.promise();
                });

                spyOn(widget, "_start").and.callThrough();
            })

            it("should get the task options correctly", function (done) {
                var mockResponse = {
                    allowTakeOwnership: false,
                    allowRelease: false
                };
                spyOn(widget.dataService, "getTaskOptions").and.callFake(function(){
                    var defer = $.Deferred();
                    defer.resolve(mockResponse);
                    return defer;
                });

                widget.getTaskOptions('idCase', 123).done(function(res) {
                    expect(res).toEqual({
                        showCancelCase: false,
                        showTakeOwnership: false,
                        showRelease: false
                    });
                });

                mockResponse.allowRelease=true;
                mockResponse.allowTakeOwnership=false;

                widget.getTaskOptions('idCase', 123).done(function(res) {
                    expect(res).toEqual({
                        showCancelCase: false,
                        showTakeOwnership: false,
                        showRelease: true
                    });
                });

                mockResponse.allowRelease=false;
                mockResponse.allowTakeOwnership=true;

                widget.getTaskOptions('idCase', 123).done(function(res) {
                    expect(res).toEqual({
                        showCancelCase: false,
                        showTakeOwnership: true,
                        showRelease: false
                    });
                    done();
                });

            });

            it("should throw exception on incorrect response", function (done) {
                var mockResponse = {
                    allowTakeOwnership: true,
                    allowRelease: true
                };
                spyOn(widget.dataService, "getTaskOptions").and.callFake(function(){
                    var defer = $.Deferred();
                    defer.resolve(mockResponse);
                    return defer;
                });

                try {
                    widget.getTaskOptions('idCase', 123).done(function() {
                        fail("didn't throw exception");
                        done();
                    });
                } catch (e) {
                    done();
                }

            });

            it("Should call start method with the same params", () => {
                var mockResponse = {
                    allowTakeOwnership: true,
                    allowRelease: false
                };
                spyOn(widget.dataService, "getTaskOptions").and.callFake(function(){
                    var defer = $.Deferred();
                    defer.resolve(mockResponse);
                    return defer;
                });
                widget.getTaskOptions('idCase', 123);
                
                expect(widget._start).toHaveBeenCalledWith('idCase', 123);
            })

        });
    });

});
