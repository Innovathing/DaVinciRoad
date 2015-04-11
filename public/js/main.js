
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

        scrollOverflow: true,
        onLeave: function(index, nextIndex, direction){
            loadBackgroundArticle($("article:nth-child("+nextIndex+")"));
        },
        afterRender: function(){
            $.fn.fullpage.setAllowScrolling(true);

            // to fix missing onLeave function call for the first article
            loadBackgroundArticle($("article:first"));
        }

    });
    $.fn.fullpage.setAllowScrolling(false);
    $('.material-design-hamburger__icon').on("click",toogleMenu);
    $modal.on("click",toogleMenu);
    $('.menu-link').on("click",toogleMenu);

    function toogleMenu(){
        $modal.toggleClass("background--blur");
        $("#menu").toggleClass("menu--on");
    }

    function loadBackgroundArticle($bg){
        if($bg.data("bg") != null){
            if(!$bg.hasClass("loaded")){
                $bg.css("background-image","url("+$bg.data("bg")+")");
                $bg.addClass("loaded");
            }
        }
        $bg.find("img").each(function(){
            var src = $(this).data("original");
            $(this).attr("src",src).removeData('src');
        });
    }
});