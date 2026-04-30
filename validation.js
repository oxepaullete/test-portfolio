/**
 * validation.js
 * Bootstrap 5.3 form validation for the Contact Modal.
 * Requirements:
 *  - Uses class="needs-validation" + novalidate
 *  - Uses form.checkValidity()
 *  - Applies .was-validated to show inline errors
 *  - Prevents submission if invalid
 *  - Validates: Name (required), Email (required, type=email),
 *               Message (required, minlength=20)
 */

(function () {
  'use strict';

  /* ── Elements ────────────────────────────────────────── */
  const submitBtn   = document.getElementById('submitBtn');
  const form        = document.getElementById('contactForm');
  const msgField    = document.getElementById('contactMessage');
  const charCounter = document.getElementById('charCounter');

  if (!form || !submitBtn) return; // Guard: elements must exist

  /* ── Character counter (live feedback on textarea) ───── */
  if (msgField && charCounter) {
    msgField.addEventListener('input', function () {
      const len = msgField.value.trim().length;
      charCounter.textContent = `${len} / 20 min`;

      // Visual state
      if (len >= 20) {
        charCounter.classList.add('valid');
        charCounter.classList.remove('invalid-count');
        msgField.setCustomValidity(''); // Clear custom error when valid
      } else {
        charCounter.classList.remove('valid');
        charCounter.classList.add('invalid-count');
      }

      // If form already validated, re-validate live
      if (form.classList.contains('was-validated')) {
        enforceMessageLength();
      }
    });
  }

  /* ── Enforce minimum message length ──────────────────── */
  function enforceMessageLength() {
    if (!msgField) return;
    const trimmed = msgField.value.trim();
    if (trimmed.length > 0 && trimmed.length < 20) {
      msgField.setCustomValidity('Message must be at least 20 characters.');
    } else {
      msgField.setCustomValidity('');
    }
  }

  /* ── Submit handler ──────────────────────────────────── */
  submitBtn.addEventListener('click', function () {
    // 1. Enforce custom message-length rule first
    enforceMessageLength();

    // 2. Apply Bootstrap's was-validated class to reveal feedback
    form.classList.add('was-validated');

    // 3. Run native checkValidity — stops here if any field fails
    if (!form.checkValidity()) {
      // Focus the first invalid field for accessibility
      const firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // ✅ All fields pass — handle successful submission
    handleSuccess();
  });

  /* ── Success handler ─────────────────────────────────── */
  function handleSuccess() {
    // Swap button to a success state briefly
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '✓ Sent!';
    submitBtn.disabled = true;
    submitBtn.style.background = '#1a4a30';
    submitBtn.style.borderColor = '#1a4a30';

    setTimeout(function () {
      // Reset form state
      form.reset();
      form.classList.remove('was-validated');

      // Reset char counter
      if (charCounter) {
        charCounter.textContent = '0 / 20 min';
        charCounter.classList.remove('valid', 'invalid-count');
      }

      // Reset button
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.style.background = '';
      submitBtn.style.borderColor = '';

      // Close the Bootstrap modal
      const modalEl = document.getElementById('contactModal');
      if (modalEl) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();
      }
    }, 1200);
  }

  /* ── Reset validation state when modal closes ────────── */
  const contactModal = document.getElementById('contactModal');
  if (contactModal) {
    contactModal.addEventListener('hidden.bs.modal', function () {
      form.reset();
      form.classList.remove('was-validated');
      msgField.setCustomValidity('');

      if (charCounter) {
        charCounter.textContent = '0 / 20 min';
        charCounter.classList.remove('valid', 'invalid-count');
      }

      // Re-enable submit in case it was mid-success-state
      submitBtn.disabled = false;
      submitBtn.style.background = '';
      submitBtn.style.borderColor = '';
    });
  }

})();