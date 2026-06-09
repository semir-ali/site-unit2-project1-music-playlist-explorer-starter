// Get modal elements
const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');
const playlistCardsContainer = document.querySelector('.playlist-cards');

// Store playlist data
let playlistsData = [];

// Fetch and render playlists
fetch('data/data.json')
    .then(response => response.json())
    .then(data => {
        playlistsData = data;
        cardCreation(data);
    });

/**
 * cardCreation - Creates and displays playlist cards on the page
 * HIGH LEVEL EXPLANATION:
 * This function takes an array of playlist objects and creates a visual card for each one.
 * 1. Clear the workspace (empty the container)
 * 2. For each playlist, build a card piece by piece:
 *    - Create the card frame (div)
 *    - Add the cover image
 *    - Add the playlist name
 *    - Add the creator name
 *    - Add the likes section (heart icon + count)
 * 3. Make the card clickable (opens modal when clicked)
 * 4. Place the finished card on the page
 *
 * @param {Array} playlists - Array of playlist objects from JSON data
 */
function cardCreation(playlists) {
    playlistCardsContainer.innerHTML = '';

    playlists.forEach((playlist, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.playlistIndex = index;

        // Create card image
        const cardImage = document.createElement('div');
        cardImage.className = 'card-image';
        cardImage.style.backgroundImage = `url('${playlist.coverImage}')`;
        cardImage.style.backgroundSize = 'cover';
        cardImage.style.backgroundPosition = 'center';

        // Create title
        const title = document.createElement('h3');
        title.className = 'playlist-title';
        title.textContent = playlist.playlistName;

        // Create creator name
        const creator = document.createElement('p');
        creator.className = 'creator-name';
        creator.textContent = playlist.author;

        // Create likes section
        const likes = document.createElement('div');
        likes.className = 'likes';
        const heart = document.createElement('span');
        heart.className = 'heart';
        heart.textContent = '♥';
        const likeCount = document.createElement('span');
        likeCount.className = 'like-count';
        likeCount.textContent = playlist.likeCount;
        likes.appendChild(heart);
        likes.appendChild(likeCount);

        // Append all elements to card
        card.appendChild(cardImage);
        card.appendChild(title);
        card.appendChild(creator);
        card.appendChild(likes);

        // Add click event to open modal with this playlist's data
        card.addEventListener('click', () => {
            openModal(playlist);
        });

        playlistCardsContainer.appendChild(card);
    });
}

/**
 * openModal - Opens a modal popup with detailed playlist information
 * HIGH LEVEL EXPLANATION:
 * This function displays a popup window showing a playlist's details and all its songs.
 * 1. Update the modal header:
 *    - Set the playlist cover image
 *    - Set the playlist name
 *    - Set the creator name
 *    - Set the like count
 * 2. Clear out old songs (from previous modal views)
 * 3. For each song in the playlist, build a song row:
 *    - Create song thumbnail image
 *    - Add song title, artist, and album
 *    - Add song duration
 * 4. Make the modal visible on screen
 *
 * @param {Object} playlist - A single playlist object containing coverImage, playlistName, author, and listOfSongs
 */
function openModal(playlist) {
    // Update modal header
    const modalImage = modalContent.querySelector('.modal-image');
    const modalTitle = modalContent.querySelector('.modal-playlist-title');
    const modalCreator = modalContent.querySelector('.modal-creator-name');
    const modalLikeCount = modalContent.querySelector('.modal-like-count');

    modalImage.style.backgroundImage = `url('${playlist.coverImage}')`;
    modalImage.style.backgroundSize = 'cover';
    modalImage.style.backgroundPosition = 'center';
    modalTitle.textContent = playlist.playlistName;
    modalCreator.textContent = playlist.author;
    modalLikeCount.textContent = playlist.likeCount;

    // Update song list
    const songList = modalContent.querySelector('.song-list');
    songList.textContent = '';

    playlist.listOfSongs.forEach(song => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';

        // Create song image
        const songImage = document.createElement('div');
        songImage.className = 'song-image';
        songImage.style.backgroundImage = `url('${song.image}')`;
        songImage.style.backgroundSize = 'cover';
        songImage.style.backgroundPosition = 'center';

        // Create song details container
        const songDetails = document.createElement('div');
        songDetails.className = 'song-details';

        const songTitle = document.createElement('h4');
        songTitle.className = 'song-title';
        songTitle.textContent = song.title;

        const artistName = document.createElement('p');
        artistName.className = 'artist-name';
        artistName.textContent = song.artist;

        const albumName = document.createElement('p');
        albumName.className = 'album-name';
        albumName.textContent = song.album;

        songDetails.appendChild(songTitle);
        songDetails.appendChild(artistName);
        songDetails.appendChild(albumName);

        // Create duration
        const duration = document.createElement('span');
        duration.className = 'song-duration';
        duration.textContent = song.duration;

        // Append all to song item
        songItem.appendChild(songImage);
        songItem.appendChild(songDetails);
        songItem.appendChild(duration);

        songList.appendChild(songItem);
    });

    // Show modal
    modalOverlay.classList.add('active');
}

// Close modal when clicking on overlay (outside modal content)
modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
        modalOverlay.classList.remove('active');
    }
});
