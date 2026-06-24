/* ============================================================
   FAQ ACCORDION
   js/faq.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item, index) => {
    const question = item.querySelector('.faq-question');
    const answer   = item.querySelector('.faq-answer');

    // Accessibility setup
    const questionId = `faq-q-${index}`;
    const answerId   = `faq-a-${index}`;
    question?.setAttribute('id', questionId);
    question?.setAttribute('aria-controls', answerId);
    question?.setAttribute('aria-expanded', 'false');
    answer?.setAttribute('id', answerId);
    answer?.setAttribute('role', 'region');
    answer?.setAttribute('aria-labelledby', questionId);

    question?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('open')) {
          otherItem.classList.remove('open');
          const q = otherItem.querySelector('.faq-question');
          q?.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('open', !isOpen);
      question?.setAttribute('aria-expanded', String(!isOpen));
    });

    // Keyboard: Enter / Space
    question?.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
      // Arrow key navigation
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextQ = faqItems[index + 1]?.querySelector('.faq-question');
        nextQ?.focus();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevQ = faqItems[index - 1]?.querySelector('.faq-question');
        prevQ?.focus();
      }
      if (e.key === 'Home') {
        e.preventDefault();
        faqItems[0]?.querySelector('.faq-question')?.focus();
      }
      if (e.key === 'End') {
        e.preventDefault();
        faqItems[faqItems.length - 1]?.querySelector('.faq-question')?.focus();
      }
    });
  });
});
