/*
 *   Name: Bizagi Sites Render Webparts
 *   Author: Tania Hurtado
 *   Comments:
 *   -   This script will define overrides for some controls
 */

bizagi.rendering.desktop.combo.extend("bizagi.rendering.desktop.combo", {}, {

    internalComboDropDown: function (data) {
        var self = this;
        var selectTmp = {};
        var objSelected = {};

        // Remove the old list
        if (bizagi.util.isWebpartContext()) {
            $(".ui-select-dropdown.open").parent().removeClass('ac-is-visible ac-clear-floats');
        }
        $(".ui-select-dropdown.open").remove();

        /** temp templates */
        var tempCombo = "<ul>" +
            "   {{each datasource}}{{if typeof hidden == 'undefined'}}" +
            "       <li data-value='${id}'>${value}</li>{{/if}}" +
            "   {{/each}}" +
            "</ul>";

        var containerDropdown = $("<div class='ui-select-dropdown open bz-combo__list--comfortable'></div>");

        /* control reference */
        var containerControl = self.inputCombo.parents(".ui-bizagi-control").last();
        var containerRender = containerControl.closest(".ui-bizagi-render");

        var idDropdown = "dd-" + self.inputCombo.attr("id");
        var selectedValue = self.findDataByValue(self.inputCombo.val());
        var scrollPosition = 0;
        var orientation = self.properties.orientation === "rtl" ? "ui-bizagi-rtl" : "";

        //fix for QA-507 only IE
        if (navigator.userAgent.indexOf("MSIE") !== -1 || navigator.appVersion.indexOf("Trident/") > 0) {
            var contFormScroll = containerRender.closest(".ui-dialog-content");
            if (contFormScroll.length > 0) {
                contFormScroll.css("overflow-y", "hidden");
            }
        }

        data = data || self.properties.data;

        self.properties.data = data;

        self.repositionInterval;

        containerRender.addClass("ac-is-visible");
        containerControl.addClass("ac-is-visible ac-clear-floats");
        $(".ui-selectmenu", self.control).removeClass('ui-selectmenu--closed');
        containerDropdown.attr("id", idDropdown);

        for (var i = 0; i < data.length; i++) {
            if (data[i].value !== null && typeof (data[i].value) == "boolean") {
                if (bizagi.util.parseBoolean(data[i].value) === true) {
                    data[i].value = this.getResource("render-boolean-yes");
                } else if (bizagi.util.parseBoolean(data[i].value) === false) {
                    data[i].value = this.getResource("render-boolean-no");
                }
            }
        }

        if (data.length > 1000) {
            selectTmp = self.getResource("render-combo-too-many-elements");
        } else {
            selectTmp = $.tmpl(tempCombo, {datasource: data});
        }

        var dropDwn = containerDropdown.append(selectTmp);
        containerControl.append(dropDwn);

        var objParent = $(".ui-selectmenu", self.control);
        $(dropDwn).find("li:last-child").css("padding-bottom", "13px");

        var widthChild = dropDwn.width();
        var widthControl = objParent.width();

        dropDwn.width(widthControl > widthChild ? widthControl : widthChild > 200 ? 200 : widthChild);

        // Apply to combo in the modal
        if (self.isPreferencesDialog(containerRender)) {
            var containerDialog = containerRender.closest(".ui-dialog-content");
            var scrollParent = $.scrollerParent(dropDwn[0]);
            var $comboDialog = $(containerDialog);

            var top = dropDwn.offset().top - $comboDialog.offset().top;
            var left = dropDwn.offset().left - $comboDialog.offset().left;

            // Container
            var $comboWrapper = $("<div/>", {
                css: {
                    "position": "absolute",
                    "top": top,
                    "left": left
                }
            });

            $comboWrapper.attr("id", "wrapper-" + idDropdown);
            $comboWrapper.appendTo($comboDialog);
            $(dropDwn).appendTo($comboWrapper);

            // When is scrolled the content of the dialog then close the drop-down list
            $(scrollParent).off("scroll.combo").on("scroll.combo", function (evt) {
                var tg = $(evt.target);
                self.dropDownValidClose(tg, dropDwn);

                $(scrollParent).unbind("scroll.combo");
            });
        }

        dropDwn.position({
            my: "left top",
            at: "left bottom",
            of: $(".ui-selectmenu", self.control),
            collision: "fit"
        }).hide();

        dropDwn.show();

        // Fix for QA-507 only IE
        if ((navigator.userAgent.indexOf("MSIE") !== -1 || navigator.appVersion.indexOf("Trident/") > 0) && contFormScroll.length > 0) {
            contFormScroll.css("overflow-y", "auto");
        }

        //SUITE 9379 - ComboBox offset in resizing when the combobox is opened
        self.recalculateComboOffset(dropDwn, objParent);

        dropDwn.data("formWidth", containerControl.width());
        dropDwn.data("parentCombo", self.control);

        dropDwn.addClass(orientation);

        if (selectedValue !== -1 && $("li", dropDwn).length > 0) {
            //Checks if the selected element is empty string, it's normal for cascading combos
            if (selectedValue && selectedValue.id === "") {
                objSelected = $("li[data-value='']", dropDwn);
            } else {
                objSelected = $("li[data-value='" + selectedValue.id + "']", dropDwn);
            }

            if (objSelected.length !== 0) {
                objSelected.addClass("ui-selected");
                objSelected.addClass("active");

                scrollPosition = parseInt(objSelected.position().top);
                dropDwn.scrollTop(scrollPosition);
            }
        }

        dropDwn.delegate("li", "click", function () {
            var valId = $(this).data("value") ? $(this).data("value") : "";
            var val = {id: valId, value: $(this).text()};

            //Prevents stores the value twice when the element seached match with the clicked
            //It helps to keep track the last selected
            var id = self.getValue();
            id = id && id.id ? id.id : 0;

            if (val.id !== id) {
                self.onComboItemSelected(val);
            } else {
                if (val.value !== self.inputCombo.val()) {
                    self.setDisplayValue({value: val.value});
                }
            }

            //'select' will stand at first character of the string, 'focus' will stand at the last character of the string
            self.inputCombo.select();

            // Animation effect
            dropDwn.hide();
            self.dropDownDestroy(dropDwn);

            $(document).unbind("click.closecombo");
        });

        // Stop bubbling outside the dropdown
        $.makeArray(dropDwn, self.getControl()).bind("click", function (e) {
            e.preventDefault();
            return false;
        });

        $(document).one("click.closecombo", function (e) {
            var tg = $(e.target);
            $(".ui-selectmenu", self.control).addClass('ui-selectmenu--closed');
            self.dropDownValidClose(tg, dropDwn);
        });

        if (bizagi.util.isWebpartContext()) {
            var container = $('.bz-collectionnavigator-navigationform');
            if (container.length) {
                $('.ac-is-visible .ui-bizagi-container-collectionnavigator .ui-selectmenu').addClass('ui-selectmenu--closed');
                $(".ui-selectmenu", self.control).removeClass('ui-selectmenu--closed');
            }

            if (dropDwn.width() > objParent.width()) {
                dropDwn.addClass('ui-select-dropdown--border-top');
            }
    
            if (self.control.parent().position().top >= dropDwn.position().top &&
            self.control.parent().position().top <= dropDwn.position().top + dropDwn.height()) {
                dropDwn.position({
                    my: "left bottom",
                    at: "left top",
                    of: $(".ui-selectmenu", self.control),
                    collision: "fit"
                }).hide();
    
                dropDwn.addClass('ui-select-dropdown--border-top');
                dropDwn.show();
            }

            if (bizagi.util.isIE()) {
                dropDwn.css({
                    top: dropDwn.position().top - 1.21
                })
                if ((objParent.parents('.ui-bizagi-container-group').length ||
                objParent.parents('.ui-bizagi-main-section > .ui-bizagi-section-border > .ui-widget-content').length ||
                objParent.parents('.ui-bizagi-container-panel').length) &&
                !objParent.parents('.ui-bizagi-grid-table').length) {
                    dropDwn.css({
                        left: 0,
                        width: '100%'
                    })
                }
            }
            if (bizagi.util.isFirefox()) {
                if (objParent.parents('.ui-bizagi-dialog-search').length) {
                    dropDwn.css({
                        left: 0
                    })
                }
                if (!objParent.parents('.ui-dialog-content .ui-bizagi-main-section > .ui-bizagi-section-border > .ui-widget-content').length) {
                    if (objParent.parents('.ui-bizagi-container-group').length &&
                    !objParent.parents('.ui-bizagi-grid-table').length) {
                        dropDwn.css({
                            width: '100%'
                        })
                    } else {
                        dropDwn.css({
                            width: dropDwn.width() + 2
                        })
                    }
                } else if (objParent.parents('.ui-dialog-content .ui-bizagi-main-section > .ui-bizagi-section-border > .ui-widget-content').length) {
                    dropDwn.css({
                        width: dropDwn.width() + 2
                    })
                }
            }
        }
    }

});

bizagi.rendering.desktop.multiSelect.extend("bizagi.rendering.desktop.multiSelect", {}, {

    showFloatListView: function (template, data, options) {
        var self = this;
        var $control = self.getControl();
        var $containerControl = $control.closest(".ui-bizagi-control-wrapper");
        var $containerRender = $containerControl.closest(".bz-form-old-item");

        var $floatList = $.tmpl(template, data, options);
        var widthControl = self.multiSelect.width();

        $containerRender.addClass("bz-multiselect__visible");
        $containerControl.addClass("bz-multiselect__visible bz-multiselect__floats");
        $containerControl.append($floatList);

        $floatList.width(widthControl);

        $floatList.position({
            my: "left top",
            at: "left bottom",
            of: self.multiSelect,
            collision: "fit"
        }).hide();

        // Display view
        $floatList.show();

        // Stop bubbling outside the dropdown
        $floatList.on("mousedown", function (ev) {
            ev.preventDefault();
            return false;
        });

        // Add global handler to close the float view
        setTimeout(function () {
            $(document).one("mousedown.multiselect", function (evt) {
                $floatList.trigger('closeView');
            });
        }, 0);

        if (bizagi.util.isWebpartContext()) {
            if ($floatList.width() > self.multiSelect.width()) {
                $floatList.addClass('bz-multiselect__content--border-top');
            }

            $floatList.width(widthControl + 2);

            if (bizagi.util.isIE() || bizagi.util.isFirefox()) {
                $floatList.css({
                    top: $floatList.position().top - 1.21
                })

                $floatList.width(widthControl - 1);

                if (($floatList.parents('.ui-bizagi-container-group').length ||
                $floatList.parents('.ui-bizagi-main-section > .ui-bizagi-section-border > .ui-widget-content').length) &&
                !$floatList.parents('.ui-bizagi-grid-table').length) {
                    $floatList.css({
                        left: 0
                    })
                }
            }
        }

        return $floatList;
    }

});
