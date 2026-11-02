/**
 * Floating Contact Toolbar, WhatsApp, Phone & Direct-Contact Chatbot
 * ------------------------------------------------------------------
 * Features:
 * - Fixed right-side contact toolbar with WhatsApp, Direct Call, and Chatbot buttons
 * - Recognizable SVG icons, accessible colors, and hover tooltips
 * - WhatsApp integration with prefilled introductory message
 * - Telephone call integration using tel: link
 * - Direct-contact chatbot: shows contact options immediately, no loops
 * - Automatic welcome popup after ~4 seconds (once per session, dismissible)
 * - Fullscreen gallery lightbox synchronization
 * - Keyboard accessible, focus management, and mobile safe-area compliance
 */

export class FloatingContactController {
  constructor(config = {}) {
    this.config = config.contactWidget || {};
    this.brand = config.brand || { name: 'MyUGC Video' };

    this.whatsappConfig = this.config.whatsapp || {
      number: '919205499604',
      displayNumber: '+91 92054 99604',
      prefilledMessage: "Hi, I'm interested in working with MyUGC Video.",
      tooltip: 'WhatsApp',
      ariaLabel: 'Chat with us on WhatsApp',
    };

    this.phoneConfig = this.config.phone || {
      number: '+919205499604',
      displayNumber: '+91 92054 99604',
      tooltip: 'Call Us',
      ariaLabel: 'Call our team directly',
    };

    this.chatbotConfig = this.config.chatbot || {
      tooltip: 'Chat with Us',
      ariaLabel: 'Open chat assistant',
      headerTitle: 'MyUGC Video',
      headerSubtitle: 'UGC & Product Photography',
      welcomeMessage: "Hi there! 👋 Welcome to MyUGC Video. How can we help your brand today?",
      typingDelayMs: 500,
      quickReplies: [],
      fallbackReply: 'Use the options below to connect with our team instantly.',
    };

    this.welcomeConfig = this.config.welcomePopup || {
      enabled: true,
      delayMs: 4000,
      sessionStorageKey: 'myugcvideo_welcome_popup_dismissed',
      badge: 'MyUGC Video',
      message: 'Looking for the best UGC video services or photoshoot in Delhi? Let\'s talk.',
      acceptText: 'Inquire Now',
      dismissText: 'Maybe Later',
    };

    this.isChatOpen = false;
    this.hasChatBeenOpened = false;
    this.welcomeTimer = null;
    this.isTyping = false;

    this.clickedQuickReplyIds = new Set();
    try {
      const saved = JSON.parse(sessionStorage.getItem('myugc_clicked_replies') || '[]');
      if (Array.isArray(saved)) {
        saved.forEach((id) => this.clickedQuickReplyIds.add(id));
      }
    } catch (e) {
      // Ignore storage errors
    }

    this.init();
  }

  init() {
    this.renderElements();
    this.cacheElements();
    this.bindEvents();
    this.initWelcomePopup();
    this.initLightboxObserver();
  }

  /**
   * Build WhatsApp & phone URLs
   */
  buildWaUrl() {
    const cleanWaNumber = String(this.whatsappConfig.number).replace(/[^0-9]/g, '');
    const encodedWaText = encodeURIComponent(this.whatsappConfig.prefilledMessage || '');
    return `https://wa.me/${cleanWaNumber}?text=${encodedWaText}`;
  }

  buildPhoneUrl() {
    return `tel:${this.phoneConfig.number}`;
  }

  buildEmailUrl() {
    return 'mailto:contact@myugcvideo.in';
  }

  /**
   * Render Toolbar, Chat Panel, and Welcome Popup into DOM
   */
  renderElements() {
    // 1. Root Container
    this.rootContainer = document.createElement('div');
    this.rootContainer.className = 'floating-contact-root';
    this.rootContainer.id = 'floating-contact-root';

    const waUrl = this.buildWaUrl();
    const phoneUrl = this.buildPhoneUrl();

    this.rootContainer.innerHTML = `
      <!-- FLOATING VERTICAL TOOLBAR -->
      <nav class="floating-contact-toolbar" id="floating-contact-toolbar" aria-label="Quick Contact and Chatbot Toolbar">
        <!-- 1. WhatsApp Button -->
        <a 
          href="${waUrl}" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="floating-tool-btn btn-whatsapp" 
          id="floating-btn-whatsapp" 
          aria-label="${this.whatsappConfig.ariaLabel || 'Chat on WhatsApp'}"
        >
          <span class="tool-btn-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M12.011 2c-5.506 0-9.988 4.478-9.988 9.984 0 1.76.458 3.477 1.33 4.993L2 22l5.233-1.371c1.46.797 3.097 1.213 4.774 1.213h.004c5.506 0 9.984-4.479 9.984-9.985 0-2.67-1.036-5.176-2.924-7.063C16.99 2.906 14.484 2 12.011 2zm0 1.66c4.59 0 8.324 3.734 8.324 8.324 0 4.59-3.734 8.324-8.324 8.324-1.46 0-2.88-.38-4.13-1.11l-.3-.17-3.07.8.82-2.99-.19-.31a8.27 8.27 0 01-1.45-4.54c0-4.59 3.73-8.324 8.32-8.324zm4.568 10.397c-.25-.125-1.48-.73-1.709-.813-.23-.083-.396-.125-.563.125-.166.25-.646.813-.791.98-.146.166-.292.187-.542.062s-1.056-.39-2.011-1.242c-.744-.664-1.246-1.484-1.392-1.734-.146-.25-.016-.385.11-.51.112-.112.25-.292.375-.438.125-.146.167-.25.25-.417.083-.167.042-.313-.02-.438s-.563-1.354-.771-1.854c-.203-.487-.41-.421-.563-.429l-.479-.008c-.167 0-.438.062-.667.312s-.875.854-.875 2.083c0 1.229.896 2.417 1.021 2.583.125.167 1.764 2.694 4.274 3.777.597.258 1.064.412 1.427.528.6.19 1.146.163 1.578.099.481-.072 1.48-.605 1.688-1.188.208-.583.208-1.083.146-1.188-.063-.104-.229-.167-.479-.292z"/>
            </svg>
          </span>
          <span class="tool-btn-tooltip" role="tooltip">${this.whatsappConfig.tooltip || 'WhatsApp'}</span>
        </a>

        <!-- 2. Phone Call Button -->
        <a 
          href="${phoneUrl}" 
          class="floating-tool-btn btn-phone" 
          id="floating-btn-phone" 
          aria-label="${this.phoneConfig.ariaLabel || 'Call Us'}"
        >
          <span class="tool-btn-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </span>
          <span class="tool-btn-tooltip" role="tooltip">${this.phoneConfig.tooltip || 'Call Us'}</span>
        </a>

        <!-- 3. Chatbot Button -->
        <button 
          type="button" 
          class="floating-tool-btn btn-chatbot" 
          id="floating-btn-chatbot" 
          aria-label="${this.chatbotConfig.ariaLabel || 'Chat with Us'}" 
          aria-expanded="false" 
          aria-controls="floating-chat-panel"
        >
          <span class="tool-btn-icon icon-chat-bubble" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              <line x1="8" y1="9" x2="16" y2="9"></line>
              <line x1="8" y1="13" x2="14" y2="13"></line>
            </svg>
          </span>
          <span class="tool-btn-icon icon-chat-close" aria-hidden="true" style="display: none;">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </span>
          <span class="chat-unread-dot" id="chat-unread-dot" aria-hidden="true"></span>
          <span class="tool-btn-tooltip" role="tooltip">${this.chatbotConfig.tooltip || 'Chat with Us'}</span>
        </button>
      </nav>

      <!-- AUTOMATIC WELCOME POPUP (Appears after ~4s) -->
      <aside 
        class="floating-welcome-popup" 
        id="floating-welcome-popup" 
        role="region" 
        aria-label="Welcome Message" 
        hidden
      >
        <button type="button" class="welcome-popup-close" id="welcome-popup-close" aria-label="Dismiss message">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div class="welcome-popup-header">
          <div class="welcome-avatar-wrap">
            <div class="welcome-avatar">M</div>
            <span class="welcome-status-ping" aria-hidden="true"></span>
          </div>
          <div class="welcome-header-text">
            <span class="welcome-badge">${this.welcomeConfig.badge || 'MyUGC Video'}</span>
            <span class="welcome-status-label">Online</span>
          </div>
        </div>
        <p class="welcome-popup-message">${this.welcomeConfig.message}</p>
        <div class="welcome-popup-actions">
          <button type="button" class="welcome-action-btn btn-accept" id="welcome-btn-chat">
            ${this.welcomeConfig.acceptText || 'Chat with Us'}
          </button>
          <button type="button" class="welcome-action-btn btn-dismiss" id="welcome-btn-later">
            ${this.welcomeConfig.dismissText || 'Maybe Later'}
          </button>
        </div>
      </aside>

      <!-- DIRECT-CONTACT CHATBOT PANEL -->
      <section 
        class="floating-chat-panel" 
        id="floating-chat-panel" 
        role="dialog" 
        aria-modal="false" 
        aria-labelledby="chat-panel-title" 
        hidden
      >
        <!-- Chat Header -->
        <header class="chat-panel-header">
          <div class="chat-header-info">
            <div class="chat-avatar-wrap">
              <span class="chat-avatar">M</span>
              <span class="chat-online-indicator" aria-hidden="true"></span>
            </div>
            <div class="chat-title-group">
              <h2 id="chat-panel-title" class="chat-header-title">${this.chatbotConfig.headerTitle || 'MyUGC Video'}</h2>
              <p class="chat-header-subtitle">${this.chatbotConfig.headerSubtitle || 'UGC & Product Photography'}</p>
            </div>
          </div>
          <button type="button" class="chat-close-btn" id="chat-panel-close-btn" aria-label="Close Chat Window">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>

        <!-- Chat Messages -->
        <div class="chat-messages-container" id="chat-messages-container" role="log" aria-live="polite">
          <!-- Initial Welcome Message with contact options injected on open -->
        </div>

        <!-- Typing Indicator -->
        <div class="chat-typing-indicator" id="chat-typing-indicator" aria-label="Typing" hidden>
          <div class="typing-bubble">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>

        <!-- Quick Action Chips -->
        ${(() => {
          const availableChips = (this.chatbotConfig.quickReplies || []).filter(
            (chip) => !this.clickedQuickReplyIds.has(chip.id)
          );
          const isHidden = availableChips.length === 0;
          return `
            <div class="chat-quick-replies ${isHidden ? 'is-hidden' : ''}" id="chat-quick-replies" aria-label="Quick topics" ${isHidden ? 'hidden' : ''}>
              <span class="quick-replies-label">Ask about:</span>
              <div class="quick-chips-track">
                ${availableChips
                  .map(
                    (chip) => `
                  <button type="button" class="quick-chip-btn" data-reply-id="${chip.id}">
                    ${chip.label}
                  </button>
                `
                  )
                  .join('')}
              </div>
            </div>
          `;
        })()}

        <!-- Message Input Form -->
        <footer class="chat-panel-footer">
          <form class="chat-input-form" id="chat-input-form" novalidate>
            <input 
              type="text" 
              class="chat-text-input" 
              id="chat-text-input" 
              placeholder="Type your question..." 
              autocomplete="off" 
              aria-label="Ask a question" 
              maxlength="280"
            />
            <button type="submit" class="chat-send-btn" id="chat-send-btn" aria-label="Send message">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
          <div class="chat-footer-disclaimer">
            <span>MyUGC Video — Delhi, India</span>
          </div>
        </footer>
      </section>
    `;

    document.body.appendChild(this.rootContainer);
  }

  cacheElements() {
    this.toolbar = this.rootContainer.querySelector('#floating-contact-toolbar');
    this.chatbotToggleBtn = this.rootContainer.querySelector('#floating-btn-chatbot');
    this.chatPanel = this.rootContainer.querySelector('#floating-chat-panel');
    this.chatCloseBtn = this.rootContainer.querySelector('#chat-panel-close-btn');
    this.chatIconBubble = this.chatbotToggleBtn.querySelector('.icon-chat-bubble');
    this.chatIconClose = this.chatbotToggleBtn.querySelector('.icon-chat-close');
    this.unreadDot = this.rootContainer.querySelector('#chat-unread-dot');

    this.welcomePopup = this.rootContainer.querySelector('#floating-welcome-popup');
    this.welcomeCloseBtn = this.rootContainer.querySelector('#welcome-popup-close');
    this.welcomeChatBtn = this.rootContainer.querySelector('#welcome-btn-chat');
    this.welcomeLaterBtn = this.rootContainer.querySelector('#welcome-btn-later');

    this.messagesContainer = this.rootContainer.querySelector('#chat-messages-container');
    this.typingIndicator = this.rootContainer.querySelector('#chat-typing-indicator');
    this.quickRepliesTrack = this.rootContainer.querySelector('#chat-quick-replies');
    this.inputForm = this.rootContainer.querySelector('#chat-input-form');
    this.textInput = this.rootContainer.querySelector('#chat-text-input');
  }

  bindEvents() {
    // 1. Toggle Chatbot Panel
    this.chatbotToggleBtn.addEventListener('click', () => {
      this.toggleChat();
    });

    // 2. Close Chatbot Panel
    this.chatCloseBtn.addEventListener('click', () => {
      this.closeChat();
    });

    // 3. Welcome Popup Actions
    this.welcomeChatBtn?.addEventListener('click', () => {
      this.dismissWelcomePopup();
      this.openChat();
    });

    this.welcomeLaterBtn?.addEventListener('click', () => {
      this.dismissWelcomePopup();
    });

    this.welcomeCloseBtn?.addEventListener('click', () => {
      this.dismissWelcomePopup();
    });

    // Dismiss welcome popup when lead form is focused
    const leadFormEl = document.getElementById('lead-form');
    if (leadFormEl) {
      leadFormEl.addEventListener('focusin', () => {
        this.dismissWelcomePopup();
      });
      leadFormEl.addEventListener('mouseenter', () => {
        if (this.welcomePopup && this.welcomePopup.classList.contains('is-visible')) {
          this.dismissWelcomePopup();
        }
      });
    }

    // 4. Input Form Submission
    this.inputForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleUserSubmit();
    });

    // 5. Quick Reply Chips
    this.quickRepliesTrack?.addEventListener('click', (e) => {
      const chipBtn = e.target.closest('.quick-chip-btn');
      if (chipBtn && !chipBtn.disabled && !chipBtn.classList.contains('is-fading-out')) {
        const replyId = chipBtn.getAttribute('data-reply-id');
        this.handleQuickReply(replyId, chipBtn.textContent.trim(), chipBtn);
      }
    });

    // 6. Keyboard: Escape to close chat
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isChatOpen) {
        this.closeChat();
      }
    });

    // 7. Chat action buttons (delegated — for dynamically injected contact pills)
    this.messagesContainer?.addEventListener('click', (e) => {
      const bookBtn = e.target.closest('[data-chat-action="book-photoshoot"]');
      if (bookBtn) {
        this.closeChat();
        // Open the inquiry modal with source metadata
        const openEvent = new CustomEvent('open-inquiry-modal', {
          detail: { source: 'Chatbot Photoshoot Action' },
        });
        document.dispatchEvent(openEvent);
      }
    });
  }

  /**
   * Automatic Welcome Popup after ~4 seconds
   */
  initWelcomePopup() {
    if (!this.welcomeConfig.enabled) return;

    const isDismissed = sessionStorage.getItem(this.welcomeConfig.sessionStorageKey);
    if (isDismissed === 'true') return;

    const delay = this.welcomeConfig.delayMs || 4000;

    this.welcomeTimer = setTimeout(() => {
      if (this.isChatOpen || this.hasChatBeenOpened) return;
      if (document.body.classList.contains('lightbox-is-open')) {
        this.welcomeTimer = setTimeout(() => {
          if (!this.isChatOpen && !document.body.classList.contains('lightbox-is-open')) {
            this.showWelcomePopup();
          }
        }, 3000);
        return;
      }

      this.showWelcomePopup();
    }, delay);
  }

  showWelcomePopup() {
    if (!this.welcomePopup) return;

    const leadFormEl = document.getElementById('lead-form');
    const activeEl = document.activeElement;
    if (leadFormEl && activeEl && leadFormEl.contains(activeEl)) return;

    this.welcomePopup.removeAttribute('hidden');
    this.welcomePopup.style.pointerEvents = 'auto';
    void this.welcomePopup.offsetWidth;
    this.welcomePopup.classList.add('is-visible');

    if (this.unreadDot) {
      this.unreadDot.classList.add('is-active');
    }
  }

  dismissWelcomePopup() {
    if (!this.welcomePopup) return;

    this.welcomePopup.classList.remove('is-visible');
    this.welcomePopup.style.pointerEvents = 'none';
    this.welcomePopup.setAttribute('hidden', '');
    sessionStorage.setItem(this.welcomeConfig.sessionStorageKey, 'true');

    if (this.welcomeTimer) {
      clearTimeout(this.welcomeTimer);
      this.welcomeTimer = null;
    }
  }

  /**
   * Lightbox Observer
   */
  initLightboxObserver() {
    const observer = new MutationObserver(() => {
      const isLightboxOpen = document.body.classList.contains('lightbox-is-open');
      if (isLightboxOpen) {
        this.rootContainer.classList.add('lightbox-active-hidden');
      } else {
        this.rootContainer.classList.remove('lightbox-active-hidden');
      }
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  /**
   * Chat Visibility & Focus Management
   */
  toggleChat() {
    if (this.isChatOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  openChat() {
    if (this.isChatOpen) return;

    this.isChatOpen = true;
    this.hasChatBeenOpened = true;

    this.dismissWelcomePopup();

    if (this.unreadDot) {
      this.unreadDot.classList.remove('is-active');
    }

    this.chatbotToggleBtn.setAttribute('aria-expanded', 'true');
    this.chatbotToggleBtn.classList.add('is-active');
    if (this.chatIconBubble && this.chatIconClose) {
      this.chatIconBubble.style.display = 'none';
      this.chatIconClose.style.display = 'flex';
    }

    this.chatPanel.removeAttribute('hidden');
    this.chatPanel.style.pointerEvents = 'auto';
    void this.chatPanel.offsetWidth;
    this.chatPanel.classList.add('is-open');

    // Show welcome message + contact options if first time opening
    if (this.messagesContainer && this.messagesContainer.children.length === 0) {
      this.renderWelcomeWithContactOptions();
    }

    // Ensure quick replies track is hidden if all chips have been clicked
    if (this.quickRepliesTrack) {
      const remaining = this.quickRepliesTrack.querySelectorAll('.quick-chip-btn:not(.is-fading-out)');
      if (remaining.length === 0) {
        this.quickRepliesTrack.classList.add('is-hidden');
        this.quickRepliesTrack.setAttribute('hidden', '');
      }
    }

    setTimeout(() => {
      this.textInput?.focus();
      this.scrollToBottom();
    }, 100);
  }

  closeChat() {
    if (!this.isChatOpen) return;

    this.isChatOpen = false;

    this.chatbotToggleBtn.setAttribute('aria-expanded', 'false');
    this.chatbotToggleBtn.classList.remove('is-active');
    if (this.chatIconBubble && this.chatIconClose) {
      this.chatIconBubble.style.display = 'flex';
      this.chatIconClose.style.display = 'none';
    }

    this.chatPanel.classList.remove('is-open');
    this.chatPanel.style.pointerEvents = 'none';
    setTimeout(() => {
      if (!this.isChatOpen) {
        this.chatPanel.setAttribute('hidden', '');
      }
    }, 260);

    this.chatbotToggleBtn.focus();
  }

  /**
   * Render the welcome message with immediate contact options
   */
  renderWelcomeWithContactOptions() {
    const waUrl = this.buildWaUrl();
    const phoneUrl = this.buildPhoneUrl();
    const emailUrl = this.buildEmailUrl();

    const welcomeRow = document.createElement('div');
    welcomeRow.className = 'chat-message-row msg-assistant';
    welcomeRow.innerHTML = `
      <div class="msg-avatar" aria-hidden="true">M</div>
      <div class="msg-bubble">
        <p>${this.chatbotConfig.welcomeMessage || 'Hi there! 👋 How can we help you today?'}</p>
        <div class="msg-contact-actions">
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="msg-action-pill pill-whatsapp">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2"/>
            </svg>
            <span>WhatsApp Us</span>
          </a>
          <a href="${phoneUrl}" class="msg-action-pill pill-phone">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <span>Call Us</span>
          </a>
          <a href="${emailUrl}" class="msg-action-pill pill-email">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span>Email Us</span>
          </a>
          <button type="button" class="msg-action-pill pill-book" data-chat-action="book-photoshoot">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>Book a Photoshoot</span>
          </button>
        </div>
        <time class="msg-time">${this.formatCurrentTime()}</time>
      </div>
    `;
    this.messagesContainer.appendChild(welcomeRow);
    this.scrollToBottom();
  }

  /**
   * Messaging Handlers
   */
  handleUserSubmit() {
    if (!this.textInput || this.isTyping) return;

    const rawText = this.textInput.value.trim();
    if (!rawText) {
      this.textInput.classList.add('is-invalid');
      setTimeout(() => this.textInput.classList.remove('is-invalid'), 600);
      return;
    }

    this.textInput.value = '';
    this.appendUserMessage(rawText);
    this.processInquiry(rawText);
  }

  handleQuickReply(replyId, label, chipBtn) {
    if (this.isTyping) return;

    if (chipBtn) {
      chipBtn.disabled = true;
      chipBtn.classList.add('is-fading-out');

      this.clickedQuickReplyIds.add(replyId);
      try {
        sessionStorage.setItem('myugc_clicked_replies', JSON.stringify([...this.clickedQuickReplyIds]));
      } catch (e) {
        // Ignore storage errors
      }

      setTimeout(() => {
        chipBtn.remove();
        if (this.quickRepliesTrack) {
          const remaining = this.quickRepliesTrack.querySelectorAll('.quick-chip-btn:not(.is-fading-out)');
          if (remaining.length === 0) {
            this.quickRepliesTrack.classList.add('is-hidden');
            this.quickRepliesTrack.setAttribute('hidden', '');
          }
        }
      }, 200);
    }

    this.appendUserMessage(label);

    const match = (this.chatbotConfig.quickReplies || []).find((q) => q.id === replyId);
    if (match) {
      this.showAssistantTypingThenReply(match.reply, true);
    } else {
      this.showAssistantTypingThenReplyWithContact(this.chatbotConfig.fallbackReply);
    }
  }

  /**
   * Rule-based inquiry processor — always steers towards contact
   */
  async processInquiry(userText) {
    const textLower = userText.toLowerCase();

    // Services
    if (
      textLower.includes('service') ||
      textLower.includes('ugc') ||
      textLower.includes('video') ||
      textLower.includes('photo') ||
      textLower.includes('lifestyle') ||
      textLower.includes('content') ||
      textLower.includes('ad') ||
      textLower.includes('reel')
    ) {
      const q = this.getQuickReply('services');
      this.showAssistantTypingThenReplyWithContact(q ? q.reply : this.chatbotConfig.fallbackReply);
      return;
    }

    // Pricing
    if (
      textLower.includes('price') ||
      textLower.includes('cost') ||
      textLower.includes('budget') ||
      textLower.includes('rate') ||
      textLower.includes('quote') ||
      textLower.includes('package') ||
      textLower.includes('pricing')
    ) {
      const q = this.getQuickReply('custom-quote');
      this.showAssistantTypingThenReplyWithContact(q ? q.reply : this.chatbotConfig.fallbackReply);
      return;
    }

    // Timeline / turnaround
    if (
      textLower.includes('timeline') ||
      textLower.includes('turnaround') ||
      textLower.includes('time') ||
      textLower.includes('how long') ||
      textLower.includes('delivery') ||
      textLower.includes('deadline')
    ) {
      const q = this.getQuickReply('turnaround');
      this.showAssistantTypingThenReplyWithContact(q ? q.reply : this.chatbotConfig.fallbackReply);
      return;
    }

    // Contact / connect
    if (
      textLower.includes('contact') ||
      textLower.includes('whatsapp') ||
      textLower.includes('call') ||
      textLower.includes('email') ||
      textLower.includes('reach') ||
      textLower.includes('talk') ||
      textLower.includes('speak') ||
      textLower.includes('human') ||
      textLower.includes('help') ||
      textLower.includes('book')
    ) {
      this.showAssistantTypingThenReplyWithContact(
        'Here are the quickest ways to reach our team directly:'
      );
      return;
    }

    // Fallback — always show contact options
    this.showAssistantTypingThenReplyWithContact(this.chatbotConfig.fallbackReply);
  }

  getQuickReply(id) {
    return (this.chatbotConfig.quickReplies || []).find((q) => q.id === id);
  }

  showAssistantTypingThenReply(replyText, includeContactButtons = false) {
    this.isTyping = true;
    this.typingIndicator.removeAttribute('hidden');
    this.scrollToBottom();

    const delay = this.chatbotConfig.typingDelayMs || 500;

    setTimeout(() => {
      this.typingIndicator.setAttribute('hidden', '');
      this.isTyping = false;
      if (includeContactButtons) {
        this.appendAssistantMessageWithContact(replyText);
      } else {
        this.appendAssistantMessage(replyText, false);
      }
    }, delay);
  }

  showAssistantTypingThenReplyWithContact(replyText) {
    this.showAssistantTypingThenReply(replyText, true);
  }

  appendUserMessage(text) {
    const row = document.createElement('div');
    row.className = 'chat-message-row msg-user';
    row.innerHTML = `
      <div class="msg-bubble">
        <p>${this.escapeHtml(text)}</p>
        <time class="msg-time">${this.formatCurrentTime()}</time>
      </div>
    `;
    this.messagesContainer.appendChild(row);
    this.scrollToBottom();
  }

  appendAssistantMessage(text, includeActionButtons = false) {
    const row = document.createElement('div');
    row.className = 'chat-message-row msg-assistant';

    row.innerHTML = `
      <div class="msg-avatar" aria-hidden="true">M</div>
      <div class="msg-bubble">
        <p>${text}</p>
        <time class="msg-time">${this.formatCurrentTime()}</time>
      </div>
    `;
    this.messagesContainer.appendChild(row);
    this.scrollToBottom();
  }

  appendAssistantMessageWithContact(text) {
    const waUrl = this.buildWaUrl();
    const phoneUrl = this.buildPhoneUrl();
    const emailUrl = this.buildEmailUrl();

    const row = document.createElement('div');
    row.className = 'chat-message-row msg-assistant';
    row.innerHTML = `
      <div class="msg-avatar" aria-hidden="true">M</div>
      <div class="msg-bubble">
        <p>${text}</p>
        <div class="msg-contact-actions">
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="msg-action-pill pill-whatsapp">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2"/>
            </svg>
            <span>WhatsApp Us</span>
          </a>
          <a href="${phoneUrl}" class="msg-action-pill pill-phone">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <span>Call Us</span>
          </a>
          <a href="${emailUrl}" class="msg-action-pill pill-email">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span>Email Us</span>
          </a>
          <button type="button" class="msg-action-pill pill-book" data-chat-action="book-photoshoot">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>Book a Photoshoot</span>
          </button>
        </div>
        <time class="msg-time">${this.formatCurrentTime()}</time>
      </div>
    `;
    this.messagesContainer.appendChild(row);
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  }

  formatCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}
