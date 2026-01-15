import Image from "next/image";
import React from "react";

function MainPictures() {
  return (
    <div className="flex gap-4 mt-5 h-96">
      {/* Left side: 4 small images in a 2x2 grid */}
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2">
        {/* Small Picture 1 (top-left) */}
        <div className="bg-gray-300 h-full overflow-hidden rounded">
          <div className="card h-full">
            <a href="#" title="صورة 1" className="block h-full">
              <Image
                src={"/img/1.jpg"}
                alt="صورة 1"
                width={200}
                height={200}
                className="rounded object-cover w-full h-full"
              />
            </a>
          </div>
        </div>

        {/* Small Picture 2 (top-right) */}
        <div className="bg-gray-300 h-full overflow-hidden rounded">
          <div className="card h-full">
            <a href="#" title="صورة 2" className="block h-full">
              <Image
                src={"/img/2.jpg"}
                alt="صورة 2"
                width={200}
                height={200}
                className="rounded object-cover w-full h-full"
              />
            </a>
          </div>
        </div>

        {/* Small Picture 3 (bottom-left) */}
        <div className="bg-gray-300 h-full overflow-hidden rounded">
          <div className="card h-full">
            <a href="#" title="صورة 3" className="block h-full">
              <Image
                src={"/img/3.jpg"}
                alt="صورة 3"
                width={200}
                height={200}
                className="rounded object-cover w-full h-full"
              />
            </a>
          </div>
        </div>

        {/* Small Picture 4 (bottom-right) */}
        <div className="bg-gray-300 h-full overflow-hidden rounded">
          <div className="card h-full">
            <a href="#" title="صورة 4" className="block h-full">
              <Image
                src={"/img/4.jpg"}
                alt="صورة 4"
                width={200}
                height={200}
                className="rounded object-cover w-full h-full"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Right side: 1 large image */}
      <div className="flex-1 bg-gray-500 overflow-hidden rounded">
        <div className="card h-full">
          <a href="#" title="الصورة الرئيسية" className="block h-full">
            <Image
              src={"/img/5.jpg"}
              alt="الصورة الرئيسية"
              width={600}
              height={400}
              className="rounded object-cover w-full h-full"
            />
          </a>
        </div>
      </div>
    </div>
  );
}

export default MainPictures;
