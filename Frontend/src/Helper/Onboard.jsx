

export const isOnboarded = () => {
  try {
    const rawUser = localStorage.getItem("user");

    // 1. Check if user string exists
    if (!rawUser) return false;

    // 2. Parse JSON safely
    const user = JSON.parse(rawUser);

    // 3. Return true only if user object exists and onboarded flag is strictly true
    return Boolean(user && (user.onboarded === true || user.isOnboarded === true));
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
    // Remove corrupted data to prevent future errors
    localStorage.removeItem("user");
    return false;
  }
};