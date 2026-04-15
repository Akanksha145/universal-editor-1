/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import columnsMediaParser from './parsers/columns-media.js';
import heroBannerParser from './parsers/hero-banner.js';
import cardsResourceParser from './parsers/cards-resource.js';

// TRANSFORMER IMPORTS
import novomedlinkCleanupTransformer from './transformers/novomedlink-cleanup.js';
import novomedlinkSectionsTransformer from './transformers/novomedlink-sections.js';

// PARSER REGISTRY
const parsers = {
  'columns-media': columnsMediaParser,
  'hero-banner': heroBannerParser,
  'cards-resource': cardsResourceParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'patient-safety-page',
  description: 'Patient safety information page for semaglutide medication',
  urls: [
    'https://www.novomedlink.com/semaglutide/patient-safety.html',
  ],
  blocks: [
    {
      name: 'columns-media',
      instances: [
        '.cmp-experiencefragment--banner .cmp-container',
      ],
    },
    {
      name: 'hero-banner',
      instances: [
        '#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_721834245',
      ],
    },
    {
      name: 'cards-resource',
      instances: [
        '.resources-container .cmp-container',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Alert Banner',
      selector: '#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab .cmp-experiencefragment--banner',
      style: 'light-blue',
      blocks: ['columns-media'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Hero',
      selector: '#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_721834245',
      style: null,
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Our Promise',
      selector: '#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_1161268920',
      style: null,
      blocks: ['columns-media'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Warning Callout',
      selector: '#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_996920350',
      style: null,
      blocks: ['columns-media'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'Video - Get the Real Thing',
      selector: '#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_770053700_copy_',
      style: null,
      blocks: ['columns-media'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Article - Truth About Compounded',
      selector: '#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_770053700_copy__841141511',
      style: null,
      blocks: ['columns-media'],
      defaultContent: [],
    },
    {
      id: 'section-7',
      name: 'Article - Expert Warnings',
      selector: '#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_770053700_copy__501416395',
      style: null,
      blocks: ['columns-media'],
      defaultContent: [],
    },
    {
      id: 'section-8',
      name: 'Video - Healthcare Providers',
      selector: '#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_770053700_copy__414472572',
      style: null,
      blocks: ['columns-media'],
      defaultContent: [],
    },
    {
      id: 'section-9',
      name: 'Article - Counterfeit Risks',
      selector: '#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_770053700_copy__2087236365',
      style: null,
      blocks: ['columns-media'],
      defaultContent: [],
    },
    {
      id: 'section-10',
      name: 'Video - Our Commitment',
      selector: '#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_770053700',
      style: null,
      blocks: ['columns-media'],
      defaultContent: [],
    },
    {
      id: 'section-11',
      name: 'Article - Semaglutide FAQ',
      selector: '#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_770053700_copy__1157007228',
      style: null,
      blocks: ['columns-media'],
      defaultContent: [],
    },
    {
      id: 'section-12',
      name: 'Read Our Perspectives',
      selector: '#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_2041321565',
      style: null,
      blocks: ['cards-resource'],
      defaultContent: [
        '#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_2041321565-content-title',
      ],
    },
    {
      id: 'section-13',
      name: 'ISI',
      selector: '.isi',
      style: null,
      blocks: [],
      defaultContent: ['.isi'],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  novomedlinkCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [novomedlinkSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      let elements;
      try {
        elements = document.querySelectorAll(selector);
      } catch (e) {
        // Handle selectors with special chars in IDs
        if (selector.startsWith('#')) {
          const el = document.getElementById(selector.slice(1));
          elements = el ? [el] : [];
        } else {
          elements = [];
        }
      }
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
