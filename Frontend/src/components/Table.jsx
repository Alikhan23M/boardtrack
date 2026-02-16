import { PenSquare, Trash2 } from "lucide-react";

const startCase = (text) =>
  String(text)
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();

const isDateLike = (value) =>
  typeof value === "string" && (value.includes("T") || /^\d{4}-\d{2}-\d{2}/.test(value));

const formatCellValue = (value) => {
  if (value === null || value === undefined || value === "") return "-";

  if (isDateLike(value)) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed.toLocaleDateString();
  }

  if (typeof value === "object") {
    if (value.name) return value.name;
    if (value.location) return value.location;
    return JSON.stringify(value);
  }

  return String(value);
};

const Table = ({ columns, data = [], onEdit, onDelete }) => {
  const normalizedColumns = columns.map((column) =>
    typeof column === "string"
      ? { key: column, label: startCase(column), render: undefined }
      : {
          key: column.key,
          label: column.label ?? startCase(column.key),
          render: column.render,
        },
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              {normalizedColumns.map((column) => (
                <th key={column.key} className="px-4 py-3.5 font-semibold">
                  {column.label}
                </th>
              ))}
              {(onEdit || onDelete) && <th className="px-4 py-3.5 text-right font-semibold">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={normalizedColumns.length + (onEdit || onDelete ? 1 : 0)}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No records found.
                </td>
              </tr>
            )}

            {data.map((row) => (
              <tr key={row.id ?? JSON.stringify(row)} className="border-b border-slate-100 last:border-b-0">
                {normalizedColumns.map((column) => (
                  <td key={`${row.id ?? "row"}-${column.key}`} className="px-4 py-3 text-slate-700">
                    {column.render ? column.render(row) : formatCellValue(row[column.key])}
                  </td>
                ))}

                {(onEdit || onDelete) && (
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(row)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                        >
                          <PenSquare className="h-3.5 w-3.5" />
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(row.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
