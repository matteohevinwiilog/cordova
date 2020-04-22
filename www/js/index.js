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
        $('#listRecycler').append('<li id="' + article.id + '">' + article.body + ' datant du ' + article.dateString + '</li>');
        $('#' + article.id).click(function () {
            showArticle(article);
        })
    });
    navigator.splashscreen.hide();
}