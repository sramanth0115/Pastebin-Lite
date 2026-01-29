import React, { useState } from "react";
import axios from "axios";
import './App.css'

function App() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [pasteUrl, setPasteUrl] = useState("");
  const [viewedContent, setViewedContent] = useState("");

  /* CREATE PASTE */
  function createPaste() {
    axios
      .post("https://pastebin-lite-9qkg.onrender.com/api/pastes", {
        content: content,
        ttl_seconds: ttl ? Number(ttl) : null,
        max_views: maxViews ? Number(maxViews) : null
      })
      .then(function (response) {
        var data = response.data;
        if (data.url) {
          setPasteUrl("https://pastebin-lite-9qkg.onrender.com" + data.url);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  /* VIEW PASTE */
  function viewPaste() {
    axios
      .get(pasteUrl)
      .then(function (response) {
        var data = response.data;
        if (data.content) {
          setViewedContent(data.content);
        } else if (data.error) {
          setViewedContent(data.error);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  return (
    <div className="app-container">
      <h2 className="app-title">Pastebin Lite</h2>
  
      <textarea
        className="paste-textarea"
        rows="6"
        placeholder="Enter paste content"
        value={content}
        onChange={function (e) {
          setContent(e.target.value);
        }}
      />
  
      <div className="input-group">
        <input
          className="input-field"
          placeholder="TTL (seconds)"
          value={ttl}
          onChange={function (e) {
            setTtl(e.target.value);
          }}
        />
  
        <input
          className="input-field"
          placeholder="Max Views"
          value={maxViews}
          onChange={function (e) {
            setMaxViews(e.target.value);
          }}
        />
      </div>
  
      <button className="primary-btn" onClick={createPaste}>
        Create Paste
      </button>
  
      {pasteUrl && (
        <div className="result-card">
          <p className="label">Paste Link</p>
          <a
            className="paste-link"
            href={pasteUrl}
            target="_blank"
            rel="noreferrer"
          >
            {pasteUrl}
          </a>
  
          <button className="secondary-btn" onClick={viewPaste}>
            View Paste
          </button>
        </div>
      )}
  
      {viewedContent && (
        <div className="content-card">
          <h3 className="content-title">Paste Content</h3>
          <pre className="content-box">{viewedContent}</pre>
        </div>
      )}
    </div>
  );
  
}



export default App
