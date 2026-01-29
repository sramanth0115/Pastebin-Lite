const http = require("http");

const data = JSON.stringify({
  content: "Hello Sramanth from Node request",
  ttl_seconds: 60,
  max_views: 2
});

const options = {
  hostname: "localhost",
  port: 3000,
  path: "/api/pastes",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length
  }
};

const req = http.request(options, res => {
  let body = "";
  res.on("data", chunk => body += chunk);
  res.on("end", () => console.log(body));
});

req.on("error", err => console.error(err));
req.write(data);
req.end();
