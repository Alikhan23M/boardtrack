import { useParams, useNavigate } from "react-router-dom";
import useSingleBoard from "../../hooks/useSingleBoard";
import { MapPin, Eye, Phone, MessageSquare, Bookmark, Star, Calendar, HelpCircle, ChartBarIncreasing, Ruler } from "lucide-react";
import { useMemo } from "react";

const BoardDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { board, loading } = useSingleBoard(id);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-slate-500">Loading...</p>
      </div>
    );

  if (!board)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-slate-500">Board not found</p>
      </div>
    );
// scroll to top on mount
  useMemo(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-4 sm:px-6 md:px-8 lg:px-10">
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
        {/* IMAGE SECTION */}
        <div className="rounded-3xl overflow-hidden shadow-lg">
          <img
            src={board.imageUrl}
            alt={board.location}
            className="w-full max-h-[500px] object-fit"
          />
        </div>

        {/* DETAILS */}
        <div className="grid md:grid-cols-3 gap-10">
          {/* LEFT - MAIN INFO */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {board.featured && (
                  <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-semibold">
                    <Star className="w-4 h-4" /> Featured Board
                  </span>
                )}
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                  board.status === "AVAILABLE"
                    ? "bg-green-100 text-green-800"
                    : "bg-slate-200 text-slate-800"
                }`}>
                  {board.status === "AVAILABLE" ? "✓ Available" : "Occupied"}
                </span>
              </div>

              <h1 className="text-5xl font-bold text-slate-900 mb-3">
                {board.location}
              </h1>

              <p className="text-lg text-slate-600">
                Premium billboard advertising space located in a high-traffic area with excellent visibility and proven engagement metrics.
              </p>
            </div>

            {/* SPECIFICATIONS */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Specifications</h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Location</p>
                    <p className="text-lg text-slate-900 font-semibold">
                      {board.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1 flex items-center justify-center font-bold"><Ruler className="w-6 h-6" /> </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Size</p>
                    <p className="text-lg text-slate-900 font-semibold">
                      {board.size}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Eye className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Direction</p>
                    <p className="text-lg text-slate-900 font-semibold">
                      Facing {board.frontSide}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1 flex items-center justify-center font-bold"><ChartBarIncreasing className="w-6 h-6" /> </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Status</p>
                    <p className="text-lg text-slate-900 font-semibold">
                      {board.status === "AVAILABLE" ? "Ready for Booking" : "Currently Occupied"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* BENEFITS */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Why This Location</h2>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold mt-1">✓</span>
                  <span>Strategic placement in high-traffic zone with proven foot and vehicle traffic</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold mt-1">✓</span>
                  <span>Excellent visibility from multiple angles ensuring maximum exposure</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold mt-1">✓</span>
                  <span>Premium condition with regular maintenance and cleaning services</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold mt-1">✓</span>
                  <span>Flexible booking periods and professional installation support</span>
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT - BOOKING CARD */}
          <div className="md:col-span-1">
            <div className="sticky top-6 bg-white border border-slate-200 rounded-2xl p-8 shadow-lg space-y-6">
              {/* PRICE */}
              <div className="space-y-2">
                <p className="text-slate-500 text-sm font-medium">Price per day</p>
                <div className="space-y-1">
                  <h2 className="text-5xl font-bold text-teal-600">
                    Rs {Number(board.price).toLocaleString()}
                  </h2>
                  <p className="text-sm text-slate-600">Negotiable for long-term bookings</p>
                </div>
              </div>

              <hr className="border-slate-200" />

              {/* CTA BUTTONS */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/contact?boardId=${board.id}`)}
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Contact for Booking
                </button>

                <button
                  onClick={() => navigate(`/contact?boardId=${board.id}`)}
                  className="w-full border-2 border-teal-600 text-teal-600 hover:bg-teal-50 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Send Inquiry
                </button>

                <button
                  className="w-full border border-slate-300 text-slate-700 hover:bg-slate-50 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Bookmark className="w-4 h-4" />
                  Save to Wishlist
                </button>
              </div>

              <hr className="border-slate-200" />

              {/* INFO */}
              {/* <div className="space-y-2 text-sm text-slate-600">
                <p><Location className="w-4 h-4 text-teal-600" /> High-traffic location</p>
                <p><Calendar className="w-4 h-4 text-teal-600" /> Available for immediate booking</p>
                <p><HelpCircle className="w-4 h-4 text-teal-600" /> Dedicated account support</p>
              </div> */}
            </div>
          </div>
        </div>

        {/* RELATED BOARDS */}
        <div className="space-y-6 border-t border-slate-200 pt-10">
          <h2 className="text-3xl font-bold text-slate-900">Other Premium Locations</h2>
          <button
            onClick={() => navigate("/boards")}
            className="inline-block bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Browse All Boards →
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardDetails;
