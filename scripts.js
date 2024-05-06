
$(document).ready(function () {
    $("#signUpButton").on("click", function () {
        $("#loginModal").modal("toggle");
        $("#signUpModal").modal("toggle");
    });

    $("#signUpButton").on("submit", function() {
        alert("submit");
    });
});

function signUp() {
    myName = $("#nameSignUp").val();
    username = $("#usernameSignUp").val();
    pw = $("passwordSignUp").val();

    a = $.ajax({
        url: `http://172.17.12.211/cse383_final/final.php/signUp?name=${myName}&username=${username}&password=${pw}`
    }).done(function(data) {

    }).fail(function(data) {

    });
}