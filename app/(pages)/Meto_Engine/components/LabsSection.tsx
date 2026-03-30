import React from "react";

type Props = {
  value: any;
  onChange: (v: any) => void;
};

const LabsSection: React.FC<Props> = ({ value, onChange }) => {
  const handleChange = (field: string, v: any) => {
    onChange({ ...value, [field]: v });
  };

  return (
    <section>
      <h2>Labs (optional)</h2>
      <label>
        Fasting glucose (mg/dL):
        <input
          type="number"
          value={value.fasting_glucose_mg_dl ?? ""}
          onChange={(e) =>
            handleChange("fasting_glucose_mg_dl", Number(e.target.value))
          }
        />
      </label>
      <label>
        HbA1c (%):
        <input
          type="number"
          step="0.1"
          value={value.hba1c_pct ?? ""}
          onChange={(e) =>
            handleChange("hba1c_pct", Number(e.target.value))
          }
        />
      </label>
      <label>
        Triglycerides (mg/dL):
        <input
          type="number"
          value={value.triglycerides_mg_dl ?? ""}
          onChange={(e) =>
            handleChange("triglycerides_mg_dl", Number(e.target.value))
          }
        />
      </label>
      <label>
        HDL (mg/dL):
        <input
          type="number"
          value={value.hdl_mg_dl ?? ""}
          onChange={(e) =>
            handleChange("hdl_mg_dl", Number(e.target.value))
          }
        />
      </label>
    </section>
  );
};

export default LabsSection;



