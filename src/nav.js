import { state } from './state.js';

export function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  const tab = document.getElementById('tab-' + id);
  if (tab) tab.classList.add('active');
  if (id !== 'items' && window.showDupesOnly) { window.showDupesOnly = false; }
  if (id === 'dashboard') window.renderDashboard();
  if (id === 'items') window.renderItems();
  if (id === 'daily') window.renderDailyPage();
  if (id === 'report') window.setReportType(state.activeReportType);
  if (id === 'log') { window.updateLogFilters(); window.renderLog(); }
  if (id === 'docs') window.renderDocs();
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
