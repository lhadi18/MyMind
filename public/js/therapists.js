$.ajax({
    url: '/getTherapists',
    type: "GET",
    success: function (data) {
        data.forEach(function(Therapist){
                var x = '<div class="therapistCard">';
                x += `<img src="${Therapist.profileImg}" alt="Therapist 1">`
                x += '<div class="cardContent">'
                x += `<h3>${Therapist.firstName} ${Therapist.lastName}</h3>`
                x += `<p>${Therapist.yearsExperience} years of experience in the profession, and offers $${Therapist.sessionCost} per session</p>`
                x += '<div><a href="/checkout">Purchase Session</a></div>'
                x += '</div>'
                x += '</div>'
                document.getElementById("therapistList").innerHTML += x;
        })
    }
})