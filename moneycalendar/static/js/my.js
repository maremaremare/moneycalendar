clickData = {}



$(document).ready(function() {
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

        var date = eventObj.data.calDayDate;

        var x = eventObj.data.x;
        var y = eventObj.data.y;

        clickData = eventObj.data;
        date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        clickData.date = date;

    };


    $.fn.setCursorPosition = function(pos) {
        this.each(function(index, elem) {
            if (elem.setSelectionRange) {
                elem.setSelectionRange(pos, pos);
            } else if (elem.createTextRange) {
                var range = elem.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
        });
        return this;
    };



    function updateSumm(val) { /// эта функция обновляет сумму, когда текст удаляется backspace'ом

        match_array = val.match(/\d+\n|\d+$/g)
        summ = 0

        // if (!match_array) {
        //     summ = 0
        // }

        if (match_array) {
            for (var i = 0; i < match_array.length; i++) {
                summ += parseInt(match_array[i]);

            }
        }
        if (!val) {
            summ = ''
        }
        $('#summ').html(summ)

    }
    //var content = api.elements.content;


    function updateWeekSum(clickData, summ) { /// эта функция обновляет недельную сумму

        elem = $('#summs').children().eq(clickData.y - 1)
        //console.log($('#summs').children().eq(1), 'sumchilds')
        newHtml = parseInt(elem.html()) + parseInt(summ)
        elem.html(newHtml)
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
                console.log(data)

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
                console.log(data)

            },
            async: false,
        });

    }

    $('#textarea1').autosize()
    $('#textarea1').textcomplete([

        { // продукт
            match: /(^|\n)([a-zA-Zа-яА-ЯёЁ]{2,})$/,
            search: function(term, callback) {
                callback($.map(words, function(word) {
                    return word.indexOf(term) === 0 ? word : null;
                }));
            },
            replace: function(word) {
                // return word
                if (word) {
                    return ['$1' + word + '  (', ')  ']
                } else {
                    return word
                }
                '$1' + word + '  ';
            }
        },

        { // категория
            match: /(\()([a-zA-Zа-яА-ЯёЁ]{1,})$/,
            search: function(term, callback) {
                callback($.map(categories, function(word) {
                    return word.indexOf(term) === 0 ? word : null;
                }));
            },
            replace: function(word) {
                return '$1' + word; //'$1(' + word+ ')' ;
            }
        }

        // ]);
    ]);

    function myBind() {

        var summ = 0;
        if ($('#summ').html()) {
            summ = parseInt($('#summ').html());
        }

        $('#textarea1').bind("keydown", function(e) {

            var content = this.value; //значение textarea
            var lastLine = content.substr(content.lastIndexOf("\n") + 1);

            if (lastLine == '') {

                var str = content;
                var indices = [];
                for (var i = 0; i < str.length; i++) {
                    if (str[i] === "\n") indices.push(i);
                }
                lastLine = content.substr(indices[indices.length-2]+1,indices[indices.length-2]);
                //this.value = this.value.slice(0,-1);
                
            }

            console.log(lastLine)

            if (e.keyCode == 8) {
                updateSumm(content.slice(1, -1)); ///катит только если курсор в конце!!! дописать!!!

            }


            if (e.keyCode == 13 && !e.shiftKey) {

                if (/^[a-zA-Zа-яА-ЯёЁ]+\s\s\([a-zA-Zа-яА-ЯёЁ]+\)\s\s\d+$/.test(lastLine)) {
                    lineValue = parseInt(lastLine.match(/\d+$/)[0])
                    summ = summ + lineValue
                    //console.log('***')
                    //updateSumm(content);
                    $('#summ').html(summ)
                    //uodateSumm(content)

                } else if (/^[a-zA-Zа-яА-ЯёЁ]+$/.test(lastLine) && !($('.textcomplete-item').is(':visible'))) {
                    e.preventDefault();
                    content = content + '  ()  '
                    len = content.length
                    $('#textarea1').val(content).setCursorPosition(len - 3);
                    //this.val(content).setCursorPosition(len - 3);
                } else if (/^[a-zA-Zа-яА-ЯёЁ]+\n/.test(lastLine) && !($('.textcomplete-item').is(':visible'))) {
                    e.preventDefault();
                    content = content.slice(0,-2) + '  ()  '
                    len = content.length
                    $('#textarea1').val(content).setCursorPosition(len - 3);
                    //this.val(content).setCursorPosition(len - 3);


                } else if (/^[a-zA-Zа-яА-ЯёЁ]+\s\d+$/.test(lastLine)) {
                    console.log('***')
                    e.preventDefault();
                    // lastLine = lastLine.replace(' ', '()')
                    // prevContent = content.substring(blabla)
                    // updated_content = prevContent + lastLine
                    // len = updated_content.length
                    // digits = lastLine.match(/d+$/)
                    // $('#textarea1').val(updated_content).setCursorPosition(len - digits.length - 2);
                    //this.val(content).setCursorPosition(len - 3);

                } else if (/^[a-zA-Zа-яА-ЯёЁ]+\s\s\([a-zA-Zа-яА-ЯёЁ]+\)\s\s$/.test(lastLine) && !($('.textcomplete-item').is(':visible'))) {
                    e.preventDefault();
                    len = content.length
                    $('#textarea1').val(content).setCursorPosition(len);
                    //this.val(content).setCursorPosition(len);

                } else

                {
                    
                    console.log(lastLine)
                    e.preventDefault();

                }

            }
        });

        // $('#textarea1').autosize().overlay([{
        //         match: /\s\s\(([a-zA-Zа-яА-ЯёЁ]+)\)\s\s/g,
        //         css: {
        //             'background-color': 'blue'
        //         }
        //     },

        //     {
        //         match: /\.\d+\./g, ///(\d+)/g,
        //         css: {
        //             'background-color': 'red'
        //         }

        //     }
        // ]);;
    }

    $('.JFrontierCal-Day-Cell').qtip({

        overwrite: true,
        content: {
            text: $('#holder').clone()
        },

        show: {
            event: 'click',
        },
        hide: {
            event: 'unfocus'
        },
        style: {
            classes: 'qtip-light qtip-shadow',
            style: 'h'
            //width: $('#textarea').attr('width')
            // width: 200,
            // height: 200,

        },
        position: {
            my: 'center center', // Position my top left...
            at: 'center center', // at the bottom right of...
            target: 'event' // my target
        },
        events: {
            hide: function(event, api) {

                $('#textarea1').unbind();

                var summ = $('div#summ').html()
                var text = $('#textarea1').val()

                if (summ && text) {
                    if (text.slice(-1) == "\n") {
                        text = text.slice(0,-1)
                        console.log(text, 'thats text altered')
                    }
                    if (api.target.html() == '') {
                        postDataToDjango(summ, text, clickData)
                        clickData.text = text

                    } else {
                        putDataToDjango(summ, text, clickData)
                        clickData.text = text
                    }

                }


                if (summ) {
                    api.target.html(summ)
                    updateWeekSum(clickData, summ)
                    updateMonthSum()
                }

                $("#foo").unbind();

            },
            show: function(event, api) {

                //bindkeydown()
                if (clickData.text) {
                    $('#textarea1').val(clickData.text);
                    $('#summ').html(clickData.summ);


                    //   $('.textoverlay').val(clickData.text);
                } else {
                    $('#textarea1').val('');
                    $('#summ').html('');

                    // $('.textoverlay').html('');
                }


                api.elements.content.html($('#holder'));
                myBind()


            },


        }


    }, clickData);

});
