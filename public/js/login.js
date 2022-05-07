$('#loginBtn').click(() => {
    $.ajax({
        url: '/login',
        type: 'POST',
        data: {
            email: $("#email").val(),
            password: $("#password").val(),
        }, success: function (data) {
            console.log(data);
            if (data == "NoEmailExist") {
                document.getElementById("loginErrorMessage").innerHTML = "User with that email does not exist"
            } else if (data == "wrongPassword") {
                document.getElementById("loginErrorMessage").innerHTML = "Wrong password"
            } else {
                if (data.isAdmin == true) {
                    window.location = '/admin-dashboard'
                } else {
                    window.location = '/userprofile'
                }
            }
        }
    })
});