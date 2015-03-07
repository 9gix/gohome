var GoHome = (function(){

    var map;
    var markersArray = [];
    var kmlLayersArray = [];

    function addMarker(location) {
      marker = new google.maps.Marker({
        position: location,
        map: map
      });
      markersArray.push(marker);
    }

    // Removes the overlays from the map, but keeps them in the array
    function clearOverlays() {
      if (markersArray) {
        for (i in markersArray) {
          markersArray[i].setMap(null);
        }
      }
    }

    // Shows any overlays currently in the array
    function showOverlays() {
      if (markersArray) {
        for (i in markersArray) {
          markersArray[i].setMap(map);
        }
      }
    }

    // Deletes all markers in the array by removing references to them
    function deleteOverlays() {
      if (markersArray) {
        for (i in markersArray) {
          markersArray[i].setMap(null);
        }
        markersArray.length = 0;
      }
    }

    function addKmlLayer(serv_no,serv_dir) {
        kmlLayer = new google.maps.KmlLayer('http://mytransport.sg/kml/busroutes/'+serv_no+'-'+serv_dir+'.kml');
        kmlLayer.setMap(map);
        kmlLayersArray.push(kmlLayer);
    }

    function deleteLayers() {
      if (kmlLayersArray) {
        for (i in kmlLayersArray) {
          kmlLayersArray[i].setMap(null);
        }
        kmlLayersArray.length = 0;
      }
    }

    function initControl(){
        $("#add_route").click(function(){
            var bus_service = $("#busservice_option").val();
            if (bus_service != "default")
            {
                addKmlLayer(bus_service.split("_")[0],bus_service.split("_")[1]);
            }
        });

        $("#clear_route").click(function(){
            deleteLayers();
        });

        $("#reset_marker").click(function(){
            deleteOverlays();
        });

        $("#busservice_option").keyup(function(event){
            if(event.keyCode == 13){
                $("#add_route").click();
            }
        });
    }

    function initMap() {
        var latlng = new google.maps.LatLng(1.35188, 103.820114);
        var myOptions = {
            center: latlng,
            zoom: 11,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById("map"),
            myOptions);

        var contextMenu = $('#contextMenu');

        // Disable the browser context menu on our context menu
        contextMenu.bind('contextmenu', function() { return false; });

        // Append it to the map object
        $(map.getDiv()).append(contextMenu);


        // Keep track of where you clicked
        var clickedLatLng;

        // Display and position the menu
        google.maps.event.addListener(map, 'rightclick', function(e)
        {
            // start buy hiding the context menu if its open
            contextMenu.hide();

            var mapDiv = $(map.getDiv()),
                x = e.pixel.x,
                y = e.pixel.y;

            // save the clicked location
            clickedLatLng = e.latLng;

            // adjust if clicked to close to the edge of the map
            if ( x > mapDiv.width() - contextMenu.width() )
                x -= contextMenu.width();

            if ( y > mapDiv.height() - contextMenu.height() )
                y -= contextMenu.height();

            // Set the location and fade in the context menu
            contextMenu.css({ top: y, left: x }).fadeIn(100);
        });

        // Set some events on the context menu links
        contextMenu.find('a').click( function()
        {
            // fade out the menu
            contextMenu.fadeOut(75);

            // The link's href minus the #
            var action = $(this).attr('href').substr(1);

            switch ( action )
            {
                case 'markHere':
                    addMarker(clickedLatLng);
                    break;

                case 'zoomIn':
                    map.setZoom(
                        map.getZoom() + 1
                    );
                    map.panTo(clickedLatLng);
                    break;

                case 'zoomOut':
                    map.setZoom(
                        map.getZoom() - 1
                    );
                    map.panTo(clickedLatLng);
                    break;

                case 'centerHere':
                    map.panTo(clickedLatLng);
                    break;
            }

            return false;
        });
        // Hover events for effect
        contextMenu.find('a').hover( function() {
            $(this).parent().addClass('hover');
        }, function() {
            $(this).parent().removeClass('hover');
        });

        // Hide context menu on some events
        $.each('click dragstart zoom_changed maptypeid_changed'.split(' '), function(i,name){
            google.maps.event.addListener(map, name, function(){ contextMenu.hide() });
        });

    }

    function init(){
        initMap();
        initControl();
    }

    return {
        init: init,
    }
})();

document.addEventListener("DOMContentLoaded", function(){
    GoHome.init();
});