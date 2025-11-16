// Reusable custom overlay utilities
(function() {
  function createBaseModal() {
    let existing = document.getElementById('overlayRoot');
    if (existing) return existing;
    const root = document.createElement('div');
    root.id = 'overlayRoot';
    document.body.appendChild(root);
    return root;
  }

  function focusTrap(modal) {
    const focusable = modal.querySelectorAll('button, [href], input, select, textarea');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) closeBtn.click();
      } else if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
    setTimeout(() => first.focus(), 30);
  }

  function showConfirm({ title = 'Confirm', message = 'Are you sure?', confirmText = 'Confirm', cancelText = 'Cancel' } = {}) {
    return new Promise((resolve) => {
      const root = createBaseModal();
      const wrapper = document.createElement('div');
      wrapper.className = 'modal active';
      wrapper.setAttribute('role', 'dialog');
      wrapper.setAttribute('aria-modal', 'true');

      wrapper.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h2>${title}</h2>
            <button class="modal-close" aria-label="Close">&times;</button>
          </div>
          <div style="padding:1.5rem;">
            <p style="margin-bottom:1.5rem;">${message}</p>
            <div style="display:flex; gap:0.75rem; justify-content:flex-end; flex-wrap:wrap;">
              <button class="btn btn-secondary" data-action="cancel">${cancelText}</button>
              <button class="btn btn-danger" data-action="confirm">${confirmText}</button>
            </div>
          </div>
        </div>
      `;

      root.appendChild(wrapper);
      const close = () => {
        wrapper.classList.remove('active');
        setTimeout(() => wrapper.remove(), 200);
      };

      wrapper.addEventListener('click', (e) => {
        if (e.target === wrapper) {
          resolve(false);
          close();
        }
      });

      wrapper.querySelector('.modal-close').addEventListener('click', () => {
        resolve(false);
        close();
      });

      wrapper.querySelector('[data-action="cancel"]').addEventListener('click', () => {
        resolve(false);
        close();
      });

      wrapper.querySelector('[data-action="confirm"]').addEventListener('click', () => {
        resolve(true);
        close();
      });

      focusTrap(wrapper);
    });
  }

  // Expose globally
  window.showConfirm = showConfirm;
})();
