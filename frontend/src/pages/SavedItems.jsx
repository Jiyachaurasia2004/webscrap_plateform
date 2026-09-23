import { useEffect, useState } from "react";
import {
  Bookmark,
  ExternalLink,
  Trash2,
  LoaderCircle,
} from "lucide-react";

import api from "../services/api";

const SavedItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");

  const fetchSavedItems = async () => {
    try {
      setLoading(true);

      const response = await api.get("/saved");

      if (response.data.success) {
        setItems(response.data.data);
      }
    } catch (error) {
      console.error("Saved Items Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedItems();
  }, []);

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);

      const response = await api.delete(
        `/saved/${id}`
      );

      if (response.data.success) {
        setItems((prev) =>
          prev.filter((item) => item._id !== id)
        );
      }
    } catch (error) {
      console.error("Delete Saved Item Error:", error);
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-5 md:p-8">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
              <Bookmark
                size={22}
                className="text-blue-600"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Saved Items
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Your saved web search results
              </p>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <LoaderCircle
              className="animate-spin mx-auto text-blue-600"
              size={30}
            />

            <p className="text-slate-500 mt-3">
              Loading saved items...
            </p>
          </div>
        ) : items.length === 0 ? (
          /* Empty */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">

            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto">
              <Bookmark
                size={28}
                className="text-slate-400"
              />
            </div>

            <h2 className="text-lg font-semibold text-slate-800 mt-5">
              No saved items
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Save useful search results and they will
              appear here.
            </p>

          </div>
        ) : (
          /* Items */
          <div className="space-y-4">

            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition"
              >

                <div className="flex gap-4">

                  {item.thumbnail && (
                    <img
                      src={item.thumbnail}
                      alt=""
                      className="w-20 h-20 object-cover rounded-xl hidden sm:block shrink-0"
                    />
                  )}

                  <div className="flex-1 min-w-0">

                    <div className="flex items-start justify-between gap-4">

                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold text-blue-600 hover:underline"
                      >
                        {item.title}
                      </a>

                      <ExternalLink
                        size={17}
                        className="text-slate-400 shrink-0"
                      />

                    </div>

                    <p className="text-sm text-green-700 mt-1 break-all">
                      {item.displayedLink ||
                        item.link}
                    </p>

                    <p className="text-sm text-slate-600 mt-2 leading-6">
                      {item.snippet ||
                        "No description available."}
                    </p>

                    <div className="flex items-center gap-3 mt-4">

                      <button
                        onClick={() =>
                          handleDelete(item._id)
                        }
                        disabled={
                          deletingId === item._id
                        }
                        className="inline-flex items-center gap-2
                        px-3 py-2 rounded-lg
                        bg-red-50 text-red-600
                        hover:bg-red-100
                        disabled:opacity-50
                        text-sm font-medium"
                      >
                        <Trash2 size={16} />

                        {deletingId === item._id
                          ? "Removing..."
                          : "Remove"}
                      </button>

                    </div>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default SavedItems;