// Play Button Functionality
document.getElementById('playBtn').addEventListener('click', () => {
    alert('Now playing your favorite movie! (This is a demo)');
});

// Login and Sign Up Button Functionality
document.getElementById('loginBtn').addEventListener('click', () => {
    alert('Login clicked! Add your login form or redirect logic here.');
});

document.getElementById('signupBtn').addEventListener('click', () => {
    alert('Sign Up clicked! Add your sign-up form or redirect logic here.');
});

// TMDb API Key
const apiKey = 'YOUR_API_KEY'; // Replace with your TMDb API key
const movieGrid = document.getElementById('movieGrid');
const tvGrid = document.getElementById('tvGrid');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');

// Fetch Content (Movies or TV Shows)
async function fetchContent(gridId, type = 'movie', query = null, endpoint = 'popular') {
    const grid = document.getElementById(gridId);
    let url = `https://api.themoviedb.org/3/${type}/${endpoint}?api_key=${apiKey}&language=en-US&page=1`;
    if (query) {
        url = `https://api.themoviedb.org/3/search/${type}?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(query)}&page=1`;
    }
    const response = await fetch(url);
    const data = await response.json();
    const items = data.results.slice(0, 16); // 16 items per section

    grid.innerHTML = '';
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('movie-item');
        itemElement.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w200${item.poster_path || '/default.jpg'}" alt="${item.title || item.name}">
            <p>${item.title || item.name}</p>
            <div class="movie-desc">${item.overview.slice(0, 100)}...</div>
        `;
        grid.appendChild(itemElement);
    });

    setupCarousel(gridId);
}

// Carousel Setup
function setupCarousel(gridId) {
    const grid = document.getElementById(gridId);
    const movieItems = grid.querySelectorAll('.movie-item');
    const itemWidth = movieItems[0].offsetWidth + 20;
    let currentIndex = movieItems.length;
    const totalItems = movieItems.length;

    const cloneFirstSet = Array.from(movieItems).map(item => item.cloneNode(true));
    const cloneLastSet = Array.from(movieItems).map(item => item.cloneNode(true));
    cloneFirstSet.forEach(clone => grid.appendChild(clone));
    cloneLastSet.reverse().forEach(clone => grid.insertBefore(clone, grid.firstChild));

    function updateCarousel(transition = true) {
        const offset = -currentIndex * itemWidth;
        grid.style.transition = transition ? 'transform 0.5s ease' : 'none';
        grid.style.transform = `translateX(${offset}px)`;

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

    const prevBtn = grid.parentElement.querySelector('.prev');
    const nextBtn = grid.parentElement.querySelector('.next');

    // Remove old listeners to avoid duplicates
    prevBtn.removeEventListener('click', prevBtn.handler);
    nextBtn.removeEventListener('click', nextBtn.handler);

    prevBtn.handler = () => {
        currentIndex--;
        updateCarousel();
    };
    nextBtn.handler = () => {
        currentIndex++;
        updateCarousel();
    };

    prevBtn.addEventListener('click', prevBtn.handler);
    nextBtn.addEventListener('click', nextBtn.handler);

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
    grid.parentElement.addEventListener('mouseenter', stopAutoPlay);
    grid.parentElement.addEventListener('mouseleave', startAutoPlay);
}

// Search Functionality
searchBtn.addEventListener('click', () => {
    if (searchInput.classList.contains('hidden')) {
        searchInput.classList.remove('hidden');
        searchInput.classList.add('visible');
        searchInput.focus();
    } else if (searchInput.value.trim()) {
        // Search both movies and TV shows
        fetchContent('movieGrid', 'movie', searchInput.value.trim());
        fetchContent('tvGrid', 'tv', searchInput.value.trim());
        searchInput.classList.remove('visible');
        searchInput.classList.add('hidden');
        searchInput.value = '';
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim()) {
        fetchContent('movieGrid', 'movie', searchInput.value.trim());
        fetchContent('tvGrid', 'tv', searchInput.value.trim());
        searchInput.classList.remove('visible');
        searchInput.classList.add('hidden');
        searchInput.value = '';
    }
});

// Load content on page load
fetchContent('movieGrid', 'movie').catch(err => console.error('Error fetching movies:', err));
fetchContent('tvGrid', 'tv', null, 'popular').catch(err => console.error('Error fetching TV shows:', err));