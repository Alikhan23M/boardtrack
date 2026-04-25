import { useEffect, useState } from "react";
import api from "../../api/axios";
import Table from "../../components/Table";
import { BadgeDollarSign, Building2, LayoutGrid, Printer, ReceiptText, Users } from "lucide-react";
import Loading from "../../components/Loading";

const statsMeta = [
  { key: "clients", label: "Clients", tone: "bg-sky-100 text-sky-700", icon: Users },
  { key: "boards", label: "Boards", tone: "bg-emerald-100 text-emerald-700", icon: LayoutGrid },
  { key: "deals", label: "Deals", tone: "bg-amber-100 text-amber-700", icon: BadgeDollarSign },
  { key: "installments", label: "Installments", tone: "bg-rose-100 text-rose-700", icon: ReceiptText },
  { key: "printingServices", label: "Printing", tone: "bg-indigo-100 text-indigo-700", icon: Printer },
];

const Dashboard = () => {
  const [stats, setStats] = useState({
    clients: 0,
    boards: 0,
    deals: 0,
    installments: 0,
    printingServices: 0,
    
  });
  const [recentDeals, setRecentDeals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
       setLoading(true);
        const [clients, boards, deals, installments, printingServices] = await Promise.all([
          api.get("/clients"),
          api.get("/boards"),
          api.get("/deals"),
          api.get("/installments"),
          api.get("/printing-services"),
        ]);

        const dealRows = deals.data?.data ?? [];

        setStats({
          clients: clients.data?.data?.length ?? 0,
          boards: boards.data?.data?.length ?? 0,
          deals: dealRows.length,
          installments: installments.data?.data?.length ?? 0,
          printingServices: printingServices.data?.data?.length ?? 0,
        });

        setRecentDeals(dealRows.slice(0, 5));
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      }
      finally{
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if(loading){
    return ( <Loading message="Loading dashboard Data..." />)
  }
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm font-medium text-teal-700">Overview</p>
        <h2 className="mt-1 flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900">
          <Building2 className="h-6 w-6 text-teal-600" />
          Business Snapshot
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Track active operations, monitor inventory and keep your board business workflow centralized.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statsMeta.map((item) => (
          <article key={item.key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <item.icon className="mb-3 h-5 w-5 text-slate-500" />
            <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${item.tone}`}>
              {item.label}
            </span>
            <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{stats[item.key]}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Recent Deals</h3>
          <span className="text-sm text-slate-500">Latest 5 entries</span>
        </div>
        <Table
          columns={[
            { key: "id", label: "Deal ID" },
            { key: "client", label: "Client", render: (row) => row.client?.name ?? "-" },
            {
              key: "board",
              label: "Boards",
              render: (row) => row.dealBoards?.map((item) => item.board?.location).filter(Boolean).join(", ") ?? "-",
            },
            { key: "amount", label: "Amount", render: (row) => `Rs ${Number(row.amount ?? 0).toLocaleString()}` },
            { key: "paidAmount", label: "Paid", render: (row) => `Rs ${Number(row.paidAmount ?? 0).toLocaleString()}` },
          ]}
          data={recentDeals}
        />
      </section>
    </div>
  );
};

export default Dashboard;
