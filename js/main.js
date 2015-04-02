
$(document).ready(function() {
    var $modal = $('.mask-modal');
    $('main').fullpage({
        sectionSelector: '.section',
        anchors:['day-0','day-1','day-2'],

        navigation: true,
        navigationPosition: 'left',
        navigationTooltips: ['Day 0', 'Day 1', 'Day 2'],
        recordHistory: false,
        menu:"#menu",

        css3:false,
        scrollOverflow: true
    });
    $('.material-design-hamburger__icon').on("click",toogleMenu);
    $modal.on("click",toogleMenu);
    $('.menu-link').on("click",toogleMenu);

    function toogleMenu(){
        $modal.toggleClass("background--blur");
        $("#menu").toggleClass("menu--on");
    }
});