$(function() {
    $(document).on('deviceready', function() {
        $(document).on("backbutton", function (e) {
            overrideBackButton(e);
        });
        $('#home').click(home);
    });
});

function overrideBackButton(e) {
    e.preventDefault();
}

function home() {
    navigator.splashscreen.show();
    localStorage.removeItem('currentArticle');
    window.location.replace('../index.html');
}

function checkLoad() {
    let video = $('#articleVideo').get(0);
    if (video.readyState === 4) {
        navigator.splashscreen.hide();
    } else {
        setTimeout(checkLoad, 100);
    }
}