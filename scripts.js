
$(document).ready(function() {
    getExchanges();

    $("#exchangeSelect").on('change', function() {
        getStocks(this.value);
    });
});

// function getExchanges() {
//     a = $.ajax({
//         url: "https:api.polygon.io/v1/meta/exchanges/",
//         method: "GET",
//         dataType: 'jsonp',
//         data: {
//           apiKey: "Et0sBzqfH5pR4lpBy2wWp1_PPeo6OMK2"
//         }
//     }).done(function(data) {
//         for(let i = 0; i < data.length; i++) {
//             $("#exchangeSelect").append(`<option>${data[i].name}</option>`)
//         }
//     }).fail(function(error) {
//         console.log("error", error.statusText);
//     })
// }

function getExchanges() {
    a = $.ajax({
        url: "https://api.polygon.io/v3/reference/exchanges?asset_class=stocks&apiKey=Et0sBzqfH5pR4lpBy2wWp1_PPeo6OMK2",
        method: "GET"
    }).done(function(data) {
        for(let i = 0; i < data.results.length; i++) {
            $("#exchangeSelect").append(`<option>${data.results[i].name}</option>`)
            console.log(data.results[i].name);
        }
    }).fail(function(error) {   
        console.log("error", error.statusText);
    })
}

function getStocks(stockName) {
    a = $.ajax({
        //url: url
        // method: "GET"
    }).done(function(data) {
        // fill stockSelect
    }).fail(function(error) {
        console.log("error", error.statusText);
    })
}
