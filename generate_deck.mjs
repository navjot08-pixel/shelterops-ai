import pptxgen from 'pptxgenjs';
import fs from 'fs';
import path from 'path';

async function buildPresentation() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9'; // 10.0 x 5.625 inches
  pres.title = 'ShelterOps AI - Presentation Deck';
  pres.author = 'Navjot, Kovuru Rajoob, Arpit Kumar';
  pres.subject = 'CSE276 Artificial Intelligence Foundations';

  // Design Tokens
  const C = {
    navyBg: '0B1F3A',
    cardDark: '132644',
    cardBorder: '1E3A66',
    primaryBlue: '1E6FD9',
    secondaryBlue: '8EC5FF',
    accentOrange: 'FF8A3D',
    white: 'FFFFFF',
    textMuted: '94A3B8',
    textDim: '64748B',
    tagPlannedBg: '242C44',
    tagPlannedText: 'CBD5E1',
    tagPlannedBorder: '475569',
    tableHeaderBg: '16335C',
    tableBorder: '254575',
    calloutBg: '162846',
    calloutBorder: 'FF8A3D',
  };

  const FONT_HEADING = 'Segoe UI';
  const FONT_BODY = 'Segoe UI';

  // Helper for Slide Headers
  function addHeader(slide, titleText, subtitleCategory, slideNum) {
    // Title
    slide.addText(titleText, {
      x: 0.8,
      y: 0.38,
      w: 8.4,
      h: 0.42,
      fontFace: FONT_HEADING,
      fontSize: 22,
      bold: true,
      color: C.white,
      margin: 0,
    });

    // Orange accent bar under title
    slide.addShape(pres.ShapeType.rect, {
      x: 0.8,
      y: 0.82,
      w: 1.1,
      h: 0.04,
      fill: { color: C.accentOrange },
      line: { color: C.accentOrange },
    });

    // Subtitle category indicator
    if (subtitleCategory) {
      slide.addText(subtitleCategory, {
        x: 2.1,
        y: 0.77,
        w: 7.1,
        h: 0.22,
        fontFace: FONT_BODY,
        fontSize: 10,
        color: C.secondaryBlue,
        margin: 0,
      });
    }

    // Footer divider line
    slide.addShape(pres.ShapeType.rect, {
      x: 0.8,
      y: 5.18,
      w: 8.4,
      h: 0.01,
      fill: { color: '182E4E' },
      line: { color: '182E4E' },
    });

    // Footer left
    slide.addText('ShelterOps AI | CSE276 – Artificial Intelligence Foundations', {
      x: 0.8,
      y: 5.22,
      w: 6.0,
      h: 0.25,
      fontFace: FONT_BODY,
      fontSize: 9,
      color: C.textDim,
      margin: 0,
    });

    // Footer right (slide number)
    if (slideNum) {
      slide.addText(`Slide ${slideNum} of 12`, {
        x: 7.6,
        y: 5.22,
        w: 1.6,
        h: 0.25,
        fontFace: FONT_BODY,
        fontSize: 9,
        color: C.textDim,
        align: 'right',
        margin: 0,
      });
    }
  }

  // Helper for Status Tag Legend
  function addStatusTagLegend(slide, yPos = 4.88) {
    slide.addShape(pres.ShapeType.rect, {
      x: 0.8,
      y: yPos,
      w: 8.4,
      h: 0.26,
      fill: { color: '0D203C' },
      line: { color: '1C3860', width: 0.5 },
      roundRadius: 0.04,
    });

    slide.addText(
      'STATUS TAG LEGEND:  [IMPLEMENTED] Code Complete  |  [SIMULATED] Sample/Synthetic Data  |  [API-CONNECTED] Live Cloud Feed  |  [PLANNED] Proposed Scope',
      {
        x: 0.9,
        y: yPos + 0.02,
        w: 8.2,
        h: 0.22,
        fontFace: FONT_BODY,
        fontSize: 8.5,
        color: C.secondaryBlue,
        align: 'center',
        margin: 0,
      }
    );
  }

  // ==========================================
  // SLIDE 1: TITLE SLIDE
  // ==========================================
  {
    const s1 = pres.addSlide();
    s1.background = { color: C.navyBg };

    // Background geometric visual accent (radar concentric rings & grid)
    s1.addShape(pres.ShapeType.ellipse, {
      x: 6.8,
      y: 0.6,
      w: 4.4,
      h: 4.4,
      line: { color: '16335C', width: 1.5, dashType: 'dash' },
      fill: { color: '0E2342' },
    });
    s1.addShape(pres.ShapeType.ellipse, {
      x: 7.4,
      y: 1.2,
      w: 3.2,
      h: 3.2,
      line: { color: '1B4075', width: 1 },
      fill: { color: '11294C' },
    });
    s1.addShape(pres.ShapeType.ellipse, {
      x: 8.1,
      y: 1.9,
      w: 1.8,
      h: 1.8,
      line: { color: C.primaryBlue, width: 1.5 },
      fill: { color: '163462' },
    });

    // Decorative map badge on visual side
    s1.addShape(pres.ShapeType.rect, {
      x: 7.3,
      y: 2.1,
      w: 2.1,
      h: 1.4,
      fill: { color: '0B1F3A' },
      line: { color: C.accentOrange, width: 1 },
      roundRadius: 0.08,
    });
    s1.addText('PAN-INDIA DISASTER MATRIX', {
      x: 7.35,
      y: 2.2,
      w: 2.0,
      h: 0.2,
      fontFace: FONT_HEADING,
      fontSize: 8,
      bold: true,
      color: C.accentOrange,
      align: 'center',
      margin: 0,
    });
    s1.addText('28 States | 8 UTs\nExclusion Zone Safety\nDynamic Bed Triage', {
      x: 7.35,
      y: 2.45,
      w: 2.0,
      h: 0.9,
      fontFace: FONT_BODY,
      fontSize: 9,
      color: C.secondaryBlue,
      align: 'center',
      lineSpacing: 14,
      margin: 0,
    });

    // Main Title Zone (Left)
    s1.addShape(pres.ShapeType.rect, {
      x: 0.8,
      y: 0.85,
      w: 1.8,
      h: 0.28,
      fill: { color: '16335C' },
      line: { color: C.primaryBlue, width: 1 },
      roundRadius: 0.04,
    });
    s1.addText('DECISION-SUPPORT PROTOTYPE', {
      x: 0.85,
      y: 0.89,
      w: 1.7,
      h: 0.2,
      fontFace: FONT_HEADING,
      fontSize: 8.5,
      bold: true,
      color: C.secondaryBlue,
      align: 'center',
      margin: 0,
    });

    s1.addText('ShelterOps AI', {
      x: 0.8,
      y: 1.25,
      w: 6.0,
      h: 0.7,
      fontFace: FONT_HEADING,
      fontSize: 36,
      bold: true,
      color: C.white,
      margin: 0,
    });

    // Orange accent bar under title
    s1.addShape(pres.ShapeType.rect, {
      x: 0.8,
      y: 2.0,
      w: 2.2,
      h: 0.05,
      fill: { color: C.accentOrange },
      line: { color: C.accentOrange },
    });

    s1.addText('AI-Based Disaster Prediction and Smart Shelter Allocation System', {
      x: 0.8,
      y: 2.15,
      w: 5.8,
      h: 0.5,
      fontFace: FONT_BODY,
      fontSize: 15,
      color: C.secondaryBlue,
      margin: 0,
    });

    // Course & Faculty Card
    s1.addShape(pres.ShapeType.rect, {
      x: 0.8,
      y: 2.85,
      w: 5.8,
      h: 0.8,
      fill: { color: C.cardDark },
      line: { color: C.cardBorder, width: 1 },
      roundRadius: 0.08,
    });
    s1.addText('ACADEMIC AFFILIATION', {
      x: 1.0,
      y: 2.95,
      w: 5.4,
      h: 0.2,
      fontFace: FONT_HEADING,
      fontSize: 8.5,
      bold: true,
      color: C.accentOrange,
      margin: 0,
    });
    s1.addText('Course: CSE276 – Artificial Intelligence Foundations\nFaculty Guide: Ayushi Bhakuni', {
      x: 1.0,
      y: 3.18,
      w: 5.4,
      h: 0.4,
      fontFace: FONT_BODY,
      fontSize: 10.5,
      color: C.white,
      lineSpacing: 15,
      margin: 0,
    });

    // Team Card
    s1.addShape(pres.ShapeType.rect, {
      x: 0.8,
      y: 3.8,
      w: 5.8,
      h: 1.2,
      fill: { color: C.cardDark },
      line: { color: C.cardBorder, width: 1 },
      roundRadius: 0.08,
    });
    s1.addText('PROJECT TEAM MEMBERS', {
      x: 1.0,
      y: 3.9,
      w: 5.4,
      h: 0.2,
      fontFace: FONT_HEADING,
      fontSize: 8.5,
      bold: true,
      color: C.accentOrange,
      margin: 0,
    });
    s1.addText('1. Navjot  —  Reg. No. 12506248\n2. Kovuru Rajoob  —  Reg. No. 12505486\n3. Arpit Kumar  —  Reg. No. 12529290', {
      x: 1.0,
      y: 4.15,
      w: 5.4,
      h: 0.75,
      fontFace: FONT_BODY,
      fontSize: 10.5,
      color: C.white,
      lineSpacing: 16,
      margin: 0,
    });

    // Speaker Notes (75 words)
    s1.addNotes(
      'Good morning, esteemed faculty member Ayushi Bhakuni and fellow classmates. Today, our team—Navjot, Kovuru Rajoob, and Arpit Kumar—presents ShelterOps AI, our course project for CSE276: Artificial Intelligence Foundations. This project explores how computational intelligence, constraint optimization, and multi-agent coordination can support disaster preparedness and smart shelter allocation across India. We will walk you through the system architecture, mathematical formulations, and evaluation plan for this decision-support prototype.'
    );
  }

  // ==========================================
  // SLIDE 2: INTRODUCTION
  // ==========================================
  {
    const s2 = pres.addSlide();
    s2.background = { color: C.navyBg };
    addHeader(s2, "Disaster Vulnerability and Response in India", "PROBLEM CONTEXT & MOTIVATION", 2);

    // Context description (max 12 words per line)
    s2.addText('India faces severe, recurring natural hazards that disproportionately affect dense settlements.', {
      x: 0.8,
      y: 1.05,
      w: 8.4,
      h: 0.25,
      fontFace: FONT_BODY,
      fontSize: 12,
      color: C.secondaryBlue,
      margin: 0,
    });

    // 5 Hazard Cards horizontally
    const hazards = [
      { name: 'Floods', desc: 'River basin inundation affecting northern and eastern plains.', color: '1E6FD9' },
      { name: 'Earthquakes', desc: 'Seismic activity along Himalayan and active regional faultlines.', color: 'FF8A3D' },
      { name: 'Cyclones', desc: 'Severe coastal landfalls along the Bay of Bengal and Arabian Sea.', color: '10B981' },
      { name: 'Landslides', desc: 'Monsoon slope failures blocking critical mountain transport routes.', color: 'F59E0B' },
      { name: 'Forest Fires', desc: 'Dry season blazes threatening vulnerable hilly ecosystems.', color: 'EF4444' },
    ];

    hazards.forEach((h, idx) => {
      const cardX = 0.8 + idx * 1.72;
      s2.addShape(pres.ShapeType.rect, {
        x: cardX,
        y: 1.38,
        w: 1.58,
        h: 1.55,
        fill: { color: C.cardDark },
        line: { color: C.cardBorder, width: 1 },
        roundRadius: 0.08,
      });

      // Top color indicator bar
      s2.addShape(pres.ShapeType.rect, {
        x: cardX,
        y: 1.38,
        w: 1.58,
        h: 0.08,
        fill: { color: h.color },
        line: { color: h.color },
      });

      s2.addText(h.name, {
        x: cardX + 0.1,
        y: 1.55,
        w: 1.38,
        h: 0.25,
        fontFace: FONT_HEADING,
        fontSize: 12,
        bold: true,
        color: C.white,
        margin: 0,
      });

      s2.addText(h.desc, {
        x: cardX + 0.1,
        y: 1.85,
        w: 1.38,
        h: 0.98,
        fontFace: FONT_BODY,
        fontSize: 9.5,
        color: C.secondaryBlue,
        lineSpacing: 13,
        margin: 0,
      });
    });

    // Core Difficulty Card
    s2.addShape(pres.ShapeType.rect, {
      x: 0.8,
      y: 3.12,
      w: 8.4,
      h: 0.92,
      fill: { color: '142646' },
      line: { color: '23426F', width: 1 },
      roundRadius: 0.08,
    });
    s2.addText('THE CORE LOGISTICAL CHALLENGE', {
      x: 1.0,
      y: 3.22,
      w: 8.0,
      h: 0.2,
      fontFace: FONT_HEADING,
      fontSize: 9,
      bold: true,
      color: C.accentOrange,
      margin: 0,
    });
    s2.addText(
      '• Rapidly identifying vulnerable populations under high uncertainty before hazard impact.\n• Dynamically allocating people across shelters without exceeding capacity or safety perimeters.',
      {
        x: 1.0,
        y: 3.44,
        w: 8.0,
        h: 0.52,
        fontFace: FONT_BODY,
        fontSize: 11,
        color: C.white,
        lineSpacing: 16,
        margin: 0,
      }
    );

    // Highlighted Callout Statement
    s2.addShape(pres.ShapeType.rect, {
      x: 0.8,
      y: 4.18,
      w: 8.4,
      h: 0.82,
      fill: { color: '0E2B52' },
      line: { color: C.accentOrange, width: 1.5 },
      roundRadius: 0.08,
    });
    s2.addText(
      'INTRODUCING SHELTEROPS AI:\nAn AI-assisted decision-support prototype for proactive disaster prediction and smart shelter allocation.',
      {
        x: 1.0,
        y: 4.26,
        w: 8.0,
        h: 0.45,
        fontFace: FONT_HEADING,
        fontSize: 11.5,
        bold: true,
        color: C.white,
        margin: 0,
      }
    );
    s2.addText('Note: Designed to support and assist, not replace, official authorities (NDMA, SDMAs, IMD).', {
      x: 1.0,
      y: 4.74,
      w: 8.0,
      h: 0.2,
      fontFace: FONT_BODY,
      fontSize: 9,
      color: C.secondaryBlue,
      margin: 0,
    });

    // Speaker Notes (72 words)
    s2.addNotes(
      "India's geographical diversity exposes various states to catastrophic natural hazards, from recurring Brahmaputra floods to severe coastal cyclones and Himalayan landslides. In sudden-onset crises, district collectors and emergency teams face a critical challenge: rapidly identifying vulnerable populations and assigning safe shelters without overcrowding facilities or putting citizens into hazardous zones. ShelterOps AI was conceived to address this bottleneck as a decision-support prototype, assisting official authorities like the NDMA and SDMAs with automated spatial and capacity planning."
    );
  }

  // ==========================================
  // SLIDE 3: OBJECTIVES AND SCOPE
  // ==========================================
  {
    const s3 = pres.addSlide();
    s3.background = { color: C.navyBg };
    addHeader(s3, "Project Objectives and Scope", "SYSTEM GOALS & BOUNDARIES", 3);

    // Left Column: Objectives (5 points, max 12 words per bullet)
    s3.addShape(pres.ShapeType.rect, {
      x: 0.8,
      y: 1.15,
      w: 4.05,
      h: 3.85,
      fill: { color: C.cardDark },
      line: { color: C.cardBorder, width: 1 },
      roundRadius: 0.08,
    });

    s3.addText('CORE OBJECTIVES', {
      x: 1.0,
      y: 1.3,
      w: 3.65,
      h: 0.25,
      fontFace: FONT_HEADING,
      fontSize: 12,
      bold: true,
      color: C.accentOrange,
      margin: 0,
    });

    const objectives = [
      { num: '1', title: 'Predict Disaster Risk', desc: 'Estimate hazard likelihood across multi-horizon timeframes.' },
      { num: '2', title: 'Identify High-Risk Zones', desc: 'Pinpoint vulnerable districts and estimate exposed population counts.' },
      { num: '3', title: 'Locate Safe Shelters', desc: 'Continuously track shelter capacity, occupancy, and medical triage.' },
      { num: '4', title: 'Allocate Populations', desc: 'Solve multi-objective constraints to distribute evacuees safely.' },
      { num: '5', title: 'Recommend Safe Routes', desc: 'Plan clear evacuation paths while actively avoiding hazard zones.' },
    ];

    objectives.forEach((obj, idx) => {
      const rowY = 1.65 + idx * 0.64;
      s3.addShape(pres.ShapeType.ellipse, {
        x: 1.0,
        y: rowY + 0.02,
        w: 0.24,
        h: 0.24,
        fill: { color: C.primaryBlue },
        line: { color: C.secondaryBlue, width: 0.5 },
      });
      s3.addText(obj.num, {
        x: 1.0,
        y: rowY + 0.03,
        w: 0.24,
        h: 0.22,
        fontFace: FONT_HEADING,
        fontSize: 9,
        bold: true,
        color: C.white,
        align: 'center',
        margin: 0,
      });

      s3.addText(obj.title, {
        x: 1.32,
        y: rowY,
        w: 3.35,
        h: 0.22,
        fontFace: FONT_HEADING,
        fontSize: 11,
        bold: true,
        color: C.white,
        margin: 0,
      });
      s3.addText(obj.desc, {
        x: 1.32,
        y: rowY + 0.22,
        w: 3.35,
        h: 0.35,
        fontFace: FONT_BODY,
        fontSize: 9.5,
        color: C.secondaryBlue,
        margin: 0,
      });
    });

    // Right Column: Scope (4 points)
    s3.addShape(pres.ShapeType.rect, {
      x: 5.15,
      y: 1.15,
      w: 4.05,
      h: 3.85,
      fill: { color: C.cardDark },
      line: { color: C.cardBorder, width: 1 },
      roundRadius: 0.08,
    });

    s3.addText('PROJECT SCOPE', {
      x: 5.35,
      y: 1.3,
      w: 3.65,
      h: 0.25,
      fontFace: FONT_HEADING,
      fontSize: 12,
      bold: true,
      color: C.accentOrange,
      margin: 0,
    });

    const scopes = [
      { title: 'Pan-India Coverage', desc: 'Spans all 28 states and 8 union territories systematically.' },
      { title: 'Multi-Hazard Scope', desc: 'Handles floods, earthquakes, cyclones, landslides, and fires.' },
      { title: 'Resource Monitoring', desc: 'Tracks beds, medical facilities, rations, and backup power.' },
      { title: 'Decision Support Only', desc: 'Assists authorities without replacing human incident command.' },
    ];

    scopes.forEach((sc, idx) => {
      const rowY = 1.75 + idx * 0.78;
      s3.addShape(pres.ShapeType.rect, {
        x: 5.35,
        y: rowY,
        w: 3.65,
        h: 0.68,
        fill: { color: '162B4A' },
        line: { color: '234575', width: 0.5 },
        roundRadius: 0.06,
      });

      s3.addText(sc.title, {
        x: 5.5,
        y: rowY + 0.08,
        w: 3.35,
        h: 0.22,
        fontFace: FONT_HEADING,
        fontSize: 11,
        bold: true,
        color: C.white,
        margin: 0,
      });
      s3.addText(sc.desc, {
        x: 5.5,
        y: rowY + 0.3,
        w: 3.35,
        h: 0.32,
        fontFace: FONT_BODY,
        fontSize: 9.5,
        color: C.secondaryBlue,
        margin: 0,
      });
    });

    // Speaker Notes (75 words)
    s3.addNotes(
      "Our project has five primary objectives: first, estimating disaster risks across multi-horizon forecasting windows; second, pinpointing high-risk zones and demographic clusters; third, monitoring shelter availability; fourth, optimizing shelter allocation; and fifth, recommending safe evacuation routes. The scope encompasses all twenty-eight states and eight union territories of India. We explicitly focus on decision support, structuring algorithmic recommendations so human emergency directors retain full operational control over evacuation orders and tactical deployments."
    );
  }

  // ==========================================
  // SLIDE 4: RESEARCH GAP
  // ==========================================
  {
    const s4 = pres.addSlide();
    s4.background = { color: C.navyBg };
    addHeader(s4, "Research Gap Analysis", "MOTIVATION & DIFFERENTIATION", 4);

    s4.addText('Benchmarking conventional emergency methods against the automated ShelterOps AI approach.', {
      x: 0.8,
      y: 1.05,
      w: 8.4,
      h: 0.25,
      fontFace: FONT_BODY,
      fontSize: 11.5,
      color: C.secondaryBlue,
      margin: 0,
    });

    // Table of 5 research gaps
    const tableData = [
      [
        { text: 'Traditional Disaster Management Limitation', options: { bold: true, color: C.white, fill: C.tableHeaderBg, fontSize: 10.5, fontFace: FONT_HEADING } },
        { text: 'How ShelterOps AI Addresses It', options: { bold: true, color: C.accentOrange, fill: C.tableHeaderBg, fontSize: 10.5, fontFace: FONT_HEADING } },
      ],
      [
        { text: 'Delayed identification of disaster-prone regions before hazard onset.', options: { color: C.secondaryBlue, fill: C.cardDark, fontSize: 9.5, fontFace: FONT_BODY } },
        { text: 'Predictive multi-horizon risk modeling using weather and historical signals.', options: { color: C.white, fill: '172E52', fontSize: 9.5, fontFace: FONT_BODY } },
      ],
      [
        { text: 'No centralized geographic information across state and district levels.', options: { color: C.secondaryBlue, fill: C.cardDark, fontSize: 9.5, fontFace: FONT_BODY } },
        { text: 'Unified pan-India GIS map integrating hazard zones and shelter status.', options: { color: C.white, fill: '172E52', fontSize: 9.5, fontFace: FONT_BODY } },
      ],
      [
        { text: 'Manual shelter allocation causing overcrowding and severe transit delays.', options: { color: C.secondaryBlue, fill: C.cardDark, fontSize: 9.5, fontFace: FONT_BODY } },
        { text: 'Automated constraint optimization balancing capacity, safety, and distance.', options: { color: C.white, fill: '172E52', fontSize: 9.5, fontFace: FONT_BODY } },
      ],
      [
        { text: 'Weak coordination between distributed tactical response teams.', options: { color: C.secondaryBlue, fill: C.cardDark, fontSize: 9.5, fontFace: FONT_BODY } },
        { text: 'Multi-agent AI architecture coordinating prediction, triage, and logistics.', options: { color: C.white, fill: '172E52', fontSize: 9.5, fontFace: FONT_BODY } },
      ],
      [
        { text: 'Difficulty tracking shelter capacity and essential relief resources.', options: { color: C.secondaryBlue, fill: C.cardDark, fontSize: 9.5, fontFace: FONT_BODY } },
        { text: 'Dynamic monitoring of bed availability, medical triage, water, and power.', options: { color: C.white, fill: '172E52', fontSize: 9.5, fontFace: FONT_BODY } },
      ],
    ];

    s4.addTable(tableData, {
      x: 0.8,
      y: 1.35,
      w: 8.4,
      colW: [4.0, 4.4],
      rowH: [0.4, 0.65, 0.65, 0.65, 0.65, 0.65],
      border: { pt: 0.5, color: C.tableBorder },
      margin: 8,
    });

    // Speaker Notes (76 words)
    s4.addNotes(
      "Current disaster management processes often suffer from five major systemic gaps. Traditional response relies on delayed alert broadcasts, fragmented non-centralized geographical maps, manual shelter assignment on paper or spreadsheets, and siloed communication among rescue teams. ShelterOps AI directly bridges these gaps by providing unified spatial risk mapping, automated mathematical constraint optimization that strictly prevents overcrowding, real-time resource tracking, and a collaborative multi-agent architecture that synthesizes a cohesive emergency action plan across departments."
    );
  }

  // ==========================================
  // SLIDE 5: PROPOSED METHODOLOGY
  // ==========================================
  {
    const s5 = pres.addSlide();
    s5.background = { color: C.navyBg };
    addHeader(s5, "Proposed System Methodology", "PIPELINE & DECISION WORKFLOW", 5);

    s5.addText('Seven-stage computational pipeline with continuous human-in-the-loop decision support.', {
      x: 0.8,
      y: 1.05,
      w: 8.4,
      h: 0.25,
      fontFace: FONT_BODY,
      fontSize: 11.5,
      color: C.secondaryBlue,
      margin: 0,
    });

    // 7 steps flowchart horizontally across 2 rows (4 top, 3 bottom)
    const steps = [
      { num: '01', title: 'Data Collection', desc: 'Aggregates weather, seismic, and historical baseline records.' },
      { num: '02', title: 'Environmental Analysis', desc: 'Processes rainfall, humidity, and hazard vulnerability factors.' },
      { num: '03', title: 'Risk Estimation', desc: 'Evaluates multi-horizon probability and assigns severity tiers.' },
      { num: '04', title: 'Population Identification', desc: 'Calculates affected demographic counts and exclusion perimeters.' },
      { num: '05', title: 'Shelter Identification', desc: 'Filters available facilities outside active danger zones.' },
      { num: '06', title: 'Optimization Allocation', desc: 'Executes constraint solver for capacity and transit distance.' },
      { num: '07', title: 'Evacuation Routes', desc: 'Generates clear navigation corridors and road detours.' },
    ];

    // Top Row: Steps 1-4
    steps.slice(0, 4).forEach((st, idx) => {
      const stepX = 0.8 + idx * 2.15;
      s5.addShape(pres.ShapeType.rect, {
        x: stepX,
        y: 1.4,
        w: 1.95,
        h: 1.35,
        fill: { color: C.cardDark },
        line: { color: C.cardBorder, width: 1 },
        roundRadius: 0.08,
      });

      s5.addText(st.num, {
        x: stepX + 0.1,
        y: 1.48,
        w: 0.4,
        h: 0.22,
        fontFace: FONT_HEADING,
        fontSize: 11,
        bold: true,
        color: C.accentOrange,
        margin: 0,
      });
      s5.addText(st.title, {
        x: stepX + 0.5,
        y: 1.48,
        w: 1.35,
        h: 0.22,
        fontFace: FONT_HEADING,
        fontSize: 10,
        bold: true,
        color: C.white,
        margin: 0,
      });
      s5.addText(st.desc, {
        x: stepX + 0.1,
        y: 1.78,
        w: 1.75,
        h: 0.85,
        fontFace: FONT_BODY,
        fontSize: 9,
        color: C.secondaryBlue,
        lineSpacing: 13,
        margin: 0,
      });

      // Flow arrow between cards
      if (idx < 3) {
        s5.addShape(pres.ShapeType.rightArrow, {
          x: stepX + 1.98,
          y: 1.95,
          w: 0.14,
          h: 0.18,
          fill: { color: C.accentOrange },
          line: { color: C.accentOrange },
        });
      }
    });

    // Bottom Row: Steps 5-7
    steps.slice(4).forEach((st, idx) => {
      const stepX = 0.8 + idx * 2.15;
      s5.addShape(pres.ShapeType.rect, {
        x: stepX,
        y: 2.95,
        w: 1.95,
        h: 1.35,
        fill: { color: C.cardDark },
        line: { color: C.cardBorder, width: 1 },
        roundRadius: 0.08,
      });

      s5.addText(st.num, {
        x: stepX + 0.1,
        y: 3.03,
        w: 0.4,
        h: 0.22,
        fontFace: FONT_HEADING,
        fontSize: 11,
        bold: true,
        color: C.accentOrange,
        margin: 0,
      });
      s5.addText(st.title, {
        x: stepX + 0.5,
        y: 3.03,
        w: 1.35,
        h: 0.22,
        fontFace: FONT_HEADING,
        fontSize: 10,
        bold: true,
        color: C.white,
        margin: 0,
      });
      s5.addText(st.desc, {
        x: stepX + 0.1,
        y: 3.33,
        w: 1.75,
        h: 0.85,
        fontFace: FONT_BODY,
        fontSize: 9,
        color: C.secondaryBlue,
        lineSpacing: 13,
        margin: 0,
      });

      if (idx < 2) {
        s5.addShape(pres.ShapeType.rightArrow, {
          x: stepX + 1.98,
          y: 3.5,
          w: 0.14,
          h: 0.18,
          fill: { color: C.accentOrange },
          line: { color: C.accentOrange },
        });
      }
    });

    // Human-in-the-loop decision card (4th slot on bottom row)
    s5.addShape(pres.ShapeType.rect, {
      x: 7.25,
      y: 2.95,
      w: 1.95,
      h: 1.35,
      fill: { color: '0E2A52' },
      line: { color: C.accentOrange, width: 1.5 },
      roundRadius: 0.08,
    });
    s5.addText('HUMAN-IN-THE-LOOP', {
      x: 7.35,
      y: 3.05,
      w: 1.75,
      h: 0.2,
      fontFace: FONT_HEADING,
      fontSize: 8.5,
      bold: true,
      color: C.accentOrange,
      align: 'center',
      margin: 0,
    });
    s5.addText('Incident Command\nNDMA / SDMAs\n\nAll recommendations require human review prior to action.', {
      x: 7.35,
      y: 3.28,
      w: 1.75,
      h: 0.95,
      fontFace: FONT_BODY,
      fontSize: 8.5,
      color: C.white,
      align: 'center',
      lineSpacing: 12,
      margin: 0,
    });

    // Feedback arrow indicator
    s5.addText('Output Loop: Continuous feedback to district authorities for rapid verification.', {
      x: 0.8,
      y: 4.45,
      w: 8.4,
      h: 0.25,
      fontFace: FONT_BODY,
      fontSize: 9.5,
      color: C.accentOrange,
      margin: 0,
    });

    // Speaker Notes (74 words)
    s5.addNotes(
      "Our proposed methodology follows a seven-stage computational pipeline. It begins with data collection and environmental telemetry analysis, feeds into predictive risk estimation, and isolates exposed population clusters. Next, candidate shelters outside active exclusion zones are identified. The core constraint engine then solves the allocation problem, while the routing module maps safe corridors. Crucially, all system outputs flow directly to human emergency commanders in a continuous decision-support loop, ensuring algorithmic transparency."
    );
  }

  // ==========================================
  // SLIDE 6: AI TECHNOLOGIES AND ALGORITHMS
  // ==========================================
  {
    const s6 = pres.addSlide();
    s6.background = { color: C.navyBg };
    addHeader(s6, "AI Technologies and Core Algorithms", "FOUNDATIONAL COMPUTATIONAL PARADIGMS", 6);

    const aiCards = [
      {
        title: 'Machine Learning',
        tag: 'PLANNED',
        desc: 'Historical pattern recognition and environmental risk probability forecasting.',
      },
      {
        title: 'Probabilistic Reasoning',
        tag: 'PLANNED',
        desc: 'Quantifying uncertainty across multi-horizon rainfall and cyclone trajectories.',
      },
      {
        title: 'Logical Reasoning',
        tag: 'PLANNED',
        desc: 'Enforcing strict safety invariants, capacity ceilings, and exclusion zones.',
      },
      {
        title: 'State-Space Search',
        tag: 'PLANNED',
        desc: 'Exploring feasible shelter assignment states and blocked road detour graphs.',
      },
      {
        title: 'Optimization Algorithms',
        tag: 'PLANNED',
        desc: 'Multi-objective optimization minimizing transit distance and resource deficits.',
      },
      {
        title: 'Multi-Agent AI',
        tag: 'PLANNED',
        desc: 'Coordinating prediction, triage, shelter, and logistics agent roles.',
      },
    ];

    aiCards.forEach((c, idx) => {
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const cardX = 0.8 + col * 2.87;
      const cardY = 1.15 + row * 1.75;

      s6.addShape(pres.ShapeType.rect, {
        x: cardX,
        y: cardY,
        w: 2.67,
        h: 1.55,
        fill: { color: C.cardDark },
        line: { color: C.cardBorder, width: 1 },
        roundRadius: 0.08,
      });

      // Card Header: Title
      s6.addText(c.title, {
        x: cardX + 0.15,
        y: cardY + 0.12,
        w: 1.6,
        h: 0.25,
        fontFace: FONT_HEADING,
        fontSize: 11,
        bold: true,
        color: C.white,
        margin: 0,
      });

      // Status Tag Badge
      s6.addShape(pres.ShapeType.rect, {
        x: cardX + 1.82,
        y: cardY + 0.12,
        w: 0.72,
        h: 0.22,
        fill: { color: C.tagPlannedBg },
        line: { color: C.tagPlannedBorder, width: 0.5 },
        roundRadius: 0.04,
      });
      s6.addText(`[${c.tag}]`, {
        x: cardX + 1.82,
        y: cardY + 0.14,
        w: 0.72,
        h: 0.18,
        fontFace: FONT_BODY,
        fontSize: 7.5,
        bold: true,
        color: C.tagPlannedText,
        align: 'center',
        margin: 0,
      });

      // Divider line inside card
      s6.addShape(pres.ShapeType.rect, {
        x: cardX + 0.15,
        y: cardY + 0.42,
        w: 2.37,
        h: 0.01,
        fill: { color: '1A365D' },
        line: { color: '1A365D' },
      });

      s6.addText('Role in ShelterOps AI:', {
        x: cardX + 0.15,
        y: cardY + 0.48,
        w: 2.37,
        h: 0.2,
        fontFace: FONT_HEADING,
        fontSize: 8.5,
        bold: true,
        color: C.accentOrange,
        margin: 0,
      });

      s6.addText(c.desc, {
        x: cardX + 0.15,
        y: cardY + 0.7,
        w: 2.37,
        h: 0.75,
        fontFace: FONT_BODY,
        fontSize: 9.5,
        color: C.secondaryBlue,
        lineSpacing: 14,
        margin: 0,
      });
    });

    addStatusTagLegend(s6, 4.8);

    // Speaker Notes (78 words)
    s6.addNotes(
      "ShelterOps AI combines six foundational artificial intelligence paradigms. Machine learning models predict environmental hazards from baseline patterns. Probabilistic reasoning quantifies risk uncertainty across multi-horizon forecasts. Logical reasoning enforces non-negotiable safety rules, such as barring shelters within active flood perimeters. State-space search explores valid evacuation graphs. Optimization algorithms minimize transit distances and resource deficits. Finally, a multi-agent system coordinates specialized roles. Note that all items are tagged planned per project status guidelines."
    );
  }

  // ==========================================
  // SLIDE 7: SYSTEM ARCHITECTURE
  // ==========================================
  {
    const s7 = pres.addSlide();
    s7.background = { color: C.navyBg };
    addHeader(s7, "System Architecture and Data Flow", "LAYERED MODULAR SPECIFICATION", 7);

    const layers = [
      {
        name: 'Presentation Layer',
        tag: 'PLANNED',
        tech: 'Interactive Command Dashboard (React, Tailwind UI)',
        role: 'Renders map views, live alert feeds, and decision-support triage cards.',
      },
      {
        name: 'Geographic GIS Layer',
        tag: 'PLANNED',
        tech: 'Pan-India GIS Engine (State/District Boundaries, Risk Overlays)',
        role: 'Maps hazard epicenters, circular exclusion perimeters, and shelter points.',
      },
      {
        name: 'Backend Application Layer',
        tag: 'PLANNED',
        tech: 'Python / REST API Application Server',
        role: 'Manages incident state, data ingestion pipelines, and client requests.',
      },
      {
        name: 'AI Reasoning Layer',
        tag: 'PLANNED',
        tech: 'Multi-Horizon Prediction Engine + Smart Allocation Solver',
        role: 'Executes constraint optimization and probabilistic risk estimation.',
      },
      {
        name: 'Data Source Layer',
        tag: 'PLANNED',
        tech: 'Weather Telemetry (Open-Meteo), GIS Data, Historical Baselines',
        role: 'Supplies real-time environmental observations and regional shelter profiles.',
      },
    ];

    layers.forEach((ly, idx) => {
      const layerY = 1.12 + idx * 0.72;
      s7.addShape(pres.ShapeType.rect, {
        x: 0.8,
        y: layerY,
        w: 8.4,
        h: 0.64,
        fill: { color: C.cardDark },
        line: { color: C.cardBorder, width: 1 },
        roundRadius: 0.06,
      });

      // Layer Title & Tag
      s7.addText(`${idx + 1}. ${ly.name}`, {
        x: 0.95,
        y: layerY + 0.08,
        w: 2.6,
        h: 0.22,
        fontFace: FONT_HEADING,
        fontSize: 10.5,
        bold: true,
        color: C.white,
        margin: 0,
      });

      s7.addShape(pres.ShapeType.rect, {
        x: 3.55,
        y: layerY + 0.08,
        w: 0.75,
        h: 0.2,
        fill: { color: C.tagPlannedBg },
        line: { color: C.tagPlannedBorder, width: 0.5 },
        roundRadius: 0.04,
      });
      s7.addText(`[${ly.tag}]`, {
        x: 3.55,
        y: layerY + 0.09,
        w: 0.75,
        h: 0.18,
        fontFace: FONT_BODY,
        fontSize: 7.5,
        bold: true,
        color: C.tagPlannedText,
        align: 'center',
        margin: 0,
      });

      // Technology & Role
      s7.addText(ly.tech, {
        x: 4.45,
        y: layerY + 0.08,
        w: 4.6,
        h: 0.2,
        fontFace: FONT_HEADING,
        fontSize: 9.5,
        bold: true,
        color: C.accentOrange,
        margin: 0,
      });

      s7.addText(ly.role, {
        x: 0.95,
        y: layerY + 0.32,
        w: 8.1,
        h: 0.26,
        fontFace: FONT_BODY,
        fontSize: 9,
        color: C.secondaryBlue,
        margin: 0,
      });
    });

    addStatusTagLegend(s7, 4.8);

    // Speaker Notes (73 words)
    s7.addNotes(
      "The system architecture is structured into five distinct operational tiers. At the base, the data layer aggregates environmental and boundary datasets. The AI reasoning layer processes risk probability and executes constraint optimization. The application backend coordinates business logic and API requests, while the geographic layer renders hazard zones and shelter markers. Finally, the presentation layer provides an intuitive command dashboard for incident commanders. Each component is tagged according to our project implementation status."
    );
  }

  // ==========================================
  // SLIDE 8: RESULTS AND DEMONSTRATION
  // ==========================================
  {
    const s8 = pres.addSlide();
    s8.background = { color: C.navyBg };
    addHeader(s8, "System Features and Demonstration", "CAPABILITY MATRIX & INTERFACE FRAMES", 8);

    // Left Column: Feature Checklist with Status Tags
    s8.addShape(pres.ShapeType.rect, {
      x: 0.8,
      y: 1.15,
      w: 4.1,
      h: 3.55,
      fill: { color: C.cardDark },
      line: { color: C.cardBorder, width: 1 },
      roundRadius: 0.08,
    });

    s8.addText('CORE CAPABILITY CHECKLIST', {
      x: 0.95,
      y: 1.25,
      w: 3.8,
      h: 0.22,
      fontFace: FONT_HEADING,
      fontSize: 11,
      bold: true,
      color: C.accentOrange,
      margin: 0,
    });

    const features = [
      'Interactive Pan-India Map',
      'Risk Zone Visualization (Color-Coded)',
      'High-Risk Region Identification',
      'Shelter Availability & Bed Monitoring',
      'Smart Shelter Allocation Engine',
      'Evacuation Route & Detour Planning',
      'Disaster Statistics & Analytics View',
    ];

    features.forEach((feat, idx) => {
      const featY = 1.55 + idx * 0.43;
      s8.addShape(pres.ShapeType.rect, {
        x: 0.95,
        y: featY,
        w: 3.8,
        h: 0.36,
        fill: { color: '162B4A' },
        line: { color: '234575', width: 0.5 },
        roundRadius: 0.04,
      });

      s8.addText(`• ${feat}`, {
        x: 1.05,
        y: featY + 0.06,
        w: 2.85,
        h: 0.24,
        fontFace: FONT_BODY,
        fontSize: 9,
        color: C.white,
        margin: 0,
      });

      s8.addShape(pres.ShapeType.rect, {
        x: 3.95,
        y: featY + 0.07,
        w: 0.72,
        h: 0.2,
        fill: { color: C.tagPlannedBg },
        line: { color: C.tagPlannedBorder, width: 0.5 },
        roundRadius: 0.04,
      });
      s8.addText('[PLANNED]', {
        x: 3.95,
        y: featY + 0.08,
        w: 0.72,
        h: 0.18,
        fontFace: FONT_BODY,
        fontSize: 7,
        bold: true,
        color: C.tagPlannedText,
        align: 'center',
        margin: 0,
      });
    });

    // Right Column: 3 Screenshot Placeholder Frames
    const placeholders = [
      'Insert screenshot: Command Dashboard & Interactive India Risk Map',
      'Insert screenshot: Smart Shelter Allocation & Constraint Results Table',
      'Insert screenshot: Evacuation Corridor & Detour Navigation View',
    ];

    placeholders.forEach((ph, idx) => {
      const frameY = 1.15 + idx * 1.22;
      s8.addShape(pres.ShapeType.rect, {
        x: 5.15,
        y: frameY,
        w: 4.05,
        h: 1.12,
        fill: { color: '0D1D34' },
        line: { color: C.primaryBlue, width: 1, dashType: 'dash' },
        roundRadius: 0.06,
      });

      s8.addText(`SCREENSHOT PLACEHOLDER ${idx + 1}`, {
        x: 5.25,
        y: frameY + 0.15,
        w: 3.85,
        h: 0.2,
        fontFace: FONT_HEADING,
        fontSize: 8.5,
        bold: true,
        color: C.accentOrange,
        align: 'center',
        margin: 0,
      });

      s8.addText(`[${ph}]`, {
        x: 5.25,
        y: frameY + 0.42,
        w: 3.85,
        h: 0.55,
        fontFace: FONT_BODY,
        fontSize: 8.5,
        color: C.secondaryBlue,
        align: 'center',
        margin: 0,
      });
    });

    // Bottom footnote
    s8.addText('Note: Demonstration uses simulated data unless tagged API-CONNECTED. No fabricated metrics.', {
      x: 0.8,
      y: 4.72,
      w: 8.4,
      h: 0.18,
      fontFace: FONT_BODY,
      fontSize: 8.5,
      color: C.textMuted,
      margin: 0,
    });

    addStatusTagLegend(s8, 4.9);

    // Speaker Notes (75 words)
    s8.addNotes(
      "This slide outlines our prototype's feature checklist alongside user interface demonstration placeholders. Planned features include pan-India interactive risk mapping, dynamic hazard zone overlays, shelter bed monitoring, constraint-based allocation, and evacuation routing. In accordance with strict academic guidelines, we do not present fabricated performance metrics or simulated screenshots as finished products. Instead, clearly designated placeholder frames show where future demonstration captures will be placed following formal testing and validation."
    );
  }

  // ==========================================
  // SLIDE 9: TESTING AND EVALUATION PLAN
  // ==========================================
  {
    const s9 = pres.addSlide();
    s9.background = { color: C.navyBg };
    addHeader(s9, "Testing and Evaluation Plan", "SIMULATED SCENARIOS & PASS CRITERIA", 9);

    // 4 Simulated Scenario Cards (Top Row)
    const scenarios = [
      { loc: 'Assam Floods', type: 'River Overflow', pop: '[Insert value] displaced', focus: 'Exclusion zone verification' },
      { loc: 'Odisha Cyclone', type: 'Coastal Landfall', pop: '[Insert value] in storm path', focus: 'High-surge evacuation speed' },
      { loc: 'Himachal Landslide', type: 'Slope Failure', pop: '[Insert value] isolated', focus: 'Highway roadblock detours' },
      { loc: 'Punjab Inundation', type: 'River Basin Surge', pop: '[Insert value] vulnerable', focus: 'Shelter capacity defense' },
    ];

    scenarios.forEach((sc, idx) => {
      const cardX = 0.8 + idx * 2.15;
      s9.addShape(pres.ShapeType.rect, {
        x: cardX,
        y: 1.12,
        w: 1.95,
        h: 1.05,
        fill: { color: C.cardDark },
        line: { color: C.cardBorder, width: 1 },
        roundRadius: 0.06,
      });

      s9.addText(sc.loc, {
        x: cardX + 0.1,
        y: 1.18,
        w: 1.75,
        h: 0.2,
        fontFace: FONT_HEADING,
        fontSize: 10,
        bold: true,
        color: C.accentOrange,
        margin: 0,
      });
      s9.addText(`${sc.type} | ${sc.pop}\nFocus: ${sc.focus}`, {
        x: cardX + 0.1,
        y: 1.4,
        w: 1.75,
        h: 0.65,
        fontFace: FONT_BODY,
        fontSize: 8.5,
        color: C.secondaryBlue,
        lineSpacing: 12,
        margin: 0,
      });
    });

    // Evaluation Table
    const evalData = [
      [
        { text: 'Criterion', options: { bold: true, color: C.white, fill: C.tableHeaderBg, fontSize: 9.5, fontFace: FONT_HEADING } },
        { text: 'How It Will Be Tested', options: { bold: true, color: C.white, fill: C.tableHeaderBg, fontSize: 9.5, fontFace: FONT_HEADING } },
        { text: 'Qualitative Pass Condition', options: { bold: true, color: C.accentOrange, fill: C.tableHeaderBg, fontSize: 9.5, fontFace: FONT_HEADING } },
        { text: 'Result', options: { bold: true, color: C.white, fill: C.tableHeaderBg, fontSize: 9.5, fontFace: FONT_HEADING } },
      ],
      [
        { text: 'Shelter Capacity Constraints', options: { color: C.white, fill: C.cardDark, fontSize: 8.5, fontFace: FONT_BODY } },
        { text: 'Simulate peak population influx against available beds.', options: { color: C.secondaryBlue, fill: C.cardDark, fontSize: 8.5, fontFace: FONT_BODY } },
        { text: 'Zero shelters exceed [Insert value]% capacity ceiling.', options: { color: C.secondaryBlue, fill: C.cardDark, fontSize: 8.5, fontFace: FONT_BODY } },
        { text: '[To be recorded after testing]', options: { color: C.textMuted, fill: C.cardDark, fontSize: 8, fontFace: FONT_BODY } },
      ],
      [
        { text: 'Allocation Feasibility', options: { color: C.white, fill: '172E52', fontSize: 8.5, fontFace: FONT_BODY } },
        { text: 'Run allocation with hazard perimeter exclusion active.', options: { color: C.secondaryBlue, fill: '172E52', fontSize: 8.5, fontFace: FONT_BODY } },
        { text: 'No individuals placed within active hazard exclusion zone.', options: { color: C.secondaryBlue, fill: '172E52', fontSize: 8.5, fontFace: FONT_BODY } },
        { text: '[To be recorded after testing]', options: { color: C.textMuted, fill: '172E52', fontSize: 8, fontFace: FONT_BODY } },
      ],
      [
        { text: 'Risk Classification', options: { color: C.white, fill: C.cardDark, fontSize: 8.5, fontFace: FONT_BODY } },
        { text: 'Evaluate multi-horizon hazard prediction logic.', options: { color: C.secondaryBlue, fill: C.cardDark, fontSize: 8.5, fontFace: FONT_BODY } },
        { text: 'Correctly classifies threat into Low, Moderate, High, Critical.', options: { color: C.secondaryBlue, fill: C.cardDark, fontSize: 8.5, fontFace: FONT_BODY } },
        { text: '[To be recorded after testing]', options: { color: C.textMuted, fill: C.cardDark, fontSize: 8, fontFace: FONT_BODY } },
      ],
      [
        { text: 'Distance & Routing', options: { color: C.white, fill: '172E52', fontSize: 8.5, fontFace: FONT_BODY } },
        { text: 'Test routing between displaced points and shelters.', options: { color: C.secondaryBlue, fill: '172E52', fontSize: 8.5, fontFace: FONT_BODY } },
        { text: 'Minimizes travel distance while completely avoiding blocked roads.', options: { color: C.secondaryBlue, fill: '172E52', fontSize: 8.5, fontFace: FONT_BODY } },
        { text: '[To be recorded after testing]', options: { color: C.textMuted, fill: '172E52', fontSize: 8, fontFace: FONT_BODY } },
      ],
      [
        { text: 'Unavailable Shelters', options: { color: C.white, fill: C.cardDark, fontSize: 8.5, fontFace: FONT_BODY } },
        { text: 'Trigger shelter compromise or closure event.', options: { color: C.secondaryBlue, fill: C.cardDark, fontSize: 8.5, fontFace: FONT_BODY } },
        { text: 'Automatically re-routes evacuees to feasible backup shelters.', options: { color: C.secondaryBlue, fill: C.cardDark, fontSize: 8.5, fontFace: FONT_BODY } },
        { text: '[To be recorded after testing]', options: { color: C.textMuted, fill: C.cardDark, fontSize: 8, fontFace: FONT_BODY } },
      ],
    ];

    s9.addTable(evalData, {
      x: 0.8,
      y: 2.3,
      w: 8.4,
      colW: [2.1, 2.3, 2.5, 1.5],
      rowH: [0.35, 0.44, 0.44, 0.44, 0.44, 0.44],
      border: { pt: 0.5, color: C.tableBorder },
      margin: 6,
    });

    addStatusTagLegend(s9, 4.88);

    // Speaker Notes (76 words)
    s9.addNotes(
      "Our evaluation framework is designed as a rigorous qualitative test plan across four distinct regional scenarios: Assam floods, Odisha cyclones, Himachal Pradesh landslides, and Punjab river surges. We evaluate five core criteria: shelter capacity limits, allocation safety feasibility, risk classification consistency, evacuation distance efficiency, and fallback handling when shelters are compromised. As testing is actively ongoing, all empirical results remain placeholder fields to be recorded truthfully after running our test suite."
    );
  }

  // ==========================================
  // SLIDE 10: CONCLUSION AND LIMITATIONS
  // ==========================================
  {
    const s10 = pres.addSlide();
    s10.background = { color: C.navyBg };
    addHeader(s10, "Conclusion and Project Limitations", "SUMMARY OF FINDINGS & CONSTRAINTS", 10);

    // Left Column: 4 Key Takeaways
    s10.addShape(pres.ShapeType.rect, {
      x: 0.8,
      y: 1.15,
      w: 4.05,
      h: 2.85,
      fill: { color: C.cardDark },
      line: { color: C.cardBorder, width: 1 },
      roundRadius: 0.08,
    });

    s10.addText('CORE ACADEMIC TAKEAWAYS', {
      x: 1.0,
      y: 1.3,
      w: 3.65,
      h: 0.22,
      fontFace: FONT_HEADING,
      fontSize: 11,
      bold: true,
      color: C.accentOrange,
      margin: 0,
    });

    const takeaways = [
      'Proactive AI forecasting improves multi-horizon disaster preparedness.',
      'Centralized GIS mapping provides immediate pan-India spatial awareness.',
      'Constraint optimization prevents overcrowding and protects vulnerable evacuees.',
      'Coordinated multi-agent architecture streamlines tactical decision support.',
    ];

    takeaways.forEach((tk, idx) => {
      const rowY = 1.6 + idx * 0.56;
      s10.addText(`•  ${tk}`, {
        x: 1.0,
        y: rowY,
        w: 3.65,
        h: 0.48,
        fontFace: FONT_BODY,
        fontSize: 9.5,
        color: C.white,
        lineSpacing: 13,
        margin: 0,
      });
    });

    // Right Column: Limitations Box
    s10.addShape(pres.ShapeType.rect, {
      x: 5.15,
      y: 1.15,
      w: 4.05,
      h: 2.85,
      fill: { color: C.cardDark },
      line: { color: C.cardBorder, width: 1 },
      roundRadius: 0.08,
    });

    s10.addText('CURRENT PROJECT LIMITATIONS', {
      x: 5.35,
      y: 1.3,
      w: 3.65,
      h: 0.22,
      fontFace: FONT_HEADING,
      fontSize: 11,
      bold: true,
      color: C.accentOrange,
      margin: 0,
    });

    const limitations = [
      'Prototype scope operating under simulated and sample hazard scenario datasets.',
      'Live meteorological telemetry dependent on third-party API availability.',
      'Road closures modeled via simulated graph cuts rather than live highway feeds.',
      'Requires formal validation against operational NDMA and SDMA protocols.',
    ];

    limitations.forEach((lm, idx) => {
      const rowY = 1.6 + idx * 0.56;
      s10.addText(`•  ${lm}`, {
        x: 5.35,
        y: rowY,
        w: 3.65,
        h: 0.48,
        fontFace: FONT_BODY,
        fontSize: 9.5,
        color: C.secondaryBlue,
        lineSpacing: 13,
        margin: 0,
      });
    });

    // Highlighted Decision-Support Disclaimer Banner (Bottom)
    s10.addShape(pres.ShapeType.rect, {
      x: 0.8,
      y: 4.15,
      w: 8.4,
      h: 0.85,
      fill: { color: '0E2A52' },
      line: { color: C.accentOrange, width: 1.5 },
      roundRadius: 0.08,
    });

    s10.addText('DECISION-SUPPORT DISCLAIMER', {
      x: 1.0,
      y: 4.25,
      w: 8.0,
      h: 0.2,
      fontFace: FONT_HEADING,
      fontSize: 9.5,
      bold: true,
      color: C.accentOrange,
      margin: 0,
    });

    s10.addText(
      'ShelterOps AI is an academic prototype designed solely to assist and advise official emergency authorities (NDMA, SDMAs, IMD). It does not replace statutory incident command systems, field reconnaissance, or official government evacuation orders.',
      {
        x: 1.0,
        y: 4.48,
        w: 8.0,
        h: 0.45,
        fontFace: FONT_BODY,
        fontSize: 9,
        color: C.white,
        lineSpacing: 13,
        margin: 0,
      }
    );

    // Speaker Notes (74 words)
    s10.addNotes(
      "In conclusion, ShelterOps AI demonstrates how artificial intelligence and constraint optimization can transform disaster response from reactive scrambling to proactive, mathematically sound coordination. Centralized spatial awareness and automated allocation help protect vulnerable populations while respecting capacity boundaries. However, as an academic prototype, its current scope relies on simulated datasets and requires formal field validation alongside official emergency response agencies before any operational deployment could ever be considered."
    );
  }

  // ==========================================
  // SLIDE 11: FUTURE WORK
  // ==========================================
  {
    const s11 = pres.addSlide();
    s11.background = { color: C.navyBg };
    addHeader(s11, "Future Roadmap and Extensions", "ENGINEERING ADVANCEMENTS (NO DATES)", 11);

    s11.addText('Six logical extension areas to advance ShelterOps AI from prototype toward field integration.', {
      x: 0.8,
      y: 1.05,
      w: 8.4,
      h: 0.25,
      fontFace: FONT_BODY,
      fontSize: 11.5,
      color: C.secondaryBlue,
      margin: 0,
    });

    const roadmap = [
      {
        title: 'Real-Time IMD Weather Integration',
        desc: 'Direct telemetry links to IMD Doppler radars and automated rain gauge stations.',
      },
      {
        title: 'Satellite Imagery & Deep Learning',
        desc: 'Synthetic Aperture Radar (SAR) flood mapping and multispectral slope stability scans.',
      },
      {
        title: 'Live National Shelter Database',
        desc: 'Direct synchronization with state relief camp portals and IoT occupancy counters.',
      },
      {
        title: 'Mobile App for Emergency Alerts',
        desc: 'Multi-lingual push broadcasts and offline turn-by-turn shelter navigation for citizens.',
      },
      {
        title: 'Real-Time Road Conditions & GPS',
        desc: 'Dynamic traffic telemetry, bridge status sensors, and rescue convoy fleet tracking.',
      },
      {
        title: 'Advanced Autonomous AI Agents',
        desc: 'Inter-agency agent negotiations between healthcare, food logistics, and rescue squads.',
      },
    ];

    roadmap.forEach((rm, idx) => {
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const cardX = 0.8 + col * 2.87;
      const cardY = 1.35 + row * 1.7;

      s11.addShape(pres.ShapeType.rect, {
        x: cardX,
        y: cardY,
        w: 2.67,
        h: 1.5,
        fill: { color: C.cardDark },
        line: { color: C.cardBorder, width: 1 },
        roundRadius: 0.08,
      });

      // Roadmap Phase Icon/Number Badge
      s11.addShape(pres.ShapeType.ellipse, {
        x: cardX + 0.15,
        y: cardY + 0.15,
        w: 0.32,
        h: 0.32,
        fill: { color: '1A365D' },
        line: { color: C.accentOrange, width: 1 },
      });
      s11.addText(`${idx + 1}`, {
        x: cardX + 0.15,
        y: cardY + 0.17,
        w: 0.32,
        h: 0.28,
        fontFace: FONT_HEADING,
        fontSize: 10,
        bold: true,
        color: C.accentOrange,
        align: 'center',
        margin: 0,
      });

      s11.addText(rm.title, {
        x: cardX + 0.55,
        y: cardY + 0.15,
        w: 1.95,
        h: 0.35,
        fontFace: FONT_HEADING,
        fontSize: 10,
        bold: true,
        color: C.white,
        margin: 0,
      });

      s11.addShape(pres.ShapeType.rect, {
        x: cardX + 0.15,
        y: cardY + 0.55,
        w: 2.37,
        h: 0.01,
        fill: { color: '1A365D' },
        line: { color: '1A365D' },
      });

      s11.addText(rm.desc, {
        x: cardX + 0.15,
        y: cardY + 0.65,
        w: 2.37,
        h: 0.72,
        fontFace: FONT_BODY,
        fontSize: 9,
        color: C.secondaryBlue,
        lineSpacing: 13,
        margin: 0,
      });
    });

    // Speaker Notes (72 words)
    s11.addNotes(
      "Our future roadmap highlights six logical extensions to advance ShelterOps AI toward real-world readiness. Priority enhancements include integrating real-time IMD Doppler radar data, applying deep learning to satellite radar imagery for flood detection, connecting to live state relief camp databases, and building a citizen-facing mobile application. Additionally, incorporating dynamic road telematics and expanding multi-agent rescue coordination will further refine the platform's decision-support precision."
    );
  }

  // ==========================================
  // SLIDE 12: THANK YOU
  // ==========================================
  {
    const s12 = pres.addSlide();
    s12.background = { color: C.navyBg };

    // Decorative geometric motifs matching Slide 1
    s12.addShape(pres.ShapeType.ellipse, {
      x: 3.5,
      y: 0.4,
      w: 3.0,
      h: 3.0,
      line: { color: '16335C', width: 1.5, dashType: 'dash' },
      fill: { color: '0E2342' },
    });
    s12.addShape(pres.ShapeType.ellipse, {
      x: 4.1,
      y: 1.0,
      w: 1.8,
      h: 1.8,
      line: { color: C.primaryBlue, width: 1 },
      fill: { color: '11294C' },
    });

    // Centered Thank You Heading
    s12.addText('Thank You!', {
      x: 1.5,
      y: 1.45,
      w: 7.0,
      h: 0.7,
      fontFace: FONT_HEADING,
      fontSize: 38,
      bold: true,
      color: C.white,
      align: 'center',
      margin: 0,
    });

    // Orange accent bar
    s12.addShape(pres.ShapeType.rect, {
      x: 4.25,
      y: 2.2,
      w: 1.5,
      h: 0.05,
      fill: { color: C.accentOrange },
      line: { color: C.accentOrange },
    });

    s12.addText('"Building a Safer and Disaster-Resilient India with AI"', {
      x: 1.5,
      y: 2.35,
      w: 7.0,
      h: 0.35,
      fontFace: FONT_BODY,
      fontSize: 14,
      color: C.secondaryBlue,
      align: 'center',
      margin: 0,
    });

    // Course & Faculty Info Card
    s12.addShape(pres.ShapeType.rect, {
      x: 2.2,
      y: 2.9,
      w: 5.6,
      h: 0.65,
      fill: { color: C.cardDark },
      line: { color: C.cardBorder, width: 1 },
      roundRadius: 0.06,
    });
    s12.addText('CSE276 – Artificial Intelligence Foundations  |  Faculty: Ayushi Bhakuni', {
      x: 2.3,
      y: 3.1,
      w: 5.4,
      h: 0.25,
      fontFace: FONT_HEADING,
      fontSize: 10.5,
      bold: true,
      color: C.white,
      align: 'center',
      margin: 0,
    });

    // Team Card
    s12.addShape(pres.ShapeType.rect, {
      x: 2.2,
      y: 3.7,
      w: 5.6,
      h: 1.15,
      fill: { color: C.cardDark },
      line: { color: C.cardBorder, width: 1 },
      roundRadius: 0.06,
    });
    s12.addText('PROJECT TEAM MEMBERS', {
      x: 2.3,
      y: 3.82,
      w: 5.4,
      h: 0.2,
      fontFace: FONT_HEADING,
      fontSize: 8.5,
      bold: true,
      color: C.accentOrange,
      align: 'center',
      margin: 0,
    });
    s12.addText('Navjot (12506248)   •   Kovuru Rajoob (12505486)   •   Arpit Kumar (12529290)', {
      x: 2.3,
      y: 4.08,
      w: 5.4,
      h: 0.25,
      fontFace: FONT_BODY,
      fontSize: 10.5,
      color: C.white,
      align: 'center',
      margin: 0,
    });
    s12.addText('Decision-Support Prototype  |  Open for Questions & Discussion', {
      x: 2.3,
      y: 4.38,
      w: 5.4,
      h: 0.25,
      fontFace: FONT_BODY,
      fontSize: 9,
      color: C.secondaryBlue,
      align: 'center',
      margin: 0,
    });

    // Speaker Notes (65 words)
    s12.addNotes(
      "Thank you very much, Professor Ayushi Bhakuni and fellow classmates, for your time and attention today. We believe that applying foundational AI methods to disaster logistics is an impactful area of research with immense societal benefit for India. Navjot, Kovuru, and Arpit are now ready and look forward to addressing any questions, critiques, or suggestions you may have regarding our project."
    );
  }

  // Save the presentation
  const fileName = 'ShelterOps_AI_Presentation.pptx';
  await pres.writeFile({ fileName });
  console.log(`Presentation successfully created: ${fileName}`);

  // Also ensure it is copied to public/ if public exists or create it
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public', { recursive: true });
  }
  fs.copyFileSync(fileName, path.join('public', fileName));
  console.log(`Presentation copied to public/${fileName}`);
}

buildPresentation().catch(err => {
  console.error('Error generating presentation:', err);
  process.exit(1);
});
