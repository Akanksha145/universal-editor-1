var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-patient-safety-page.js
  var import_patient_safety_page_exports = {};
  __export(import_patient_safety_page_exports, {
    default: () => import_patient_safety_page_default
  });

  // tools/importer/parsers/columns-media.js
  function parse(element, { document }) {
    const flexContainer = element.querySelector(".cmp-container.flex, .cmp-container");
    const cells = [];
    if (flexContainer) {
      const gridEl = flexContainer.querySelector(".aem-Grid");
      const columnDivs = gridEl ? [...gridEl.children].filter((child) => child.classList.contains("container")) : [];
      if (columnDivs.length >= 2) {
        const col1Content = document.createDocumentFragment();
        const col2Content = document.createDocumentFragment();
        const col1 = columnDivs[0];
        extractColumnContent(col1, col1Content, document);
        const col2 = columnDivs[1];
        extractColumnContent(col2, col2Content, document);
        cells.push([col1Content, col2Content]);
      } else {
        const containers = element.querySelectorAll(":scope .cmp-container");
        if (containers.length >= 2) {
          const col1Content = document.createDocumentFragment();
          const col2Content = document.createDocumentFragment();
          extractColumnContent(containers[0], col1Content, document);
          extractColumnContent(containers[1], col2Content, document);
          cells.push([col1Content, col2Content]);
        } else {
          const allContent = document.createDocumentFragment();
          extractColumnContent(element, allContent, document);
          cells.push([allContent, ""]);
        }
      }
    } else {
      const allContent = document.createDocumentFragment();
      extractColumnContent(element, allContent, document);
      cells.push([allContent, ""]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-media", cells });
    element.replaceWith(block);
  }
  function extractColumnContent(container, frag, document) {
    const headings = container.querySelectorAll("h1, h2, h3, h4");
    headings.forEach((h) => {
      const clone = h.cloneNode(true);
      clone.querySelectorAll(".button-arrow, .button-arrow__line, .button-arrow__head, .button-icon").forEach((el) => el.remove());
      if (clone.textContent.trim()) frag.appendChild(clone);
    });
    const texts = container.querySelectorAll(".cmp-text p");
    texts.forEach((p) => {
      const clone = p.cloneNode(true);
      if (clone.textContent.trim()) frag.appendChild(clone);
    });
    const bgImg = container.querySelector(".background img");
    const cmpImg = container.querySelector(".cmp-image__image");
    const img = bgImg || cmpImg;
    if (img) {
      const picture = document.createElement("picture");
      const imgEl = img.cloneNode(true);
      picture.appendChild(imgEl);
      frag.appendChild(picture);
    }
    const videoPoster = container.querySelector(".cmp-video__poster");
    if (videoPoster && !img) {
      const picture = document.createElement("picture");
      picture.appendChild(videoPoster.cloneNode(true));
      frag.appendChild(picture);
    }
    const buttons = container.querySelectorAll(".nni-hcp--button a");
    buttons.forEach((a) => {
      const p = document.createElement("p");
      const link = a.cloneNode(false);
      const buttonText = a.querySelector(".button-text");
      link.textContent = buttonText ? buttonText.textContent.trim() : a.textContent.trim();
      p.appendChild(link);
      if (link.textContent.trim()) frag.appendChild(p);
    });
  }

  // tools/importer/parsers/hero-banner.js
  function parse2(element, { document }) {
    const bgImg = element.querySelector(".background img, img.cmp-image__image");
    const heading = element.querySelector("h1");
    const textElements = element.querySelectorAll(".cmp-text p");
    const ctaLink = element.querySelector(".nni-hcp--button-style--hero a, .nni-hcp--button a");
    const cells = [];
    if (bgImg) {
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:image "));
      imgFrag.appendChild(bgImg.cloneNode(true));
      cells.push([imgFrag]);
    } else {
      cells.push([""]);
    }
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(" field:text "));
    if (heading) textFrag.appendChild(heading.cloneNode(true));
    textElements.forEach((p) => {
      textFrag.appendChild(p.cloneNode(true));
    });
    if (ctaLink) {
      const p = document.createElement("p");
      const a = ctaLink.cloneNode(false);
      a.textContent = ctaLink.querySelector(".button-text") ? ctaLink.querySelector(".button-text").textContent : ctaLink.textContent.trim();
      p.appendChild(a);
      textFrag.appendChild(p);
    }
    cells.push([textFrag]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-resource.js
  function parse3(element, { document }) {
    const resourceItems = element.querySelectorAll(".resource");
    const cells = [];
    resourceItems.forEach((resource) => {
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:image "));
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      const tag = resource.querySelector(".resource__tag");
      if (tag && tag.textContent.trim()) {
        const tagP = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = tag.textContent.trim();
        tagP.appendChild(strong);
        textFrag.appendChild(tagP);
      }
      const title = resource.querySelector(".resource__title");
      if (title && title.textContent.trim()) {
        const titleP = document.createElement("p");
        titleP.textContent = title.textContent.trim();
        textFrag.appendChild(titleP);
      }
      const desc = resource.querySelector(".resource__description");
      if (desc && desc.textContent.trim()) {
        const descP = document.createElement("p");
        descP.textContent = desc.textContent.trim();
        textFrag.appendChild(descP);
      }
      const downloadLink = resource.querySelector(".resource__bottom a");
      if (downloadLink) {
        const linkP = document.createElement("p");
        const a = downloadLink.cloneNode(false);
        const btnText = downloadLink.querySelector(".button-text");
        a.textContent = btnText ? btnText.textContent.trim() : downloadLink.textContent.trim();
        linkP.appendChild(a);
        textFrag.appendChild(linkP);
      }
      cells.push([imgFrag, textFrag]);
    });
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, { name: "cards-resource", cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/transformers/novomedlink-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#ot-sdk-btn-floating",
        ".optanon-alert-box-wrapper",
        '[class*="cookie"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".therapeutic-areas__popup"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".search-modal-open-button"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        ".header.slab",
        "header.header-content",
        "section.subnav",
        ".mobile-references",
        ".desktop-references",
        "#footer",
        ".footer",
        ".account__actions",
        ".cart__toggle"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".cmp-experiencefragment--header"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".isi"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "link",
        "noscript",
        "iframe"
      ]);
      const spacers = element.querySelectorAll(".spacer");
      spacers.forEach((spacer) => {
        if (!spacer.textContent.trim()) spacer.remove();
      });
      WebImporter.DOMUtils.remove(element, [
        ".scroll-anchor"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("data-site");
        el.removeAttribute("data-error");
        el.removeAttribute("onclick");
      });
    }
  }

  // tools/importer/transformers/novomedlink-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const reversedSections = [...sections].reverse();
      for (const section of reversedSections) {
        const selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectorList) {
          try {
            sectionEl = element.querySelector(sel);
          } catch (e) {
            if (sel.startsWith("#")) {
              sectionEl = document.getElementById(sel.slice(1));
            }
          }
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (section.id !== sections[0].id) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-patient-safety-page.js
  var parsers = {
    "columns-media": parse,
    "hero-banner": parse2,
    "cards-resource": parse3
  };
  var PAGE_TEMPLATE = {
    name: "patient-safety-page",
    description: "Patient safety information page for semaglutide medication",
    urls: [
      "https://www.novomedlink.com/semaglutide/patient-safety.html"
    ],
    blocks: [
      {
        name: "columns-media",
        instances: [
          ".cmp-experiencefragment--banner .cmp-container"
        ]
      },
      {
        name: "hero-banner",
        instances: [
          "#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_721834245"
        ]
      },
      {
        name: "cards-resource",
        instances: [
          ".resources-container .cmp-container"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Alert Banner",
        selector: "#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab .cmp-experiencefragment--banner",
        style: "light-blue",
        blocks: ["columns-media"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Hero",
        selector: "#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_721834245",
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Our Promise",
        selector: "#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_1161268920",
        style: null,
        blocks: ["columns-media"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Warning Callout",
        selector: "#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_996920350",
        style: null,
        blocks: ["columns-media"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Video - Get the Real Thing",
        selector: "#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_770053700_copy_",
        style: null,
        blocks: ["columns-media"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Article - Truth About Compounded",
        selector: "#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_770053700_copy__841141511",
        style: null,
        blocks: ["columns-media"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Article - Expert Warnings",
        selector: "#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_770053700_copy__501416395",
        style: null,
        blocks: ["columns-media"],
        defaultContent: []
      },
      {
        id: "section-8",
        name: "Video - Healthcare Providers",
        selector: "#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_770053700_copy__414472572",
        style: null,
        blocks: ["columns-media"],
        defaultContent: []
      },
      {
        id: "section-9",
        name: "Article - Counterfeit Risks",
        selector: "#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_770053700_copy__2087236365",
        style: null,
        blocks: ["columns-media"],
        defaultContent: []
      },
      {
        id: "section-10",
        name: "Video - Our Commitment",
        selector: "#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_770053700",
        style: null,
        blocks: ["columns-media"],
        defaultContent: []
      },
      {
        id: "section-11",
        name: "Article - Semaglutide FAQ",
        selector: "#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_770053700_copy__1157007228",
        style: null,
        blocks: ["columns-media"],
        defaultContent: []
      },
      {
        id: "section-12",
        name: "Read Our Perspectives",
        selector: "#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_2041321565",
        style: null,
        blocks: ["cards-resource"],
        defaultContent: [
          "#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_2041321565-content-title"
        ]
      },
      {
        id: "section-13",
        name: "ISI",
        selector: ".isi",
        style: null,
        blocks: [],
        defaultContent: [".isi"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        let elements;
        try {
          elements = document.querySelectorAll(selector);
        } catch (e) {
          if (selector.startsWith("#")) {
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_patient_safety_page_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_patient_safety_page_exports);
})();
