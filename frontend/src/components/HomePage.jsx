import { useEffect } from "react";
import { useState } from "react";

export default function MarketplaceBanner() {
  const [activeIndex, setActiveIndex] = useState(0);

  const banners = [
    {
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600",
      alt: "Fashion shopping collection",
    },
    {
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1600",
      alt: "Electronics collection",
    },
    {
      image:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600",
      alt: "Fashion and clothing",
    },
    {
      image:
        "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=1600",
      alt: "Home and lifestyle products",
    },
    {
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600",
      alt: "Headphones and accessories",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-10">
      <div className="relative h-52 overflow-hidden rounded-2xl bg-gray-200 shadow-md sm:h-72 lg:h-96">
        {banners.map((banner, index) => (
          <img
            key={banner.image}
            src={banner.image}
            alt={banner.alt}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              activeIndex === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-3">
        {banners.map((banner, index) => (
          <button
            key={banner.image}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Show banner ${index + 1}`}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              activeIndex === index ? "bg-gray-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
