import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import CardComponent from "../components/card.component";
import { useForm } from "react-hook-form";

const Home = () => {
  const form = useForm({
    defaultValues: {
      campaign_id: 1,
      campaign_title: "adsf",
      campaign_creator: "asfd",
      campaign_backers: 21,
      campaign_funded: 55,
      campaign_total_fund: 111,
      campaign_images: "",
    },
  });
  const [data, setData] = useState([
    {
      id: 1,
      title: "Noteworthy Technology Acquisitions 2021",
      creator: "TechCrunch",
      backers: 21,
      funded: 55,
      totalFunding: 111,
      imageUrl: "https://example.com/image1.png",
    },
    {
      id: 2,
      title: "Top AI Startups to Watch",
      creator: "Forbes",
      backers: 15,
      funded: 75,
      totalFunding: 150,
      imageUrl: "https://example.com/image2.png",
    },
    {
      id: 3,
      title: "The Rise of Quantum Computing",
      creator: "Wired",
      backers: 10,
      funded: 100,
      totalFunding: 200,
      imageUrl: "https://example.com/image3.png",
    },
  ]);
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
