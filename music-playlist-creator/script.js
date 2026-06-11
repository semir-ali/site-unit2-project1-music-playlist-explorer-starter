// Get modal elements
const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');
const playlistCardsContainer = document.querySelector('.playlist-cards');

// Store playlist data
let playlistsData = [];
let filteredPlaylists = [];
let currentSearchTerm = '';
let currentSortOption = 'default';

// Fetch and render playlists
fetch('data/data.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        // Add dateAdded field to each playlist if it doesn't exist
        // Loop through each playlist and add a date
        for (let i = 0; i < data.length; i++) {
            let playlist = data[i];

            // If playlist doesn't have a dateAdded, create one
            if (!playlist.dateAdded) {
                // Create dates spaced 1 day apart (older playlists get older dates)
                let daysAgo = (data.length - i) * 86400000; // 86400000 = 1 day in milliseconds
                playlist.dateAdded = new Date(Date.now() - daysAgo).toISOString();
            }

            playlistsData.push(playlist);
        }

        // Copy all playlists into filteredPlaylists
        filteredPlaylists = playlistsData.slice(); // .slice() creates a copy
        cardCreation(filteredPlaylists);
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
    // Clear all existing cards
    playlistCardsContainer.innerHTML = '';

    // Loop through each playlist and create a card for it
    for (let i = 0; i < playlists.length; i++) {
        let playlist = playlists[i];

        // Find the original index in playlistsData for proper edit/delete operations
        const originalIndex = playlistsData.indexOf(playlist);

        // Create card container
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.playlistIndex = originalIndex;

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

        // Create card actions (Edit/Delete buttons)
        const cardActions = document.createElement('div');
        cardActions.className = 'card-actions';

        const editButton = document.createElement('button');
        editButton.className = 'edit-button';
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent card click from firing
            openEditForm(playlist, originalIndex);
        });

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent card click from firing
            deletePlaylist(originalIndex);
        });

        cardActions.appendChild(editButton);
        cardActions.appendChild(deleteButton);

        // Append all elements to card
        card.appendChild(cardImage);
        card.appendChild(title);
        card.appendChild(creator);
        card.appendChild(likes);
        card.appendChild(cardActions);

        // Add click event to heart for liking/unliking
        heart.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent card click from firing
            toggleLike(playlist, heart, likeCount);
        });

        // Add click event to open modal with this playlist's data
        card.addEventListener('click', function() {
            openModal(playlist);
        });

        // Add the card to the page
        playlistCardsContainer.appendChild(card);
    }
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
        playlist.likeCount = playlist.likeCount - 1;
    } else {
        // Like: add class and increase count
        heartElement.classList.add('liked');
        playlist.likeCount = playlist.likeCount + 1;
    }

    // Update the displayed like count
    likeCountElement.textContent = playlist.likeCount;
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
    const modalHeart = modalContent.querySelector('.modal-heart');
    const modalLikeCount = modalContent.querySelector('.modal-like-count');

    modalImage.style.backgroundImage = `url('${playlist.coverImage}')`;
    modalImage.style.backgroundSize = 'cover';
    modalImage.style.backgroundPosition = 'center';
    modalTitle.textContent = playlist.playlistName;
    modalCreator.textContent = playlist.author;
    modalLikeCount.textContent = playlist.likeCount;

    // Sync modal heart with card heart state
    const playlistIndex = playlistsData.indexOf(playlist);
    const cardHeart = document.querySelector(`[data-playlist-index="${playlistIndex}"] .heart`);
    if (cardHeart && cardHeart.classList.contains('liked')) {
        modalHeart.classList.add('liked');
    } else {
        modalHeart.classList.remove('liked');
    }

    // Remove old event listener by cloning the node
    const newModalHeart = modalHeart.cloneNode(true);
    modalHeart.parentNode.replaceChild(newModalHeart, modalHeart);

    // Add new click event to modal heart for liking/unliking
    newModalHeart.addEventListener('click', function(event) {
        event.stopPropagation();
        toggleLike(playlist, newModalHeart, modalLikeCount);

        // Also update the card heart to keep them in sync
        const updatedCardHeart = document.querySelector(`[data-playlist-index="${playlistIndex}"] .heart`);
        const cardLikeCount = document.querySelector(`[data-playlist-index="${playlistIndex}"] .like-count`);

        if (updatedCardHeart) {
            if (newModalHeart.classList.contains('liked')) {
                updatedCardHeart.classList.add('liked');
            } else {
                updatedCardHeart.classList.remove('liked');
            }
        }

        if (cardLikeCount) {
            cardLikeCount.textContent = playlist.likeCount;
        }
    });

    // Update song list
    const songList = modalContent.querySelector('.song-list');
    songList.textContent = ''; // Clear old songs

    // Loop through each song and create a song item
    for (let i = 0; i < playlist.listOfSongs.length; i++) {
        let song = playlist.listOfSongs[i];

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
    }

    // Set up shuffle button
    const shuffleButton = modalContent.querySelector('.shuffle-button');
    const newShuffleButton = shuffleButton.cloneNode(true);
    shuffleButton.parentNode.replaceChild(newShuffleButton, shuffleButton);

    newShuffleButton.addEventListener('click', function() {
        shufflePlaylist(playlist);
    });

    // Set up AI description button
    const descriptionButton = modalContent.querySelector('.get-description-button');
    const descriptionSection = document.getElementById('ai-description-section');
    const descriptionOutput = modalContent.querySelector('.ai-description-output');
    const newDescriptionButton = descriptionButton.cloneNode(true);
    descriptionButton.parentNode.replaceChild(newDescriptionButton, descriptionButton);

    // Hide description section initially
    descriptionSection.style.display = 'none';
    descriptionOutput.textContent = '';

    newDescriptionButton.addEventListener('click', async function() {
        newDescriptionButton.disabled = true;

        // Show the description section and display loading message
        descriptionSection.style.display = 'block';
        descriptionOutput.textContent = 'Generating description…';

        const description = await getPlaylistDescription(playlist);

        descriptionOutput.textContent = description;
        newDescriptionButton.disabled = false;
    });

    // Show modal
    modalOverlay.classList.add('active');
}

/**
 * shufflePlaylist - Randomly shuffles the songs in a playlist
 * HIGH LEVEL EXPLANATION:
 * This function reorders the songs in a playlist randomly using the Fisher-Yates shuffle algorithm.
 * 1. Take the playlist's listOfSongs array
 * 2. Shuffle the array in place (randomly swap songs)
 * 3. Re-render the song list in the modal with the new order
 *
 * @param {Object} playlist - The playlist object whose songs will be shuffled
 */
function shufflePlaylist(playlist) {
    // Fisher-Yates shuffle algorithm
    const songs = playlist.listOfSongs;

    // Start from the end and work backwards
    for (let i = songs.length - 1; i > 0; i--) {
        // Pick a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));

        // Swap songs[i] with songs[j]
        let temp = songs[i];
        songs[i] = songs[j];
        songs[j] = temp;
    }

    // Re-render the song list with shuffled order
    const songList = modalContent.querySelector('.song-list');
    songList.textContent = ''; // Clear old songs

    // Loop through shuffled songs and display them
    for (let i = 0; i < playlist.listOfSongs.length; i++) {
        let song = playlist.listOfSongs[i];

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
    }
}

// Close modal when clicking on overlay (outside modal content)
modalOverlay.addEventListener('click', function(event) {
    if (event.target === modalOverlay) {
        modalOverlay.classList.remove('active');
    }
});

// === ADD/EDIT/DELETE PLAYLIST FUNCTIONALITY ===

// Get form elements
const formModalOverlay = document.getElementById('form-modal-overlay');
const formModalTitle = document.getElementById('form-modal-title');
const playlistForm = document.getElementById('playlist-form');
const addPlaylistButton = document.getElementById('add-playlist-button');
const cancelFormButton = document.getElementById('cancel-form-button');
const addSongButton = document.getElementById('add-song-button');
const songsContainer = document.getElementById('songs-container');

// Get delete modal elements
const deleteModalOverlay = document.getElementById('delete-modal-overlay');
const deleteModalMessage = document.getElementById('delete-modal-message');
const deleteConfirmButton = document.getElementById('delete-confirm-button');
const deleteCancelButton = document.getElementById('delete-cancel-button');

// Get search and sort elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const clearButton = document.getElementById('clear-button');
const sortSelect = document.getElementById('sort-select');

// Get validation modal elements
const validationModalOverlay = document.getElementById('validation-modal-overlay');
const validationOkButton = document.getElementById('validation-ok-button');

// Index keeps track of which part of the playlist you are editing/deleting
let editingPlaylistIndex = null;
let deletingPlaylistIndex = null;
let songCounter = 1;

// Open "Add Playlist" form
addPlaylistButton.addEventListener('click', function() {
    formModalTitle.textContent = 'Add New Playlist';
    editingPlaylistIndex = null;
    playlistForm.reset();
    resetSongsContainer();
    formModalOverlay.classList.add('active');
});

// Cancel form
cancelFormButton.addEventListener('click', function() {
    formModalOverlay.classList.remove('active');
});

// Close form when clicking outside
formModalOverlay.addEventListener('click', function(event) {
    if (event.target === formModalOverlay) {
        formModalOverlay.classList.remove('active');
    }
});

// Add another song to the form
addSongButton.addEventListener('click', function() {
    songCounter = songCounter + 1;

    // Create the song form container
    const songDiv = document.createElement('div');
    songDiv.className = 'song-form-item';
    songDiv.dataset.songIndex = songCounter - 1;

    // Create remove button
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'remove-song-button';
    removeButton.textContent = '×';

    // Create heading
    const heading = document.createElement('h4');
    heading.textContent = 'Song ' + songCounter;

    // Create song title label and input
    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Song Title *';
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'song-title';
    titleInput.required = true;

    // Create artist label and input
    const artistLabel = document.createElement('label');
    artistLabel.textContent = 'Artist *';
    const artistInput = document.createElement('input');
    artistInput.type = 'text';
    artistInput.className = 'song-artist';
    artistInput.required = true;

    // Create album label and input
    const albumLabel = document.createElement('label');
    albumLabel.textContent = 'Album *';
    const albumInput = document.createElement('input');
    albumInput.type = 'text';
    albumInput.className = 'song-album';
    albumInput.required = true;

    // Create duration label and input
    const durationLabel = document.createElement('label');
    durationLabel.textContent = 'Duration (MM:SS) *';
    const durationInput = document.createElement('input');
    durationInput.type = 'text';
    durationInput.className = 'song-duration';
    durationInput.placeholder = '3:45';
    durationInput.required = true;

    // Create image label and input
    const imageLabel = document.createElement('label');
    imageLabel.textContent = 'Cover Image URL *';
    const imageInput = document.createElement('input');
    imageInput.type = 'text';
    imageInput.className = 'song-image';
    imageInput.placeholder = 'assets/img/songimage.jpg';
    imageInput.required = true;

    // Append all elements to songDiv
    songDiv.appendChild(removeButton);
    songDiv.appendChild(heading);
    songDiv.appendChild(titleLabel);
    songDiv.appendChild(titleInput);
    songDiv.appendChild(artistLabel);
    songDiv.appendChild(artistInput);
    songDiv.appendChild(albumLabel);
    songDiv.appendChild(albumInput);
    songDiv.appendChild(durationLabel);
    songDiv.appendChild(durationInput);
    songDiv.appendChild(imageLabel);
    songDiv.appendChild(imageInput);

    // Add remove button functionality
    removeButton.addEventListener('click', function() {
        songDiv.remove();
        updateSongNumbers();
    });

    // Add the song form to the container
    songsContainer.appendChild(songDiv);
});

/**
 * resetSongsContainer - Resets the song form to have only 1 empty song
 * HIGH LEVEL EXPLANATION:
 * This function clears the song form back to its initial state.
 * 1. Reset the counter to 1
 * 2. Remove all extra song forms (keep only the first one)
 * 3. Clear all input fields in the first song form
 * This ensures a clean form whether adding a new playlist or editing an existing one.
 */
function resetSongsContainer() {
    songCounter = 1;

    // Get all song form items
    const allSongItems = songsContainer.querySelectorAll('.song-form-item');

    // Remove all song forms except the first one
    for (let i = 0; i < allSongItems.length; i++) {
        if (i > 0) {
            allSongItems[i].remove();
        }
    }

    // Clear first song inputs
    const firstSong = songsContainer.querySelector('.song-form-item');
    const allInputs = firstSong.querySelectorAll('input');
    for (let i = 0; i < allInputs.length; i++) {
        allInputs[i].value = '';
    }
}

/**
 * updateSongNumbers - Updates the song numbers after a song is removed
 * HIGH LEVEL EXPLANATION:
 * When a song is deleted from the form, this function renumbers all remaining songs.
 * Song 1, Song 3, Song 4 becomes Song 1, Song 2, Song 3
 */
function updateSongNumbers() {
    const songItems = songsContainer.querySelectorAll('.song-form-item');

    // Loop through and update each song's number
    for (let i = 0; i < songItems.length; i++) {
        let songNumber = i + 1; // Song numbers start at 1, not 0
        let heading = songItems[i].querySelector('h4');

        // First song is required (has *)
        if (i === 0) {
            heading.textContent = 'Song ' + songNumber + ' *';
        } else {
            heading.textContent = 'Song ' + songNumber;
        }

        songItems[i].dataset.songIndex = i;
    }

    songCounter = songItems.length;
}

// Handle form submission
playlistForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Stop form from refreshing the page

    // Collect playlist data
    const playlistName = document.getElementById('playlist-name').value.trim();
    const playlistAuthor = document.getElementById('playlist-author').value.trim();
    const playlistCover = document.getElementById('playlist-cover').value.trim();

    // Collect songs
    const songItems = songsContainer.querySelectorAll('.song-form-item');
    const songs = [];

    // Loop through each song form and collect the data
    for (let i = 0; i < songItems.length; i++) {
        let item = songItems[i];

        const title = item.querySelector('.song-title').value.trim();
        const artist = item.querySelector('.song-artist').value.trim();
        const album = item.querySelector('.song-album').value.trim();
        const duration = item.querySelector('.song-duration').value.trim();
        const image = item.querySelector('.song-image').value.trim();

        // Only add song if all fields are filled
        if (title && artist && album && duration && image) {
            songs.push({
                title: title,
                artist: artist,
                album: album,
                duration: duration,
                image: image
            });
        }
    }

    // Validate at least one song
    if (songs.length === 0) {
        validationModalOverlay.classList.add('active');
        return; // Stop here, don't create the playlist
    }

    // Create playlist object
    const newPlaylist = {
        playlistName: playlistName,
        author: playlistAuthor,
        coverImage: playlistCover,
        likeCount: 0,
        dateAdded: new Date().toISOString(),
        listOfSongs: songs
    };

    // Check if we're editing or adding a new playlist
    if (editingPlaylistIndex !== null) {
        // Update existing playlist - preserve original dateAdded
        let oldDateAdded = playlistsData[editingPlaylistIndex].dateAdded;
        playlistsData[editingPlaylistIndex] = newPlaylist;
        playlistsData[editingPlaylistIndex].dateAdded = oldDateAdded;
    } else {
        // Add new playlist
        playlistsData.push(newPlaylist);
    }

    // Re-render cards with current filters
    filterAndSortPlaylists();

    // Close form
    formModalOverlay.classList.remove('active');
});

/**
 * openEditForm - Opens the form modal with existing playlist data
 * HIGH LEVEL EXPLANATION:
 * This function fills the form with a playlist's current data so you can edit it.
 * 1. Change the form title to "Edit Playlist"
 * 2. Remember which playlist we're editing
 * 3. Fill in the playlist name, author, and cover image
 * 4. Clear the song forms and add one form for each song
 * 5. Fill in each song's data
 * 6. Show the form modal
 */
function openEditForm(playlist, index) {
    formModalTitle.textContent = 'Edit Playlist';
    editingPlaylistIndex = index;

    // Fill in playlist data
    document.getElementById('playlist-name').value = playlist.playlistName;
    document.getElementById('playlist-author').value = playlist.author;
    document.getElementById('playlist-cover').value = playlist.coverImage;

    // Reset song forms to just one empty form
    resetSongsContainer();

    // Add a form for each song and fill it in
    for (let i = 0; i < playlist.listOfSongs.length; i++) {
        let song = playlist.listOfSongs[i];

        // If this is not the first song, add another song form
        if (i > 0) {
            addSongButton.click();
        }

        // Get the song form we just created (or the first one)
        const allSongForms = songsContainer.querySelectorAll('.song-form-item');
        const songItem = allSongForms[i];

        // Fill in the song data
        songItem.querySelector('.song-title').value = song.title;
        songItem.querySelector('.song-artist').value = song.artist;
        songItem.querySelector('.song-album').value = song.album;
        songItem.querySelector('.song-duration').value = song.duration;
        songItem.querySelector('.song-image').value = song.image;
    }

    // Show the form modal
    formModalOverlay.classList.add('active');
}

/**
 * deletePlaylist - Opens the delete confirmation modal
 * HIGH LEVEL EXPLANATION:
 * Before deleting a playlist, we show a confirmation modal to make sure the user really wants to delete it.
 * This function remembers which playlist to delete and shows the confirmation popup.
 */
function deletePlaylist(index) {
    deletingPlaylistIndex = index;
    const playlist = playlistsData[index];
    deleteModalMessage.textContent = `Are you sure you want to delete "${playlist.playlistName}"?`;
    deleteModalOverlay.classList.add('active');
}

// Confirm delete action
deleteConfirmButton.addEventListener('click', function() {
    if (deletingPlaylistIndex !== null) {
        // Remove the playlist from the array
        playlistsData.splice(deletingPlaylistIndex, 1);

        // Re-render the cards
        filterAndSortPlaylists();

        // Reset the deleting index
        deletingPlaylistIndex = null;
    }

    // Close the modal
    deleteModalOverlay.classList.remove('active');
});

// Cancel delete action
deleteCancelButton.addEventListener('click', function() {
    deletingPlaylistIndex = null;
    deleteModalOverlay.classList.remove('active');
});

// Close delete modal when clicking outside
deleteModalOverlay.addEventListener('click', function(event) {
    if (event.target === deleteModalOverlay) {
        deletingPlaylistIndex = null;
        deleteModalOverlay.classList.remove('active');
    }
});

// === SEARCH AND SORT FUNCTIONALITY ===

/**
 * filterAndSortPlaylists - Filters and sorts playlists based on search term and sort option
 * HIGH LEVEL EXPLANATION:
 * This function applies both search filtering and sorting to the playlist data.
 * 1. Start with all playlists
 * 2. Filter by search term (if any) - checks playlist name and author
 * 3. Sort based on selected option (name or author, A-Z or Z-A, likes, or date)
 * 4. Re-render the cards with the filtered and sorted results
 */
function filterAndSortPlaylists() {
    // Start with a copy of all playlists
    let result = [];
    for (let i = 0; i < playlistsData.length; i++) {
        result.push(playlistsData[i]);
    }

    // Apply search filter if there's a search term
    if (currentSearchTerm) {
        let filteredResult = [];

        // Check each playlist to see if it matches the search
        for (let i = 0; i < result.length; i++) {
            let playlist = result[i];

            // Convert to lowercase for case-insensitive search
            let playlistNameLower = playlist.playlistName.toLowerCase();
            let authorLower = playlist.author.toLowerCase();
            let searchLower = currentSearchTerm.toLowerCase();

            // Check if the search term is in the name OR author
            let nameMatch = playlistNameLower.includes(searchLower);
            let authorMatch = authorLower.includes(searchLower);

            if (nameMatch || authorMatch) {
                filteredResult.push(playlist);
            }
        }

        result = filteredResult;
    }

    // Apply sorting based on the selected option
    // Sort by playlist name A-Z
    if (currentSortOption === 'name-az') {
        result.sort(function(playlist1, playlist2) {
            let name1 = playlist1.playlistName.toLowerCase();
            let name2 = playlist2.playlistName.toLowerCase();

            if (name1 < name2) return -1;  // playlist1 comes first
            if (name1 > name2) return 1;   // playlist2 comes first
            return 0;                      // they're equal
        });
    }
    // Sort by playlist name Z-A
    else if (currentSortOption === 'name-za') {
        result.sort(function(playlist1, playlist2) {
            let name1 = playlist1.playlistName.toLowerCase();
            let name2 = playlist2.playlistName.toLowerCase();

            if (name1 > name2) return -1;  // playlist1 comes first (reversed)
            if (name1 < name2) return 1;   // playlist2 comes first (reversed)
            return 0;
        });
    }
    // Sort by author A-Z
    else if (currentSortOption === 'author-az') {
        result.sort(function(playlist1, playlist2) {
            let author1 = playlist1.author.toLowerCase();
            let author2 = playlist2.author.toLowerCase();

            if (author1 < author2) return -1;
            if (author1 > author2) return 1;
            return 0;
        });
    }
    // Sort by author Z-A
    else if (currentSortOption === 'author-za') {
        result.sort(function(playlist1, playlist2) {
            let author1 = playlist1.author.toLowerCase();
            let author2 = playlist2.author.toLowerCase();

            if (author1 > author2) return -1;
            if (author1 < author2) return 1;
            return 0;
        });
    }
    // Sort by number of likes (highest first)
    else if (currentSortOption === 'likes-desc') {
        result.sort(function(playlist1, playlist2) {
            // Subtract to get bigger numbers first
            return playlist2.likeCount - playlist1.likeCount;
        });
    }
    // Sort by date added (newest first)
    else if (currentSortOption === 'date-desc') {
        result.sort(function(playlist1, playlist2) {
            // Convert date strings to Date objects for comparison
            let date1 = new Date(playlist1.dateAdded);
            let date2 = new Date(playlist2.dateAdded);

            // Subtract to get newer dates first
            return date2 - date1;
        });
    }
    // 'default' option - keep original order, do nothing

    // Update filtered playlists and re-render cards
    filteredPlaylists = result;
    cardCreation(filteredPlaylists);
}

// Search button click event
searchButton.addEventListener('click', function() {
    currentSearchTerm = searchInput.value.trim();
    filterAndSortPlaylists();
});

// Search on Enter key press
searchInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        currentSearchTerm = searchInput.value.trim();
        filterAndSortPlaylists();
    }
});

// Clear button click event
clearButton.addEventListener('click', function() {
    searchInput.value = '';
    currentSearchTerm = '';
    filterAndSortPlaylists();
});

// Sort dropdown change event
sortSelect.addEventListener('change', function() {
    currentSortOption = sortSelect.value;
    filterAndSortPlaylists();
});

// Close validation modal - OK button
validationOkButton.addEventListener('click', function() {
    validationModalOverlay.classList.remove('active');
});

// Close validation modal - click outside
validationModalOverlay.addEventListener('click', function(event) {
    if (event.target === validationModalOverlay) {
        validationModalOverlay.classList.remove('active');
    }
});
