
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
            // to fix missing onLeave function call for the first article
            loadBackgroundArticle($("article:first"));
        }

    });
    $('.material-design-hamburger__icon').on("click",toogleMenu);
    $modal.on("click",toogleMenu);
    $('.menu-link').on("click",toogleMenu);

    function toogleMenu(){
        $modal.toggleClass("background--blur");
        $("#menu").toggleClass("menu--on");
    }

    function loadBackgroundArticle($bg){
        maps.$current_article = $bg;
        maps.initMaps();
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

var maps = {
   $current_article:null,

   initMaps: function(){
       if(google != undefined && this.$current_article != null){
           this.$current_article.find("map.unload").each(function(){
               $(this).removeClass("unload");
               var map = new google.maps.Map(this, null);

               var ctaLayer = new google.maps.KmlLayer({
                   url: $(this).data("src")
               },{
                   preserveViewport: true
               });
               ctaLayer.setMap(map);
           });
       }
   }

};
