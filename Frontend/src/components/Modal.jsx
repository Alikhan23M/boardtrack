const Modal = ({ isOpen, onClose, children, actionButton }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl my-auto flex flex-col max-h-[calc(100vh-2rem)]">
        <div className="overflow-y-auto flex-1 p-5 sm:p-6">
          {children}
        </div>
        <div className="border-t border-slate-200 mt-4 p-5 sm:p-6 flex justify-end gap-3 flex-shrink-0">
          {actionButton}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
