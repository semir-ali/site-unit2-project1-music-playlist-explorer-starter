// Get modal elements
const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');

// Get all playlist cards
const cards = document.querySelectorAll('.card');

// Add click event to each card to open modal
cards.forEach(card => {
    card.addEventListener('click', () => {
        modalOverlay.classList.add('active');
    });
});

// Close modal when clicking on overlay (outside modal content)
modalOverlay.addEventListener('click', (event) => {
    // Only close if clicking on the overlay itself, not the modal content
    if (event.target === modalOverlay) {
        modalOverlay.classList.remove('active');
    }
});