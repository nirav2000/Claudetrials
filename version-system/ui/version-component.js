/**
 * Version Component
 *
 * Self-contained version display system with badge, modal, and history.
 * Drop this file into any project and call VersionComponent.init()
 */

class VersionComponent {
  constructor(config) {
    this.config = config || window.VERSION_CONFIG || {};
    this.currentVersion = this.config.currentVersion || '1.0.0';
    this.manifest = null;
    this.versions = [];
  }

  /**
   * Initialize the version component
   */
  async init() {
    try {
      // Load version manifest
      await this.loadManifest();

      // Inject styles
      this.injectStyles();

      // Create UI components
      if (this.config.showVersionBadge !== false) {
        this.createVersionBadge();
      }

      if (this.config.enableVersionModal !== false) {
        this.createVersionModal();
      }

      // Show notification if version changed
      this.checkVersionChange();

      console.log(`✓ Version Component initialized (v${this.currentVersion})`);
    } catch (error) {
      console.error('Error initializing version component:', error);
    }
  }

  /**
   * Load version manifest
   */
  async loadManifest() {
    try {
      const manifestPath = this.config.manifestPath || 'versions/version-manifest.json';
      const response = await fetch(manifestPath);
      this.manifest = await response.json();
      this.versions = this.manifest.versions || [];
      this.currentVersion = this.manifest.currentVersion || this.currentVersion;
    } catch (error) {
      console.warn('Could not load version manifest:', error.message);
      this.versions = [{
        number: this.currentVersion,
        date: new Date().toISOString().split('T')[0],
        type: 'major',
        description: 'Current version'
      }];
    }
  }

  /**
   * Inject CSS styles
   */
  injectStyles() {
    if (document.getElementById('version-component-styles')) return;

    const styles = `
/* Version Component Styles */

.version-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  user-select: none;
  margin-left: 12px;
}

.version-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.version-badge::before {
  content: '📦';
  margin-right: 6px;
}

.version-badge.floating {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  padding: 10px 16px;
}

/* Version Modal */
.version-modal-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10000;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.version-modal-overlay.active {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
}

.version-modal {
  background: white;
  border-radius: 16px;
  max-width: 900px;
  width: 90%;
  max-height: 85vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transform: scale(0.9);
  transition: transform 0.3s ease;
}

.version-modal-overlay.active .version-modal {
  transform: scale(1);
}

.version-modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.version-modal-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.version-modal-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.5rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.version-modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.version-modal-body {
  padding: 32px;
  overflow-y: auto;
  max-height: calc(85vh - 100px);
}

.version-cards {
  display: grid;
  gap: 20px;
}

.version-card {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
  background: white;
}

.version-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

.version-card.current {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.version-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.version-card-info {
  flex: 1;
}

.version-card-number {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.version-card-date {
  font-size: 0.875rem;
  color: #6b7280;
}

.version-card-badges {
  display: flex;
  gap: 8px;
  align-items: center;
}

.version-badge-type {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.version-badge-type.major {
  background: #fee2e2;
  color: #991b1b;
}

.version-badge-type.minor {
  background: #d1fae5;
  color: #065f46;
}

.version-badge-type.patch {
  background: #fef3c7;
  color: #92400e;
}

.version-badge-current {
  padding: 4px 10px;
  border-radius: 12px;
  background: #667eea;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
}

.version-card-description {
  color: #4b5563;
  line-height: 1.6;
  margin: 12px 0;
}

.version-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.version-view-details {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: gap 0.2s ease;
}

.version-view-details:hover {
  gap: 10px;
}

/* Changelog Detail Modal */
.version-changelog-modal {
  background: white;
  border-radius: 16px;
  max-width: 800px;
  width: 90%;
  max-height: 85vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.version-changelog-content {
  padding: 32px;
  overflow-y: auto;
  max-height: calc(85vh - 100px);
}

.version-changelog-content h1 {
  color: #1f2937;
  margin-top: 0;
}

.version-changelog-content h2 {
  color: #374151;
  margin-top: 24px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e5e7eb;
}

.version-changelog-content ul {
  padding-left: 24px;
}

.version-changelog-content li {
  margin: 8px 0;
  line-height: 1.6;
}

/* Notification */
.version-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border-radius: 12px;
  padding: 16px 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  z-index: 10001;
  display: flex;
  align-items: center;
  gap: 12px;
  transform: translateX(400px);
  transition: transform 0.3s ease;
}

.version-notification.show {
  transform: translateX(0);
}

.version-notification-icon {
  font-size: 1.5rem;
}

.version-notification-text {
  flex: 1;
}

.version-notification-title {
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.version-notification-message {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .version-modal {
    width: 95%;
    max-height: 90vh;
  }

  .version-modal-header {
    padding: 20px;
  }

  .version-modal-body {
    padding: 20px;
  }

  .version-badge.floating {
    bottom: 10px;
    right: 10px;
  }
}
    `;

    const styleElement = document.createElement('style');
    styleElement.id = 'version-component-styles';
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  }

  /**
   * Create version badge
   */
  createVersionBadge() {
    const badge = document.createElement('div');
    badge.className = 'version-badge';
    badge.textContent = `v${this.currentVersion}`;
    badge.title = 'Click to view version history';

    if (this.config.badgeStyle?.position === 'floating') {
      badge.classList.add('floating');
    }

    badge.addEventListener('click', () => this.showVersionModal());

    // Insert badge based on position
    const position = this.config.badgePosition || 'header';

    if (position === 'custom' && this.config.badgeSelector) {
      const target = document.querySelector(this.config.badgeSelector);
      if (target) {
        target.appendChild(badge);
      }
    } else if (position === 'footer') {
      document.body.appendChild(badge);
      badge.classList.add('floating');
    } else {
      // Default: insert after h1 in header
      const header = document.querySelector('h1');
      if (header) {
        header.parentElement.insertBefore(badge, header.nextSibling);
      } else {
        document.body.appendChild(badge);
        badge.classList.add('floating');
      }
    }

    this.badgeElement = badge;
  }

  /**
   * Create version modal
   */
  createVersionModal() {
    const overlay = document.createElement('div');
    overlay.className = 'version-modal-overlay';
    overlay.innerHTML = `
      <div class="version-modal">
        <div class="version-modal-header">
          <h2 class="version-modal-title">📚 Version History</h2>
          <button class="version-modal-close" aria-label="Close">&times;</button>
        </div>
        <div class="version-modal-body">
          <div class="version-cards"></div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Event listeners
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.hideVersionModal();
      }
    });

    overlay.querySelector('.version-modal-close').addEventListener('click', () => {
      this.hideVersionModal();
    });

    this.modalElement = overlay;
  }

  /**
   * Show version modal
   */
  showVersionModal() {
    if (!this.modalElement) return;

    // Populate version cards
    this.populateVersionCards();

    this.modalElement.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Hide version modal
   */
  hideVersionModal() {
    if (!this.modalElement) return;

    this.modalElement.classList.remove('active');
    document.body.style.overflow = '';
  }

  /**
   * Populate version cards
   */
  populateVersionCards() {
    const container = this.modalElement.querySelector('.version-cards');
    if (!container) return;

    container.innerHTML = '';

    for (const version of this.versions) {
      const card = this.createVersionCard(version);
      container.appendChild(card);
    }
  }

  /**
   * Create version card element
   */
  createVersionCard(version) {
    const isCurrent = version.number === this.currentVersion;

    const card = document.createElement('div');
    card.className = `version-card ${isCurrent ? 'current' : ''}`;
    card.innerHTML = `
      <div class="version-card-header">
        <div class="version-card-info">
          <h3 class="version-card-number">v${version.number}</h3>
          <div class="version-card-date">${this.formatDate(version.date)}</div>
        </div>
        <div class="version-card-badges">
          ${isCurrent ? '<span class="version-badge-current">Current</span>' : ''}
          <span class="version-badge-type ${version.type}">
            ${this.getTypeIcon(version.type)} ${version.type}
          </span>
        </div>
      </div>
      <div class="version-card-description">
        ${version.description || 'No description available'}
      </div>
      <div class="version-card-footer">
        <a href="#" class="version-view-details" data-version="${version.number}">
          View Details →
        </a>
      </div>
    `;

    // Add click handler for details
    card.querySelector('.version-view-details').addEventListener('click', (e) => {
      e.preventDefault();
      this.showChangelogDetails(version.number);
    });

    return card;
  }

  /**
   * Show changelog details
   */
  async showChangelogDetails(versionNumber) {
    const version = this.versions.find(v => v.number === versionNumber);
    if (!version) return;

    try {
      // Load changelog
      const changelogPath = version.changelogFile || `changelogs/v${versionNumber}.md`;
      const response = await fetch(`versions/${changelogPath}`);
      const markdown = await response.text();

      // Convert markdown to HTML (basic conversion)
      const html = this.markdownToHtml(markdown);

      // Create detail modal
      const overlay = document.createElement('div');
      overlay.className = 'version-modal-overlay active';
      overlay.innerHTML = `
        <div class="version-changelog-modal">
          <div class="version-modal-header">
            <h2 class="version-modal-title">📖 Version ${versionNumber}</h2>
            <button class="version-modal-close" aria-label="Close">&times;</button>
          </div>
          <div class="version-changelog-content">
            ${html}
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      // Event listeners
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          document.body.removeChild(overlay);
        }
      });

      overlay.querySelector('.version-modal-close').addEventListener('click', () => {
        document.body.removeChild(overlay);
      });

    } catch (error) {
      console.error('Error loading changelog:', error);
      alert('Could not load changelog for this version');
    }
  }

  /**
   * Basic markdown to HTML conversion
   */
  markdownToHtml(markdown) {
    return markdown
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$2</h2>')
      .replace(/^### (.*$)/gim, '<h3>$3</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
      .replace(/\n/gim, '<br>');
  }

  /**
   * Get type icon
   */
  getTypeIcon(type) {
    const icons = {
      'major': '🎉',
      'minor': '✨',
      'patch': '🔧'
    };
    return icons[type] || '📦';
  }

  /**
   * Format date
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Check if version changed and show notification
   */
  checkVersionChange() {
    const lastSeenVersion = localStorage.getItem('lastSeenVersion');

    if (lastSeenVersion && lastSeenVersion !== this.currentVersion) {
      this.showNotification(
        'New Version Available!',
        `App updated to v${this.currentVersion}`
      );
    }

    localStorage.setItem('lastSeenVersion', this.currentVersion);
  }

  /**
   * Show notification
   */
  showNotification(title, message) {
    if (!this.config.uiNotifications) return;

    const notification = document.createElement('div');
    notification.className = 'version-notification';
    notification.innerHTML = `
      <div class="version-notification-icon">🎉</div>
      <div class="version-notification-text">
        <div class="version-notification-title">${title}</div>
        <div class="version-notification-message">${message}</div>
      </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto-hide
    const duration = this.config.notificationDuration || 5000;
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => document.body.removeChild(notification), 300);
    }, duration);
  }
}

// Auto-initialize if config is available
if (typeof window !== 'undefined' && window.VERSION_CONFIG) {
  window.addEventListener('DOMContentLoaded', () => {
    window.versionComponent = new VersionComponent(window.VERSION_CONFIG);
    window.versionComponent.init();
  });
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VersionComponent;
}
if (typeof window !== 'undefined') {
  window.VersionComponent = VersionComponent;
}
