import { useEffect, useMemo, useState } from "react";
import useCrud from "../hooks/useCrud";
import Modal from "../components/Modal";
import { toast } from "sonner";
import { BadgeDollarSign, CalendarDays, MapPin, Pencil, Plus, ReceiptText, Save, Trash2, User } from "lucide-react";

const defaultDealForm = {
  clientId: "",
  boardId: "",
  startDate: "",
  endDate: "",
  amount: 0,
  paidAmount: 0,
};

const Deals = () => {
  const { data: deals, createItem: createDeal, updateItem: updateDeal, deleteItem: deleteDeal, fetchData: fetchDeals } =
    useCrud("/deals");
  const { data: boards } = useCrud("/boards");
  const { data: clients } = useCrud("/clients");
  const { createItem: createInstallment } = useCrud("/installments");

  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [dealForm, setDealForm] = useState(defaultDealForm);

  const [selectedClientId, setSelectedClientId] = useState("");
  const [remainingOnly, setRemainingOnly] = useState(false);

  const [isInstallmentModalOpen, setIsInstallmentModalOpen] = useState(false);
  const [installmentDeal, setInstallmentDeal] = useState(null);
  const [installmentAmount, setInstallmentAmount] = useState("");
  const [installmentError, setInstallmentError] = useState("");

  useEffect(() => {
    if (!dealForm.boardId || !dealForm.startDate || !dealForm.endDate) return;

    const selectedBoard = boards.find((board) => board.id === Number(dealForm.boardId));
    if (!selectedBoard) return;

    const start = new Date(dealForm.startDate);
    const end = new Date(dealForm.endDate);
    const dayDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (dayDiff > 0) {
      setDealForm((prev) => ({
        ...prev,
        amount: Number((dayDiff * Number(selectedBoard.price)).toFixed(2)),
      }));
    }
  }, [boards, dealForm.boardId, dealForm.startDate, dealForm.endDate]);

  const availableBoards = useMemo(() => {
    const inStock = boards.filter((board) => board.status === "AVAILABLE");
    if (!editingDeal?.boardId) return inStock;

    const selectedBoard = boards.find((board) => board.id === editingDeal.boardId);
    if (!selectedBoard) return inStock;
    if (selectedBoard.status === "AVAILABLE") return inStock;
    return [selectedBoard, ...inStock.filter((board) => board.id !== selectedBoard.id)];
  }, [boards, editingDeal]);

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchesClient = selectedClientId ? deal.clientId === Number(selectedClientId) : true;
      const matchesRemaining = remainingOnly ? Number(deal.remainingAmount || 0) > 0 : true;
      return matchesClient && matchesRemaining;
    });
  }, [deals, selectedClientId, remainingOnly]);

  const handleDealChange = (event) => {
    const { name, value } = event.target;
    setDealForm((prev) => ({ ...prev, [name]: value }));
  };

  const openCreateDeal = () => {
    setEditingDeal(null);
    setDealForm(defaultDealForm);
    setIsDealModalOpen(true);
  };

  const openEditDeal = (row) => {
    setEditingDeal(row);
    setDealForm({
      clientId: row.clientId ? String(row.clientId) : "",
      boardId: row.boardId ? String(row.boardId) : "",
      startDate: row.startDate ? row.startDate.slice(0, 10) : "",
      endDate: row.endDate ? row.endDate.slice(0, 10) : "",
      amount: row.amount ?? 0,
      paidAmount: row.paidAmount ?? 0,
    });
    setIsDealModalOpen(true);
  };

  const handleDeleteDeal = async (id) => {
    try {
      await deleteDeal(id);
      toast.success("Deal deleted successfully.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to delete deal.");
    }
  };

  const handleSaveDeal = async () => {
    const payload = {
      clientId: Number(dealForm.clientId),
      boardId: Number(dealForm.boardId),
      startDate: dealForm.startDate,
      endDate: dealForm.endDate,
      amount: Number(dealForm.amount),
      paidAmount: Number(dealForm.paidAmount || 0),
    };

    try {
      if (editingDeal?.id) {
        await updateDeal(editingDeal.id, payload);
        toast.success("Deal updated successfully.");
      } else {
        await createDeal(payload);
        toast.success("Deal created successfully.");
      }
      setIsDealModalOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save deal.");
    }
  };

  const openInstallmentModal = (deal) => {
    setInstallmentDeal(deal);
    setInstallmentAmount(String(Number(deal.remainingAmount || 0)));
    setInstallmentError("");
    setIsInstallmentModalOpen(true);
  };

  const handleAddInstallment = async () => {
    if (!installmentDeal) return;

    const amount = Number(installmentAmount);
    const remaining = Number(installmentDeal.remainingAmount || 0);

    if (!amount || amount <= 0) {
      setInstallmentError("Please enter a valid installment amount.");
      return;
    }

    if (amount > remaining) {
      setInstallmentError("Installment cannot be greater than remaining amount.");
      return;
    }

    try {
      await createInstallment({
        dealId: installmentDeal.id,
        amount,
      });
      await fetchDeals();
      setIsInstallmentModalOpen(false);
      toast.success("Installment added successfully.");
    } catch (error) {
      setInstallmentError(error?.response?.data?.message || "Failed to add installment.");
      toast.error(error?.response?.data?.message || "Failed to add installment.");
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900">
              <BadgeDollarSign className="h-6 w-6 text-teal-600" />
              Deals
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Filter deals by client, track remaining balances, and add installments directly from each deal.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateDeal}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
          >
            <Plus className="h-4 w-4" />
            Add Deal
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Filter by Client</span>
            <select
              value={selectedClientId}
              onChange={(event) => setSelectedClientId(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
            >
              <option value="">All Clients</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-end gap-2 rounded-lg border border-slate-300 px-3 py-2.5">
            <input
              type="checkbox"
              checked={remainingOnly}
              onChange={(event) => setRemainingOnly(event.target.checked)}
              className="h-4 w-4 accent-teal-600"
            />
            <span className="text-sm text-slate-700">Show only deals with remaining amount</span>
          </label>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredDeals.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 md:col-span-2 xl:col-span-3">
            No deals found for selected filters.
          </div>
        )}

        {filteredDeals.map((deal) => (
          <article key={deal.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Deal #{deal.id}</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">{deal.client?.name ?? `Client ${deal.clientId}`}</h3>
                <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                  <MapPin className="h-4 w-4" />
                  {deal.board?.location ?? `Board ${deal.boardId}`}
                </p>
              </div>

              <span
                className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
                  Number(deal.remainingAmount || 0) > 0 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                }`}
              >
                Remaining: Rs {Number(deal.remainingAmount ?? 0).toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <p className="rounded-lg bg-slate-50 px-3 py-2 text-slate-600">
                <span className="block text-xs text-slate-500">Total</span>Rs {Number(deal.amount ?? 0).toLocaleString()}
              </p>
              <p className="rounded-lg bg-slate-50 px-3 py-2 text-slate-600">
                <span className="block text-xs text-slate-500">Paid</span>Rs {Number(deal.paidAmount ?? 0).toLocaleString()}
              </p>
            </div>

            <div className="mt-3 space-y-1 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-slate-400" />
                {new Date(deal.startDate).toLocaleDateString()} - {new Date(deal.endDate).toLocaleDateString()}
              </p>
              <p className="flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400" />
                Board: {deal.board?.size ?? "-"}
              </p>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Installments</p>
              {(deal.installments || []).length === 0 ? (
                <p className="text-xs text-slate-500">No installments yet</p>
              ) : (
                <div className="space-y-1">
                  {deal.installments.map((item) => (
                    <p key={item.id} className="text-xs text-slate-600">
                      #{item.id} - Rs {Number(item.amount ?? 0).toLocaleString()} - {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {Number(deal.remainingAmount || 0) > 0 && (
                <button
                  type="button"
                  onClick={() => openInstallmentModal(deal)}
                  className="inline-flex items-center gap-1 rounded-md border border-teal-200 bg-teal-50 px-2.5 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-100"
                >
                  <ReceiptText className="h-3.5 w-3.5" />
                  Add Installment
                </button>
              )}

              <button
                type="button"
                onClick={() => openEditDeal(deal)}
                className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>

              <button
                type="button"
                onClick={() => handleDeleteDeal(deal.id)}
                className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>

      <Modal isOpen={isDealModalOpen} onClose={() => setIsDealModalOpen(false)}>
        <h3 className="mb-5 text-xl font-semibold text-slate-900">{editingDeal ? "Edit Deal" : "Create Deal"}</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Client</span>
            <select
              name="clientId"
              value={dealForm.clientId}
              onChange={handleDealChange}
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
            <span className="text-sm font-medium text-slate-700">Board</span>
            <select
              name="boardId"
              value={dealForm.boardId}
              onChange={handleDealChange}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
            >
              <option value="">Select Board</option>
              {availableBoards.map((board) => (
                <option key={board.id} value={board.id}>
                  {board.size} - {board.location} {board.status !== "AVAILABLE" ? "(Current deal board)" : ""}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Start Date</span>
            <input
              type="date"
              name="startDate"
              value={dealForm.startDate}
              onChange={handleDealChange}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">End Date</span>
            <input
              type="date"
              name="endDate"
              value={dealForm.endDate}
              onChange={handleDealChange}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Total Amount</span>
            <input
              type="number"
              name="amount"
              value={dealForm.amount}
              onChange={handleDealChange}
              className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-teal-500"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Paid Amount</span>
            <input
              type="number"
              name="paidAmount"
              value={dealForm.paidAmount}
              onChange={handleDealChange}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={handleSaveDeal}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
        >
          <Save className="h-4 w-4" />
          Save Deal
        </button>
      </Modal>

      <Modal isOpen={isInstallmentModalOpen} onClose={() => setIsInstallmentModalOpen(false)}>
        <h3 className="mb-1 text-xl font-semibold text-slate-900">Add Installment</h3>
        <p className="mb-5 text-sm text-slate-500">
          Deal #{installmentDeal?.id} remaining amount: Rs {Number(installmentDeal?.remainingAmount ?? 0).toLocaleString()}
        </p>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">Installment Amount</span>
          <input
            type="number"
            value={installmentAmount}
            onChange={(event) => setInstallmentAmount(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
          />
        </label>

        {installmentError && <p className="mt-2 text-sm text-rose-600">{installmentError}</p>}

        <button
          type="button"
          onClick={handleAddInstallment}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
        >
          <Save className="h-4 w-4" />
          Save Installment
        </button>
      </Modal>
    </div>
  );
};

export default Deals;
