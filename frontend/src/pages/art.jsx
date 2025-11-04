import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "../components/card";

function ArtViewer({ pages }) {
  const [pageIndex, setPageIndex] = useState(0);

  const goNext = () => setPageIndex((p) => Math.min(p + 1, pages.length - 1));
  const goPrev = () => setPageIndex((p) => Math.max(p - 1, 0));

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-full max-w-xl">
        <img
          src={pages[pageIndex]}
          className="w-full rounded-lg shadow-md object-cover"
          alt={`Page ${pageIndex + 1}`}
        />
      </div>

      {pages.length > 1 && (
        <div className="flex items-center space-x-6">
          <button
            onClick={goPrev}
            disabled={pageIndex === 0}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <p className="text-gray-700">
            {pageIndex + 1} / {pages.length}
          </p>
          <button
            onClick={goNext}
            disabled={pageIndex === pages.length - 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default function ArtPage() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);
  const [selectedArt, setSelectedArt] = useState(null);

  useEffect(() => {
    if (!username) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchProfile() {
      try {
        const res = await fetch(
          `http://localhost:5000/artist/profilePage/${encodeURIComponent(username)}`,
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );

        if (!res.ok) {
          if (res.status === 404) {
            if (!cancelled) setNotFound(true);
            return;
          }
          const text = await res.text();
          throw new Error(text || `Request failed: ${res.status}`);
        }

        const profile = await res.json();
        if (!cancelled) {
          setUser({
            name: profile.username,
            profilePicture: profile.profile?.avatarUrl || "",
            bio: profile.profile?.bio || "Hello! This is my profile.",
            featuredArtworks: profile.featuredArtworks || [],
            raw: profile,
          });
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProfile();
    return () => {
      cancelled = true;
    };
  }, [username]);

  if (loading) return <div className="text-center mt-20">Loading profile…</div>;
  if (error) return <div className="text-center mt-20 text-red-600">Error: {error}</div>;
  if (notFound || !user) return <h1 className="text-center mt-20 text-2xl text-red-600">Profile Not Found</h1>;

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-gray-50 px-6 py-8">
      <section className="bg-white shadow-sm p-8 flex flex-col items-center text-center rounded-lg mb-8">
        <img
          src={user.profilePicture}
          alt={`${user.name}'s profile`}
          className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 mb-4"
        />
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">{user.name}</h1>
        <p className="text-base mb-2 text-gray-800">{user.bio}</p>
      </section>

      <main className="flex-1">
        {!selectedArt && (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Featured Artwork</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {user.featuredArtworks.length === 0 && (
                <div className="text-gray-600">No featured artworks yet.</div>
              )}

              {user.featuredArtworks.map((art) => (
                <div
                  key={art._id || art.id || art.title}
                  className="cursor-pointer"
                  onClick={() => setSelectedArt(art)}
                >
                  <Card image={art.pages?.[0] || art.fileUrl || art.image || ""} title={art.title || "Untitled"} />
                </div>
              ))}
            </div>
          </>
        )}

        {selectedArt && (
          <div className="flex flex-col items-center">
            <button
              className="mb-4 px-4 py-2 bg-gray-200 rounded"
              onClick={() => setSelectedArt(null)}
            >
              Back to Gallery
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {selectedArt.title}
            </h2>
            <ArtViewer pages={selectedArt.pages || [selectedArt.fileUrl]} />
          </div>
        )}
      </main>
    </div>
  );
}
