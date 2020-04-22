let currentArticle = null;
let articleMap = null;

$(function () {
    $(document).on('deviceready', function () {
        currentArticle = JSON.parse(localStorage.getItem('currentArticle'));
        $('#articleBody').text(currentArticle.body);
        $('#articleDate').text(currentArticle.dateString);
        if (currentArticle.lat && currentArticle.lng) {
            $('#articleLat').text(currentArticle.lat);
            $('#articleLng').text(currentArticle.lng);
            $('.coordinates').removeClass('d-none');
        }
        if (currentArticle.imageSrc) {
            $('#articleImage').attr('src', currentArticle.imageSrc);
        }
        if (currentArticle.videoSrc) {
            $('video').removeClass('d-none');
            $('#articleVideo').attr('src', currentArticle.videoSrc);
            checkLoad();
        } else {
            navigator.splashscreen.hide();
        }
        if (currentArticle.lat && currentArticle.lng) {
            initArticleMap();
        }
        bindEvents();
    });
});

function bindEvents() {
    $('#deleteArticle').click(removeArticle);
    $('#editArticle').click(editArticle);
}

function removeArticle() {
    navigator.splashscreen.show();
    let currentArticles = JSON.parse(localStorage.getItem("articles")) || [];
    let updatedArticles = currentArticles.filter(article => article.id !== currentArticle.id);
    localStorage.setItem("articles", JSON.stringify(updatedArticles));
    home();
}

function editArticle() {
    navigator.splashscreen.show();
    window.location.replace('../html/newArticle.html');
}

function initArticleMap() {
    articleMap = L.map('articlePosition').setView([currentArticle.lat, currentArticle.lng], 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1Ijoidml0ZXJpYSIsImEiOiJjazFrZWxoZnEwYWh2M2xwbmx0MjRycnV5In0.45A5tewPfxxUkqMTarV7Fw'
    }).addTo(articleMap);
    let marker = L.marker([currentArticle.lat, currentArticle.lng]).addTo(articleMap);
    marker.bindPopup("<b>Article : </b><br>" + currentArticle.body).openPopup();
}