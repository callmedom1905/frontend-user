import React from "react";

export const Footer: React.FC = () => {
  return (
    <div className="mt-10 bg-current">
    <footer className="flex overflow-hidden flex-col items-center px-16 w-full bg-neutral-900 max-md:px-5 max-md:max-w-full">
      <div className="w-full max-w-[1420px] max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <div className="w-[34%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col justify-center py-8 w-full min-h-[364px] max-md:mt-5 max-md:max-w-full">
              <div className="flex flex-col justify-center items-center px-2.5 w-full h-[230px] max-md:max-w-full">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/3a82927ce0babacec5efdb475e018808abf1c8bc?placeholderIfAbsent=true&apiKey=a20586ce4c1b41ce81ab28e7c7b82866"
                  alt="Restaurant logo"
                  className="object-contain max-w-full aspect-[1.01] w-[300px]"
                />
              </div>
              <button className="gap-2.5 self-center px-2.5 py-3.5 mt-5 max-w-full text-lg text-center text-white rounded-[8px] border-2 border-orange-300 border-solid min-h-[50px] w-[178px]">
                Đặt bàn
              </button>
            </div>
          </div>

          <nav className="ml-5 w-[16%] max-md:ml-0 max-md:w-full">
            <div className="flex overflow-hidden flex-col justify-center items-center pl-[85px] py-8 w-full text-lg text-center text-white max-md:mt-5">
              <a href="/" className="gap-2.5 self-stretch px-2.5 py-3.5 max-w-full text-orange-300 border-b-2 border-orange-300 min-h-[50px] w-[220px]">
                Trang chủ
              </a>
              <a href="/menu" className="gap-2.5 self-stretch px-2.5 py-3.5 max-w-full whitespace-nowrap min-h-[50px] w-[220px]">
                Menu
              </a>
              <a href="/tin-tuc" className="gap-2.5 self-stretch px-2.5 py-3.5 max-w-full min-h-[50px] w-[220px]">
                Khuyến mãi
              </a>
              <a href="#" className="gap-2.5 self-stretch px-2.5 py-3.5 max-w-full min-h-[50px] w-[220px]">
                Giới thiệu
              </a>
              <a href="gioi-thieu" className="gap-2.5 self-stretch px-2.5 py-3.5 max-w-full min-h-[50px] w-[220px]">
                Tin tức
              </a>
              <a href="lien-he" className="gap-2.5 self-stretch px-2.5 py-3.5 max-w-full min-h-[50px] w-[220px]">
                Liên hệ
              </a>
            </div>
          </nav>

          <div className="ml-5 w-3/12 max-md:ml-0 max-md:w-full">
            <div className="flex overflow-hidden flex-col justify-center items-center pl-[85px] py-28 w-full text-lg text-center text-white min-h-[364px] max-md:py-24 max-md:mt-5">
              <p className="gap-2.5 self-stretch px-2.5 py-3.5 max-w-full min-h-[50px] w-[220px]">
                Hotline:{" "}
                <span className="text-[rgba(230,198,122,1)]">1900636323</span>
              </p>
              <p className="gap-2.5 self-stretch py-3.5 pl-2.5 mt-7 max-w-full min-h-[50px] w-[220px]">
                Email:{" "}
                <span className="text-[rgba(230,198,122,1)]">
                  momobeef@gmail.com
                </span>
              </p>
            </div>
          </div>

          <div className="ml-5 w-3/12 max-md:ml-0 max-md:w-full">
            <div className="flex flex-col grow justify-center py-36 min-h-[364px] max-md:py-24 max-md:mt-5">
              <div className="flex flex-col w-full">
                <div className="flex gap-2.5 justify-center items-center self-center">
                  <a href="https://www.facebook.com/prime.moobeefsteak?mibextid=LQQJ4d" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="object-contain shrink-0 self-stretch my-auto w-6 aspect-[0.96] text-white">
                      <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/>
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/moobeefsteak.sg?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="object-contain shrink-0 self-stretch my-auto w-6 aspect-[0.96] text-white">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.13 4.602.402 3.635 1.37 2.668 2.337 2.396 3.51 2.338 4.788 2.279 6.068 2.267 6.477 2.267 12c0 5.523.012 5.932.071 7.212.058 1.278.33 2.451 1.297 3.418.967.967 2.14 1.239 3.418 1.297C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.278-.058 2.451-.33 3.418-1.297.967-.967 1.239-2.14 1.297-3.418.059-1.28.071-1.689.071-7.212 0-5.523-.012-5.932-.071-7.212-.058-1.278-.33-2.451-1.297-3.418C19.399.402 18.226.13 16.948.072 15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                    </svg>
                  </a>
                  <a href="https://maps.app.goo.gl/pxPyXCqyWgotrvdp6" aria-label="Google Maps" target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="object-contain shrink-0 self-stretch my-auto w-6 aspect-[0.96] text-white">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
                    </svg>
                  </a>
                </div>
                <div className="flex gap-5 justify-center items-center mt-6 w-full text-lg text-center text-white">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/4f9034536dc4cd3ca2b7d0507cbc2998ad7dfb5d?placeholderIfAbsent=true&apiKey=a20586ce4c1b41ce81ab28e7c7b82866"
                    alt="Copyright icon"
                    className="object-contain shrink-0 self-stretch my-auto aspect-square w-[25px]"
                  />
                  <p className="self-stretch my-auto">
                    Momo Beef Steak Prime
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
};
