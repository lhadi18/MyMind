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
    therapistBtns.forEach(function(btn){
        $(btn).click(()=>{
            $.ajax({
                url: "/addToCart",
                type: "POST",
                data: {
                    therapist: btn.id
                },
                success: function(data){
                    if (data=='cartExists'){
                        console.log('cart exists baby')
                    } else{
                        window.location = "/checkout"
                    }
                }
            })
        })
    })


})