import { useState } from "react";
import useCrud from "../../hooks/useCrud";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import { Plus, Printer, Save } from "lucide-react";
import { toast } from "sonner";
import Loading from "../../components/Loading";

const defaultForm = {
  clientId: "",
  printingType: "",
  details: "",
  price: "",
  status: "pending",
};

const Printings = () => {
  const { data, loading, createItem, updateItem, deleteItem } = useCrud("/printing-services");
  const { data: clients } = useCrud("/clients");

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [isSaving, setIsSaving] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setIsOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      clientId: row.clientId ? String(row.clientId) : "",
      printingType: row.printingType ?? "",
      details: row.details ?? "",
      price: row.price ?? "",
      status: row.status ?? "pending",
    });
    setIsOpen(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    const payload = {
      clientId: Number(form.clientId),
      printingType: form.printingType,
      details: form.details || null,
      price: Number(form.price),
      status: form.status,
    };

    try {
      if (editing?.id) {
        await updateItem(editing.id, payload);
        toast.success("Printing job updated successfully.");
      } else {
        await createItem(payload);
        toast.success("Printing job created successfully.");
      }
      setIsOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save printing job.");
    } finally {
      setIsSaving(false);
    }
  };

  if(loading) return <Loading message="Loading printing jobs..." />

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900">
            <Printer className="h-6 w-6 text-teal-600" />
            Printing Services
          </h2>
          <p className="mt-1 text-sm text-slate-500">Manage print jobs linked to clients and fulfillment status.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" />
          Add Printing Job
        </button>
      </section>

      <Table
        columns={[
          { key: "id", label: "ID" },
          { key: "client", label: "Client", render: (row) => row.client?.name ?? row.clientId },
          { key: "printingType", label: "Printing Type" },
          { key: "details", label: "Details" },
          { key: "price", label: "Price", render: (row) => `Rs ${Number(row.price ?? 0).toLocaleString()}` },
          {
            key: "status",
            label: "Status",
            render: (row) => (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-700">
                {row.status ?? "-"}
              </span>
            ),
          },
        ]}
        data={data}
        onEdit={openEdit}
        onDelete={deleteItem}
      />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h3 className="mb-5 text-xl font-semibold text-slate-900">
          {editing ? "Edit Printing Job" : "Create Printing Job"}
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Client</span>
            <select
              name="clientId"
              value={form.clientId}
              onChange={handleChange}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Printing Type</span>
            <input
              type="text"
              name="printingType"
              value={form.printingType}
              onChange={handleChange}
              placeholder="Vinyl / Flex / Banner"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Price</span>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
            />
          </label>

          <label className="flex flex-col gap-2 sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Details</span>
            <textarea
              name="details"
              value={form.details}
              onChange={handleChange}
              rows={3}
              className="resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
              placeholder="Optional production details"
            />
          </label>

          <label className="flex flex-col gap-2 sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Status</span>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Printing Job"}
        </button>
      </Modal>
    </div>
  );
};

export default Printings;
