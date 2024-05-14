var rowCounter = 0;

$(document).ready(function () {
    $("#loginModal").modal("toggle");

    $("#historyForm").on("submit", function (event) {
        event.preventDefault();
        getHistory();
    });

    $("#endOfDayForm").on("submit", function (event) {
        event.preventDefault();
        calculateFavorites();
    });

    $("#sortSelect").on("change", function () {
        getHistory();
    });

    $("#loginModal").on("hide.bs.modal", function () {
        getFavorites();
        getFavoritesSummary();
    })

    $("#backButton").on("click", function () {
        console.log("click")
        history.back();
    })

    $('#manageTable').on('click', 'button', function () {
        var ticker = $(this).closest('tr').find('td:eq(2)').text();

        a = $.ajax({
            url: `http://172.17.12.211/cse383_final/final.php/removeFavorite?username=${username}&ticker=${ticker}`,
            method: "GET"
        }).done(function (data) {
            getFavorites();
            console.log(data.data.stock);
            logFavoritesAction(data.data[0].stock, ticker, "removed");
        }).fail(function (error) {
            console.log("error", error.statusText);
        });
    });
});

function getHistory() {
    date1 = $("#dateStart").val();
    date2 = $("#dateEnd").val();
    sort = $("#sortSelect").val();
    a = $.ajax({
        url: `http://172.17.12.211/cse383_final/final.php/getHistory?username=${username}&date1=${date1}&date2=${date2}&sort=${sort}`,
        method: "GET"
    }).done(function (data) {
        $("#historyTable").html("");
        for (let i = 0; i < data.data.length; i++) {
            $("#historyTable").append(`
                <tr>
                <td>${data.data[i].date}</td>
                <td>${data.data[i].stock}</td>
                <td>${data.data[i].ticker}</td>
                <td>${data.data[i].action}</td>
                </tr>`)
        }

    }).fail(function (error) {
        console.log("error", error.statusText);
    })
}

function getFavorites() {
    username = $("#usernameLogin").val();

    a = $.ajax({
        url: `http://172.17.12.211/cse383_final/final.php/getFavorites?username=${username}`,
        method: "GET"
    }).done(function (data) {
        $("#manageTable").html("");
        for (let i = 0; i < data.data.length; i++) {
            $("#manageTable").append(`
                <tr>
                <td>${data.data[i].date}</td>
                <td>${data.data[i].stock}</td>
                <td>${data.data[i].ticker}</td>
                <td><button type="button" class="btn btn-danger">Remove</button></td>
                </tr>`)
        }
    }).fail(function (error) {
        console.log("error", error.statusText);
    })
}

function getStockTradingData(ticker, name) {
    date = getDate();
    $.ajax({
        url: `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${date}/${date}?adjusted=true&sort=asc&apiKey=Et0sBzqfH5pR4lpBy2wWp1_PPeo6OMK2`,
        method: "GET"
    }).done(function (data) {
        $("#favoritesTable").append(`<tr></tr>`);
        $("#favoritesTable").append(`<td>${ticker}</td>`);
        $("#favoritesTable").append(`<td>${name}</td>`);
        $("#favoritesTable").append(`<td>${data.results[0].o}</td>`);
        $("#favoritesTable").append(`<td>${data.results[0].h}</td>`);
        $("#favoritesTable").append(`<td>${data.results[0].l}</td>`);
        $("#favoritesTable").append(`<td>${data.results[0].c}</td>`);

        percent = ((data.results[0].o - data.results[0].c) / (data.results[0].c) * 100).toFixed(2);
        if (percent > 0) {
            $("#favoritesTable").append(`<td class="positive">↑${percent}</td>`);
        } else {
            $("#favoritesTable").append(`<td class="negative">↓${percent}</td>`);
        }

        $("#favoritesTable").append(`<td>${data.results[0].v}</td>`);

    }).fail(function (error) {
        console.log("Error fetching trading data:", error.statusText);
    });
}
function drawChart(stockData) {
    var ctx = $('#stockChart').get(0).getContext('2d');

    var chartLabels = stockData.map(function (entry) {
        return new Date(entry.t).toLocaleDateString();
    });
    var chartData = stockData.map(function (entry) {
        return entry.c;
    });

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartLabels,
            datasets: [{
                label: 'Closing Price',
                data: chartData,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

function getDate() {
    date = new Date();
    year = date.getFullYear();
    month = date.getMonth();
    day = date.getDay();

    if (month < 10) {
        month = "0" + month
    }

    if (day < 10) {
        day = "0" + day
    }

    return `${year}-${month}-${day}`
}

function getFavoritesSummary() {
    a = $.ajax({
        url: `http://172.17.12.211/cse383_final/final.php/getFavorites?username=${username}`,
        method: "GET"
    }).done(function (data) {
        for (let i = 0; i < data.data.length; i++) {
            getStockTradingData(data.data[i].ticker, data.data[i].stock);
        }
    }).fail(function (error) {
        console.log("error", error.statusText);
    })
}

function calculateFavorites() {
    date = $("#endOfDay").val();
    history;
    a = $.ajax({
        url: `http://172.17.12.211/cse383_final/final.php/getHistory?username=${username}&date1=1753-01-01&date2=${date} 23:59:59&sort=asc`,
        method: "GET"
    }).done(function (data) {
        myHistory = new Set();
        indexes = [];
        for (let i = 0; i < data.data.length; i++) {
            if (myHistory.has(data.data[i].ticker)) {
                myHistory.delete(data.data[i].ticker);
                indexes.splice(i, 1);
            } else {
                myHistory.add(data.data[i].ticker);
                indexes.push(i);
            }
        }

        const interator = myHistory.entries();
        $("#endOfDayTable").html("");
        for (let i = 0; i < myHistory.size; i++) {
            $("#endOfDayTable").append(`
                <tr>
                <td>${data.data[indexes[i]].date}</td>
                <td>${data.data[indexes[i]].stock}</td>
                <td>${data.data[indexes[i]].ticker}</td>
                </tr>`)
        }

    }).fail(function (error) {
        console.log("error", error.statusText);
    })
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
