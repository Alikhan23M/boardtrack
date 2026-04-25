import { useState } from "react";
import useCrud from "../../hooks/useCrud";
import { Mail, Eye, EyeOff, Trash2, Reply, X } from "lucide-react";
import { toast } from "sonner";
import ConfirmationDialog from "../../components/ConfirmationDialog";

const Messages = () => {
    const {
        data: messages = [],
        loading,
        patchItem,
        deleteItem,
    } = useCrud("/contacts");

    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [replyData, setReplyData] = useState({ subject: "", body: "" });

    const handleMarkAsRead = async (id, currentStatus) => {
        try {
            await patchItem(id, { isRead: !currentStatus });

            // update selected view instantly (UI sync)
            if (selectedMessage?.id === id) {
                setSelectedMessage({
                    ...selectedMessage,
                    isRead: !currentStatus,
                });
            }

            toast.success(
                currentStatus ? "Marked as unread" : "Marked as read"
            );
        } catch (error) {
            toast.error("Failed to update message status");
        }
    };

    const handleDeleteMessage = async (id) => {
        try {
            await deleteItem(id);

            if (selectedMessage?.id === id) {
                setSelectedMessage(null);
            }

            toast.success("Message deleted successfully");
        } catch (error) {
            toast.error("Failed to delete message");
        } finally {
            setShowDeleteConfirm(null);
        }
    };

    const handleSendReply = () => {
        if (!replyData.subject || !replyData.body) {
            toast.error("Please fill in all fields");
            return;
        }

        toast.success(
            `Reply sent to ${selectedMessage.email}`
        );

        setReplyData({ subject: "", body: "" });
        setShowReplyModal(false);
    };

    const unreadCount = messages.filter((msg) => !msg.isRead).length;

    return (
        <div className="space-y-5">
            {/* HEADER */}
            <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                    <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900">
                        <Mail className="h-6 w-6 text-teal-600" />
                        Contact Messages
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {unreadCount} unread message{unreadCount !== 1 ? "s" : ""}
                    </p>
                </div>
            </section>

            {/* CONTENT */}
            <div className="grid lg:grid-cols-3 gap-5">
                {/* LIST */}
                <div className="lg:col-span-1 border rounded-2xl bg-white shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-6 text-center text-slate-500">
                            Loading messages...
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="p-6 text-center text-slate-500">
                            No messages yet
                        </div>
                    ) : (
                        <div className="divide-y max-h-[calc(100vh-200px)] overflow-y-auto">
                            {messages.map((msg) => (
                              
                                <div
                                    key={msg.id}
                                    onClick={() => {
                                        setSelectedMessage(msg);
                                        if (!msg.isRead) {
                                            handleMarkAsRead(msg.id, msg.isRead);
                                        }
                                    }}
                                    className={`p-4 cursor-pointer border-l-4 transition ${selectedMessage?.id === msg.id
                                        ? "bg-teal-50 border-l-teal-600"
                                        : "border-l-transparent hover:bg-slate-50"
                                        } ${msg.isRead ? "" : "bg-blue-50"}`}
                                >
                                    {console.log(msg)}
                                    <p className="font-semibold text-sm">{msg.name}</p>
                                    <p className="text-xs text-slate-500">{msg.email}</p>
                                    {!msg.isRead && (
                                        <span className="w-2 h-2 bg-blue-500 rounded-full inline-block mt-1"></span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* DETAILS */}
                <div className="lg:col-span-2">
                    {selectedMessage ? (
                        <div className="border rounded-2xl bg-white shadow-sm p-6 space-y-4">
                            <h3 className="text-xl font-bold">
                               <span className="text-teal-600">Name: </span> {selectedMessage.name}
                            </h3>

                            <p className="text-sm text-slate-600">
                                <span className="text-teal-600 font-semibold">Email: </span>
                                <a href={`mailto:${selectedMessage.email}`}>
                                    {selectedMessage.email} 
                                </a>
                            </p>

                            <div className="bg-slate-50 p-4 rounded-lg text-sm">
                                <p className="font-semibold text-teal-600">Message:</p>
                                {selectedMessage.message}
                            </div>

                            {/* show board detalis if any */}
                            {selectedMessage.board && (
                                <div className="bg-slate-50 p-4 rounded-lg text-sm">
                                    <p className="font-semibold text-teal-600">Board:</p>
                                    <p><span className="font-semibold text-slate-600">Front Side:</span> {selectedMessage.board.frontSide}</p>
                                    <p><span className="font-semibold text-slate-600">Loation:</span> {selectedMessage.board.location}</p>
                                </div>
                            )}

                            {/* ACTIONS */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() =>
                                        handleMarkAsRead(
                                            selectedMessage.id,
                                            selectedMessage.isRead
                                        )
                                    }
                                    className="p-2 border rounded-lg"
                                >
                                    {selectedMessage.isRead ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>

                                <button
                                    onClick={() =>
                                        setShowDeleteConfirm(selectedMessage.id)
                                    }
                                    className="p-2 border rounded-lg text-rose-600"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => setShowReplyModal(true)}
                                    className="p-2 border rounded-lg"
                                >
                                    <Reply className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-10 text-center text-slate-500 border rounded-2xl bg-white">
                            Select a message
                        </div>
                    )}
                </div>
            </div>

            {/* DELETE CONFIRM */}
            {showDeleteConfirm && (
              <>
                    {/* CONFIRMATION DIALOG */}
                    {showDeleteConfirm && (
                        <ConfirmationDialog
                            isOpen={true}
                            title="Delete Message?"
                            message="Are you sure you want to delete this message? This action cannot be undone."
                            isDangerous={true}
                            onConfirm={() => handleDeleteMessage(showDeleteConfirm)}
                            onCancel={() => setShowDeleteConfirm(null)}
                        />
                    )}
                </>
            )}

            {/* REPLY MODAL (unchanged logic) */}
            {showReplyModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl w-[500px]">
                        <div className="flex justify-between">
                            <h3>Reply</h3>
                            <button onClick={() => setShowReplyModal(false)}>
                                <X />
                            </button>
                        </div>

                        <input
                            className="w-full border p-2 mt-3"
                            placeholder="Subject"
                            value={replyData.subject}
                            onChange={(e) =>
                                setReplyData({
                                    ...replyData,
                                    subject: e.target.value,
                                })
                            }
                        />

                        <textarea
                            className="w-full border p-2 mt-3"
                            rows={5}
                            placeholder="Message"
                            value={replyData.body}
                            onChange={(e) =>
                                setReplyData({
                                    ...replyData,
                                    body: e.target.value,
                                })
                            }
                        />

                        <button
                            onClick={handleSendReply}
                            className="mt-3 bg-teal-600 text-white px-4 py-2 rounded"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Messages;