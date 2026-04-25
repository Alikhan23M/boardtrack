
import { Link } from "react-router-dom";
import useFeaturedBoards from "../../hooks/useFeaturedBoards";
import { MapPin, Eye, Zap, BarChart3, Phone } from "lucide-react";
import { useMemo } from "react";

const Home = () => {
  const { boards, loading } = useFeaturedBoards();
// scroll to top on mount
  useMemo(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="space-y-0">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 text-white py-24 md:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Premium Billboard <span className="text-teal-400">Advertising</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Reach thousands daily with strategically placed billboards across prime city locations. Elevate your brand visibility with real-world advertising impact.
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Link to="/boards" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-semibold transition">
                Explore Boards
              </Link>
              <Link to="/contact" className="border-2 border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-slate-900 px-8 py-3 rounded-xl font-semibold transition">
                Contact Us
              </Link>
            </div>
          </div>

          {/* STATS */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 pt-12 border-t border-slate-700">
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-400">500+</div>
              <p className="text-slate-400">Billboards Nationwide</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-400">10M+</div>
              <p className="text-slate-400">Daily Impressions</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-400">1000+</div>
              <p className="text-slate-400">Happy Clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED BOARDS */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900">Featured Boards</h2>
            <p className="text-slate-600 mt-2">Premium advertising spaces ready for immediate booking</p>
          </div>

          {loading ? (
            <p className="text-center text-slate-500">Loading boards...</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {boards?.map((board) => (
                <Link key={board.id} to={`/boards/${board.id}`} className="group">
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all">
                    <div className="relative h-48 overflow-hidden bg-slate-100">
                      <img
                        src={board.imageUrl}
                        alt={board.location}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {board.featured && (
                        <span className="absolute top-3 right-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="p-5 space-y-3">
                      <h3 className="font-bold text-lg text-slate-900">{board.location}</h3>

                      <div className="space-y-2 text-sm text-slate-600">
                        <p className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-teal-600" />
                          Size: {board.size}
                        </p>
                        <p className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-teal-600" />
                          Facing: {board.frontSide}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100">
                        <p className="text-2xl font-bold text-teal-600">
                          Rs {Number(board.price).toLocaleString()}
                          <span className="text-sm text-slate-600 font-normal">/day</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/boards" className="inline-block bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-semibold transition">
              View All Boards →
            </Link>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-teal-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900">Why Choose BoardTrack?</h2>
            <p className="text-slate-600 mt-2">Industry-leading billboard advertising solutions</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-teal-300 transition">
              <div className="flex items-start gap-4">
                <MapPin className="w-8 h-8 text-teal-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">Prime Locations</h3>
                  <p className="text-slate-600">Strategic placement in high-traffic areas ensuring maximum visibility and engagement with your target audience.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-teal-300 transition">
              <div className="flex items-start gap-4">
                <BarChart3 className="w-8 h-8 text-teal-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">Proven Results</h3>
                  <p className="text-slate-600">Track record of delivering measurable ROI and brand awareness for diverse industries and campaigns.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-teal-300 transition">
              <div className="flex items-start gap-4">
                <Zap className="w-8 h-8 text-teal-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">Instant Booking</h3>
                  <p className="text-slate-600">Fast, seamless booking process with immediate confirmation and 24/7 customer support.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-teal-300 transition">
              <div className="flex items-start gap-4">
                <Phone className="w-8 h-8 text-teal-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">Expert Support</h3>
                  <p className="text-slate-600">Dedicated account managers providing expert guidance and campaign optimization throughout your tenure.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-4xl font-bold">Ready to Boost Your Brand?</h2>
          <p className="text-lg text-teal-100">
            Start your billboard advertising campaign today and reach millions of potential customers.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Link to="/boards" className="bg-white hover:bg-slate-100 text-teal-600 px-8 py-3 rounded-xl font-semibold transition">
              Browse Boards
            </Link>
            <Link to="/contact" className="border-2 border-white hover:bg-white/10 text-white px-8 py-3 rounded-xl font-semibold transition">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

 