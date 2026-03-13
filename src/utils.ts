export function setCurrentYear(spanId: string): void {
  const el = document.getElementById(spanId);
  if (el) {
    el.textContent = new Date().getFullYear().toString();
  }
}

