import React from "react";

type Props = {
  value: any;
  onChange: (v: any) => void;
};

const ProfileSection: React.FC<Props> = ({ value, onChange }) => {
  const handleChange = (field: string, v: any) => {
    onChange({ ...value, [field]: v });
  };

  return (
    <section>
      <h2>Profile</h2>
      <label>
        Age:
        <input
          type="number"
          value={value.age ?? ""}
          onChange={(e) => handleChange("age", Number(e.target.value))}
        />
      </label>
      <label>
        Sex:
        <select
          value={value.sex ?? ""}
          onChange={(e) => handleChange("sex", e.target.value)}
        >
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </label>
      <label>
        Height (cm):
        <input
          type="number"
          value={value.height_cm ?? ""}
          onChange={(e) => handleChange("height_cm", Number(e.target.value))}
        />
      </label>
      <label>
        Weight (kg):
        <input
          type="number"
          value={value.weight_kg ?? ""}
          onChange={(e) => handleChange("weight_kg", Number(e.target.value))}
        />
      </label>
      <label>
        Waist (cm):
        <input
          type="number"
          value={value.waist_cm ?? ""}
          onChange={(e) => handleChange("waist_cm", Number(e.target.value))}
        />
      </label>
      <label>
        Hip (cm):
        <input
          type="number"
          value={value.hip_cm ?? ""}
          onChange={(e) => handleChange("hip_cm", Number(e.target.value))}
        />
      </label>
    </section>
  );
};

export default ProfileSection;
