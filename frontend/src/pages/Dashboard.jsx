import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Search,
  Database,
  History,
  ExternalLink,
  TrendingUp,
  Globe,
  FileText,
  LayoutDashboard,
  Bookmark,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  LoaderCircle,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Dashboard = () => {
  const { user, logout } = useAuth();

  // =========================
  // SIDEBAR
  // =========================

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =========================
  // SEARCH
  // =========================

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // SCRAPER
  // =========================

  const [scrapingUrl, setScrapingUrl] = useState("");
  const [scrapedData, setScrapedData] = useState(null);
  const [scrapeMessage, setScrapeMessage] = useState("");

  // =========================
  // SAVE ITEM
  // =========================

  const [savingUrl, setSavingUrl] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  // =========================
  // ANALYTICS
  // =========================

  const [analytics, setAnalytics] = useState({
    totalSearches: 0,
    totalScraped: 0,
    recentSearches: [],
    recentScraped: [],
    dailySearches: [],
  });

  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  // =========================
  // FETCH ANALYTICS
  // =========================

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);

      const response = await api.get("/analytics");

      if (response.data.success) {
        setAnalytics(response.data.data);
      }
    } catch (error) {
      console.error("Analytics Error:", error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // =========================
  // SEARCH WEB
  // =========================

  const handleSearch = async (e) => {
    e.preventDefault();

    const cleanQuery = query.trim();

    if (!cleanQuery) {
      setError("Please enter something to search.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResults([]);
      setScrapedData(null);
      setScrapeMessage("");
      setSaveMessage("");

      const response = await api.post("/search", {
        query: cleanQuery,
      });

      if (response.data.success) {
        setResults(response.data.results || []);

        // Refresh analytics
        await fetchAnalytics();
      }
    } catch (error) {
      console.error("Search Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to search. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SCRAPE WEBSITE
  // =========================

  const handleScrape = async (url) => {
    try {
      setScrapingUrl(url);
      setScrapeMessage("");
      setScrapedData(null);

      const response = await api.post("/scraper", {
        url,
      });

      if (response.data.success) {
        setScrapedData(response.data.data);

        setScrapeMessage(
          "Website scraped and saved successfully!"
        );

        // Refresh analytics
        await fetchAnalytics();
      }
    } catch (error) {
      console.error("Scraping Error:", error);

      setScrapeMessage(
        error.response?.data?.message ||
          "Scraping failed. Please try another public webpage."
      );
    } finally {
      setScrapingUrl("");
    }
  };

  // =========================
  // SAVE SEARCH RESULT
  // =========================

  const handleSaveItem = async (result) => {
    try {
      setSavingUrl(result.link);
      setSaveMessage("");

      const response = await api.post("/saved", {
        title: result.title,
        link: result.link,
        displayedLink: result.displayedLink,
        snippet: result.snippet,
        thumbnail: result.thumbnail,
        sourceQuery: query,
      });

      if (response.data.success) {
        setSaveMessage("Item saved successfully!");
      }
    } catch (error) {
      console.error("Save Item Error:", error);

      setSaveMessage(
        error.response?.data?.message ||
          "Unable to save item."
      );
    } finally {
      setSavingUrl("");
    }
  };

  // =========================
  // CLOSE MOBILE SIDEBAR
  // =========================

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // =========================
  // SEARCH WEB FROM SIDEBAR
  // =========================

  const goToSearch = () => {
    closeSidebar();

    setTimeout(() => {
      document
        .getElementById("web-search")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 200);
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    closeSidebar();
    logout();
  };

  // =========================
  // LOAD ANALYTICS
  // =========================

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // =========================
  // PREVENT BODY SCROLL
  // WHEN MOBILE SIDEBAR OPEN
  // =========================

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="h-screen bg-slate-100 flex overflow-hidden">

      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}

      <aside
        className="
          hidden md:flex
          w-64 h-screen shrink-0
          bg-slate-950 text-white
          flex-col overflow-hidden
        "
      >

        {/* LOGO */}

        <div className="p-6 border-b border-slate-800">

          <div className="flex items-center gap-3">

            <div
              className="
                w-10 h-10
                bg-blue-600
                rounded-xl
                flex items-center justify-center
                shrink-0
              "
            >
              <Search size={22} />
            </div>

            <div className="min-w-0">

              <h1 className="font-bold text-lg">
                WebScrape
              </h1>

              <p className="text-xs text-slate-400">
                Search Platform
              </p>

            </div>

          </div>

        </div>


        {/* NAVIGATION */}

        <nav className="flex-1 p-4 space-y-2 overflow-hidden">

          {/* Dashboard */}

          <button
            className="
              w-full
              flex items-center gap-3
              px-4 py-3
              rounded-xl
              bg-blue-600
              text-white
              font-medium
            "
          >
            <LayoutDashboard size={19} />
            Dashboard
          </button>


          {/* Search Web */}

          <button
            onClick={goToSearch}
            className="
              w-full
              flex items-center gap-3
              px-4 py-3
              rounded-xl
              text-slate-300
              hover:bg-slate-800
              hover:text-white
              transition
            "
          >
            <Search size={19} />
            Search Web
          </button>


          {/* Scraped Data */}

          <Link
            to="/scraped-data"
            className="
              w-full
              flex items-center gap-3
              px-4 py-3
              rounded-xl
              text-slate-300
              hover:bg-slate-800
              hover:text-white
              transition
            "
          >
            <Database size={19} />
            Scraped Data
          </Link>


          {/* Search History */}

          <Link
            to="/search-history"
            className="
              w-full
              flex items-center gap-3
              px-4 py-3
              rounded-xl
              text-slate-300
              hover:bg-slate-800
              hover:text-white
              transition
            "
          >
            <History size={19} />
            Search History
          </Link>


          {/* Saved Items */}

          <Link
            to="/saved-items"
            className="
              w-full
              flex items-center gap-3
              px-4 py-3
              rounded-xl
              text-slate-300
              hover:bg-slate-800
              hover:text-white
              transition
            "
          >
            <Bookmark size={19} />
            Saved Items
          </Link>


          {/* Settings */}

          <Link
            to="/settings"
            className="
              w-full
              flex items-center gap-3
              px-4 py-3
              rounded-xl
              text-slate-300
              hover:bg-slate-800
              hover:text-white
              transition
            "
          >
            <Settings size={19} />
            Settings
          </Link>

        </nav>


        {/* USER AREA */}

        <div className="p-4 border-t border-slate-800">

          <div className="flex items-center gap-3 mb-4">

            <div
              className="
                w-10 h-10
                shrink-0
                rounded-full
                bg-blue-600
                flex items-center justify-center
              "
            >
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
            onClick={handleLogout}
            className="
              w-full
              flex items-center gap-3
              px-4 py-3
              rounded-xl
              text-red-400
              hover:bg-red-500/10
              transition
            "
          >
            <LogOut size={19} />
            Logout
          </button>

        </div>

      </aside>


      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}

      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="
            fixed inset-0
            bg-black/60
            z-40
            md:hidden
          "
        />
      )}


      {/* =====================================================
          MOBILE SIDEBAR
      ====================================================== */}

      <aside
        className={`
          fixed
          top-0
          left-0
          z-50
          h-screen
          w-72
          max-w-[85vw]
          bg-slate-950
          text-white
          flex
          flex-col
          md:hidden
          transition-transform
          duration-300
          ease-in-out
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* MOBILE LOGO */}

        <div className="p-5 border-b border-slate-800">

          <div className="flex items-center justify-between gap-3">

            <div className="flex items-center gap-3 min-w-0">

              <div
                className="
                  w-10 h-10
                  bg-blue-600
                  rounded-xl
                  flex items-center justify-center
                  shrink-0
                "
              >
                <Search size={22} />
              </div>

              <div className="min-w-0">

                <h1 className="font-bold text-lg">
                  WebScrape
                </h1>

                <p className="text-xs text-slate-400">
                  Search Platform
                </p>

              </div>

            </div>


            {/* CLOSE */}

            <button
              onClick={closeSidebar}
              className="
                p-2
                rounded-lg
                text-slate-400
                hover:text-white
                hover:bg-slate-800
                transition
                shrink-0
              "
              aria-label="Close sidebar"
            >
              <X size={22} />
            </button>

          </div>

        </div>


        {/* MOBILE NAV */}

        <nav className="flex-1 p-4 space-y-2 overflow-hidden">

          {/* Dashboard */}

          <button
            onClick={closeSidebar}
            className="
              w-full
              flex items-center gap-3
              px-4 py-3
              rounded-xl
              bg-blue-600
              text-white
              font-medium
            "
          >
            <LayoutDashboard size={19} />
            Dashboard
          </button>


          {/* Search Web */}

          <button
            onClick={goToSearch}
            className="
              w-full
              flex items-center gap-3
              px-4 py-3
              rounded-xl
              text-slate-300
              hover:bg-slate-800
              hover:text-white
              transition
            "
          >
            <Search size={19} />
            Search Web
          </button>


          {/* Scraped Data */}

          <Link
            to="/scraped-data"
            onClick={closeSidebar}
            className="
              w-full
              flex items-center gap-3
              px-4 py-3
              rounded-xl
              text-slate-300
              hover:bg-slate-800
              hover:text-white
              transition
            "
          >
            <Database size={19} />
            Scraped Data
          </Link>


          {/* Search History */}

          <Link
            to="/search-history"
            onClick={closeSidebar}
            className="
              w-full
              flex items-center gap-3
              px-4 py-3
              rounded-xl
              text-slate-300
              hover:bg-slate-800
              hover:text-white
              transition
            "
          >
            <History size={19} />
            Search History
          </Link>


          {/* Saved Items */}

          <Link
            to="/saved-items"
            onClick={closeSidebar}
            className="
              w-full
              flex items-center gap-3
              px-4 py-3
              rounded-xl
              text-slate-300
              hover:bg-slate-800
              hover:text-white
              transition
            "
          >
            <Bookmark size={19} />
            Saved Items
          </Link>


          {/* Settings */}

          <Link
            to="/settings"
            onClick={closeSidebar}
            className="
              w-full
              flex items-center gap-3
              px-4 py-3
              rounded-xl
              text-slate-300
              hover:bg-slate-800
              hover:text-white
              transition
            "
          >
            <Settings size={19} />
            Settings
          </Link>

        </nav>


        {/* MOBILE USER */}

        <div className="p-4 border-t border-slate-800">

          <div className="flex items-center gap-3 mb-4">

            <div
              className="
                w-10 h-10
                rounded-full
                bg-blue-600
                flex items-center justify-center
                shrink-0
              "
            >
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
            onClick={handleLogout}
            className="
              w-full
              flex items-center gap-3
              px-4 py-3
              rounded-xl
              text-red-400
              hover:bg-red-500/10
              transition
            "
          >
            <LogOut size={19} />
            Logout
          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN
      ====================================================== */}

      <main
        className="
          flex-1
          min-w-0
          h-screen
          overflow-y-auto
          overflow-x-hidden
        "
      >

        {/* =================================================
            TOPBAR
        ================================================== */}

        <header
          className="
            sticky
            top-0
            z-30
            bg-white
            border-b
            border-slate-200
            px-4
            sm:px-5
            md:px-8
            py-3
            sm:py-4
          "
        >

          <div className="flex items-center justify-between gap-3">

            <div className="flex items-center gap-2 sm:gap-3 min-w-0">

              {/* MOBILE MENU */}

              <button
                onClick={() => setSidebarOpen(true)}
                className="
                  md:hidden
                  p-2
                  rounded-lg
                  text-slate-700
                  hover:bg-slate-100
                  transition
                  shrink-0
                "
                aria-label="Open sidebar"
              >
                <Menu size={22} />
              </button>


              <div className="min-w-0">

                <h2
                  className="
                    text-lg
                    sm:text-xl
                    font-bold
                    text-slate-900
                  "
                >
                  Dashboard
                </h2>

                <p
                  className="
                    text-xs
                    sm:text-sm
                    text-slate-500
                    truncate
                    max-w-[220px]
                    sm:max-w-none
                  "
                >
                  Welcome back, {user?.name}
                </p>

              </div>

            </div>


            {/* USER ICON */}

            <div
              className="
                hidden
                sm:flex
                w-10
                h-10
                rounded-full
                bg-blue-100
                items-center
                justify-center
                shrink-0
              "
            >
              <User
                className="text-blue-600"
                size={19}
              />
            </div>

          </div>

        </header>


        {/* =================================================
            CONTENT
        ================================================== */}

        <section
          className="
            p-4
            sm:p-5
            md:p-8
            max-w-7xl
            mx-auto
          "
        >

          {/* =================================================
              SEARCH HERO
          ================================================== */}

          <div
            id="web-search"
            className="
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              rounded-2xl
              sm:rounded-3xl
              p-5
              sm:p-6
              md:p-8
              mb-6
              sm:mb-8
              shadow-lg
              scroll-mt-24
            "
          >

            <div className="max-w-4xl">

              <h1
                className="
                  text-2xl
                  sm:text-3xl
                  font-bold
                  text-white
                "
              >
                Search the Web
              </h1>

              <p
                className="
                  text-blue-100
                  text-sm
                  sm:text-base
                  mt-2
                  mb-5
                  sm:mb-6
                "
              >
                Search the web and discover useful
                public information from multiple sources.
              </p>


              {/* SEARCH FORM */}

              <form
                onSubmit={handleSearch}
                className="
                  w-full
                  bg-white
                  rounded-2xl
                  p-2
                  flex
                  items-center
                  shadow-xl
                "
              >

                <Search
                  className="
                    text-slate-400
                    ml-2
                    sm:ml-3
                    shrink-0
                  "
                  size={20}
                />


                <input
                  type="text"
                  value={query}
                  onChange={(e) =>
                    setQuery(e.target.value)
                  }
                  placeholder="Search anything..."
                  className="
                    flex-1
                    min-w-0
                    px-3
                    sm:px-4
                    py-3
                    text-sm
                    sm:text-base
                    text-slate-800
                    bg-transparent
                    outline-none
                  "
                />


                <button
                  type="submit"
                  disabled={loading}
                  className="
                    shrink-0
                    bg-blue-600
                    hover:bg-blue-700
                    disabled:bg-blue-400
                    text-white
                    px-4
                    sm:px-5
                    md:px-7
                    py-3
                    rounded-xl
                    text-sm
                    sm:text-base
                    font-semibold
                    transition
                  "
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <LoaderCircle
                        size={17}
                        className="animate-spin"
                      />
                      <span className="hidden sm:inline">
                        Searching...
                      </span>
                    </span>
                  ) : (
                    "Search"
                  )}
                </button>

              </form>

            </div>

          </div>


          {/* =================================================
              ERROR
          ================================================== */}

          {error && (
            <div
              className="
                mb-6
                bg-red-50
                border
                border-red-200
                text-red-600
                rounded-xl
                px-4
                sm:px-5
                py-4
                text-sm
              "
            >
              {error}
            </div>
          )}


          {/* =================================================
              SAVE MESSAGE
          ================================================== */}

          {saveMessage && (
            <div
              className="
                mb-6
                bg-blue-50
                border
                border-blue-200
                text-blue-700
                rounded-xl
                px-4
                sm:px-5
                py-4
                text-sm
              "
            >
              {saveMessage}
            </div>
          )}


          {/* =================================================
              SEARCH RESULTS
          ================================================== */}

          {results.length > 0 && (
            <div
              className="
                bg-white
                rounded-2xl
                border
                border-slate-200
                mb-8
                overflow-hidden
              "
            >

              {/* HEADER */}

              <div
                className="
                  px-4
                  sm:px-6
                  py-5
                  border-b
                  border-slate-200
                "
              >

                <h3
                  className="
                    font-bold
                    text-lg
                    text-slate-900
                  "
                >
                  Search Results
                </h3>

                <p
                  className="
                    text-sm
                    text-slate-500
                    mt-1
                    break-words
                  "
                >
                  Results for "{query}"
                </p>

              </div>


              {/* RESULTS */}

              <div className="divide-y divide-slate-100">

                {results.map((result, index) => (

                  <div
                    key={`${result.position}-${index}`}
                    className="
                      p-4
                      sm:p-5
                      md:p-6
                      hover:bg-slate-50
                      transition
                    "
                  >

                    <div className="flex gap-3 sm:gap-4">

                      {/* THUMBNAIL */}

                      {result.thumbnail && (
                        <img
                          src={result.thumbnail}
                          alt=""
                          className="
                            w-16
                            h-16
                            sm:w-20
                            sm:h-20
                            object-cover
                            rounded-xl
                            hidden
                            sm:block
                            shrink-0
                          "
                        />
                      )}


                      {/* CONTENT */}

                      <div className="flex-1 min-w-0">

                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-2
                          "
                        >

                          <a
                            href={result.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                              text-base
                              sm:text-lg
                              md:text-xl
                              font-semibold
                              text-blue-600
                              hover:underline
                              break-words
                              min-w-0
                            "
                          >
                            {result.title}
                          </a>

                          <ExternalLink
                            size={17}
                            className="
                              text-slate-400
                              shrink-0
                              mt-1
                            "
                          />

                        </div>


                        {/* URL */}

                        <p
                          className="
                            text-xs
                            sm:text-sm
                            text-green-700
                            mt-1
                            break-all
                          "
                        >
                          {result.displayedLink ||
                            result.link}
                        </p>


                        {/* SNIPPET */}

                        <p
                          className="
                            text-sm
                            text-slate-600
                            mt-2
                            leading-6
                          "
                        >
                          {result.snippet}
                        </p>


                        {/* BUTTONS */}

                        <div
                          className="
                            flex
                            flex-wrap
                            gap-2
                            sm:gap-3
                            mt-4
                          "
                        >

                          {/* SCRAPE */}

                          <button
                            onClick={() =>
                              handleScrape(result.link)
                            }
                            disabled={
                              scrapingUrl === result.link
                            }
                            className="
                              inline-flex
                              items-center
                              gap-2
                              bg-emerald-600
                              hover:bg-emerald-700
                              disabled:bg-emerald-400
                              text-white
                              px-3
                              sm:px-4
                              py-2
                              rounded-lg
                              text-xs
                              sm:text-sm
                              font-semibold
                              transition
                            "
                          >
                            {scrapingUrl === result.link ? (
                              <>
                                <LoaderCircle
                                  size={15}
                                  className="animate-spin"
                                />
                                Scraping...
                              </>
                            ) : (
                              "Scrape Data"
                            )}
                          </button>


                          {/* SAVE */}

                          <button
                            onClick={() =>
                              handleSaveItem(result)
                            }
                            disabled={
                              savingUrl === result.link
                            }
                            className="
                              inline-flex
                              items-center
                              gap-2
                              bg-blue-600
                              hover:bg-blue-700
                              disabled:bg-blue-400
                              text-white
                              px-3
                              sm:px-4
                              py-2
                              rounded-lg
                              text-xs
                              sm:text-sm
                              font-semibold
                              transition
                            "
                          >

                            <Bookmark size={15} />

                            {savingUrl === result.link
                              ? "Saving..."
                              : "Save Item"}

                          </button>

                        </div>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>
          )}


          {/* =================================================
              SCRAPE MESSAGE
          ================================================== */}

          {scrapeMessage && (
            <div className="mb-6">

              <div
                className={`
                  rounded-xl
                  px-4
                  sm:px-5
                  py-4
                  text-sm
                  ${
                    scrapedData
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                      : "bg-red-50 border border-red-200 text-red-600"
                  }
                `}
              >
                {scrapeMessage}
              </div>

            </div>
          )}


          {/* =================================================
              SCRAPED DATA
          ================================================== */}

          {scrapedData && (
            <div
              className="
                bg-white
                rounded-2xl
                border
                border-slate-200
                mb-8
                overflow-hidden
              "
            >

              {/* HEADER */}

              <div
                className="
                  px-4
                  sm:px-6
                  py-5
                  border-b
                  border-slate-200
                "
              >

                <h3
                  className="
                    text-lg
                    sm:text-xl
                    font-bold
                    text-slate-900
                  "
                >
                  Scraped Data
                </h3>

                <p
                  className="
                    text-xs
                    sm:text-sm
                    text-slate-500
                    mt-1
                    break-all
                  "
                >
                  {scrapedData.url}
                </p>

              </div>


              {/* DATA */}

              <div
                className="
                  p-4
                  sm:p-6
                  space-y-6
                "
              >

                {/* TITLE */}

                <div>

                  <h4
                    className="
                      text-sm
                      font-semibold
                      text-slate-500
                      mb-2
                    "
                  >
                    Page Title
                  </h4>

                  <p
                    className="
                      text-base
                      sm:text-lg
                      font-semibold
                      text-slate-900
                      break-words
                    "
                  >
                    {scrapedData.title ||
                      "No title found"}
                  </p>

                </div>


                {/* DESCRIPTION */}

                <div>

                  <h4
                    className="
                      text-sm
                      font-semibold
                      text-slate-500
                      mb-2
                    "
                  >
                    Description
                  </h4>

                  <p
                    className="
                      text-sm
                      sm:text-base
                      text-slate-700
                      leading-6
                    "
                  >
                    {scrapedData.description ||
                      "No description found"}
                  </p>

                </div>


                {/* HEADINGS */}

                <div>

                  <h4
                    className="
                      text-sm
                      font-semibold
                      text-slate-500
                      mb-3
                    "
                  >
                    Headings
                  </h4>

                  <div className="space-y-2">

                    {scrapedData.headings
                      ?.slice(0, 10)
                      .map((heading, index) => (

                        <div
                          key={index}
                          className="
                            bg-slate-50
                            rounded-lg
                            px-4
                            py-3
                            text-sm
                            sm:text-base
                            text-slate-700
                            break-words
                          "
                        >
                          {heading}
                        </div>

                      ))}

                  </div>

                </div>


                {/* PARAGRAPHS */}

                <div>

                  <h4
                    className="
                      text-sm
                      font-semibold
                      text-slate-500
                      mb-3
                    "
                  >
                    Content
                  </h4>

                  <div
                    className="
                      max-h-96
                      overflow-y-auto
                      space-y-3
                      pr-1
                    "
                  >

                    {scrapedData.paragraphs
                      ?.slice(0, 20)
                      .map((paragraph, index) => (

                        <p
                          key={index}
                          className="
                            text-sm
                            text-slate-600
                            leading-6
                          "
                        >
                          {paragraph}
                        </p>

                      ))}

                  </div>

                </div>


                {/* LINKS + IMAGES */}

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    gap-4
                  "
                >

                  <div className="bg-slate-50 rounded-xl p-4">

                    <h4
                      className="
                        text-sm
                        font-semibold
                        text-slate-500
                        mb-2
                      "
                    >
                      Links Found
                    </h4>

                    <p className="text-lg font-bold text-slate-900">
                      {scrapedData.links?.length || 0}
                    </p>

                  </div>


                  <div className="bg-slate-50 rounded-xl p-4">

                    <h4
                      className="
                        text-sm
                        font-semibold
                        text-slate-500
                        mb-2
                      "
                    >
                      Images Found
                    </h4>

                    <p className="text-lg font-bold text-slate-900">
                      {scrapedData.images?.length || 0}
                    </p>

                  </div>

                </div>

              </div>

            </div>
          )}


          {/* =================================================
              ANALYTICS STATS
          ================================================== */}

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              xl:grid-cols-4
              gap-4
              sm:gap-5
            "
          >

            {/* TOTAL SEARCHES */}

            <div
              className="
                bg-white
                border
                border-slate-200
                rounded-2xl
                p-5
                shadow-sm
              "
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Total Searches
                  </p>

                  <h3
                    className="
                      text-3xl
                      font-bold
                      text-slate-900
                      mt-2
                    "
                  >
                    {analyticsLoading
                      ? "..."
                      : analytics.totalSearches}
                  </h3>

                </div>


                <div
                  className="
                    w-12
                    h-12
                    rounded-xl
                    bg-blue-100
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Search
                    className="text-blue-600"
                    size={23}
                  />
                </div>

              </div>


              <div
                className="
                  flex
                  items-center
                  gap-1
                  mt-4
                  text-sm
                  text-blue-600
                "
              >
                <TrendingUp size={15} />
                Search activity
              </div>

            </div>


            {/* SCRAPED RECORDS */}

            <div
              className="
                bg-white
                border
                border-slate-200
                rounded-2xl
                p-5
                shadow-sm
              "
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Scraped Records
                  </p>

                  <h3
                    className="
                      text-3xl
                      font-bold
                      text-slate-900
                      mt-2
                    "
                  >
                    {analyticsLoading
                      ? "..."
                      : analytics.totalScraped}
                  </h3>

                </div>


                <div
                  className="
                    w-12
                    h-12
                    rounded-xl
                    bg-emerald-100
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Database
                    className="text-emerald-600"
                    size={23}
                  />
                </div>

              </div>


              <div
                className="
                  flex
                  items-center
                  gap-1
                  mt-4
                  text-sm
                  text-emerald-600
                "
              >
                <Globe size={15} />
                Websites collected
              </div>

            </div>


            {/* RECENT SEARCHES */}

            <div
              className="
                bg-white
                border
                border-slate-200
                rounded-2xl
                p-5
                shadow-sm
              "
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Recent Searches
                  </p>

                  <h3
                    className="
                      text-3xl
                      font-bold
                      text-slate-900
                      mt-2
                    "
                  >
                    {analyticsLoading
                      ? "..."
                      : analytics.recentSearches.length}
                  </h3>

                </div>


                <div
                  className="
                    w-12
                    h-12
                    rounded-xl
                    bg-purple-100
                    flex
                    items-center
                    justify-center
                  "
                >
                  <History
                    className="text-purple-600"
                    size={23}
                  />
                </div>

              </div>


              <p className="text-sm text-slate-500 mt-4">
                Latest search activity
              </p>

            </div>


            {/* RECENT WEBSITES */}

            <div
              className="
                bg-white
                border
                border-slate-200
                rounded-2xl
                p-5
                shadow-sm
              "
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Recent Websites
                  </p>

                  <h3
                    className="
                      text-3xl
                      font-bold
                      text-slate-900
                      mt-2
                    "
                  >
                    {analyticsLoading
                      ? "..."
                      : analytics.recentScraped.length}
                  </h3>

                </div>


                <div
                  className="
                    w-12
                    h-12
                    rounded-xl
                    bg-orange-100
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Globe
                    className="text-orange-600"
                    size={23}
                  />
                </div>

              </div>


              <p className="text-sm text-slate-500 mt-4">
                Recently scraped pages
              </p>

            </div>

          </div>


          {/* =================================================
              RECENT SEARCH + RECENT SCRAPED
          ================================================== */}

          <div
            className="
              grid
              grid-cols-1
              xl:grid-cols-2
              gap-6
              mt-6
            "
          >

            {/* RECENT SEARCHES */}

            <div
              className="
                bg-white
                border
                border-slate-200
                rounded-2xl
                shadow-sm
                overflow-hidden
              "
            >

              <div
                className="
                  p-5
                  border-b
                  border-slate-100
                  flex
                  items-center
                  justify-between
                "
              >

                <div>

                  <h2
                    className="
                      text-lg
                      font-bold
                      text-slate-900
                    "
                  >
                    Recent Searches
                  </h2>

                  <p
                    className="
                      text-sm
                      text-slate-500
                      mt-1
                    "
                  >
                    Your latest search queries
                  </p>

                </div>

                <History
                  size={20}
                  className="text-slate-400"
                />

              </div>


              <div className="divide-y divide-slate-100">

                {analytics.recentSearches.length === 0 ? (

                  <div
                    className="
                      p-8
                      text-center
                      text-slate-500
                      text-sm
                    "
                  >
                    No searches yet.
                  </div>

                ) : (

                  analytics.recentSearches.map((item) => (

                    <div
                      key={item._id}
                      className="
                        p-4
                        flex
                        items-center
                        justify-between
                        gap-4
                        hover:bg-slate-50
                        transition
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          min-w-0
                        "
                      >

                        <div
                          className="
                            w-9
                            h-9
                            rounded-lg
                            bg-blue-100
                            flex
                            items-center
                            justify-center
                            shrink-0
                          "
                        >
                          <Search
                            size={17}
                            className="text-blue-600"
                          />
                        </div>


                        <div className="min-w-0">

                          <p
                            className="
                              font-medium
                              text-slate-800
                              truncate
                            "
                          >
                            {item.query}
                          </p>

                          <p
                            className="
                              text-xs
                              text-slate-500
                              mt-1
                            "
                          >
                            {item.resultCount} results
                          </p>

                        </div>

                      </div>


                      <span
                        className="
                          text-xs
                          text-slate-400
                          shrink-0
                          hidden
                          sm:block
                        "
                      >
                        {new Date(
                          item.searchedAt ||
                            item.createdAt
                        ).toLocaleDateString()}
                      </span>

                    </div>

                  ))

                )}

              </div>

            </div>


            {/* RECENT SCRAPED */}

            <div
              className="
                bg-white
                border
                border-slate-200
                rounded-2xl
                shadow-sm
                overflow-hidden
              "
            >

              <div className="p-5 border-b border-slate-100">

                <h2
                  className="
                    text-lg
                    font-bold
                    text-slate-900
                  "
                >
                  Recent Scraped Websites
                </h2>

                <p
                  className="
                    text-sm
                    text-slate-500
                    mt-1
                  "
                >
                  Recently collected web data
                </p>

              </div>


              <div className="divide-y divide-slate-100">

                {analytics.recentScraped.length === 0 ? (

                  <div
                    className="
                      p-8
                      text-center
                      text-slate-500
                      text-sm
                    "
                  >
                    No scraped websites yet.
                  </div>

                ) : (

                  analytics.recentScraped.map((item) => (

                    <div
                      key={item._id}
                      className="
                        p-4
                        hover:bg-slate-50
                        transition
                      "
                    >

                      <div className="flex gap-3">

                        <div
                          className="
                            w-9
                            h-9
                            rounded-lg
                            bg-emerald-100
                            flex
                            items-center
                            justify-center
                            shrink-0
                          "
                        >
                          <FileText
                            size={17}
                            className="text-emerald-600"
                          />
                        </div>


                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >

                          <p
                            className="
                              font-medium
                              text-slate-800
                              truncate
                            "
                          >
                            {item.title ||
                              "Untitled Page"}
                          </p>


                          <p
                            className="
                              text-xs
                              text-slate-500
                              mt-1
                              truncate
                            "
                          >
                            {item.url}
                          </p>


                          <p
                            className="
                              text-xs
                              text-slate-400
                              mt-1
                            "
                          >
                            {new Date(
                              item.scrapedAt ||
                                item.createdAt
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


       {/* =================================================
    RECENT ACTIVITY
================================================== */}

<div
  className="
    bg-white
    rounded-2xl
    border
    border-slate-200
    overflow-hidden
    mt-6
  "
>
  {/* Header */}
  <div
    className="
      px-5
      sm:px-6
      py-5
      border-b
      border-slate-200
    "
  >
    <h3
      className="
        font-bold
        text-lg
        text-slate-900
      "
    >
      Recent Activity
    </h3>

    <p
      className="
        text-sm
        text-slate-500
        mt-1
      "
    >
      Your latest searches and scraped data will appear here.
    </p>
  </div>

  {/* Activity Content */}
  {analytics?.recentSearches?.length > 0 ||
  analytics?.recentScraped?.length > 0 ? (

    <div className="divide-y divide-slate-100">

      {/* Recent Searches */}
      {analytics?.recentSearches?.map((item, index) => (
       <div
  key={`search-${item?._id || index}`}
 onClick={() => {
  setQuery(item?.query || "");

  setTimeout(() => {
    const searchBox = document.getElementById("web-search");

    if (searchBox) {
      searchBox.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, 100);
}}
  className="
    px-5
    sm:px-6
    py-4
    flex
    items-center
    gap-4
    hover:bg-blue-50
    transition
    cursor-pointer
  "
>
          {/* Icon */}
          <div
            className="
              w-10
              h-10
              rounded-xl
              bg-blue-50
              flex
              items-center
              justify-center
              shrink-0
            "
          >
            <Search
              size={19}
              className="text-blue-600"
            />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-800">
              Web Search
            </p>

            <p className="text-sm text-slate-500 truncate">
              {item?.query || "Search"}
            </p>
          </div>

          {/* Date */}
          <span
            className="
              hidden
              sm:block
              text-xs
              text-slate-400
              whitespace-nowrap
            "
          >
            {item?.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : ""}
          </span>

          <ExternalLink
            size={16}
            className="text-slate-400 shrink-0"
          />
        </div>
      ))}

      {/* Recent Scraped Data */}
      {analytics?.recentScraped?.map((item, index) => (
        <div
          key={`scraped-${item?._id || index}`}
          onClick={() => {
            const scrapedSection =
              document.getElementById("scraped-data");

            if (scrapedSection) {
              scrapedSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }}
          className="
            px-5
            sm:px-6
            py-4
            flex
            items-center
            gap-4
            hover:bg-emerald-50
            transition
            cursor-pointer
          "
        >
          {/* Icon */}
          <div
            className="
              w-10
              h-10
              rounded-xl
              bg-emerald-50
              flex
              items-center
              justify-center
              shrink-0
            "
          >
            <Database
              size={19}
              className="text-emerald-600"
            />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-800">
              Website Scraped
            </p>

            <p className="text-sm text-slate-500 truncate">
              {item?.title ||
                item?.url ||
                "Public website"}
            </p>
          </div>

          {/* Date */}
          <span
            className="
              hidden
              sm:block
              text-xs
              text-slate-400
              whitespace-nowrap
            "
          >
            {item?.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : ""}
          </span>

          <ExternalLink
            size={16}
            className="text-slate-400 shrink-0"
          />
        </div>
      ))}

    </div>

  ) : (

    /* Empty State */
    <div className="p-8 sm:p-10 text-center">

      <div
        className="
          w-14
          h-14
          bg-slate-100
          rounded-2xl
          flex
          items-center
          justify-center
          mx-auto
          mb-4
        "
      >
        <History
          size={25}
          className="text-slate-400"
        />
      </div>

      <h4
        className="
          font-semibold
          text-slate-800
        "
      >
        Activity Dashboard
      </h4>

      <p
        className="
          text-sm
          text-slate-500
          mt-2
          max-w-md
          mx-auto
        "
      >
        Use the search box above to search
        the web, save results, and scrape
        public website data.
      </p>

    </div>

  )}
</div>

        </section>

      </main>

    </div>
  );
};

export default Dashboard;