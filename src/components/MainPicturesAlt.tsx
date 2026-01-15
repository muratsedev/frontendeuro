import Image from "next/image";
import React from "react";

function MainPicturesAlt() {
  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-purple-50 py-8">
      <div className="flex gap-6 h-[600px] px-8">
        {/* Right side: 1 large image */}
      <div className="flex-1 relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
        <div className="h-full relative">
          <a href="#" title="المقال الرئيسي" className="block h-full relative">
            <Image
              src={"/img/5.jpg"}
              alt="المقال الرئيسي"
              width={700}
              height={500}
              className="object-cover w-full h-full rounded-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Featured Badge */}
            <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              مميز
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="mb-3 flex items-center gap-2 text-sm opacity-90">
                <span className="bg-blue-600 px-2 py-1 rounded text-xs">
                  أخبار
                </span>
                <span>•</span>
                <span>منذ ساعتين</span>
              </div>
              <h2 className="text-2xl font-bold mb-3 leading-tight">
                عنوان المقال الرئيسي المميز
              </h2>
              <p className="text-lg opacity-95 leading-relaxed mb-4">
                هذا نص تجريبي لوصف المقال الرئيسي المميز الذي يظهر في الصفحة
                الرئيسية للموقع
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">اسم الكاتب</p>
                  <p className="text-xs opacity-75">محرر صحفي</p>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
      {/* Left side: 4 small images in a 2x2 grid */}
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4">
        {/* Small Picture 1 (top-left) */}
        <div className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="h-full">
            <a href="#" title="مقال إخباري 1" className="block h-full relative">
              <Image
                src={"/img/1.jpg"}
                alt="مقال إخباري 1"
                width={300}
                height={250}
                className="object-cover w-full h-full rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-sm font-bold mb-1">عنوان المقال الأول</h3>
                <p className="text-xs opacity-90">وصف قصير للمقال...</p>
              </div>
            </a>
          </div>
        </div>

        {/* Small Picture 2 (top-right) */}
        <div className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="h-full">
            <a href="#" title="مقال إخباري 2" className="block h-full relative">
              <Image
                src={"/img/2.jpg"}
                alt="مقال إخباري 2"
                width={300}
                height={250}
                className="object-cover w-full h-full rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-sm font-bold mb-1">عنوان المقال الثاني</h3>
                <p className="text-xs opacity-90">وصف قصير للمقال...</p>
              </div>
            </a>
          </div>
        </div>

        {/* Small Picture 3 (bottom-left) */}
        <div className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="h-full">
            <a href="#" title="مقال إخباري 3" className="block h-full relative">
              <Image
                src={"/img/3.jpg"}
                alt="مقال إخباري 3"
                width={300}
                height={250}
                className="object-cover w-full h-full rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-sm font-bold mb-1">عنوان المقال الثالث</h3>
                <p className="text-xs opacity-90">وصف قصير للمقال...</p>
              </div>
            </a>
          </div>
        </div>

        {/* Small Picture 4 (bottom-right) */}
        <div className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="h-full">
            <a href="#" title="مقال إخباري 4" className="block h-full relative">
              <Image
                src={"/img/4.jpg"}
                alt="مقال إخباري 4"
                width={300}
                height={250}
                className="object-cover w-full h-full rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-sm font-bold mb-1">عنوان المقال الرابع</h3>
                <p className="text-xs opacity-90">وصف قصير للمقال...</p>
              </div>
            </a>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default MainPicturesAlt;
