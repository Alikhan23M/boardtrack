import { useEffect, useMemo, useRef, useState } from "react";
import useCrud from "../hooks/useCrud";
import Table from "../components/Table";
import FormModal from "../components/FormModal";
import { toast } from "sonner";
import { CircleDot, Filter, LayoutGrid, Plus } from "lucide-react";

const boardFields = [
  { name: "size", label: "Board Size", placeholder: "10x20 ft" },
  { name: "location", label: "Location", placeholder: "Main boulevard" },
  { name: "frontSide", label: "Facing Side", placeholder: "North" },
  { name: "price", label: "Daily Price", type: "number", placeholder: "1200" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "AVAILABLE", label: "Available" },
      { value: "OCCUPIED", label: "Occupied" },
    ],
  },
  { name: "availableDate", label: "Available Date", type: "datetime-local" },
];

const statusStyles = {
  AVAILABLE: "bg-emerald-100 text-emerald-700",
  OCCUPIED: "bg-rose-100 text-rose-700",
};

const Boards = () => {
  const { data, createItem, updateItem, deleteItem } = useCrud("/boards");
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const warnedBoardsRef = useRef(new Set());

  const filteredBoards = useMemo(() => {
    if (statusFilter === "ALL") return data;
    return data.filter((board) => board.status === statusFilter);
  }, [data, statusFilter]);

  useEffect(() => {
    data.forEach((board) => {
      if (board.status === "AVAILABLE" || !board.availableDate) return;
      if (warnedBoardsRef.current.has(board.id)) return;

      const today = new Date();
      const availableDate = new Date(board.availableDate);
      const dayDiff = Math.ceil((availableDate - today) / (1000 * 60 * 60 * 24));

      if (dayDiff >= 0 && dayDiff <= 10) {
        toast.warning(`${board.location} will be available in ${dayDiff} day${dayDiff === 1 ? "" : "s"}.`);
        warnedBoardsRef.current.add(board.id);
      }
    });
  }, [data]);

  const openForEdit = (row) => {
    setEditing({
      ...row,
      availableDate: row.availableDate ? row.availableDate.slice(0, 16) : "",
    });
    setIsOpen(true);
  };

  const handleSave = async (form) => {
    const payload = {
      ...form,
      price: Number(form.price),
      availableDate: form.availableDate || null,
    };

    try {
      if (editing?.id) {
        await updateItem(editing.id, payload);
        toast.success("Board updated successfully.");
      } else {
        await createItem(payload);
        toast.success("Board created successfully.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save board.");
      throw error;
    }
  };

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900">
            <LayoutGrid className="h-6 w-6 text-teal-600" />
            Boards
          </h2>
          <p className="mt-1 text-sm text-slate-500">Track billboard inventory, status and pricing.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">
            <Filter className="h-4 w-4 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="bg-transparent outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="OCCUPIED">Occupied</option>
            </select>
          </label>

          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setIsOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
          >
            <Plus className="h-4 w-4" />
            Add Board
          </button>
        </div>
      </section>

      <Table
        columns={[
          { key: "size", label: "Size" },
          { key: "location", label: "Location" },
          { key: "frontSide", label: "Facing" },
          { key: "price", label: "Price", render: (row) => `Rs ${Number(row.price ?? 0).toLocaleString()}` },
          {
            key: "status",
            label: "Status",
            render: (row) => (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  statusStyles[row.status] ?? "bg-slate-100 text-slate-700"
                }`}
              >
                <CircleDot className="h-3 w-3" />
                {row.status ?? "-"}
              </span>
            ),
          },
          // if status is availbalbe then show a dash instead of data
          { key: "availableDate", label: "Available Date", render: (row) => (row.status === "AVAILABLE" ? "-" : row.availableDate.slice(0, 16)) },
          // { key: "availableDate", label: "Available Date" },
        ]}
        data={filteredBoards}
        onEdit={openForEdit}
        onDelete={async (id) => {
          try {
            await deleteItem(id);
            toast.success("Board deleted successfully.");
          } catch (error) {
            toast.error(error?.response?.data?.message || "Unable to delete board.");
          }
        }}
      />

      <FormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSave}
        fields={boardFields}
        initialData={editing}
        title={editing ? "Edit Board" : "Add Board"}
      />
    </div>
  );
};

export default Boards;
