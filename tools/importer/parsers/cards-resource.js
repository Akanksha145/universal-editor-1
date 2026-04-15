/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-resource. Base: cards (container block).
 * Source: https://www.novomedlink.com/semaglutide/patient-safety.html
 * UE Model: card items with fields: image (reference), text (richtext)
 * Block library: 2 columns per row. Each row = one card. Col1 = image, Col2 = text content.
 * Used for: PDF resource cards with date, description, and download button.
 */
export default function parse(element, { document }) {
  // Find all resource items within the resources container
  const resourceItems = element.querySelectorAll('.resource');
  const cells = [];

  resourceItems.forEach((resource) => {
    // Column 1: Image (resource preview) with field hint
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    // Resources are PDFs with no actual preview image, leave empty
    // but keep the cell for proper structure

    // Column 2: Text content (date + description + download link) with field hint
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    // Extract resource tag (PDF)
    const tag = resource.querySelector('.resource__tag');
    if (tag && tag.textContent.trim()) {
      const tagP = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = tag.textContent.trim();
      tagP.appendChild(strong);
      textFrag.appendChild(tagP);
    }

    // Extract date/title
    const title = resource.querySelector('.resource__title');
    if (title && title.textContent.trim()) {
      const titleP = document.createElement('p');
      titleP.textContent = title.textContent.trim();
      textFrag.appendChild(titleP);
    }

    // Extract description
    const desc = resource.querySelector('.resource__description');
    if (desc && desc.textContent.trim()) {
      const descP = document.createElement('p');
      descP.textContent = desc.textContent.trim();
      textFrag.appendChild(descP);
    }

    // Extract download link
    const downloadLink = resource.querySelector('.resource__bottom a');
    if (downloadLink) {
      const linkP = document.createElement('p');
      const a = downloadLink.cloneNode(false);
      const btnText = downloadLink.querySelector('.button-text');
      a.textContent = btnText ? btnText.textContent.trim() : downloadLink.textContent.trim();
      linkP.appendChild(a);
      textFrag.appendChild(linkP);
    }

    cells.push([imgFrag, textFrag]);
  });

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards-resource', cells });
    element.replaceWith(block);
  }
}
