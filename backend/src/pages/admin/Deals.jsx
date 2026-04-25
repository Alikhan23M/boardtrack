import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import useCrud from "../../hooks/useCrud";
import Modal from "../../components/Modal";
import { toast } from "sonner";
import {
  BadgeDollarSign,
  CalendarDays,
  Download,
  FileText,
  MapPin,
  Pencil,
  Plus,
  Printer,
  ReceiptText,
  Save,
  Trash2,
  User,
} from "lucide-react";
import Loading from "../../components/Loading";

const defaultDealForm = {
  clientId: "",
  boardSelections: [],
  amount: 0,
  paidAmount: 0,
};

const formatCurrency = (value) => `Rs ${Number(value ?? 0).toLocaleString()}`;

const daysBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
};

const openPrintWindow = (deal) => {
  const boardRows = (deal.dealBoards || [])
    .map((item) => {
      const dayDiff = daysBetween(item.startDate, item.endDate);
      const subtotal = Number(item.board?.price || 0) * Math.max(dayDiff, 0);
      return `
        <tr>
          <td style="padding:8px;border:1px solid #ddd;">${item.board?.location ?? "-"}</td>
          <td style="padding:8px;border:1px solid #ddd;">${item.board?.size ?? "-"}</td>
          <td style="padding:8px;border:1px solid #ddd;">${new Date(item.startDate).toLocaleDateString()} - ${new Date(item.endDate).toLocaleDateString()}</td>
          <td style="padding:8px;border:1px solid #ddd;">${formatCurrency(subtotal)}</td>
        </tr>`;
    })
    .join("");

  const installmentRows = (deal.installments || [])
    .map(
      (item) => `
      <tr>
        <td style="padding:8px;border:1px solid #ddd;">#${item.id}</td>
        <td style="padding:8px;border:1px solid #ddd;">${formatCurrency(item.amount)}</td>
        <td style="padding:8px;border:1px solid #ddd;">${new Date(item.createdAt).toLocaleDateString()}</td>
      </tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:Segoe UI, Arial, sans-serif; padding:24px;">
      <h1 style="margin:0 0 8px 0;">BoardTrack Receipt</h1>
      <p style="margin:0 0 16px 0;color:#555;">Deal #${deal.id}</p>
      <p><strong>Client:</strong> ${deal.client?.name ?? "-"}</p>
      <p><strong>Total:</strong> ${formatCurrency(deal.amount)}</p>
      <p><strong>Paid:</strong> ${formatCurrency(deal.paidAmount)}</p>
      <p><strong>Remaining:</strong> ${formatCurrency(deal.remainingAmount)}</p>
      <h3>Boards</h3>
      <table style="width:100%; border-collapse:collapse; margin-bottom:16px;">
        <thead><tr><th style="padding:8px;border:1px solid #ddd;text-align:left;">Location</th><th style="padding:8px;border:1px solid #ddd;text-align:left;">Size</th><th style="padding:8px;border:1px solid #ddd;text-align:left;">Period</th><th style="padding:8px;border:1px solid #ddd;text-align:left;">Subtotal</th></tr></thead>
        <tbody>${boardRows || '<tr><td colspan="4" style="padding:8px;border:1px solid #ddd;">No boards</td></tr>'}</tbody>
      </table>
      <h3>Installments</h3>
      <table style="width:100%; border-collapse:collapse;">
        <thead><tr><th style="padding:8px;border:1px solid #ddd;text-align:left;">ID</th><th style="padding:8px;border:1px solid #ddd;text-align:left;">Amount</th><th style="padding:8px;border:1px solid #ddd;text-align:left;">Date</th></tr></thead>
        <tbody>${installmentRows || '<tr><td colspan="3" style="padding:8px;border:1px solid #ddd;">No installments</td></tr>'}</tbody>
      </table>
    </div>`;

  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) return;
  win.document.write(`<html><head><title>Deal Receipt #${deal.id}</title></head><body>${html}</body></html>`);
  win.document.close();
  win.focus();
  win.print();
};

const Deals = () => {
  const { data: deals, loading, createItem: createDeal, updateItem: updateDeal, deleteItem: deleteDeal, fetchData: fetchDeals } =
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
  const [isSavingDeal, setIsSavingDeal] = useState(false);
  const [isSavingInstallment, setIsSavingInstallment] = useState(false);

  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receiptDeal, setReceiptDeal] = useState(null);
  const [isLoadingReceipt, setIsLoadingReceipt] = useState(false);

  useEffect(() => {
    if (dealForm.boardSelections.length === 0) return;

    const priceMap = new Map(boards.map((board) => [board.id, Number(board.price || 0)]));
    let total = 0;

    for (const selection of dealForm.boardSelections) {
      const price = priceMap.get(selection.boardId) || 0;
      const days = daysBetween(selection.startDate, selection.endDate);
      if (days > 0) total += price * days;
    }

    setDealForm((prev) => ({ ...prev, amount: Number(total.toFixed(2)) }));
  }, [dealForm.boardSelections, boards]);

  const availableBoards = useMemo(() => {
    const inStock = boards.filter((board) => board.status === "AVAILABLE");
    if (!editingDeal) return inStock;

    const editingBoardIds = (editingDeal.dealBoards || []).map((item) => item.boardId);
    const editingBoards = boards.filter((board) => editingBoardIds.includes(board.id));
    return [...editingBoards, ...inStock.filter((board) => !editingBoardIds.includes(board.id))];
  }, [boards, editingDeal]);

  const filteredDeals = useMemo(
    () =>
      deals.filter((deal) => {
        const matchesClient = selectedClientId ? deal.clientId === Number(selectedClientId) : true;
        const matchesRemaining = remainingOnly ? Number(deal.remainingAmount || 0) > 0 : true;
        return matchesClient && matchesRemaining;
      }),
    [deals, selectedClientId, remainingOnly],
  );

  const handleDealChange = (event) => {
    const { name, value } = event.target;
    setDealForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleBoardSelection = (boardId) => {
    setDealForm((prev) => {
      const exists = prev.boardSelections.some((item) => item.boardId === boardId);
      if (exists) {
        return {
          ...prev,
          boardSelections: prev.boardSelections.filter((item) => item.boardId !== boardId),
        };
      }

      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      return {
        ...prev,
        boardSelections: [
          ...prev.boardSelections,
          {
            boardId,
            startDate: today.toISOString().slice(0, 10),
            endDate: nextWeek.toISOString().slice(0, 10),
          },
        ],
      };
    });
  };

  const updateBoardSelectionDate = (boardId, field, value) => {
    setDealForm((prev) => ({
      ...prev,
      boardSelections: prev.boardSelections.map((item) => (item.boardId === boardId ? { ...item, [field]: value } : item)),
    }));
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
      boardSelections: (row.dealBoards || []).map((item) => ({
        boardId: item.boardId,
        startDate: item.startDate ? item.startDate.slice(0, 10) : "",
        endDate: item.endDate ? item.endDate.slice(0, 10) : "",
      })),
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
    if (isSavingDeal) return;
    if (!dealForm.boardSelections.length) {
      toast.error("Please select at least one board.");
      return;
    }

    setIsSavingDeal(true);

    const payload = {
      clientId: Number(dealForm.clientId),
      boardSelections: dealForm.boardSelections,
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
    } finally {
      setIsSavingDeal(false);
    }
  };

  const openInstallmentModal = (deal) => {
    setInstallmentDeal(deal);
    setInstallmentAmount(String(Number(deal.remainingAmount || 0)));
    setInstallmentError("");
    setIsInstallmentModalOpen(true);
  };

  const handleAddInstallment = async () => {
    if (!installmentDeal || isSavingInstallment) return;

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

    setIsSavingInstallment(true);
    try {
      await createInstallment({ dealId: installmentDeal.id, amount });
      await fetchDeals();
      setIsInstallmentModalOpen(false);
      toast.success("Installment added successfully.");
    } catch (error) {
      setInstallmentError(error?.response?.data?.message || "Failed to add installment.");
      toast.error(error?.response?.data?.message || "Failed to add installment.");
    } finally {
      setIsSavingInstallment(false);
    }
  };

  const openReceiptModal = async (deal) => {
    setIsLoadingReceipt(true);
    setIsReceiptOpen(true);
    try {
      const response = await api.get(`/receipts/deals/${deal.id}`);
      setReceiptDeal(response.data?.data || deal);
    } catch (error) {
      setReceiptDeal(deal);
      toast.error("Could not load full receipt details. Showing available data.");
    } finally {
      setIsLoadingReceipt(false);
    }
  };



  if(loading){
    return (<Loading message="Loading deals..." />)
  }
  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900">
              <BadgeDollarSign className="h-6 w-6 text-teal-600" />
              Deals
            </h2>
            <p className="mt-1 text-sm text-slate-500">Each selected board can have its own start/end period.</p>
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
        {filteredDeals.map((deal) => (
          <article key={deal.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Deal #{deal.id}</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">{deal.client?.name ?? `Client ${deal.clientId}`}</h3>
              </div>
              <span
                className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
                  Number(deal.remainingAmount || 0) > 0 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                }`}
              >
                Remaining: {formatCurrency(deal.remainingAmount)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <p className="rounded-lg bg-slate-50 px-3 py-2 text-slate-600">
                <span className="block text-xs text-slate-500">Total</span>
                {formatCurrency(deal.amount)}
              </p>
              <p className="rounded-lg bg-slate-50 px-3 py-2 text-slate-600">
                <span className="block text-xs text-slate-500">Paid</span>
                {formatCurrency(deal.paidAmount)}
              </p>
            </div>

            <div className="mt-3 space-y-1 text-sm text-slate-600">
              {(deal.dealBoards || []).map((item) => (
                <p key={item.id} className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                  <span>
                    {item.board?.location ?? "Board"} | <CalendarDays className="inline h-3.5 w-3.5" />{" "}
                    {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                  </span>
                </p>
              ))}
              <p className="flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400" />
                Boards count: {(deal.dealBoards || []).length}
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
                      #{item.id} - {formatCurrency(item.amount)} - {new Date(item.createdAt).toLocaleDateString()}
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
                onClick={() => openReceiptModal(deal)}
                className="inline-flex items-center gap-1 rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
              >
                <FileText className="h-3.5 w-3.5" />
                Receipt
              </button>
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

      <Modal 
        isOpen={isDealModalOpen} 
        onClose={() => setIsDealModalOpen(false)}
        actionButton={
          <button
            type="button"
            onClick={handleSaveDeal}
            disabled={isSavingDeal}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60 transition"
          >
            <Save className="h-4 w-4" />
            {isSavingDeal ? "Saving..." : "Save Deal"}
          </button>
        }
      >
        <h3 className="mb-5 text-xl font-semibold text-slate-900">{editingDeal ? "Edit Deal" : "Create Deal"}</h3>
        <div className="grid grid-cols-1 gap-4">
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

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Boards (select and set dates per board)</p>
            <div className="max-h-64 space-y-3 overflow-y-auto rounded-lg border border-slate-300 p-3">
              {availableBoards.map((board) => {
                const selected = dealForm.boardSelections.find((item) => item.boardId === board.id);
                return (
                  <div key={board.id} className="rounded-md border border-slate-200 p-2">
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={Boolean(selected)}
                        onChange={() => toggleBoardSelection(board.id)}
                        className="h-4 w-4 accent-teal-600"
                      />
                      {board.size} - {board.location} ({formatCurrency(board.price)}/day)
                    </label>

                    {selected && (
                      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <label className="flex flex-col gap-1">
                          <span className="text-xs text-slate-500">Start Date</span>
                          <input
                            type="date"
                            value={selected.startDate || ""}
                            onChange={(e) => updateBoardSelectionDate(board.id, "startDate", e.target.value)}
                            className="rounded border border-slate-300 px-2 py-1 text-sm outline-none focus:border-teal-500"
                          />
                        </label>
                        <label className="flex flex-col gap-1">
                          <span className="text-xs text-slate-500">End Date</span>
                          <input
                            type="date"
                            value={selected.endDate || ""}
                            onChange={(e) => updateBoardSelectionDate(board.id, "endDate", e.target.value)}
                            className="rounded border border-slate-300 px-2 py-1 text-sm outline-none focus:border-teal-500"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Calculated Total</span>
            <input
              type="number"
              value={dealForm.amount}
              readOnly
              className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
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
      </Modal>

      <Modal 
        isOpen={isInstallmentModalOpen} 
        onClose={() => setIsInstallmentModalOpen(false)}
        actionButton={
          <button
            type="button"
            onClick={handleAddInstallment}
            disabled={isSavingInstallment}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60 transition"
          >
            <Save className="h-4 w-4" />
            {isSavingInstallment ? "Saving..." : "Save Installment"}
          </button>
        }
      >
        <h3 className="mb-1 text-xl font-semibold text-slate-900">Add Installment</h3>
        <p className="mb-5 text-sm text-slate-500">
          Deal #{installmentDeal?.id} remaining amount: {formatCurrency(installmentDeal?.remainingAmount)}
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
      </Modal>

      <Modal isOpen={isReceiptOpen} onClose={() => setIsReceiptOpen(false)}>
        <div className="max-h-[70vh] overflow-y-auto">
          <h3 className="mb-4 text-xl font-semibold text-slate-900">Deal Receipt</h3>
          {isLoadingReceipt && <p className="text-sm text-slate-500">Loading receipt...</p>}
          {!isLoadingReceipt && receiptDeal && (
            <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
              <div className="border-b border-slate-200 pb-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">BoardTrack</p>
                <h4 className="text-lg font-bold text-slate-900">Receipt - Deal #{receiptDeal.id}</h4>
              </div>
              <div className="grid grid-cols-1 gap-2 text-sm text-slate-700 sm:grid-cols-2">
                <p><strong>Client:</strong> {receiptDeal.client?.name}</p>
                <p><strong>Total:</strong> {formatCurrency(receiptDeal.amount)}</p>
                <p><strong>Paid:</strong> {formatCurrency(receiptDeal.paidAmount)}</p>
                <p><strong>Remaining:</strong> {formatCurrency(receiptDeal.remainingAmount)}</p>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-800">Boards</p>
                <div className="space-y-1 text-sm text-slate-600">
                  {(receiptDeal.dealBoards || []).map((item) => (
                    <p key={item.id}>
                      {item.board?.location} - {item.board?.size} | {new Date(item.startDate).toLocaleDateString()} -{" "}
                      {new Date(item.endDate).toLocaleDateString()}
                    </p>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-800">Installments</p>
                {(receiptDeal.installments || []).length === 0 ? (
                  <p className="text-sm text-slate-500">No installments</p>
                ) : (
                  <div className="space-y-1 text-sm text-slate-600">
                    {receiptDeal.installments.map((item) => (
                      <p key={item.id}>
                        #{item.id} - {formatCurrency(item.amount)} - {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => openPrintWindow(receiptDeal)}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <Printer className="h-4 w-4" />
                  Print
                </button>
                <button
                  type="button"
                  onClick={() => openPrintWindow(receiptDeal)}
                  className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Deals;
