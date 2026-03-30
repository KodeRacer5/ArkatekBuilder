# Peptide Journal — Protocol & Dosing Reference
**Version:** 1.0 | **Last Updated:** March 2026  
**Source:** `AnalyticalChain.jsx` PROTOCOLS array · Dose Calculator Pipeline  

---

## How the Dose Calculator Works

| Input | Source |
|---|---|
| Vial size (mg) | Protocol default or user override |
| Reconstitution volume (mL) | Standard BAC water volume |
| Target dose (mcg or mg) | Protocol default |
| Frequency | Protocol default |

**Key formulas:**
- `Concentration = vialMg × 1000 ÷ reconMl` → mcg/mL
- `Syringe units (IU) = doseMcg ÷ (concentration ÷ 100)` → IU on insulin syringe
- `Volume per injection = doseMcg ÷ concentration` → mL
- `Vials per cycle = (doseMcg × totalInjections) ÷ (vialMg × 1000)`

---

## Section 1 — Signaling Peptides

| Compound | Category | Vial | Recon | Std. Dose | Freq | Route | Cycle |
|---|---|---|---|---|---|---|---|
| BPC-157 | Healing | 5mg | 2mL | 250mcg | Daily | SC/oral | 8wk |
| TB-500 | Healing | 5mg | 2mL | 2mg | 2x/wk | SC | 6wk |
| GHK-Cu | Longevity | 50mg | 5mL | 1mg | Daily | SC/topical | 12wk |
| PDA | Healing | 5mg | 2mL | 250mcg | Daily | SC/oral | 8wk |
| MGF | Healing | 2mg | 1mL | 100mcg | 3x/wk | SC/IM | 6wk |
| Semax | Cognitive | 30mg | 3mL | 400mcg | Daily | Intranasal | 4wk |
| Selank | Cognitive | 5mg | 1mL | 250mcg | Daily | Intranasal | 4wk |
| KPV | Anti-inflam. | 10mg | 2mL | 250mcg | Daily | SC/oral | 8wk |
| Melanotan I | Skin/Photo | 10mg | 2mL | 250mcg | 2x/wk | SC | 8wk |
| PT-141 | Sexual Health | 10mg | 2mL | 1.75mg | As needed | SC | — |

---

## Section 2 — GH Secretagogues

| Compound | Category | Vial | Recon | Std. Dose | Freq | Route | Cycle |
|---|---|---|---|---|---|---|---|
| CJC-1295 | GH Secretagogue | 2mg | 1mL | 100mcg | 3x/wk | SC | 12wk |
| Ipamorelin | GH Secretagogue | 2mg | 1mL | 200mcg | Daily | SC | 12wk |
| GHRP-2 | GH Secretagogue | 5mg | 2mL | 100mcg | 3x/day | SC | 8wk |
| Sermorelin | GH Secretagogue | 6mg | 3mL | 200mcg | Daily | SC | 12wk |
| Tesamorelin | GH Secretagogue | 1mg | 0.5mL | 2mg | Daily | SC | 26wk |

---

## Section 3 — GH / IGF Axis

| Compound | Category | Vial | Recon | Std. Dose | Freq | Route | Cycle |
|---|---|---|---|---|---|---|---|
| IGF-1 LR3 | GH/IGF | 1mg | 1mL | 50mcg | 5x/wk | SC/IM | 4wk |
| IGF-1 DES | GH/IGF | 1mg | 1mL | 50mcg | 5x/wk | IM | 4wk |

---

## Section 4 — Longevity & Anti-Aging

| Compound | Category | Vial | Recon | Std. Dose | Freq | Route | Cycle |
|---|---|---|---|---|---|---|---|
| Epithalon | Longevity | 10mg | 2mL | 5mg | Daily | SC | 2wk |
| NAD+ | Longevity | 500mg | 5mL | 500mg | Daily | IV/SC | 4wk |
| GHK-Cu | Longevity | 50mg | 5mL | 1mg | Daily | SC/topical | 12wk |

---

## Section 5 — Nootropics & Cognitive

| Compound | Category | Vial | Recon | Std. Dose | Freq | Route | Cycle |
|---|---|---|---|---|---|---|---|
| Pinealon | Nootropic | 10mg | 2mL | 5mg | Daily | SC/IN | 2wk |
| Dihexa | Nootropic | 10mg | 2mL | 10mg | Daily | Oral/topical | 8wk |
| Cerebrolysin | Nootropic | 215mg | 10mL | 5mg | 5x/wk | IM/IV | 4wk |
| Semax | Cognitive | 30mg | 3mL | 400mcg | Daily | Intranasal | 4wk |
| Selank | Cognitive | 5mg | 1mL | 250mcg | Daily | Intranasal | 4wk |

---

## Section 6 — Mitochondrial

| Compound | Category | Vial | Recon | Std. Dose | Freq | Route | Cycle |
|---|---|---|---|---|---|---|---|
| SS-31 (Elamipretide) | Mitochondrial | 30mg | 3mL | 10mg | Daily | SC | 12wk |
| MOTS-c | Mitochondrial | 10mg | 2mL | 5mg | 3x/wk | SC | 8wk |
| Humanin / HNG | Mitochondrial | 5mg | 2mL | 2mg | 3x/wk | SC | 8wk |

---

## Section 7 — Metabolic / GLP-1

| Compound | Category | Vial | Recon | Std. Dose | Freq | Route | Cycle |
|---|---|---|---|---|---|---|---|
| Semaglutide | GLP-1 | 3mg | 1.5mL | 250mcg | Weekly | SC | 52wk |
| Tirzepatide | GLP-1/GIP | 5mg | 1mL | 2.5mg | Weekly | SC | 52wk |

---

## Section 8 — Immune

| Compound | Category | Vial | Recon | Std. Dose | Freq | Route | Cycle |
|---|---|---|---|---|---|---|---|
| LL-37 | Immune | 50mg | 5mL | 100mcg | 3x/wk | SC | 8wk |
| Thymosin α1 | Immune | 1.6mg | 1mL | 1.6mg | 2x/wk | SC | 6wk |

---

## Section 9 — Senolytic

| Compound | Category | Vial | Recon | Std. Dose | Freq | Route | Cycle |
|---|---|---|---|---|---|---|---|
| FOXO4-DRI | Senolytic | 10mg | 2mL | 1mg | 3x/wk | SC/IV | 4wk |

---

## Section 10 — Testosterone Esters

> **Syringe math note:** Testosterone is dosed in mg not mcg. A 100mg dose from a 200mg/mL vial = 0.5mL = 50 IU on an insulin syringe.

| Compound | Conc. | TRT Dose | Freq | Half-life | Route | Notes |
|---|---|---|---|---|---|---|
| Testosterone Cypionate | 200mg/mL | 100mg | 2x/wk | ~8 days | IM/SC | US standard. SC preferred for stability |
| Testosterone Enanthate | 200mg/mL | 100mg | 2x/wk | 7–9 days | IM/SC | Interchangeable with Cyp. More common outside US |
| Testosterone Propionate | 100mg/mL | 50mg | EOD | 2–3 days | IM | Short ester. Stable levels but frequent injections |
| Sustanon 250 | 250mg/mL | 250mg | EOD | 7–21 days | IM | 4-ester blend. EOD needed due to propionate content |
| Nebido (Undecanoate) | 250mg/mL | 1000mg | Every 10wk | ~90 days | IM (deep) | Loading dose at 6wks. Stable but slow to adjust |
| Testosterone Gel | 50mg/5g | 50mg | Daily | ~1.3hr | Topical | Mimics circadian rhythm. Transfer risk with skin contact |

**TRT target range:** Total testosterone 600–1000 ng/dL · Free testosterone 15–25 pg/mL · Estradiol (E2) 20–40 pg/mL  
**Lab timing:** Mid-point between injections for Cyp/Enan · Trough (pre-injection) for Sustanon/Nebido

---

## Section 11 — Anabolic / Androgenic Compounds

> These are Schedule III controlled substances in the US. This data is for clinical reference only.

| Compound | Form | Std. Dose | Freq | Half-life | Route | Cycle | Use |
|---|---|---|---|---|---|---|---|
| Winstrol / Stanozolol (oral) | 10mg tabs | 40mg/day | Daily | 8hr | Oral | 6–8wk | Cutting · lean retention |
| Winstrol / Stanozolol (inj.) | 50mg/mL | 50mg | EOD | 48hr | IM/SC | 6–8wk | Cutting · more stable levels |
| Deca-Durabolin (Nandrolone Dec.) | 200mg/mL | 200mg | Weekly | 6–12 days | IM | 12–16wk | Bulking · joint support |
| NPP (Nandrolone Phenylprop.) | 100mg/mL | 100mg | EOD | 2–3 days | IM | 10–12wk | Faster-acting Deca alternative |
| Equipoise / Boldenone Undec. | 200mg/mL | 400mg | Weekly | 14 days | IM | 14–16wk | Lean mass · vascularity · appetite |
| Anavar / Oxandrolone | 10mg tabs | 40mg/day | Daily | 9hr | Oral | 6–8wk | Cutting · strength · women-safe |
| Dianabol / Methandrostenolone | 10mg tabs | 30mg/day | Daily | 3–5hr | Oral | 4–6wk | Bulking · rapid mass kickstart |
| Masteron / Drostanolone Prop. | 100mg/mL | 100mg | EOD | 2–3 days | IM | 10–12wk | Cutting · hardness · anti-E2 |
| Primobolan / Methenolone Enan. | 100mg/mL | 400mg | Weekly | 10 days | IM | 12wk | Lean · mild · low suppression |
| Trenbolone Acetate | 100mg/mL | 100mg | EOD | 1–2 days | IM | 8–10wk | Strength · conditioning · harsh |
| Anadrol / Oxymetholone | 50mg tabs | 50mg/day | Daily | 8–9hr | Oral | 4–6wk | Extreme bulk · strength · toxic |

---

## Section 12 — Post Cycle Therapy (PCT)

### Overview

PCT restores the Hypothalamic-Pituitary-Testicular (HPT) axis after suppression from AAS use.  
**PCT start timing** = when last compound clears the body (based on half-life × 5).

| Compound type | Typical timing |
|---|---|
| Short esters (Prop, Tren Ace) | Start PCT 3–4 days after last injection |
| Long esters (Cyp, Enan, Deca) | Start PCT 14–18 days after last injection |
| Oral compounds (Dbol, Anavar) | Start PCT 24–48hr after last dose |
| Sustanon | Start PCT ~21 days after last injection |
| Run HCG first | 500 IU EOD for 2wk → then begin SERM |

---

### PCT · SERMs (Selective Estrogen Receptor Modulators)

SERMs block estrogen at the hypothalamus → remove negative feedback → LH/FSH rise → testes restart testosterone production.

| Compound | Brand | Std. PCT Dose | Protocol | Duration | Notes |
|---|---|---|---|---|---|
| Tamoxifen | Nolvadex | 40→20→10mg/day | Taper weekly | 4–6wk | Strong gyno protection. Standalone for mild cycles |
| Clomiphene | Clomid | 50mg/day | Flat or taper | 4–6wk | Potent LH/FSH stimulator. Side effects: mood, vision |
| Enclomiphene | — | 25mg/day → 12.5mg | Taper final week | 5–6wk | Purified isomer of Clomid. Fewer sides. Preferred modern choice |

**Combination:** Nolvadex 20mg + Enclomiphene 12.5mg daily = optimal dual-SERM recovery for heavy cycles.

---

### PCT · Aromatase Inhibitors (AIs)

AIs inhibit aromatase enzyme — reduce testosterone → estrogen conversion. Used **on-cycle** for estrogen control. Use cautiously post-cycle (need some E2 for HPTA recovery and bone health).

| Compound | Brand | Mechanism | On-cycle Dose | Post-cycle Use | Notes |
|---|---|---|---|---|---|
| Anastrozole | Arimidex | Reversible AI | 0.5mg EOD | Low dose only | Fast-acting. Adjust based on E2 bloods. Risk of estrogen crash |
| Exemestane | Aromasin | Suicidal AI (irreversible) | 12.5mg EOD | Yes — gentler | Better lipid profile than Anastrozole. No E2 rebound on cessation |
| Letrozole | Femara | Reversible AI (potent) | 2.5mg EOD | Avoid in PCT | Most potent. Reserve for gyno emergencies. Easily crashes E2 |

**Rule:** Use AIs on-cycle. Use SERMs post-cycle. Do not use potent AIs (Letrozole) during PCT — estrogen is needed for HPT axis recovery.

---

### PCT · Gonadotropins

| Compound | Std. Dose | Protocol | Timing | Notes |
|---|---|---|---|---|
| HCG (Human Chorionic Gonadotropin) | 500 IU | EOD × 2wk | Between last AAS dose and SERM start | Mimics LH. Directly stimulates Leydig cells. Preserves testicular volume. Do not use alongside SERMs long-term (desensitization risk) |

---

### PCT · Supportive Agents

| Compound | Dose | Freq | Duration | Mechanism | Notes |
|---|---|---|---|---|---|
| DHEA | 50mg/day | Daily | 8wk | Adrenal androgen precursor → testosterone/estrogen | Supports recovery esp. in adrenal-suppressed individuals |
| Ashwagandha (KSM-66) | 300–600mg/day | Daily | 8wk | Cortisol modulation via HPA axis | Reduces post-cycle catabolic cortisol spike. Supports LH |
| Zinc | 30mg/day | Daily | Throughout PCT | Cofactor for testosterone synthesis | Avoid mega-dosing (copper depletion) |
| Vitamin D3 | 5000 IU/day | Daily | Throughout PCT | Androgen receptor sensitivity | Most anabolics users are deficient |

---

### Standard PCT Protocols by Cycle Severity

**Mild cycle** (single oral compound, ≤6wk):
```
Nolvadex: 40/20/20/10 mg/day × 4wk
```

**Moderate cycle** (single injectable, ≤12wk):
```
HCG:          500 IU EOD × 2wk (run before SERMs)
Nolvadex:     40/20/20/10 mg/day × 4wk
  OR
Enclomiphene: 25mg/day × 4–5wk (taper to 12.5mg final week)
```

**Heavy cycle** (multiple compounds, long ester, >12wk):
```
HCG:          500 IU EOD × 2wk
Nolvadex:     40/40/20/20/10/10 mg/day × 6wk
Enclomiphene: 25mg/day × 6wk (run alongside Nolvadex)
Aromasin:     12.5mg EOD × 4wk (on-cycle carryover, taper off)
```

**Dr. Scally Protocol** (severe suppression):
```
HCG:    2500 IU EOD × 16 days
Clomid: 100mg/day × 30 days
Nolvadex: 20mg/day × 45 days
```

---

### PCT Monitoring — Lab Targets

| Marker | Target During PCT | Action if Low | Action if High |
|---|---|---|---|
| Total Testosterone | >400 ng/dL by wk 6 | Extend SERM, add HCG | Good — maintain protocol |
| LH | >3 mIU/mL | Increase SERM dose | Good |
| FSH | >3 mIU/mL | Increase SERM dose | Good |
| Estradiol (E2) | 20–40 pg/mL | Reduce AI if using one | Low-dose Aromasin |
| Hematocrit | <52% | Hydrate, donate blood | Donating blood reduces hematocrit |
| PSA | Baseline + <0.5 ng/mL rise | Monitor | Reduce TRT dose |

---

## Quick Reference — Syringe Conversion

| Concentration | 0.1mL (10 IU) | 0.25mL (25 IU) | 0.5mL (50 IU) | 1mL (100 IU) |
|---|---|---|---|---|
| 100mg/mL | 10mg | 25mg | 50mg | 100mg |
| 200mg/mL | 20mg | 50mg | 100mg | 200mg |
| 250mg/mL | 25mg | 62.5mg | 125mg | 250mg |
| 1000mcg/mL | 100mcg | 250mcg | 500mcg | 1000mcg |
| 2500mcg/mL | 250mcg | 625mcg | 1250mcg | 2500mcg |
| 5000mcg/mL | 500mcg | 1250mcg | 2500mcg | 5000mcg |

> All syringe units reference standard **U-100 insulin syringe** (1mL = 100 IU)

---

*This document is for clinical and educational reference. All protocols should be supervised by a licensed medical professional. Not medical advice.*

---

## Section 13 — Fat Loss / Metabolic Compounds

| Compound | Category | Vial | Recon | Std. Dose | Freq | Route | Cycle | Notes |
|---|---|---|---|---|---|---|---|---|
| 5-Amino-1MQ | NNMT Inhibitor/Metabolic | 50mg | 5mL | 50mg | Daily | Oral/SC | 8wk | Inhibits NNMT enzyme. Raises NAD+. Fat loss + longevity. Stack with NAD+ |
| AOD-9604 | Fat Loss (HGH frag 176-191 modified) | 5mg | 3mL BAC | 300–500mcg | Daily | SC (fasted AM) | 12wk | No IGF-1/glucose effects. 2.6kg avg loss vs placebo in RCT. Cycle off 4wk |
| HGH Fragment 176-191 | Fat Loss | 5mg | 2mL | 500mcg | 2x/day | SC | 12wk | C-terminal HGH fragment. No glucose intolerance. Pure lipolytic |
| BAM15 | Mitochondrial Uncoupler | 5mg | 2mL | 1mg | Daily | Oral | 8wk | Increases energy expenditure without hyperthermia. Early research stage |
| Tesofensin | CNS Appetite Suppressant | 5mg | 10mL | 0.5mg | Daily | Oral | 12wk | Triple monoamine reuptake inhibitor. Significant weight loss in trials |
| SLU-PP-332 | Exercise Mimetic (ERR agonist) | 5mg | 3mL | 1mg | 2x/day | Oral/SC | 8wk | Pan-ERR agonist. Activates aerobic exercise gene program. Endurance + fat oxidation |
| MK-677 (Ibutamoren) | GH Secretagogue (oral) | — | — | 25mg | Daily | Oral | 16wk | Oral ghrelin mimetic. Raises GH and IGF-1 long-term. No injections needed |

---

## Section 14 — Advanced GLP-1 / Weight Loss

| Compound | Mechanism | Vial | Std. Start | Target Dose | Freq | Titration | Cycle |
|---|---|---|---|---|---|---|---|
| Cagrilintide | Amylin analog (once-weekly) | 5mg | 0.6mg | 2.4–4.5mg | Weekly | +0.6mg q4wk | 26wk |
| Retatrutide | GLP-1/GIP/Glucagon tri-agonist | 10mg | 2mg | 8–12mg | Weekly | +1–2mg q4wk | 24–48wk |
| Survodutide | GLP-1/Glucagon dual agonist | 10mg | 0.6mg | 4.8–6mg | Weekly | +0.6–1.2mg q4wk | 26wk |
| GLP-2 | Gut/intestinal trophic factor | 5mg | 400mcg | 400–800mcg | Daily | Flat | 8wk |

**CagriSema combination:** Cagrilintide 2.4mg + Semaglutide 2.4mg weekly = ~20% weight loss at 68wk (REDEFINE trials)

---

## Section 15 — GH Secretagogues (Additional)

| Compound | Category | Vial | Recon | Std. Dose | Freq | Route | Cycle | Notes |
|---|---|---|---|---|---|---|---|---|
| CJC-1295 DAC | Long-acting GHRH analog | 2mg | 1mL | 2mg | 1–2x/wk | SC | 12wk | DAC extends half-life to ~8 days. Less pulsatile than no-DAC |
| CJC-1295 No DAC | Short-acting GHRH | 5mg | 2mL | 100–300mcg | 1–2x/day | SC | 12wk | Stack with Ipamorelin. Fasted. Mimics natural GH pulse |
| Hexarelin | GHRP (most potent) | 2mg | 1mL | 100mcg | 3x/day | SC | 8wk | Strongest GHRP. Raises cortisol/prolactin at high doses |
| GHRP-6 | GHRP + ghrelin mimetic | 5mg | 2mL | 100mcg | 3x/day | SC | 8wk | Strong hunger stimulation. Good for bulking. Fasted injection |
| PEG-MGF | Pegylated MGF (extended) | 2mg | 2mL | 200mcg | 2x/wk | SC | 6wk | Extended half-life vs MGF. Weekly/biweekly dosing. Post-workout |

---

## Section 16 — Reproductive / Hormonal

| Compound | Category | Vial | Recon | Std. Dose | Freq | Route | Cycle | Notes |
|---|---|---|---|---|---|---|---|---|
| Gonadorelin (GnRH) | HPT Axis stimulator | 2mg | 2mL BAC | 100–200mcg | 3x/wk | SC | 12wk | Do NOT dose daily >14 days — receptor desensitization. HCG alternative on TRT. 100mcg = 1 unit at 1mg/mL |
| Kisspeptin-10 | LH/FSH upstream trigger | 10mg | 2mL | 1mg | 2x/wk | SC/IV | 8wk | Activates GnRH neurons. Used in IVF protocols and hypogonadism |
| Oxytocin | Bonding/social/metabolic | 5mg | 5mL | 10mcg | As needed | SC/IN | — | Intranasal preferred for social effects. SC for metabolic/weight effects |

---

## Section 17 — Skin / Aesthetic

| Compound | Category | Dose | Freq | Route | Cycle | Notes |
|---|---|---|---|---|---|---|
| Melanotan II | Melanogenesis / libido | 250mcg (loading start) → 500mcg | Daily loading × 7–14 days, then 1–2x/wk maintenance | SC (evening) | 4–8wk | Titrate: 100mcg → 250mcg → 500mcg. Nausea & flushing early. UV exposure needed for pigment. Stack PT-141 for libido |
| Snap-8 | Anti-wrinkle octapeptide | 4–10% topical | Daily | Topical (cream/serum) | 12wk | Reduces expression lines. Applied to target area AM/PM. No reconstitution needed |

---

## Section 18 — Neuroprotection / Cognitive (Additional)

| Compound | Category | Vial | Recon | Std. Dose | Freq | Route | Cycle | Notes |
|---|---|---|---|---|---|---|---|---|
| ARA-290 | Neuroprotection (EPOR agonist) | 15mg | 1mL | 1.5mg | 5x/wk | SC | 8wk | Erythropoietin receptor agonist. Neuropathy, inflammation, healing |
| PE-22-28 | Antidepressant peptide | 10mg | 2mL | 500mcg | Daily | SC/IN | 8wk | BDNF-like. Rapid antidepressant effects. Intranasal onset within hours |
| P21 (P021) | BDNF mimetic nootropic | 10mg | 2mL | 100mcg | Daily | IN | 4wk | Neurogenesis and cognitive enhancement. Intranasal preferred |
| DSIP | Delta Sleep-Inducing Peptide | 5mg | 2mL | 200mcg | Nightly | SC/IN | 4wk | Promotes deep sleep (delta waves). 30–60min before bed. Circadian reset |
| Methylene Blue | Mitochondrial electron carrier | 500mg | 50mL | 50mg | Daily | Oral/IV | 8wk | 0.5–2mg/kg. G6PD screening mandatory. Cognitive + mitochondrial effects |
| Melatonin | Sleep/circadian hormone | — | — | 0.5–3mg | Nightly | Oral/SC | Ongoing | Low dose (0.5mg) more physiologic than high dose (10mg). 1hr pre-bed |

---

## Section 19 — Immune / Thymic (Additional)

| Compound | Category | Vial | Recon | Std. Dose | Freq | Route | Cycle | Notes |
|---|---|---|---|---|---|---|---|---|
| Thymalin | Thymic peptide complex | 10mg | 1mL | 5–10mg | Daily | SC | 5–10 days/cycle | Every 3–6 months. Thymic restoration. Stack with Epithalon for longevity |
| Alpha Thymosin 11 (AT11) | Immune modulator | 10mg | 2mL | 5mg | 3x/wk | SC | 6wk | Thymic hormone. Advanced immune modulation. Often with Thymalin |
| Thymosin Beta-4 (TB4) | Parent compound of TB-500 | 5mg | 2mL | 2mg | 2x/wk | SC | 6wk | Full TB4 — more systemic than TB-500. Same healing/anti-inflammatory profile |
| TB4 Fragment 1-4 | Short N-terminal TB4 fragment | 5mg | 2mL | 500mcg | Daily | SC | 8wk | Anti-inflammatory fragment. Hair growth, fibrosis reduction |
| TB4 Fragment 17-23 | Mid-region TB4 fragment | 5mg | 2mL | 500mcg | Daily | SC | 8wk | Actin-binding fragment. Tissue remodeling and healing focus |

---

## Section 20 — Longevity (Additional)

| Compound | Category | Vial | Recon | Std. Dose | Freq | Route | Cycle | Notes |
|---|---|---|---|---|---|---|---|---|
| NA-Epithalon Amidate | Modified Epithalon | 50mg | 5mL | 5mg | Daily | SC | 2wk | N-acetylated amide form — more stable, same telomere/pineal effects as Epithalon |
| NA-MOTS-C | Modified MOTS-c | 10mg | 2mL | 5mg | 3x/wk | SC | 8wk | N-acetylated MOTS-c — enhanced stability and bioavailability |
| β-NAD+ | Nicotinamide adenine dinucleotide | 500mg | 5mL | 500mg | Daily | SC/IV | 4wk | Same as NAD+ — beta form. IV: 250–1000mg/session. SC: 50–100mg/day |

---

## Section 21 — Experimental / Research Stage

| Compound | Category | Notes |
|---|---|---|
| ACE-031 | Myostatin inhibitor (ActRIIA-Fc) | Binds myostatin and related ligands. Significant muscle mass gains in trials. Discontinued clinically but researched. 1mg 2x/wk SC |
| PNC-27 | Anti-tumor peptide | Selectively kills cancer cells via membrane disruption. Research compound. 1mg 3x/wk SC/IV |
| Curcumin (injectable) | Anti-inflammatory (curcuminoid) | Bioavailable IV form bypasses poor oral absorption. 100mg 3x/wk IM/IV. Anti-inflammatory, anti-tumor, neuroprotective |

---

## Complete Protocol Count

| Category | Count |
|---|---|
| Signaling Peptides | 10 |
| GH Secretagogues | 7 |
| GH/IGF Axis | 2 |
| Longevity & Anti-aging | 5 |
| Nootropics / Cognitive | 7 |
| Mitochondrial | 5 |
| Metabolic / GLP-1 | 11 |
| Immune | 5 |
| Senolytic | 1 |
| Fat Loss / Metabolic | 7 |
| Advanced GLP-1 | 4 |
| Reproductive / Hormonal | 3 |
| Skin / Aesthetic | 2 |
| Neuroprotection (additional) | 6 |
| Immune / Thymic (additional) | 5 |
| Longevity (additional) | 3 |
| Experimental | 3 |
| Testosterone Esters | 6 |
| Anabolic / Androgenic | 11 |
| PCT — SERMs | 3 |
| PCT — AIs | 3 |
| PCT — Gonadotropins/Support | 5 |
| **TOTAL** | **~113** |


---

## Verification Notes — Corrections Applied March 2026

| Compound | Previous Entry | Verified Correction | Source |
|---|---|---|---|
| AOD-9604 | reconMl: 2mL | Corrected to 3mL BAC (1.67mg/mL clinical standard) | peptidedosages.com, Swolverine 2025 |
| Gonadorelin | 5mg vial, 2x/day | Corrected to 2mg vial, 3x/week. Daily dosing >14 days causes desensitization | peptides.org, peptideinitiative.com, peptidedosages.com |
| Melanotan II | 500mcg start | Corrected to 250mcg loading start, titrate up. 100→250→500mcg titration | luminpeptides.com PDF 2025 |
| HGH Frag 176-191 | Listed as separate from AOD-9604 | Noted: HGH Frag 176-191 has NOT been studied in humans. AOD-9604 is the modified human-studied version | Wikipedia, peptidedosingprotocols.com |
| Retatrutide | 4mg target | Confirmed 4–8mg typical, up to 12mg max in Phase 2 NEJM 2023 trial | NEJM 2023, peptidedosages.com |
| Cagrilintide | 2.4mg dose | Confirmed 0.6→4.5mg titration. Phase 3 REDEFINE 1 confirmed ~20% weight loss with CagriSema | Lancet 2021, NEJM 2025 |
| Semaglutide titration | Flat 0.25mg | Corrected: 0.25→0.5→1.0→1.7→2.0mg titration per clinical protocol | luminpeptides.com PDF 2025 |
| Tirzepatide titration | Flat 2.5mg | Corrected: 2.5→5→7.5→10→12.5→15mg titration | luminpeptides.com PDF 2025 |
| SLU-PP-332 | 1mg 2x/day | Confirmed. Preclinical only — no human trials as of Nov 2025. Oral preferred | peptidedosages.com Nov 2025 |
| Gonadorelin max dose | — | CRITICAL: 400mcg/daily causes LH decline, not rise. Keep ≤200mcg, max 3 consecutive days then break | peptides.org clinical data |

---

## Critical Safety Flags

| Flag | Compound | Detail |
|---|---|---|
| Desensitization risk | Gonadorelin | Do NOT dose daily >14 days. Limit to 3x/week with breaks. 400mcg/day paradoxically suppresses LH |
| No human data | HGH Frag 176-191 | Only AOD-9604 has been studied in humans. HGH Frag 176-191 is animal-only data |
| Receptor downregulation | CJC-1295 DAC | Long half-life (~8 days) — pulse cycle 4–6wk on / 2–4wk off to prevent GH receptor downregulation |
| G6PD screening required | Methylene Blue | Mandatory G6PD deficiency test before use. Contraindicated with serotonergic drugs (serotonin syndrome) |
| Estrogen crash risk | Letrozole | Most potent AI. Reserve for gyno emergency only. Easily crashes E2 — do NOT use during PCT |
| Hepatotoxic | Winstrol oral, Dianabol, Anadrol | All 17α-alkylated — liver toxic. Limit cycles, monitor LFTs, avoid alcohol |
| Prolactin elevation | Deca, NPP, Trenbolone | Progestogenic compounds — can elevate prolactin. Use cabergoline if prolactin sides occur |
| Titrate slowly | Retatrutide, Cagrilintide, Survodutide | Aggressive titration = severe GI effects. Slow escalation is non-negotiable |
| PCT timing critical | All AAS | Start PCT only after compound clears. Too early = ineffective. Too late = catabolic crash |


---

## Preclinical / Unverified Status Reference

Compounds marked PRECLINICAL in the dose calculator have no confirmed human clinical trial data or are not currently used in any clinical setting. Dosing figures are extrapolated from animal models or early phase research. Included for research pipeline demonstration only.

| Compound | Status | Basis |
|---|---|---|
| HGH Frag 176-191 | PRECLINICAL | Animal models only. No human trials. AOD-9604 is the human-studied version |
| BAM15 | PRECLINICAL | Murine mitochondrial uncoupler only. No human data as of 2026 |
| SLU-PP-332 | PRECLINICAL | Mouse studies only (50mg/kg IP). No human trials as of Nov 2025 |
| Retatrutide | PRECLINICAL | Phase 2 complete (NEJM 2023). Phase 3 ongoing. Not yet approved |
| Survodutide | PRECLINICAL | Phase 2 data only. Not approved |
| Kisspeptin-10 | PRECLINICAL | Phase 2 IVF trials only. Not in general clinical use |
| Snap-8 | PRECLINICAL | In vitro and cosmetic studies only. No clinical trial data |
| ARA-290 | PRECLINICAL | Phase 2 neuropathy trials. Not approved for general use |
| PE-22-28 | PRECLINICAL | Animal antidepressant data only. No human trials |
| P21 (P021) | PRECLINICAL | Rodent neurogenesis data only. No human trials |
| Alpha Thymosin 11 (AT11) | PRECLINICAL | Limited research. No established clinical protocol |
| TB4 Frag 1-4 | PRECLINICAL | Animal healing data. No human trials |
| TB4 Frag 17-23 | PRECLINICAL | Animal data only. No human trials |
| NA-MOTS-C | PRECLINICAL | Modified analog — limited data beyond base MOTS-c studies |
| ACE-031 | PRECLINICAL | Discontinued after Phase 2 (bleeding events). Retained for pipeline reference |
| PNC-27 | PRECLINICAL | Animal anti-tumor data only. No approved human use |
| FOXO4-DRI | PRECLINICAL | Murine senolytic data. No human clinical trials completed |
| Dihexa | PRECLINICAL | Rodent cognitive data only. No human trials |
| Pinealon | PRECLINICAL | Russian bioregulator research. Limited Western clinical validation |
| Humanin | PRECLINICAL | Preclinical mitochondrial/neuroprotection data. No approved clinical use |

All other compounds in the database have at least Phase 2 human data, established off-label clinical use, or FDA approval for related indications.

