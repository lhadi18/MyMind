$(document).ready(async function () {
    await $.ajax({
        url: '/checkStatus',
        method: 'GET',
        success: function (cart) {
            if (cart) {
                $('#orderNumber').text(`${cart.orderId}`)
                $("#noOrderSummary").hide();
                $("#orderSummary").show();
                getTherapist(cart.therapist);
            } else {
                $("#noOrderSummary").show();
                $("#orderSummary").hide();
            }

        }
    })
})

function getTherapist(therapistId) {
    $.ajax({
        url: '/getTherapistInfo',
        method: "POST",
        data: {
            therapistId: therapistId
        },
        success: function (therapist) {
            console.log(therapist);
            $('#therapistName').text(`${therapist.firstName} ${therapist.lastName}`)
            $('#therapistDesc').text(`${therapist.yearsExperience} years of experience in the profession, and offers $${therapist.sessionCost} per session`)
            $('#therapistImg').attr('src', `${therapist.profileImg}`)
            $("#cartCost").html(`${therapist.sessionCost}.00`)
            $("#subTotal").html(`$${therapist.sessionCost}.00`)
            $("#taxTotal").html(`$${parseFloat(therapist.sessionCost * 0.12).toFixed(2)}`)
            $("#total").html(`$${parseFloat(therapist.sessionCost * 1.12).toFixed(2)}`)
        }
    })
}

// Variables for Delete User Modal 
var removeOrderModal = document.getElementById("removeOrderModal");

document.getElementById('removeItem').onclick = function (e) {
    removeOrderModal.style.display = "block";
    document.body.style.overflow = 'hidden';

    document.getElementById('removeOrderBtn').onclick = function () {
        $.ajax({
            url: '/deleteCart',
            type: 'DELETE',
            success: function (data) {
                console.log("Deleted successfully");
                removeOrderModal.style.display = "none";
                document.getElementById('signupSuccessModal').style.display = 'flex';
                document.body.style.overflow = 'hidden';
                setTimeout(() => {
                    location.reload();
                }, 2500);
            }
        })
    }
}

// If cancel button is clicked, hide modal for Delete User
document.getElementById("cancelRemove").onclick = function () {
    removeOrderModal.style.display = "none";
    document.body.style.overflow = 'auto';
}

// If user clicks outside of the modal for both Create and Delete then hide modal
window.onclick = function (event) {
    if (event.target == removeOrderModal) {
        removeOrderModal.style.display = "none";
        document.body.style.overflow = 'auto';
    }
}