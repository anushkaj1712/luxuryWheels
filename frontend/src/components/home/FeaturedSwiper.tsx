"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import type { ApiCar } from "@/lib/types/home";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function FeaturedSwiper({ cars }: { cars: ApiCar[] }) {
  const swiperRef = React.useRef<SwiperType | null>(null);
  const [paused, setPaused] = React.useState(false);

  return (
    <div
      className="relative px-10 md:px-14"
      onMouseEnter={() => {
        setPaused(true);
        swiperRef.current?.autoplay?.stop();
      }}
      onMouseLeave={() => {
        setPaused(false);
        swiperRef.current?.autoplay?.start();
      }}
    >
      <button
        type="button"
        aria-label="Previous featured vehicle"
        className={cn(
          "dlw-carousel-nav absolute left-0 top-1/2 z-20 -translate-y-1/2",
          paused && "border-dlw-red/50 shadow-dlw-red scale-105",
        )}
        onClick={() => swiperRef.current?.slidePrev()}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Next featured vehicle"
        className={cn(
          "dlw-carousel-nav absolute right-0 top-1/2 z-20 -translate-y-1/2",
          paused && "border-dlw-red/50 shadow-dlw-red scale-105",
        )}
        onClick={() => swiperRef.current?.slideNext()}
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <Swiper
        modules={[Pagination, Autoplay, Navigation]}
        onSwiper={(s) => {
          swiperRef.current = s;
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5200, disableOnInteraction: false, pauseOnMouseEnter: true }}
        grabCursor
        touchRatio={1.15}
        spaceBetween={18}
        slidesPerView={1.1}
        speed={650}
        breakpoints={{ 768: { slidesPerView: 2.05 }, 1024: { slidesPerView: 3 } }}
      >
        {cars.map((car) => (
          <SwiperSlide key={car.id}>
            <Link href={`/cars/${car.slug}`} className="group block h-full">
              <Card className="h-full overflow-hidden border-white/10 bg-gradient-to-b from-white/[0.07] to-transparent p-0 transition duration-500 group-hover:-translate-y-1 group-hover:border-white/25 group-hover:shadow-dlw-glass">
                <div className="relative aspect-[16/10] overflow-hidden">
                  {car.thumbnail ? (
                    <Image
                      src={car.thumbnail}
                      alt={`${car.brand} ${car.model}`}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width:768px) 100vw, 33vw"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full bg-zinc-800" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/50">{car.brand}</p>
                      <p className="font-display text-lg text-white">
                        {car.model} · {car.year}
                      </p>
                    </div>
                    <span className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs text-white/90 backdrop-blur-sm">
                      {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(car.price)}
                    </span>
                  </div>
                </div>
                <CardContent className="p-5">
                  <p className="text-xs text-white/45">
                    {car.mileage.toLocaleString()} km · {car.fuel} · {car.transmission}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
