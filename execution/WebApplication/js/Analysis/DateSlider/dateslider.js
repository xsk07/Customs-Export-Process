/* Date slider element, Ajaxorized.com,  2008 */
var sliderReference;

/* Extend the date element a bit */
Date.prototype.getDiffDays = function (pODate) {
    var p_iOneDay = 1000 * 60 * 60 * 24;
    return Math.ceil((pODate.getTime() - this.getTime()) / (p_iOneDay));
};
/* The dateslider */
DateSlider = Class.create({
    initialize: function (pSBarId, pSStartDate, pSEndDate, pIStartYear, pIEndYear, options) {
        /* Initialize the dateslider object:
        * - Set the start/end days
        * - Set options
        * - Create the seperate elements of the dateslider
        */
        this.barStartDate = new Date().set({ year: pIStartYear, month: 0, day: 1 });
        this.iStartYear = pIStartYear;
        this.iEndYear = pIEndYear;
        this.barEndDate = new Date().set({ year: pIEndYear, month: 11, day: 31 });

        /* Panel dates */
        this.oStartDate = Date.parse(pSStartDate);
        this.oEndDate = Date.parse(pSEndDate);

        /* The fields (set later) */
        this.oStartField = null;
        this.oEndField = null;

        /* Create globally available reference */
        sliderReference = this;

        this.sliderBarMargin = 2;

        /* Set the start/end dates */
        var lOStartDate = Date.parse(pSStartDate);
        var lOEndDate = Date.parse(pSEndDate);

        /* The options */
        this.options = {
            dayWidth: 1,
            dragHandles: true,
            dragBar: true,
            dateFormat: 'd MMM yyyy',
            zoom: false,
            onEnd: null,
            onStart: null
        };

        Object.extend(this.options, options || {});

        this.barId = pSBarId;

        this.numberOfDays = null;
        if (this.options.dragHandles == false) this.numberOfDays = this.oStartDate.getDiffDays(this.oEndDate);
        this.centerDate = Date.today();
        if (this.options.centerDate != null) this.centerDate = Date.parse(options['centerDate']);

        this.iLeftOffsetLH = this.barStartDate.getDiffDays(lOStartDate) * this.options.dayWidth;
        this.iLeftOffsetRH = this.barStartDate.getDiffDays(lOEndDate) * this.options.dayWidth;

        this.createSliderBar(pSBarId);
        this.createHandles(pSBarId, pSStartDate, pSEndDate);
        this.createShiftPanel(pSBarId, pSStartDate, pSEndDate);

        if (this.options.zoom) this.setZoom();

    },
    createSliderBar: function (pSBarId) {
        /* Create the backgound (dategrid) :
        * - Set the width of day
        * - Loop through years/months to build the grid
        * - Make it (optionally) draggable
        */
        var sliderDayDivWidth = this.options.dayWidth;

        var lIYear = this.iStartYear;
        while (lIYear <= this.iEndYear) {
            var lOData = Date.parse('01-01-' + lIYear);
            var iDays;
            if (lOData.isLeapYear()) iDays = 366; else iDays = 365;

            var divWidth = sliderDayDivWidth * iDays;
            var lODiv = new Element('div');
            $(lODiv).addClassName('slideYear');
            $(lODiv).setStyle({
                width: (divWidth - 1) + 'px'
            });
            $(lODiv).update(lIYear);

            var iTotalDays = 0;
            (12).times(function (e) {
                var monthDivWidth = lOData.getDaysInMonth() * sliderReference.options.dayWidth;
                var l_oMonthDiv = new Element('div');
                $(l_oMonthDiv).addClassName('slideMonth');
                $(l_oMonthDiv).setStyle({
                    width: (monthDivWidth) + 'px',
                    left: iTotalDays + 'px'
                });
                if (e == 0) {
                    $(l_oMonthDiv).addClassName('firstMonth');
                } else {
                    $(l_oMonthDiv).update(lOData.toString("MMM"));
                }
                lODiv.appendChild(l_oMonthDiv);
                iTotalDays += monthDivWidth;
                lOData.addMonths(1);
            });
            $(pSBarId).appendChild(lODiv);
            lIYear++;
        }

        var browser = this.get_browser();
        var browserVersion = this.get_browser_version();

        /* Set the the right position and length */
        if ((browser === "Firefox" && browserVersion > 4) || (browser === "MSIE")) {
            var lICorrection = parseFloat($(pSBarId).parentNode.style.width) / 2;
        } else { 
            var lICorrection = $(pSBarId).parentNode.offsetWidth / 2;
        }
        var lShiftLeft = 0 - this.barStartDate.getDiffDays(this.centerDate) * sliderDayDivWidth + lICorrection;
        var lOFinishDate = Date.parse((this.iEndYear + 1) + '-01-01');
        var iBarWidth = this.barStartDate.getDiffDays(lOFinishDate);
        $(pSBarId).setStyle({ left: lShiftLeft + 'px', width: iBarWidth * sliderDayDivWidth + 'px' });

        /* Make the background grid draggable */
        if (this.options.dragBar) {
            var backdragoptions = {
                snap: this.sliderLimitPos,
                constraint: 'horizontal',
                starteffect: '',
                endeffect: '',
                zindex: '0'
            };
            var backdrag = new Draggable($(pSBarId), backdragoptions);
        }
    },
    _bgStopDrag: function () {

        //      START:EDAZC COMMENTED THIS BLOCK: It does not seem to be worth and it's causing a JS error
        //		/* Move? */		
        //		l_iDiff = $('righthandle').offsetLeft + ($('sliderbar').offsetLeft-600);
        //		
        //		if(l_iDiff > -2) {
        //		/* Move the bgbar */
        //		var l_iLeft = '-'+($('righthandle').offsetLeft-590)+'px';
        //		new Effect.Morph('sliderbar', { style: {left: l_iLeft}, duration:.5});
        //		}	
        //      END:EDAZC

        /* Call the callback function */
        if (sliderReference.options.onEnd) sliderReference.options.onEnd();
    },
    createHandles: function (p_sBarId, p_sStartDate, p_sEndDate) {
        /* Create the left and the right handle */
        var l_oLeftHandle = new Element('span', { id: 'lefthandle' });
        $(l_oLeftHandle).addClassName('leftHandle');
        $(l_oLeftHandle).setStyle({
            left: this.iLeftOffsetLH + 'px'
        });
        $(l_oLeftHandle).update('&nbsp;');
        var l_oRightHandle = new Element('span', { id: 'righthandle' });
        $(l_oRightHandle).addClassName('rightHandle');
        $(l_oRightHandle).setStyle({
            left: this.iLeftOffsetRH + 'px'
        });
        $(l_oRightHandle).update('&nbsp;');

        $(p_sBarId).appendChild(l_oLeftHandle);
        $(p_sBarId).appendChild(l_oRightHandle);

        if (this.options.dragHandles) {

            var leftHandleOptions = {
                snap: this.handleLimitPos,
                containment: p_sBarId,
                constraint: 'horizontal',
                onDrag: sliderReference._leftDrag,
                onEnd: sliderReference._leftDrag
            };
            var rightHandleOptions = {
                snap: this.handleLimitPos,
                containment: p_sBarId,
                constraint: 'horizontal',
                onDrag: sliderReference._rightDrag,
                onEnd: sliderReference._rightDrag
            };

            /* Make the left handler draggable */
            var leftdrag = new Draggable(l_oLeftHandle, leftHandleOptions);

            /* Make the right handler draggable */
            var rightdrag = new Draggable(l_oRightHandle, rightHandleOptions);
        } else {
            l_oLeftHandle.setStyle({ opacity: .01, cursor: 'pointer' });
            l_oRightHandle.setStyle({ opacity: .01, cursor: 'pointer' });
        }
    },
    dragShiftPanel: function () {
        /* Set the handlers while dragging the shiftpanel */
        $('lefthandle').setStyle({ left: ($('shiftpanel').offsetLeft - sliderReference.sliderBarMargin) + 'px' });
        if ((browser === "Firefox" && browserVersion > 4) || (browser === "MSIE")) {
            $('righthandle').setStyle({ left: ($('shiftpanel').offsetLeft + parseFloat($('shiftpanel').style.width) - sliderReference.sliderBarMargin) + 'px' });
        } else { 
            $('righthandle').setStyle({ left: ($('shiftpanel').offsetLeft + $('shiftpanel').offsetWidth - sliderReference.sliderBarMargin) + 'px' });
        }        
        sliderReference._setDates();
    },
    createShiftPanel: function (p_sBarId, p_sStartDate, p_sEndDate) {
        /* Calculate width */
        l_iBarWidth = (this.iLeftOffsetRH - this.iLeftOffsetLH) + (2 * this.sliderBarMargin);

        l_oShiftPanel = new Element('div', { id: 'shiftpanel', style: 'left:' + (this.iLeftOffsetLH) + 'px; width:' + l_iBarWidth + 'px' });
        $(p_sBarId).appendChild(l_oShiftPanel);
        var shiftPanelOptions = {
            snap: this.handleLimitPos,
            constraint: 'horizontal',
            starteffect: '',
            endeffect: '',
            zindex: '0',
            onEnd: this._bgStopDrag.bindAsEventListener(this),
            onDrag: function () {
                /* Set the handlers while dragging the shiftpanel */
                $('lefthandle').setStyle({ left: ($('shiftpanel').offsetLeft - sliderReference.sliderBarMargin) + 'px' });
                if ((browser === "Firefox" && browserVersion > 4) || (browser === "MSIE")) {
                    $('righthandle').setStyle({ left: ($('shiftpanel').offsetLeft + parseFloat($('shiftpanel').style.width) - sliderReference.sliderBarMargin) + 'px' });
                } else { 
                    $('righthandle').setStyle({ left: ($('shiftpanel').offsetLeft + $('shiftpanel').offsetWidth - sliderReference.sliderBarMargin) + 'px' });
                }                  
                sliderReference._setDates();
            },
            onStart: function () {
                if (sliderReference.options.onStart) sliderReference.options.onStart();
            }
        };
        var shiftPaneldrag = new Draggable(l_oShiftPanel, shiftPanelOptions);
    },
    sliderLimitPos: function (x, y, drag) {
        inbox = drag.element.getDimensions();
        outbox = Element.getDimensions(drag.element.parentNode);
        return [x > 0 ? 0 : (x > outbox.width - inbox.width ? x : outbox.width - inbox.width), y];
    },
    handleLimitPos: function (x, y, drag) {
        inbox = drag.element.getDimensions();
        outbox = Element.getDimensions(drag.element.parentNode);
        maxPos = drag.element.hasClassName('leftHandle') ?
            parseInt($('righthandle').style.left) - inbox.width : outbox.width - inbox.width;

        minPos = drag.element.hasClassName('rightHandle') ?
            parseInt($('lefthandle').style.left) + inbox.width : 0;
        return [x > maxPos ? maxPos : (x < minPos ? minPos : x), y];
    },
    _setDates: function () {
        /* Get the position of the handles */
        l_iLeftPos = $('lefthandle').offsetLeft / this.options.dayWidth;
        l_iRightPos = $('righthandle').offsetLeft / this.options.dayWidth;

        l_oDate = this.barStartDate.clone().addDays(l_iLeftPos);

        if (this.numberOfDays == null) {
            l_oDate2 = this.barStartDate.clone().addDays(l_iRightPos);
        } else {
            l_oDate2 = l_oDate.clone().addDays(this.numberOfDays);
        }

        if (this.oStartField && this.oEndField) {
            this.oStartField.setValue(l_oDate.toString(this.options.dateFormat));
            this.oEndField.setValue(l_oDate2.toString(this.options.dateFormat));
        }
    },
    _rightDrag: function (e, ev) {

        //      START:EDAZC ALTERED THIS BLOCK: onEndDrag function must be called after date fields are updated

        //		if(ev.type == "mouseup" && sliderReference.options.onEnd != null) sliderReference.options.onEnd();		
        //		l_panelLength = $('righthandle').offsetLeft - $('lefthandle').offsetLeft - 5;
        //		$('shiftpanel').setStyle({width : (l_panelLength+2*sliderReference.sliderBarMargin)+'px'});																	
        //		sliderReference._setDates();	

        if (ev.type != "mouseup") {
            l_panelLength = $('righthandle').offsetLeft - $('lefthandle').offsetLeft - 5;
            $('shiftpanel').setStyle({ width: (l_panelLength + 2 * sliderReference.sliderBarMargin) + 'px' });
            sliderReference._setDates();
        }
        else
            if (sliderReference.options.onEnd != null)
                sliderReference.options.onEnd();
        //      END:EDAZC ALTERED THIS BLOCK: onEndDrag function must be called after date fields are updated

    },
    _leftDrag: function (e, ev) {

        //      START:EDAZC ALTERED THIS BLOCK: onEndDrag function must be called after date fields are updated

        //		if(ev.type == "mouseup" && sliderReference.options.onEnd != null) sliderReference.options.onEnd();
        //		l_panelLength = $('righthandle').offsetLeft - $('lefthandle').offsetLeft - 4;
        //		$('shiftpanel').setStyle({left: ($('lefthandle').offsetLeft+4)+'px', width : l_panelLength+'px'});															
        //		sliderReference._setDates();		

        if (ev.type != "mouseup") {
            l_panelLength = $('righthandle').offsetLeft - $('lefthandle').offsetLeft - 4;
            $('shiftpanel').setStyle({ left: ($('lefthandle').offsetLeft + 4) + 'px', width: l_panelLength + 'px' });
            sliderReference._setDates();
        }
        else
            if (sliderReference.options.onEnd != null)
                sliderReference.options.onEnd();
        //      END:EDAZC ALTERED THIS BLOCK: onEndDrag function must be called after date fields are updated

    },
    morphTo: function (p_oDateStart, p_oDateEnd) {
        l_offsetLeftLH = this.barStartDate.getDiffDays(p_oDateStart) * this.options.dayWidth;
        l_offsetLeftRH = this.barStartDate.getDiffDays(p_oDateEnd) * this.options.dayWidth;
        l_panelLength = l_offsetLeftRH - l_offsetLeftLH - 4;
        $('lefthandle').morph('left:' + l_offsetLeftLH + 'px');
        $('righthandle').morph('left:' + l_offsetLeftRH + 'px');
        $('shiftpanel').morph('width : ' + (l_panelLength + 2 * sliderReference.sliderBarMargin) + 'px; left : ' + (l_offsetLeftLH + 2) + 'px');
    },
    attachFields: function (p_oStartField, p_oEndField) {
        var self = this;
        this.oStartField = p_oStartField;
        this.oEndField = p_oEndField;

        p_oStartField.setValue(this.oStartDate.toString(this.options.dateFormat));
        p_oEndField.setValue(this.oEndDate.toString(this.options.dateFormat));

        [p_oStartField, p_oEndField].each(function (e) {
            e.observe('blur', function () {
                //      START:EDAZC REPLACED THIS BLOCK: Date.parse should not be used here
                //				l_oStartDate = Date.parse(p_oStartField.getValue());
                //				l_oEndDate = Date.parse(p_oEndField.getValue());	
                self.setSlider(p_oStartField, p_oEndField);
            }); // en observe



            self.setSlider(p_oStartField, p_oEndField);
        }); // end each
    },

    setSlider: function (o, i) {
        l_oStartDate = getDateFromFormat(o.getValue(), sliderReference.options.dateFormat);
        l_oEndDate = getDateFromFormat(i.getValue(), sliderReference.options.dateFormat);
        //      END:EDAZC
        sliderReference.morphTo(l_oStartDate, l_oEndDate);
    },

    _removeSliderBar: function () {
        $(this.barId).update('');
    },
    zoomIn: function () {
        this._zoom(1);
    },
    zoomOut: function () {
        this._zoom(-1);
    },
    _zoom: function (p_iFactor) {
        if ((this.options.dayWidth + p_iFactor) < 1) return;
        /* Get the current dates */
        l_iLeftPos = $('lefthandle').offsetLeft / this.options.dayWidth;
        l_iRightPos = $('righthandle').offsetLeft / this.options.dayWidth;

        l_oDateStart = this.barStartDate.clone().addDays(l_iLeftPos);
        l_oDateEnd = this.barStartDate.clone().addDays(l_iRightPos);

        this._removeSliderBar();
        this.options.dayWidth = this.options.dayWidth + p_iFactor;

        this.iLeftOffsetLH = this.barStartDate.getDiffDays(l_oDateStart) * this.options.dayWidth;
        this.iLeftOffsetRH = this.barStartDate.getDiffDays(l_oDateEnd) * this.options.dayWidth;

        this.createSliderBar(this.barId);
        this.createHandles(this.barId, l_oDateStart, l_oDateEnd);

        this.createShiftPanel(this.barId, l_oDateStart, l_oDateEnd);
        this.centerBar();
    },
    setZoom: function () {
        l_oZoomIn = new Element('a')
            .addClassName('zoom')
            .setAttribute('href', '#')
            .update('zoom in')
            .observe('click', function (ev) {
                sliderReference.zoomIn();
                ev.stop();
            });

        l_oZoomOut = new Element('a')
            .addClassName('zoom')
            .setAttribute('href', '#')
            .update('zoom out')
            .observe('click', function (ev) {
                sliderReference.zoomOut();
                ev.stop();
            });


        l_oZoomPanel = new Element('div')
            .addClassName('zoomPanel');

        l_oZoomPanel.appendChild(l_oZoomIn);
        l_oZoomPanel.appendChild(document.createTextNode(' | '));
        l_oZoomPanel.appendChild(l_oZoomOut);

        $(this.barId).up().appendChild(l_oZoomPanel);
    },
    centerBar: function () {

        var l_iPanelWidth = this.iLeftOffsetRH - this.iLeftOffsetLH;
        var l_iShiftContainerWidth = $('sliderbar').up().getWidth();

        $('sliderbar').setStyle({ left: (this.iLeftOffsetLH - (2 * this.iLeftOffsetLH) + (l_iShiftContainerWidth / 2) - (l_iPanelWidth / 2)) + 'px' });
    },
    
    get_browser: function() {
        var N=navigator.appName, ua=navigator.userAgent, tem;
        var M=ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
        if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
        M=M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];
        return M[0];
    },

    get_browser_version: function() {
        var N=navigator.appName, ua=navigator.userAgent, tem;
        var M=ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
        if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
        M=M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];
        return parseFloat(M[1]);
    },

    _getOffset: function(elm, height) {
        var cStyle = elm.ownerDocument && elm.ownerDocument.defaultView && elm.ownerDocument.defaultView.getComputedStyle
            && elm.ownerDocument.defaultView.getComputedStyle(elm, null),
            ret = cStyle && cStyle.getPropertyValue(height ? 'height' : 'width') || '';
        if (ret && ret.indexOf('.') > -1) {
            ret = parseFloat(ret)
                + parseInt(cStyle.getPropertyValue(height ? 'padding-top' : 'padding-left'))
                + parseInt(cStyle.getPropertyValue(height ? 'padding-bottom' : 'padding-right'))
                + parseInt(cStyle.getPropertyValue(height ? 'border-top-width' : 'border-left-width'))
                + parseInt(cStyle.getPropertyValue(height ? 'border-bottom-width' : 'border-right-width'));
        } else {
            ret = height ? elm.offsetHeight : elm.offsetWidth;
        }
        return ret;
    },

    getOffsetWidth: function(elm) {
        return this._getOffset(elm);
    },

    getOffsetHeight: function(elm) {
        return this._getOffset(elm, true);
    }    

});