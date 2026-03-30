import React from "react";

type Props = {
  value: any;
  onChange: (v: any) => void;
};

const LifestyleSection: React.FC<Props> = ({ value, onChange }) => {
  const handleChange = (field: string, v: any) => {
    onChange({ ...value, [field]: v });
  };

  return (
    <section>
      <h2>Lifestyle</h2>
      <label>
        Smoking status:
        <select
          value={value.smoking_status ?? ""}
          onChange={(e) => handleChange("smoking_status", e.target.value)}
        >
          <option value="">Select</option>
          <option value="never">Never</option>
          <option value="former">Former</option>
          <option value="current">Current</option>
        </select>
      </label>
      <label>
        Alcohol units / week:
        <input
          type="number"
          value={value.alcohol_units_per_week ?? ""}
          onChange={(e) =>
            handleChange("alcohol_units_per_week", Number(e.target.value))
          }
        />
      </label>
      <label>
        Diagnosed diabetes:
        <input
          type="checkbox"
          checked={value.known_diabetes ?? false}
          onChange={(e) => handleChange("known_diabetes", e.target.checked)}
        />
      </label>
      <label>
        Diagnosed high BP:
        <input
          type="checkbox"
          checked={value.known_hypertension ?? false}
          onChange={(e) =>
            handleChange("known_hypertension", e.target.checked)
          }
        />
      </label>
      <label>
        Diagnosed high cholesterol:
        <input
          type="checkbox"
          checked={value.known_hyperlipidemia ?? false}
          onChange={(e) =>
            handleChange("known_hyperlipidemia", e.target.checked)
          }
        />
      </label>
      <label>
        Exercise minutes / week:
        <input
          type="number"
          value={value.exercise_minutes_per_week ?? ""}
          onChange={(e) =>
            handleChange("exercise_minutes_per_week", Number(e.target.value))
          }
        />
      </label>
    </section>
  );
};

export default LifestyleSection;



