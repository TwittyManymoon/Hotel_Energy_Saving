$(document).ready(function () {

    /* initialize the external events
    -----------------------------------------------------------------*/
    $('#external-events .fc-event').each(function () {

        // store data so the calendar knows to render an event upon drop
        $(this).data('event', {
            title: $.trim($(this).text()), // use the element's text as the event title
            stick: true // maintain when user navigates (see docs on the renderEvent method)
        });

        // make the event draggable using jQuery UI
        $(this).draggable({
            zIndex: 999,
            revert: true,      // will cause the event to go back to its
            revertDuration: 0  //  original position after the drag
        });

    });

    /* initialize the calendar
    -----------------------------------------------------------------*/
    var date = new Date();
    var d = date.getDate();
    m = date.getMonth();
    y = date.getFullYear();

    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        selectable: true,
        selectHelper: true,
        select: function (start, end) {
            var title = prompt('Event Title:');
            var eventData;
            if (title) {
                eventData = {
                    title: title,
                    start: start,
                    end: end
                };
                $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
            }
            $('#calendar').fullCalendar('unselect');
        },
        editable: true,
        eventLimit: true, // allow "more" link when too many events
        events: [
            {
                title: 'All Day Event',
                start: new Date(y, m, 2),
                className: 'bg-primary',
            },
            {
                title: 'Long Event',
                start: new Date(y, m, d - 4),
                end: new Date(y, m, d - 2),
                className: 'bg-info',
            },
            {
                title: 'Meeting John',
                start: new Date(y, m, d, 15, 20),
                allDay: false,
                className: 'bg-primary',
            },
            {
                title: 'New Task',
                start: new Date(y, m, d, 12, 0),
                end: new Date(y, m, d, 16, 0),
                allDay: false,
                className: 'bg-danger',
            },
            {
                title: 'Birthday Party',
                start: new Date(y, m, d + 2, 15, 0),
                end: new Date(y, m, d + 2, 20, 40),
                allDay: false,
                className: 'bg-warning',
            },
            {
                title: 'Alice Birthday',
                start: new Date(y, m, d + 4, 15, 0),
                end: new Date(y, m, d + 4, 18, 30),
                allDay: false,
                className: 'bg-info',
            },
            {
                title: 'Click for Google',
                start: new Date(y, m, 27),
                end: new Date(y, m, 28),
                url: 'http://google.com/',
                className: 'bg-danger',
            }

        ],
        droppable: true, // this allows things to be dropped onto the calendar
        drop: function () {

            if ($('#drop-remove').is(':checked')) {
                // if so, remove the element from the "Draggable Events" list
                $(this).remove();
            }
        }
    });
});