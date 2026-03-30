# C:\...\python-engine\scoring.py
from __future__ import annotations
from typing import Dict, Any, List, Optional
import math
import statistics

def bmi_from_subject(subject: Dict[str, Any]) -> Optional[float]:
    try:
        h_m = subject["height_cm"] / 100.0
        return subject["weight_kg"] / (h_m ** 2)
    except Exception:
        return None

def waist_to_height_ratio(subject: Dict[str, Any]) -> Optional[float]:
    try:
        return subject["waist_cm"] / subject["height_cm"]
    except Exception:
        return None

def normalize_symptom_score(symptom_responses: List[Dict[str, Any]], item_ids: List[str]) -> Optional[float]:
    values = [r["value"] for r in symptom_responses if r["item_id"] in item_ids]
    if not values:
        return None
    raw_sum = sum(values)
    max_sum = 4 * len(item_ids)
    return 100.0 * raw_sum / max_sum

def value_penalty(value: float, cfg: Dict[str, Any]) -> float:
    low = cfg["optimal_low"]
    high = cfg["optimal_high"]
    direction = cfg["direction"]

    if value is None or math.isnan(value):
        return 0.0

    if direction == "high_bad":
        if value <= high:
            return 0.0
        return min(100.0, 100.0 * (value - high) / high)

    if direction == "low_bad":
        if value >= low:
            return 0.0
        return min(100.0, 100.0 * (low - value) / low)

    # both_bad
    if low <= value <= high:
        return 0.0
    if value < low:
        return min(100.0, 100.0 * (low - value) / low)
    return min(100.0, 100.0 * (value - high) / high)

def aggregate_penalties(values: Dict[str, float], ranges: Dict[str, Any]) -> Optional[float]:
    penalties = []
    for name, v in values.items():
        if v is None:
            continue
        cfg = ranges.get(name)
        if not cfg:
            continue
        penalties.append(value_penalty(v, cfg))
    if not penalties:
        return None
    return statistics.mean(penalties)

def risk_level(score: float, low_max: float, moderate_max: float) -> str:
    if score < low_max:
        return "low"
    if score < moderate_max:
        return "moderate"
    return "high"

def score_assessment(engine_config: Dict[str, Any], assessment: Dict[str, Any]) -> Dict[str, Any]:
    triad_cfgs = engine_config["triads"]
    vitals_ranges = engine_config["vitals_ranges"]
    lab_ranges = engine_config["lab_ranges"]
    low_max = engine_config["risk_bands"]["low_max"]
    moderate_max = engine_config["risk_bands"]["moderate_max"]

    subject = assessment.get("subject", {})
    biometrics = assessment.get("biometrics", {})
    labs = assessment.get("labs", {}) or {}
    symptom_responses = assessment.get("symptom_responses", [])

    derived_vitals: Dict[str, float] = {}
    bmi_val = bmi_from_subject(subject)
    if bmi_val is not None:
        derived_vitals["bmi"] = bmi_val
    wthr_val = waist_to_height_ratio(subject)
    if wthr_val is not None:
        derived_vitals["waist_to_height_ratio"] = wthr_val
    for k, v in biometrics.items():
        derived_vitals[k] = v

    lab_present = any(isinstance(v, (int, float)) for v in labs.values())
    mode = "lab" if lab_present else "non_lab"

    triads_out = []
    composite_scores = []

    for triad in triad_cfgs:
        t_id = triad["id"]
        weights = triad["weights"]["lab_mode"] if mode == "lab" else triad["weights"]["non_lab_mode"]

        sym_score = normalize_symptom_score(symptom_responses, triad["symptom_items"])

        triad_vitals_vals: Dict[str, float] = {}
        for f in triad.get("vitals_fields", []):
            if f in derived_vitals:
                triad_vitals_vals[f] = derived_vitals[f]
        vitals_pen = aggregate_penalties(triad_vitals_vals, vitals_ranges)

        triad_lab_vals: Dict[str, float] = {}
        if mode == "lab":
            for f in triad.get("lab_fields", []):
                if f in labs:
                    triad_lab_vals[f] = labs[f]
        lab_pen = aggregate_penalties(triad_lab_vals, lab_ranges) if triad_lab_vals else None

        parts = []
        wts = []

        if sym_score is not None:
            parts.append(sym_score)
            wts.append(weights["symptoms"])
        if vitals_pen is not None:
            parts.append(vitals_pen)
            wts.append(weights["vitals"])
        if mode == "lab" and lab_pen is not None:
            parts.append(lab_pen)
            wts.append(weights["labs"])

        composite = None
        if parts:
            composite = sum(p * w for p, w in zip(parts, wts)) / sum(wts)
            composite_scores.append(composite)

        rl = risk_level(composite, low_max, moderate_max) if composite is not None else "unknown"

        triads_out.append({
            "id": t_id,
            "label": triad["label"],
            "scores": {
                "symptom_score": sym_score,
                "vitals_score": vitals_pen,
                "lab_score": lab_pen if mode == "lab" else None,
                "composite_score": composite,
                "risk_level": rl
            },
            "flags": []
        })

    overall_index = statistics.mean(composite_scores) if composite_scores else None

    return {
        "engine_version": engine_config["engine_version"],
        "assessment_id": assessment.get("assessment_id"),
        "mode": mode,
        "triads": triads_out,
        "overall": {
            "overall_risk_index": overall_index,
            "mode": mode,
            "global_flags": []
        }
    }
