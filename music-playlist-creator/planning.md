## Music Playlist Explorer — Planning Spec

### Data Shape
- Song object: 
  - title (string) - Title of the song
  - author (string) - Who made the song
  - duration (string) - How long the song is
- Playlist object:
  - playlistName (String) - Describing the name of the playlist
  - coverImage (Image) - Corresponding album image
  - likeCount (Integer) - Number of likes for the specific playlist
  - listOfSongs (Array): Array full of Song objects, which include the title, artist, and duration

### UI and Interaction Rules
On the home page, there should be two section: One, a Featured Pages button which, when clicked, will have the user see a random playlist on their screen, which includes its cover image, playlist name, and list of songs, and two, a All Playlist button which opens up a tile view of all playlists and their respective cover image, playlist name, author, and like count. For the latter view, if you click a playlist, it opens up a modal view (not taking up the whole screen) with the song's cover image, playlist name, author, and list of songs. In this modal view, the user can click a shuffle button which should shuffle all the songs on the playlist. Outside the modal view (in the all playlists view), the user can like/unlike each playlist, which increases/decreases the associated like count of the song. To open the modal view, open up the playlist tile you want to visit and, to exit, press the region outside of the modal view.

### Function Specs
cardCreation function spec:
What does this function take in?
This function takes in an array of playlist objects

What does it return or produce?
This returns nothing, but it creates playlist card elements to be displayed visually on the webpage

What DOM element does it append to?
This appends to the DOM element playlistCardsContainer

What fields from the playlist object does it use?
The fields the playlist object uses are playlist.coverImage, playlist.playlistName, playlist.author, and playlist.likeCount.

openModal function spec:
What does this function take in?
This function takes in a playlist object.

Which DOM elements does it update?
This updates the songList (represented by the class .songList) such that all of the songs and their metadata are displayed. Additionally, modalImage, modalTitle, modalCreator, modalOverlay are all modified

What should the modal look like when the function has finished running?
The modal should look like a white pop-up with a semi-transparent grey background to highlight the modal overlay. On the modal, there should be a title and the associated author along with a list of songs with their respective metadata associated with the album. 
What information needs to be present?
The album cover image, title, and author along with the list of songs and, for each song, the song's cover image, singer, album, and duration.
### AI Feature Spec (Milestone 8)
[Leave blank — fill in before Milestone 8]

### Decisions Log
Milestone 1:
For this milestone, I mainly needed to decide how I wanted to represent the header, main section, and footer. By the recommendation of Claude, I ultimately decided to use the HTML semantic type h1 since h1 should represent the largest element on my screen. From there, I decided that I needed to decide what made the most sense for representing the list of songs overall. I decided that it made more sense to use divs rather than sections/articles since all of the information for the playlist is connection. Each of the songs, for instance, needs an event handler for dealing with mouse clicks and each of the songs need all of their data stored into a map since they can change certain information (namely, like count). Finally, for the footer, I decided to just put a small paragraph text that says 2026 Music Playlist Explorer since this information is meant to not be too eyecatching, just like how the footer of a website is supposed to be. 

Milestone 2:
For this milestone, the main choices was deciding how I wanted to connect CSS to my website and make it seem a lot more responsive. My first thought was to use hover to change the highlighting of each of the albums and each of the songs. I figured that making the playlist/song translate upwards + highlighting them would make them more noticeable on the website. From there, I went on to working on Flexbox, which I wanted to use so the website was easier to use on different devices. I decided to center align the page using align-items/justify-center so the content is displayed at the center of the screen no matter how small your screen size is. 

Milestone 3:
For this milestone, the main decision was deciding what information made the most sense to be represented in the Song object vs. the Playlist object, and if there were any supplemental information that I may need. I ultimately decided to follow the requirements for the assignment since I found that, realistically, users should not feel overwhelmed by the information that they find inside of the playlist. Therefore, sticking with essentials like the albums cover image, name, and likes is sufficient enough for the user to know everything they need for the album. 

Milestone 4: 
For this milestone, I needed to again focus on how I should structure my modal view and how I could include information. Claude suggested that I should potentially include information like "Playlist Genre," but I found this information was slightly confusing and also unnecessary. Similar to Milestone 3, I tried to ensure all the information on the modal was as necessary as possible, including information like the playlist name, title, creator, like count, and cover image. This way, the user is able to get all the information they need to see when opening up the modal view. Especially with information such as the liking feature accessible in the modal view, the user will be able to better judge the songs on the playlist and how they fit into the playlist itself. 