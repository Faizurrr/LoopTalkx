export const isAuthenticated = () => {
  const token = localStorage.getItem("token");

  // 1. Check if token exists
  if (!token) return false;

  try {
    // 2. Decode JWT payload (Part 2 of header.payload.signature)
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return false; // Not a valid JWT structure

    // Parse base64 payload to JSON
    const decodedPayload = JSON.parse(atob(payloadBase64));

    // 3. Check token expiration (`exp` is in seconds, Date.now() in milliseconds)
    if (decodedPayload.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedPayload.exp < currentTime) {
        // Token has expired -> Clean up
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return false;
      }
    }

    return true; // Token exists, valid format, and not expired
  } catch (error) {
    console.error("Invalid token format:", error);
    localStorage.removeItem("token");
    return false;
  }
};