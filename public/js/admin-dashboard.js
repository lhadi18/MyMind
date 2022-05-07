$('#searchBtn').click(() => {
    console.log('clicked');
    $.post('/searchByEmail', {email: $("#email").val() }, function(userData){

        if(userData){
            $("#populate")
            .html(`First Name: ${userData.firstName} <br>`)
            .append(`Last name: ${userData.lastName} <br>`)
            .append(`Username: ${userData.username} <br>`)
            .append(`Email address: ${userData.email} <br>`)
            .append(`Administrator: ${userData.isAdmin} <br>`)
            .append(`User type: ${userData.userType} <br>`)
            .append(`Joined: ${new Date(userData.createdAt).toDateString()} <br>`)
            .append(`Updated last: ${new Date(userData.updatedAt).toDateString()} <br><br>`)
        }
        else {
            $("#populate")
            .html(`No user with email ${$('#email').val()} found`);
        }

    })
})



//     var clicked = false;
//     function getData() {
//         if(!clicked) {
//     $.ajax({
//         url: '/getAllUsersData',
//         type: "GET",
//         success: function(data) {
//             var userData = JSON.stringify(data);
//             data.forEach(userData => {
            // $("#populate")
            // .append(`First Name: ${userData.firstName} <br>`)
            // .append(`Last name: ${userData.lastName} <br>`)
            // .append(`Username: ${userData.username} <br>`)
            // .append(`Email address: ${userData.email} <br>`)
            // .append(`Administrator: ${userData.isAdmin} <br>`)
            // .append(`User type: ${userData.userType} <br>`)
            // .append(`User since: ${userData.createdAt} <br>`)
            // .append(`Updated last: ${userData.updatedAt} <br><br>`)
//             });
//         }
//     });
// }
//     clicked = true;
// }