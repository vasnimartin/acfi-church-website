document.addEventListener('DOMContentLoaded', () => {
  // ====== CONFIG (REPLACE THESE) ======
  const CHANNEL_ID = 'UCKsgwxEAmwBaCnm0cagrLrA';            // your channel id
  const LATEST_PLAYLIST_ID = 'PLxxxxxxxxxxxxxxxx';    // preferred: your "Latest Sermons" playlist id
  const LATEST_VOD_ID = 'fj29MRo7uhE';                // fallback single video id (if no playlist)

  // ====== ELEMENTS (required) ======
  const player = document.getElementById('acfi-player');
  const badge  = document.getElementById('live-status');
  const watch  = document.getElementById('watch-on-yt');

  if (!player || !badge || !watch) {
    console.error('ACFI live switch: required elements not found. Check IDs in HTML.');
    return;
  }

  // ====== URLs ======
  const LIVE_WATCH_URL   = `https://www.youtube.com/channel/${CHANNEL_ID}/live`;
  const LIVE_EMBED_SRC   = `https://www.youtube-nocookie.com/embed/live_stream?channel=${CHANNEL_ID}&rel=0&modestbranding=1&playsinline=1`;

  const PLAYLIST_EMBED_SRC = LATEST_PLAYLIST_ID
    ? `https://www.youtube-nocookie.com/embed/videoseries?list=${LATEST_PLAYLIST_ID}&rel=0&modestbranding=1&playsinline=1`
    : null;

  const VOD_EMBED_SRC    = `https://www.youtube-nocookie.com/embed/${LATEST_VOD_ID}?rel=0&modestbranding=1&playsinline=1`;

  const OFFLINE_EMBED_SRC = PLAYLIST_EMBED_SRC || VOD_EMBED_SRC;
  const OFFLINE_WATCH_URL = LATEST_PLAYLIST_ID
    ? `https://www.youtube.com/playlist?list=${LATEST_PLAYLIST_ID}`
    : `https://www.youtube.com/watch?v=${LATEST_VOD_ID}`;

  // ====== Default immediately to latest sermon (so users never see a blank area) ======
  player.src   = OFFLINE_EMBED_SRC;
  badge.textContent = 'Latest Sermon';
  watch.href   = OFFLINE_WATCH_URL;

  // ====== Try live probe; if live, swap ======
  const oembed = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(LIVE_WATCH_URL)}`;

  fetch(oembed)
    .then(res => {
      if (res.ok) {
        player.src = LIVE_EMBED_SRC;
        badge.textContent = 'LIVE NOW';
        watch.href = LIVE_WATCH_URL;
      } else {
        // keep latest sermon already set
      }
    })
    .catch(() => {
      // network/CORS issue -> keep latest sermon already set
    });
});
