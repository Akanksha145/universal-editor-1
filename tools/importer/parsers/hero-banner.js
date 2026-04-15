/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base: hero.
 * Source: https://www.novomedlink.com/semaglutide/patient-safety.html
 * UE Model fields: image (reference), imageAlt (collapsed), text (richtext)
 * Block library: 1 column, 2 content rows: row1=image, row2=text(heading+subheading+CTA)
 */
export default function parse(element, { document }) {
  // Extract background image from .background > img or .random-background
  const bgImg = element.querySelector('.background img, img.cmp-image__image');

  // Extract heading (h1)
  const heading = element.querySelector('h1');

  // Extract body text paragraphs (from .cmp-text)
  const textElements = element.querySelectorAll('.cmp-text p');

  // Extract CTA button
  const ctaLink = element.querySelector('.nni-hcp--button-style--hero a, .nni-hcp--button a');

  // Build cells: row 1 = image, row 2 = text content
  const cells = [];

  // Row 1: Background image with field hint
  if (bgImg) {
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    imgFrag.appendChild(bgImg.cloneNode(true));
    cells.push([imgFrag]);
  } else {
    cells.push(['']);
  }

  // Row 2: Text content (heading + paragraphs + CTA) with field hint
  const textFrag = document.createDocumentFragment();
  textFrag.appendChild(document.createComment(' field:text '));
  if (heading) textFrag.appendChild(heading.cloneNode(true));
  textElements.forEach((p) => {
    textFrag.appendChild(p.cloneNode(true));
  });
  if (ctaLink) {
    const p = document.createElement('p');
    const a = ctaLink.cloneNode(false);
    a.textContent = ctaLink.querySelector('.button-text')
      ? ctaLink.querySelector('.button-text').textContent
      : ctaLink.textContent.trim();
    p.appendChild(a);
    textFrag.appendChild(p);
  }
  cells.push([textFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
