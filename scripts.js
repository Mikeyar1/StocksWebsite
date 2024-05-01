var exchanges; 

$(document).ready(function() {
    getExchanges();

    $("#exchangeSelect").on('change', function() {
        alert($("#exchangeSelect").prop('selectedIndex'));
        //getStocks()
    });
});

function getExchanges() {
    a = $.ajax({
        url: "https://api.polygon.io/v3/reference/exchanges?asset_class=stocks&apiKey=Et0sBzqfH5pR4lpBy2wWp1_PPeo6OMK2",
        method: "GET"
    }).done(function(data) {
        exchanges = data;
        for(let i = 0; i < exchanges.results.length; i++) {
            $("#exchangeSelect").append(`<option>${exchanges.results[i].name}</option>`)
        }
    }).fail(function(error) {   
        console.log("error", error.statusText);
    })
}

function getStocks(index) {
    a = $.ajax({
        url: "https://api.polygon.io/v3/reference/tickers?exchange=XNYS&active=true&apiKey=Et0sBzqfH5pR4lpBy2wWp1_PPeo6OMK2",
        method: "GET"
    }).done(function(data) {
        // fill stockSelect
    }).fail(function(error) {
        console.log("error", error.statusText);
    })
}
