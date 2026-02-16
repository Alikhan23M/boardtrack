import { useState, useEffect } from "react";
import Modal from "./Modal";
import { Save } from "lucide-react";

const normalizeField = (field) => {
  if (typeof field === "string") {
    return { name: field, label: field, type: "text" };
  }

  return {
    name: field.name,
    label: field.label ?? field.name,
    type: field.type ?? "text",
    options: field.options ?? [],
    placeholder: field.placeholder ?? field.label ?? field.name,
  };
};

const FormModal = ({ isOpen, onClose, onSubmit, fields, initialData, title = "Manage Record" }) => {
  const [form, setForm] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setForm(initialData || {});
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (error) {
      // Keep modal open when submit fails.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <h2 className="mb-5 text-xl font-semibold text-slate-900">{title}</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map((fieldConfig) => {
            const field = normalizeField(fieldConfig);

            if (field.type === "select") {
              return (
                <label key={field.name} className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">{field.label}</span>
                  <select
                    name={field.name}
                    value={form[field.name] || ""}
                    onChange={handleChange}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              );
            }

            return (
              <label key={field.name} className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-700">{field.label}</span>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
                />
              </label>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </Modal>
  );
};

export default FormModal;
