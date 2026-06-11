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
This updates the songList (represented by the class .songList) such that all of the songs and their metadata are displayed. Additionally, modalImage, modalTitle, modalCreator, modalOverlay are all modified.

What should the modal look like when the function has finished running?
The modal should look like a white pop-up with a semi-transparent grey background to highlight the modal overlay. On the modal, there should be a title and the associated author along with a list of songs with their respective metadata associated with the album. 
What information needs to be present?
The album cover image, title, and author along with the list of songs and, for each song, the song's cover image, singer, album, and duration.

toggleLike function spec:
What happens when a previously unliked playlist is liked? What changes in the data model? What changes in the DOM?
When an unliked playlist is like, the likeCount associated with the playlist increases by one and this specifically happens inside of the playlistsData array (this is a data model change). For the DOM changes, the heart adds a "liked" class, which makes the heart highlighted. The like-count span's text content also is updated to show the new increased like count.

What happens when a previously liked playlist is unliked? What changes in the data model? What changes in the DOM?
The playlist.likeCount in this case decreases by 1 and this removes a specifically happens inside of the playlistsData array (this is a data model change). For the DOM changes, the heart removes the "like" class so the heart is no longer highlighted. The like-count span's text content also is updated to show the new decreased like count.

What constraint ensures a user can only like a playlist once at a time?
The constraint is checking if the "like" class is added to the playlist or not. If a class has the "like" CSS class, that means that it has been liked by the user visually already and therefore cannot like a post twice.

shufflePlaylist function spec:
What does this function take in?
This function should take a playlist

What does it return?
This returns nothing

Should the original song order be preserved anywhere, and if so, how?
The original song order should preserved via HTML when a user opens up the album. Therefore, whenever the page reloads, the album order will always be the same. 

What does the UI look like after shuffling?
The modal song list will display the songs in a new random order, with all the same songs still present but slightly reordered and the playlist name/creator/cover/likes staying unchanged. 

What should happen when the user clicks shuffle multiple times?
There should be a new random arrangement, but the random arrangement can still theoretically be the same as the current arrangement. Therefore, the user clicking shuffle will repeatedly change the order of the songs.
### Featured Page
1. The layout of the page — what sections exist, what goes where.
For the layout for my "Featured" Page, I want there to be a left aligned box with the playlist name, cover image, and like count. To the right of this, I want the individual songs with their title, author, album, and duration. I still want to have the header and footer to this page however to keep the UI consistent between this and "All Playlists."

2. A function spec for your random playlist selection function: what does it take in, what does it return, and when does it run?
randomizePlaylistSection function spec:
What does it take it?
It takes in an array of playlist objects.

What does it return?
A random playlist from this array of playlist objects.

3. How navigation between the Featured page and the All Playlists page will work.
There should be two buttons on the UI, one that says "Featured Page" and one that says "All Playlists." Only one button can be "active" at a time (meaning its color changes from being a lighter blue to a darker black to indicate that it is currently active).

getPlaylistDescription function spec:
What does this function take in?
This function takes in a playlist object

What does it return?
It returns a 2-3 sentence text summary describing the playlist's context (i.e. name, who created it), songs, and how these songs create some sort of artistic vision for the playlist.

What API does it call and with what prompt structure?
What happens on error?

### AI Feature Spec (Milestone 8)
Role: What role should the model play?
The model should be sort of like a summarizer. It is able to look through the playlist's information (i.e. the playlist titles and its associated songs) and generate a summarize it based on that data. This requires using Natural Language Processing since the robot model needs to read the information about the playlist and generate a summary based on that. 

Task: What is the model being asked to do? (generating a description for a music playlist based on its name, author, and song list)
The model is generating a description for the music playlist based on its name, author, and song list

Inputs: What playlist data will you pass to the model?
It needs information about the playlist name, author, and its associated song list names.

Output format: What should the response look like? (e.g., 2–3 sentence description that captures the vibe and theme of the playlist)
The response should be a 2-3 sentence description going over the playlist's basic information, including who made it, its name, its songs, and what the author was most likely going for connecting all these songs together. 

Constraints: What should the model avoid? (e.g., don't list the songs individually, don't use generic marketing language)
The model should avoid going too much into depth about an individual song, since this is meant to go over the entire playlist. Each of the songs build a puzzle piece to the whole playlist's vibe so it is important to stick with only naming songs and describing how they collectively build a picture for the album.

Failure behavior: What should the UI show if the API call fails or the model doesn't respond?
The UI should show "Unable to generate description at this time."

### Decisions Log
Milestone 1:
For this milestone, I mainly needed to decide how I wanted to represent the header, main section, and footer. By the recommendation of Claude, I ultimately decided to use the HTML semantic type h1 since h1 should represent the largest element on my screen. From there, I decided that I needed to decide what made the most sense for representing the list of songs overall. I decided that it made more sense to use divs rather than sections/articles since all of the information for the playlist is connection. Each of the songs, for instance, needs an event handler for dealing with mouse clicks and each of the songs need all of their data stored into a map since they can change certain information (namely, like count). Finally, for the footer, I decided to just put a small paragraph text that says 2026 Music Playlist Explorer since this information is meant to not be too eyecatching, just like how the footer of a website is supposed to be. 

Milestone 2:
For this milestone, the main choices was deciding how I wanted to connect CSS to my website and make it seem a lot more responsive. My first thought was to use hover to change the highlighting of each of the albums and each of the songs. I figured that making the playlist/song translate upwards + highlighting them would make them more noticeable on the website. From there, I went on to working on Flexbox, which I wanted to use so the website was easier to use on different devices. I decided to center align the page using align-items/justify-center so the content is displayed at the center of the screen no matter how small your screen size is. 

Milestone 3:
For this milestone, the main decision was deciding what information made the most sense to be represented in the Song object vs. the Playlist object, and if there were any supplemental information that I may need. I ultimately decided to follow the requirements for the assignment since I found that, realistically, users should not feel overwhelmed by the information that they find inside of the playlist. Therefore, sticking with essentials like the albums cover image, name, and likes is sufficient enough for the user to know everything they need for the album. 

Milestone 4: 
For this milestone, I needed to again focus on how I should structure my modal view and how I could include information. Claude suggested that I should potentially include information like "Playlist Genre," but I found this information was slightly confusing and also unnecessary. Similar to Milestone 3, I tried to ensure all the information on the modal was as necessary as possible, including information like the playlist name, title, creator, like count, and cover image. This way, the user is able to get all the information they need to see when opening up the modal view. Especially with information such as the liking feature accessible in the modal view, the user will be able to better judge the songs on the playlist and how they fit into the playlist itself. 

Milestone 5:
For this milestone, I needed to decide how I wanted the like feature look like visually on the website. I decided to make the like button a transparent heart which the user can click on both for the grid view and also for the modal view. By doing this, I am able to show visually that a playlist is liked or not. To add to this, I needed to find a way to internally prevent the user from liking a post twice and I ultimately decided to add the safeguard that through adding a "liked" class which both highlights the heart for the song the user is playing and prevents the user from increasing the likes more than that.

Milestone 6:
For this milestone, I needed to consider how I wanted to actually shuffle the songs. I realized the easiest way for me to do this is to first logically change the order of the songs using a sorting algorithm, and from there going through the array of playlists to display them on the frontend in the website. Therefore, all the songs will be randomized on the website both logically and graphically. I also needed to consider whether it made sense for there to be a set order for album's songs whenever a user opens up the website (i.e. a preserved original order). I decided this would make the most sense because, when a user creates a playlist, their order for songs is very important. Therefore, I keep an original playlist order before the user clicks shuffle on the playlist. 

Milestone 7:
For this milestone, I needed to consider what information I wanted to include on the "Featured" Page. I knew for sure that I needed the playlist's image, name, and its songs with their titles, author, album, and duration. However, there were minor information (i.e. footers, like count) that I was not sure if I wanted to include. Ultimately, from a design perspective, I decided to keep like count information on the "Featured" Page for the respective album because I know if a user is visiting the "Featured" Page, they most likely may want to like a song on the page after visiting it. This does, however, introduce the limitation that liking a playlist on the Featured Page will not represent that on the "All Playlist" page. Since I am unable to use React to keep information consistent, this means the like count will be inconsistent between the two pages. However, since this functionality does not exist for reloading the "All Playlist" page, this should be fine functionality. Additionally, to keep branding consistent between the two pages, I decided to keep the footer for the "Featured" page.

Milestone 8:
For this milestone, I needed to determine what information was necessary from the AI agent to generate and what information I needed to ask the agent as well. I decided the best course of action for this would be giving the Agent context on the restraints I wanted it to have, which I decided was similar to what was expected where the AI shouldn't just be listing out songs and going over the entire playlist and giving a summary based on that. From there, I also adjusted my prompt such that the agent was giving back a 2-3 sentence description of the playlist itself so the user has a general gist about what the playlist's features include. I specifically added in the prompt "Focus on how the songs collectively create an artistic vision or mood" so the result could emphasize this idea of having a vision/mood described in the website.