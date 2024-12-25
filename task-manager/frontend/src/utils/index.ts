export function convertRgb24ToCssHexString(rgbColor: number): string {
  return `#${rgbColor.toString(16).padStart(6, "0")}CC`;
}
