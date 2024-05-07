
$(document).ready(function() {
    $("#loginModal").modal("toggle");

    $("#historyForm").on("submit", function(event) {
        event.preventDefault();
        alert("pressed");
        getHistory();
    })
});

function getHistory() {
    a = $.ajax({
        url: `http://172.17.12.211/cse383_final/final.php/getHistory?username=oscar&date1=2024-05-06&date2=2024-05-07`,
        method: "GET"
    }).done(function(data) {
        console.log("got ", data);
        for(let i = 0; i < data.data.length; i++) {
            $("#historyTable").append(`<td>${data.data[i].date}</td><td>${data.data[i].stock}</td><td>${data.data[i].action}</td>`)
        }
    }).fail(function(error) {
        console.log("error", error.statusText);
    })
}