import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import axios from "../../api/axios";

const Contact = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    boardId: searchParams.get("boardId") || "",
    message: "",
  });

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const { data } = await axios.get("/boards");
      if (data.success) {
        setBoards(data.data.filter((b) => b.status === "AVAILABLE"));
      }
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await axios.post("/contacts", formData);
      if (data.success) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          boardId: "",
          message: "",
        });
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedBoard = boards.find((b) => b.id === Number(formData.boardId));
// scroll to top on mount
  useMemo(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        {/* HEADER */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-slate-900">Get in Touch</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Have questions about our billboard advertising? Ready to book a space? Contact us today and let's discuss your advertising needs.
          </p>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* LEFT - CONTACT INFO */}
          <div className="md:col-span-1 space-y-6">
            {/* CARD 1 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition">
              <div className="flex items-start gap-4">
                <Phone className="w-8 h-8 text-teal-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Phone</h3>
                  <p className="text-sm text-slate-600">+92 (300) 123-4567</p>
                  <p className="text-xs text-slate-500 mt-2">Monday - Friday, 9AM - 6PM</p>
                </div>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition">
              <div className="flex items-start gap-4">
                <Mail className="w-8 h-8 text-teal-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Email</h3>
                  <p className="text-sm text-slate-600">info@boardtrack.com</p>
                  <p className="text-xs text-slate-500 mt-2">We respond within 24 hours</p>
                </div>
              </div>
            </div>

            {/* CARD 3 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition">
              <div className="flex items-start gap-4">
                <MapPin className="w-8 h-8 text-teal-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Office</h3>
                  <p className="text-sm text-slate-600">
                    123 Business Plaza
                    <br />
                    Mardan, Pakistan
                  </p>
                </div>
              </div>
            </div>

            {/* HIGHLIGHT */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-2xl p-6">
              <MessageSquare className="w-6 h-6 text-teal-600 mb-3" />
              <h3 className="font-bold text-slate-900 mb-2">Quick Response</h3>
              <p className="text-sm text-slate-700">
                Our team is ready to help you find the perfect billboard advertising solution for your business.
              </p>
            </div>
          </div>

          {/* RIGHT - FORM */}
          <div className="md:col-span-2">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* ROW 1 */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                    />
                  </div>
                </div>

                {/* ROW 2 */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+92 300 1234567"
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Select Billboard (Optional)
                    </label>
                    <select
                      name="boardId"
                      value={formData.boardId}
                      onChange={handleChange}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition bg-white"
                    >
                      <option value="">-- Choose a board --</option>
                      {boards.map((board) => (
                        <option key={board.id} value={board.id}>
                          {board.location} (Rs {Number(board.price).toLocaleString()}/day)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* SELECTED BOARD INFO */}
                {selectedBoard && (
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold text-teal-900">Selected Board:</span> {selectedBoard.location}
                      <br />
                      <span className="text-teal-700">Rs {Number(selectedBoard.price).toLocaleString()} per day</span>
                    </p>
                  </div>
                )}

                {/* MESSAGE */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your advertising needs, campaign duration, or any specific requirements..."
                    rows={5}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition resize-none"
                  />
                </div>

                {/* NOTE */}
                <p className="text-xs text-slate-500 text-center">
                  * Required fields. We respect your privacy and will only use this information to assist with your inquiry.
                </p>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
