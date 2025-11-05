export function convertRgb24ToCssHexString(rgbColor: number): string {
  return `#${rgbColor.toString(16).padStart(6, "0")}CC`;
}

export function getAuthHeaders(): { Authorization: string } {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    alert("You're currently logged out. Please login.");
    throw new Error();
  }

  return { Authorization: `Bearer ${accessToken}` };
}
