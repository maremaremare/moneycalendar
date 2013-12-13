/**
 * Frontier JQuery Full Calendar Plugin.
 *
 * June 24, 2010 - v1.3.2 - Bug fix in getAgendaItemByDataAttr(). I suck...
 * June 23, 2010 - v1.3.1 - Bug fix in deleteAgendaItemByDataAttr() function, and new reRenderAgendaItems() function!
 * June 22, 2010 - v1.3   - Tooltip support. Additional callbacks, applyAgendaTooltipCallback, agendaDragStartCallback,
 *						    and agendaDragStopCallback.
 * June 17, 2010 - v1.2   - Drag-and-drop, CSS updates, allDay event option.
 * June 14, 2010 - v1.1   - Few bug fixes, tweaks, and basic VEVENT ical support.
 * June 09, 2010 - v1.0   - Initial version.
 *
 * Seth Lenzi
 * slenzi@gmail.com
 *
 * This plugin is free. Do with it as you want. I claim no responsibility if it explodes and ruins your day. ;)
 *
 * MIT License - http://en.wikipedia.org/wiki/MIT_License
 *
 * Dependencies:
 *
 * This plugin requires the following javascript libraries.
 *
 * 1) JQuery Core and JQuery UI.
 *    For IE you need to use the inlcuded modified version of jQuery Core, js/jquery-core/jquery-1.4.2-ie-fix.min.js for drag-and-drop.
 *    Drag-and-drop works fine in Chrome, Opera, Firefox, and Safari using unmodified jQuery core. For more info read the txt file
 *    that should have been included with this plugin at js/jquery-core/README-IE-FIX.TXT
 *    http://jquery.com/
 *    http://jqueryui.com
 *
 * 2) jshashtable.js
 *    Should be included with this plugin in the js/lib/ folder.
 *    Tim Down
 *    http://code.google.com/p/jshashtable/
 *    http://www.timdown.co.uk/jshashtable/index.html
 *
 ******************************************************
 **** These last ones are already inlcued in this file.
 ******************************************************
 *
 * 3) WResize is the jQuery plugin for fixing the IE window resize bug.
 *    This plugin is already included at the end of this file.
 *    Copyright 2007 / Andrea Ercolino
 *    LICENSE: http://www.opensource.org/licenses/mit-license.php
 *    WEBSITE: http://noteslog.com/
 *
 * 4) Javascript iCal parsers. Merci!
 *    This is already included in this file.
 *    http://code.google.com/p/ijp/
 */
(function(jQ_old) {

    // keep track of options for each instance
    var allOptions = new Array();

    // using jshashset.js library
    var myCalendars = new Hashtable();

    /**
     * String startsWith function.
     */
    String.prototype.startsWith = function(str) {
        return (this.match("^" + str) == str);
    }


    /**
     * One day cell in the calendar.
     *
     * @param jqyObj - (JQuery object) - Reference to the day cell <div/> element.
     */

    function CalendarDayCell(jqyObj) {

        // jquery object that reference one day cell <div/> 
        this.jqyObj = jqyObj;

        // A Date object with the year, month, and day set for this day cell.
        this.date = null;


        this.textvalue = null;

        this.summ = null;

        /*
		All the agenda <div> elements being rendered over this day cell.
		keys are integers (agenda ID), values are jquery objects (agenda <div> elements)
		*/
        //this.agendaDivHash = new Hashtable();


        // add css class
        this.addClass = function(c) {
            this.jqyObj.addClass(c);
        };

        // remove class, or all classes
        this.removeClass = function(name) {
            if (name != null && name != "") {
                this.jqyObj.removeClass(name);
            } else {
                this.jqyObj.removeClass();
            }
        };

        // /**
        //  * Add the "more" link div and renders it. If you add a more link and one is already there
        //  * than the existing one is removed and the new one is added.
        //  */
        // this.addMoreDiv = function(element){
        // 	if(this.jqyMoreDiv == null){
        // 		this.jqyMoreDiv = element;
        // 		this.appendHtml(element);
        // 	}else{
        // 		this.jqyMoreDiv.remove();
        // 		this.jqyMoreDiv = element;
        // 		this.appendHtml(element);
        // 	}
        // };

        // /**
        //  * Checks to see if this day cell already has a "more" div link.
        //  *
        //  * @return true or false
        //  */
        // this.hasMoreDiv = function(){
        // 	if(this.jqyMoreDiv != null){
        // 		return true;
        // 	}
        // 	return false;
        // };

        /**
         * set the date for this day cell
         *
         * @param Date object with year, month, and day set.
         */



        this.setSumm = function(value) {
        	this.summ = value;
        }

        this.getSumm = function() {
        //	console.log(this.summ)
        	return this.summ;
        }

        this.updateWeekSum = function() {
        elem = $('#summs').children().eq(this.getYCoord() - 1)
        var newHtml;
      //  console.log(elem)
        if (elem.html()) {
        	newHtml = parseInt(elem.html()) + parseInt(this.getSumm())
        } else {
        	newHtml = parseInt(this.getSumm())
        }
        
       // console.log(newHtml)
        elem.html(newHtml)
       // console.log('updateWEEkSUUMMMWORKS')
        }

        this.setValue = function(value) {
        	this.htmlvalue = value;
        }

        this.getValue = function() {
        	return this.htmlvalue;
        }

        /**
         * set the date for this day cell
         *
         * @param Date object with year, month, and day set.
         */
        this.setDate = function(date) {
            this.date = date;
        };



        /**
         * get the date for this day cell
         *
         * @return Date object.
         */
        this.getDate = function() {
            return this.date;
        };

        this.setXCoord = function(x) {
            this.XCoord = x;

        };

        this.getXCoord = function() {
            return this.XCoord;
        };

        this.setYCoord = function(y) {
            this.YCoord = y;
        };

        this.getYCoord = function() {
            return this.YCoord;
        };

        /*
		get height of cell
		*/
        this.getHeight = function() {
            return this.jqyObj.height();
        };

        /*
		set height of cell
		*/
        this.setHeight = function(h) {
            this.jqyObj.height(h);
        };

        /*
		width, not inlcuding padding. @see jquery.width() method
		*/
        this.getWidth = function() {
            return this.jqyObj.width();
        };

        // set width
        this.setWidth = function(w) {
            this.jqyObj.width(w);
        };

        /*
		width, inlcuding paddings @see jquery.innerWidth() method
		*/
        this.getInnerWidth = function() {
            return this.jqyObj.innerWidth();
        };

        /*
		return inner width plus width of left & right border
		*/
        this.getInnerWidthPlusBorder = function() {
            return this.jqyObj.outerWidth();
        };

        /*
		get x coord of upper left corner
		*/
        this.getX = function() {
            return this.jqyObj.position().left;
        };

        /*
		get y coord of top left corner
		*/
        this.getY = function() {
            return this.jqyObj.position().top;
        };

        /*
		set html
		*/
        this.setHtml = function(htmlData) {
            this.jqyObj.html(htmlData);
        };

        /*
		append html
		*/
        this.appendHtml = function(htmlData) {
            this.jqyObj.append(htmlData);
        };
        /*
        append li
        */

        this.appendLi = function(htmlData) {
        	this.jqyObj.append($('<li>'+htmlData+'</li>'))
        }
        /*
		clear html
		*/
        this.clearHtml = function() {
            this.setHtml("");
        };

        /*
		get html
		*/
        this.getHtml = function() {
            return this.jqyObj.html();
        };

        /*
		set css value
		*/
        this.setCss = function(attr, value) {
            this.jqyObj.css(attr, value);
        };

        /*
		get css value
		*/
        this.getCss = function(attr) {
            return this.jqyObj.css(attr);
        };

        /*
		set attribute value
		*/
        this.setAttr = function(id, value) {
            this.jqyObj.attr(id, value);
        };

        /*
		get attribute value
		*/
        this.getAttr = function(id) {
            return this.jqyObj.attr(id);
        };

        /*
		add a click event callback function to this day cell.
		the event object from the click will have the day object and date for the day
		e.g. var dayDate = eventObj.data.calDayDate;
		*/
        this.addClickHandler = function(handler) {
            this.jqyObj.bind(
                "click", {
                    //calDayObj:this,
                    calDayDate: this.date,
                    x: this.XCoord,
                    y: this.YCoord,
                    html: this.htmlvalue,
                    text: this.textvalue,
                    summ: this.summ,
                    summ_array: this.summ_array
                },
                handler
            );
        };
    };

    /**
     * One header cell in the calendar header.
     *
     * @param jqyObj - (JQuery object) - Reference to a header cell <div/> element.
     */

    function CalendarHeaderCell(jqyObj) {

        // jquery object that reference one header cell <div/> in the header <div/> 
        this.jqyObj = jqyObj;

        this.addClass = function(c) {
            this.jqyObj.addClass(c);
        };

        this.setHtml = function(htmlData) {
            this.jqyObj.html(htmlData);
        };

        this.getHtml = function() {
            return this.jqyObj.html();
        };

        this.setCss = function(attr, value) {
            this.jqyObj.css(attr, value);
        };

        this.getCss = function(attr) {
            return this.jqyObj.css(attr);
        };

        this.setAttr = function(id, value) {
            this.jqyObj.attr(id, value);
        };

        this.getAttr = function(id) {
            return this.jqyObj.attr(id);
        };

        this.getX = function() {
            return this.jqyObj.position().left;
        };

        this.getY = function() {
            return this.jqyObj.position().top;
        };

        /*
		get height of cell
		*/
        this.getHeight = function() {
            return this.jqyObj.height();
        };

        /*
		set height of cell
		*/
        this.setHeight = function(h) {
            this.jqyObj.height(h);
        };

        /*
		width, not inlcuding padding. @see jquery.width() method
		*/
        this.getWidth = function() {
            return this.jqyObj.width();
        };

        // set width
        this.setWidth = function(w) {
            this.jqyObj.width(w);
        };

        // width, inlcuding padding
        this.getInnerWidth = function() {
            return this.jqyObj.innerWidth();
        };

        // return inner width plus width of left & right border
        this.getInnerWidthPlusBorder = function() {
            return this.jqyObj.outerWidth();
        };

    };

    /**
     * One week header cell in the calendar week header.
     *
     * @param jqyObj - (JQuery object) - Reference to a week header cell <div/> element.
     */

    function CalendarWeekHeaderCell(jqyObj) {

        // jquery object that reference one week header cell <div/> in the week header <div/> 
        this.jqyObj = jqyObj;

        // A Date object with the year, month, and day set for this day cell.
        this.date = null;

        this.addClass = function(c) {
            this.jqyObj.addClass(c);
        };

        /**
         * set the date for this day cell
         *
         * @param Date object with year, month, and day set.
         */
        this.setDate = function(date) {
            this.date = date;
        };

        /**
         * get the date for this day cell
         *
         * @return Date object.
         */
        this.getDate = function() {
            return this.date;
        };

        this.setHtml = function(htmlData) {
            this.jqyObj.html(htmlData);
        };

        this.getHtml = function() {
            return this.jqyObj.html();
        };

        this.setCss = function(attr, value) {
            this.jqyObj.css(attr, value);
        };

        this.getCss = function(attr) {
            return this.jqyObj.css(attr);
        };

        this.setAttr = function(id, value) {
            this.jqyObj.attr(id, value);
        };

        this.getAttr = function(id) {
            return this.jqyObj.attr(id);
        };

        this.getX = function() {
            return this.jqyObj.position().left;
        };

        this.getY = function() {
            return this.jqyObj.position().top;
        };

        /*
		get height of cell
		*/
        this.getHeight = function() {
            return this.jqyObj.height();
        };

        /*
		set height of cell
		*/
        this.setHeight = function(h) {
            this.jqyObj.height(h);
        };

        /*
		width, not inlcuding padding. @see jquery.width() method
		*/
        this.getWidth = function() {
            return this.jqyObj.width();
        };

        // set width
        this.setWidth = function(w) {
            this.jqyObj.width(w);
        };

        // width, inlcuding padding
        this.getInnerWidth = function() {
            return this.jqyObj.innerWidth();
        };

        // return inner width plus width of left & right border
        this.getInnerWidthPlusBorder = function() {
            return this.jqyObj.outerWidth();
        };

        // add a click event callback function to this day cell.
        // the event object from the click will have the day object and date for the day
        // e.g. var dayDate = eventObj.data.calDayDate;
        this.addClickHandler = function(handler) {
            this.jqyObj.bind(
                "click", {
                    calDayDate: this.date
                },
                handler
            );
        };

    };

    /**
     * Calendar header object. Contains a collection of CalendarHeaderCell objects.
     *
     * @param jqyObj - (JQuery object) - Reference to the header <div/> element.
     */

    function CalendarHeader(jqyObj) {

        // jquery object that reference the calendar header <div/>
        this.jqyObj = jqyObj;

        // all CalendarHeaderCell objects in the header
        this.headerCells = new Array();

        // append CalendarHeaderCell object to the header
        this.appendCalendarHeaderCell = function(calHeaderCell) {
            // push is not supported by IE 5/Win with the JScript 5.0 engine
            this.headerCells.push(calHeaderCell);
            this.jqyObj.append(calHeaderCell.jqyObj);
        };

        // returns an array of CalendarHeaderCell objects
        this.getHeaderCells = function() {
            return this.headerCells;
        }

        this.setHtml = function(htmlData) {
            this.jqyObj.html(htmlData);
        };

        this.getHtml = function() {
            return this.jqyObj.html();
        };

        this.setCss = function(attr, value) {
            this.jqyObj.css(attr, value);
        };

        this.getCss = function(attr) {
            return this.jqyObj.css(attr);
        };

        this.setAttr = function(id, value) {
            this.jqyObj.attr(id, value);
        };

        this.getAttr = function(id) {
            return this.jqyObj.attr(id);
        };

        // set width of the calendar header <div/>
        this.setWidth = function(w) {
            this.jqyObj.width(w);
        }

    };

    /**
     * Calendar week header object. The row above each CalendarWeek object. Shows the day numbers.
     * Contains a collection of CalendarWeekHeaderCell objects.
     *
     * @param jqyObj - (JQuery object) - Reference to the week header <div/> element.
     */

    function CalendarWeekHeader(jqyObj) {

        // jquery object that reference the week header <div/>
        this.jqyObj = jqyObj;

        // all CalendarWeekHeaderCell objects in the week header
        this.weekHeaderCells = new Array();

        // append a CalendarWeekHeaderCell object
        this.appendCalendarWeekHeaderCell = function(weekHeaderCell) {
            // push is not supported by IE 5/Win with the JScript 5.0 engine
            this.weekHeaderCells.push(weekHeaderCell);
            this.jqyObj.append(weekHeaderCell.jqyObj);
        };

        // returns an array of CalendarWeekHeaderCell objects
        this.getHeaderCells = function() {
            return this.weekHeaderCells;
        }

        this.setHtml = function(htmlData) {
            this.jqyObj.html(htmlData);
        };


        this.getHtml = function() {
            return this.jqyObj.html();
        };

        this.setCss = function(attr, value) {
            this.jqyObj.css(attr, value);
        };

        this.getCss = function(attr) {
            return this.jqyObj.css(attr);
        };

        this.setAttr = function(id, value) {
            this.jqyObj.attr(id, value);
        };

        this.getAttr = function(id) {
            return this.jqyObj.attr(id);
        };

        // set width of the calendar week header <div/>
        this.setWidth = function(w) {
            this.jqyObj.width(w);
        }
    };

    /**
     * Calendar week object. One row in the calendar (7 days). Contains a collection of CalendarDayCell objects.
     *
     * @param jqyObj - (JQuery object) - Reference to the week <div/> element.
     */

    function CalendarWeek(jqyObj) {

        // jquery object that reference the week <div/>
        this.jqyObj = jqyObj;

        // all CalendarDayCell objects in the week
        this.days = new Array();

        // append a CalendarDayCell object
        this.appendCalendarDayCell = function(calDayCell) {
            // push is not supported by IE 5/Win with the JScript 5.0 engine
            this.days.push(calDayCell);
            this.jqyObj.append(calDayCell.jqyObj);
        };

        // returns an array of CalendarDayCell objects
        this.getDays = function() {
            return this.days;
        }

        this.setHtml = function(htmlData) {
            this.jqyObj.html(htmlData);
        };

        this.getHtml = function() {
            return this.jqyObj.html();
        };

        this.setCss = function(attr, value) {
            this.jqyObj.css(attr, value);
        };

        this.getCss = function(attr) {
            return this.jqyObj.css(attr);
        };

        this.setAttr = function(id, value) {
            this.jqyObj.attr(id, value);
        };

        this.getAttr = function(id) {
            return this.jqyObj.attr(id);
        };

        // set width of the calendar header <div/>
        this.setWidth = function(w) {
            this.jqyObj.width(w);
        }
    };

    /**
     * Calendar object. Initializes to the current year & month.
     *
     * @param jqyObj - (JQuery object) - Reference to the calendar <div/> element.
     */

    function Calendar() {

        // this value is set when Calendar.initialize(calElm,date) is called
        this.jqyObj = null;

        // reference to the CalendarHeader object
        this.calHeaderObj = null;

        // all CalendarWeek objects in the calendar
        this.weeks = new Array();

        // all buildCalendarWeekHeader objects in the calendar
        this.weekHeaders = new Array();

        // by default the calendar will display the current month for the current year
        this.displayDate = new Date();

        // hash for storing agenda items. Uses jshashtable.js library. See notes at top of file.
        this.agendaItems = new Hashtable();

        // turn drag-and-drop on or off.
        this.dragAndDropEnabled = true;

        /*
		we already store all the CalendarDayCell objects inside the CalendarWeek objects
		but we use this hash because in many instances we want to be able to grab a
		particular day object as quickly as possible.
		keys = strings in the form of YYYYMMDD
		values = CalendarDayCell objects
		*/
        this.dayHash = new Hashtable();

        // the callback function that's triggered when users click a day cell div
        this.clickEvent_dayCell = null;
        // the callback function that's triggered when users click an agenda div item
        this.clickEvent_agendaCell = null;
        // the callback function that's triggered when users drop an agenda div element into a day cell (drag-and-drop)
        this.dropEvent_agendaCell = null;
        // the callback function that's triggered when users mouse oever an agenda div item
        this.mouseOverEvent_agendaCell = null;
        // optional callback where users can apply a tooltip to the agenda item div element
        this.callBack_agendaTooltip = null;
        // the callback function that's triggered when a drag event starts on an agenda div element.
        this.dragStart_agendaCell = null;
        // the callback function that's triggered when a drag event stops on an agenda div element.
        this.dragStop_agendaCell = null;

        // each CalendarAgendaitem added to this calendar gets an ID. We'll increment this ID for each agendar item added.
        this.agendaId = 1;

        // default values...
        this.cellBorderWidth = 1; // border of all cells
        this.dayCellHeaderCellHeight = 17; // height of day cell header cell (in week header)
        this.agendaItemHeight = 15; // height of agend item cell

        // by default we make the day cell heights the same as the day cell widths (minus the day cell week header height.)
        // we can change this behavior with this variable. This value can be anything between 0 and 1. A value of 0.5
        // would make the day cells half as tall as they are wide. 
        this.aspectRatio = 1;

        /**
         * Builds the calendar data. This function must be called after new Calendar() in created
         *
         * @param calElm - A jquery object for the calendar <div/> element.
         * @param date - A datejs Date object. The calendar will be set to the year and month of the date.
         * @param dayCellClickHandler - A Function that's triggered when users click a day cell div element.
         * @param agendaCellClickHandler - A Function that's triggered when users click an agenda div element
         * @param agendaCellDropHandler - A Function that's triggered when users drop an agenda div element into a day cell div element.
         * @param dragAndDrop - boolean - True to enable dra-and-drop, false to disable.
         * @param agendaCellMouseoverHandler - A Function that's triggered when users mouse over an agenda div element.
         * @param agendaTooltipHandler - A callabck function where users can apply their tooltip to the agenda div elements.
         * @param agendaCellDragStartHandler - A Function that's triggered when a drag event starts on an agenda div element.
         * @param agendaCellDragStopHandler - A Function that's triggered when a drag event stops on an agenda div element.
         */
        this.initialize = function(
            calElm,
            date,
            dayCellClickHandler
        ) {

            this.jqyObj = calElm;
            this.displayDate = date;
            this.clickEvent_dayCell = dayCellClickHandler;
            this.do_init();

        };

        /**
         * Called by Calendar.initialize(). The real work happens here.
         */
        this.do_init = function() {


            // clear header & weeks & week headers but don't clear agenda items.
            this.clear(false);

            // build header
            var calHeaderCell;
            var calHeader = this.buildCalendarHeader();
            for (var dayIndex = 0; dayIndex < Calendar.dayNames.length; dayIndex++) {
                calHeaderCell = this.buildCalendarHeaderCell();
                calHeaderCell.setHtml("&nbsp;" + Calendar.dayNames[dayIndex]);
                calHeader.appendCalendarHeaderCell(calHeaderCell);
                if (dayIndex == 6) {
                    calHeaderCell.addClass("JFrontierCal-Header-Cell-Last");
                }
            }
            this.addHeader(calHeader);

            // initialize some variables we'll use for building the weeks and week headers

            // todays date
            var today = new Date();
            // year number for this date
            var currentYearNum = this.getCurrentYear();
            // month number for this date
            var currentMonthNum = this.getCurrentMonth();
            //нормальное представление месяца
            var currentMonthDisplay = currentMonthNum + 1;
            // day number for this date
            var currentDayNum = today.getDate();
            // number of days in this month
            var daysInCurrentMonth = this.getDaysCurrentMonth();
            // number of days in the previous month
            var daysInPreviousMonth = this.getDaysPreviousMonth();
            // number of days in the next month
            var daysInNextMonth = this.getDaysNextMonth();
            // Date object set to first day of the month
            var dtFirst = new Date(this.getCurrentYear(), this.getCurrentMonth(), 1, 0, 0, 0, 0);
            // Date object set to last day of the month
            var dtLast = new Date(this.getCurrentYear(), this.getCurrentMonth(), daysInCurrentMonth, 0, 0, 0, 0);
            // index within the week of the first day of the month
            var firstDayWkIndex = dtFirst.getDay()-1; // -1 чтобы первым днем был понедельник

             if (firstDayWkIndex == -1){ //исправляем отрицательный индекс воскресения на шестой
            	firstDayWkIndex = 6
            }
            // inidex within the week of the last day of the month
            var lastDayWkIndex = dtLast.getDay()-1; // -1 чтобы первым днем был понедельник


            if (lastDayWkIndex == -1){ //исправляем отрицательный индекс воскресения на шестой
            	lastDayWkIndex = 6 
            }

            var showTodayStyle = ((today.getFullYear() == currentYearNum && today.getMonth() == currentMonthNum) ? true : false);

            var correctedFirstDayWkIndex = firstDayWkIndex
            //get data from django

            var firstDayPrevMonth = (daysInPreviousMonth - firstDayWkIndex) + 1;
           // console.log(firstDayPrevMonth, daysInPreviousMonth, firstDayWkIndex)
            var firstDate;
            var lastDate;

            function getZeroStr(a) {
            	return ('0' + (parseInt(a))).slice(-2);
            }
            var f_year;
            var f_month;
            var f_day;
            var l_year;
            var l_month;
            var l_day;

            if (daysInPreviousMonth != 0) { //если есть дни из прошлого месяца


            	f_year = currentYearNum
            	f_month = currentMonthDisplay - 1 //это ПРОШЛЫЙ месяц
            	if (f_month == 12) { //если это прошлый декабрь
                f_year = currentYearNum-1
            	}
            	f_day = firstDayPrevMonth

            	//firstDate = parseInt(currentYearNum)+'-'+getZeroStr(currentMonthNum)+'-'+getZeroStr(firstDayPrevMonth);
            } else {
            	f_year = currentYearNum;
            	f_month = currentMonthDisplay;
            	f_day = 1
            }
            
             firstDate = parseInt(f_year)+'-'+getZeroStr(f_month)+'-'+getZeroStr(f_day);

            if (daysInNextMonth != 0) {//если есть дни из будущего месяца

            	l_year = currentYearNum
            	l_month = currentMonthDisplay + 1 
            	if (l_month == 13) { 
            		l_month = 1
            		l_year = currentYearNum+1
            	}
            	l_day = 6 - lastDayWkIndex;

            } else {
            	l_year = currentYearNum
            	l_month = currentMonthDisplay
            	l_day = daysInCurrentMonth
            	
            }

            lastDate = parseInt(l_year)+'-'+getZeroStr(l_month)+'-'+getZeroStr(l_day);

            var answer;
            var dates_array=[];

            var url = 'api/v1/entry/?date__gt='+firstDate+'&date__lt='+lastDate;
            jQuery.ajax({
                url: url,
                type: 'GET',
                success: function(data) {
                    answer = data
                  //  console.log(answer);
                },
                async: false,
            });
             len = answer.objects.length
     
           // for (i = 0; i<len; i++) {
            	//console.log('baaa');
               // dates_array.push([answer.objects[i].date, answer.objects[i].summ, answer.objects[i].text])
            	//console.log(answer.objects[i].summ)
            //}

            


            // number of day cells that appear on the calendar (days for current month + any days from 
            // previous month + any days from next month.) No more than 42 days, (7 days * 6 weeks.)
            var totalDayCells = daysInCurrentMonth + firstDayWkIndex;
            if (lastDayWkIndex > 0) {
                totalDayCells += Calendar.dayNames.length - lastDayWkIndex - 1;
            }
            // number of week cells (rows) that appear on the calendar
            // this is also the number of week headers since each week has a header
            var numberWeekRows = Math.ceil(totalDayCells / Calendar.dayNames.length);

            // the day number that appears in each week header cell
            var dayNum = 1;
            // the Date object to be store in each CalendarDayCell object & CalendarWeekHeaderCell object
            // when users click a day cell or week header cell they can get access to this date cause we 
            // store it in the elements data (see jquery data() function)
            var dt = null;

            // when we display a month we can see a few days from the previous month on the calendar. This is the
            // day number of the earliest day we can see of the previous month.
            var firstDayPrevMonth = (daysInPreviousMonth - firstDayWkIndex) + 1;

            // build CalendarWeekHeader & CalendarWeek object for the first week row in the calenar
            var calDayCell;
            var calWeekObj;
            var calWeekHeaderCellObj;
            var calWeekHeaderObj;

        function updateMonthSum() {
        var monthSum = 0
        $('#summs').children().each(function() {
            monthSum += parseInt($(this).html())
            //console.log($(this).html())
        })

        $('#monthSum').html(monthSum);

    }


           function setData(dt_str,calDayCell){
           	            s_a = []
           	            var summ_array = {}
           	            var summ = 0;
           	            var html = ''
           	            for (var i in answer.objects) {
                    if (answer.objects[i].date == dt_str) {
                    	//console.log(answer.objects[i])

                    	s_a.push(parseInt(answer.objects[i].summ))

                    	summ+=answer.objects[i].summ
                    	str = answer.objects[i].expense.name+'  '+answer.objects[i].expense.category.name+'  '+answer.objects[i].summ
                    	li = '<li class="expense"><div class="ddd">'+str+'</div></li>'

                    	html+=li 

                    	//calDayCell.setValue(str)
                    	//calDayCell.jqyObj.data("value", str);

                    }

                    for (var i in s_a) {
                    	summ_array[i] = s_a[i]
                    }

}
                    calDayCell.summ_array = summ_array;
                    if (summ > 0) {
                     calDayCell.summ_array = summ_array;
                     calDayCell.setHtml(summ)
                     calDayCell.setSumm(summ)
                     calDayCell.updateWeekSum();
                     updateMonthSum()

                    }

                    if (html != '') {
                    	calDayCell.setValue(html)
                    	//calDayCell.jqyObj.data("value", html);
                    }
           }
            summDiv = '<div class="sum">0</div>'
            $('#summs').append(summDiv)
            calWeekObj = this.buildCalendarWeek(); // week <div/>
            calWeekHeaderObj = this.buildCalendarWeekHeader(); // week header <div/>
            for (var dayIndex = 0; dayIndex < Calendar.dayNames.length; dayIndex++) {
                calDayCell = this.buildCalendarDayCell();
                calDayCell.setXCoord(dayIndex + 1);
                calDayCell.setYCoord(1);

               // console.log(calDayCell.getHtml()); //"<input type='text' data-role='tagsinput'></input>");

                calWeekHeaderCellObj = this.buildCalendarWeekHeaderCell();
                if (dayIndex < firstDayWkIndex) {
                    // previous month
                    dt = new Date(currentYearNum, (currentMonthNum - 1), firstDayPrevMonth, 0, 0, 0, 0);
                    dt_str = parseInt(currentYearNum)+'-'+getZeroStr(currentMonthNum)+'-'+getZeroStr(firstDayPrevMonth)
                    setData(dt_str, calDayCell);
                    //calDayCell.updateWeekSum();
                    ///updateWeekSum(clickData, summ)



                    calDayCell.setDate(dt);
                    calWeekHeaderCellObj.setDate(dt);
                    calWeekHeaderCellObj.setHtml(firstDayPrevMonth + "&nbsp;");
                    calDayCell.addClass("JFrontierCal-PrevMonth-Day-Cell");
                    //console.log(calDayCell.getSumm())
                    //calDayCell.setHtml(calDayCell.getSumm())
                    //здесь!
                    //calDayCell.setHtml('<input type="text" data-role="tagsinput"></input>');
                    calWeekHeaderCellObj.addClass("JFrontierCal-PrevMonth-Week-Header-Cell");


                    firstDayPrevMonth += 1;
                } else {
                    // this month
                    dt = new Date(currentYearNum, currentMonthNum, dayNum, 0, 0, 0, 0);
                    dt_str = parseInt(currentYearNum)+'-'+getZeroStr(currentMonthNum)+'-'+getZeroStr(dayNum)
                    setData(dt_str, calDayCell);
                    
                    calDayCell.setDate(dt);
                    // calDayCell.setHtml('<input type="text" data-role="tagsinput"></input>');
                    calWeekHeaderCellObj.setDate(dt);
                    calWeekHeaderCellObj.setHtml(dayNum + "&nbsp;");
                    if (showTodayStyle && dayNum == currentDayNum) {
                        //calDayCell.removeClass();
                        calDayCell.addClass("JFrontierCal-Day-Cell-Today");
                        calWeekHeaderCellObj.setHtml( /*"Today - "+*/ dayNum + "&nbsp;");
                    }
                    dayNum += 1;
                }
                if (dayIndex == 6) {
                    calDayCell.addClass("JFrontierCal-Day-Cell-Last");
                    calWeekHeaderCellObj.addClass("JFrontierCal-Week-Header-Cell-Last");
                }
                // add click event handler if the user specified one
                if (this.clickEvent_dayCell != null) {
                    calDayCell.addClickHandler(this.clickEvent_dayCell);
                    calWeekHeaderCellObj.addClickHandler(this.clickEvent_dayCell);
                }
                // add droppable event
                calDayCell.jqyObj.data("dayDate", dt);

                calWeekHeaderObj.appendCalendarWeekHeaderCell(calWeekHeaderCellObj);
                calWeekObj.appendCalendarDayCell(calDayCell);
                // add our day cell to our hash so we can look it up quickly when we need to later.
                this.dayHash.put(
                    (calDayCell.getDate().getFullYear() + "") +
                    (calDayCell.getDate().getMonth() + "") +
                    (calDayCell.getDate().getDate() + ""),
                    calDayCell);
            }
            this.addWeekHeader(calWeekHeaderObj);
            this.addWeek(calWeekObj);

            // add middle weeks & week headers
           
            for (var weekIndex = 2; weekIndex < numberWeekRows; weekIndex++) {
            	$('#summs').append(summDiv);
                calWeekObj = this.buildCalendarWeek(); // week <div/>
                calWeekHeaderObj = this.buildCalendarWeekHeader(); // week header <div/>
                for (var dayIndex = 0; dayIndex < Calendar.dayNames.length; dayIndex++) {
                    calDayCell = this.buildCalendarDayCell();
                    calDayCell.setXCoord(dayIndex + 1);
                    calDayCell.setYCoord(weekIndex);
                    calWeekHeaderCellObj = this.buildCalendarWeekHeaderCell();
                    dt = new Date(currentYearNum, currentMonthNum, dayNum, 0, 0, 0, 0);
                    dt_str = parseInt(currentYearNum)+'-'+getZeroStr(currentMonthNum+1)+'-'+getZeroStr(dayNum)
                    setData(dt_str, calDayCell);
                    //calDayCell.updateWeekSum();
                    calDayCell.setDate(dt);
                    calWeekHeaderCellObj.setDate(dt);
                    calWeekHeaderCellObj.setHtml(dayNum + "&nbsp;");
                    //calDayCell.setHtml(calDayCell.getSumm())
                    // add click event handler if the user specified one
                    if (this.clickEvent_dayCell != null) {
                        calDayCell.addClickHandler(this.clickEvent_dayCell);
                        calWeekHeaderCellObj.addClickHandler(this.clickEvent_dayCell);
                    }
                    // add droppable event
                    calDayCell.jqyObj.data("dayDate", dt);

                    if (dayIndex == 6) {
                        calDayCell.addClass("JFrontierCal-Day-Cell-Last");
                        calWeekHeaderCellObj.addClass("JFrontierCal-Week-Header-Cell-Last");
                    }
                    if (showTodayStyle && dayNum == currentDayNum) {
                        //calDayCell.removeClass();
                        calDayCell.addClass("JFrontierCal-Day-Cell-Today");
                        calWeekHeaderCellObj.setHtml( /*"Today - "+*/ dayNum + "&nbsp;");
                    }
                    calWeekHeaderObj.appendCalendarWeekHeaderCell(calWeekHeaderCellObj);
                    calWeekObj.appendCalendarDayCell(calDayCell);
                    // add our day cell to our hash so we can look it up quickly when we need to later.
                    this.dayHash.put(
                        (calDayCell.getDate().getFullYear() + "") +
                        (calDayCell.getDate().getMonth() + "") +
                        (calDayCell.getDate().getDate() + ""),
                        calDayCell);
                    dayNum += 1;
                }
                this.addWeekHeader(calWeekHeaderObj);
                this.addWeek(calWeekObj);
            }

            // when we display a month we can see a few days from the next month on the calendar. this
            // is the day number of the first day on the next month. Will always be 1.
            var nextMonthDisplayDayNum = 1;

            //alert("Days in current month: " + daysInCurrentMonth);

            // add last week & last week header
            calWeekObj = this.buildCalendarWeek(); // week <div/>
            calWeekHeaderObj = this.buildCalendarWeekHeader(); // week header <div/>
            $('#summs').append(summDiv)
            for (var dayIndex = 0; dayIndex < Calendar.dayNames.length; dayIndex++) {
                calDayCell = this.buildCalendarDayCell();
                calDayCell.setXCoord(dayIndex + 1);
                calDayCell.setYCoord(numberWeekRows);
                calWeekHeaderCellObj = this.buildCalendarWeekHeaderCell();
                if (dayNum <= daysInCurrentMonth) {
                    // this month
                    dt = new Date(currentYearNum, currentMonthNum, dayNum, 0, 0, 0, 0);
                    dt_str = parseInt(currentYearNum)+'-'+getZeroStr(currentMonthNum+1)+'-'+getZeroStr(dayNum)
                    setData(dt_str, calDayCell);
                    //calDayCell.updateWeekSum();
                    calDayCell.setDate(dt);
                    calWeekHeaderCellObj.setDate(dt);
                    calWeekHeaderCellObj.setHtml(dayNum + "&nbsp;");
                } else {
                    // next month
                    dt = new Date(currentYearNum, (currentMonthNum + 1), nextMonthDisplayDayNum, 0, 0, 0, 0);
                    dt_str = parseInt(currentYearNum)+'-'+getZeroStr(currentMonthNum+2)+'-'+getZeroStr(nextMonthDisplayDayNum)
                    setData(dt_str, calDayCell);
                    //calDayCell.updateWeekSum();
                    calDayCell.setDate(dt);
                    calWeekHeaderCellObj.setDate(dt);
                    calWeekHeaderCellObj.setHtml(nextMonthDisplayDayNum + "&nbsp;");
                    calDayCell.addClass("JFrontierCal-NextMonth-Day-Cell");
                    calWeekHeaderCellObj.addClass("JFrontierCal-NextMonth-Week-Header-Cell");
                    nextMonthDisplayDayNum += 1;
                }
                if (dayIndex == 6 && dayNum <= daysInCurrentMonth) {
                    calDayCell.addClass("JFrontierCal-Day-Cell-Last");
                    calWeekHeaderCellObj.addClass("JFrontierCal-Week-Header-Cell-Last");
                } else if (dayIndex == 6 && dayNum > daysInCurrentMonth) {
                    calDayCell.addClass("JFrontierCal-NextMonth-Day-Cell-Last");
                    calWeekHeaderCellObj.addClass("JFrontierCal-NextMonth-Week-Header-Cell-Last");
                }
                if (showTodayStyle && dayNum == currentDayNum) {
                    //calDayCell.removeClass();
                    calDayCell.addClass("JFrontierCal-Day-Cell-Today");
                    calWeekHeaderCellObj.setHtml( /*"Today - "+*/ dayNum + "&nbsp;");
                }
                dayNum += 1;
                // add click event handler if the user specified one
                if (this.clickEvent_dayCell != null) {
                    calDayCell.addClickHandler(this.clickEvent_dayCell);
                    calWeekHeaderCellObj.addClickHandler(this.clickEvent_dayCell);
                }
                // add droppable event
                calDayCell.jqyObj.data("dayDate", dt);

                calWeekHeaderObj.appendCalendarWeekHeaderCell(calWeekHeaderCellObj);
                calWeekObj.appendCalendarDayCell(calDayCell);
                // add our day cell to our hash so we can look it up quickly when we need to later.
                this.dayHash.put(
                    (calDayCell.getDate().getFullYear() + "") +
                    (calDayCell.getDate().getMonth() + "") +
                    (calDayCell.getDate().getDate() + ""),
                    calDayCell);
            }
            this.addWeekHeader(calWeekHeaderObj);
            this.addWeek(calWeekObj);

            // get some user specified CSS values
            var headerCellTotalHeight = parseInt(calHeaderCell.jqyObj.outerHeight(true));
            var dayCellTotalHeight = parseInt(calDayCell.jqyObj.outerHeight(true) * numberWeekRows);
            var weekHeaderCellTotalHeight = parseInt(calWeekHeaderCellObj.jqyObj.outerHeight(true));

            // height of all calendar elements
            var totalCalendarHeight = dayCellTotalHeight + headerCellTotalHeight + weekHeaderCellTotalHeight;

            // if we don't set the height here than IE fails to render the agenda items correctly.... all other browsers are fine. weird....
            this.setCss("height", totalCalendarHeight + "px");

            this.jqyObj.addClass("JFrontierCal");



        };


        /**
         * Returns the CalendarDayCell object with the matching date: matching on year, month, and day.
         *
         * @param date - (Date) - A Date object with the year, month, and day set.
         * @return A CalendarDayCell object with the matching date, or null.
         */
        this.getCalendarDayObjByDate = function(date) {
            if (date == null || this.dayHash == null) {
                return null;
            }
            var key = (date.getFullYear() + "") + (date.getMonth() + "") + (date.getDate() + "");
            return this.dayHash.get(key);
            /*
			if(date == null){
				return null;
			}
			if(this.weeks == null || this.getNumberWeeks() == 0){
				return null;
			}
			for(var weekIndex = 0; weekIndex < this.getNumberWeeks(); weekIndex++){
				var dayCellsArray = this.weeks[weekIndex].getDays();
				if(dayCellsArray != null && dayCellsArray.length > 0){
					for(var dayIndex = 0; dayIndex < dayCellsArray.length; dayIndex++){
						var dayCell = dayCellsArray[dayIndex];
						var dayDate = dayCell.getDate();
						if(dayDate != null){
							if(dayDate.getFullYear() == date.getFullYear() && 
							   dayDate.getMonth() == date.getMonth() && dayDate.getDate() == date.getDate()){
								
								return dayCell;
							}
						}
					}
				}
			}
			*/
        };

        /**
         * Set the calendar to the specified year & month.
         *
         * @param date - A date object from the datejs library.
         */
        this.setDisplayDate = function(date) {

            // set the date
            this.displayDate = date;

            // re-initialize the calendar
            this.do_init();

            // resize
            this.resize();

        };

        /**
         * Returns the calendars current date.
         *
         * @return A datejs Date object.
         */
        this.getDisplayDate = function() {
            var dt = new Date(this.getCurrentYear(), this.getCurrentMonth(), this.getCurrentDay(), 0, 0, 0, 0);
            return dt;
        };

        /**
         * Sets the calendar to the next month
         */
        this.nextMonth = function() {
            var dt = new Date(0, 0, 1, 0, 0, 0, 0);
            if (this.displayDate.getMonth() == 11) {
                dt.setFullYear(this.displayDate.getFullYear() + 1);
                dt.setMonth(0);
            } else {
                dt.setFullYear(this.displayDate.getFullYear());
                dt.setMonth(this.displayDate.getMonth() + 1);
            }
            this.setDisplayDate(dt);
        };

        /**
         * Sets the calendar to the previous month
         */
        this.previousMonth = function() {
            var dt = new Date(0, 0, 1, 0, 0, 0, 0);
            if (this.displayDate.getMonth() == 0) {
                dt.setFullYear(this.displayDate.getFullYear() - 1);
                dt.setMonth(11);
            } else {
                dt.setFullYear(this.displayDate.getFullYear());
                dt.setMonth(this.displayDate.getMonth() - 1);
            }
            this.setDisplayDate(dt);
        };

        /**
         * Builds a CalendarHeader object. This goes at the very top of the calendar and displays the day names.
         * This object stores all the CalendarHeaderCell objects for the calendar header.
         *
         * @return a CalendarHeader object.
         */
        this.buildCalendarHeader = function() {
            var jqyHeaderObj = jQ_old("<div/>");
            jqyHeaderObj.css("width", this.getWidth() + "px");
            var calHeaderObj = new CalendarHeader(jqyHeaderObj);
            return calHeaderObj;
        };

        /**
         * Builds a CalendarWeek object. This object stores all the CalendarDayCell objects for the week.
         *
         * @return a CalendarWeek object.
         */
        this.buildCalendarWeek = function() {
            var weekCell = jQ_old("<div/>");
            weekCell.css("width", this.getWidth() + "px");
            var calWeek = new CalendarWeek(weekCell);
            return calWeek;
        };

        /**
         * Builds a CalendarWeekHeader object. This object stores all the CalendarWeekHeaderCell objects for the week.
         *
         * @return a CalendarWeekHeader object.
         */
        this.buildCalendarWeekHeader = function() {
            var weekHeaderCell = jQ_old("<div/>");
            weekHeaderCell.css("width", this.getWidth() + "px");
            var calWeekHeader = new CalendarWeekHeader(weekHeaderCell);
            return calWeekHeader;
        };

        /**
         * Builds a CalendarHeaderCell object. One cell in the CalendarHeader.
         *
         * @return a CalendarHeaderCell object.
         */
        this.buildCalendarHeaderCell = function() {
            var headCell = jQ_old('<div/>');
            headCell.addClass("JFrontierCal-Header-Cell");
            var calHeadCell = new CalendarHeaderCell(headCell);
            return calHeadCell;
        };

        /**
         * Builds a CalendarWeekHeaderCell object. One cell in the CalendarWeekHeader.
         *
         * @return a CalendarWeekHeaderCell object.
         */
        this.buildCalendarWeekHeaderCell = function() {
            var weekHeaderCell = jQ_old('<div/>');
            weekHeaderCell.addClass("JFrontierCal-Week-Header-Cell");
            /*
			//experiment with jquery UI theme
			weekHeaderCell.addClass("ui-state-default");
			weekHeaderCell.css("padding","0px");
			weekHeaderCell.css("margin","0px");
			weekHeaderCell.css("border-top","0px");
			weekHeaderCell.css("border-right","0px");
			weekHeaderCell.css("border-left","0px");
			weekHeaderCell.css("border-bottom","0px");
			weekHeaderCell.removeAttr("background-image");
			*/
            var calWeekHeadCell = new CalendarWeekHeaderCell(weekHeaderCell);
            return calWeekHeadCell;
        };

        /**
         * Builds a CalendarDayCell object. One cell in the CalendarWeek object.
         *
         * @return a CalendarDayCell object.
         */
        this.buildCalendarDayCell = function() {
            var dayCell = jQ_old('<div/>');
            dayCell.addClass("JFrontierCal-Day-Cell");

            /*
			//experiment with jquery UI theme
			dayCell.addClass("ui-state-default");
			dayCell.css("padding","0px");
			dayCell.css("margin","0px");
			dayCell.css("border-top","0px");
			dayCell.css("border-right","0px");
			dayCell.css("border-left","0px");
			dayCell.css("border-bottom","0px");
			dayCell.removeAttr("background-image");
			*/
            var calDay = new CalendarDayCell(dayCell);
            return calDay;
        };

        /**
         * Get the current year, 4-digit.
         *
         * @return integer
         */
        this.getCurrentYear = function() {
            return parseInt(this.displayDate.getFullYear());
        };

        /**
         * Get the current month
         *
         * @return integer, 0 = Jan, 11 = Dec
         */
        this.getCurrentMonth = function() {
            return parseInt(this.displayDate.getMonth());
        };

        /**
         * Get the current day
         *
         * @return integer
         */

        this.getCurrentDay = function() {
            return parseInt(this.displayDate.getDate());
        };

        /**
         * Get a new date with the next month
         *
         * @return A Date object
         */
        this.getNextMonth = function() {
            var dt = new Date(0, 0, 1, 0, 0, 0, 0);
            if (this.getCurrentMonth() == 11) {
                dt.setFullYear(this.getCurrentYear() + 1);
                dt.setMonth(0);
            } else {
                dt.setFullYear(this.getCurrentYear());
                dt.setMonth(this.getCurrentMonth() + 1);
            }
            return dt;
        };

        /**
         * Get a new date with the previous month
         *
         * @return A Date object
         */
        this.getPreviousMonth = function() {
            var dt = new Date(0, 0, 1, 0, 0, 0, 0);
            if (this.getCurrentMonth() == 0) {
                dt.setFullYear(this.getCurrentYear() - 1);
                dt.setMonth(11);
            } else {
                dt.setFullYear(this.getCurrentYear());
                dt.setMonth(this.getCurrentMonth() - 1);
            }
            return dt;
        };

        /**
         * Return number of days in current month
         *
         * @return integer
         */
        this.getDaysCurrentMonth = function() {
            return parseInt(DateUtil.getDaysInMonth(this.displayDate));
        };

        /**
         * Return number of days in previous month
         *
         * @return integer
         */
        this.getDaysPreviousMonth = function() {
            var prevDt = this.getPreviousMonth();
            return parseInt(DateUtil.getDaysInMonth(prevDt));
        };

        /**
         * Return number of days in next month
         *
         * @return integer
         */
        this.getDaysNextMonth = function() {
            var nextDt = this.getNextMonth();
            return parseInt(DateUtil.getDaysInMonth(nextDt));
        };

        this.setHtml = function(htmlData) {
            this.jqyObj.html(htmlData);
        };

        this.getHtml = function() {
            return this.jqyObj.html();
        };

        this.setCss = function(attr, value) {
            this.jqyObj.css(attr, value);
        };

        this.getCss = function(attr) {
            return this.jqyObj.css(attr);
        };

        this.setAttr = function(id, value) {
            this.jqyObj.attr(id, value);
        };

        this.getAttr = function(id) {
            return this.jqyObj.attr(id);
        };

        /**
         * Clear all data in the calendar </div> element, inluding
         * all week objects, week header objects & the calendar header object.
         *
         * @param clearAgenda - boolean - pass true to clear agenda items as well.
         */
        this.clear = function(clearAgenda) {
            this.jqyObj.html("");
            this.calHeaderObj = null;
            this.weeks = new Array();
            this.weekHeaders = new Array();
            this.dayHash = new Hashtable();
            if (clearAgenda) {
                this.agendaItems = new Hashtable();
            }
        };

        /**
         * Get the height of the calendar <div/> element
         *
         * @see JQuery.height();
         * @return integer
         */
        this.getHeight = function() {
            return this.jqyObj.height();
        }

        /**
         * Get the width of the calendar <div/> element
         *
         * @see JQuery.width();
         * @return integer
         */
        this.getWidth = function() {
            return this.jqyObj.width();
        };

        /**
         * Set the width of the calendar <div/> element
         *
         * @see JQuery.width();
         * @param w - integer
         */
        this.setWidth = function(w) {
            this.jqyObj.width(w);
            this.resize();
        };

        /**
         * Get the inner width of the calendar <div/> element
         *
         * @see JQuery.innerWidth();
         * @return integer
         */
        this.getInnerWidth = function() {
            return this.jqyObj.innerWidth();
        };

        /**
         * Add a header to the calendar
         *
         * @param calHeader - A CalendarHeader object
         */
        this.addHeader = function(calHeader) {
            // remove existing header if there is one
            if (this.calHeaderObj != null) {
                // already have header
                var headerDiv = this.jqyObj.children("div").first();
                headerDiv.remove();
                this.calHeaderObj = calHeader;
                this.jqyObj.prepend(calHeader.jqyObj);
            } else {
                this.calHeaderObj = calHeader;
                this.jqyObj.prepend(calHeader.jqyObj);
            }
        };

        // append a CalendarWeek object
        this.addWeek = function(calWeek) {
            // push is not supported by IE 5/Win with the JScript 5.0 engine
            this.weeks.push(calWeek);
            this.jqyObj.append(calWeek.jqyObj);
        };

        // append a CalendarWeekHeader object
        this.addWeekHeader = function(calWeekHeader) {
            // push is not supported by IE 5/Win with the JScript 5.0 engine
            this.weekHeaders.push(calWeekHeader);
            this.jqyObj.append(calWeekHeader.jqyObj);
        };

        // returns an array of CalendarWeek objects
        this.getWeeks = function() {
            return this.weeks;
        };

        // returns an array of CalendarWeekHeader objects
        this.getWeekHeaders = function() {
            return this.weekHeaders;
        };

        // return the number of weeks for the current month
        this.getNumberWeeks = function() {
            return this.weeks.length;
        };

        /**
         * Add a CalendarAgendaItem to the calendar.
         *
         * @param item - (CalendarAgendaItem) - A new CalendarAgendaItem object.
         */




        // append a JQuery object
        this.appendJqyObj = function(obj) {
            this.jqyObj.append(obj);
        };

        this.shoutOut = function() {
            alert("You have a calendar object!");
        };

        /**
         * This function could be good when we delete agenda items. Since deleting an agenda item
         * does not require resizing the calendar we can simply delete the agenda divs and
         * re-render them.
         *
         * Loops through all the days cells and clears the html and agenda rendering positison.
         */
        // this.clearDayCellData = function(){
        // 	var weekCount = 0;
        // 	var weekCellsArray = this.getWeeks(); // all the week <div>'s in the calendar
        // 	if(weekCellsArray != null && weekCellsArray.length > 0){
        // 		weekCount = weekCellsArray.length;
        // 		for(var weekIndex = 0; weekIndex < weekCellsArray.length; weekIndex++){
        // 			// all the day cells for the current week cell
        // 			var dayCellsArray = weekCellsArray[weekIndex].getDays();
        // 			if(dayCellsArray != null && dayCellsArray.length > 0){
        // 				// loop through all days of the week
        // 				for(var dayIndex = 0; dayIndex < dayCellsArray.length; dayIndex++){
        // 					dayCellsArray[dayIndex].clearAgendaDivElements();
        // 				}
        // 			}
        // 		}
        // 	}		
        // };

        /**
         * Set the rendering ratio. By default the value is 1 making the day cells roughly as tall as they are wide.
         *
         * @param ration - float - A number less than or equal to 1 and greater than 0. Use 0.5 to make the day cells
         *		 	   roughly half as tall as they are wide.
         */
        this.setRenderRatio = function(ratio) {
            if (ratio != null && ratio <= 1 && ratio > 0) {
                this.aspectRatio = ratio;
                this.resize();
            }
        }

        /**
         * call this function when the browser is resized. Resizes all <div/> elements. Clears all agenda item
         * renders and then re-renders them.
         *
         */
        this.resize = function() {

            var firstDayCell = null;
            var firstWeekHeaderCell = null;
            var lastDayCell = null;
            var lastHeaderCell = null;
            var lastWeekHeaderCell = null;

            var calWidth = this.getWidth(); // excludes padding

            // all day cells, header cells, and week header cells, should have the same left & right margin, left & right padding,
            // and left & right border widths. We'll grab the first day cell and use it's values for all other calculations.
            var weekArray = this.getWeeks();
            if (weekArray != null && weekArray.length > 0) {
                var dayArray = weekArray[0].getDays();
                if (dayArray != null && dayArray.length > 0) {
                    firstDayCell = dayArray[0];
                }
            }
            // get first week header cell
            var weekHeadArray = this.getWeekHeaders();
            if (weekHeadArray != null && weekHeadArray.length > 0) {
                var weekHeadCellArray = weekHeadArray[0].getHeaderCells();
                if (weekHeadCellArray != null && weekHeadCellArray.length > 0) {
                    firstWeekHeaderCell = weekHeadCellArray[0];
                }
            }
            var headerCellHeight = firstWeekHeaderCell.jqyObj.outerHeight(true);

            var borderSize = (firstDayCell.jqyObj.outerWidth(true) - firstDayCell.jqyObj.width()) * Calendar.dayNames.length;

            var cellWidth = Math.floor(calWidth / Calendar.dayNames.length) - (firstDayCell.jqyObj.outerWidth(true) - firstDayCell.jqyObj.width());
            var cellWidthLast = cellWidth + (calWidth - (cellWidth * Calendar.dayNames.length)) - (firstDayCell.jqyObj.outerWidth(true) - firstDayCell.jqyObj.width()) - borderSize;
            //var cellWidth = Math.floor(calWidth / Calendar.dayNames.length) - this.cellBorderWidth - (this.cellPadding * 2);
            //var cellWidthLast = cellWidth + ( calWidth - (cellWidth * Calendar.dayNames.length)) - this.cellBorderTotal - this.cellPaddingTotal;

            // make the day cells square
            var cellHeight = parseInt((cellWidth - headerCellHeight) * this.aspectRatio);
            //var cellHeight = cellWidth - this.dayCellHeaderCellHeight;

            // width of all elements inside the header <div/>
            var totalHeaderWidth = ((cellWidth * 6) + cellWidthLast) + ((firstDayCell.jqyObj.outerWidth(true) - firstDayCell.jqyObj.width()) * Calendar.dayNames.length) + 1;
            //var totalHeaderWidth = (cellWidth * 6) + cellWidthLast + this.cellBorderTotal + this.cellPaddingTotal;

            // set the width of the header <div/> that wraps all the header cells.
            this.calHeaderObj.setWidth(totalHeaderWidth);
            //this.calHeaderObj.jqyObj.css("width",totalHeaderWidth+"px");

            // loop over all cells in header and update their size
            var headerCellsArray = this.calHeaderObj.getHeaderCells();
            if (headerCellsArray != null && headerCellsArray.length > 0) {
                for (var headIndex = 0; headIndex < headerCellsArray.length; headIndex++) {
                    //alert("Resizing header cell " + headIndex);
                    if (headIndex == (headerCellsArray.length - 1)) {
                        // last cell in the header
                        headerCellsArray[headIndex].setCss("width", cellWidthLast + "px");
                    } else {
                        headerCellsArray[headIndex].setCss("width", cellWidth + "px");
                        lastHeaderCell = headerCellsArray[headIndex];
                    }
                }
            }

            // loop through all weeks & week headers. Update width of day cells and week header cells
            // each week has a week header (the arrays should be the same size if the initialization worked correctly)
            var weekCount = 0;
            var weekCellsArray = this.getWeeks(); // all the week <div>'s in the calendar
            var weekHeadersArray = this.getWeekHeaders(); // all the week header <div>'s in the calendar
            if (weekCellsArray != null && weekCellsArray.length > 0) {
                weekCount = weekCellsArray.length;
                for (var weekIndex = 0; weekIndex < weekCellsArray.length; weekIndex++) {
                    // set the width of the week <div/> that wraps all the day cells.
                    weekCellsArray[weekIndex].setWidth(totalHeaderWidth);
                    // set the width of the week header <div/> that wraps all the day cells.
                    weekHeadersArray[weekIndex].setWidth(totalHeaderWidth);
                    var dayCellsArray = weekCellsArray[weekIndex].getDays(); // all the day cells for the current week cell
                    var weekHeaderCellsArray = weekHeadersArray[weekIndex].getHeaderCells(); // all the week header cells for the current week header
                    if (dayCellsArray != null && dayCellsArray.length > 0) {
                        // loop through all days of the week
                        for (var dayIndex = 0; dayIndex < dayCellsArray.length; dayIndex++) {
                            if (dayIndex == (dayCellsArray.length - 1)) {

                                // last day cell in the week (Saturday)

                                // set widths
                                dayCellsArray[dayIndex].setCss("width", cellWidthLast + "px");
                                weekHeaderCellsArray[dayIndex].setCss("width", cellWidthLast + "px");

                                // set height (make it the same as width so we have a nice aspect ratio)
                                dayCellsArray[dayIndex].setCss("height", cellHeight + "px");

                                // clear agenda item html for this cell, we will re-render in
                                //dayCellsArray[dayIndex].clearAgendaDivElements();

                            } else {

                                // Sunday to friday day cells

                                // set widths
                                dayCellsArray[dayIndex].setCss("width", cellWidth + "px");
                                weekHeaderCellsArray[dayIndex].setCss("width", cellWidth + "px");

                                // set height (make it the same as width so we have a nice aspect ratio)
                                dayCellsArray[dayIndex].setCss("height", cellHeight + "px");

                                // clear agenda item html for this cell, we will re-render in
                                //dayCellsArray[dayIndex].clearAgendaDivElements();

                                // we'll use these later
                                lastDayCell = dayCellsArray[dayIndex];
                                lastWeekHeaderCell = weekHeaderCellsArray[dayIndex];

                            }
                        }
                    }
                }
            }

            // get some user specified CSS values
            var headerCellTotalHeight = parseInt(lastHeaderCell.jqyObj.outerHeight(true));
            var dayCellTotalHeight = parseInt(lastDayCell.jqyObj.outerHeight(true) * weekCount);
            var weekHeaderCellTotalHeight = parseInt(lastWeekHeaderCell.jqyObj.outerHeight(true) * weekCount);

            var totalCalendarHeight = headerCellTotalHeight + dayCellTotalHeight + weekHeaderCellTotalHeight;

            // set height of calendar <div/>
            this.setCss("height", totalCalendarHeight + "px");

            // re-render all agenda items
            //this.renderAgendaItems();


        };

        /**
		 * Gets the day index within the week for the day name
		 *
		 * getWeekIndex("Sun") = 0;
		 * getWeekIndex("Mon") = 1;
		 * getWeekIndex("Tue") = 2;
		 * getWeekIndex("Wed") = 3;
		 * getWeekIndex("Thu") = 4;
		 * getWeekIndex("Fri") = 5;
		 * getWeekIndex("Sat") = 6;
		 *
		 * @param dayName - The name of the day, fullname or abbreviated name.
		 @ @return number - Index of day within the week.
		 */
        this.getWeekIndex = function(dayName) {
            if (dayName.toUpperCase() == "SUN" || dayName.toUpperCase() == "SUNDAY") {
                return 0;
            } else if (dayName.toUpperCase() == "MON" || dayName.toUpperCase() == "MONDAY") {
                return 1;
            } else if (dayName.toUpperCase() == "TUE" || dayName.toUpperCase() == "TUESDAY") {
                return 2;
            } else if (dayName.toUpperCase() == "WED" || dayName.toUpperCase() == "WEDNESDAY") {
                return 3;
            } else if (dayName.toUpperCase() == "THU" || dayName.toUpperCase() == "THURSDAY") {
                return 4;
            } else if (dayName.toUpperCase() == "FRI" || dayName.toUpperCase() == "FRIDAY") {
                return 5;
            } else if (dayName.toUpperCase() == "SAT" || dayName.toUpperCase() == "SATURDAY") {
                return 6;
            } else {
                return -1
            }
        };

    };
    // static properties
    Calendar.dayNames = new Array("Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс");


    /**
     * Some utility functions for working with javascript Dates.
     *
     */

    function DateUtil() {

    };
    /**
     * Get the number of days in the set year & month
     *
     * @return integer 0-31
     */
    DateUtil.getDaysInMonth = function(date) {
        /*
		var dt = new Date(date.getFullYear(),date.getMonth(),1,0,0,0,0);
		var month = dt.getMonth();
		var lastMonth = month;
		var dayCount = 0;
		while(lastMonth == month){
			dayCount++;
			dt.setDate(dt.getDate()+1);
			month = dt.getMonth();
		}
		return dayCount;
		*/
        return 32 - new Date(date.getFullYear(), date.getMonth(), 32).getDate();
    };
    /**
     * Check if date1 is between date2 & date3, or on date2 and date3.
     *
     * @param date1 - Date - The date you want to check.
     * @param date2 - Date - The earlier date.
     * @param date3 - Date - The later date.
     * @return true if date1 is between date2 & date3, or date1 is same day as date2 or date3, false otherwise.
     */
    DateUtil.isDateBetween = function(date1, date2, date3) {
        if (date1 == null || date2 == null || date3 == null) {
            return false;
        }
        if (DateUtil.daysDifferenceDirection(date1, date2) <= 0 && DateUtil.daysDifferenceDirection(date1, date3) >= 0) {
            return true;
        }
        return false;
    };
    /**
     * Given two dates this function returns the number of days differnt.
     *
     * date1 == date2 return 0;
     * date1 < date2 return positive integer (number of days)
     * date2 < date1 return positive inetger (number of days)
     *
     * @return integer - The days different
     */
    DateUtil.daysDifference = function(date1, date2) {
        // The number of milliseconds in one day
        var ONE_DAY = 1000 * 60 * 60 * 24;
        // create new dates so we ignore all hour, min, sec, and milli data
        var dt1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate(), 0, 0, 0, 0);
        var dt2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate(), 0, 0, 0, 0);
        // Convert both dates to milliseconds
        var date1_ms = dt1.getTime();
        var date2_ms = dt2.getTime();
        // Calculate the difference in milliseconds
        var difference_ms = Math.abs(date2_ms - date1_ms);
        var diff_day = difference_ms / ONE_DAY;
        return diff_day;
    };
    /**
     * Similar to this.daysDifference() only this function can return negative
     * values so you can tell if date2 is before or after date1, and by how many
     * days.
     *
     * date1 == date2 return 0;
     * date1 < date2 return positive integer (number of days)
     * date2 < date1 return negative inetger (number of days)
     *
     * @return integer - The days different
     */
    DateUtil.daysDifferenceDirection = function(date1, date2) {
        // create new dates so we ignore all hour, min, sec, and milli data
        var dt1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate(), 0, 0, 0, 0);
        var dt2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate(), 0, 0, 0, 0);
        // 1000 * 60 * 60 * 24 = number of milliseconds in one day
        return (dt2.getTime() - dt1.getTime()) / (1000 * 60 * 60 * 24);
    };
    /**
     * Get seconds difference between date 1 and 2.
     *
     * @return integer - The difference in seconds. Negative if date2 < date1, positive if
     *					 date1 < date2, or 0 if same second.
     */
    DateUtil.secondsDifferenceDirection = function(date1, date2) {
        return Math.round((date2.getTime() - date1.getTime()) / 1000);
    };
    /**
     * Given a Date object with the year, month, and day set, this function will
     * return a Date object set to the next day. Note, this may be in a different
     * month and year!
     *
     * @param date - (Date) - A date object with the year, month, and day set.
     * @return Date - A Date object set to the next day. Note, this may be in a different
     * month and year!
     */
    DateUtil.getNextDay = function(date) {

        // week index for the set day (from 0-6)
        var dayIndex = date.getDay();
        // day of the month (from 1-31)
        var dayNum = date.getDate();
        // month index for the set month (from 0-11)
        var monthNum = date.getMonth();
        // the 4-digit year
        var yearNum = date.getFullYear();
        // number of days in month
        var daysInMonth = DateUtil.getDaysInMonth(date);

        if (dayNum == daysInMonth) {
            // next month
            if (yearNum == 11) {
                // next year
                return new Date(yearNum + 1, monthNum + 1, 1, 0, 0, 0, 0);
            } else {
                // same year
                return new Date(yearNum, monthNum + 1, 1, 0, 0, 0, 0);
            }
        } else {
            // same month & year
            return new Date(yearNum, monthNum, dayNum + 1, 0, 0, 0, 0);
        }

    };
    /**
     * Add or remove days to a date.
     *
     * @param date - Date object - The date to add or remove days to/from.
     * @param days - integer - A positive number to add days, a negative number to remove days.
     * @return A new Date object that very well could be in the next/previous month or year.
     */
    DateUtil.addDays = function(date, days) {
        return new Date(date.getTime() + (days * 24 * 60 * 60 * 1000));
    };
    /**
     * Give a date object with the year and month set this function will return a new
     * date set to the previous month. This may be in a different year.
     *
     *
     * @return Date - A Date object set to the previous month. May be in different year.
     */
    DateUtil.getPreviousMonth = function(date) {
        var dt = new Date(0, 0, 1, 0, 0, 0, 0);
        if (dt.getMonth() == 0) {
            dt.setFullYear(date.getFullYear() - 1);
            dt.setMonth(11);
        } else {
            dt.setFullYear(date.getFullYear());
            dt.setMonth(date.getMonth() - 1);
        }
        return dt;
    };
    /**
     * Given a Date object with the year, month, and day set, this function will
     * return a Date object set to the first day of the same week. This may be in a different
     * month or year.
     *
     * @param date - (Date) - A date object with the year, month, and day set.
     * @return Date - A Date object set to the last day in the same week. May be in different month or year!
     */
    DateUtil.getFirstDayInSameWeek = function(date) {

        // week index for the set day (from 0-6)
        var dayIndex = date.getDay();
        // day of the month (from 1-31)
        var dayNum = date.getDate();
        // month index for the set month (from 0-11)
        var monthNum = date.getMonth();
        // the 4-digit year
        var yearNum = date.getFullYear();
        // number of days in month
        var daysInMonth = DateUtil.getDaysInMonth(date);

        if (dayIndex == 0) {
            // this is the first day of the week! (Sunday)
            return new Date(yearNum, monthNum, dayNum, 0, 0, 0, 0);
        }
        var backDayNum = dayNum - dayIndex;
        if (backDayNum < 1) {
            // previous month
            var prevMonthDt = DateUtil.getPreviousMonth(date);
            var daysPrevMonth = DateUtil.getDaysInMonth(prevMonthDt);
            var newDay = daysPrevMonth + backDayNum;
            if (monthNum == 0) {
                // previous year
                return new Date(yearNum - 1, 11, newDay, 0, 0, 0, 0);
            } else {
                // same year			
                return new Date(yearNum, monthNum - 1, newDay, 0, 0, 0, 0);
            }
        } else {
            // same month & year
            return new Date(yearNum, monthNum, backDayNum, 0, 0, 0, 0);
        }

    };
    /**
     * Given a Date object with the year, month, and day set, this function will
     * return a Date object set to the last day in the same week (last day being Saturday)
     * Note, this may be in a different month and year!
     *
     * @param date - (Date) - A date object with the year, month, and day set.
     * @return Date - A Date object set to the last day in the same week. May be in different month or year!
     */
    DateUtil.getLastDayInSameWeek = function(date) {

        // week index for the set day (from 0-6)
        var dayIndex = date.getDay();
        // day of the month (from 1-31)
        var dayNum = date.getDate();
        // month index for the set month (from 0-11)
        var monthNum = date.getMonth();
        // the 4-digit year
        var yearNum = date.getFullYear();
        // number of days in month
        var daysInMonth = DateUtil.getDaysInMonth(date);

        if (dayIndex == 6) {
            // this is the last day of the week!
            return new Date(yearNum, monthNum, dayNum, 0, 0, 0, 0);
        }
        var daysTillEndWeek = 6 - dayIndex;

        if ((dayNum + daysTillEndWeek) > daysInMonth) {
            // next month
            var nextSunday = daysTillEndWeek - (daysInMonth - dayNum);
            if (yearNum == 11) {
                // next year
                return new Date(yearNum + 1, monthNum + 1, nextSunday, 0, 0, 0, 0);
            } else {
                // same year
                return new Date(yearNum, monthNum + 1, nextSunday, 0, 0, 0, 0);
            }
        } else {
            // same month & year
            return new Date(yearNum, monthNum, dayNum + daysTillEndWeek, 0, 0, 0, 0);
        }

    };
    /**
     * Given a Date object with the year, month, and day set, this function will
     * return a Date object set to the first day of the next week (Sunday.) This may
     * be in the next month or even the next year.
     *
     * @param date - (Date) - A date object with the year, month, and day set.
     * @return Date - A Date object set to the first dat of the next week. May be in next month or year.
     */
    DateUtil.getFirstDayNextWeek = function(date) {

        // week index for the set day (from 0-6)
        var dayIndex = date.getDay();
        // day of the month (from 1-31)
        var dayNum = date.getDate();
        // month index for the set month (from 0-11)
        var monthNum = date.getMonth();
        // the 4-digit year
        var yearNum = date.getFullYear();
        // number of days in month
        var daysInMonth = DateUtil.getDaysInMonth(date);

        if (dayIndex == 0) {
            // this is the first day of the week! (Sunday)
            return new Date(yearNum, monthNum, dayNum, 0, 0, 0, 0);
        }
        var daysTillEndWeek = 6 - dayIndex;
        var nextMonday = dayNum + daysTillEndWeek + 1;
        if (nextMonday > daysInMonth) {
            // next month
            var newDay = daysTillEndWeek - (daysInMonth - dayNum) + 1;
            if (yearNum == 11) {
                // next year
                return new Date(yearNum + 1, monthNum + 1, newDay, 0, 0, 0, 0);
            } else {
                // same year
                return new Date(yearNum, monthNum + 1, newDay, 0, 0, 0, 0);
            }
        } else {
            // same month & year
            return new Date(yearNum, monthNum, nextMonday, 0, 0, 0, 0);
        }
    };




    /**
     * Some utility functions for working with colors
     *
     */

    function LogUtil() {

    };
    /**
     * Logs to Firebug console. Comment out for production.
     *
     * @param s - string - message to log.
     */
    LogUtil.log = function(s) {
        //console.log((new Date()).toLocaleTimeString() + ": " + s);
    };

    /**
     * Extend JQuery and and add our function.
     */
    jQ_old.fn.jFrontierCal = function(attr, options) {

        var elmId = jQ_old(this).attr('id');

        // default options.
        var opts;
        var defaults = {
            foo: 'bar',
            date: new Date(),
            dayClickCallback: function(eventObj) {
                // users can override this method to do something when a day cell is clicked.
            },
            agendaClickCallback: function(eventObj) {
                // users can override this method to do something when an agenda item is clicked.
                eventObj.stopPropagation();
            },
            agendaDropCallback: function(eventObj) {
                // users can override this method to do something after an agenda item is dropped into a day cell.
            },
            agendaMouseoverCallback: function(eventObj) {
                // users can override this method to do something on agenda mouse over events.
            },
            applyAgendaTooltipCallback: function(agendaDivElement, agendaItem) {
                // users can override this method to apply an optional tooltip to agenda items for mouse events.
            },
            agendaDragStartCallback: function(eventObj, agendaDivElement, agendaItem) {
                // users can override this method to do something when dragging starts on an agenda div element
            },
            agendaDragStopCallback: function(eventObj, agendaDivElement, agendaItem) {
                // users can override this method to do something when dragging stops on an agenda div element
            },
            /*true = enable drag-and-drop, false = disabled*/
            dragAndDropEnabled: true
        };

        // Check to see if an object is a plain object (created using "{}" or "new Object").
        if (jQ_old.isPlainObject(attr)) {

            /*
			This block will be executed when we call our plugin with options:
			jQ_old("#elmId").jFrontierCal({
					foo: '1',
			     bar: '2'
			});
			*/

            // extend default options with any that were provided by user
            var options = attr;
            opts = jQ_old.extend(defaults, options);
            allOptions[elmId] = opts;

        } else {

            /*
			This block will be executed when we call our plugin like so:
			jQ_old("#elmId").jVertTabsDev();
			Or..
			jQ_old("#elmId").jVertTabsDev('active',true);
			*/

            opts = jQ_old.extend(defaults, options);
            allOptions[elmId] = opts;

        }

        // instantiate instance of plugin and initialize it for all matching elements.
        return this.each(function() {

            var calElm = jQ_old(this);

            // Return early if this element already has a plugin instance
            if (calElm.data('plugin')) {
                return;
            }

            // options for this calendar
            var thisCalOpts = allOptions[elmId];

            // create plugin
            var myplugin = new jFrontierCalPlugin(
                calElm,
                thisCalOpts.dayClickCallback,
                thisCalOpts.agendaClickCallback,
                thisCalOpts.agendaDropCallback,
                thisCalOpts.dragAndDropEnabled,
                thisCalOpts.agendaMouseoverCallback,
                thisCalOpts.applyAgendaTooltipCallback,
                thisCalOpts.agendaDragStartCallback,
                thisCalOpts.agendaDragStopCallback
            );

            // initialize calendar
            myplugin.init();

            // Store plugin object in this element's data so the user can access it in their code
            calElm.data('plugin', myplugin);

        });

    };

    /**
     * The interface to our calendar.
     *
     * @param calElm - jQuery object reference for the calendar <div/>
     * @param dayClickCallback - A callback function for clicks on the day cells.
     * @param agendaClickCallback - A callback function for clicks on agenda items.
     * @param agendaDropCallback - A callback function for drop events on agenda items.
     * @param dragAndDropEnabled - boolean - True to enable drag-and-drop, false to disable.
     * @param agendaMouseoverCallback - A callback function for mouse over events on agenda items.
     * @param applyAgendaTooltipCallback - A callback function that applies an optional tooltip to agenda div elements.
     * @param agendaDragStartCallback - A callback function that fires when a drag event starts on an agenda div element.
     * @param agendaDragStopCallback - A callback function that fires when a drag event stops on an agenda div element.
     */
    var jFrontierCalPlugin = function(
        calElm,
        dayClickCallback,
        agendaClickCallback,
        agendaDropCallback,
        dragAndDropEnabled,
        agendaMouseoverCallback,
        applyAgendaTooltipCallback,
        agendaDragStartCallback,
        agendaDragStopCallback) {

        var obj = this;

        // id of calendar <div/> element
        var calId = calElm.attr('id');

        // the callback function that's triggered when users click a day cell
        var clickEvent_dayCell = dayClickCallback;
        // the callback function that's triggered when users click an agenda cell
        var clickEvent_agendaCell = agendaClickCallback;
        // the callback function that's triggered when users drop an agenda div into a day cell (drag-and-drop)
        var dropEvent_agendaCell = agendaDropCallback;
        // the callback function that's triggered when users mouse over an agenda item.
        var mouseOverEvent_agendaCell = agendaMouseoverCallback;
        // optional callback function where users can apply a tooltip to an agenda div element.
        var callBack_agendaTooltip = applyAgendaTooltipCallback;
        // the callback function that's triggered when a drag event starts on an agenda div element.
        var dragStart_agendaCell = agendaDragStartCallback;
        // the callback function that's triggered when a drag event stops on an agenda div element.
        var dragDrop_agendaCell = agendaDragStopCallback;

        /**
         * Initialized the plugin. Builds the calendar.
         *
         */


        this.init = function() {

            // current date and time
            var dtNow = new Date();

            var calObj = new Calendar();
            calObj.initialize(
                calElm,
                dtNow,
                clickEvent_dayCell,
                clickEvent_agendaCell,
                dropEvent_agendaCell,
                dragAndDropEnabled,
                mouseOverEvent_agendaCell,
                callBack_agendaTooltip,
                dragStart_agendaCell,
                dragDrop_agendaCell
            );

            // store our calendar in a global hash so we can get at it later
            // var calId = calObj.getAttr("id");
            myCalendars.put(calId, calObj);

            // when the window is resized we want to resize all calendars we are keeping track of.
            //jQ_old(window).resize(this.doResizeAll);

            // custom resize (fixes Internet Explorer double resize issue)
            jQ_old(window).wresize(this.doResizeAll);

            // resize all elements in the calendar relative to the parent clendar </div> element
            this.doResizeAll();
            this.doResizeAll();

            this.calendar = calObj;

            return calObj;
        };

        
        /**
         * Switch to the previous month
         *
         * @param calId - (String) - The ID of the calendar </div> element.
         */
        this.showPreviousMonth = function(calId) {
            if (calId != null) {
                calId = stripNumberSign(calId);
                var calObj = myCalendars.get(calId);
                calObj.previousMonth();
            }
        };

        /**
         * Switch to the next month
         *
         * @param calId - (String) - The ID of the calendar </div> element.
         */
        this.showNextMonth = function(calId) {
            if (calId != null) {
                calId = stripNumberSign(calId);
                var calObj = myCalendars.get(calId);
                calObj.nextMonth();
            }
        };

        /**
         * Set the calendar to the specified year & month.
         *
         * @param calId - (String) - The ID of the calendar </div> element.
         * @param year  - (String) - 4-digit year (e.g, "2010" or "1979")
         * @param month - (String) - Month (e.g. "0" = Janurary, "1" or "01" = February, "11" = December)
         */
        this.showMonth = function(calId, year, month) {
            if (calId != null && year != null && month != null && year.length == 4 && (month.length == 1 || month.length == 2)) {
                calId = stripNumberSign(calId);
                // strip any preceeding 0's
                month = month.replace(/^[0]+/g, "");
                var yearInt = parseInt(year);
                var monthInt = parseInt(month);
                var dateToShow = new Date(yearInt, monthInt, 1, 0, 0, 0, 0);
                var calObj = myCalendars.get(calId);
                calObj.setDisplayDate(dateToShow);
            }
        };

        /**
         * Retrieves the date that the calendar is currently set to.
         *
         * @param calId - (String) - The ID of the calendar </div> element.
         * @return A Date object. The date the calendar is currently set to (year & month)
         */
        this.getCurrentDate = function(calId) {
            if (calId != null) {
                calId = stripNumberSign(calId);
                var calObj = myCalendars.get(calId);
                return calObj.getDisplayDate();
            }
        };


        /**
         * Resizes all calendars that the plugin is managing.
         *
         */
        this.doResizeAll = function() {
            if (myCalendars != null && myCalendars.size() > 0) {
                var cals = myCalendars.values();
                for (var i = 0; i < cals.length; i++) {
                    cals[i].resize();
                }
            }
        };

        /**
         * Fire resize event for a specific calendar. Sometimes you may want to manually call the resize event. For example
         * if you are using JQuery tabs UI element and you initialize the calendar in a closed tab the width will be 0 causing
         * the calendar to render incorrectly. In the tabs show() event you can call this doResize() method on the calendar to
         * get it to properly render.
         *
         * @param calId - (String) - The ID of the calendar </div> element.
         */
        this.doResize = function(calId) {
            if (myCalendars != null && myCalendars.size() > 0 && calId != null) {
                calId = stripNumberSign(calId);
                var calObj = myCalendars.get(calId);
                calObj.resize();
            }
        };

        /**
         * Set the aspect ratio of the calendar. By default the aspect ratio is 1. This means all day cells will be roughly
         * the same height as they are wide (minus the height of the week headers which show the day numbers.) If you want
         * the calendar to be wider than it is tall (i.e. shorten its height) than you can set the aspect ratio to something
         * like 0.75 or 0.5. A value of 0.5 means the day cells will be roughly half as high as they are wide.
         *
         * @param calId - (String) - The ID of the calendar </div> element.
         * @param ratio - float - A value less than or equal to 1 and greater than 0. For example, 0.5 will make the day
         *		           cells half as tall as they are wide, 0.75 will make them 3/4th as tall as they are wide,
         *			       and a value of 0.25 will make them a quarter tall as they are wide resulting in a very
         *			       wide calendar relative to its height.
         */
        this.setAspectRatio = function(calId, ratio) {
            if (calId != null && ratio != null) {
                if (ratio > 1 || ratio <= 0) {
                    alert("Ratio is out of range. Ratio must be less than or equal to 1, and greater than 0.");
                } else {
                    calId = stripNumberSign(calId);
                    var calObj = myCalendars.get(calId);
                    calObj.setRenderRatio(ratio);
                }
            }
        };

        /**
         * Performs an AJAX call to retrieve the iCal data at the specified URL and attempts to load the iCal data into the calendar.
         *
         * @param calId - (String) - The ID of the calendar </div> element.
         * @param iCalUrl -(String) - URL for the iCal data.
         * @param responseDataType - Data type of the response data, "html","xml","json","script"
         */
        this.loadICalSource = function(calId, iCalUrl, responseDataType) {
            if (calId != null && iCalUrl != null) {
                calId = stripNumberSign(calId);
                var calObj = myCalendars.get(calId);
                Calendar.loadICalSource(calObj, iCalUrl, responseDataType);
            }
        };

        /**
         *
         * Following methods are not exposed via the plugin. These are private.
         *
         */

        /**
         * Strips the "#" from the begining of string s (if there is one)
         *
         * @param s - (String) - A string with a single preceeding # character.
         * @return A String. The string s without the preceeding # character, or simply s if there is no # character.
         */

        function stripNumberSign(s) {
            if (s != null) {
                if (s.startsWith("#")) {
                    return s.substring(1, s.length);
                }
            }
            return s;
        };

    };



})(jQ_old);


/*   
=============================================================================== 
WResize is the jQuery plugin for fixing the IE window resize bug 
............................................................................... 
                                               Copyright 2007 / Andrea Ercolino 
------------------------------------------------------------------------------- 
LICENSE: http://www.opensource.org/licenses/mit-license.php 
WEBSITE: http://noteslog.com/ 

http://noteslog.com/post/how-to-fix-the-resize-event-in-ie/
=============================================================================== 
*/

(function($) {
    jQ_old.fn.wresize = function(f) {
        version = '1.1';
        wresize = {
            fired: false,
            width: 0
        };

        function resizeOnce() {
            if (jQ_old.browser.msie) {
                if (!wresize.fired) {
                    wresize.fired = true;
                } else {
                    var version = parseInt(jQ_old.browser.version, 10);
                    wresize.fired = false;
                    if (version < 7) {
                        return false;
                    } else if (version == 7) {
                        //a vertical resize is fired once, an horizontal resize twice 
                        var width = jQ_old(window).width();
                        if (width != wresize.width) {
                            wresize.width = width;
                            return false;
                        }
                    }
                }
            }

            return true;
        }

        function handleWResize(e) {
            if (resizeOnce()) {
                return f.apply(this, [e]);
            }
        }

        this.each(function() {
            if (this == window) {
                jQ_old(this).resize(handleWResize);
            } else {
                jQ_old(this).resize(f);
            }
        });

        return this;
    };

})(jQuery);
