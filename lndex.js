// Play Button Functionality
document.getElementById('playBtn').addEventListener('click', () => {
    alert('Now playing your favorite movie! (This is a demo)');
});

// Fetch Movies from TMDb
const apiKey = 'YOUR_API_KEY'; // Replace with your TMDb API key
const movieGrid = document.getElementById('movieGrid');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

async function fetchMovies() {
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`);
    const data = await response.json();
    const movies = data.results.slice(0, 8); // Get first 8 movies

    // Clear existing items
    movieGrid.innerHTML = '';

    // Add movie items
    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');
        movieItem.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
            <p>${movie.title}</p>
            <div class="movie-desc">${movie.overview.slice(0, 100)}...</div>
        `;
        movieGrid.appendChild(movieItem);
    });

    // Setup infinite carousel with new items
    setupCarousel();
}

function setupCarousel() {
    const movieItems = document.querySelectorAll('.movie-item');
    const itemWidth = movieItems[0].offsetWidth + 20;
    let currentIndex = movieItems.length;
    const totalItems = movieItems.length;

    // Clone for infinite loop
    const cloneFirstSet = Array.from(movieItems).map(item => item.cloneNode(true));
    const cloneLastSet = Array.from(movieItems).map(item => item.cloneNode(true));
    cloneFirstSet.forEach(clone => movieGrid.appendChild(clone));
    cloneLastSet.reverse().forEach(clone => movieGrid.insertBefore(clone, movieGrid.firstChild));

    function updateCarousel(transition = true) {
        const offset = -currentIndex * itemWidth;
        movieGrid.style.transition = transition ? 'transform 0.5s ease' : 'none';
        movieGrid.style.transform = `translateX(${offset}px)`;

        const maxVisibleItems = 4;
        if (currentIndex >= totalItems * 2 - maxVisibleItems) {
            currentIndex = totalItems;
            setTimeout(() => updateCarousel(false), 500);
        } else if (currentIndex <= totalItems - maxVisibleItems) {
            currentIndex = totalItems;
            setTimeout(() => updateCarousel(false), 500);
        }
    }

    updateCarousel(false);

    nextBtn.addEventListener('click', () => {
        currentIndex++;
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex--;
        updateCarousel();
    });

    // Auto-play
    let autoPlayInterval;
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            currentIndex++;
            updateCarousel();
        }, 3000);
    }
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    startAutoPlay();
    movieGrid.parentElement.addEventListener('mouseenter', stopAutoPlay);
    movieGrid.parentElement.addEventListener('mouseleave', startAutoPlay);
}

// Load movies on page load
fetchMovies().catch(err => console.error('Error fetching movies:', err));