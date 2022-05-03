var imgBtn = document.getElementById('profileImage');
var fileInp = document.querySelector('[type="file"]');

imgBtn.addEventListener('click', function () {
    fileInp.click();
})

fileInp.addEventListener('change', function(){
    // this refers to the file
    const choosedFile = this.files[0];
    
    if (choosedFile) {
        const reader = new FileReader();
        reader.addEventListener('load', function () {
            imgBtn.setAttribute('src', reader.result);
        });
    
        reader.readAsDataURL(choosedFile);
    }
}); 