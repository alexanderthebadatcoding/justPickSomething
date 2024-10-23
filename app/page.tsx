"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import MovieRating from "@/components/MovieRating";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

interface Movie {
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  watch_providers?: {
    link: string;
    buy?: { provider_name: string }[];
    rent?: { provider_name: string }[];
    flatrate?: { provider_name: string }[];
    ads?: { provider_name: string }[];
  };
}

const sampleMovie: Movie = {
  title: "Inception",
  overview:
    "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: \"inception\", the implantation of another person's idea into a target's subconscious.",
  poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
  release_date: "2010-07-15",
  vote_average: 8.4,
  watch_providers: {
    link: "https://www.themoviedb.org/movie/27205-inception/watch",
    flatrate: [{ provider_name: "Netflix" }, { provider_name: "HBO Max" }],
    rent: [{ provider_name: "Apple TV" }, { provider_name: "Amazon Video" }],
    buy: [
      { provider_name: "Google Play Movies" },
      { provider_name: "YouTube" },
    ],
  },
};

export default function RandomMovie() {
  const [movie, setMovie] = useState<Movie>(sampleMovie);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const fetchRandomMovie = async () => {
    setLoading(true);
    setError(null);
    setIsFlipped(false);
    try {
      // Fetch a random popular movie
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&certification_country=US&certification.lte=R&include_adult=false&page=${
          Math.floor(Math.random() * 500) + 1
        }`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch movie data");
      }
      const data = await response.json();
      // console.log(data);

      const randomMovie =
        data.results[Math.floor(Math.random() * data.results.length)];

      // Fetch watch providers
      const providersResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${randomMovie.id}/watch/providers?api_key=${API_KEY}`
      );
      if (!providersResponse.ok) {
        throw new Error("Failed to fetch watch provider data");
      }
      const providersData = await providersResponse.json();
      // console.log(providersData);

      setMovie({
        ...randomMovie,
        watch_providers: providersData.results.US,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }
  const releaseDate = new Date(movie.release_date);
  const formattedDate = releaseDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long", // For full month name (e.g., June)
    day: "numeric",
  });
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 p-5">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-secondary pb-5 text-center">
        Just Pick Something
      </h1>
      <div
        className={`flip-card w-full max-w-md aspect-[2/3] cursor-pointer ${
          isFlipped ? "flipped" : ""
        } mb-8`}
        onClick={handleFlip}
      >
        <div className="flip-card-inner w-full h-full ">
          <div className="flip-card-front w-full h-full shadow-lg rounded-lg overflow-hidden">
            {loading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flip-card-back w-full h-full bg-white rounded-lg shadow-lg overflow-y-auto">
            <Card className="w-full h-full">
              <div className="p-6 space-y-4">
                <h2 className="text-2xl font-bold">{movie.title}</h2>
                <MovieRating rating={movie.vote_average} />
                <p className="text-sm text-gray-500">
                  Release Date: {formattedDate}
                </p>
                <p className="text-sm">{movie.overview}</p>
                <p className="text-sm font-semibold">
                  Rating: {movie.vote_average.toFixed(1)}/10{" "}
                </p>
                <div>
                  <h3 className="font-bold mb-2">How to Watch:</h3>
                  {movie.watch_providers ? (
                    <div className="text-sm space-y-1">
                      {movie.watch_providers.flatrate && (
                        <p>
                          Stream on:{" "}
                          {movie.watch_providers.flatrate
                            .map((p) => p.provider_name)
                            .join(", ")}
                        </p>
                      )}
                      {movie.watch_providers.ads && (
                        <p>
                          Watch Free with Ads:{" "}
                          {movie.watch_providers.ads
                            .map((p) => p.provider_name)
                            .join(", ")}
                        </p>
                      )}
                      {movie.watch_providers.rent &&
                        !movie.watch_providers.flatrate && (
                          <p>
                            Rent on:{" "}
                            {movie.watch_providers.rent
                              .map((p) => p.provider_name)
                              .join(", ")}
                          </p>
                        )}
                      <div className="pt-6 flex justify-center">
                        <a
                          href={movie.watch_providers.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button>More Information</Button>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm">
                      No watch provider information available.
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Button onClick={fetchRandomMovie} className="my-8" variant="secondary">
        Get Another Random Movie
      </Button>
      <style jsx>{`
        .flip-card {
          perspective: 1000px;
        }
        .flip-card-inner {
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        .flip-card.flipped .flip-card-inner {
          transform: rotateY(180deg);
        }
        .flip-card-front,
        .flip-card-back {
          position: absolute;
          backface-visibility: hidden;
        }
        .flip-card-back {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
