import { useEffect, useState } from "react";

import {
  History,
  Search,
  Trash2,
  LoaderCircle,
} from "lucide-react";

import api from "../services/api";

const SearchHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const response = await api.get("/history");

      if (response.data.success) {
        setHistory(response.data.data);
      }
    } catch (error) {
      console.error("History Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this search history?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/history/${id}`);

      setHistory((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">

          <LoaderCircle
            size={40}
            className="animate-spin text-blue-600 mx-auto"
          />

          <p className="text-slate-500 mt-4">
            Loading search history...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">

      <header className="bg-white border-b border-slate-200">

        <div className="max-w-7xl mx-auto px-5 md:px-8 py-5">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <History size={22} />
            </div>

            <div>

              <h1 className="text-2xl font-bold text-slate-900">
                Search History
              </h1>

              <p className="text-sm text-slate-500">
                View your previous searches
              </p>

            </div>

          </div>

        </div>

      </header>

      <main className="max-w-5xl mx-auto px-5 md:px-8 py-8">

        {history.length === 0 ? (

          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">

            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto">

              <History
                size={28}
                className="text-slate-400"
              />

            </div>

            <h2 className="text-xl font-bold text-slate-800 mt-5">
              No Search History
            </h2>

            <p className="text-slate-500 mt-2">
              Your searches will appear here.
            </p>

          </div>

        ) : (

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

            <div className="divide-y divide-slate-100">

              {history.map((item) => (

                <div
                  key={item._id}
                  className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition"
                >

                  <div className="flex items-center gap-4 min-w-0">

                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                      <Search size={18} />
                    </div>

                    <div className="min-w-0">

                      <p className="font-semibold text-slate-800 truncate">
                        {item.query}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        {item.resultCount} results •{" "}
                        {new Date(
                          item.createdAt
                        ).toLocaleString()}
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={() =>
                      handleDelete(item._id)
                    }
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              ))}

            </div>

          </div>

        )}

      </main>

    </div>
  );
};

export default SearchHistory;