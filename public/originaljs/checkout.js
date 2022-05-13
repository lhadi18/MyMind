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

function deleteCart() {
    $.ajax({
        url: '/deleteCart',
        type: 'DELETE',
        success: function (data) {
            console.log("Deleted successfully");
            document.getElementById('signupSuccessModal').style.display = 'flex';
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                location.reload();
            }, 2500);
        }
    })
}