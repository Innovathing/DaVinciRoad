
$(document).ready(function() {
    var $modal = $('.mask-modal');
    var anchors = ["home"];
    var tooltips = ["Home"];

    if(days == undefined){
        console.error("Unknown days var");
        return;
    }

    for(var i = 0; i<days.length; i++){
        anchors[i+1] = "day-"+days[i].id;
        tooltips[i+1] = "Day "+days[i].id+" - "+days[i].city;
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

function initLightGallery(){
    $(document).ready(function() {
        $('.gird-photos').lightGallery({
          videoMaxWidth:'-1', 
        });
    });
}

var maps = {
   $current_article:null,

   initMaps: function(){
       if(google != undefined && this.$current_article != null){
           this.$current_article.find("map.unload").each(function(){
               $(this).removeClass("unload");
               var map = new google.maps.Map(this, {
                   scrollwheel: false
               });

               var ctaLayer = new google.maps.KmlLayer({
                   url: $(this).data("src")
               },{
                   preserveViewport: true
               });
               ctaLayer.setMap(map);
           });
           var homemap = $("#home-map.unload");
           if(homemap != undefined){
               var bounds = new google.maps.LatLngBounds(null);
               if(homemap.hasClass("unload")){

                   homemap.removeClass("unload");
                   var day = [];
                   day[0] = new google.maps.LatLng(43.6046879,1.4445879);
                   bounds.extend(day[0]);
                   day[1] = new google.maps.LatLng(44.276439,9.4009036);
                   bounds.extend(day[1]);
                   day[2] = new google.maps.LatLng(43.7694729,11.2549453);
                   bounds.extend(day[2]);
                   day[3] = new google.maps.LatLng(41.9028509,12.4964703);
                   bounds.extend(day[3]);
                   day[4] = new google.maps.LatLng(43.6158298,13.5189147);
                   bounds.extend(day[4]);
                   day[5] = new google.maps.LatLng(45.4408535,12.3155329);
                   bounds.extend(day[5]);
                   day[6] = new google.maps.LatLng(45.0703088,7.6868731);
                   bounds.extend(day[6]);


                   var map = new google.maps.Map(window.document.getElementById("home-map"), {
                       scrollwheel: false,
                       disableDefaultUI: true,
                       center:day[1],
                        draggable: false
                   });


                   $("map").each(function(){
                       var ctaLayer = new google.maps.KmlLayer({
                           url: $(this).data("src"),
                           preserveViewport:true,
                           suppressInfoWindows:true
                       },null);
                       ctaLayer.setMap(map);
                   });

                   for(var i = 0; i<day.length; i++){
                       new google.maps.Marker({
                           position: day[i],
                           map: map
                       });
                   }
                   map.fitBounds(bounds);
                   map.panToBounds(bounds);

               }
           }
       }
   }

};
