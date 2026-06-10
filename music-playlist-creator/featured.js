// Store playlist data
let playlistsData = [];

// Fetch and display random playlist
fetch('data/data.json')
    .then(response => response.json())
    .then(data => {
        playlistsData = data;
        const randomPlaylist = randomizePlaylistSelection(data);
        displayFeaturedPlaylist(randomPlaylist);
    });

/**
 * randomizePlaylistSelection - Selects a random playlist from an array
 * HIGH LEVEL EXPLANATION:
 * This function picks one playlist randomly from all available playlists.
 * 1. Generate a random number between 0 and array length
 * 2. Use that number as the index to select a playlist
 * 3. Return the selected playlist
 *
 * @param {Array} playlists - Array of playlist objects
 * @returns {Object} - A randomly selected playlist object
 */
function randomizePlaylistSelection(playlists) {
    const randomIndex = Math.floor(Math.random() * playlists.length);
    return playlists[randomIndex];
}

/**
 * displayFeaturedPlaylist - Displays a playlist in the Featured section
 * HIGH LEVEL EXPLANATION:
 * This function renders a single playlist on the Featured page.
 * 1. Update left side with playlist info (image, title, likes)
 * 2. Clear the song list
 * 3. For each song, create a song item with all details
 * 4. Display all songs on the right side
 *
 * @param {Object} playlist - The playlist to display
 */
function displayFeaturedPlaylist(playlist) {
    // Update left side - playlist info
    const featuredImage = document.querySelector('.featured-image');
    const featuredTitle = document.querySelector('.featured-title');
    const featuredHeart = document.querySelector('.featured-likes .heart');
    const featuredLikeCount = document.querySelector('.featured-likes .like-count');

    featuredImage.style.backgroundImage = `url('${playlist.coverImage}')`;
    featuredTitle.textContent = playlist.playlistName;
    featuredLikeCount.textContent = playlist.likeCount;

    // Add like functionality to featured heart
    featuredHeart.addEventListener('click', () => {
        toggleLike(playlist, featuredHeart, featuredLikeCount);
    });

    // Update right side - song list
    const featuredSongList = document.querySelector('.featured-song-list');
    featuredSongList.textContent = '';

    playlist.listOfSongs.forEach(song => {
        const songItem = document.createElement('div');
        songItem.className = 'featured-song-item';

        // Create song image
        const songImage = document.createElement('div');
        songImage.className = 'featured-song-image';
        songImage.style.backgroundImage = `url('${song.image}')`;

        // Create song details
        const songDetails = document.createElement('div');
        songDetails.className = 'featured-song-details';

        const songTitle = document.createElement('h4');
        songTitle.className = 'featured-song-title';
        songTitle.textContent = song.title;

        const songArtist = document.createElement('p');
        songArtist.className = 'featured-song-artist';
        songArtist.textContent = song.artist;

        const songAlbum = document.createElement('p');
        songAlbum.className = 'featured-song-album';
        songAlbum.textContent = song.album;

        songDetails.appendChild(songTitle);
        songDetails.appendChild(songArtist);
        songDetails.appendChild(songAlbum);

        // Create duration
        const duration = document.createElement('span');
        duration.className = 'featured-song-duration';
        duration.textContent = song.duration;

        // Append all to song item
        songItem.appendChild(songImage);
        songItem.appendChild(songDetails);
        songItem.appendChild(duration);

        featuredSongList.appendChild(songItem);
    });
}

/**
 * toggleLike - Increases or decreases the like count for a playlist
 * HIGH LEVEL EXPLANATION:
 * This function handles when a user clicks the heart icon on a playlist.
 * 1. Check if the heart is already liked (has 'liked' class)
 * 2. If liked:
 *    - Remove 'liked' class (make heart transparent again)
 *    - Decrease like count by 1
 * 3. If not liked:
 *    - Add 'liked' class (fill heart with red)
 *    - Increase like count by 1
 * 4. Update the displayed like count on screen
 *
 * @param {Object} playlist - The playlist object being liked/unliked
 * @param {HTMLElement} heartElement - The heart icon element
 * @param {HTMLElement} likeCountElement - The element displaying the like count
 */
function toggleLike(playlist, heartElement, likeCountElement) {
    // Check if already liked
    if (heartElement.classList.contains('liked')) {
        // Unlike: remove class and decrease count
        heartElement.classList.remove('liked');
        playlist.likeCount--;
    } else {
        // Like: add class and increase count
        heartElement.classList.add('liked');
        playlist.likeCount++;
    }

    // Update the displayed like count
    likeCountElement.textContent = playlist.likeCount;
}
