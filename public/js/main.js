const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLink = document.querySelectorAll('.nav-link');

$(document).ready(function () {

    // Load the Navbar and Footer 
    loadNavbarFooter();
   // setTimeout(() => {
        $.get('/isLoggedIn', function (user) {
            if (user) {
                // if (user.isAdmin) {
                //     document.querySelector(".isAdmin").style.display = "list-item";
                //     loadNavbarFooter("../headerfooter/therapist-nav.html");
                // } else 
                if (user.userType == 'patient') {
                    var patientEls = document.querySelectorAll(".isPatient");
                    for (var x = 0; x < patientEls.length; x++)
                        patientEls[x].style.display = 'list-item';

                    let loggedInEls = document.querySelectorAll(".isLoggedIn");
                    for (var x = 0; x < loggedInEls.length; x++)
                        loggedInEls[x].style.display = 'list-item';

                } else if (user.userType == 'therapist') {
                    let therapistEls = document.querySelectorAll(".isTherapist");
                    for (var x = 0; x < therapistEls.length; x++)
                        therapistEls[x].style.display = 'list-item';

                    let loggedInEls = document.querySelectorAll(".isLoggedIn");
                    for (var x = 0; x < loggedInEls.length; x++)
                        loggedInEls[x].style.display = 'list-item';
                }
                setTimeout(() => {
                    $('.logout-link').click(function () {
                        console.log('clicked')
                        $.post('/logout');
                        window.location = '/login'
                    })
                }, 400);
            } else {
                let loggedOutEls = document.querySelectorAll(".isLoggedOut")
                    for (var x = 0; x < loggedOutEls.length; x++)
                    loggedOutEls[x].style.display = 'list-item';
            }
        })

    //}, 50);




    // Display hashed password for signup and login form
    displayPassword();

    /* Show Menu */
    // Validation if constant var exists
    if (navToggle) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.add('show-menu');
        });
    }

    /* Hide Menu */
    // Validation if constant var exists
    if (navClose) {
        navClose.addEventListener('click', function () {
            navMenu.classList.remove('show-menu');
        });
    }


});

// Load the Navbar and Footer 
function loadNavbarFooter() {
    $('#navPlaceHolder').load('../headerfooter/nav.html', function () {
        $('.navbar-nav .nav-item .nav-link').each(function () {
            $(this).toggleClass('active', this.getAttribute('href') === location.pathname);
        });
        $('.nav-menu .nav-list .nav-item .nav-link').each(function () {
            $(this).toggleClass('active', this.getAttribute('href') === location.pathname);
        });
    });
    $('#footerPlaceHolder').load('../headerfooter/footer.html');
}

// Display hashed password for signup and login form
function displayPassword() {
    $("#show-hide-password .input-group-addon a").on('click', function (event) {
        event.preventDefault();
        if ($('#show-hide-password input').attr("type") == "text") {
            $('#show-hide-password input').attr('type', 'password');
            $('#show-hide-password .input-group-addon a i').addClass("fa-eye-slash");
            $('#show-hide-password .input-group-addon a i').removeClass("fa-eye");
        } else if ($('#show-hide-password input').attr("type") == "password") {
            $('#show-hide-password input').attr('type', 'text');
            $('#show-hide-password .input-group-addon a i').removeClass("fa-eye-slash");
            $('#show-hide-password .input-group-addon a i').addClass("fa-eye");
        }
    });
}

// Remove Menu Mobile
function linkAction() {
    // When clicked on each nav link, remove the show menu class
    document.getElementById('nav-menu').classList.remove('show-menu');
}

navLink.forEach(n => n.addEventListener('click', linkAction));