
$(document).ready(function() {

  getTime();
  setInterval(getTime, 1000);

  //temperature converters
  //kel = cel + 273.15
  function kelvToCel(val) {
    return (val - 273).toFixed() + "&degC";
  }

  //far = (9/5)*(k-273) + 32
  function kelvToFar(val) {
    return ((val - 273) * (9 / 5) + 32).toFixed() + "&degF";
  }

  //clock
  function getTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = fixTime(m);
    s = fixTime(s);
    $("#clock").html(h + ":" + m + ":" + s);
  }

  function fixTime(x) {
    if (x < 10) {
      x = "0" + x;
    }
    return x;
  }

  // http://openweathermap.org/img/w/ (old weather icons)
  // "<img src='http://openweathermap.org/img/w/" + getIcon(data.weather[0].id) (format)
  //<i class="wi wi-day-sunny"></i> (new format)
  //https://erikflowers.github.io/weather-icons/ (new weather icons)

  function getIcon(id) {
    var today = new Date();
    var h = today.getHours();
    if (id.toString()[0] === '2') {
      //return '11d.png';
      return '<i class="wi wi-thunderstorm"></i>';
    }
    if (id.toString()[0] === '3') {
      //return '09d.png';
      return '<i class="wi wi-sprinkle"></i>';
    }
    if (id === 500 || id === 501 || id === 502 || id === 503 || id === 504) {
      if (h > 6 && h < 18) {
        //return '10d.png';
        return '<i class="wi wi-day-rain"></i>';
      } else {
        //return '10n.png';
        return '<i class="wi wi-night-alt-rain"></i>';
      }
    }
    if (id === 511) {
      //return '13d.png';
      return '<i class="wi wi-rain-mix"></i>';
    }
    if (id === 520 || id === 521 || id === 522 || id === 531) {
      //return '09d.png';
      return '<i class="wi wi-rain"></i>';
    }
    if (id.toString()[0] === '6') {
      //return '13d.png';
      return '<i class="wi wi-snow"></i>';
    }
    if (id.toString()[0] === '7') {
      //return '50d.png';
      return '<i class="wi wi-windy"></i>';
    }
    if (id === 800) {
      if (h > 6 && h < 18) {
        //return '01d.png';
        return '<i class="wi wi-day-sunny"></i>';
      } else {
        //return '01n.png';
        return '<i class="wi wi-night-clear"></i>';
      }
    }
    if (id === 801) {
      if (h > 6 && h < 18) {
        //return '02d.png';
        return '<i class="wi wi-day-cloudy"></i>';
      } else {
        //return '02n.png';
        return '<i class="wi wi-night-alt-cloudy"></i>';
      }
    }
    if (id === 802) {
      //return '03d.png';
      return '<i class="wi wi-cloudy"></i>';
    }
    if (id === 803 || id === 804) {
      //return '04d.png';
      return '<i class="wi wi-cloudy"></i>';
    }

  } //getIcon

  //geo button click
  $("#geoButton").click(function() {
    $("#geoButton").prop('disabled', true);

    $("#yourCoords").html("searching...");
    //coords
    //geolocation blocked by chrome - geolocation stuff commented out
    /* //
    if (!navigator.geolocation) {
      $("#yourCoords").html("navigator is currently unavailable");
    } else {
      navigator.geolocation.getCurrentPosition(function(position) {
        $("#yourCoords").html("latitude: " + position.coords.latitude + "<br>longitude: " + position.coords.longitude);
        $("#yourWeather").html("now determining weather...");
        */ //
        //weather
    
    //ipinfo.io
    $.getJSON('http://ipinfo.io', function(data){
      //console.log(data);
      $("#yourCoords").html("latitude: " + data.loc.split(',')[0] + "<br>longitude: " + data.loc.split(',')[1]);
      
 var apiCall = "//api.openweathermap.org/data/2.5/weather?lat=" + data.loc.split(',')[0] + "&lon=" + data.loc.split(',')[1] + "&appid=9f6d791a56bbac55b7233f72ac973689";

        $.getJSON(apiCall, function(data) {
          //console.log(data);
          var tempCel = kelvToCel(data.main.temp);
          var tempFar = kelvToFar(data.main.temp);
          $("#yourWeather").html("you seem to be in or near: " + data.name + " (in " + data.sys.country + ")<br>current weather status: " + data.weather[0].main.toLowerCase() + "<br>current weather description: " + data.weather[0].description + "\t" + getIcon(data.weather[0].id) + "<br>current temperature: <span>" + tempCel + "</span><span style='display:none;'>" + tempFar + "</span> \t <button class='btn' id='tempBtn' type='button'>&degC/&degF</button>");

          //celsius/farenheit toggle
          $("#tempBtn").click(function() {
            $("span").toggle();
          });
        }); //getJSON

      //}); //getPos
    //} //else
    });//ipinfo
  }); //geo button click
  
  //city button key
  $('#searchBox').keypress(function(e){
    var key = e.which;
    if(key === 13){
      $('#cityButton').click();
    }
  });
  
  //city button click
  $('#cityButton').click(function(){
    
    $('#yourCoords:visible').slideUp();

    //api.openweathermap.org/data/2.5/weather?q={city name}
    var city = document.getElementById('searchBox').value;
        //weather
    var apiCall = "//api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=9f6d791a56bbac55b7233f72ac973689";
    $.getJSON(apiCall, function(data) {
          var tempCel = kelvToCel(data.main.temp);
          var tempFar = kelvToFar(data.main.temp);
          $("#yourWeather").html("city: " + data.name + " (in " + data.sys.country + ")<br>current weather status: " + data.weather[0].main.toLowerCase() + "<br>current weather description: " + data.weather[0].description + "\t " + getIcon(data.weather[0].id) + "<br>current temperature: <span>" + tempCel + "</span><span style='display:none;'>" + tempFar + "</span> \t <button class='btn' id='tempBtn' type='button'>&degC/&degF</button>");

          //celsius/farenheit toggle
          $("#tempBtn").click(function() {
            $("span").toggle();
          });
        }); //getJSON
    
  }); //city button click
  
  //about slider
  $('#aboutSlider').click(function(){
    $('#aboutFrame').slideToggle('slow');
  });

});