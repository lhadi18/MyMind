$('#signupBtn').click(() => {
    $.ajax({
        url: '/sign-up',
        type: 'POST',
        data: {
            firstname: $("#firstname").val(),
            lastname: $("#lastname").val(),
            username: $("#username").val(),
            phone: $("#phone").val(),
            email: $("#email").val(),
            userType: $("#userType").val(),
            password: $("#password").val(),
        }, success: function (data) {
            console.log(data);
            if (data == "existingEmail") {
                document.getElementById("signUpErrorMessage").innerHTML = "A user with that email already exists";
            } else if (data == "existingPhone") {
                document.getElementById("signUpErrorMessage").innerHTML = "A user with that phone number already exists";
            } else if (data == "existingUsername") {
                document.getElementById("signUpErrorMessage").innerHTML = "A user with that username already exists";
            } else if (data == "login") {
                window.location = '/login'
            }
        }
    })
});