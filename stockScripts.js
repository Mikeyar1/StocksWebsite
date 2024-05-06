var exchanges;
var stockArr = [];

$(document).ready(function () {
  //getExchanges();
  $("#loginModal").modal("toggle");

  $("#exchangeSelect").on("change", function () {
    operatingMic = getOperatingMic($("#exchangeSelect").prop("selectedIndex") - 1);
    $("#stockSelect").html("");
    getStocks(operatingMic);
  });
});

function getExchanges() {
  a = $.ajax({
    url: "https://api.polygon.io/v3/reference/exchanges?asset_class=stocks&apiKey=Et0sBzqfH5pR4lpBy2wWp1_PPeo6OMK2",
    method: "GET",
  })
    .done(function (data) {
      exchanges = data;

      for (let i = 0; i < exchanges.results.length; i++) {
        $("#exchangeSelect").append(
          `<option>${exchanges.results[i].name}</option>`
        );
      }
    })
    .fail(function (error) {
      console.log("error", error.statusText);
    });
}

function getStocks(operatingMic) {
  a = $.ajax({
    url: `https://api.polygon.io/v3/reference/tickers?exchange=${operatingMic}&active=true&limit=1000&apiKey=Et0sBzqfH5pR4lpBy2wWp1_PPeo6OMK2`,
    method: "GET",
  })
    .done(function (data) {
      stockArr.push(...data.results);

      if (data.next_url) {
        getNextStockPage(data.next_url);
      } else {
        for (let i = 0; i < stockArr.length; i++) {
          $("#stockSelect").append(`<option>${stockArr[i].ticker}</option>`);
        }
      }
    })
    .fail(function (error) {
      console.log("error", error.statusText);
      populateStocks();
    });
}

function getNextStockPage(url) {
  a = $.ajax({
    url: url + "&apiKey=Et0sBzqfH5pR4lpBy2wWp1_PPeo6OMK2",
    method: "GET",
  })
    .done(function (data) {
      stockArr.push(...data.results);

      if (data.next_url) {
        getNextStockPage(data.next_url);
      } else {
        populateStocks();
      }
    })
    .fail(function (error) {
      console.log("error", error.statusText);
      populateStocks();
    });
}

function getOperatingMic(index) {
  return exchanges.results[index].operating_mic;
}

function populateStocks() {
  for (let i = 0; i < stockArr.length; i++) {
    $("#stockSelect").append(`<option>${stockArr[i].ticker}</option>`);
  }
}
