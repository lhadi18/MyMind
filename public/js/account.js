var profileImgBtn = document.getElementById('profileImage');
var profileFile = document.getElementById('profileFile');

profileImgBtn.addEventListener('click', function () {
    profileFile.click();
});

profileFile.addEventListener('change', function () {
    const choosedFile = this.files[0];

    if (choosedFile) {
        const reader = new FileReader();
        reader.addEventListener('load', function () {
            profileImgBtn.setAttribute('src', reader.result);
        });

        reader.readAsDataURL(choosedFile);
    }
});

$.ajax({
    url: '/getUserInfo',
    type: "GET",
    success: function (data) {
        $("#displayFullname").text(`${data.firstName}  ${data.lastName}`)
        $("#displayUsername").text(`@${data.username}`)
        $("#joinedDate").text(`${new Date(data.createdAt).toDateString()}`)
        $("#joinedDateMob").text(`Joined: ${new Date(data.createdAt).toDateString()}`)
        $("#firstname").attr("value", `${data.firstName}`)
        $("#lastname").attr("value", `${data.lastName}`)
        $("#username").attr("value", `${data.username}`)
        $("#email").attr("value", `${data.email}`)
        $("#emailmobile").text(`${data.email}`)
        if (!data.phoneNum) {
            $("#phone").attr("value",)
            $("#phonemobile").text()
        } else {
            let phonenumber = data.phoneNum;
            $("#phone").attr("value", phonenumber)
            $("#phonemobile").text(phonenumber)
        }
    }
});

//admin dashboard backpage to userprofile fix
setTimeout(() => {
    $.ajax({
        url: '/getProfilePicture',
        type: 'GET',
        success: function (data) {
            console.log(data);
            $("#profileImage").attr('src', data.profileImg)
            $("#profileImageMob").attr('src', data.profileImg)
        }
    })
}, 50);

$('#saveChanges').click(() => {
    var emp = document.getElementById("password").value;
    var phoneLength = $("#phone").val();
    if (phoneLength.length != 10) {
        document.getElementById("phoneErrorMessage").innerHTML = "Your phone number must be of length 10";
    } else if (!isEmail($("#email").val())) {
        document.getElementById("emailErrorMessage").innerHTML = "Please follow this email pattern: example@gmail.com";
    } else if(inputValidation()) {
        document.getElementById("validationErrorMessage").innerHTML = "There are empty fields.";
    } else {
        $.ajax({
            url: '/editProfile',
            type: 'POST',
            data: {
                firstname: $("#firstname").val().charAt(0).toUpperCase() + $("#firstname").val().substring(1),
                lastname: $("#lastname").val().charAt(0).toUpperCase() + $("#lastname").val().substring(1),
                email: $("#email").val(),
                username: $("#username").val().toLowerCase(),
                phone: $("#phone").val(),
                password: $("#password").val(),
            }, success: function (data) {
                console.log(data);
                if (data == "existingEmail") {
                    document.getElementById("emailErrorMessage").innerHTML = "A user with that email already exists";
                } else if (data == "existingPhone") {
                    document.getElementById("phoneErrorMessage").innerHTML = "A user with that phone number already exists";
                    document.getElementById("emailErrorMessage").innerHTML = "";
                } else if (data == "existingUsername") {
                    document.getElementById("usernameErrorMessage").innerHTML = "A user with that username already exists";
                    document.getElementById("emailErrorMessage").innerHTML = "";
                    document.getElementById("phoneErrorMessage").innerHTML = "";
                } else if (data == "updated") {
                    if (emp == "") {
                        setTimeout(() => {
                            window.location = '/userprofile'
                        }, 50);
                    } else {
                        $.post("/logout");
                        window.location = '/login'
                    }
                } else if (data == "logout") {
                    window.location = '/login'
                }
            }
        })
    }
});

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function inputValidation() {
    const inpObjFirstName = document.getElementById("firstname");
    const inpObjLastName = document.getElementById("lastname");
    const inpObjUsername = document.getElementById("username");
    if (!inpObjFirstName.checkValidity() || !inpObjLastName.checkValidity() || !inpObjUsername.checkValidity()) {
        return true;
    }
}
