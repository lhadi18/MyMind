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

    var therapistBtns = document.querySelectorAll(".therapistBtn");
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
                    } else {
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