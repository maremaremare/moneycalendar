clickData = {}
$.fn.outerHTML = function() {
   return (this[0]) ? this[0].outerHTML : '';  
};
var ui = {

    dataArray: {},
    getCookie: function(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    },

    makeNewLine: function() {
        newElem = $('<li class="expense"><div class="ddd"></div></li>')
        $('#ulInput').append(newElem);
       // console.log('openImputsfrommakenewline')
        this.openInputs(newElem);
        //$('#expenseInput').focus();
    },

    renderLiContent: function(str) { //из существующего li передаем значения в input'ы

            var summ = str.match(/\d+/)[0];
            var category = str.match(/\s\s[a-zA-Zа-яА-ЯёЁ]+(?=\s\s)/)[0];
            category = category.slice(2)
            var expense = str.match(/[a-zA-Zа-яА-ЯёЁ]+(?=\s\s)/)[0];
            $('#summInput').val(summ)
            $('#categoryInput').typeahead('setQuery', category)//.val(category)
            //console.log(summ)
            $('#expenseInput').typeahead('setQuery', expense)//.val(expense);
        

    },
    checkAllEmpty: function(){
    if ($('#summInput').val() && $('#expenseInput').val() && $('#categoryInput').val()) {
        return true 
    } else {
        return false
    }
    
    },

    checkInputsEmpty: function() {
        var a = 0
        $("span>input").each(function() {
            if ($(this).val() != '') {
                a += 1
                console.log(this, $(this).val(), a)
            }
        });

        if (a > 0) { ///переписать коротким синтаксисом

            return false
        } else {
            return true
        }

    },

    openInputs: function(elem) {
        if ($('#rootCategoryInput').size()) {
            $('#rootCategoryInput').remove()
        }
       // console.log($('input').val())
        $('input').val('');
       // console.log($('input').val())
       // console.log(elem,'elem')
        var div = $(elem).find("div")
       // console.log(div, 'render')
        var str = div.html();
       // console.log(str,'str')
       // console.log(/<[a-z][\s\S]*>/i.test(str))
        if ( str && !/<[a-z][\s\S]*>/i.test(str)) {
 
        ui.renderLiContent(str)
        }
        $('li>div:hidden').toggle(true);
        a = elem.find("div")
        elem.html($('#input-line'));
        elem.append(a);
        a.toggle(false)
        $('#input-line').toggle(true);

    },

    closeInputs: function() {
        $('#ulInput').append($('#input-line'))
    },

    unbindClicks: function() {
        console.log('UNBINDCLICKS')
        $('#ulInput').undelegate();
        $('#expenseInput').typeahead('destroy');
        $('#category').typeahead('destroy');
    },

    bindClicks: function() {
        console.log('BINDCLICKS')


    ui.enableTypeAheadExpense();
    ui.enableTypeAheadCategory();



        $('#ulInput').delegate("div.ddd", "click", function(event) {


        //если пустой и нижний то не сохранять его.


           // // if (ui.validate()) {  
            var activeLi = $('#input-line').parents('li');
            console.log(activeLi, activeLi.next(), 'next')
           if (ui.validate()) {
           ui.saveCurrentLi($("#input-line"));

           //изменить сумму
           } //dosn work
           target = event.target;

           //  console.log(ui.checkInputsEmpty(), 'check')

           //  if (activeLi.next().length == 0 && ui.checkInputsEmpty()) {
           //      console.log('ddd')
           //      ui.closeInputs();
           //      activeLi.last().remove();
           //  } else {
           //      //ui.saveCurrentLi($("#input-line"));
           //  }
           //  ui.openInputs($(target).parents('li'));
           //  $('#expenseInput').focus()

            if (activeLi.next().length == 0 && !ui.checkAllEmpty()) {
                console.log('ddd')
                ui.closeInputs();
                activeLi.last().remove();
            } 
           // console.log('openImputsfrombindClick')
            ui.openInputs($(target).parents('li'));
            $('#expenseInput').focus()



            }); 
      //  });
    },

    enableTypeAheadExpense: function() {

        $('#expenseInput').typeahead({

            prefetch: {
                ttl: 1,
                filter: function(response) {
                    var array = [];
                    for (var i in response.objects) {

                        var dict = {}
                        dict['value'] = response.objects[i].name
                        dict['category'] = response.objects[i].category.name
                        //dict['tokens'] = response.objects[i].tokens


                        array.push(dict);

                    }
                  //  console.log(array, 'THATSARRAY')
                    return array;
                    //return response.objects
                },

                url: '/api/v1/expense/',
                //valueKey: 'name',

            },


            template: [

                '<p>{{value}} ({{category}})</p>',

            ].join(''),
            engine: Hogan
        }).on('typeahead:selected', function($e, datum, dataset) {
           // console.log(datum)



            $('#categoryInput').typeahead('setQuery', dataset.category)//val(dataset.category)
            thisli = $('#categoryInput').parents('li')
            ind_y = thisli.index()

            if (!ui.dataArray[ind_y]) {
                ui.dataArray[ind_y] = ['', '', '']
            }
            ui.dataArray[ind_y][0] = dataset.value
            ui.dataArray[ind_y][1] = dataset.category

            $('#summInput').focus()
        });
    },

    enableTypeAheadCategory: function() {





        $('#categoryInput').typeahead({

            prefetch: {
                ttl: 1,


                url: '/api/v1/category/',
                filter: function(response) {
                    var array = [];
                    for (var i in response.objects) {
                        array.push(response.objects[i].name);

                    }
                    return array;
                }
            },

        });

    },

    unbindKeydowns: function(){
        console.log('UNBINDKEYDOWNS')
        $('#expenseInput').unbind()
        $('#categoryInput').unbind()
        $('#summInput').unbind()
    },

    bindKeydowns: function(data) {
        console.log(data)
       console.log('BINDKEYDOWNS')
       // console.log(clickData);
        $('#expenseInput').bind('keydown', function(event) {
            //console.log('kkk')
            if (event.keyCode == 13 && !event.shiftKey && $('.tt-dropdown-menu').is(':hidden')) { //enter


                $('#categoryInput').focus()
            }

            if (event.keyCode == 8 && ui.checkInputsEmpty()) { //escape
                // console.log('переходить на предыдущую строку')

                elem = $(this).parents('li').prev()



                if (elem.is('li')) {



                    if (ui.checkInputsEmpty()) {
                      //  console.log('ddd')
                        var a = $('#input-line').parents('li');
                        ui.closeInputs();
                       // console.log($('#input-line').parents('li'))
                        a.remove();
                        //activeLi.last().remove();
                    }

                  //  console.log('openImputsfrombindkeydown')
                    ui.openInputs(elem);
                } else {


                    // console.log('создать новый элемент')

                }

                $('#expenseInput').focus();
            }
        });

        $('#categoryInput').bind('keydown', function(event) {
            if (event.keyCode == 13 && !event.shiftKey) { //enter


                if (ui.getItemUriOrFalse(this.value, 'category')) { //ecли введена существующая категория
                    if ($('#rootCategoryInput').size()) { //если случайно остался инпут с рут-категорией, убрать его
                        $('#rootCategoryInput').remove();
                    }
                    $('#summInput').focus()
                } else { //если этой категории нет, создаем новый импут 
                    if (!$('#rootCategoryInput').size()) {
                        var newInput = $("<input type='text' id='rootCategoryInput' placeholder='родитель'>");
                        $(this).parents('span').after(newInput); // вставить новый импут
                        $('#rootCategoryInput').typeahead({

                            prefetch: {
                                ttl: 1,


                                url: '/api/v1/category/',
                                filter: function(response) {
                                    var array = [];
                                    for (var i in response.objects) {
                                        array.push(response.objects[i].name);

                                    }
                                    return array;
                                }
                            },

                        });
                    }
                    ui.bindRootCategory();
                    $('#rootCategoryInput').focus()
                }

            }

            if (event.keyCode == 8 && this.value == '') { //escape
                $('#summInput').focus()

            }
        });

        $('#summInput').bind('keydown', data, function(event) {
            if (event.keyCode == 13 && !event.shiftKey) {
                //console.log('записать значение!')
                //console.log(this, 'obladilblada')

                if (ui.validate()) {

                    // var summ = parseInt($('#summInput').val())
                    // if (!$('#summ').html()) {
                    //     $('#summ').html(summ)

                    // } else {
                    //     $('#summ').html(parseInt($('#summ').html()) + summ);
                    // }

                    
                    $('#summ').html(ui.calculateSumm(data));
                    ui.saveCurrentLi(this); //записываем содержимое input'ов в нужную li


                    // elem = $(this).parents('li').next() //находим следующую li
                    // if (elem.is('li')) { //если он есть, 
                    //    ui.openInputs(elem); // то открываем его
                    // } else {


                    ui.makeNewLine();

                    //console.log('new li created')

                    //  }

                    $('#expenseInput').focus();
                }

            }

            if (event.keyCode == 8 && this.value == '') {
                $('#categoryInput').focus()
            }
        });
    },

    summArray: function(){

    },

    calculateSumm: function(data) {
        console.log(data)
        var summ = 0
        for (var i in data) {
            console.log(data[i])
            summ += parseInt(data[i])            

        }
        console.log(summ)
        return summ
    },

    bindRootCategory: function() {

        $('#rootCategoryInput').bind('keydown', function(event) {
            if (event.keyCode == 13 && !event.shiftKey) {

                d = {
                    'name': $('#categoryInput').val(),
                    'parent': ui.getItemUriOrFalse($('#rootCategoryInput').val(), 'category'),
                    'csrfmiddlewaretoken': ui.getCookie('csrftoken'),
                    'created_by': '/api/v1/user/' + current_user_id + '/',

                };

                jQuery.ajax({
                    url: '/api/v1/category/',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(d),
                    async: false,
                });

                $('#summInput').focus()

            }
        });

    },

    makeDataArray: function(data, clickData) {

        $("input[type='text']").bind('change keyup input', data, function() {

            var ind_x, ind_y;

             thisli = $(this).parents('li')
            ind_y = thisli.index()

            if ($(this).attr("id") == "expenseInput") {
                ind_x = 0;
            } else if ($(this).attr("id") == "categoryInput") {
                ind_x = 1;
            } else if ($(this).attr("id") == "summInput") {
                ind_x = 2;
               if (!clickData.summ_array) {
                clickData.summ_array = {}
               }

               if (!clickData.summ_array[ind_y]) {
                clickData.summ_array[ind_y] = ''
                clickData.summ_array[ind_y] = $(this).val();
               } else {
                clickData.summ_array[ind_y] = $(this).val();

               }
               
console.log(clickData.summ_array)
            }
            // } else if ($(this).attr("id") == "rootCategoryInput")  {
            // ind_x = 3;  }

           
            if (!data[ind_y]) {
                data[ind_y] = ['', '', '']
            }


            data[ind_y][ind_x] = $(this).val()
            //console.log(data)
        });




    },

    summDataArray: function(clickData) {

    },

    validate: function() {

        function IsNumeric(input) {
            return (input - 0) == input && (input + '').replace(/^\s+|\s+$/g, "").length > 0;
        }

        var expense = $('#expenseInput').val();
        var category = $('#categoryInput').val()
        var summ = $('#summInput').val()

        if (expense && category && summ) {
            if (IsNumeric(summ)) {
                return true
            } else {
                return false;
            }
        } else {
            return false
        }

    },

    saveCurrentLi: function(thisElem) { //сохранить значения из инпутов в li
        console.log(thisElem)
        var expense = $('#expenseInput').val();
        //console.log(expense, 'expense')
        var category = $('#categoryInput').val()
        var summ = $('#summInput').val()
        var val = ui.validate()
        //console.log(val)


        a = expense + '  ' + category + '  ' + summ;

        li = $(thisElem).parents('li');


        div = $(li).children().get(1)
        $(div).html(a);
        console.log(li, a )



        //здесь должна быть валидация!!

    },

    dataToRequest: function(currentDate) {
        var data = {
            'objects': [],
            //'csrfmiddlewaretoken': ui.getCookie('csrftoken'),

        }
        for (var i in ui.dataArray) {
           // console.log(ui.dataArray)

           // console.log(ui.dataArray[i], '&&&&&&&')
            if (ui.dataArray[i][0] && ui.dataArray[i][1] && ui.dataArray[i][2]) {
                var category = ui.getItemUriOrFalse(ui.dataArray[i][1], 'category') //если это новый расход
              //  console.log(category)
                object = {
                    "expense": ui.getExpenseItem(ui.dataArray[i][0], category),
                    "summ": ui.dataArray[i][2],
                    "date": currentDate,
                    "created_by": '/api/v1/user/' + current_user_id + '/'
                }
               // console.log(object)
                data.objects.push(object)

                // return JSON.stringify(object)
                //  return object
                // data.objects.push(object)
            }
        }
        //console.log(object)
       // console.log(data)
        return JSON.stringify(data)
        //return data
    },


    bindSave: function(clickData, qtip) {
        console.log('BINDSAVE')

        $('#save').on('click', clickData, function(event) {
            event.preventDefault();
            console.log('save')
            console.log(clickData)


            jQuery.ajax({
                url: '/api/v1/entry/',
                type: 'PATCH',
                contentType: 'application/json',

                data: ui.dataToRequest(clickData.date),
                success: function(data) {
                    ui.afterSave(clickData)
                },
                async: false,
            });


//                 if (ui.validate()) {

//                     var summ = parseInt($('#summInput').val())
//                     if (!$('#summ').html()) {
//                         $('#summ').html(summ)

//                     } else {
//                         $('#summ').html(parseInt($('#summ').html()) + summ);
//                     }

//                     console.log(this)
//                     ui.saveCurrentLi($('#summInput')); 
//                     //ui.closeInputs()//записываем содержимое input'ов в нужную li

// }

ui.saveCurrentLi($('#summInput')); 
          ui.closeInputs()
          var html = ''
          $.each($('li.expense:not(:has(span))'), function(i, val) {
            //console.log(val)
            //console.log($(val).children().has('span'))
               
               html += val.outerHTML
               
               

          });

         // var c_obj = jfcalplugin.calendar.getCalendarDayObjByDate(today)
          //console.log(html)
          //console.log(clickData)
          clickData.html = html
          //clickData.obj.setHtml(html)


          summ = $('#summ').html()
          clickData.summ = summ
         //  qtip.qtip('api').hide();
          

          
         //clickData.obj.setSumm(summ);
          //console.log($('#ulInput').html());



        });

    },

    afterSave: function(clickData) {

        $('#save').unbind()


       //console.log('aftersave');
        //закрыть окошко
        //отрисовать ячейку
    },


    getItemUriOrFalse: function(item, type) {
        var items;
        jQuery.ajax({
            url: '/api/v1/' + type + '/?name=' + item,
            type: 'GET',
            contentType: 'application/json',
            success: function(data) {

                items = data
            },
            async: false,
        });

        if (items.objects[0]) {
            //console.error(newexpense,'newexpense')
            return items.objects[0].resource_uri
        } else {
            return false
        }

    },


    getExpenseItem: function(expense, category) {

        var exp = ui.getItemUriOrFalse(expense, 'expense')

        if (exp) {

            return exp

        } else {

            d = {
                'name': expense,
                'category': category,
                'csrfmiddlewaretoken': ui.getCookie('csrftoken'),
                'created_by': '/api/v1/user/' + current_user_id + '/',

            };

            jQuery.ajax({
                url: '/api/v1/expense/',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(d),
                async: false,
            });
            
            $('#expenseInput').typeahead('destroy');
            ui.enableTypeAheadExpense();
        };

    return ui.getItemUriOrFalse(expense, 'expense')

}





}

$(document).ready(function() {
    //console.log('"UTUTQ!')







    /// старый код



    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            function getCookie(name) {
                var cookieValue = null;
                if (document.cookie && document.cookie != '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = jQuery.trim(cookies[i]);
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }
            if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            }
        }
    });
    // using jQuery

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    var clickDate = "";


    /**
     * Initializes calendar with current year & month
     * specifies the callbacks for day click & agenda item click events
     * then returns instance of plugin object
     */
    var jfcalplugin = jQ_old("#mycal").jFrontierCal({
        date: new Date(),
        dayClickCallback: myDayClickHandler,

    }).data("plugin");



    /**
     * Make the day cells roughly 3/4th as tall as they are wide. this makes our calendar wider than it is tall.
     */
    jfcalplugin.setAspectRatio("#mycal", 0.75);

    /**
     * Called when user clicks day cell
     * use reference to plugin object to add agenda item
     */

    function myDayClickHandler(eventObj) {


        // Get the Date of the day that was clicked from the event object
      // console.log(eventObj)
        var date = eventObj.data.calDayDate;
        var obj = jfcalplugin.calendar.getCalendarDayObjByDate(date)
        var x = eventObj.data.x;
        var y = eventObj.data.y;

        clickData = eventObj.data;
        date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        clickData.date = date;
        clickData.obj = obj

    };

    //var content = api.elements.content;


    function updateWeekSum(clickData, summ) { /// эта функция обновляет недельную сумму

        elem = $('#summs').children().eq(clickData.y - 1)
        //console.log($('#summs').children().eq(1), 'sumchilds')
        week_y = 2*(clickData.y)
        
        week_row = $('#mycal').children().eq(week_y)
        var newSumm = 0;
        $.each($(week_row).children(), function(index, val) {
            if ($(val).html()){
            newSumm += parseInt($(val).html())}
        });
        console.log(newSumm)
        
        elem.html(newSumm)
    }


    function updateMonthSum() {
        var monthSum = 0
        $('#summs').children().each(function() {
            monthSum += parseInt($(this).html())
            //console.log($(this).html())
        })

        $('#monthSum').html(monthSum);

    }

    function postDataToDjango(summ, text, clickData) {
        var csrftoken = getCookie('csrftoken');

        jQuery.ajax({
            url: '/api/v1/day/',
            type: 'POST',
            data: {
                'date': clickData.date,
                'summ': summ,
                'text': text,
                'csrfmiddlewaretoken': csrftoken,
                'created_by': '/api/v1/user/' + current_user_id + '/'
            },
            success: function(data) {
               // console.log(data)

            },
            async: false,
        });
    }

    function putDataToDjango(summ, text, clickData) {
        var csrftoken = getCookie('csrftoken');

        jQuery.ajax({
            url: '/api/v1/day/' + clickData.date + '/',
            type: 'PUT',
            data: {
                'date': clickData.date,
                'summ': summ,
                'text': text,
                'csrfmiddlewaretoken': csrftoken,
                'created_by': '/api/v1/user/' + current_user_id + '/'
            },
            success: function(data) {
               // console.log(data)

            },
            async: false,
        });

    }



   var qtip = $('.JFrontierCal-Day-Cell').qtip({

        overwrite: true,
        content: {
            text: $('#cont')
        },
       

        show: {
            event: 'click',
        },
        hide: {
            event: 'click unfocus',
            target: $('#save')
        },


       
        style: {
            classes: 'qtip-light qtip-shadow',
            style: 'h',

            //width: $('#textarea').attr('width')
            //width: 300,
            // height: 200,

        },
        position: {
            my: 'center center', // Position my top left...
            at: 'center center', // at the bottom right of...
            target: 'event' // my target
        },

        events: {

            show: function(event, api) {
                 var tooltip = api.elements.tooltip
                 var contentDiv = tooltip.find('.qtip-content')
                 console.log($(contentDiv).children().size())
                 if ($(contentDiv).children().size() == 0) {
                    $(contentDiv).html($('#cont'))
                 }
                 //console.log(contentDiv)

            },




             render: function(event, api) {
            // Grab the tooltip element from the API


            

            var tooltip = api.elements.tooltip
            
            // ...and here's the extra event binds
            tooltip.bind('tooltipshow', function(event, api) {
                console.log(api.elements, 'eleeemeeents')

                console.log(tooltip)
                contentDiv = tooltip.find('qtip-content')
                console.log(contentDiv, 'contentDiv')
                
                
                console.log('ONRENDER!!!!!!!!!!!!!!')
                console.log($('#cont').parents().get(0))
                 //$("#ulInput").append($(clickData.html))


                $('#summ').html('');
                var today = new Date()
                    ui.closeInputs();
                    $("li.expense").remove();

                    if (clickData.html) { //если есть данные по этому дню
                    $("#ulInput").append($(clickData.html))
                    $('#summ').html(clickData.summ);
                }
                    //api.elements.content.html('');
                    ui.bindClicks();
                    console.log(clickData.summ_array)
                    ui.bindKeydowns(clickData.summ_array);
                    ui.makeDataArray(ui.dataArray, clickData);
                    ui.makeNewLine();
                   // ui.bindSave(clickData)
                    console.log($('#cont').parents().get(0))

            })

        },

 hide: function(event, api) {


     console.log('hide')

     jQuery.ajax({
                url: '/api/v1/entry/',
                type: 'PATCH',
                contentType: 'application/json',

                data: ui.dataToRequest(clickData.date),
                success: function(data) {
                    console.log('aaa')
                    //ui.afterSave(clickData)
                },
                async: false,
            });

     //      //ui.closeInputs()
         $('#summ').html(ui.calculateSumm(clickData.summ_array));  
          ui.saveCurrentLi($('#summInput')); 
          ui.closeInputs()
          var html = ''
          $.each($('li.expense:not(:has(span))'), function(i, val) {
            //console.log(val)
            //console.log($(val).children().has('span'))
               
               html += val.outerHTML
               
               

          });

     //     // var c_obj = jfcalplugin.calendar.getCalendarDayObjByDate(today)
     //      //console.log(html)
     //      //console.log(clickData)
         clickData.html = html
     //      //clickData.obj.setHtml(html)


          summ = $('#summ').html()
          clickData.summ = summ


           

              ui.unbindClicks()
              ui.unbindKeydowns()

            if (summ) {
              console.log(summ)
               console.log('NEWSUMMRENDERED')
               api.target.html(summ)
                updateWeekSum(clickData, summ)
                updateMonthSum()
             }
   //  api.destroy();

//$('#cc').html($('#cont'))
        }

// show: function(event, api) {
//             // Grab the tooltip element from the API
//            // api.elements.content.html($('#cont'));
//             var tooltip = api.elements.tooltip

         
//                              console.log('show')


            

          

//         },

         // hide: function(event, api) {
         //        console.log('hide')

         //        summ = $('#summ').html()
         //       console.log('UNBINDSAVE')
         //        $('#save').unbind()
         //        ui.unbindClicks()
         //        ui.unbindKeydowns()


         //        if (summ) {
         //            console.log(summ)
         //            console.log('NEWSUMMRENDERED')
         //            api.target.html(summ)
         //            updateWeekSum(clickData, summ)
         //            updateMonthSum()
         //        }
         //        //$('#cc').html($('#cont'))
         //        //api.elements.content.html('')
                

         //        //api.destroy();

         //    },


       }


    }, clickData);

});
