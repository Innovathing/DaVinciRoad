
$(document).ready(function() {
    var $modal = $('.mask-modal');
    var anchors = [];
    var tooltips = [];

    if(days == undefined){
        console.error("Unknown days var");
        return;
    }

    for(var i = 0; i<days.length; i++){
        anchors[i] = "day-"+days[i].id;
        tooltips[i] = "Day "+days[i].id+" - "+days[i].city;
    }

    $('main').fullpage({
        sectionSelector: '.section',
        anchors:anchors,

        navigation: true,
        navigationPosition: 'left',
        navigationTooltips: tooltips,
        recordHistory: false,
        menu:"#menu",

        scrollOverflow: true
    });
    $('.material-design-hamburger__icon').on("click",toogleMenu);
    $modal.on("click",toogleMenu);
    $('.menu-link').on("click",toogleMenu);

    $('.fp-section').on('inview',function(event,visible){
        console.log("toto");
        if(visible==true){
            $(this).addClass("inview");
        }
    });

    function toogleMenu(){
        $modal.toggleClass("background--blur");
        $("#menu").toggleClass("menu--on");
    }
});