// script.js — robust tab logic with accessibility + keyboard support
document.addEventListener('DOMContentLoaded', () => {
  const tabs = Array.from(document.querySelectorAll('.tab-btn'));
  const panels = Array.from(document.querySelectorAll('.tab-content'));

  if (!tabs.length || !panels.length) return;

  function activateTab(tab) {
    const targetId = tab.dataset.tab;
    // deactivate all tabs & panels
    tabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
    });
    panels.forEach(p => {
      p.classList.remove('active');
      p.setAttribute('aria-hidden', 'true');
    });

    // activate chosen tab & panel
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');
    tab.focus();

    const panel = document.getElementById(targetId);
    if (panel) {
      panel.classList.add('active');
      panel.setAttribute('aria-hidden', 'false');
    }

    // update URL hash (without page jump)
    if (history.replaceState) {
      history.replaceState(null, '', '#' + targetId);
    } else {
      location.hash = targetId;
    }
  }

  // click + keyboard support
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (e) => {
      let newIndex = null;
      if (e.key === 'ArrowRight' || e.key === 'Right') newIndex = (index + 1) % tabs.length;
      if (e.key === 'ArrowLeft' || e.key === 'Left') newIndex = (index - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') newIndex = 0;
      if (e.key === 'End') newIndex = tabs.length - 1;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateTab(tab);
        return;
      }
      if (newIndex !== null) {
        e.preventDefault();
        tabs[newIndex].focus();
      }
    });
  });

  // Initialize: if URL hash present, open that tab; else open the first
  const initialHash = location.hash.replace('#', '');
  const initialTab = tabs.find(t => t.dataset.tab === initialHash);
  if (initialHash && initialTab) {
    activateTab(initialTab);
  } else {
    // ensure first tab is active if none active
    const firstActive = tabs.find(t => t.classList.contains('active'));
    if (firstActive) activateTab(firstActive);
    else activateTab(tabs[0]);
  }
});
