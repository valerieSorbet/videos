const apiKey = "769b31e4b3af7d5acf8d80400a54c556";
const videoContainer = document.getElementById("videoPlayers");

document.getElementById("searchButton").addEventListener("click", async () => {
  const query = document.getElementById("search").value;
  await fetchMovies(query);
});

async function fetchMovies(query) {
  videoContainer.innerHTML = "<p>Loading...</p>"; // Show loading message
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`
    );
    const data = await response.json();
    displayMovies(data.results);
  } catch (error) {
    console.error("Erreur:", error);
    videoContainer.innerHTML = "<p>Error loading movies.</p>"; // Error message
  }
}

function displayMovies(movies) {
  videoContainer.innerHTML = ""; // Clear previous results

  if (movies.length === 0) {
    videoContainer.innerHTML = "<p>No movies found.</p>";
    return; // No movies found
  }

  const movieCount = document.createElement("div");
  movieCount.className = "movie-count";
  movieCount.textContent = `${movies.length} film(s) trouvé(s)`;
  videoContainer.appendChild(movieCount);

  movies.forEach((movie) => {
    if (movie.title && movie.poster_path) {
      const movieElement = document.createElement("div");
      movieElement.className = "video-player";

      // Crée un div pour contenir l'affiche et la vidéo
      movieElement.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}" class="movie-poster">
        <div class="video-title">${movie.title}</div>
        <div class="video-list" id="videos-${movie.id}" style="display: none;"></div>
      `;

      videoContainer.appendChild(movieElement);

      // Ajoute un événement click sur l'affiche
      movieElement
        .querySelector(".movie-poster")
        .addEventListener("click", () => {
          const videoList = document.getElementById(`videos-${movie.id}`);
          if (videoList.style.display === "none") {
            fetchVideos(movie.id); // Récupère les vidéos si ce n'est pas déjà fait
            videoList.style.display = "block"; // Affiche la vidéo
          } else {
            videoList.style.display = "none"; // Masque la vidéo
          }
        });
    }
  });
}

async function fetchVideos(movieId) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`
    );
    const data = await response.json();
    displayVideos(data.results, movieId);
  } catch (error) {
    console.error("Erreur lors de la récupération des vidéos:", error);
  }
}

function displayVideos(videos, movieId) {
  const videoList = document.getElementById(`videos-${movieId}`);

  if (videos.length === 0) {
    videoList.innerHTML = "<p>No videos available.</p>";
    return; // No videos found
  }

  videoList.innerHTML = ""; // Vider les vidéos précédentes

  videos.forEach((video) => {
    if (video.site === "YouTube") {
      // Assurez-vous que la vidéo provient de YouTube
      const videoElement = document.createElement("div");
      videoElement.className = "video-item";

      // Créer un iframe pour intégrer la vidéo
      videoElement.innerHTML = `
        <iframe width="300" height="200" src="https://www.youtube.com/embed/${video.key}" 
                frameborder="0" allowfullscreen></iframe>
        <div>${video.name}</div>
      `;
      videoList.appendChild(videoElement);
    }
  });
}

// function MyFavorite(videos, moviesI)
// 