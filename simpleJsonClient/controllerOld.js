$(document).ready(function () {
    $("#searchResult").hide();
    $("#btn_Search").click(function () {
        loaddata($("#seachfield").val());
    });
});

var anyRequestSuccessful = false;

function loaddata(searchterm) {
    console.log("Loading data for:", searchterm);

    anyRequestSuccessful = false;

    $.ajax({
        type: "GET",
        url: "../serviceHandler.php",
        data: { method: "queryPersonById", param: searchterm },
        dataType: "json",
        success: function (response) {
            anyRequestSuccessful = true;
            handleResponse(response);
        },
        error: handleError
    });

    $.ajax({
        type: "GET",
        url: "../serviceHandler.php",
        data: { method: "queryPersonByName", param: searchterm},
        dataType: "json",
        success: function (response) {
            anyRequestSuccessful = true;
            console.log("Success:", response);
            handleResponse(response);
        },
    });

    $.ajax({
        type: "GET",
        url: "../serviceHandler.php",
        data: { method: "queryPersonByEmail", param: searchterm },
        dataType: "json",
        success: function (response) {
            anyRequestSuccessful = true;
            handleResponse(response);
        },
    });

    $.ajax({
        type: "GET",
        url: "../serviceHandler.php",
        data: { method: "queryPersonByDepartment", param: searchterm },
        dataType: "json",
        success: function (response) {
            anyRequestSuccessful = true;
            handleResponse(response);
        },
  
    });

    $.ajax({
        type: "GET",
        url: "../serviceHandler.php",
        data: { method: "queryPersonByPosition", param: searchterm },
        dataType: "json",
        success: function (response) {
            anyRequestSuccessful = true;
            handleResponse(response);
        },
     
    });

    $.ajax({
        type: "GET",
        url: "../serviceHandler.php",
        data: { method: "queryPersonByAddress", param: searchterm },
        dataType: "json",
        success: function (response) {
            anyRequestSuccessful = true;
            handleResponse(response);
        },
      
    });

    var handleError = function() {
        console.error("Error: Error loading data");
        $("#personEntries").html("<p>Error loading data.</p>");
        $("#searchResult").show(1000).delay(1000).hide(1000);
        $("#noOfentries").val(0);
    };

    $(document).one("ajaxStop", function() {
        if (!anyRequestSuccessful) { // Check if error not already displayed
            handleError();
        }
    });
}

function handleResponse(response) {
    $("#searchResult").show();
    
    $("#noOfentries").val(response.length);

    $("#personEntries").empty();

    if (response.length > 0) {
        response.forEach(function (person) {

            var displayText = "<p><strong>Firstname:</strong> " 
            + person.firstname + "<br><strong>Email:</strong> " + person.email + "</p>";

            $("#personEntries").append(displayText);
        });
    } else {
        $("#personEntries").html("<p>No entries found.</p>");
    }

    $("#searchResult").show(1000).delay(1000).hide(1000);
}   


