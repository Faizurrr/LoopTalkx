

export const isOnboarded = () => {
  try {
    const rawUser = localStorage.getItem("user");

    // 1. Check if user string exists
    if (!rawUser) return false;

    // 2. Parse JSON safely
    const user = JSON.parse(rawUser);

    // 3. Return true if onboarded flag is true OR if profile languages are set
    return Boolean(
      user &&
      (user.isOnboarded === true ||
       user.onboarded === true ||
       Boolean(user.NativeLanguage && user.LearningLanguage))
    );
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
    // Remove corrupted data to prevent future errors
    localStorage.removeItem("user");
    return false;
  }
};