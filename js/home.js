$(document).ready(function () {
    $("#form").submit(function(e){
        e.preventDefault();
    });
    
    $(".button").click(function () {
        window.location.href = "page2.html"
    });
});