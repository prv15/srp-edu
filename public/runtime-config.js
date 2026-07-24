/*
 * TPS Education Cloud deployment setting.
 * Change only this URL when the API is hosted at a different location.
 * Do not place database credentials or other secrets in this browser file.
 */
const isLocalDevelopment = ["localhost", "127.0.0.1"].includes(window.location.hostname);

window.TPS_CONFIG = Object.freeze({
    API_URL: isLocalDevelopment
        ? "http://localhost:8000/api/v1"
        : "https://thetechservices.in/srp-edu/api/v1",
});
