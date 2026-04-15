/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-media. Base: columns.
 * Source: https://www.novomedlink.com/semaglutide/patient-safety.html
 * Columns blocks do NOT require field hints (xwalk exception).
 * Block library: multiple columns per row. Each cell = text, images, or inline elements.
 * Used for: alert banners, content+image pairs, video+text pairs, warning callouts.
 */
export default function parse(element, { document }) {
  // Find the flex container or main container with two columns
  const flexContainer = element.querySelector('.cmp-container.flex, .cmp-container');
  const cells = [];

  if (flexContainer) {
    // Look for the direct grid children (columns)
    const gridEl = flexContainer.querySelector('.aem-Grid');
    const columnDivs = gridEl
      ? [...gridEl.children].filter((child) => child.classList.contains('container'))
      : [];

    if (columnDivs.length >= 2) {
      // Two-column layout
      const col1Content = document.createDocumentFragment();
      const col2Content = document.createDocumentFragment();

      // Extract content from column 1
      const col1 = columnDivs[0];
      extractColumnContent(col1, col1Content, document);

      // Extract content from column 2
      const col2 = columnDivs[1];
      extractColumnContent(col2, col2Content, document);

      cells.push([col1Content, col2Content]);
    } else {
      // Fallback: treat whole element as single-column content pair
      // Look for container pairs at any depth
      const containers = element.querySelectorAll(':scope .cmp-container');
      if (containers.length >= 2) {
        const col1Content = document.createDocumentFragment();
        const col2Content = document.createDocumentFragment();
        extractColumnContent(containers[0], col1Content, document);
        extractColumnContent(containers[1], col2Content, document);
        cells.push([col1Content, col2Content]);
      } else {
        // Last resort: put all content in one cell
        const allContent = document.createDocumentFragment();
        extractColumnContent(element, allContent, document);
        cells.push([allContent, '']);
      }
    }
  } else {
    // No flex container found - extract what we can
    const allContent = document.createDocumentFragment();
    extractColumnContent(element, allContent, document);
    cells.push([allContent, '']);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-media', cells });
  element.replaceWith(block);
}

function extractColumnContent(container, frag, document) {
  // Extract headings
  const headings = container.querySelectorAll('h1, h2, h3, h4');
  headings.forEach((h) => {
    const clone = h.cloneNode(true);
    // Clean up inner spans and keep just text
    clone.querySelectorAll('.button-arrow, .button-arrow__line, .button-arrow__head, .button-icon').forEach((el) => el.remove());
    if (clone.textContent.trim()) frag.appendChild(clone);
  });

  // Extract paragraphs from .cmp-text
  const texts = container.querySelectorAll('.cmp-text p');
  texts.forEach((p) => {
    const clone = p.cloneNode(true);
    if (clone.textContent.trim()) frag.appendChild(clone);
  });

  // Extract images (background images or cmp-image)
  const bgImg = container.querySelector('.background img');
  const cmpImg = container.querySelector('.cmp-image__image');
  const img = bgImg || cmpImg;
  if (img) {
    const picture = document.createElement('picture');
    const imgEl = img.cloneNode(true);
    picture.appendChild(imgEl);
    frag.appendChild(picture);
  }

  // Extract video poster if present
  const videoPoster = container.querySelector('.cmp-video__poster');
  if (videoPoster && !img) {
    const picture = document.createElement('picture');
    picture.appendChild(videoPoster.cloneNode(true));
    frag.appendChild(picture);
  }

  // Extract CTA buttons/links
  const buttons = container.querySelectorAll('.nni-hcp--button a');
  buttons.forEach((a) => {
    const p = document.createElement('p');
    const link = a.cloneNode(false);
    const buttonText = a.querySelector('.button-text');
    link.textContent = buttonText ? buttonText.textContent.trim() : a.textContent.trim();
    p.appendChild(link);
    if (link.textContent.trim()) frag.appendChild(p);
  });
}
