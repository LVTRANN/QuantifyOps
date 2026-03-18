export function showPage(id, opts) {
  window.showPage(id, opts);
}

export function showReportMenu() {
  document.getElementById('report-menu').style.display = 'block';
}

export function hideReportMenu() {
  setTimeout(() => document.getElementById('report-menu').style.display = 'none', 150);
}

// Expose to window for HTML onclick attrs
window.showPage = showPage;
window.showReportMenu = showReportMenu;
window.hideReportMenu = hideReportMenu;
