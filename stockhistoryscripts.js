
$(document).ready(function() {
    $("#loginModal").modal("toggle");

    $("#historyForm").on("submit", function(event) {
        event.preventDefault();
        getHistory();
    });

    $("#sortSelect").on("change", function() {
        getHistory();
    });

    $("#loginModal").on("hide.bs.modal", function() {
        getFavorites();
    })
});

function getHistory() {
    date1 = $("#dateStart").val();
    date2 = $("#dateEnd").val();
    sort = $("#sortSelect").val();
    a = $.ajax({
        url: `http://172.17.12.211/cse383_final/final.php/getHistory?username=oscar&date1=${date1}&date2=${date2}&sort=${sort}`,
        method: "GET"
    }).done(function(data) {
        if(data.data.length > 0) {
            $("#historyTable").html("");
            for(let i = 0; i < data.data.length; i++) {
                $("#historyTable").append(`
                <tr>
                <td>${data.data[i].date}</td>
                <td>${data.data[i].stock}</td>
                <td>${data.data[i].ticker}</td>
                <td>${data.data[i].action}</td>
                </tr>`)
            }
        } else {
            //no history found
        }
    }).fail(function(error) {
        console.log("error", error.statusText);
    })
}

function getFavorites() {
    username = $("#usernameLogin").val();
    
    a = $.ajax({
        url: `http://172.17.12.211/cse383_final/final.php/getFavorites?username=${username}`,
        method: "GET"
    }).done(function(data) {
        if(data.data.length > 0) {
            $("#favoritesTable").html("");
            for(let i = 0; i < data.data.length; i++) {
                $("#favoritesTable").append(`
                <tr>
                <td>${data.data[i].date}</td>
                <td>${data.data[i].stock}</td>
                <td>${data.data[i].ticker}</td>
                </tr>`)
            }
        } else {
            // no history found
        }
    }).fail(function(error){
        console.log("error", error.statusText);
    })
}