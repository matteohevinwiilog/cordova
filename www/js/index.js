let fileNotFoundURL = 'https://lightwidget.com/wp-content/uploads/2018/05/local-file-not-found-320x326.png';
$(function () {
    $(document).on('deviceready', function () {
        fillListWithRetrievedArticles();
        bindEvents();
    });
});

function bindEvents() {
    $('#newArticle').on('click', newArticle);
    $('#clearArticles').on('click', clearArticles);
    $('#exit').on('click', function () {
        navigator.app.exitApp();
    });
}

function newArticle() {
    navigator.splashscreen.show();
    window.location.replace('html/newArticle.html');
}

function showArticle(article) {
    navigator.splashscreen.show();
    localStorage.setItem("currentArticle", JSON.stringify(article));
    window.location.replace('html/showArticle.html');
}

function clearArticles() {
    navigator.splashscreen.show();
    localStorage.removeItem("articles");
    $('#listRecycler').html('');
    navigator.splashscreen.hide();
}

function retrieveAndSortArticles() {
    let unsortedArticles = JSON.parse(localStorage.getItem("articles")) || [];
    return unsortedArticles.sort(function (articleFirst, articleNext) {
        return articleFirst.date > articleNext.date
            ? 1
            : articleFirst.date < articleNext.date
                ? -1
                : 0
    });
}

function fillListWithRetrievedArticles() {
    let articles = retrieveAndSortArticles();
    articles.forEach(function (article) {
        let imageSrc = article.imageSrc ?? fileNotFoundURL;
        $articleCard = '<div class="card mt-3 mb-3 shadow" id="' + article.id + '" style="width: 18rem;">';
        $articleCard += '<img class="card-img-top" height="150px" src="' + imageSrc + '">';
        $articleCard += '<div class="card-body">';
        $articleCard += '<h5 class="card-title">' + article.body + '</h5>';
        $articleCard += '<p class="card-text">' + article.dateString + '</p>';
        $articleCard += '</div></div>';
        $('#listRecycler').append($articleCard);
        $('#' + article.id).click(function () {
            showArticle(article);
        })
    });
    navigator.splashscreen.hide();
}