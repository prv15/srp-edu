/*
 * TPS Education Cloud API setting for localhost and Vercel.
 * Local Vite uses the local PHP API; deployed builds use DirectAdmin.
 * Change the URLs here if either API location moves.
 * Do not place database credentials or other secrets in this browser file.
 */
const isLocalFrontend = ["localhost", "127.0.0.1"].includes(
    window.location.hostname,
);

window.TPS_CONFIG = Object.freeze({
    API_URL: isLocalFrontend
        ? "http://localhost:8000/api/v1"
        : "https://thetechservices.in/srp-edu/api/v1",
});
