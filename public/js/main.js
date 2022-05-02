const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLink = document.querySelectorAll('.nav-link');

$(document).ready(function () {
    // Load the Navbar and Footer 
    loadNavbarFooter();

    // Display hashed password for signup and login form
    displayPassword();

    /* Show Menu */
    // Validation if constant var exists
    if(navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.add('show-menu');
        });
    }

    /* Hide Menu */
    // Validation if constant var exists
    if(navClose) {
        navClose.addEventListener('click', function() {
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

navLink.forEach( n => n.addEventListener('click', linkAction));