
var MINOR = 4;
var MODERATE = 3;
var EXTREME = 1;

var SEVERITY_ALERT_CATEGORY = 2;
var DATE_RANGE = true;


$(function(){
  $("i.fa-close").on('click', function(e) {
   });
});

function removeAlertHeader(){
    $('#divWeatherHeader').remove();
}

function checkWeatherAlert(arrCity, depDate, retDate){

    removeAlertHeader();

    var geoCodeURL = "http://www.datasciencetoolkit.org/maps/api/geocode/json?sensor=false&address="+arrCity;
    $.ajax
    ({ 
        url: geoCodeURL,
        dataType: 'jsonp',
        type: 'get',
        success: function(cityResult)
        {
            var geoCode = getMeGeoCode(cityResult); 
            getWeatherInfo(geoCode, depDate, retDate);
        }
    });

}

function getWeatherInfo(geoCode, depDate, retDate){

    if(geoCode == ''){
        return false;
    }

    var weather_api_key = 'dc5ea0e10f11465f9ea0e10f11e65fa6';

   // geoCode = "37.4222312,-122.0857822";
    var url ="https://api.weather.com/v3/alerts/headlines?geocode="+geoCode+"&format=json&language=en-US&apiKey="+weather_api_key;
    $.ajax
    ({ 
        url: url,
        type: 'get',
        success: function(result)
        {
            showAlertDialog(result, depDate, retDate); 
        }
    });

}

function getMeGeoCode(cityResult){
    var lat = cityResult.results[0].geometry.location.lat;
    var lng = cityResult.results[0].geometry.location.lng;
    return lat+","+lng;
}


function showAlertDialog(weatherInfoJson, depDate, retDate){
    var weatherInfo = weatherInfoJson;
    if(weatherInfo === undefined){
        return false;
    }
    var effectiveTimeLocal = weatherInfo.alerts[0].effectiveTimeLocal;
    
    var effectiveTimeLocal = effectiveTimeLocal == null ? null: new Date(effectiveTimeLocal);
    var expireTimeLocal = weatherInfo.alerts[0].expireTimeLocal; 
    var depDateStr = depDate.split("-");
    var depDateObjTemp = new Date(depDate);// depDateStr[2], depDateStr[1] - 1, depDateStr[0]);
    var depDateObj = new Date(depDateObjTemp.getUTCFullYear(), depDateObjTemp.getUTCMonth(), depDateObjTemp.getUTCDate())
    if(weatherInfo.alerts[0].severityCode < SEVERITY_ALERT_CATEGORY ){
            return false;
    }
    else if(effectiveTimeLocal != null &&
        (!isDateEqual(depDateObj, effectiveTimeLocal))){
        return false;
    }else {

        var severity = weatherInfo.alerts[0].severity;
        var alert_type =  BootstrapDialog.TYPE_DEFAULT;
        

        if (severity == 'Minor'){
            alert_type = BootstrapDialog.TYPE_INFO;
        } else if (severity == 'Moderate'){
            alert_type = BootstrapDialog.TYPE_WARNING;
        } else if (severity == 'Severe'){
            alert_type = BootstrapDialog.TYPE_DANGER;
        } 
       

        var cityName = weatherInfo.alerts[0].officeName;
        var headlineText = weatherInfo.alerts[0].headlineText;
        var eventDescription =weatherInfo.alerts[0].eventDescription;
        var source = weatherInfo.alerts[0].source;
        var iconCode = '10d';
        var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
        var detailKey = weatherInfo.alerts[0].detailKey;
        var message = "<div><img src='" + iconUrl  + "'><b>"+eventDescription+"</b></div><div><p>"+headlineText+"</p></div><div style='font-size:12px;float:right'>Source:"+source+"</div>";
    }

        var userClosedWindow = false;
        var dialogInstance = BootstrapDialog.show({
            type: alert_type,
            title: ' Weather Alert For '+ cityName,
            message: message,            
            buttons: [{
                icon: 'fa fa-thumbs-o-up',
                label: 'Thank You',
                
                action: function(dialog) {
                    dialog.close();  
                    userClosedWindow = true;
                    removeAlertHeader();

                }
            }, {
                icon: 'fa fa-external-link',
                label: 'Show Me Detail',
                action: function(dialog) {
                    dialog.close();
                    userClosedWindow = true;
                    removeAlertHeader();
                    window.open("../mindyourtrip/html/weatherdetail.html?detailKey="+detailKey);
                }
            }]
        });

        if(!userClosedWindow) {
            setTimeout(function (){
                 dialogInstance.close();
                 $("#divWeatherHeader").remove();
                 var divWeatherHeader = document.createElement("div");
                 divWeatherHeader.id = "divWeatherHeader";
                 divWeatherHeader.className = "modal-body-header";
                 divWeatherHeader.style.color = "slategray";
                 divWeatherHeader.style.width = "100%";
                 divWeatherHeader.style.padding = "8px";
                 
                 var closeButton = "<button style='padding-left:10px' type='button' onclick='removeAlertHeader()' class='close' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
                 var message = "<div><img src='" + iconUrl  + "' width=2% ><b>Weather Alert For  "+cityName+" : </b>  "+  eventDescription+"<span style='font-size:12px;float:right' ><i class='fa fa-external-link'></i><a href='../mindyourtrip/html/weatherdetail.html?detailKey="+detailKey+"' target='blank'> Show Me Detail   </a>"+ closeButton+"</span></div>";
                 divWeatherHeader.innerHTML = message;
                 document.body.insertBefore(divWeatherHeader, document.body.firstChild);

            }, 4000);
        }
}

function isDateEqual(firstDate, secondDate){
    return firstDate.getDate()==secondDate.getDate() && firstDate.getMonth()==secondDate.getMonth() && firstDate.getYear()==secondDate.getYear()
}

