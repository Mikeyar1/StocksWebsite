
$(document).ready(function() {
    getExchanges();
});

function getExchanges() {
    a = $.ajax({
        url: "https:api.polygon.io/v1/meta/exchanges/",
        method: "GET",
        dataType: 'jsonp',
        data: {
          apiKey: "Et0sBzqfH5pR4lpBy2wWp1_PPeo6OMK2"
        }
    }).done(function(data) {
        for(let i = 0; i < data.length; i++) {
            $("#stockSelect").append(`<option>${data[i].name}</option>`)
        }
    }).fail(function(error) {
        console.log("error", error.statusText);
    })
}