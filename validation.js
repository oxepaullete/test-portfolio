/**
 * validation.js
 * Bootstrap 5.3 form validation for the Contact Modal
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════
     1. ELEMENT REFERENCES
  ═══════════════════════════════════════════════════ */
  const form        = document.getElementById('contactForm');
  const submitBtn   = document.getElementById('submitBtn');
  const msgField    = document.getElementById('contactMessage');
  const charCounter = document.getElementById('charCounter');
  const modalEl     = document.getElementById('contactModal');

  // Guard: required elements must exist
  if (!form || !submitBtn) return;

  /* ═══════════════════════════════════════════════════
     2. CHARACTER COUNTER (LIVE FEEDBACK)
  ═══════════════════════════════════════════════════ */
  if (msgField && charCounter) {
    msgField.addEventListener('input', function () {
      const length = msgField.value.trim().length;

      charCounter.textContent = `${length} / 20 min`;

      // Visual state
      if (length >= 20) {
        charCounter.classList.add('valid');
        charCounter.classList.remove('invalid-count');
        msgField.setCustomValidity('');
      } else {
        charCounter.classList.remove('valid');
        charCounter.classList.add('invalid-count');
      }

      // Re-validate if form was already validated
      if (form.classList.contains('was-validated')) {
        enforceMessageLength();
      }
    });
  }

  /* ═══════════════════════════════════════════════════
     3. VALIDATION LOGIC
  ═══════════════════════════════════════════════════ */
  function enforceMessageLength() {
    if (!msgField) return;

    const trimmed = msgField.value.trim();

    if (trimmed.length > 0 && trimmed.length < 20) {
      msgField.setCustomValidity('Message must be at least 20 characters.');
    } else {
      msgField.setCustomValidity('');
    }
  }

  /* ═══════════════════════════════════════════════════
     4. SUBMIT HANDLER
  ═══════════════════════════════════════════════════ */
  submitBtn.addEventListener('click', function () {
    // Enforce custom rule first
    enforceMessageLength();

    // Show Bootstrap validation UI
    form.classList.add('was-validated');

    // Stop if invalid
    if (!form.checkValidity()) {
      const firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // All valid
    handleSuccess();
  });

  /* ═══════════════════════════════════════════════════
     5. SUCCESS HANDLER
  ═══════════════════════════════════════════════════ */
  function handleSuccess() {
    const originalText = submitBtn.textContent;

    // Button success state
    submitBtn.textContent = '✓ Sent!';
    submitBtn.disabled = true;
    submitBtn.style.background = '#1a4a30';
    submitBtn.style.borderColor = '#1a4a30';

    setTimeout(function () {
      // Reset form
      form.reset();
      form.classList.remove('was-validated');

      // Reset message validity
      if (msgField) msgField.setCustomValidity('');

      // Reset character counter
      if (charCounter) {
        charCounter.textContent = '0 / 20 min';
        charCounter.classList.remove('valid', 'invalid-count');
      }

      // Restore button
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.style.background = '';
      submitBtn.style.borderColor = '';

      // Close modal
      if (modalEl) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();
      }
    }, 1200);
  }

  /* ═══════════════════════════════════════════════════
     6. MODAL RESET HANDLER
  ═══════════════════════════════════════════════════ */
  if (modalEl) {
    modalEl.addEventListener('hidden.bs.modal', function () {
      form.reset();
      form.classList.remove('was-validated');

      if (msgField) msgField.setCustomValidity('');

      if (charCounter) {
        charCounter.textContent = '0 / 20 min';
        charCounter.classList.remove('valid', 'invalid-count');
      }

      // Ensure button is restored
      submitBtn.disabled = false;
      submitBtn.style.background = '';
      submitBtn.style.borderColor = '';
    });
  }

})();