var map;
var markers = [];
var infoWindow;
var found =[];

function initMap() {
    var SL = {lat: 6.927079, lng: 80.7718};
    map = new google.maps.Map(document.getElementById('map'), {
        center: SL,
        zoom: 3.5,
    });
    infoWindow = new google.maps.InfoWindow();
    
    var input = document.getElementById("country-code");
    input.addEventListener("keyup", function(event){
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("myBtn").click();
        }
    });

    showMarkers(statistics)
    setContent(statistics)
    showCircles(statistics)
    setContentListener()
}


function createMarker(latlng, name, death, countryCode, infected , recovered ,active , critical) {
    var html = `
        <div class="window">
            <div class="window-info">
                <div class="window-info-title">
                    <div class="window-title">${name}</div>
                </div>
                <div class = "window-stats-title">
                    <div class="window-stats-infected">Infected: ${infected}</div>
                    <div class="window-stats-recovered">Recovered: ${recovered}</div>
                    <div class="window-stats-death">Dead: ${death}</div>                    
                    <div class="window-stats-active">Active cases: ${active}</div>
                    <div class="window-stats-critical">Crtitical cases: ${critical}</div>                    
                </div>
            </div>
        </div>                    
    `;
    var marker = new google.maps.Marker({
        map: map,
        position: latlng,
        label:countryCode,
    });
    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });
    markers.push(marker);

    setContent(found)
    showCircles(found)
    setContentListener()
}

function showCircles(statistic){
    statistic.forEach(function(country){
        // Add the circle for this city to the map.
        var coordinates = {lat: country.lat , lng: country.lng}
        new google.maps.Circle({
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 1.5,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map: map,
          center: coordinates,
          radius: Math.sqrt(country.totalConfirmed) * 1000
        });
    })
}

function showMarkers(statistic){
    statistic.forEach(function(country){
        var latlng = new google.maps.LatLng(
            country.lat,
            country.lng,)

        var name = country.country
        var death = commafy(country.totalDeaths)
        var countryCode = country.countryCode
        var infected = commafy(country.totalConfirmed)
        var recovered = commafy(country.totalRecovered)
        var active = commafy(country.activeCases)
        var critical = commafy(country.totalCritical)
        createMarker(latlng , name , death , countryCode, infected , recovered ,active , critical)
    })
}

function setContent(statistic){
    var content = ''
    statistic.forEach(function(country){
        content += `
        <div class="info">
            <div class="info-list">
                <div class="info-title">
                    <div class="info-title-name">${country.country}</div>
                </div>
                <div class="info-stats">
                    <div class="info-confirmed">
                        <i class="fas fa-virus"></i>
                        ${commafy(country.totalConfirmed)}
                    </div>
                    <div class="info-recovered">
                        <i class="fas fa-thumbs-up"></i>
                        ${commafy(country.totalRecovered)}
                    </div>
                    <div class="info-death">
                        <i class="fas fa-skull"></i>
                        ${commafy(country.totalDeaths)}
                    </div>
                </div>
            </div>
        </div>`
        document.querySelector(".country-container-list").innerHTML = content
    })
}

function searchCountry(){
    found = []
    var search_items = document.querySelector("#country-code").value 
    var search_item = search_items.toUpperCase()
    if (search_item){
        statistics.forEach(function(country){
            var country_name = country.country
            var country_uppper_name = country_name.toUpperCase()
            if (search_item == country_uppper_name){
                clearLocations()
                found.push(country)
            }
        })
    }else{
        setContent(statistics)
        alert("PLEASE INPUT A ZIPCODE")
    }

    if (found){
        setContent(found)
        showMarkers(found)
        setContentListener()        
    }else{
        console.log("NOT FOUND")
    }
}

function setContentListener(){
    infoWindow.close()
    var selectedContent = document.querySelectorAll(".info")
   
    selectedContent.forEach(function(elem,index){
        elem.addEventListener("click" , function(){
            google.maps.event.trigger(markers[index] , "click")
        })
    })
}


function commafy( num ) {
    var str = num.toString().split('.');
    if (str[0].length >= 4) {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    if (str[1] && str[1].length >= 5) {
        str[1] = str[1].replace(/(\d{3})/g, '$1 ');
    }
    return str.join('.');
}

function resetbtn(){
    infoWindow.close()
    clearLocations()
    showMarkers(statistics)
    setContent(statistics)
    setContentListener()
    
}


function clearLocations(){
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;
}