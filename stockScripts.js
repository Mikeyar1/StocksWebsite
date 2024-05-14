var exchanges;
var stockArr = [];
var myChart = null;

$(document).ready(function () {
  getExchanges();
  getStocks("XNYS");

  $("#loginModal").modal("toggle");

  $("#exchangeSelect").on("change", function () {
    operatingMic = getOperatingMic($("#exchangeSelect").prop("selectedIndex") - 1);
    $("#stockSelect").html("");
    getStocks(operatingMic);
  });

  $("#stockSelect").on("change", function () {
    var selectedTicker = $(this).val();
    fetchStockDetails(selectedTicker);
    fetchHistoricalData(selectedTicker);
    fetchNews(selectedTicker);
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
          $("#stockSelect").append(`<option value=${stockArr[i].ticker}>${stockArr[i].ticker}</option>`);
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
    url: url + "&apiKey=NFCC8EjKfksl6fuMJsqSchjvyX6h4HSZ",
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
    $("#stockSelect").append(`<option value=${stockArr[i].ticker}>${stockArr[i].ticker}</option>`);
  }
}

function fetchStockDetails(ticker) {
  const url = `https://api.polygon.io/v3/reference/tickers/${ticker}?apiKey=NFCC8EjKfksl6fuMJsqSchjvyX6h4HSZ`;
  $.ajax({
    url: url,
    type: 'GET',
    success: function (data) {
      displayStockDetails(data);
    },
    error: function (error) {
      console.log("Error fetching stock details:", error);
    }
  });
}

function displayStockDetails(data) {
  if (!data || !data.results) {
    console.log("No data received for stock details.");
    $('#detailsText').html("No data available.");
    return;
  }

  // Accessing properties from data.results
  var detailsHtml = `
      <strong>Name:</strong> ${data.results.name}<br>
      <strong>Market Cap:</strong> ${formatMarketCap(data.results.market_cap)}<br>
      <strong>Sector:</strong> ${data.results.sector}<br>
      <strong>Industry:</strong> ${data.results.industry}<br>
      <strong>Description:</strong> ${data.results.description}<br>
      <strong>Total Employees:</strong> ${data.results.total_employees}<br>
      <strong>CIK:</strong> ${data.results.cik}<br>
      <strong>List Date:</strong> ${data.results.list_date}<br>
      <a href="${data.results.homepage_url}" target="_blank">Visit Homepage</a>
  `;

  $('#detailsText').html(detailsHtml);
}

function formatMarketCap(marketCap) {
  if (marketCap >= 1e9) {
    return (marketCap / 1e9).toFixed(2) + ' Billion USD';
  } else if (marketCap >= 1e6) {
    return (marketCap / 1e6).toFixed(2) + ' Million USD';
  } else {
    return marketCap.toFixed(2) + ' USD';
  }
}

function fetchHistoricalData(ticker) {
  let endDate = new Date(); // Today's date
  let startDate = new Date();
  startDate.setDate(endDate.getDate() - 7); // Roughly a week ago to ensure 5 trading days

  const formattedEndDate = endDate.toISOString().split('T')[0]; // Formats date as 'YYYY-MM-DD'
  const formattedStartDate = startDate.toISOString().split('T')[0];

  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${formattedStartDate}/${formattedEndDate}?adjusted=true&sort=asc&apiKey=NFCC8EjKfksl6fuMJsqSchjvyX6h4HSZ`;

  $.ajax({
    url: url,
    type: 'GET',
    success: function (data) {
      if (data.resultsCount >= 5) {
        var labels = data.results.map(result => new Date(result.t).toLocaleDateString());
        var prices = data.results.map(result => result.c);
        populateHistoricalTable(data.results);

        var chartData = {
          labels: labels,
          datasets: [{
            label: 'Stock Price',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            data: prices,
          }]
        };

        initializeChart(chartData);
      } else {
        console.log('Not enough trading data available');
      }
    },
    error: function (error) {
      console.log("Error fetching historical data:", error);
    }
  });
}

function populateHistoricalTable(data) {
  var tableHtml = '';
  for (var i = 0; i < data.length; i++) {
    var changePercent = i === 0 ? 'N/A' : (((data[i].c - data[i - 1].c) / data[i - 1].c) * 100).toFixed(2) + '%';
    tableHtml += `
          <tr>
              <td>${new Date(data[i].t).toLocaleDateString()}</td>
              <td>${data[i].o.toFixed(2)}</td>
              <td>${data[i].h.toFixed(2)}</td>
              <td>${data[i].l.toFixed(2)}</td>
              <td>${data[i].c.toFixed(2)}</td>
              <td>${changePercent}</td>
          </tr>
      `;
  }
  $('#historicalTable').html(tableHtml);
}

function initializeChart(chartData) {
  var ctx = document.getElementById('myChart').getContext('2d');

  // Initialized a global variable myChart to destroy the existing chart instance if it exists so that a new chart can be created
  if (myChart) {
    myChart.destroy();
  }

  // Creates a new chart instance
  myChart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
      scales: {
        y: {
          beginAtZero: false
        }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });
}


function fetchNews(ticker) {
  const url = `https://api.polygon.io/v2/reference/news?ticker=${ticker}&limit=5&apiKey=NFCC8EjKfksl6fuMJsqSchjvyX6h4HSZ`;
  $.ajax({
    url: url,
    type: 'GET',
    success: function (response) {
      displayNews(response.results);
    },
    error: function (error) {
      console.log("Error fetching news:", error);
      $('#newsList').empty().append($('<li>').text('Failed to load news.'));
    }
  });
}

function displayNews(newsItems) {
  var newsList = $('#newsList');
  newsList.empty();

  if (newsItems && newsItems.length > 0) {
    newsItems.forEach(function (newsItem) {
      var listItem = $('<li>').addClass('news-item');
      var link = $('<a>', {
        'href': newsItem.article_url,
        'text': newsItem.title,
        'target': '_blank'
      });
      listItem.append(link);
      newsList.append(listItem);
    });
  } else {
    newsList.append($('<li>').text('No news available.'));
  }
}
