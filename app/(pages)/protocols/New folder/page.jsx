'use client'
import { useState } from 'react'
import TopBar from '@/app/_components/ui/dashboard/top-bar'
import CardSwap, { Card } from '@/app/_components/ui/protocols/CardSwap'

const SECTIONS = [
  {
    id: 'signaling', label: 'Signaling Peptides',
    protocols: [
      { id: 'bpc157', label: 'BPC-157', category: 'Healing', cards: [
        { title: 'Overview', body: 'Body Protection Compound-157. Pentadecapeptide derived from human gastric juice. Potent tissue repair and anti-inflammatory effects.' },
        { title: 'Dosing', body: '200–500 mcg/day. Subcutaneous or intramuscular injection near injury site. Oral dosing also effective for gut repair.' },
        { title: 'Administration', body: 'Inject subcutaneously once or twice daily. Reconstitute with bacteriostatic water. Store at 2–8°C after reconstitution.' },
        { title: 'Stack Notes', body: 'Synergistic with TB-500 for accelerated healing. Combine with GHK-Cu for tissue regeneration. Avoid concurrent NSAID use.' },
      ]},
      { id: 'tb500', label: 'TB-500', category: 'Healing', cards: [
        { title: 'Overview', body: 'Thymosin Beta-4 fragment. Promotes actin upregulation, angiogenesis, and systemic healing. High bioavailability via subcutaneous injection.' },
        { title: 'Dosing', body: 'Loading: 4–8 mg/week for 4–6 weeks. Maintenance: 2–4 mg/week. Split into 2 injections per week.' },
        { title: 'Administration', body: 'Subcutaneous injection. Can be administered anywhere — not site-specific. Reconstitute with bacteriostatic water.' },
        { title: 'Stack Notes', body: 'Commonly stacked with BPC-157. Complementary mechanisms — BPC-157 is local, TB-500 is systemic. Powerful for chronic injuries.' },
      ]},
      { id: 'ghkcu', label: 'GHK-Cu', category: 'Longevity', cards: [
        { title: 'Overview', body: 'Glycyl-L-histidyl-L-lysine copper complex. Naturally occurring in human plasma. Stimulates collagen synthesis, wound healing, and skin regeneration.' },
        { title: 'Dosing', body: '1–2 mg/day subcutaneous. Topical: 1–3% concentration. Higher doses may be counterproductive — less is more.' },
        { title: 'Administration', body: 'Subcutaneous injection or topical application. For systemic anti-aging: SC injection preferred. Topical effective for skin and hair.' },
        { title: 'Stack Notes', body: 'Pairs well with BPC-157 for tissue repair. Combine with NAD+ precursors for longevity protocols. Anti-fibrotic properties complement peptide stacks.' },
      ]},
      { id: 'pda', label: 'PDA', category: 'Healing', cards: [
        { title: 'Overview', body: 'Pentadeca Arginate. 15-amino acid peptide + arginine. Next-generation BPC-157 analog engineered to navigate FDA compounding restrictions. Rapidly replacing BPC-157 in US clinics.' },
        { title: 'Dosing', body: '250–500 mcg/day SC or oral. Same dosing framework as BPC-157. 8-week cycles. Oral effective for gut-targeted applications.' },
        { title: 'Administration', body: 'Subcutaneous injection or oral capsule. Site-specific injection for localized repair. Reconstitute with bacteriostatic water. Refrigerate after mixing.' },
        { title: 'Stack Notes', body: 'Direct replacement for BPC-157 in compounding-compliant protocols. Stack with TB-500 for systemic + local healing. Pairs with KPV for gut inflammation.' },
      ]},
      { id: 'mgf', label: 'MGF', category: 'Healing', cards: [
        { title: 'Overview', body: 'Mechano Growth Factor. IGF-1 splice variant released in response to muscle damage. Activates satellite cells for muscle repair and hypertrophy. Short, pulsatile action.' },
        { title: 'Dosing', body: '100–200 mcg post-workout, 2–3x per week. Pegylated form (PEG-MGF) extends half-life — 1–2x per week. Inject near target muscle.' },
        { title: 'Administration', body: 'Subcutaneous or intramuscular injection near damaged tissue. Standard MGF: use within 1–2 hours post-training. PEG-MGF: more forgiving timing.' },
        { title: 'Stack Notes', body: 'Pairs with IGF-1 LR3 for full muscle growth axis. Add BPC-157 or PDA for injury recovery stacks. Used alongside CJC-1295/Ipamorelin in performance protocols.' },
      ]},
      { id: 'semax', label: 'Semax', category: 'Cognitive', cards: [
        { title: 'Overview', body: 'ACTH(4-7) analog developed in Russia. Nootropic with BDNF-upregulating and neuroprotective effects. Used for cognitive enhancement and stroke recovery.' },
        { title: 'Dosing', body: '200–600 mcg/day intranasal. Start low at 100 mcg. Cycle 2 weeks on, 1 week off to prevent tolerance.' },
        { title: 'Administration', body: 'Intranasal spray. 1–3 drops per nostril. Reconstitute with saline. Store refrigerated. Highly bioavailable via nasal mucosa.' },
        { title: 'Stack Notes', body: 'Stack with Selank for anxiolytic balance. Combines well with NAD+ for neurological repair. Avoid stacking with stimulants.' },
      ]},
      { id: 'selank', label: 'Selank', category: 'Cognitive', cards: [
        { title: 'Overview', body: 'Synthetic analog of tuftsin. Anxiolytic and nootropic peptide. Modulates IL-6 and BDNF. Developed by the Institute of Molecular Genetics in Russia.' },
        { title: 'Dosing', body: '250–500 mcg/day intranasal. Can be used as needed for acute anxiety. Daily dosing for cognitive enhancement protocols.' },
        { title: 'Administration', body: 'Intranasal spray, 1–2 drops per nostril. Onset within 20–30 minutes. No known dependency or withdrawal.' },
        { title: 'Stack Notes', body: 'Classic stack with Semax for balanced cognitive/anxiety protocol. Pairs with BPC-157 for gut-brain axis support.' },
      ]},
      { id: 'kpv', label: 'KPV', category: 'Anti-inflammatory', cards: [
        { title: 'Overview', body: 'Alpha-MSH-derived tripeptide (Lys-Pro-Val). Potent anti-inflammatory. Targets IBD, gut permeability, and skin inflammation via melanocortin pathways.' },
        { title: 'Dosing', body: '100–500 mcg/day oral or subcutaneous. Oral capsule effective for gut-targeted applications. Higher doses used in acute flare protocols.' },
        { title: 'Administration', body: 'Oral or subcutaneous. Oral preferred for IBD and gut inflammation. SC injection for systemic anti-inflammatory effect.' },
        { title: 'Stack Notes', body: 'Pairs with BPC-157 for gut repair stack. Combine with LL-37 for mucosal immunity. Used in MCAS and post-COVID gut protocols.' },
      ]},
      { id: 'melanotan1', label: 'Melanotan I', category: 'Skin / Photoprotection', cards: [
        { title: 'Overview', body: 'Alpha-MSH analog. Stimulates melanogenesis via MC1R. Used for photoprotection in sun-sensitive patients. EU approved (Scenesse) for EPP. Weaker sexual side effects than Melanotan II.' },
        { title: 'Dosing', body: '250 mcg 2x per week. 8-week cycles. Lower doses than MT-II — titrate to desired pigmentation response. Morning administration preferred.' },
        { title: 'Administration', body: 'Subcutaneous injection. Avoid sun exposure for 24hr post-dose until pigmentation response assessed. Store refrigerated.' },
        { title: 'Stack Notes', body: 'Used in erythropoietic protoporphyria (EPP) and photodermatosis protocols. Lower libido/nausea profile vs MT-II makes it preferred for cosmetic/protective use.' },
      ]},
      { id: 'pt141', label: 'PT-141', category: 'Sexual Health', cards: [
        { title: 'Overview', body: 'Bremelanotide. FDA-approved for female hypoactive sexual desire disorder. Melanocortin receptor agonist acting centrally — not vascular like PDE5 inhibitors.' },
        { title: 'Dosing', body: '1.75 mg intranasal or subcutaneous 45 min before activity. Start at 0.5–1 mg to assess tolerance. Max 1 dose per 24 hours.' },
        { title: 'Administration', body: 'Subcutaneous injection or intranasal. SC preferred for reliability. Avoid in cardiovascular disease — transient BP elevation.' },
        { title: 'Stack Notes', body: 'Used in both male and female libido protocols off-label. Stack with testosterone optimization. Central mechanism differs from sildenafil — additive not redundant.' },
      ]},
    ]
  },
  {
    id: 'gh', label: 'GH Secretagogues',
    protocols: [
      { id: 'cjc1295', label: 'CJC-1295', category: 'GH Secretagogue', cards: [
        { title: 'Overview', body: 'Long-acting GHRH analog. Sustains elevated GH and IGF-1 for up to 6–8 days post-injection. Cornerstone of modern GH optimization protocols.' },
        { title: 'Dosing', body: '100–300 mcg 2–3x per week. Combined with Ipamorelin: 100 mcg CJC-1295 + 200 mcg Ipamorelin per injection. Bedtime dosing preferred.' },
        { title: 'Administration', body: 'Subcutaneous injection. Without DAC form preferred for pulsatile GH release. Reconstitute with bacteriostatic water.' },
        { title: 'Stack Notes', body: 'Classic stack with Ipamorelin for synergistic GH pulse + sustained release. Add BPC-157 and TB-500 for the full performance/recovery protocol.' },
      ]},
      { id: 'ipamorelin', label: 'Ipamorelin', category: 'GH Secretagogue', cards: [
        { title: 'Overview', body: 'Selective GHRP and ghrelin mimetic. Triggers sharp GH pulse without elevating cortisol or prolactin. Cleanest side-effect profile in its class.' },
        { title: 'Dosing', body: '200–300 mcg/day. Split: 100–150 mcg morning (fasted/post-workout) + 100–150 mcg pre-sleep. 8–12 week cycles with breaks.' },
        { title: 'Administration', body: 'Subcutaneous injection. Administer fasted or away from meals for optimal GH pulse. Night dosing aligns with natural GH rhythm.' },
        { title: 'Stack Notes', body: 'Pair with CJC-1295 for rapid spike + prolonged IGF-1 rise. Add BPC-157 for tissue repair. WADA-prohibited — flag for athlete patients.' },
      ]},
      { id: 'sermorelin', label: 'Sermorelin', category: 'GH Secretagogue', cards: [
        { title: 'Overview', body: 'First 29 amino acids of endogenous GHRH. Oldest prescribed GH secretagogue. Stimulates pituitary GH release with a gentler, more physiologic profile than CJC-1295.' },
        { title: 'Dosing', body: '200–500 mcg/day at bedtime. 3–6 month cycles. Clinical improvements in lean mass, skin thickness, and sleep noted in older adults.' },
        { title: 'Administration', body: 'Subcutaneous injection, bedtime only. Shorter half-life than CJC-1295 — daily dosing required. Refrigerate reconstituted vials.' },
        { title: 'Stack Notes', body: 'Often prescribed as entry-level GH secretagogue. Stack with Ipamorelin for enhanced effect. More hunger side effects vs CJC/Ipamorelin combo.' },
      ]},
      { id: 'tesamorelin', label: 'Tesamorelin', category: 'GH Secretagogue', cards: [
        { title: 'Overview', body: 'FDA-approved GHRH analog (Egrifta). Only approved GH secretagogue in the US. Clinically validated for visceral fat reduction and metabolic improvement.' },
        { title: 'Dosing', body: '1–2 mg SC daily. Egrifta WR: 1.28 mg daily. Off-label longevity: 1 mg nightly. Stronger fat-loss effect than CJC-1295.' },
        { title: 'Administration', body: 'Subcutaneous injection, preferably at bedtime. Rotate injection sites. Monitor IGF-1 and fasting glucose on protocol.' },
        { title: 'Stack Notes', body: 'Combine with Ipamorelin for full GH axis optimization. Superior to CJC-1295 for visceral fat. Transition from exogenous GH to Tesamorelin for safer long-term use.' },
      ]},
      { id: 'ghrp2', label: 'GHRP-2', category: 'GH Secretagogue', cards: [
        { title: 'Overview', body: 'Second-generation GHRP. Potent GH pulse stimulator via ghrelin receptor. Raises cortisol and prolactin more than Ipamorelin — stronger but less selective.' },
        { title: 'Dosing', body: '100–300 mcg SC 2–3x per day fasted. Often combined with a GHRH analog (CJC-1295 or Sermorelin). Morning + pre-sleep most common split.' },
        { title: 'Administration', body: 'Subcutaneous injection, fasted or between meals. Multiple daily doses mimic natural pulsatile GH rhythm.' },
        { title: 'Stack Notes', body: 'Stronger GH release than Ipamorelin but watch cortisol. Stack with CJC-1295 for synergistic pulse + sustained IGF-1. Avoid in anxiety-prone patients.' },
      ]},
      { id: 'ghrp6', label: 'GHRP-6', category: 'GH Secretagogue', cards: [
        { title: 'Overview', body: 'First-generation GHRP. Significant appetite stimulation via ghrelin mimicry. Used in muscle wasting and cachexia protocols. Strong GH pulse but prominent hunger side effect.' },
        { title: 'Dosing', body: '100–300 mcg SC 2–3x per day fasted. Hunger effect peaks 30–60 min post-injection. Useful where appetite stimulation is therapeutic.' },
        { title: 'Administration', body: 'Subcutaneous injection. Administer fasted. Expect significant hunger response — plan meals accordingly. Stack with GHRH analog for amplified GH release.' },
        { title: 'Stack Notes', body: 'Preferred in cachexia and muscle-wasting protocols. Stack with Sermorelin for older patients needing both GH + appetite support.' },
      ]},
    ]
  },
  {
    id: 'bioregulators', label: 'Bioregulators',
    protocols: [
      { id: 'epithalon', label: 'Epithalon', category: 'Longevity', cards: [
        { title: 'Overview', body: 'Tetrapeptide (Ala-Glu-Asp-Gly). Telomerase activator. Discovered by Prof. Khavinson. Clinical research spans 30+ years on longevity and cancer prevention.' },
        { title: 'Dosing', body: '5–10 mg/day for 10–20 days, 1–2 cycles per year. Some protocols use 100 mcg/kg. Subcutaneous or IV.' },
        { title: 'Administration', body: 'Subcutaneous injection preferred. IV administration for clinical protocols. Pineal gland activation — best administered in evening.' },
        { title: 'Stack Notes', body: 'Pairs with GHK-Cu for comprehensive longevity protocol. Combine with NAD+ and resveratrol. Annual or biannual cycling recommended.' },
      ]},
      { id: 'thymalin', label: 'Thymalin', category: 'Bioregulator', cards: [
        { title: 'Overview', body: 'Thymic peptide bioregulator. Normalizes immune function and T-cell activity. 6-year clinical trials showed 4.1-fold mortality reduction when combined with Epithalon.' },
        { title: 'Dosing', body: '5–20 mg per course. Annual or biannual cycles of 10 days. Khavinson protocols stack 3–5 bioregulators simultaneously.' },
        { title: 'Administration', body: 'Intramuscular injection. 10-day course once or twice per year. Always include circulatory bioregulator (Vesugen) as base.' },
        { title: 'Stack Notes', body: 'Core stack: Thymalin + Epithalon. Vesugen improves tissue penetration. Strongest mortality data of any bioregulator combination.' },
      ]},
      { id: 'vesugen', label: 'Vesugen', category: 'Bioregulator', cards: [
        { title: 'Overview', body: 'Blood vessel bioregulator (tripeptide). Targets vascular endothelium. Khavinson used it as the base of most stacks to improve target organ tissue penetration.' },
        { title: 'Dosing', body: '5–10 mg per course. 10-day cycles. Oral bioavailability due to ultra-short chain (2–4 amino acids).' },
        { title: 'Administration', body: 'Oral capsule or injection. Typically included as base in multi-bioregulator stacks. Convenient daily oral dosing.' },
        { title: 'Stack Notes', body: 'Foundation of most Khavinson stacks. Improves systemic circulation, enhancing delivery of all co-administered bioregulators.' },
      ]},
      { id: 'pinealon', label: 'Pinealon', category: 'Bioregulator', cards: [
        { title: 'Overview', body: 'Pineal gland bioregulator. Tripeptide Glu-Asp-Arg. Neuroprotective, regulates circadian rhythm and melatonin. Used in neurodegenerative and cognitive decline protocols.' },
        { title: 'Dosing', body: '5–10 mg per course. 10-day cycles 1–2 times per year. Evening dosing aligned with circadian regulation.' },
        { title: 'Administration', body: 'Oral or injection. Evening administration preferred. Oral bioavailability validated for ultra-short peptide chains.' },
        { title: 'Stack Notes', body: 'Stack with Cortagen for full neuroprotection protocol. Pairs with Epithalon for pineal/telomerase longevity axis.' },
      ]},
      { id: 'cortagen', label: 'Cortagen', category: 'Bioregulator', cards: [
        { title: 'Overview', body: "Cerebral cortex bioregulator. Tetrapeptide targeting neuronal gene expression. Applied in Alzheimer's, Parkinson's, TBI, and long COVID brain fog protocols." },
        { title: 'Dosing', body: '5–10 mg per course. 10-day cycles. Used in neurodegenerative stacks alongside Pinealon and Vesugen.' },
        { title: 'Administration', body: 'Oral or IM injection. Blood-brain barrier penetration supported by ultra-short chain length.' },
        { title: 'Stack Notes', body: 'Core neuro stack: Cortagen + Pinealon + Vesugen. Khavinson neurodegenerative protocol adds Thymalin for immune support.' },
      ]},
      { id: 'vilon', label: 'Vilon', category: 'Bioregulator', cards: [
        { title: 'Overview', body: 'Dipeptide bioregulator (Lys-Glu). Protects cell nucleus, facilitates DNA repair, and modulates immune homeostasis. Geroprotective effects in long-term clinical trials.' },
        { title: 'Dosing', body: '1–2 mg per course. Among the smallest bioregulators at 2 amino acids. Annual cycles alongside other geroprotectors.' },
        { title: 'Administration', body: 'Oral or injection. Exceptional oral bioavailability due to minimal size. Often combined with Epithalon in longevity protocols.' },
        { title: 'Stack Notes', body: 'Pairs with Epithalon and Thymalin in the core longevity stack. Provides genomic stability support to complement telomerase activation.' },
      ]},
    ]
  },
  {
    id: 'immune', label: 'Immune',
    protocols: [
      { id: 'thymosin_a1', label: 'Thymosin Alpha-1', category: 'Immune', cards: [
        { title: 'Overview', body: 'Endogenous thymic peptide. Approved in 35+ countries for viral hepatitis and immune support. Stimulates T-cell differentiation and enhances thymic output. Most clinically validated immune peptide.' },
        { title: 'Dosing', body: '1.5 mg SC 2–5x per week. 8-week cycles. Seasonal cycling during high-risk periods. Loading phase optional for immunodeficient patients.' },
        { title: 'Administration', body: 'Subcutaneous injection. Morning dosing preferred. Monitor CBC and T-cell panels on protocol. Prescription-only access.' },
        { title: 'Stack Notes', body: 'Stack with TB-500 for tissue repair + immune rebuilding. Pairs with Epithalon for comprehensive longevity protocol. Often stacked with Thymalin for full thymic axis.' },
      ]},
      { id: 'll37', label: 'LL-37', category: 'Immune', cards: [
        { title: 'Overview', body: 'Human cathelicidin antimicrobial peptide. Innate immune modulator. Antimicrobial, antiviral, and wound-healing properties. Tightly regulated — excess linked to inflammation.' },
        { title: 'Dosing', body: '125–250 mcg/day. 50-day straight protocols followed by 4-week break. Lower doses preferred to avoid inflammatory overstimulation.' },
        { title: 'Administration', body: 'Subcutaneous injection. Daily administration. Careful dose titration — start low. Monitor inflammatory markers (CRP, IL-6) on protocol.' },
        { title: 'Stack Notes', body: 'Pairs with KPV for mucosal immunity. Stack with Thymosin Alpha-1 for synergistic immune rebuilding. Caution: excess LL-37 can worsen autoimmune conditions.' },
      ]},
      { id: 'vip', label: 'VIP', category: 'Immune', cards: [
        { title: 'Overview', body: 'Vasoactive Intestinal Peptide. 28-amino acid neuropeptide. Core protocol for CIRS, MCAS, and mast cell activation. Modulates neuroinflammation and mucosal immunity.' },
        { title: 'Dosing', body: '50 mcg intranasal 4x/day. Shoemaker CIRS protocol: must complete binders and VCS normalization before starting VIP. Do not use in active MARCoNS.' },
        { title: 'Administration', body: 'Intranasal only. Compounded nasal spray. Patient must have normal C4a, TGF-beta 1, and MMP-9 before initiating. Part of sequential CIRS treatment.' },
        { title: 'Stack Notes', body: 'Final step in Shoemaker CIRS protocol. Combine with BPC-157 for gut/mucosal repair. Used in long COVID neuroinflammation protocols.' },
      ]},
    ]
  },
  {
    id: 'hormonal', label: 'Hormonal / Endocrine',
    protocols: [
      { id: 'kisspeptin', label: 'Kisspeptin', category: 'Hormonal', cards: [
        { title: 'Overview', body: 'Hypothalamic neuropeptide. Master regulator of the HPG axis — triggers GnRH, then LH/FSH cascade. Used in fertility protocols and testosterone optimization in men on TRT.' },
        { title: 'Dosing', body: '50–100 mcg SC pulsatile dosing. For TRT support: 100–200 mcg 2–3x per week to maintain testicular function. Pulsatile pump for fertility protocols.' },
        { title: 'Administration', body: 'Subcutaneous injection. Pulsatile administration critical — continuous dosing causes receptor desensitization. Coordinate with LH/FSH monitoring.' },
        { title: 'Stack Notes', body: 'Used with Gonadorelin for complete HPG axis support on TRT. Fertility stacks combine with HCG and Clomiphene. Monitor testosterone, LH, FSH, estradiol.' },
      ]},
      { id: 'gonadorelin', label: 'Gonadorelin', category: 'Hormonal', cards: [
        { title: 'Overview', body: 'Synthetic GnRH analog. Stimulates LH and FSH from the pituitary. Primary use: maintain testicular function and fertility in men on testosterone replacement therapy.' },
        { title: 'Dosing', body: '100 mcg SC 2x per week. Standard TRT adjunct protocol. Prevents testicular atrophy and preserves sperm production. Monitor LH/FSH response after 6–8 weeks.' },
        { title: 'Administration', body: 'Subcutaneous injection. Small volume, any SC site. Not on same day as TRT injection to avoid interference with peak testosterone.' },
        { title: 'Stack Notes', body: 'Standard of care pairing with TRT to replace HCG (now limited by FDA compounding rules). Add Kisspeptin for upstream HPG axis support. Monitor testicular size and sperm count.' },
      ]},
    ]
  },
  {
    id: 'metabolic', label: 'Metabolic',
    protocols: [
      { id: 'aod9604', label: 'AOD-9604', category: 'Metabolic', cards: [
        { title: 'Overview', body: 'GH fragment 176-191. Fat-burning properties of GH without IGF-1 elevation or anabolic effects. Lipolysis via beta-3 adrenergic receptors.' },
        { title: 'Dosing', body: '300 mcg/day SC, morning fasted. 5 days on, 2 days off. 8-week cycles. Stack with Tesamorelin for enhanced visceral fat reduction.' },
        { title: 'Administration', body: 'Subcutaneous injection, fasted state. Avoid carbohydrates within 30 min before/after. Reconstitute with bacteriostatic water.' },
        { title: 'Stack Notes', body: 'Pairs with Tesamorelin for visceral fat protocol. Add MOTS-c for metabolic syndrome stack. Lower risk profile than full GH secretagogues for fat loss.' },
      ]},
      { id: 'retatrutide', label: 'Retatrutide', category: 'Metabolic', cards: [
        { title: 'Overview', body: 'Triple agonist: GLP-1 / GIP / glucagon receptors. Phase 3 trials showing superior weight loss vs tirzepatide. Emerging as next-generation metabolic peptide.' },
        { title: 'Dosing', body: '0.5–12 mg SC once weekly. Dose escalation over 24 weeks. Phase 3 data: up to 24% body weight reduction at highest doses.' },
        { title: 'Administration', body: 'Subcutaneous injection once weekly. Currently pre-approval — available via clinical trials or compounding. Monitor lipase, amylase, and cardiovascular markers.' },
        { title: 'Stack Notes', body: 'Glucagon component adds thermogenic effect beyond GLP-1/GIP dual agonists. Not yet combined with other peptides in formal protocols. Watch FDA timeline.' },
      ]},
    ]
  },
  {
    id: 'neuro', label: 'Neuropeptides',
    protocols: [
      { id: 'dihexa', label: 'Dihexa', category: 'Cognitive', cards: [
        { title: 'Overview', body: 'Angiotensin IV analog. BDNF-potentiating — estimated 10 million times more potent than BDNF itself in promoting synaptogenesis. Memory and neurogenesis research peptide.' },
        { title: 'Dosing', body: '10–30 mg transdermal or oral. Start at 10 mg. Cycle 2 weeks on, 2 weeks off. Long half-life accumulates with daily use — less is more.' },
        { title: 'Administration', body: 'Transdermal cream or oral. Transdermal preferred for CNS penetration. Not water-soluble — requires DMSO or lipid carrier for topical use.' },
        { title: 'Stack Notes', body: 'Stack with Semax for BDNF + cognitive enhancement. Pairs with Cerebrolysin for neurodegeneration protocols. Extreme potency — respect the dose.' },
      ]},
      { id: 'cerebrolysin', label: 'Cerebrolysin', category: 'Cognitive', cards: [
        { title: 'Overview', body: "Porcine brain-derived neuropeptide mixture. Contains BDNF, NGF, CNTF analogs. Approved and widely used for stroke, TBI, and Alzheimer's in Europe and Asia." },
        { title: 'Dosing', body: '5–30 mL IV or IM daily. 10–20 day inpatient cycles for neurological indications. Lower doses (5–10 mL) used in longevity and cognitive protocols.' },
        { title: 'Administration', body: 'IV infusion or IM injection. IV preferred for acute neurological protocols. Slow infusion over 30–60 min. Available via compounding or import.' },
        { title: 'Stack Notes', body: 'Pairs with Dihexa for comprehensive neurotrophin stack. Add Cortagen and Pinealon for full neuroprotection. Widely combined with NAD+ in anti-aging clinics.' },
      ]},
      { id: 'dsip', label: 'DSIP', category: 'Sleep / Stress', cards: [
        { title: 'Overview', body: 'Delta Sleep-Inducing Peptide. Nonapeptide regulating slow-wave sleep and HPA axis. Reduces ACTH and cortisol. Used in stress, sleep disorders, and withdrawal protocols.' },
        { title: 'Dosing', body: '100–400 mcg SC before sleep. Can be used acutely or in cycles. Reduces cortisol — monitor adrenal axis on extended protocols.' },
        { title: 'Administration', body: 'Subcutaneous injection 30–60 min before bed. Refrigerate reconstituted vials. Short half-life — timing is critical for sleep induction.' },
        { title: 'Stack Notes', body: 'Stack with Selank for full anxiety/sleep protocol. Pairs with Epithalon for circadian + longevity stack. Used in opioid and stimulant withdrawal adjunct protocols.' },
      ]},
    ]
  },
  {
    id: 'glp1', label: 'GLP-1 Agonists',
    protocols: [
      { id: 'semaglutide', label: 'Semaglutide', category: 'GLP-1 / Metabolic', cards: [
        { title: 'Overview', body: 'FDA-approved GLP-1 receptor agonist. Ozempic (T2D/CKD), Wegovy (obesity/MASH/cardiovascular risk reduction). SURMOUNT-5 head-to-head vs tirzepatide: 13.7% weight loss at 72 weeks. Most prescribed peptide therapy in the world. Once-weekly SC or daily oral.' },
        { title: 'Dosing', body: 'Ozempic: 0.25 mg SC weekly x4 weeks → 0.5 mg → 1 mg → 2 mg. Wegovy: 0.25 mg weekly escalation to 2.4 mg maintenance over 16 weeks. Oral Rybelsus: 3 mg daily → 7 mg → 14 mg. Real-world data: 7.7% weight loss at 1 year.' },
        { title: 'Administration', body: 'SC injection once weekly, any day. Inject abdomen, thigh, or upper arm. Oral form: take fasted with ≤4 oz water, wait 30 min before eating. Pen devices auto-dose. Refrigerate; can store at room temp up to 56 days after first use.' },
        { title: 'Stack Notes', body: 'GI side effects managed with low-dose ondansetron or famotidine. Pair with BPC-157 or KPV for gut tolerability. Muscle preservation: stack with protein optimization and resistance training. Monitor: renal function, thyroid (MTC history contraindication), pancreatitis signs.' },
      ]},
      { id: 'tirzepatide', label: 'Tirzepatide', category: 'GLP-1 / GIP Dual Agonist', cards: [
        { title: 'Overview', body: 'FDA-approved dual GLP-1 / GIP receptor agonist. Mounjaro (T2D), Zepbound (obesity, OSA). SURMOUNT-5: 20.2% weight loss vs 13.7% semaglutide — definitively superior at head-to-head. First GLP-1 approved for obstructive sleep apnea (Dec 2024). GIP component adds thermogenic and appetite effect.' },
        { title: 'Dosing', body: '2.5 mg SC weekly for 4 weeks → escalate by 2.5 mg every 4 weeks to target dose 5–15 mg. Phase 3 peak: 20.2% body weight reduction. Real-world: 12.4% at 1 year. 63% persistence at 1 year (vs 40% semaglutide in 2023 cohort).' },
        { title: 'Administration', body: 'SC injection once weekly. Auto-injector pen. Same rotation sites as semaglutide. Refrigerate; room temp up to 21 days. Approved for adults BMI ≥30, or ≥27 with weight-related comorbidity. Contraindicated with personal/family MTC history.' },
        { title: 'Stack Notes', body: 'Superior to semaglutide for total weight loss — preferred first-line for high-BMI patients. Combine with Retatrutide sequencing if plateau reached. Add AOD-9604 or MOTS-c for enhanced metabolic effect. Monitor fasting glucose, lipase, amylase, and HR.' },
      ]},
      { id: 'liraglutide', label: 'Liraglutide', category: 'GLP-1 / Metabolic', cards: [
        { title: 'Overview', body: 'First GLP-1 approved for obesity (Saxenda, 2014). Also Victoza for T2D. Daily SC injection. SCALE trial: 8.0% weight loss at 56 weeks. Less potent than semaglutide and tirzepatide but longest real-world safety record. Generic expected 2027.' },
        { title: 'Dosing', body: 'Saxenda: 0.6 mg SC daily for 1 week → weekly escalation to 3.0 mg maintenance. Victoza (T2D): 0.6 mg → 1.2 mg → 1.8 mg daily. Discontinue if <4% weight loss at 16 weeks. Daily injection burden limits adherence vs weekly agents.' },
        { title: 'Administration', body: 'SC injection once daily, same time. Multi-dose pen. Abdomen, thigh, or upper arm. Refrigerate; room temp up to 30 days. Slower dose escalation reduces GI side effects. More appropriate for patients who cannot tolerate weekly-interval dose stacking.' },
        { title: 'Stack Notes', body: 'Preferred in patients with needle anxiety due to daily low-dose pattern. Lower peak GI side effect burden. Transition to semaglutide or tirzepatide once tolerability established. Combine with KPV for GI tolerability protocol.' },
      ]},
      { id: 'orforglipron', label: 'Orforglipron', category: 'GLP-1 / Oral', cards: [
        { title: 'Overview', body: 'Oral non-peptide GLP-1 receptor agonist (Eli Lilly). Phase 3 ATTAIN-OBESITY trial: 7.9% weight loss at 36 weeks. No refrigeration required. No injection. First true oral GLP-1 agonist without food/water restrictions — addresses semaglutide oral formulation limitations. FDA submission expected 2026.' },
        { title: 'Dosing', body: 'Phase 3 doses: 12 mg, 24 mg, 36 mg, 45 mg oral daily. Can be taken with or without food (unlike oral semaglutide). Dose-dependent weight loss up to 9.4% at highest doses. Once-daily tablet.' },
        { title: 'Administration', body: 'Oral tablet once daily. No fasting requirement unlike Rybelsus. Major adherence advantage for needle-averse patients and underserved populations. Pending FDA approval as of early 2026 — monitor regulatory timeline.' },
        { title: 'Stack Notes', body: 'Game-changer for oral GLP-1 access at scale. When approved, expected to cannibalize compounded semaglutide market. Pair with resistance training and adequate protein (1.6g/kg) to preserve lean mass during weight loss. Watch drug-drug interactions — CYP3A4 considerations.' },
      ]},
    ]
  },
  {
    id: 'aesthetics', label: 'Aesthetic & Topical',
    protocols: [
      { id: 'matrixyl', label: 'Matrixyl (Pal-KTTKS)', category: 'Aesthetic / Collagen', cards: [
        { title: 'Overview', body: 'Palmitoyl Pentapeptide-4. Most studied cosmetic collagen-stimulating peptide. Signals fibroblasts to produce collagen I, III, and IV and fibronectin. Derived from procollagen Type I. Proven to reduce wrinkle depth in controlled human trials. Gold standard ingredient in evidence-based medical aesthetics.' },
        { title: 'Dosing', body: 'Topical: 3–10 ppm (0.0003–0.001% active peptide) in cosmetic formulations. Clinical studies use 4 ppm. Twice daily application. Matrixyl 3000 combines Pal-KTTKS + Pal-GHK for dual matrix signal. Visible results in 4–8 weeks of consistent use.' },
        { title: 'Administration', body: 'Topical serum or cream. Apply to clean dry skin. Do not rinse off. Combine with vitamin C or retinoids — compatible and additive. Can be added to post-procedure protocols post-microneedling or laser for enhanced matrix remodeling.' },
        { title: 'Stack Notes', body: 'Synergistic with GHK-Cu topical for comprehensive matrix remodeling. Combine with Argireline for wrinkle depth + expression line protocol. Post-procedure: apply post-microneedling for enhanced collagen signal. OTC access — no prescription required.' },
      ]},
      { id: 'argireline', label: 'Argireline (Acetyl Hex-3)', category: 'Aesthetic / Neuromodulator', cards: [
        { title: 'Overview', body: 'Acetyl Hexapeptide-3. Topical neuromodulator — competes with SNAP-25 in SNARE complex to inhibit acetylcholine vesicle release at neuromuscular junction. Reduces expression-line depth via partial muscle relaxation. Called "topical Botox" in popular press — mechanism is similar, effect is weaker.' },
        { title: 'Dosing', body: 'Topical: 3–10% concentration in finished product. Twice daily application. Clinical data: 17% reduction in wrinkle depth at 30 days at 10% concentration. Effect is cumulative — consistent use required. No systemic absorption or toxicity.' },
        { title: 'Administration', body: 'Topical serum or cream. Forehead, periorbital, and perioral areas. Apply before moisturizer. Can be layered with Matrixyl. Not a replacement for neurotoxin in deep dynamic lines — adjunct or maintenance tool between treatments.' },
        { title: 'Stack Notes', body: 'Pairs with Leuphasyl for enhanced SNARE inhibition stack. Combine with Matrixyl 3000 and GHK-Cu for comprehensive anti-aging topical protocol. Excellent for maintaining Botox/Dysport results between injection cycles.' },
      ]},
      { id: 'ghkcu_topical', label: 'GHK-Cu Topical', category: 'Aesthetic / Regenerative', cards: [
        { title: 'Overview', body: 'Glycyl-L-histidyl-L-lysine copper complex in topical delivery. Stimulates collagen, elastin, and glycosaminoglycan synthesis. Anti-inflammatory and antioxidant. Wound healing acceleration. One of the most well-evidenced topical peptides — Pickart research spans 40+ years.' },
        { title: 'Dosing', body: '1–3% concentration in topical formulation. Once or twice daily. Higher concentrations (>3%) may have paradoxical effects — less is more principle applies topically as well as systemically. Use serums not creams for better penetration.' },
        { title: 'Administration', body: 'Topical serum. Apply to face, neck, décolletage. Can be used post-procedure. Blue tint from copper is normal. Avoid eyes. Compatible with most actives. Caution with high-dose vitamin C — may chelate copper in formulation.' },
        { title: 'Stack Notes', body: 'Combines with Matrixyl and Argireline for complete topical anti-aging protocol. Add post-microneedling or fractional laser for trans-epidermal delivery enhancement. Pairs with systemic GHK-Cu SC injections for combined topical + systemic collagen protocol.' },
      ]},
      { id: 'snap8', label: 'SNAP-8', category: 'Aesthetic / Neuromodulator', cards: [
        { title: 'Overview', body: '8-amino acid extension of Argireline. Targets SNAP-25 with greater specificity than the hexapeptide form. Reduces contraction of facial muscles responsible for expression wrinkles. Human in vitro studies show superior SNARE complex inhibition vs Argireline. Emerging as the next-generation topical neuromodulator.' },
        { title: 'Dosing', body: 'Topical: 4–10% in finished product. Once or twice daily. Early data suggests efficacy at lower concentrations than Argireline due to enhanced receptor specificity. Results at 4–8 weeks consistent use.' },
        { title: 'Administration', body: 'Topical serum or cream. Same application zones as Argireline. Emerging as preferred neuromodulator peptide in evidence-based formulations. Can be combined with Argireline — different SNARE binding positions.' },
        { title: 'Stack Notes', body: 'Used alongside Argireline in premium anti-aging serums for full SNARE inhibition. Combine with Matrixyl 3000 + GHK-Cu for complete anti-aging topical protocol. Post-toxin maintenance: start protocol 2 weeks post-injection for extended neuromodulator effect.' },
      ]},
    ]
  },
  {
    id: 'gut', label: 'Gut & Permeability',
    protocols: [
      { id: 'larazotide', label: 'Larazotide (AT-1001)', category: 'Gut / Tight Junction', cards: [
        { title: 'Overview', body: 'Synthetic 8-amino acid peptide (GGVLVQPG). Zonulin antagonist — competitively blocks zonulin receptor binding to prevent tight junction opening. Only direct pharmaceutical-grade tight junction regulator. Phase II/III clinical trials in celiac disease. Broad application in leaky gut, IBD, autoimmune conditions, and metaflammation protocols.' },
        { title: 'Dosing', body: 'Oral: 0.5–1 mg 3x daily before meals. Phase II celiac data: 0.5 mg outperformed higher doses (narrow therapeutic window — more is not better). Cycle 4–12 weeks. Clinical trial discontinuation in 2022 does not negate the evidence base — mechanism and safety data are solid.' },
        { title: 'Administration', body: 'Oral capsule taken 15–30 min before meals. Gut-restricted mechanism — minimal systemic absorption by design. No refrigeration required. Safe with concurrent probiotic protocols. Combine with gluten-free diet in celiac patients for additive barrier protection.' },
        { title: 'Stack Notes', body: 'Pairs with BPC-157 oral for comprehensive gut healing: Larazotide closes tight junctions while BPC-157 stimulates epithelial repair. Add KPV for anti-inflammatory synergy. L-glutamine provides substrate for epithelial cell turnover. Akkermansia muciniphila naturally produces a Larazotide-like peptide — probiotic pairing has mechanistic logic.' },
      ]},
      { id: 'teduglutide', label: 'Teduglutide (Gattex)', category: 'Gut / GLP-2 Agonist', cards: [
        { title: 'Overview', body: 'GLP-2 receptor agonist. FDA-approved for Short Bowel Syndrome (SBS). 33-amino acid analogue of glucagon-like peptide 2. Promotes intestinal epithelial growth, enhances nutrient and fluid absorption, reduces IV parenteral nutrition dependency. Off-label use emerging in IBD and gut permeability protocols.' },
        { title: 'Dosing', body: 'FDA-approved SBS dose: 0.05 mg/kg SC once daily. Off-label gut repair: 0.025–0.05 mg/kg daily. Reconstitute with supplied diluent immediately before use. Clinical response typically seen within 20–24 weeks in SBS trials.' },
        { title: 'Administration', body: 'SC injection once daily. Rotate sites: abdomen, thigh, upper arm. Refrigerate — do not freeze. Use within 3 hours of reconstitution. Requires colonoscopy surveillance due to polyp risk with long-term use. Physician supervision mandatory.' },
        { title: 'Stack Notes', body: 'Combines with Larazotide for dual gut barrier + epithelial growth protocol. GLP-2 + GLP-1 agonism complementary — consider adding Semaglutide at low dose in metabolic IBD patients. Monitor for intestinal obstruction risk in Crohn\'s with strictures. Strong synergy with BPC-157 for post-surgical gut repair.' },
      ]},
      { id: 'oxytocin', label: 'Oxytocin', category: 'Social / Gut / Pain', cards: [
        { title: 'Overview', body: 'Nonapeptide (9 amino acids) produced in hypothalamus, released by posterior pituitary. Beyond "love hormone" — directly reduces gut permeability, modulates intestinal motility, inhibits C-fiber nociception via TRPV1. FDA-approved as Pitocin for obstetrics since 1980. Emerging clinical use in pain, PTSD, autism spectrum disorder, social anxiety, and IBS.' },
        { title: 'Dosing', body: 'Intranasal (social/psychiatric): 20–40 IU per dose, 30–45 min before target window. Effects peak 45–60 min, last 1–3 hours. SC injection (pain/gut): 100–500 mcg daily, titrate gradually. Autism protocol: 48 IU daily showed benefit per 2025 meta-analysis vs placebo at lower doses. Chronic pain: 20–40 mcg SC once or twice daily.' },
        { title: 'Administration', body: 'Intranasal: 3–4 sprays per nostril, 4 IU/spray. Do not exceed recommended dose — bidirectional effects reported. SC injection: Reconstitute 10 mg vial in 3 mL bac water = 3.33 mg/mL. Store lyophilized at −20°C; reconstituted at 2–8°C up to 28 days. Contraindicated in pregnancy (induces labor). Caution in men: long-term daily use may contribute to prostate enlargement.' },
        { title: 'Stack Notes', body: 'Pairs with Selank for comprehensive social anxiety protocol — different but complementary mechanisms (GABA vs. oxytocin receptor). Combine with DSIP at night, oxytocin during day. SC route preferred for gut and pain effects; intranasal for social/cognitive. Context-dependent: positive social environments amplify prosocial effects — timing matters.' },
      ]},
    ]
  },
  {
    id: 'pipeline', label: 'Next-Gen Pipeline',
    protocols: [
      { id: 'retatrutide', label: 'Retatrutide', category: 'Pipeline / Triple Agonist', cards: [
        { title: 'Overview', body: 'Triple GIP/GLP-1/Glucagon receptor agonist (Eli Lilly, LY3437943). First triple incretin agonist in Phase 3. Phase 2 NEJM data: 24.2% mean weight loss at 12 mg over 48 weeks — highest pharmaceutical weight loss ever recorded, comparable to bariatric surgery. 100% of patients achieved ≥5% weight loss at 8 mg/12 mg doses. TRIUMPH Phase 3 program underway — FDA submission expected 2026–2027.' },
        { title: 'Dosing', body: 'Phase 2 doses tested: 1 mg, 4 mg, 8 mg, 12 mg SC weekly. Starting dose 2 mg (lower start vs 4 mg reduces GI side effects). Phase 3 TRIUMPH program escalation protocol: 2 mg → 4 mg → 8 mg → 12 mg weekly. NOT yet FDA-approved. Available only through research or clinical trials. Monitor HR — dose-dependent increase peaks at week 24 then declines.' },
        { title: 'Administration', body: 'SC injection once weekly. Same rotation sites as semaglutide/tirzepatide. Must be sourced through legitimate clinical trial channels or emerging compounding access post-approval. Phase 3 readouts expected 2026. GI profile similar to tirzepatide — manage with slow escalation. Avoid in personal/family history of MTC.' },
        { title: 'Stack Notes', body: 'Adds glucagon receptor agonism on top of GIP/GLP-1 = thermogenic + fat metabolism effect beyond tirzepatide. The glucagon component increases energy expenditure — distinct from semaglutide or tirzepatide mechanisms. For patients who plateau on tirzepatide, retatrutide represents the logical escalation once approved. Monitor: HR, lipase, amylase, bone density with prolonged use.' },
      ]},
      { id: 'cagrisema', label: 'CagriSema', category: 'Pipeline / Dual Combo', cards: [
        { title: 'Overview', body: 'Combination of Semaglutide 2.4 mg + Cagrilintide 2.4 mg (Novo Nordisk). Cagrilintide is a long-acting amylin analogue targeting amylin receptors in the brainstem — distinct mechanism from incretin pathway. Phase 3 REDEFINE trials: 22.7% mean weight loss at 68 weeks. Preserves lean body mass and bone density better than semaglutide alone. FDA submission timeline: 2026–2027.' },
        { title: 'Dosing', body: 'Co-formulated single weekly SC injection. Dose escalation follows semaglutide titration schedule with cagrilintide step-up. Phase 3 monotherapy cagrilintide: 11.8% weight loss. CagriSema combined: 22.7% — demonstrates synergy well beyond additive effect of individual components. Not yet FDA approved as of March 2026.' },
        { title: 'Administration', body: 'Single co-formulated pen, once weekly SC. Same injection technique as Wegovy. Once approved, represents a single-injection combination vs. two separate injections. Advantage over retatrutide: preserves more lean mass due to amylin mechanism acting via brainstem satiety without the thermogenic glucagon component that can affect muscle mass.' },
        { title: 'Stack Notes', body: 'Preferred over retatrutide for patients with sarcopenia risk or who require lean mass preservation. Add resistance training protocol — amylin pathway does not negatively affect muscle the way glucagon can at high doses. Monitor: nausea (additive from both components), thyroid, and pancreatitis markers. Watch REDEFINE trial readout 2026 — head-to-head vs tirzepatide data critical.' },
      ]},
      { id: 'survodutide', label: 'Survodutide', category: 'Pipeline / GLP-1/Glucagon', cards: [
        { title: 'Overview', body: 'Dual GLP-1/Glucagon receptor agonist (Boehringer Ingelheim / Zealand Pharma). Differentiated from retatrutide by absence of GIP — positions as MASH-specialist metabolic drug. Phase 2 MASH data: 43–62% of patients showed histologic improvement with no worsening of fibrosis vs 14% placebo. Phase 2 obesity: up to 19% weight loss at 46 weeks. SYNCHRONIZE Phase 3 program underway.' },
        { title: 'Dosing', body: 'Phase 2 doses: 0.6 mg, 2.4 mg, 3.6 mg, 4.8 mg SC weekly. Dose-dependent weight loss — 6% at 0.6 mg to 15% at 4.8 mg. Once-weekly SC injection. Not yet FDA approved. Phase 3 SYNCHRONIZE trials expected to complete 2026–2027. Most clinically differentiated GLP-1 pipeline agent for liver disease.' },
        { title: 'Administration', body: 'SC injection once weekly. Standard GLP-1 injection technique. GI profile comparable to other GLP-1 agents — managed with slow escalation. Primary target patient: metabolic obesity + MASH or NAFLD with liver fibrosis risk. Glucagon component specifically reduces hepatic lipid accumulation and increases mitochondrial turnover in liver cells.' },
        { title: 'Stack Notes', body: 'For patients with MASH + obesity: survodutide addresses both simultaneously via GLP-1 weight loss + glucagon hepatic fat reduction. Pair with SS-31 (Elamipretide) for mitochondrial support in MASH protocols. MOTS-c adds skeletal muscle metabolic benefit. Monitor: LFTs, FIB-4 score, liver stiffness via elastography at baseline and 12 weeks. Critical new entrant once approved.' },
      ]},
    ]
  },
  {
    id: 'senolytics', label: 'Senolytics',
    protocols: [
      { id: 'foxo4dri', label: 'FOXO4-DRI', category: 'Senolytic', cards: [
        { title: 'Overview', body: 'D-Retro-Inverso senolytic peptide. Disrupts FOXO4–p53 interaction in senescent cells, releasing p53 to trigger mitochondrial apoptosis selectively in "zombie" cells. Most targeted senolytic peptide class available. Originated at Erasmus University Medical Center.' },
        { title: 'Dosing', body: '250–500 mcg SC daily. Titration: 250 mcg weeks 1–4, 375 mcg weeks 5–8, 500 mcg weeks 9–16. Intermittent cycling preferred over continuous. Mouse-translated protocols: 25 mg per dose x3 every other day has been used by self-experimenters.' },
        { title: 'Administration', body: 'Subcutaneous injection. Reconstitute 10 mg vial in 3.0 mL bacteriostatic water = 3.33 mg/mL. Store lyophilized at -20°C. Refrigerate reconstituted. Monitor CBC and inflammatory markers throughout.' },
        { title: 'Stack Notes', body: 'Compatible with Humanin (complementary — Humanin protects healthy cells while FOXO4-DRI clears senescent ones). Pair with Epithalon for telomere + senolytic longevity stack. Sequence senolytic cycles before regenerative peptide protocols for maximum effect.' },
      ]},
      { id: 'dasquercetin', label: 'Dasatinib + Quercetin', category: 'Senolytic', cards: [
        { title: 'Overview', body: 'The most clinically validated senolytic combination. Dasatinib (BCR-ABL inhibitor) + Quercetin (flavonoid) act synergistically via independent SCAP pathways. First human senolytic trial data published in diabetic kidney disease. Mayo Clinic cornerstone protocol.' },
        { title: 'Dosing', body: 'Dasatinib 100 mg + Quercetin 1000 mg orally, taken together. Intermittent: 2 consecutive days per month, or 3 days on / 2 weeks off. Not for continuous daily use — intermittent pulse dosing reduces toxicity and mimics natural senescent cell turnover.' },
        { title: 'Administration', body: 'Oral. Dasatinib is prescription-only. Quercetin available OTC but clinical-grade sourcing critical. Take with food. Monitor CBC for thrombocytopenia risk (dasatinib). Liver panel at baseline and follow-up.' },
        { title: 'Stack Notes', body: 'Foundation of most clinical senolytic programs. Sequence with NAD+ and Epithalon for comprehensive longevity stack. Allow 2–4 weeks post-cycle before starting regenerative peptides to let cleared tissue remodel. Not for use in active malignancy.' },
      ]},
      { id: 'fisetin', label: 'Fisetin', category: 'Senolytic', cards: [
        { title: 'Overview', body: 'Flavonoid senolytic and senomorphic. Found in strawberries and apples at trace levels. Clinical trial (SToMP-AD) showed dose-dependent senescent cell clearance in adipose tissue. Gentlest entry-point into senolytic protocols — favorable safety profile.' },
        { title: 'Dosing', body: '20 mg/kg for 2 consecutive days per month (weight-adjusted). 70 kg adult: ~1400 mg total per pulse. Mayo Clinic protocol: 20 mg/kg/day x2 days. Available OTC. Use liposomal or nanoparticle form for improved bioavailability.' },
        { title: 'Administration', body: 'Oral. High-fat meal improves absorption. Bioavailability of standard capsule form is low — liposomal delivery preferred for clinical effect. Short pulse schedule (2 days) then off for the remainder of month.' },
        { title: 'Stack Notes', body: 'Ideal entry senolytic before advancing to D+Q or FOXO4-DRI. Combine with Quercetin for broader SCAP pathway coverage. Safe to use alongside NAD+ precursors. Neuroprotective secondary effects complement Pinealon and Cortagen protocols.' },
      ]},
    ]
  },
  {
    id: 'performance', label: 'Performance & Anabolic',
    protocols: [
      { id: 'igf1lr3', label: 'IGF-1 LR3', category: 'Anabolic / GH Axis', cards: [
        { title: 'Overview', body: 'Insulin-Like Growth Factor-1 Long R3. 83-amino acid analog of IGF-1 with 13-AA N-terminal extension and Arg substitution at position 3. Reduces IGFBP binding, extending half-life to 20–30 hours vs minutes for native IGF-1. ~3x more potent. Drives hyperplasia AND hypertrophy.' },
        { title: 'Dosing', body: 'Beginner: 20–40 mcg SC daily. Intermediate: 50–80 mcg daily. Advanced: 80–100 mcg daily. 4–6 week cycles with 4-week minimum break for receptor reset. Post-workout timing preferred on training days. Always eat within 30 min — hypoglycemia risk.' },
        { title: 'Administration', body: 'Subcutaneous or intramuscular injection. 1 mg vial + 2 mL BAC water = 500 mcg/mL. Inject training days post-workout; rest days with morning meal. Never inject fasted. Monitor fasting glucose and IGF-1 serum levels throughout. Contraindicated in active malignancy.' },
        { title: 'Stack Notes', body: 'Downstream of the GH axis — pairs with CJC-1295/Ipamorelin for full GH → IGF-1 cascade. Add MGF post-workout for peak satellite cell activation. Keep 2–3 hours apart from exogenous GH injections. WADA-prohibited. Avoid in patients with cancer history.' },
      ]},
      { id: 'hexarelin', label: 'Hexarelin', category: 'GH Secretagogue', cards: [
        { title: 'Overview', body: 'Most potent GHRP available. Synthetic hexapeptide ghrelin analog. Highest GH pulse of any GHRP — also stimulates cortisol and prolactin significantly. Cardioprotective secondary effects via GHS-R independent pathway. Used in post-MI cardiac recovery protocols.' },
        { title: 'Dosing', body: '100–200 mcg SC 1–2x daily, fasted. Stronger GH pulse than GHRP-2 but also stronger cortisol spike. 8–12 week cycles. Cardiac protocols: 1–2 mcg/kg SC. Desensitization occurs faster than Ipamorelin — cycle breaks essential.' },
        { title: 'Administration', body: 'Subcutaneous injection, fasted for maximum GH pulse. Stack with GHRH analog (CJC-1295 or Sermorelin) for synergistic effect. Monitor cortisol and prolactin on extended protocols. Faster receptor downregulation than other GHRPs — consider alternating with Ipamorelin.' },
        { title: 'Stack Notes', body: 'Preferred over GHRP-2 where cardiac benefits are a secondary goal. Pair with Tesamorelin for dual GH axis + cardiac protection. Avoid in anxiety disorders — cortisol response more pronounced than Ipamorelin. Best for time-limited high-intensity GH protocols.' },
      ]},
      { id: 'follistatin344', label: 'Follistatin 344', category: 'Anabolic', cards: [
        { title: 'Overview', body: 'Endogenous myostatin and activin inhibitor. Follistatin-344 isoform binds and neutralizes myostatin (GDF-8), removing the primary brake on skeletal muscle growth. Research phase — not compounding-available in most markets. Among the most potent anabolic signals known.' },
        { title: 'Dosing', body: '100 mcg SC daily for 10-day cycles, 2–4 cycles per year. Some protocols use 50–75 mcg EOD. Extended cycles not recommended due to incomplete safety data. Extremely potent — muscle hyperplasia effects at low doses.' },
        { title: 'Administration', body: 'Subcutaneous injection. Reconstitute carefully — shear-sensitive protein. Use 1% BAC water. Cold storage mandatory. Extremely limited human data — monitor CPK, LFTs, and cardiovascular markers. Research use only in most jurisdictions.' },
        { title: 'Stack Notes', body: 'The strongest myostatin inhibitor available. Stack with IGF-1 LR3 for maximum anabolic axis activation. Use with BPC-157 and TB-500 to support connective tissue against rapid muscle load increase. Only for advanced protocols with medical oversight.' },
      ]},
    ]
  },
  {
    id: 'mitochondrial', label: 'Mitochondrial Peptides',
    protocols: [
      { id: 'ss31', label: 'SS-31', category: 'Mitochondrial', cards: [
        { title: 'Overview', body: 'Elamipretide (Forzinity). FDA approved Sept 2025 for Barth syndrome — first mitochondrial-targeting therapy approved. Binds cardiolipin in inner mitochondrial membrane, stabilizes electron transport chain, reduces ROS.' },
        { title: 'Dosing', body: '5–10 mg SC once daily. Titrate up over 2 weeks. Advanced protocols reach 15–20 mg/day. Reconstitute 30 mg vial in 3 mL bacteriostatic water = 10 mg/mL.' },
        { title: 'Administration', body: 'Subcutaneous injection, morning preferred. 92% SC bioavailability. Rotate injection sites. Avoid nephrotoxic drugs (NSAIDs, aminoglycosides).' },
        { title: 'Stack Notes', body: 'Pairs with MOTS-c and Humanin for full mitochondrial axis. Combine with Epithalon for telomere + mitochondrial longevity stack. Phase 3 data in heart failure ongoing.' },
      ]},
      { id: 'motsc', label: 'MOTS-c', category: 'Mitochondrial', cards: [
        { title: 'Overview', body: 'Mitochondrial-derived peptide. Encoded in mitochondrial 12S rRNA. Regulates metabolic homeostasis, insulin sensitivity, and exercise response.' },
        { title: 'Dosing', body: '5–10 mg 2–3x per week. Exercise timing — 30–60 min pre-workout. Emerging protocols use 5 mg daily for metabolic syndrome.' },
        { title: 'Administration', body: 'Subcutaneous injection. Stability requires cold storage. Reconstitute with bacteriostatic water. Relatively short half-life.' },
        { title: 'Stack Notes', body: 'Stack with Humanin for full mitochondrial axis support. Pairs with NAD+ precursors. Exercise mimetic properties complement GLP-1 protocols.' },
      ]},
      { id: 'humanin', label: 'Humanin', category: 'Mitochondrial', cards: [
        { title: 'Overview', body: 'Mitochondria-derived cytoprotective peptide. 21-amino acid sequence. Protects against neuronal death, metabolic dysfunction, and inflammatory stress.' },
        { title: 'Dosing', body: '2–5 mg 2–3x per week. Analog HNG (Humanin-G) has 1000x potency — dosing reduced to ~1–2 mcg range.' },
        { title: 'Administration', body: 'Subcutaneous injection. HNG analog preferred for potency. Store frozen prior to reconstitution.' },
        { title: 'Stack Notes', body: 'Core mitochondrial stack with MOTS-c. Neuroprotective properties complement Pinealon and Cortagen in longevity protocols.' },
      ]},
    ]
  },
]

export default function ProtocolsPage() {
  const [selected, setSelected] = useState(SECTIONS[0].protocols[0])
  const [collapsed, setCollapsed] = useState({})
  const toggleSection = (id) => setCollapsed(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div style={{ height: '100vh', background: 'var(--canvas-bg, #0d0f14)', display: 'flex', flexDirection: 'column' }}>
      <TopBar view="list" setView={() => {}} onUpload={null} searchQuery="" setSearchQuery={() => {}} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* LEFT SIDEBAR */}
        <div style={{ width: 240, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', padding: '12px 10px', background: 'var(--sidebar-bg)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10, fontFamily: "'DM Sans', sans-serif", padding: '0 2px' }}>
            Protocols
          </div>
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            {SECTIONS.map((section) => (
              <div key={section.id}>
                <div onClick={() => toggleSection(section.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 4px 4px 4px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", userSelect: 'none' }}>
                  <span>{section.label}</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.15)', marginRight: 2 }}>{collapsed[section.id] ? '▶' : '▾'}</span>
                </div>
                {!collapsed[section.id] && section.protocols.map((item) => (
                  <div key={item.id} onClick={() => setSelected(item)} style={{ padding: '5px 10px', borderRadius: 6, marginBottom: 1, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: selected.id === item.id ? 600 : 400, color: selected.id === item.id ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.45)', background: 'transparent', border: 'none', transition: 'all 0.15s ease' }}>
                    {item.label}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{selected.category}</div>
            <h1 style={{ fontSize: 36, fontWeight: 700, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.03em', margin: 0, fontFamily: "'DM Sans', sans-serif", fontStyle: 'normal' }}>{selected.label}</h1>
          </div>
          <CardSwap key={selected.id} width={420} height={280} cardDistance={50} verticalDistance={60} delay={4000} pauseOnHover={true} easing="elastic">
            {selected.cards.map((card, i) => (
              <Card key={i}>
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{card.title}</div>
                  <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>{card.body}</div>
                </div>
              </Card>
            ))}
          </CardSwap>
          <p style={{ marginTop: 32, fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>Hover to pause · Auto-cycles every 4s</p>
        </div>
      </div>
    </div>
  )
}







