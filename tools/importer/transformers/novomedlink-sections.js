/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: novomedlink sections.
 * Adds section breaks and section-metadata blocks based on template sections.
 * Runs in afterTransform only.
 * Selectors from captured DOM of https://www.novomedlink.com/semaglutide/patient-safety.html
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const { document } = payload;
    const sections = payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to avoid offset issues
    const reversedSections = [...sections].reverse();

    for (const section of reversedSections) {
      const selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;

      for (const sel of selectorList) {
        try {
          // Try CSS selector first
          sectionEl = element.querySelector(sel);
        } catch (e) {
          // If CSS selector fails (e.g. unescaped special chars in IDs), try getElementById
          if (sel.startsWith('#')) {
            sectionEl = document.getElementById(sel.slice(1));
          }
        }
        if (sectionEl) break;
      }

      if (!sectionEl) continue;

      // Add section-metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(sectionMetadata);
      }

      // Add section break (hr) before this section if it's not the first
      if (section.id !== sections[0].id) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
