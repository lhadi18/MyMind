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
        $("#yearsExperience").attr("value", `${data.yearsExperience}`)
        $("#sessionCost").attr("value", `${data.sessionCost}`)
        if (!data.phoneNum) {
            $("#phone").attr("value",)
            $("#phonemobile").text()
        } else {
            let phonenumber = data.phoneNum;
            $("#phone").attr("value", phonenumber)
            $("#phonemobile").text(phonenumber)
        }
        if(data.userType == "therapist") {
            var displayTherapist = document.querySelectorAll(".therapistOptions");
            for(var i = 0; i < displayTherapist.length; i++) {
                displayTherapist[i].style.display = "flex";
            }            
        }
    }
});

//admin dashboard backpage to userprofile fix
setTimeout(() => {
    $.ajax({
        url: '/getProfilePicture',
        type: 'GET',
        success: function (data) {
            $("#profileImage").attr('src', data.profileImg)
            $("#profileImageMob").attr('src', data.profileImg)
        }
    })
}, 50);

$('#saveChanges').click(() => {
    var emp = document.getElementById("password").value;
    var phoneLength = $("#phone").val();
    if (phoneLength.length != 10) {
        document.getElementById("phoneErrorMessage").style.display = 'block';
        document.getElementById("emailErrorMessage").style.display = 'none';
        document.getElementById("usernameErrorMessage").style.display = 'none';
        document.getElementById("validationErrorMessage").style.display = 'none';
        document.getElementById("phoneErrorMessage").innerHTML = "Your phone number must be of length 10";
    } else if (!isEmail($("#email").val())) {
        document.getElementById("phoneErrorMessage").style.display = 'none';
        document.getElementById("emailErrorMessage").style.display = 'block';
        document.getElementById("usernameErrorMessage").style.display = 'none';
        document.getElementById("validationErrorMessage").style.display = 'none';
        document.getElementById("emailErrorMessage").innerHTML = "Please follow this email pattern: example@email.com";
    } else if (inputValidation()) {
        window.scrollTo(0, document.body.scrollHeight);
        document.getElementById("phoneErrorMessage").style.display = 'none';
        document.getElementById("emailErrorMessage").style.display = 'none';
        document.getElementById("usernameErrorMessage").style.display = 'none';
        document.getElementById("validationErrorMessage").style.display = 'block';
        window.scrollTo(0, document.body.scrollHeight);
        document.getElementById("validationErrorMessage").innerHTML = "There are empty fields";
    } else if (negativeValidation()) {
        window.scrollTo(0, document.body.scrollHeight);
        document.getElementById("phoneErrorMessage").style.display = 'none';
        document.getElementById("emailErrorMessage").style.display = 'none';
        document.getElementById("usernameErrorMessage").style.display = 'none';
        document.getElementById("validationErrorMessage").style.display = 'block';
        document.getElementById("validationErrorMessage").innerHTML = "Experience or cost of session cannot be less than 0";
    } else {
        if ($("#password").val() != "" && passwordValidation()) {
            window.scrollTo(0, document.body.scrollHeight);
            document.getElementById("phoneErrorMessage").style.display = 'none';
            document.getElementById("emailErrorMessage").style.display = 'none';
            document.getElementById("usernameErrorMessage").style.display = 'none';
            document.getElementById("validationErrorMessage").style.display = 'block';
            document.getElementById("validationErrorMessage").innerHTML = "Password must be at least 5 or less than 20 characters long";
        } else {
            $.ajax({
                url: '/editProfile',
                type: 'POST',
                data: {
                    firstname: $("#firstname").val().charAt(0).toUpperCase() + $("#firstname").val().substring(1),
                    lastname: $("#lastname").val().charAt(0).toUpperCase() + $("#lastname").val().substring(1),
                    email: $("#email").val().toLowerCase(),
                    username: $("#username").val().toLowerCase(),
                    phone: $("#phone").val(),
                    password: $("#password").val(),
                    yearsExperience: $("#yearsExperience").val(),
                    sessionCost: $("#sessionCost").val(),
                }, success: function (data) {
                    console.log(data);
                    if (data == "existingEmail") {
                        document.getElementById("phoneErrorMessage").style.display = 'none';
                        document.getElementById("emailErrorMessage").style.display = 'block';
                        document.getElementById("usernameErrorMessage").style.display = 'none';
                        document.getElementById("validationErrorMessage").style.display = 'none';
                        document.getElementById("emailErrorMessage").innerHTML = "A user with that email already exists";
                    } else if (data == "existingPhone") {
                        document.getElementById("phoneErrorMessage").style.display = 'block';
                        document.getElementById("emailErrorMessage").style.display = 'none';
                        document.getElementById("usernameErrorMessage").style.display = 'none';
                        document.getElementById("validationErrorMessage").style.display = 'none';
                        document.getElementById("phoneErrorMessage").innerHTML = "A user with that phone number already exists";
                    } else if (data == "existingUsername") {
                        document.getElementById("phoneErrorMessage").style.display = 'none';
                        document.getElementById("emailErrorMessage").style.display = 'none';
                        document.getElementById("usernameErrorMessage").style.display = 'block';
                        document.getElementById("validationErrorMessage").style.display = 'none';
                        document.getElementById("usernameErrorMessage").innerHTML = "A user with that username already exists";
                    } else if (data == "passwordValidation") {
                        document.getElementById("validationErrorMessage").innerHTML = "Password must be at least 5 or less than 20 characters long";
                    } else if (data == "updated") {
                        if (emp == "") {
                            document.getElementById('profileSuccessModal').style.display = 'flex';
                            setTimeout(() => {
                                window.location = '/userprofile'
                            }, 2500);
                        } else {
                            $.post("/logout");
                            document.getElementById('profileSuccessModal').style.display = 'flex';
                            setTimeout(() => {
                                window.location = '/login'
                            }, 2500);
                        }
                    } else if (data == "logout") {
                        window.location = '/login'
                    }
                }
            })
        }
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

function passwordValidation() {
    const inpObjPassword = document.getElementById("password");
    if (!inpObjPassword.checkValidity()) {
        return true;
    }
}

function negativeValidation() {
    const yearsExp = document.getElementById("yearsExperience").value;
    const cost = document.getElementById("sessionCost").value;
    if(yearsExp < 0 || cost < 0) {
        return true;
    }
}


// Trigger click function for enter key for all input fields
const input = document.querySelectorAll(".form-control");
for (var i = 0; i < input.length; i++) {
    input[i].addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            document.getElementById("saveChanges").click();
        }
    });
}

// Variables for Delete User Modal 
var deleteUserModal = document.getElementById("deleteAccountModal");

if (window.location.pathname == '/userprofile') {
    document.getElementById('deleteAccount').onclick = function (e) {
        deleteUserModal.style.display = "block";
        document.body.style.overflow = 'hidden';
        $('#deleteAccountErrorMessage').html('');
    }
    document.getElementById('mobDeleteAccount').onclick = function (e) {
        deleteUserModal.style.display = "block";
        document.body.style.overflow = 'hidden';
        $('#deleteAccountErrorMessage').html('');
    }

    // If cancel button is clicked, hide modal for Delete User
    document.getElementById("closeDelete").onclick = function () {
        deleteUserModal.style.display = "none";
        document.body.style.overflow = 'auto';
    }

    // If user clicks outside of the modal for both Create and Delete then hide modal
    window.onclick = function (event) {
        if (event.target == deleteUserModal) {
            deleteUserModal.style.display = "none";
            document.body.style.overflow = 'auto';
        }
    }
} 
