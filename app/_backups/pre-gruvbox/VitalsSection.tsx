import React from "react";

type Props = {
  value: any;
  onChange: (v: any) => void;
};

const VitalsSection: React.FC<Props> = ({ value, onChange }) => {
  const handleChange = (field: string, v: any) => {
    onChange({ ...value, [field]: v });
  };

  return (
    <section>
      <h2>Vitals</h2>
      <label>
        Systolic BP:
        <input
          type="number"
          value={value.systolic_bp_mm_hg ?? ""}
          onChange={(e) =>
            handleChange("systolic_bp_mm_hg", Number(e.target.value))
          }
        />
      </label>
      <label>
        Diastolic BP:
        <input
          type="number"
          value={value.diastolic_bp_mm_hg ?? ""}
          onChange={(e) =>
            handleChange("diastolic_bp_mm_hg", Number(e.target.value))
          }
        />
      </label>
      <label>
        Resting HR (bpm):
        <input
          type="number"
          value={value.resting_hr_bpm ?? ""}
          onChange={(e) =>
            handleChange("resting_hr_bpm", Number(e.target.value))
          }
        />
      </label>
      <label>
        SpO₂ (%):
        <input
          type="number"
          value={value.spo2_pct ?? ""}
          onChange={(e) => handleChange("spo2_pct", Number(e.target.value))}
        />
      </label>
      <label>
        Urine pH:
        <input
          type="number"
          step="0.1"
          value={value.urine_ph ?? ""}
          onChange={(e) => handleChange("urine_ph", Number(e.target.value))}
        />
      </label>
    </section>
  );
};

export default VitalsSection;
