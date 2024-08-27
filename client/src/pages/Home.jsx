import React from "react";
import { useLocation } from "react-router-dom";

const Home = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const balance = query.get("balance") || "0";

  return (
    <div className="max-w-[1280px] mx-auto p-4 bg-white">
      <div className="text-lg font-bold mb-4">
        Current Balance: {balance} ETH
      </div>
      {/* Projek Populer Section */}
      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold">Projek Populer</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {/* Large Project Card */}
          <div className="col-span-2 p-6 bg-gray-200 rounded-lg sm:col-span-1 md:col-span-2">
            <div className="flex">
              <div className="w-32 h-32 bg-gray-300 rounded-lg"></div>
              <div className="ml-4">
                <h3 className="mb-1 text-lg font-bold text-black">
                  Lorem ipsum dolor sit amet
                </h3>
                <p className="text-sm text-gray-600">Creator</p>
                <p className="mt-2 text-xs text-gray-600">
                  Nullam ullamcorper, urna auctor pharetra sodales, lacus quam
                  laoreet lacus, eu facilisis felis felis facilisis odio.
                </p>
                <p className="mt-2 text-xs text-gray-600">100 Backers</p>
                <p className="text-xs text-gray-600">10 / 50 Funded</p>
              </div>
            </div>
          </div>

          {/* Small Project Cards */}
          {Array(5)
            .fill("")
            .map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 bg-gray-200 rounded-lg"
              >
                <div className="w-24 h-24 mb-2 bg-gray-300 rounded-lg"></div>
                <h3 className="mb-1 text-sm font-bold text-black truncate">
                  Lorem ipsum...
                </h3>
                <p className="text-xs text-gray-600">Creator</p>
                <p className="text-xs text-gray-600">100 Backers</p>
                <p className="text-xs text-gray-600">10 / 50 Funded</p>
              </div>
            ))}
        </div>
      </section>

      {/* Projek Terbaru Section */}
      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold">Projek Terbaru</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {Array(3)
            .fill("")
            .map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 bg-gray-200 rounded-lg"
              >
                <div className="w-24 h-24 mb-2 bg-gray-300 rounded-lg"></div>
                <h3 className="mb-1 text-sm font-bold text-black truncate">
                  Lorem ipsum...
                </h3>
                <p className="text-xs text-gray-600">Creator</p>
                <p className="text-xs text-gray-600">100 Backers</p>
                <p className="text-xs text-gray-600">10 / 50 Funded</p>
              </div>
            ))}
        </div>
      </section>

      {/* Tutorial dan Tips Section */}
      <section>
        <h2 className="mb-6 text-xl font-bold">Tutorial dan Tips</h2>
        <div className="space-y-6">
          {Array(2)
            .fill("")
            .map((_, index) => (
              <div
                key={index}
                className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                <p className="text-sm text-gray-700">
                  Neque porro quisquam est qui dolorem ipsum quia dolor sit
                  amet, consectetur, adipisci velit.
                </p>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
