const cartExistModal = document.getElementById('cartExistModal');

$(document).ready(async function () {
    await $.ajax({
        url: '/getTherapists',
        type: "GET",
        success: function (data) {
            data.forEach(function (Therapist) {
                var x = `<div class="therapistCard">`;
                x += `<img src="${Therapist.profileImg}" alt="Therapist 1">`
                x += '<div class="cardContent">'
                x += `<h3>${Therapist.firstName} ${Therapist.lastName}</h3>`
                x += `<p>${Therapist.yearsExperience} years of experience in the profession, and offers $${Therapist.sessionCost} per session</p>`
                x += `<div><button class="therapistBtn" id="${Therapist._id}">Purchase Session</button></div>`
                x += '</div>'
                x += '</div>'
                document.getElementById("therapistList").innerHTML += x;
            })
        }
    })

    const therapistBtns = document.querySelectorAll(".therapistBtn");

    // Disable buttons for admin, therapists, and logged out users
    setTimeout(() => {
        $.get('/isLoggedIn', function (user) {
            if (user) {
                if (user.userType == 'therapist') {
                    for (var i = 0; i < therapistBtns.length; i++) {
                        therapistBtns[i].disabled = true;
                    }
                } else if (user.userType == 'admin') {
                    for (var i = 0; i < therapistBtns.length; i++) {
                        therapistBtns[i].disabled = true;
                    }
                }
            } else {
                for (var i = 0; i < therapistBtns.length; i++) {
                    therapistBtns[i].disabled = true;
                    therapistBtns[i].innerHTML = 'Please Login';
                }
            }
        })

    }, 50);

    therapistBtns.forEach(function (btn) {
        $(btn).click(() => {
            $.ajax({
                url: "/addToCart",
                type: "POST",
                data: {
                    therapist: btn.id
                },
                success: function (data) {
                    if (data == 'cartExists') {
                        cartExistModal.style.display = 'block';
                        document.body.style.overflow = 'hidden';
                    } else if(data == "orderExists") {
                        //display error message pop up for when user already has a therapist.
                        console.log("EXISTING THERAPIST TO USER");
                    }else {
                        window.location = "/checkout"
                    }
                }
            })
        })
    })
})

 // If cancel button is clicked, hide modal for Cart Exist 
 document.getElementById("closeCart").onclick = function () {
    cartExistModal.style.display = "none";
    document.body.style.overflow = 'auto';
}

// If user clicks outside of the modal for Cart Exist Modal then hide modal
window.onclick = function (event) {
    if (event.target == cartExistModal) {
        cartExistModal.style.display = "none";
        document.body.style.overflow = 'auto';
    }
}