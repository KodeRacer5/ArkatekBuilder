import React from "react";

type SymptomResponse = { item_id: string; value: number };
type Props = { value: SymptomResponse[]; onChange: (v: SymptomResponse[]) => void };

const GROUPS: { group: string; items: { id: string; label: string }[] }[] = [
  {
    group: "Energy",
    items: [
      { id: "sym_energy_fatigue_morning",  label: "I wake up tired or unrefreshed" },
      { id: "sym_energy_midday_crash",     label: "I get a mid-afternoon energy crash" },
      { id: "sym_energy_weight_gain",      label: "I have unexplained weight gain" },
      { id: "sym_energy_sugar_cravings",   label: "I crave sugar or carbs" },
      { id: "sym_energy_cold_intolerance", label: "I feel cold when others don't" },
      { id: "sym_energy_sleep_poor",       label: "My sleep quality is poor" },
    ],
  },
  {
    group: "Resiliency",
    items: [
      { id: "sym_resiliency_bloating",         label: "I feel bloated or gassy after meals" },
      { id: "sym_resiliency_heartburn",        label: "I get heartburn or reflux" },
      { id: "sym_resiliency_alter_bowel",      label: "My bowel habits are irregular" },
      { id: "sym_resiliency_frequent_illness", label: "I get sick more than I should" },
      { id: "sym_resiliency_brain_fog",        label: "I have brain fog or poor concentration" },
      { id: "sym_resiliency_anxiety",          label: "I feel anxious or have mood swings" },
    ],
  },
  {
    group: "Endurance",
    items: [
      { id: "sym_endurance_exertion_dyspnea",        label: "I get short of breath with modest exertion" },
      { id: "sym_endurance_chest_tightness",          label: "I feel chest tightness or pressure" },
      { id: "sym_endurance_poor_exercise_tolerance",  label: "My exercise tolerance is poor" },
      { id: "sym_endurance_palpitations",             label: "I notice heart palpitations" },
    ],
  },
  {
    group: "Detoxification",
    items: [
      { id: "sym_detox_chemical_sensitivity", label: "I am sensitive to chemicals or smells" },
      { id: "sym_detox_fluid_retention",      label: "I retain fluid (puffy face, ankles)" },
      { id: "sym_detox_headache",             label: "I get frequent headaches" },
      { id: "sym_detox_skin_rash",            label: "I have skin rashes or reactions" },
    ],
  },
  {
    group: "Potency",
    items: [
      { id: "sym_potency_low_libido",        label: "My sexual desire is lower than I'd like" },
      { id: "sym_potency_erection_or_cycle", label: "I have erection or menstrual cycle issues" },
      { id: "sym_potency_mood_irritability", label: "I feel irritable or emotionally flat" },
      { id: "sym_potency_hot_flashes",       label: "I experience hot flashes or night sweats" },
      { id: "sym_potency_muscle_loss",       label: "I notice muscle loss or weakness" },
    ],
  },
];

const SymptomsSection: React.FC<Props> = ({ value, onChange }) => {
  const getValue = (id: string) => value.find((v) => v.item_id === id)?.value ?? 0;

  const setValue = (id: string, v: number) => {
    const idx = value.findIndex((x) => x.item_id === id);
    const next = [...value];
    if (idx === -1) next.push({ item_id: id, value: v });
    else next[idx] = { item_id: id, value: v };
    onChange(next);
  };

  return (
    <section>
      <h2>Symptoms</h2>
      <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "1rem" }}>
        0 = Never &nbsp;·&nbsp; 1 = Rarely &nbsp;·&nbsp; 2 = Sometimes &nbsp;·&nbsp; 3 = Often &nbsp;·&nbsp; 4 = Always
      </p>
      {GROUPS.map(({ group, items }) => (
        <div key={group} style={{ marginBottom: "1.25rem" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {group}
          </h3>
          {items.map((item) => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem", gap: "1rem" }}>
              <label style={{ fontSize: "0.85rem", flex: 1 }}>{item.label}</label>
              <input
                type="number"
                min={0}
                max={4}
                value={getValue(item.id)}
                onChange={(e) => setValue(item.id, Math.min(4, Math.max(0, Number(e.target.value) || 0)))}
                style={{ width: 52, textAlign: "center", padding: "2px 4px", fontSize: "0.85rem" }}
              />
            </div>
          ))}
        </div>
      ))}
    </section>
  );
};

export default SymptomsSection;



