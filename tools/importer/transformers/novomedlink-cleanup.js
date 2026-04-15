/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: novomedlink cleanup.
 * Selectors from captured DOM of https://www.novomedlink.com/semaglutide/patient-safety.html
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Cookie consent dialogs (OneTrust)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#ot-sdk-btn-floating',
      '.optanon-alert-box-wrapper',
      '[class*="cookie"]',
    ]);

    // Therapeutic areas popup
    WebImporter.DOMUtils.remove(element, [
      '.therapeutic-areas__popup',
    ]);

    // Search modal
    WebImporter.DOMUtils.remove(element, [
      '.search-modal-open-button',
    ]);
  }

  if (hookName === H.after) {
    // Remove non-authorable site chrome: header, footer, subnav, cart
    WebImporter.DOMUtils.remove(element, [
      '.header.slab',
      'header.header-content',
      'section.subnav',
      '.mobile-references',
      '.desktop-references',
      '#footer',
      '.footer',
      '.account__actions',
      '.cart__toggle',
    ]);

    // Remove semaglutide sticky header experience fragment
    WebImporter.DOMUtils.remove(element, [
      '.cmp-experiencefragment--header',
    ]);

    // Remove ISI (Important Safety Information) - separate content
    WebImporter.DOMUtils.remove(element, [
      '.isi',
    ]);

    // Remove non-content elements
    WebImporter.DOMUtils.remove(element, [
      'link',
      'noscript',
      'iframe',
    ]);

    // Remove spacer divs
    const spacers = element.querySelectorAll('.spacer');
    spacers.forEach((spacer) => {
      if (!spacer.textContent.trim()) spacer.remove();
    });

    // Remove scroll anchors
    WebImporter.DOMUtils.remove(element, [
      '.scroll-anchor',
    ]);

    // Clean up data attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('data-site');
      el.removeAttribute('data-error');
      el.removeAttribute('onclick');
    });
  }
}
