
let API_BASE_URL = "";

if (window.location.hostname === "localhost") {
  // Running locally
  API_BASE_URL = "http://localhost:8080";
} else {
  // Running on production (your deployed domain)
  API_BASE_URL = "https://3.108.53.35"; 
}
