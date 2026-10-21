/**
 * Accessible FAQ Accordion Controller
 * -----------------------------------
 * Supports single/multi expand, keyboard navigation (Arrow Up/Down, Enter/Space),
 * and proper ARIA states (aria-expanded, aria-controls).
 */

export class FaqAccordion {
  constructor(containerElement, faqsData) {
    this.container = containerElement;
    this.faqs = faqsData || [];
    this.init();
  }

  init() {
    if (!this.container || !this.faqs.length) return;
    this.render();
    this.bindEvents();
  }

  render() {
    const itemsHtml = this.faqs
      .map((faq, index) => {
        const itemNumber = String(index + 1).padStart(2, '0');
        const isFirst = index === 0;

        return `
        <div class="faq-item reveal-up reveal-wave-item ${isFirst ? 'is-open' : ''}" data-faq-index="${index}">
          <button 
            type="button" 
            class="faq-trigger" 
            id="faq-header-${index}"
            aria-expanded="${isFirst ? 'true' : 'false'}" 
            aria-controls="faq-content-${index}"
          >
            <span class="faq-num">${itemNumber}</span>
            <span class="faq-question">${faq.question}</span>
            <span class="faq-icon-wrapper" aria-hidden="true">
              <svg class="faq-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </button>

          <div 
            class="faq-panel" 
            id="faq-content-${index}" 
            role="region" 
            aria-labelledby="faq-header-${index}"
            aria-hidden="${isFirst ? 'false' : 'true'}"
          >
            <div class="faq-panel-inner">
              <p class="faq-answer">${faq.answer}</p>
            </div>
          </div>
        </div>
      `;
      })
      .join('');

    this.container.innerHTML = `<div class="faq-list">${itemsHtml}</div>`;
  }

  bindEvents() {
    const items = this.container.querySelectorAll('.faq-item');

    items.forEach((item, index) => {
      const trigger = item.querySelector('.faq-trigger');
      const panel = item.querySelector('.faq-panel');

      trigger?.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        // Toggle state with silky smooth CSS grid transition
        if (isOpen) {
          item.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
          panel?.setAttribute('aria-hidden', 'true');
        } else {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
          panel?.setAttribute('aria-hidden', 'false');
        }
      });

      trigger?.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIndex = (index + 1) % items.length;
          items[nextIndex].querySelector('.faq-trigger')?.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIndex = (index - 1 + items.length) % items.length;
          items[prevIndex].querySelector('.faq-trigger')?.focus();
        } else if (e.key === 'Home') {
          e.preventDefault();
          items[0].querySelector('.faq-trigger')?.focus();
        } else if (e.key === 'End') {
          e.preventDefault();
          items[items.length - 1].querySelector('.faq-trigger')?.focus();
        }
      });
    });
  }
}
