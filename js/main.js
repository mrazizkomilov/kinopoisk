var searchQuaery;
$(document).ready(function () {
  elSearchForm = $(".js-search-movie-form");
  elSearchInput = elSearchForm.find(".movie-search-input");
  elementResultsList = $(".rezults__list");

  var showResultsmovies = function (foundMovies) {
    foundMovies.forEach(function (movie) {
      var movieElement = $(`
         <li class="rezults__item  m-4 p-3 bg-primary">
         <div class="rezults__card " body">
            <div class="card-body >
               <h3 class="card-body">
               <span class="js-card-title "></span>
               <span class="js-card-year mr-1 ml-1"></span> 
               </h3>
               <p class = "js-card-text"></p>
               <button type = "button" class="btn btn-primary  js-modal-opener" data-toggle = "modal"  data-target = "#Mymodal">info</button>
            </div>
            <img class="js-movie-photo" src =''>
         </div>
      </li>
   `);

      movieElement.find(".js-card-title").text(movie.Title);
      movieElement.find(".js-card-year").text(movie.Year);
      movieElement.find(".js-movie-photo").attr("src", movie.Poster);
      movieElement.find(".js-modal-opener").attr("data-movie-id", movie.imdbID);
      elementResultsList.append(movieElement);
    });
  };

  elSearchForm.on("submit", function (evt) {
    evt.preventDefault();

    var movieName = elSearchInput.val();

    searchQuaery = `https://www.omdbapi.com/?apiKey=96e2b3c2&s=${movieName}`;

    $(".search-word").text(movieName);

    $.ajax("https://www.omdbapi.com/", {
      method: "GET",
      data: {
        apikey: "96e2b3c2",
        s: movieName,
        plot: "full",
      },

      timeout: 10000,
      beforeSend: function () {
        elementResultsList.html("");
        elSearchInput.attr("disable", true);
      },
      complete: function () {
        elSearchInput.attr("disable", false);
      },
      success: function (response) {
        if (response.Error) {
          alert(response.Error);
          return;
        }
        showResultsmovies(response.Search);

        $(".paginations").html("");

        var pagesCount = Math.ceil(parseInt(response.totalResults, 10) / 10);
        for (var i = 1; i <= pagesCount; i++) {
          $(".paginations").append(
            `<button class = 'btn btn-dark m-1' data-pages='${i}' ${
              i === 1 ? "disabled" : ""
            }>  ${i}</button>`
          );
        }
      },
      error: function (request, errorType, errorMassage) {
        alert(`${errorType}: ${errorMassage}`);
      },
    });
  });

  movieId = elementResultsList.find(".data-movie-id");

  elementResultsList.on("click", ".js-modal-opener", function () {
    var movieId = $(this).data("movie-id");
    $.ajax("https://www.omdbapi.com/", {
      method: "GET",
      data: {
        apikey: "96e2b3c2",
        i: movieId,
        plot: "full",
      },
      timeout: 10000,
      beforeSend: function () {
        $(".modal-title").text("");
        $(".modal-img").attr("src", "");
        $(".modal-text").text("");
        $(".movie-actor").text("");
        $(".imdbRating").text("");
        $(".Genre").text("");
      },
      success: function (response) {
        if (response.Error) {
          alert(response.Error);
          return;
        }
        $(".modal-title").text(response.Title);
        $(".modal-img").attr("src", response.Poster);
        $(".modal-text").text(response.Plot);
        $(".movie-actor").text(response.Actors);
        $(".imdbRating").text(response.imdbRating);
        $(".Genre").text(response.Genre);
      },
    });
  });

  //pagenations bosilgandagi amallar

  $(".paginations").on("click", "button", function () {
    $(".paginations").find("button").attr("disabled", false);
    $(this).attr("disabled", true);
    var pagesUrl = `${searchQuaery}&page=${$(this).data("pages")}`;
    $.ajax(pagesUrl, {
      beforeSend: function () {
        elementResultsList.html("");
      },
      success: function (response) {
        showResultsmovies(response.Search);
      },
    });
  });
});
