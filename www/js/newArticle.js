let currentArticle = null;
$(document).on('deviceready', function () {
    navigator.splashscreen.show();
});
$(function () {
    $(document).on('deviceready', function () {
        $('#confirmNewArticle').click(newArticle);
        $('#cameraTakePicture').click(takePicture);
        $('#cameraTakeVideo').click(takeVideo);
        if (localStorage.getItem("currentArticle")) {
            currentArticle = JSON.parse(localStorage.getItem("currentArticle"));
            $('#articleBody').val(currentArticle.body);
            $('#articleLat').val(currentArticle.lat);
            $('#articleLng').val(currentArticle.lng);
            $('#articleImage').attr('src', currentArticle.imageSrc);
            $('#articleVideo').attr('src', currentArticle.videoSrc);
            $('video').removeClass('d-none');
            checkLoad();
        } else {
            navigator.splashscreen.hide();
        }
    });
});

function newArticle() {
    let articleBody = $('#articleBody').val();
    if (articleBody) {
        parseAndAddArticleToLocalStorage(articleBody);
    }
}

function takePicture() {
    navigator.camera.getPicture(function (imageData) {
        $('#articleImage').attr('src', "data:image/jpeg;base64," + imageData);
    }, function () {
    }, {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL
    });
}

function takeVideo() {
    navigator.device.capture.captureVideo(function (source) {
        $('#articleVideo').attr('type', source[0].type);
        $('#articleVideo').attr('src', source[0].fullPath);
        $('video').removeClass('d-none');
    }, function() {
    }, {limit: 1});
}

function parseAndAddArticleToLocalStorage(articleBody) {
    navigator.splashscreen.show();
    let currentArticles = JSON.parse(localStorage.getItem("articles")) || [];
    let today = new Date();
    let d = String(today.getDate()).padStart(2, '0');
    let m = String(today.getMonth() + 1).padStart(2, '0');
    let y = today.getFullYear();
    let H = today.getHours();
    let i = today.getMinutes();
    let s = today.getSeconds();
    today = d + '/' + m + '/' + y + ' ' + H + ':' + i + ':' + s;
    getCurrentLocationAndExecNew(function (coordinates) {
        if (currentArticle) {
            currentArticles = currentArticles.filter(article => article.id !== currentArticle.id);
            currentArticles.push({
                ...currentArticle,
                body: articleBody,
                lat: coordinates.lat,
                lng: coordinates.lng,
                imageSrc: $('#articleImage').attr('src'),
                videoSrc: $('#articleVideo').attr('src'),
            });
        } else {
            currentArticles.push({
                id: '_' + Math.random().toString(36).substr(2, 9),
                body: articleBody,
                date: Date.now(),
                dateString: today,
                lat: coordinates.lat,
                lng: coordinates.lng,
                imageSrc: $('#articleImage').attr('src'),
                videoSrc: $('#articleVideo').attr('src'),
            });
        }
        let updatedArticlesString = JSON.stringify(currentArticles);
        localStorage.setItem("articles", updatedArticlesString);
        home();
    });
}

function getCurrentLocationAndExecNew(callback) {
    let currentCoords = {
        lat: null,
        lng: null
    };
    navigator.geolocation.getCurrentPosition(function (position) {
        currentCoords.lat = position.coords.latitude;
        currentCoords.lng = position.coords.longitude;
        callback(currentCoords);
    }, function () {
        callback(currentCoords);
    }, {timeout: 2000});
}