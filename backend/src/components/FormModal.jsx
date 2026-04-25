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

const FormModal = ({
  isOpen,
  onClose,
  onSubmit,
  fields,
  initialData,
  title = "Manage Record",
}) => {
  const [form, setForm] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  //  reset form properly when switching edit/create
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({});
    }
  }, [initialData, isOpen]);

  // FIXED CHANGE HANDLER (supports file + text)
 const handleChange = (event, fieldType) => {
  const { name, value, files, type, checked } = event.target;

  setForm((prev) => ({
    ...prev,
    [name]:
      fieldType === "file"
        ? files?.[0]
        : type === "checkbox"
        ? checked
        : value,
  }));
};

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (error) {
      console.error("Form submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      actionButton={
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60 transition"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      }
    >
      <div>
        <h2 className="mb-5 text-xl font-semibold text-slate-900">
          {title}
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
          {fields.map((fieldConfig) => {
            const field = normalizeField(fieldConfig);

            //  SELECT FIELD
            if (field.type === "select") {
              return (
                <label key={field.name} className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    {field.label}
                  </span>

                  <select
                    name={field.name}
                    value={form[field.name] || ""}
                    onChange={handleChange}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              );
            }
            if (field.type === "checkbox") {
  return (
    <label key={field.name} className="flex items-center gap-2">
      <input
        type="checkbox"
        name={field.name}
        checked={form[field.name] || false}
        onChange={(e) => handleChange(e, "checkbox")}
        className="h-4 w-4 accent-teal-600"
      />

      <span className="text-sm font-medium text-slate-700">
        {field.label}
      </span>
    </label>
  );
}
            //  FILE FIELD (IMPORTANT FIX)
            if (field.type === "file") {
              return (
                <label key={field.name} className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    {field.label}
                  </span>

                  <input
                    type="file"
                    name={field.name}
                    accept="image/*"
                    onChange={(e) =>
                      handleChange(e, "file")
                    }
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />

                  {/* preview if editing */}
                  {form[field.name] &&
                    typeof form[field.name] !== "string" && (
                      <img
                        src={URL.createObjectURL(form[field.name])}
                        alt="preview"
                        className="h-20 w-32 object-cover rounded mt-2"
                      />
                    )}
                </label>
              );
            }

            //  NORMAL INPUT
            return (
              <label key={field.name} className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-700">
                  {field.label}
                </span>

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
      </div>
    </Modal>
  );
};

export default FormModal;