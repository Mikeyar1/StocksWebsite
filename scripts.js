
$(document).ready(function () {
    $("#signUpButton").on("click", function () {
        $("#loginModal").modal("toggle");
        $("#signUpModal").modal("toggle");
    });
});

function signUp() {
    myName = $("#nameSignUp").val();
    username = $("#usernameSignUp").val();
    pw = $("passwordSignUp").val();

    myName = myName.trim();
    myName = myName.replace(/ /g, '+');

    a = $.ajax({
        url: `http://172.17.12.211/cse383_final/final.php/signUp?name=${myName}&username=${username}&password=${pw}`
    }).done(function(data) {
        $("#signUpErrorMessage").text("");
        if(data.status == 0) {
            $("#signUpModal").modal("toggle");
            $("#loginModal").modal("toggle");
            $("#loginGoodMessage").text("");
            $("#loginGoodMessage").text("Successfully signed up!");
        } else {
            $("#signUpErrorMessage").text("");
            $("#signUpErrorMessage").text(data.message);
        }
    }).fail(function(error) {
        console.log("error", error.statusText);
    });
}

function login() {
    username = $("#usernameLogin").val();
    pw = $("#passwordLogin").val();

    a = $.ajax({
        url: `http://172.17.12.211/cse383_final/final.php/login?username=${username}&password=${pw}`
    }).done(function(data) {
        $("#loginErrorMessage").text("");
        if(data.status == 0) {
            $("#loginModal").modal("toggle");
            $("#loginButton").toggle
            
        } else {
            $("#loginErrorMessage").text("");
            $("#loginErrorMessage").text(data.message);
        }
    }).fail(function(error) {
        console.log("error", error.statusText);
    })
}