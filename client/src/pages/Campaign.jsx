import React from "react";

const Campaign = () => {
  return (
    <div className="flex flex-col items-center justify-center mx-auto max-w-[1280px] p-4">
      {/* Search Bar */}
      <div className="flex w-full max-w-lg mb-8">
        <input
          type="text"
          placeholder="Cari Projek"
          className="flex-1 p-2 border border-gray-300 rounded-l-full outline-none"
        />
        <button className="bg-gray-300 p-2 rounded-r-full hover:bg-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m2.85-5.15a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
            />
          </svg>
        </button>
      </div>

      {/* Projects Section */}
      <section className="w-full mb-8">
        <h2 className="mb-4 text-lg font-bold">Projek Anda</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {Array(4)
            .fill("")
            .map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 bg-gray-200 rounded-lg"
              >
                <div className="w-24 h-24 mb-2 bg-gray-300 rounded-lg"></div>
                <h3 className="text-sm font-bold text-black truncate">
                  Lorem ipsum...
                </h3>
                <p className="text-xs text-gray-600">Creator</p>
                <p className="text-xs text-gray-600">100 Backers</p>
                <p className="text-xs text-gray-600">10 / 50 Funded</p>
              </div>
            ))}
        </div>
      </section>

      {/* Explore Section */}
      <section className="w-full">
        <h2 className="mb-4 text-lg font-bold">
          Jelajahi{" "}
          <span className="text-blue-500 cursor-pointer">6 Projek</span>
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {Array(8)
            .fill("")
            .map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 bg-gray-200 rounded-lg"
              >
                <div className="w-24 h-24 mb-2 bg-gray-300 rounded-lg"></div>
                <h3 className="text-sm font-bold text-black truncate">
                  Lorem ipsum...
                </h3>
                <p className="text-xs text-gray-600">Creator</p>
                <p className="text-xs text-gray-600">100 Backers</p>
                <p className="text-xs text-gray-600">10 / 50 Funded</p>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default Campaign;
