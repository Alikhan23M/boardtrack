import { useState } from "react";
import useCrud from "../hooks/useCrud";
import Table from "../components/Table";
import FormModal from "../components/FormModal";
import { Plus, Users } from "lucide-react";

const clientFields = [
  { name: "name", label: "Client Name", placeholder: "Acme Corp" },
  { name: "address", label: "Address", placeholder: "123 Main St" },
  { name: "contact", label: "Contact", placeholder: "+1-555-0100" },
];

const Clients = () => {
  const { data, createItem, updateItem, deleteItem } = useCrud("/clients");
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleSave = (form) => {
    if (editing) {
      updateItem(editing.id, form);
      // reset form data to make form empty
      setEditing(null);
    } else {
      createItem(form);
      // reset form data to make form empty
      setEditing(null);
    }
  };

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900">
            <Users className="h-6 w-6 text-teal-600" />
            Clients
          </h2>
          <p className="mt-1 text-sm text-slate-500">Manage advertisers and customer records.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setIsOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" />
          Add Client
        </button>
      </section>

      <Table
        columns={[
          { key: "name", label: "Name" },
          { key: "address", label: "Address" },
          { key: "contact", label: "Contact" },
        ]}
        data={data}
        onEdit={(row) => {
          setEditing(row);
          setIsOpen(true);
        }}
        onDelete={deleteItem}
      />

      <FormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSave}
        fields={clientFields}
        initialData={editing}
        title={editing ? "Edit Client" : "Add Client"}
      />
    </div>
  );
};

export default Clients;
