/**
 * Authentication UI Component
 *
 * Provides a complete authentication interface with:
 * - Social login buttons (Google, Facebook, Apple)
 * - Email-based passwordless authentication
 * - Login and registration in a single modal
 */

import { authManager } from '../core/auth-manager.js';
import { validateEmail, validateCode } from '../utils/validation.js';

export class AuthUI {
  constructor() {
    this.modal = null;
    this.currentMode = 'login'; // 'login' or 'email-verify'
    this.currentEmail = null;
    this.callbacks = {
      onSuccess: null,
      onError: null,
      onClose: null
    };
  }

  /**
   * Show the authentication modal
   * @param {Object} options - UI options
   */
  show(options = {}) {
    const {
      mode = 'login',
      title = 'Sign In',
      onSuccess = null,
      onError = null,
      onClose = null
    } = options;

    this.currentMode = mode;
    this.callbacks = { onSuccess, onError, onClose };

    // Create modal if it doesn't exist
    if (!this.modal) {
      this.createModal();
    }

    // Update content based on mode
    this.updateModalContent(title);

    // Show modal
    this.modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Add escape key listener
    this.escapeKeyListener = (e) => {
      if (e.key === 'Escape') {
        this.hide();
      }
    };
    document.addEventListener('keydown', this.escapeKeyListener);
  }

  /**
   * Hide the authentication modal
   */
  hide() {
    if (this.modal) {
      this.modal.style.display = 'none';
      document.body.style.overflow = '';

      // Remove escape key listener
      if (this.escapeKeyListener) {
        document.removeEventListener('keydown', this.escapeKeyListener);
      }

      // Call onClose callback
      if (this.callbacks.onClose) {
        this.callbacks.onClose();
      }
    }
  }

  /**
   * Create the modal HTML structure
   */
  createModal() {
    // Create modal overlay
    this.modal = document.createElement('div');
    this.modal.className = 'auth-modal-overlay';
    this.modal.innerHTML = `
      <div class="auth-modal">
        <button class="auth-modal-close" aria-label="Close">&times;</button>
        <div class="auth-modal-content">
          <!-- Content will be updated dynamically -->
        </div>
      </div>
    `;

    // Add to body
    document.body.appendChild(this.modal);

    // Close button event
    this.modal.querySelector('.auth-modal-close').addEventListener('click', () => {
      this.hide();
    });

    // Close on overlay click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.hide();
      }
    });
  }

  /**
   * Update modal content based on current mode
   * @param {string} title - Modal title
   */
  updateModalContent(title) {
    const content = this.modal.querySelector('.auth-modal-content');

    if (this.currentMode === 'login') {
      content.innerHTML = this.getLoginHTML(title);
      this.attachLoginEventListeners();
    } else if (this.currentMode === 'email-verify') {
      content.innerHTML = this.getEmailVerifyHTML();
      this.attachEmailVerifyEventListeners();
    }
  }

  /**
   * Get login/register HTML
   * @param {string} title - Modal title
   * @returns {string} HTML string
   */
  getLoginHTML(title) {
    return `
      <div class="auth-header">
        <h2>${title}</h2>
        <p>Choose your preferred sign-in method</p>
      </div>

      <div class="auth-social-buttons">
        <button class="auth-btn auth-btn-google" data-provider="google">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>

        <button class="auth-btn auth-btn-facebook" data-provider="facebook">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Continue with Facebook
        </button>

        <button class="auth-btn auth-btn-apple" data-provider="apple">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
          Continue with Apple
        </button>
      </div>

      <div class="auth-divider">
        <span>or</span>
      </div>

      <div class="auth-email-form">
        <label for="auth-email">Email Address</label>
        <input
          type="email"
          id="auth-email"
          class="auth-input"
          placeholder="name@example.com"
          autocomplete="email"
        />
        <div class="auth-error" id="auth-email-error"></div>

        <button class="auth-btn auth-btn-primary" id="auth-email-submit">
          Continue with Email
        </button>
      </div>

      <div class="auth-footer">
        <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
      </div>
    `;
  }

  /**
   * Get email verification HTML
   * @returns {string} HTML string
   */
  getEmailVerifyHTML() {
    return `
      <div class="auth-header">
        <h2>Check your email</h2>
        <p>We've sent a verification code to<br><strong>${this.currentEmail}</strong></p>
      </div>

      <div class="auth-verify-form">
        <label for="auth-code">Enter verification code</label>
        <input
          type="text"
          id="auth-code"
          class="auth-input auth-code-input"
          placeholder="000000"
          maxlength="6"
          autocomplete="one-time-code"
          inputmode="numeric"
          pattern="[0-9]*"
        />
        <div class="auth-error" id="auth-code-error"></div>

        <button class="auth-btn auth-btn-primary" id="auth-code-submit">
          Verify and Sign In
        </button>

        <button class="auth-btn auth-btn-secondary" id="auth-code-resend">
          Resend Code
        </button>

        <button class="auth-btn auth-btn-text" id="auth-back-to-login">
          ← Back to login
        </button>
      </div>

      <div class="auth-footer">
        <p>Code expires in 10 minutes</p>
      </div>
    `;
  }

  /**
   * Attach event listeners for login mode
   */
  attachLoginEventListeners() {
    // Social login buttons
    const socialButtons = this.modal.querySelectorAll('.auth-social-buttons .auth-btn');
    socialButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        const provider = e.currentTarget.dataset.provider;
        await this.handleSocialLogin(provider);
      });
    });

    // Email form
    const emailInput = this.modal.querySelector('#auth-email');
    const emailSubmit = this.modal.querySelector('#auth-email-submit');

    // Auto-clear error on input
    emailInput.addEventListener('input', () => {
      this.clearError('auth-email-error');
    });

    // Submit on Enter key
    emailInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        emailSubmit.click();
      }
    });

    // Email submit button
    emailSubmit.addEventListener('click', async () => {
      await this.handleEmailSubmit();
    });
  }

  /**
   * Attach event listeners for email verify mode
   */
  attachEmailVerifyEventListeners() {
    const codeInput = this.modal.querySelector('#auth-code');
    const codeSubmit = this.modal.querySelector('#auth-code-submit');
    const resendBtn = this.modal.querySelector('#auth-code-resend');
    const backBtn = this.modal.querySelector('#auth-back-to-login');

    // Auto-clear error on input
    codeInput.addEventListener('input', () => {
      this.clearError('auth-code-error');

      // Auto-submit when 6 digits entered
      const value = codeInput.value.replace(/\D/g, '');
      if (value.length === 6) {
        setTimeout(() => codeSubmit.click(), 300);
      }
    });

    // Only allow numbers
    codeInput.addEventListener('keypress', (e) => {
      if (!/[0-9]/.test(e.key) && e.key !== 'Enter') {
        e.preventDefault();
      }
      if (e.key === 'Enter') {
        codeSubmit.click();
      }
    });

    // Verify button
    codeSubmit.addEventListener('click', async () => {
      await this.handleCodeVerify();
    });

    // Resend button
    resendBtn.addEventListener('click', async () => {
      await this.handleCodeResend();
    });

    // Back button
    backBtn.addEventListener('click', () => {
      this.currentMode = 'login';
      this.updateModalContent('Sign In');
    });

    // Focus the code input
    setTimeout(() => codeInput.focus(), 100);
  }

  /**
   * Handle social login
   * @param {string} provider - Provider name (google, facebook, apple)
   */
  async handleSocialLogin(provider) {
    const button = this.modal.querySelector(`[data-provider="${provider}"]`);

    try {
      // Disable button and show loading
      button.disabled = true;
      button.classList.add('loading');
      const originalText = button.textContent;
      button.innerHTML = `
        <span class="spinner"></span>
        Signing in...
      `;

      let result;
      if (provider === 'google') {
        result = await authManager.signInWithGoogle();
      } else if (provider === 'facebook') {
        result = await authManager.signInWithFacebook();
      } else if (provider === 'apple') {
        result = await authManager.signInWithApple();
      }

      if (result.success) {
        // Success callback
        if (this.callbacks.onSuccess) {
          this.callbacks.onSuccess(result.user);
        }
        this.hide();
      } else {
        // Show error
        this.showError('auth-email-error', result.message);

        // Error callback
        if (this.callbacks.onError) {
          this.callbacks.onError(result);
        }

        // Re-enable button
        button.disabled = false;
        button.classList.remove('loading');
        button.innerHTML = originalText;
      }

    } catch (error) {
      console.error('Social login error:', error);
      this.showError('auth-email-error', 'An unexpected error occurred. Please try again.');

      // Re-enable button
      button.disabled = false;
      button.classList.remove('loading');
    }
  }

  /**
   * Handle email submit
   */
  async handleEmailSubmit() {
    const emailInput = this.modal.querySelector('#auth-email');
    const submitBtn = this.modal.querySelector('#auth-email-submit');
    const email = emailInput.value.trim();

    // Validate email
    const validation = validateEmail(email);
    if (!validation.isValid) {
      this.showError('auth-email-error', validation.error);
      emailInput.focus();
      return;
    }

    try {
      // Disable button and show loading
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      submitBtn.innerHTML = `
        <span class="spinner"></span>
        Sending code...
      `;

      // Send verification code
      const result = await authManager.sendEmailCode(email);

      if (result.success) {
        // Switch to verify mode
        this.currentEmail = email;
        this.currentMode = 'email-verify';
        this.updateModalContent('Verify Email');
      } else {
        this.showError('auth-email-error', result.message);
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'Continue with Email';
      }

    } catch (error) {
      console.error('Email submit error:', error);
      this.showError('auth-email-error', 'An unexpected error occurred. Please try again.');
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      submitBtn.textContent = 'Continue with Email';
    }
  }

  /**
   * Handle code verification
   */
  async handleCodeVerify() {
    const codeInput = this.modal.querySelector('#auth-code');
    const submitBtn = this.modal.querySelector('#auth-code-submit');
    const code = codeInput.value.trim();

    // Validate code
    const validation = validateCode(code, 6);
    if (!validation.isValid) {
      this.showError('auth-code-error', validation.error);
      codeInput.focus();
      return;
    }

    try {
      // Disable button and show loading
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      submitBtn.innerHTML = `
        <span class="spinner"></span>
        Verifying...
      `;

      // Verify code
      const result = await authManager.verifyEmailCode(this.currentEmail, code);

      if (result.success) {
        // Success callback
        if (this.callbacks.onSuccess) {
          this.callbacks.onSuccess(result.user);
        }
        this.hide();
      } else {
        this.showError('auth-code-error', result.message);
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'Verify and Sign In';
        codeInput.select();
      }

    } catch (error) {
      console.error('Code verify error:', error);
      this.showError('auth-code-error', 'An unexpected error occurred. Please try again.');
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      submitBtn.textContent = 'Verify and Sign In';
    }
  }

  /**
   * Handle code resend
   */
  async handleCodeResend() {
    const resendBtn = this.modal.querySelector('#auth-code-resend');

    try {
      // Disable button and show loading
      resendBtn.disabled = true;
      resendBtn.innerHTML = `
        <span class="spinner"></span>
        Sending...
      `;

      // Resend code
      const result = await authManager.resendEmailCode(this.currentEmail);

      if (result.success) {
        // Show success message
        this.showSuccess('auth-code-error', 'New code sent! Check your email.');

        // Re-enable button after delay
        setTimeout(() => {
          resendBtn.disabled = false;
          resendBtn.textContent = 'Resend Code';
          this.clearError('auth-code-error');
        }, 3000);
      } else {
        this.showError('auth-code-error', result.message);
        resendBtn.disabled = false;
        resendBtn.textContent = 'Resend Code';
      }

    } catch (error) {
      console.error('Code resend error:', error);
      this.showError('auth-code-error', 'Failed to resend code. Please try again.');
      resendBtn.disabled = false;
      resendBtn.textContent = 'Resend Code';
    }
  }

  /**
   * Show error message
   * @param {string} errorId - Error element ID
   * @param {string} message - Error message
   */
  showError(errorId, message) {
    const errorEl = this.modal.querySelector(`#${errorId}`);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.className = 'auth-error auth-error-show';
    }
  }

  /**
   * Show success message
   * @param {string} errorId - Element ID (reusing error element)
   * @param {string} message - Success message
   */
  showSuccess(errorId, message) {
    const errorEl = this.modal.querySelector(`#${errorId}`);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.className = 'auth-error auth-success-show';
    }
  }

  /**
   * Clear error message
   * @param {string} errorId - Error element ID
   */
  clearError(errorId) {
    const errorEl = this.modal.querySelector(`#${errorId}`);
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.className = 'auth-error';
    }
  }

  /**
   * Destroy the modal
   */
  destroy() {
    if (this.modal) {
      this.modal.remove();
      this.modal = null;
    }
    document.body.style.overflow = '';
  }
}

// Export singleton instance
export const authUI = new AuthUI();

// Export class for custom instances
export default AuthUI;
