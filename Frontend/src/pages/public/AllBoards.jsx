import { useMemo, useState } from "react";
import useBoards from "../../hooks/useBoards";
import { Link } from "react-router-dom";
import { Search, MapPin, Eye, Star } from "lucide-react";

const AllBoards = () => {
  const { boards, loading } = useBoards();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const filtered = useMemo(() => {
    let result = boards.filter((b) => {
      const s = search.toLowerCase();
      return (
        b.location?.toLowerCase().includes(s) ||
        b.size?.toLowerCase().includes(s)
      );
    });

    if (sortBy === "featured") {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    } else if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [boards, search, sortBy]);


  // scroll to top on mount
  useMemo(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        {/* HEADER */}
        <div>
          <h1 className="text-5xl font-bold text-slate-900">
            Available Billboards
          </h1>
          <p className="text-lg text-slate-600 mt-2">
            Discover premium advertising spaces across prime locations
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-2xl border border-slate-200">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by location or size..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition bg-white"
          >
            <option value="featured">Featured First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* RESULTS */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-slate-500">Loading boards...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">No boards found matching your search.</p>
          </div>
        ) : (
          <>
            {/* BOARD COUNT */}
            <p className="text-sm text-slate-600">Showing {filtered.length} boards</p>

            {/* GRID */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((board) => (
                <Link key={board.id} to={`/boards/${board.id}`} className="group h-full">
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                    {/* IMAGE */}
                    <div className="relative h-56 overflow-hidden bg-slate-100">
                      <img
                        src={board.imageUrl}
                        alt={board.location}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {board.featured && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          Featured
                        </div>
                      )}
                      <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold ${
                        board.status === "AVAILABLE"
                          ? "bg-green-100 text-green-800"
                          : "bg-slate-200 text-slate-800"
                      }`}>
                        {board.status === "AVAILABLE" ? "Available" : "Occupied"}
                      </div>
                    </div>

                    {/* INFO */}
                    <div className="p-5 space-y-4 flex-1 flex flex-col">
                      <div>
                        <h2 className="font-bold text-xl text-slate-900 mb-1 line-clamp-2">
                          {board.location}
                        </h2>
                        <p className="text-sm text-slate-500">Premium billboard location</p>
                      </div>

                      <div className="space-y-2 text-sm text-slate-600 flex-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0" />
                          <span>Size: {board.size}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-teal-600 flex-shrink-0" />
                          <span>Facing: {board.frontSide}</span>
                        </div>
                      </div>

                      {/* FOOTER */}
                      <div className="pt-4 border-t border-slate-100 space-y-3">
                        <div>
                          <p className="text-3xl font-bold text-teal-600">
                            Rs {Number(board.price).toLocaleString()}
                            <span className="text-sm text-slate-600 font-normal ml-1">/day</span>
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">View Details</span>
                          <span className="text-teal-600 group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllBoards;

