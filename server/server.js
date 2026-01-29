let db_obj 
let path = require('path')
let {open} = require('sqlite');
let {Database} = require('sqlite3');
let jwtToken = require('jsonwebtoken');
let bcrypt = require('bcrypt');
let cors = require('cors')
let express = require('express');
let app = express();
app.use(express.json()) 
app.use(cors());
const { nanoid } = require("nanoid");




const pastes = {};

app.get("/api/healthz", (req, res) => {
  res.status(200).json({ ok: true });
});

app.post("/api/pastes", (req, res) => {
  const { content, ttl_seconds, max_views } = req.body;

  if (!content || typeof content !== "string") {
    return res.status(400).json({ error: "content is required" });
  }

  const id = nanoid(8);

  pastes[id] = {
    content,
    createdAt: Date.now(),
    ttlSeconds: typeof ttl_seconds === "number" ? ttl_seconds : null,
    maxViews: typeof max_views === "number" ? max_views : null,

    views: 0
  };

  res.status(201).json({
    id,
    url: `/api/pastes/${id}`
  });
});

/* ---------------- VIEW PASTE ---------------- */
app.get("/api/pastes/:id", (req, res) => {
  const paste = pastes[req.params.id];

  if (!paste) {
    return res.status(404).json({ error: "Paste not found" });
  }

  // TTL check
  if (paste.ttlSeconds !== null) {
    const expired =
      Date.now() - paste.createdAt > paste.ttlSeconds * 1000;
    if (expired) {
      delete pastes[req.params.id];
      return res.status(404).json({ error: "Paste expired" });
    }
  }

  // View count check
  if (paste.maxViews !== null && paste.views >= paste.maxViews) {
    delete pastes[req.params.id];
    return res.status(404).json({ error: "Paste view limit reached" });
  }

  paste.views += 1;

  res.json({
    content: paste.content,
    views: paste.views
  });
});


app.get('/', (req, resp) => {
  resp.send("Server is running")
})

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`Pastebin-Lite running on port ${PORT}`)
);
