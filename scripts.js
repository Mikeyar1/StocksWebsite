var exchanges; 
var stocks;

$(document).ready(function() {
    getExchanges();
    getStocks("XNYS");

    $("#exchangeSelect").on('change', function() {
        operatingMic = getOperatingMic($('#exchangeSelect').prop('selectedIndex'));
        $("#exchangeSelect").html("");
        getStocks(operatingMic);
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

function getStocks(operatingMic) {
    a = $.ajax({
        url: `https://api.polygon.io/v3/reference/tickers?exchange=${operatingMic}&active=true&limit=1000&apiKey=Et0sBzqfH5pR4lpBy2wWp1_PPeo6OMK2`,
        method: "GET"
    }).done(function(data) {
        stocks = data;

        for(let i = 0; i < stocks.results.length; i++) {
            $("#stockSelect").append(`<option>${stocks.results[i].ticker}</option>`)
        }
    }).fail(function(error) {
        console.log("error", error.statusText);
    })
}

function getOperatingMic(index) {
    return exchanges.results[index].operating_mic;
}
