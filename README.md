# Scotland Borders Journal

A small static journal site for the family trip to Coldstream, Kelso, Blakelaw Farm, and Coldstream Civic Week.

It is designed as a surprise memory book for Ellis and Murray, with:

- a warm backstory section
- a day-by-day diary
- a replay mode for key moments
- a Thursday Flodden chapter
- placeholders for photos and videos
- a simple map-style journey view

## Publish On GitHub Pages

1. Create a new GitHub repository.
2. Upload or push everything in this folder.
3. In GitHub, open **Settings > Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/root`.
6. Save, then wait for GitHub to publish the site.

## Add Diary Entries

Edit `data/trip-data.js`. Each diary entry can include:

- `date`
- `time`
- `place`
- `title`
- `people`
- `quickNotes`
- `narrative`
- `media`

Put photos in `assets/photos/` and videos in `assets/videos/`, then reference them from `data/trip-data.js`.

Example:

```js
{
  date: "2026-08-06",
  time: "10:30",
  place: "Coldstream High Street",
  title: "Band, Guards, and Riders",
  people: ["Mike", "Sharon", "Ellis", "Murray", "Patrick"],
  quickNotes: "Watched the band, Coldstream Guards, and horses pass through the High Street.",
  narrative: "We watched them first in Coldstream, where the day belonged to the town...",
  media: [
    {
      type: "video",
      src: "assets/videos/coldstream-high-street-band.mp4",
      caption: "The band and Guards in Coldstream High Street"
    }
  ]
}
```

## Suggested Media Names

- `assets/videos/coldstream-high-street-band.mp4`
- `assets/videos/guards-and-riders-coldstream.mp4`
- `assets/videos/riders-crossing-bridge.mp4`
- `assets/videos/branxton-hill-charge.mp4`
- `assets/photos/flodden-packed-lunches.jpg`
- `assets/photos/ellis-and-murray-coldstream.jpg`

## Local Preview

Open `index.html` in a browser. No install step is needed.
