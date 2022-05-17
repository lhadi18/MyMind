var therapistInformation;
var totalPrice;
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
                $('#cartPlan').val(`${cart.timeLength}`)
                updateCart();
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
                $('#therapistName').text(`${therapist.firstName} ${therapist.lastName}`)
                $('#therapistDesc').text(`${therapist.yearsExperience} years of experience in the profession, and offers $${therapist.sessionCost} per session`)
                $('#therapistImg').attr('src', `${therapist.profileImg}`)
                therapistInformation = therapist;
                if ($('#cartPlan').val() == "freePlan") {
                    $("#cartCost").html(`0.00`)
                    $("#subTotal").html(`$0.00`)
                    $("#taxTotal").html(`$0.00`)
                    $("#total").html(`$0.00`)
                    totalPrice = parseFloat(0.00).toFixed(2);
                }
                if ($('#cartPlan').val() == "monthPlan") {
                    $("#cartCost").html(`${therapistInformation.sessionCost}.00`)
                    $("#subTotal").html(`$${therapistInformation.sessionCost}.00`)
                    $("#taxTotal").html(`$${parseFloat(therapistInformation.sessionCost * 0.12).toFixed(2)}`)
                    $("#total").html(`$${parseFloat(therapistInformation.sessionCost * 1.12).toFixed(2)}`)
                    totalPrice = `${parseFloat(therapistInformation.sessionCost * 1.12).toFixed(2)}`;
                }
                if ($('#cartPlan').val() == "threeMonthPlan") {
                    $("#cartCost").html(`${parseFloat(therapistInformation.sessionCost * 3).toFixed(2)}`)
                    $("#subTotal").html(`${parseFloat(therapistInformation.sessionCost * 3).toFixed(2)}`)
                    $("#taxTotal").html(`$${parseFloat(therapistInformation.sessionCost * 3 * 0.12).toFixed(2)}`)
                    $("#total").html(`$${parseFloat(therapistInformation.sessionCost * 3 * 1.12).toFixed(2)}`)
                    totalPrice = `${parseFloat(therapistInformation.sessionCost * 3 * 1.12).toFixed(2)}`;
                }
                if ($('#cartPlan').val() == "yearPlan") {
                    $("#cartCost").html(`${parseFloat(therapistInformation.sessionCost * 6).toFixed(2)}`)
                    $("#subTotal").html(`${parseFloat(therapistInformation.sessionCost * 6).toFixed(2)}`)
                    $("#taxTotal").html(`$${parseFloat(therapistInformation.sessionCost * 6 * 0.12).toFixed(2)}`)
                    $("#total").html(`$${parseFloat(therapistInformation.sessionCost * 6 * 1.12).toFixed(2)}`)
                    totalPrice = `${parseFloat(therapistInformation.sessionCost * 6 * 1.12).toFixed(2)}`;
                }
        }
    })
}

function updateCart() {
    $('#cartPlan').change(() => {
        $.ajax({
            url: '/updateCart',
            type: 'PUT',
            data: {
                timeLength: $('#cartPlan').val()
            },
            success: function () {
                if ($('#cartPlan').val() == "freePlan") {
                    $("#cartCost").html(`0.00`)
                    $("#subTotal").html(`$0.00`)
                    $("#taxTotal").html(`$0.00`)
                    $("#total").html(`$0.00`)
                    totalPrice = parseFloat(0.00).toFixed(2);
                }
                if ($('#cartPlan').val() == "monthPlan") {
                    $("#cartCost").html(`${therapistInformation.sessionCost}.00`)
                    $("#subTotal").html(`$${therapistInformation.sessionCost}.00`)
                    $("#taxTotal").html(`$${parseFloat(therapistInformation.sessionCost * 0.12).toFixed(2)}`)
                    $("#total").html(`$${parseFloat(therapistInformation.sessionCost * 1.12).toFixed(2)}`)
                    totalPrice = `${parseFloat(therapistInformation.sessionCost * 1.12).toFixed(2)}`;
                }
                if ($('#cartPlan').val() == "threeMonthPlan") {
                    $("#cartCost").html(`${parseFloat(therapistInformation.sessionCost * 3).toFixed(2)}`)
                    $("#subTotal").html(`${parseFloat(therapistInformation.sessionCost * 3).toFixed(2)}`)
                    $("#taxTotal").html(`$${parseFloat(therapistInformation.sessionCost * 3 * 0.12).toFixed(2)}`)
                    $("#total").html(`$${parseFloat(therapistInformation.sessionCost * 3 * 1.12).toFixed(2)}`)
                    totalPrice = `${parseFloat(therapistInformation.sessionCost * 3 * 1.12).toFixed(2)}`;
                }
                if ($('#cartPlan').val() == "yearPlan") {
                    $("#cartCost").html(`${parseFloat(therapistInformation.sessionCost * 6).toFixed(2)}`)
                    $("#subTotal").html(`${parseFloat(therapistInformation.sessionCost * 6).toFixed(2)}`)
                    $("#taxTotal").html(`$${parseFloat(therapistInformation.sessionCost * 6 * 0.12).toFixed(2)}`)
                    $("#total").html(`$${parseFloat(therapistInformation.sessionCost * 6 * 1.12).toFixed(2)}`)
                    totalPrice = `${parseFloat(therapistInformation.sessionCost * 6 * 1.12).toFixed(2)}`;
                }
            }
        })
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

const checkoutErrorMsg = document.getElementById("checkoutErrorMessage");

document.getElementById('confirmOrder').onclick = function () {
    const time = new Date();
    var timeLengthforUse;
    var selectedTime = $('#cartPlan').val();
    if(selectedTime == "freePlan") {
        timeLengthforUse = new Date(time.setMinutes(time.getMinutes() + 3));
    } else if (selectedTime == "monthPlan") {
        timeLengthforUse = new Date(time.setMinutes(time.getMinutes() + 5));
    } else if (selectedTime == "threeMonthPlan") {
        timeLengthforUse = new Date(time.setMinutes(time.getMinutes() + 10));
    } else if (selectedTime == "yearPlan") {
        timeLengthforUse = new Date(time.setMinutes(time.getMinutes() + 15));
    }
    console.log(timeLengthforUse.toLocaleTimeString());
    $.ajax({
        url: "/confirmCart",
        method: "POST",
        data: {
            cartPlan: $('#cartPlan').val(),
            timeLengthforUse: timeLengthforUse,
            totalPrice: totalPrice,
            therapistID: therapistInformation._id
        },
        success: function (data) {
            if (data == "usedTrial") {
                checkoutErrorMsg.style.display = 'block';
                checkoutErrorMsg.innerHTML = "You have already used your free trial.";
            } else {
                checkoutErrorMsg.style.display = 'none';
                document.getElementById('signupSuccessModal').style.display = 'flex';
                document.body.style.overflow = 'hidden';
                setTimeout(() => {
                    window.location = "/thank-you"
                }, 2500);
            }
        }
    })
}

// Print invoice function
// function printInvoice() {
//     var divContents = document.getElementById("orderSummary");
//     var a = window.open('', '', 'height=500, width=500');
//     a.document.write('<html>');
//     a.document.write('<body > <h1>Div contents are <br>');
//     a.document.write(divContents);
//     a.document.write('</body></html>');
//     a.document.close();
//     a.print();
// }