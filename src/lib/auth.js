export const isLoggedIn = () => {
  if (typeof window === "undefined") return false;

  const user = localStorage.getItem("auth_user");
  return !!user;
};