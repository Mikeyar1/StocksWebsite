
var username = "";
$(document).ready(function () {
    $("#signUpButton").on("click", function () {
        $("#loginModal").modal("toggle");
        $("#signUpModal").modal("toggle");
    });

    $("#loginForm").on("submit", function(event) {
        event.preventDefault();
        login();
    })

    $("#signUpForm").on("submit", function(event) {
        event.preventDefault();
        signUp();
    })

    $("#favoriteButton").on("click", function() {
        addToFavorite();
    })

    $("#stockSelect").on("change", function() {
        $("#favoritesMessage").text("");
    })
});

function signUp() {
    myName = $("#nameSignUp").val();
    username = $("#usernameSignUp").val();
    pw = $("#passwordSignUp").val();

    myName = myName.trim();
    myName = myName.replace(/ /g, '+');

    a = $.ajax({
        url: `http://172.17.12.211/cse383_final/final.php/signUp?name=${myName}&username=${username}&password=${pw}`,
        method: "GET"
    }).done(function (data) {
        $("#signUpErrorMessage").text("");
        if (data.status == 0) {
            $("#signUpModal").modal("toggle");
            $("#loginModal").modal("toggle");
            $("#loginGoodMessage").text("");
            $("#loginGoodMessage").text("Successfully signed up!");
        } else {
            $("#signUpErrorMessage").text("");
            $("#signUpErrorMessage").text(data.message);
        }
    }).fail(function (error) {
        console.log("error", error.statusText);
    });
}

function login() {
    myUsername = $("#usernameLogin").val();
    pw = $("#passwordLogin").val();

    a = $.ajax({
        url: `http://172.17.12.211/cse383_final/final.php/login?username=${myUsername}&password=${pw}`,
        method: "GET"
    }).done(function (data) {
        $("#loginErrorMessage").text("");
        if (data.status == 0) {
            $("#loginModal").modal("toggle");
            $("#nameText").text(myUsername);
            username = myUsername;
        } else {
            $("#loginErrorMessage").text("");
            $("#loginErrorMessage").text(data.message);
        }
    }).fail(function (error) {
        console.log("error", error.statusText);
    })
}

function addToFavorite() {
    if(!(username.length > 0)) {
        $("#favoritesMessage").css("color", "red");
        $("#favoritesMessage").text("Must be logged in to add a favorite!");
        return;
    }

    ticker = $("#stockSelect").val();
    stock = ""
    for(let i = 0; i < stockArr.length; i++) {
        if(stockArr[i].ticker == ticker) {
            stock = stockArr[i].name;
        }
    }
    
    a = $.ajax({
        url: `http://172.17.12.211/cse383_final/final.php/addFavorite?username=${username}&stock=${stock}&ticker=${ticker}`, 
        method: "GET"
    }).done(function(data) {
        if(data.status == 0) {
            $("#favoritesMessage").css("color", "green");
            $("#favoritesMessage").text(`Added ${stock} to favorites!`);
            logFavoritesAction(stock, ticker, "added");
        } else {
            $("#favoritesMessage").css("color", "red");
            $("#favoritesMessage").text(`${stock} is already a favorite!`);
        }
    }).fail(function(error) {
        console.log("error", error.statusText);
    }) 
}

function logFavoritesAction(stock, ticker, action) {
    a = $.ajax({
        url: `http://172.17.12.211/cse383_final/final.php/logAction?username=${username}&stock=${stock}&ticker=${ticker}&action=${action}`, 
        method: "GET"
    }).done(function(data) {
        console.log(`recorded ${username} ${action} ${stock}`);
    }).fail(function(error) {
        console.log("error", error.statusText);
    })
}