import { useState } from "react";
import useCrud from "../hooks/useCrud";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { Plus, ReceiptText, Save } from "lucide-react";

const defaultForm = {
  dealId: "",
  amount: "",
  createdAt: "",
};

const Installments = () => {
  const { data, createItem, updateItem, deleteItem } = useCrud("/installments");
  const { data: deals } = useCrud("/deals");

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setIsOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      dealId: row.dealId ? String(row.dealId) : "",
      amount: row.amount ?? "",
      createdAt: row.createdAt ? row.createdAt.slice(0, 16) : "",
    });
    setIsOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      dealId: Number(form.dealId),
      amount: Number(form.amount),
      ...(form.createdAt ? { createdAt: form.createdAt } : {}),
    };

    if (editing?.id) {
      await updateItem(editing.id, payload);
    } else {
      await createItem(payload);
    }

    setIsOpen(false);
  };

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900">
            <ReceiptText className="h-6 w-6 text-teal-600" />
            Installments
          </h2>
          <p className="mt-1 text-sm text-slate-500">Track installment transactions against each deal.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" />
          Add Installment
        </button>
      </section>

      <Table
        columns={[
          { key: "id", label: "ID" },
          { key: "deal", label: "Deal", render: (row) => `#${row.dealId}` },
          { key: "client", label: "Client", render: (row) => row.deal?.client?.name ?? "-" },
          { key: "board", label: "Board", render: (row) => row.deal?.board?.location ?? "-" },
          { key: "amount", label: "Amount", render: (row) => `Rs ${Number(row.amount ?? 0).toLocaleString()}` },
          { key: "createdAt", label: "Created At" },
        ]}
        data={data}
        onEdit={openEdit}
        onDelete={deleteItem}
      />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h3 className="mb-5 text-xl font-semibold text-slate-900">
          {editing ? "Edit Installment" : "Create Installment"}
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Deal</span>
            <select
              name="dealId"
              value={form.dealId}
              onChange={handleChange}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
            >
              <option value="">Select Deal</option>
              {deals.map((deal) => (
                <option key={deal.id} value={deal.id}>
                  Deal #{deal.id} - {deal.client?.name ?? "Client"} - Remaining Rs{" "}
                  {Number(deal.remainingAmount ?? 0).toLocaleString()}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Amount</span>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Created At (Optional)</span>
            <input
              type="datetime-local"
              name="createdAt"
              value={form.createdAt}
              onChange={handleChange}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
        >
          <Save className="h-4 w-4" />
          Save Installment
        </button>
      </Modal>
    </div>
  );
};

export default Installments;
