import { useEffect, useState } from "react";

import {
  Database,
  Trash2,
  ExternalLink,
  FileText,
  Image,
  Link as LinkIcon,
  Heading,
  LoaderCircle,
  Download,
  FileJson,
  FileSpreadsheet,
} from "lucide-react";

import api from "../services/api";

const ScrapedData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchScrapedData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/scraper");

      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load scraped data"
      );
    } finally {
      setLoading(false);
    }
  };
  const downloadFile = async (type) => {
  try {
    const response = await api.get(
      `/export/${type}`,
      {
        responseType: "blob",
      }
    );

    const blob = new Blob(
      [response.data],
      {
        type:
          type === "json"
            ? "application/json"
            : "text/csv",
      }
    );

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download =
      type === "json"
        ? "scraped-data.json"
        : "scraped-data.csv";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download Error:", error);

    alert("Failed to download file");
  }
};
  useEffect(() => {
    fetchScrapedData();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this scraped data?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/scraper/${id}`);

      setData((previousData) =>
        previousData.filter((item) => item._id !== id)
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete data"
      );
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
            Loading scraped data...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">

      {/* HEADER */}

      <header className="bg-white border-b border-slate-200">

        <div className="max-w-7xl mx-auto px-5 md:px-8 py-5">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">

  <button
    onClick={() => downloadFile("json")}
    disabled={data.length === 0}
    className="flex items-center gap-2
    px-4 py-2 rounded-xl
    bg-slate-900 text-white
    hover:bg-slate-800
    disabled:bg-slate-300
    disabled:cursor-not-allowed
    text-sm font-semibold transition"
  >
    <FileJson size={17} />

    JSON
  </button>

  <button
    onClick={() => downloadFile("csv")}
    disabled={data.length === 0}
    className="flex items-center gap-2
    px-4 py-2 rounded-xl
    bg-emerald-600 text-white
    hover:bg-emerald-700
    disabled:bg-emerald-300
    disabled:cursor-not-allowed
    text-sm font-semibold transition"
  >
    <FileSpreadsheet size={17} />

    CSV
  </button>

</div>

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <Database size={22} />
              </div>

              <div>

                <h1 className="text-2xl font-bold text-slate-900">
                  Scraped Data
                </h1>

                <p className="text-sm text-slate-500">
                  Manage your scraped web data
                </p>

              </div>

            </div>

            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold">
              {data.length} Records
            </div>

          </div>

        </div>

      </header>

      {/* CONTENT */}

      <main className="max-w-7xl mx-auto px-5 md:px-8 py-8">

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-4">
            {error}
          </div>
        )}

        {data.length === 0 ? (

          /* EMPTY STATE */

          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">

            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto">

              <Database
                size={28}
                className="text-slate-400"
              />

            </div>

            <h2 className="text-xl font-bold text-slate-800 mt-5">
              No Scraped Data
            </h2>

            <p className="text-slate-500 mt-2 max-w-md mx-auto">
              Search the web and scrape a public webpage.
              Your saved data will appear here.
            </p>

          </div>

        ) : (

          /* DATA LIST */

          <div className="space-y-5">

            {data.map((item) => (

              <div
                key={item._id}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition"
              >

                {/* TOP */}

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                  <div className="flex-1 min-w-0">

                    <h2 className="text-xl font-bold text-slate-900">
                      {item.title || "Untitled Page"}
                    </h2>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline break-all mt-2 inline-flex items-center gap-1"
                    >
                      {item.url}

                      <ExternalLink size={14} />
                    </a>

                  </div>

                  <button
                    onClick={() =>
                      handleDelete(item._id)
                    }
                    className="w-fit flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                  >
                    <Trash2 size={17} />
                    Delete
                  </button>

                </div>

                {/* DESCRIPTION */}

                {item.description && (
                  <p className="text-slate-600 mt-4 leading-6">
                    {item.description}
                  </p>
                )}

                {/* STATS */}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">

                  <DataStat
                    icon={<Heading size={17} />}
                    label="Headings"
                    value={item.headings?.length || 0}
                  />

                  <DataStat
                    icon={<FileText size={17} />}
                    label="Paragraphs"
                    value={item.paragraphs?.length || 0}
                  />

                  <DataStat
                    icon={<LinkIcon size={17} />}
                    label="Links"
                    value={item.links?.length || 0}
                  />

                  <DataStat
                    icon={<Image size={17} />}
                    label="Images"
                    value={item.images?.length || 0}
                  />

                </div>

                {/* HEADINGS */}

                {item.headings?.length > 0 && (
                  <div className="mt-6">

                    <h3 className="font-semibold text-slate-800 mb-3">
                      Headings
                    </h3>

                    <div className="flex flex-wrap gap-2">

                      {item.headings
                        .slice(0, 10)
                        .map((heading, index) => (

                          <span
                            key={index}
                            className="bg-slate-100 text-slate-700 px-3 py-2 rounded-lg text-sm"
                          >
                            {heading}
                          </span>

                        ))}

                    </div>

                  </div>
                )}

                {/* DATE */}

                <div className="mt-6 pt-4 border-t border-slate-100">

                  <p className="text-xs text-slate-400">
                    Scraped on{" "}
                    {new Date(
                      item.createdAt
                    ).toLocaleString()}
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
};

const DataStat = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="bg-slate-50 rounded-xl p-4">

      <div className="flex items-center gap-2 text-blue-600">
        {icon}

        <span className="text-sm font-medium">
          {label}
        </span>
      </div>

      <p className="text-xl font-bold text-slate-900 mt-2">
        {value}
      </p>

    </div>
  );
};

export default ScrapedData;