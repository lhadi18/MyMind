var profileImgBtn = document.getElementById('profileImage');
var profileFile = document.getElementById('profileFile');

profileImgBtn.addEventListener('click', function () {
    profileFile.click();
});

profileFile.addEventListener('change', function(){
    const choosedFile = this.files[0];
    
    if (choosedFile) {
        const reader = new FileReader();
        reader.addEventListener('load', function () {
            profileImgBtn.setAttribute('src', reader.result);
        });
    
        reader.readAsDataURL(choosedFile);
    }
}); 

var bannerImgBtn = document.getElementById('editBanner');
var bannerFile = document.getElementById('bannerFile');

bannerImgBtn.addEventListener('click', function () {
    bannerFile.click();
});

bannerFile.addEventListener('change', function(){
    const choosedFile = this.files[0];
    
    if (choosedFile) {
        const reader = new FileReader();
        reader.addEventListener('load', function () {
            if (window.location.pathname == '/userprofile') {
                document.getElementById('banner').style.backgroundImage = 'url("' + reader.result + '")';
            } else {
                document.getElementById('bannerMob').style.backgroundImage = 'url("' + reader.result + '")';
            }
        });
    
        reader.readAsDataURL(choosedFile);
    }
}); 