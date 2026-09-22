import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Database,
  History,
  Download,
  ExternalLink,
  LoaderCircle,
  TrendingUp,
  Globe,
  FileText,
  Clock,
  LayoutDashboard,
  Bookmark,
  Settings,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Dashboard = () => {
  const { user, logout } = useAuth();
const [stats, setStats] = useState({
  totalSearches: 0,
  scrapedRecords: 0,
  searchHistory: 0,
  savedItems: 0,
});
const [analytics, setAnalytics] = useState({
  totalSearches: 0,
  totalScraped: 0,
  recentSearches: [],
  recentScraped: [],
  dailySearches: [],
});

const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const [scrapingUrl, setScrapingUrl] = useState("");
const [scrapedData, setScrapedData] = useState(null);
const [scrapeMessage, setScrapeMessage] = useState("");
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const response = await api.post("/search", {
        query: query.trim(),
      });

      if (response.data.success) {
        setResults(response.data.results);
        
      }
    
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to search. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
const handleScrape = async (url) => {
  setScrapingUrl(url);
  setScrapeMessage("");
  setScrapedData(null);

  try {
    const response = await api.post("/scraper", {
      url,
    });

    if (response.data.success) {
      setScrapedData(response.data.data);

      setScrapeMessage(
        "Website scraped and saved successfully!"
      );
    }
  } catch (error) {
    console.error(error);

    setScrapeMessage(
      error.response?.data?.message ||
        "Scraping failed. Please try another public webpage."
    );
      await fetchAnalytics();
  } finally {
    setScrapingUrl("");
  }
};
const fetchStats = async () => {
  try {
    const [historyResponse, scrapedResponse] =
      await Promise.all([
        api.get("/history"),
        api.get("/scraper"),
      ]);

    setStats({
      totalSearches:
        historyResponse.data.count || 0,

      scrapedRecords:
        scrapedResponse.data.count || 0,

      searchHistory:
        historyResponse.data.count || 0,

      savedItems: 0,
    });
  } catch (error) {
    console.error("Stats Error:", error);
  }
};
const fetchAnalytics = async () => {
  try {
    setAnalyticsLoading(true);

    const response = await api.get("/analytics");

    if (response.data.success) {
      setAnalytics(response.data.data);
    }
  } catch (error) {
    console.error("Analytics error:", error);
  } finally {
    setAnalyticsLoading(false);
  }
};
useEffect(() => {
  fetchAnalytics();
}, []);
  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* ================= SIDEBAR ================= */}

      <aside className="hidden md:flex w-64 shrink-0 bg-slate-950 text-white flex-col">

        {/* Logo */}

        <div className="p-6 border-b border-slate-800">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Search size={22} />
            </div>

            <div>
              <h1 className="font-bold text-lg">
                WebScrape
              </h1>

              <p className="text-xs text-slate-400">
                Search Platform
              </p>
            </div>

          </div>

        </div>

        {/* Navigation */}

        <nav className="flex-1 p-4 space-y-2">

          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
            bg-blue-600 text-white font-medium"
          >
            <LayoutDashboard size={19} />
            Dashboard
          </button>

          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
            text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <Search size={19} />
            Search Web
          </button>

        <Link
  to="/scraped-data"
  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
  text-slate-300 hover:bg-slate-800 hover:text-white transition"
>
  <Database size={19} />
  Scraped Data
</Link>
         <Link
  to="/search-history"
  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
  text-slate-300 hover:bg-slate-800 hover:text-white transition"
>
  <History size={19} />
  Search History
</Link>

          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
            text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <Bookmark size={19} />
            Saved Items
          </button>

          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
            text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <Settings size={19} />
            Settings
          </button>

        </nav>

        {/* User */}

        <div className="p-4 border-t border-slate-800">

          <div className="flex items-center gap-3 mb-4">

            <div className="w-10 h-10 shrink-0 rounded-full bg-blue-600 flex items-center justify-center">
              <User size={19} />
            </div>

            <div className="min-w-0">

              <p className="font-medium truncate">
                {user?.name}
              </p>

              <p className="text-xs text-slate-400 truncate">
                {user?.email}
              </p>

            </div>

          </div>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
            text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut size={19} />
            Logout
          </button>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="flex-1 min-w-0">

        {/* TOPBAR */}

        <header className="bg-white border-b border-slate-200 px-5 md:px-8 py-4">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <button className="md:hidden p-2 rounded-lg hover:bg-slate-100">
                <Menu size={22} />
              </button>

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Dashboard
                </h2>

                <p className="text-sm text-slate-500">
                  Welcome back, {user?.name}
                </p>

              </div>

            </div>

            <div className="hidden sm:flex w-10 h-10 rounded-full bg-blue-100 items-center justify-center">
              <User
                className="text-blue-600"
                size={19}
              />
            </div>

          </div>

        </header>

        {/* CONTENT */}

        <section className="p-5 md:p-8 max-w-7xl mx-auto">

          {/* ================= SEARCH HERO ================= */}

          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-600
            rounded-3xl p-6 md:p-8 mb-8 shadow-lg"
          >

            <div className="max-w-4xl">

              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Search the Web
              </h1>

              <p className="text-blue-100 mt-2 mb-6">
                Search the web and discover useful public information
                from multiple sources.
              </p>

              {/* SEARCH FORM */}

              <form
                onSubmit={handleSearch}
                className="w-full bg-white rounded-2xl p-2
                flex items-center shadow-xl"
              >

                <Search
                  className="text-slate-400 ml-3 shrink-0"
                  size={21}
                />

                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search anything..."
                  className="flex-1 min-w-0 px-4 py-3
                  text-slate-800 bg-transparent outline-none"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="shrink-0 bg-blue-600 hover:bg-blue-700
                  disabled:bg-blue-400 text-white
                  px-5 md:px-7 py-3 rounded-xl
                  font-semibold transition"
                >
                  {loading ? "Searching..." : "Search"}
                </button>

              </form>

            </div>

          </div>

          {/* ================= ERROR ================= */}

          {error && (
            <div
              className="mb-6 bg-red-50 border border-red-200
              text-red-600 rounded-xl px-5 py-4"
            >
              {error}
            </div>
          )}

          {/* ================= SEARCH RESULTS ================= */}

          {results.length > 0 && (

            <div
              className="bg-white rounded-2xl border
              border-slate-200 mb-8 overflow-hidden"
            >

              {/* Result Header */}

              <div className="px-6 py-5 border-b border-slate-200">

                <h3 className="font-bold text-lg text-slate-900">
                  Search Results
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Results for "{query}"
                </p>

              </div>

              {/* Results */}

            <div className="divide-y divide-slate-100">

  {results.map((result, index) => (

    <div
      key={`${result.position}-${index}`}
      className="p-5 md:p-6 hover:bg-slate-50 transition"
    >

      <div className="flex gap-4">

        {/* Thumbnail */}

        {result.thumbnail && (
          <img
            src={result.thumbnail}
            alt=""
            className="w-20 h-20 object-cover
            rounded-xl hidden sm:block shrink-0"
          />
        )}

        {/* Content */}

        <div className="flex-1 min-w-0">

          <div className="flex items-start justify-between gap-3">

            <a
              href={result.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg md:text-xl
              font-semibold text-blue-600
              hover:underline"
            >
              {result.title}
            </a>

            <ExternalLink
              size={17}
              className="text-slate-400 shrink-0 mt-1"
            />

          </div>

          <p
            className="text-sm text-green-700
            mt-1 break-all"
          >
            {result.displayedLink || result.link}
          </p>

          <p
            className="text-sm text-slate-600
            mt-2 leading-6"
          >
            {result.snippet}
          </p>

          {/* SCRAPE BUTTON */}

          <button
            onClick={() => handleScrape(result.link)}
            disabled={scrapingUrl === result.link}
            className="mt-4 inline-flex items-center gap-2
            bg-emerald-600 hover:bg-emerald-700
            disabled:bg-emerald-400
            text-white px-4 py-2 rounded-lg
            text-sm font-semibold transition"
          >
            {scrapingUrl === result.link
              ? "Scraping..."
              : "Scrape Data"}
          </button>

        </div>

      </div>

    </div>

  ))}

</div>

            </div>

          )}
{scrapeMessage && (
  <div className="mb-6">
    <div
      className={`rounded-xl px-5 py-4 ${
        scrapedData
          ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
          : "bg-red-50 border border-red-200 text-red-600"
      }`}
    >
      {scrapeMessage}
    </div>
  </div>
)}

{scrapedData && (
  <div className="bg-white rounded-2xl border border-slate-200 mb-8 overflow-hidden">

    <div className="px-6 py-5 border-b border-slate-200">

      <div className="flex items-center justify-between gap-4">

        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Scraped Data
          </h3>

          <p className="text-sm text-slate-500 mt-1 break-all">
            {scrapedData.url}
          </p>
        </div>

      </div>

    </div>

    <div className="p-6 space-y-6">

      {/* TITLE */}

      <div>
        <h4 className="text-sm font-semibold text-slate-500 mb-2">
          Page Title
        </h4>

        <p className="text-lg font-semibold text-slate-900">
          {scrapedData.title || "No title found"}
        </p>
      </div>

      {/* DESCRIPTION */}

      <div>
        <h4 className="text-sm font-semibold text-slate-500 mb-2">
          Description
        </h4>

        <p className="text-slate-700 leading-6">
          {scrapedData.description ||
            "No description found"}
        </p>
      </div>

      {/* HEADINGS */}

      <div>
        <h4 className="text-sm font-semibold text-slate-500 mb-3">
          Headings
        </h4>

        <div className="space-y-2">

          {scrapedData.headings?.slice(0, 10).map(
            (heading, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-lg px-4 py-3 text-slate-700"
              >
                {heading}
              </div>
            )
          )}

        </div>
      </div>

      {/* PARAGRAPHS */}

      <div>
        <h4 className="text-sm font-semibold text-slate-500 mb-3">
          Content
        </h4>

        <div className="max-h-96 overflow-y-auto space-y-3">

          {scrapedData.paragraphs
            ?.slice(0, 20)
            .map((paragraph, index) => (
              <p
                key={index}
                className="text-sm text-slate-600 leading-6"
              >
                {paragraph}
              </p>
            ))}

        </div>
      </div>

      {/* LINKS */}

      <div>
        <h4 className="text-sm font-semibold text-slate-500 mb-3">
          Links Found
        </h4>

        <p className="text-slate-700">
          {scrapedData.links?.length || 0} links
        </p>
      </div>

      {/* IMAGES */}

      <div>
        <h4 className="text-sm font-semibold text-slate-500 mb-3">
          Images Found
        </h4>

        <p className="text-slate-700">
          {scrapedData.images?.length || 0} images
        </p>
      </div>

    </div>

  </div>
)}
          {/* ================= STATS ================= */}

         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

  {/* Searches */}
  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">
          Total Searches
        </p>

        <h3 className="text-3xl font-bold text-slate-900 mt-2">
          {analytics.totalSearches}
        </h3>
      </div>

      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
        <Search className="text-blue-600" size={23} />
      </div>
    </div>

    <div className="flex items-center gap-1 mt-4 text-sm text-blue-600">
      <TrendingUp size={15} />
      Search activity
    </div>
  </div>


  {/* Scraped */}
  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">
          Scraped Records
        </p>

        <h3 className="text-3xl font-bold text-slate-900 mt-2">
          {analytics.totalScraped}
        </h3>
      </div>

      <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
        <Database className="text-emerald-600" size={23} />
      </div>
    </div>

    <div className="flex items-center gap-1 mt-4 text-sm text-emerald-600">
      <Globe size={15} />
      Websites collected
    </div>
  </div>


  {/* Recent searches */}
  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">
          Recent Searches
        </p>

        <h3 className="text-3xl font-bold text-slate-900 mt-2">
          {analytics.recentSearches.length}
        </h3>
      </div>

      <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
        <History className="text-purple-600" size={23} />
      </div>
    </div>

    <p className="text-sm text-slate-500 mt-4">
      Latest search activity
    </p>
  </div>


  {/* Scraped websites */}
  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">
          Recent Websites
        </p>

        <h3 className="text-3xl font-bold text-slate-900 mt-2">
          {analytics.recentScraped.length}
        </h3>
      </div>

      <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
        <Globe className="text-orange-600" size={23} />
      </div>
    </div>

    <p className="text-sm text-slate-500 mt-4">
      Recently scraped pages
    </p>
  </div>

</div>
<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">

  {/* Recent Searches */}
  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">

    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Recent Searches
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Your latest search queries
        </p>
      </div>

      <History size={20} className="text-slate-400" />
    </div>

    <div className="divide-y divide-slate-100">

      {analytics.recentSearches.length === 0 ? (
        <div className="p-8 text-center text-slate-500">
          No searches yet.
        </div>
      ) : (
        analytics.recentSearches.map((item) => (
          <div
            key={item._id}
            className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50"
          >

            <div className="flex items-center gap-3 min-w-0">

              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <Search
                  size={17}
                  className="text-blue-600"
                />
              </div>

              <div className="min-w-0">
                <p className="font-medium text-slate-800 truncate">
                  {item.query}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  {item.resultCount} results
                </p>
              </div>

            </div>

            <span className="text-xs text-slate-400 shrink-0">
              {new Date(
                item.searchedAt || item.createdAt
              ).toLocaleDateString()}
            </span>

          </div>
        ))
      )}

    </div>
  </div>


  {/* Recent Scraped */}
  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">

    <div className="p-5 border-b border-slate-100">
      <h2 className="text-lg font-bold text-slate-900">
        Recent Scraped Websites
      </h2>

      <p className="text-sm text-slate-500 mt-1">
        Recently collected web data
      </p>
    </div>

    <div className="divide-y divide-slate-100">

      {analytics.recentScraped.length === 0 ? (
        <div className="p-8 text-center text-slate-500">
          No scraped websites yet.
        </div>
      ) : (
        analytics.recentScraped.map((item) => (
          <div
            key={item._id}
            className="p-4 hover:bg-slate-50"
          >

            <div className="flex gap-3">

              <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                <FileText
                  size={17}
                  className="text-emerald-600"
                />
              </div>

              <div className="min-w-0 flex-1">

                <p className="font-medium text-slate-800 truncate">
                  {item.title || "Untitled Page"}
                </p>

                <p className="text-xs text-slate-500 mt-1 truncate">
                  {item.url}
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  {new Date(
                    item.scrapedAt || item.createdAt
                  ).toLocaleDateString()}
                </p>

              </div>

            </div>

          </div>
        ))
      )}

    </div>
  </div>

</div>
          {/* ================= RECENT ACTIVITY ================= */}

          <div
            className="bg-white rounded-2xl
            border border-slate-200 overflow-hidden"
          >

            <div className="px-6 py-5 border-b border-slate-200">

              <h3 className="font-bold text-lg text-slate-900">
                Recent Activity
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Your latest searches and scraped data will
                appear here.
              </p>

            </div>

            <div className="p-10 text-center">

              <div
                className="w-14 h-14 bg-slate-100 rounded-2xl
                flex items-center justify-center mx-auto mb-4"
              >

                <History
                  size={25}
                  className="text-slate-400"
                />

              </div>

              <h4 className="font-semibold text-slate-800">
                No activity yet
              </h4>

              <p className="text-sm text-slate-500 mt-2">
                Start by searching something from the
                search box above.
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
};


/* ================= STAT CARD ================= */

const StatCard = ({ icon, title, value }) => {

  return (

    <div
      className="bg-white border border-slate-200
      rounded-2xl p-5 hover:shadow-md transition"
    >

      <div className="flex items-center justify-between mb-5">

        <div
          className="w-11 h-11 bg-blue-50 text-blue-600
          rounded-xl flex items-center justify-center"
        >
          {icon}
        </div>

        <span className="text-xs text-slate-400">
          All Time
        </span>

      </div>

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-1">
        {value}
      </h3>

    </div>

  );
};

export default Dashboard;