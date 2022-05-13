$.ajax({
    url: '/getTherapists',
    type: "GET",
    success: function (data) {
        var firstCard = data[1];
        var mainCard = data[2];
        var thirdCard = data[0];
        var x = '<div class="therapyCard">';
        x += `<h2>$${firstCard.sessionCost}<span> / session</span></h2>`
        x += '<h4>Therapist Details</h4>'
        x += `<p>${firstCard.firstName} ${firstCard.lastName}</p>`
        x += `<p>${firstCard.yearsExperience} years of experience</p>`
        x += '<div><a href="/therapists">View Therapist</a></div>'
        x += '</div>'
        var y = '<div class="therapyCard mainCard">';
        y += `<h2>$${mainCard.sessionCost}<span> / session</span></h2>`
        y += '<h4>Therapist Details</h4>'
        y += `<p>${mainCard.firstName} ${mainCard.lastName}</p>`
        y += `<p>${mainCard.yearsExperience} years of experience</p>`
        y += '<div><a href="/therapists">View Therapist</a></div>'
        y += '</div>'
        var z = '<div class="therapyCard">';
        z += `<h2>$${thirdCard.sessionCost}<span> / session</span></h2>`
        z += '<h4>Therapist Details</h4>'
        z += `<p>${thirdCard.firstName} ${thirdCard.lastName}</p>`
        z += `<p>${thirdCard.yearsExperience} years of experience</p>`
        z += '<div><a href="/therapists">View Therapist</a></div>'
        z += '</div>'
        document.getElementById("therapistCards").innerHTML += x;
        document.getElementById("therapistCards").innerHTML += y;
        document.getElementById("therapistCards").innerHTML += z;
    }
})

// Google Maps
function initMap() {
    const uluru = { lat: 49.2484615, lng: -123.0048777 };
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: uluru,
    });
    const marker = new google.maps.Marker({
        position: uluru,
        map: map,
    });
}

window.initMap = initMap;













// Chat Box
var element = $('.therapistChat');
var myStorage = localStorage;

// if (!myStorage.getItem('chatID')) {
//     myStorage.setItem('chatID', createUUID());
// }

element.addClass('enter');
element.click(openElement);


function openElement() {
    var messages = element.find('.messages');
    var textInput = element.find('.text-box');
    element.find('>i').hide();
    element.addClass('expand');
    element.find('.chatContainer').addClass('enter');
    var strLength = textInput.val().length * 2;
    textInput.keydown(onMetaAndEnter).prop("disabled", false).focus();
    element.off('click', openElement);
    element.find('.header button').click(closeElement);
    element.find('#sendMessage').click(sendNewMessage);
    messages.scrollTop(messages.prop("scrollHeight"));
    textInput.focus(function() {
      if ($(this).text() === "Type here..."){
          $(this).text("").focus();
      }
    });
    textInput.blur(function() {
        if ($(this).text() === ""){
            $(this).text("Type here...");
        }
    });
  textInput.blur();
}

function closeElement() {
    element.find('.chatContainer').removeClass('enter').hide();
    element.find('>i').show();
    element.removeClass('expand');
    element.find('.header button').off('click', closeElement);
    element.find('#sendMessage').off('click', sendNewMessage);
    element.find('.text-box').off('keydown', onMetaAndEnter).prop("disabled", true).blur();
    setTimeout(function() {
        element.find('.chatContainer').removeClass('enter').show()
        element.click(openElement);
    }, 500);
}

// function createUUID() {
//     // http://www.ietf.org/rfc/rfc4122.txt
//     var s = [];
//     var hexDigits = "0123456789abcdef";
//     for (var i = 0; i < 36; i++) {
//         s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
//     }
//     s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
//     s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
//     s[8] = s[13] = s[18] = s[23] = "-";

//     var uuid = s.join("");
//     return uuid;
// }

function sendNewMessage() {
    var userInput = $('.text-box');
    var newMessage = userInput.html().replace(/\<div\>|\<br.*?\>/ig, '\n').replace(/\<\/div\>/g, '').trim().replace(/\n/g, '<br>');

    if (!newMessage) return;

    var messagesContainer = $('.messages');

    messagesContainer.append([
        '<li class="self">',
        newMessage,
        '</li>'
    ].join(''));

    // clean out old message
    userInput.html('');
    // focus on input
    userInput.focus();

    messagesContainer.finish().animate({
        scrollTop: messagesContainer.prop("scrollHeight")
    }, 250);
}

function onMetaAndEnter(event) {
    if ((event.metaKey || event.ctrlKey) && event.keyCode == 13) {
        sendNewMessage();
    }
}