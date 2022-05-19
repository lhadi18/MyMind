const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLink = document.querySelectorAll('.nav-link');

$(document).ready(function () {

    // Load the Navbar and Footer 
    loadNavbarFooter();

    setTimeout(() => {
        $.get('/isLoggedIn', function (user) {
            if (user) {
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
                } else if (user.userType == 'admin') {
                    let adminEls = document.querySelectorAll(".isAdmin");
                    for (var x = 0; x < adminEls.length; x++)
                        adminEls[x].style.display = 'list-item';

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

    }, 50);

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
        // For mobile nav links
        $('.nav-item .nav-link').each(function () {
            $(this).toggleClass('active', this.getAttribute('href') === location.pathname);
        });
        // For mobile nav icons
        $('.nav-link .nav-icon').each(function () {
            $(this).toggleClass('active', this.getAttribute('href') === location.pathname);
        });

        // For desktop nav links
        $('.navLinks a').each(function () {
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

// Chat Page for mobile
if (window.location.pathname == '/chat-session') {
    var element = $('#wrapper');
    var messages = element.find('#chatMessages');
    var textInput = element.find('#chatbox');
    var userInput = $('#chatbox');
    element.find('>i').hide();
    element.addClass('expand');
    textInput.keydown(onMetaAndEnter).prop("disabled", false).focus();
    element.off('click', openElement);
    element.find('#sendMessage').click(sendNewMessage);
    messages.scrollTop(messages.prop("scrollHeight"));
    
    userInput.each(function () {
        this.setAttribute("style", `${this.scrollHeight + 2}px`);
    }).on("input", function () {
        this.style.height = (this.scrollHeight + 2) + "px";
    });
    
    userInput.focus(function () {
        if ($(this).val() === "Message ...") {
            $(this).val("").focus();
            this.setAttribute("style", `${this.scrollHeight + 2}px`);
        }
    });
    userInput.blur(function () {
        if ($(this).val() === "") {
            $(this).val("Message ...");
            this.setAttribute("style", `${this.scrollHeight + 2}px`);
        }
    });

    userInput.blur();
}

// Chat Box for desktop
var element = $('#therapistChat');
element.addClass('enter');
element.click(openElement);

function openElement() {
    var messages = element.find('#chatMessages');
    var textInput = element.find('#chatbox');
    var userInput = $('#chatbox');
    element.find('>i').hide();
    element.addClass('expand');
    element.find('.chatContainer').addClass('enter');
    textInput.keydown(onMetaAndEnter).prop("disabled", false).focus();
    element.off('click', openElement);
    element.find('#closeChat').click(closeElement);
    element.find('#sendMessage').click(sendNewMessage);
    messages.scrollTop(messages.prop("scrollHeight"));
    
    userInput.each(function () {
        this.setAttribute("style", `${this.scrollHeight + 2}px`);
    }).on("input", function () {
        this.style.height = (this.scrollHeight + 2) + "px";
    });
    
    userInput.focus(function () {
        if ($(this).val() === "Message ...") {
            $(this).val("").focus();
            this.setAttribute("style", `${this.scrollHeight + 2}px`);
        }
    });
    userInput.blur(function () {
        if ($(this).val() === "") {
            $(this).val("Message ...");
            this.setAttribute("style", `${this.scrollHeight + 2}px`);
        }
    });

    userInput.blur();
}

function closeElement() {
    element.find('.chatContainer').removeClass('enter').hide();
    element.find('#chatMsgIcon').show();
    element.removeClass('expand');
    element.find('#closeChat').off('click', closeElement);
    element.find('#sendMessage').off('click', sendNewMessage);
    element.find('#chatbox').off('keydown', onMetaAndEnter).prop("disabled", true).blur();
    setTimeout(function () {
        element.find('.chatContainer').removeClass('enter').show()
        element.click(openElement);
    }, 500);
}

function sendNewMessage() {
    var userInput = $('#chatbox');
    var newMessage = userInput.val().replace(/\<div\>|\<br.*?\>/ig, '\n').replace(/\<\/div\>/g, '').trim().replace(/\n/g, '<br>');

    if (!newMessage) {
        return;
    } else if (newMessage === 'Message ...') {
        return null;
    }

    var messagesContainer = $('#chatMessages');

    messagesContainer.append([
        '<li class="self">',
        newMessage,
        '</li>'
    ].join(''));

    userInput.val('');
    userInput.focus();

    $('#chatbox').each(function () {
        this.setAttribute("style", `${this.scrollHeight + 5}px`);
    });

    messagesContainer.finish().animate({
        scrollTop: messagesContainer.prop("scrollHeight")
    }, 500);
}

function onMetaAndEnter(e) {
    if (e.ctrlKey && e.keyCode == 13) {
        sendNewMessage();
    }
}
