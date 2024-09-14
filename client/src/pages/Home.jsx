import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import CardComponent from "../components/Card.componentt";

const Home = () => {
  const form = useForm({
    defaultValues: {
      campaign_id: 1,
      campaign_title: "adsf",
      campaign_creator: "asfd",
      campaign_backers: 21,
      campaign_funded: 55,
      campaign_total_fund: 111,
      campaign_images: "http://localhost:8000/assets/1725893454284.jpg",
    },
  });
  const [data, setData] = useState([]);

  useEffect(() => {
    setData([
      {
        id: 1,
        title: form.getValues("campaign_title"),
        creator: "TechCrunch",
        backers: 21,
        funded: 25,
        totalFunding: 111,
        imageUrl: form.getValues("campaign_images"),
      },
    ]);
  }, []);

  return (
    <div className="max-w-[1280px] mx-auto p-4 bg-white">
      {/* Projek Populer Section */}
      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold">Projek Populer</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {/* Large Project Card */}
          {data.length > 0 ? (
            data.map((item, index) => (
              <CardComponent
                key={index}
                id={item.id}
                title={item.title}
                creator={item.creator}
                backers={item.backers}
                funded={item.funded}
                totalFunding={item.totalFunding}
                imageUrl={item.imageUrl}
                control={form.control}
              />
            ))
          ) : (
            <p>Loading...</p>
          )}

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
