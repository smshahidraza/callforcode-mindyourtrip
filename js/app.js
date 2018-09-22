jQuery(document).ready(function () {
    var myData;

    $.each(cityInfo, function (index, value) {
        $("#depcity").find("option:first").text(" Select Departing City ");
        $("#depcity").append('<option rel="' + index + '" value="'+value.city+'">'+value.city+'</option>');

        $("#arrcity").find("option:first").text(" Select Arriving City ");
        $("#arrcity").append('<option rel="' + index + '" value="'+value.city+'">'+value.city+'</option>');

    });

    $("#depcity option[value='San Francisco']").prop('selected', true);
    $("#arrcity option[value='Wilmington']").prop('selected', true);

    var now = new Date();
    var end_date = new Date(now);
    end_date.setDate(now.getDate() + 10);  

    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);

    var today = now.getFullYear()+"-"+(month)+"-"+(day) ;

    var dayEnd = ("0" + end_date.getDate()).slice(-2);
    var monthEnd = ("0" + (end_date.getMonth() + 1)).slice(-2);

    var retDate = end_date.getFullYear()+"-"+(monthEnd)+"-"+(dayEnd) ;


    $('#depdate').val(today);

    $('#retdate').val(retDate);

$('#search').click(function() 
{

    $("#flightResult").html("<p>Loading Flight Result...</p>");

    var cityName = $('#arrcity').val();
    // var cityLatLang = $('#depcity').val();

    var depdate = $('#depdate').val();
    var retdate = $('#retdate').val();
    
    $("#flightResult").show();

    // $(".flightResult").delay(2000).fadeIn(500);



    setTimeout(function(){
        $("#flightResult").html("<p>Flight Not Found<p><p> If you really want to book a flight, please visit any airline website.</p><p>Thank You</p>");
    }, 1000);

    checkWeatherAlert(cityName, depdate, retdate);

});

});

