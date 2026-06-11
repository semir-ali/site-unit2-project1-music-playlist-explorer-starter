const SYSTEM_PROMPT = `You are a music curator writing a brief playlist description that captures the vibe and artistic vision.

Output format: 2-3 sentences, plain language, describe the overall mood and theme.

Constraints:
- Do not list individual songs separately.
- Focus on how the songs collectively create an artistic vision or mood.
- Mention the playlist name and creator naturally in context.`;

const FAILURE_MESSAGE = "Unable to generate description at this time.";

async function getPlaylistDescription(playlist) {
  try {
    // Build the user prompt with playlist information
    const songList = playlist.listOfSongs.map(song => `"${song.title}" by ${song.artist}`).join(", ");
    const userPrompt = `Playlist: "${playlist.playlistName}" by ${playlist.author}. Songs: ${songList}.`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
        }),
      },
    );

    if (!response.ok) {
      return FAILURE_MESSAGE;
    }

    const data = await response.json();
    const description = data.choices[0].message.content.trim();

    return description || FAILURE_MESSAGE;
  } catch (err) {
    console.error("getPlaylistDescription failed:", err);
    return FAILURE_MESSAGE;
  }
}
