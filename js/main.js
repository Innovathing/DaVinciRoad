
$(document).ready(function() {
    $('main').fullpage({
        sectionSelector: '.section',
        anchors:['day-0','day-1','day-2'],

        navigation: true,
        navigationPosition: 'left',
        navigationTooltips: ['Day 0', 'Day 1', 'Day 2'],
        recordHistory: false,

        css3:false,
        scrollOverflow: true
    });
});
