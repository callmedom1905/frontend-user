"use client"
import { Plus, Minus } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import apiClient from '@/lib/apiClient';
import { CartActionButton } from '@/components/content/PageCart/CartActionButton';

const ProductDetail = () => {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);
  const [bestSellingItems, setBestSellingItems] = useState<any[]>([]);
  const [otherDishes, setOtherDishes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number|null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCart, setHasCart] = useState(false);

  useEffect(() => {
    if (slug) {
      apiClient.get(`/users/products/slug/${slug}`).then(res => {
        setProduct(res.data);
      });
    }
  }, [slug]);

  useEffect(() => {
    apiClient.get('/users/category').then(res => {
      const cats = Array.isArray(res.data) ? res.data : [];
      setCategories(cats);
      if (cats.length > 0 && !activeCategory) {
        setActiveCategory(cats[0].id);
      }
    });
  }, []);

  useEffect(() => {
    // Sử dụng route mới để lấy món ăn bán chạy
    apiClient.get('/users/products/latest').then(res => {
      // Đảm bảo luôn lấy mảng đúng từ response (res.data hoặc res.data.data)
      const items = Array.isArray(res)? res : []
      setBestSellingItems(items.slice(0, 4));
    }).catch(() => {
      setBestSellingItems([]);
    });
  }, []);

  // Cart state management
  useEffect(() => {
    const checkCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setHasCart(cart.length > 0);
    };
    
    checkCart(); // Check initially
    
    // Listen for cart updates
    window.addEventListener('cartUpdated', checkCart);
    window.addEventListener('storage', checkCart);
    
    return () => {
      window.removeEventListener('cartUpdated', checkCart);
      window.removeEventListener('storage', checkCart);
    };
  }, []);




  useEffect(() => {
    if (searchTerm.trim() === '') {
      if (activeCategory) {
        setLoading(true);
        setError(null);
        apiClient.get(`/users/products/category/${activeCategory}`)
          .then(res => {
            const items = Array.isArray(res.data)
              ? res.data
              : (Array.isArray(res.data?.data) ? res.data.data : []);
            setOtherDishes(items);
            setLoading(false);
          })
          .catch(() => {
            setOtherDishes([]);
            setError('Không thể tải dữ liệu món ăn khác.');
            setLoading(false);
          });
      } else {
        setLoading(true);
        setError(null);
        apiClient.get('/users/products/most-sold-products')
          .then(res => {
            const items = Array.isArray(res) ? res : []
            setOtherDishes(items.slice(0, 8));
            setLoading(false);
          })
          .catch(() => {
            setOtherDishes([]);
            setError('Không thể tải dữ liệu món ăn khác.');
            setLoading(false);
          });
      }
      return;
    }
    setLoading(true);
    setError(null);
    // Nếu có searchTerm, bạn có thể thêm logic tìm kiếm ở đây nếu cần
  }, [searchTerm, activeCategory]);

  // Hàm thêm vào giỏ hàng
  const handleAddToCart = (item: any, quantity = 1) => {
    let cart: any[] = [];
    if (typeof window !== 'undefined') {
      const cartStr = localStorage.getItem('cart');
      if (cartStr) {
        cart = JSON.parse(cartStr);
      }
      // Kiểm tra đã có sản phẩm này chưa
      const idx = cart.findIndex((p: any) => p.id === item.id);
      if (idx > -1) {
        cart[idx].quantity += quantity;
      } else {
        cart.push({ ...item, quantity });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    }
  };

  // Handle cart button click
  const handleCartClick = () => {
    // You can customize this behavior - for now it just opens the cart modal
    // This could navigate to a cart page or do other actions
  };

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải dữ liệu sản phẩm...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-vietnam flex flex-col items-center py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 w-full max-w-[1300px]">
        {/* Left Side - Product Card and Description */}
        <div className="flex flex-col flex-1">
          {/* Product Card */}
          <div className="bg-white rounded-[8px] shadow p-4 sm:p-6 flex flex-col lg:flex-row gap-4 lg:gap-8 mb-6 border border-gray-200">
            {/* Product Image */}
            <div className="w-full lg:w-[471px] h-[300px] sm:h-[400px] lg:h-[496px] rounded-[8px] overflow-hidden flex-shrink-0">
              <img
                src={product?.image}
                alt={product?.name}
                className="w-full h-full object-cover rounded-[8px]"
              />
            </div>
            {/* Product Info */}
            <div className="flex flex-col flex-1 justify-between">
              <div>
                <h1 className="text-lg sm:text-xl lg:text-[22px] font-bold text-black mb-1 leading-tight">
                  {product?.name}
                </h1>
                <span className="text-base sm:text-lg lg:text-[18px] font-bold text-[#E8A317] block mb-2">
                  {Number(product?.price).toLocaleString()} đ
                </span>
                {/* Stars */}
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16" height="16" className="sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="#FFD600" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z"/>
                    </svg>
                  ))}
                </div>
                <div className="text-gray-700 text-sm sm:text-base mb-4">
                  {product?.meta_description}
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2 text-black">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-lg font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {/* Quantity Controls & Order Button */}
              <div className="flex items-center gap-3 mt-2"> 
                <button
                  className="ml-0 sm:ml-4 px-6 sm:px-8 py-2 border border-[#3B2219] rounded-[12px] flex items-center justify-center gap-2 font-medium text-[#3B2219] bg-white hover:border-[#2a170f] transition w-full sm:w-auto"
                  onClick={() => handleAddToCart(product, quantity)}
                >
                  <span className="w-6 h-6 flex items-center justify-center rounded-full border border-[#3B2219] bg-white">
                    <Plus className="w-4 h-4 text-[#3B2219]" />
                  </span>
                  Đặt
                </button>
              </div>
            </div>
          </div>
          {/* Product Detail Description */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow border border-gray-100 mb-6 lg:mb-10">
            <h2 className="text-base sm:text-lg font-bold mb-2 text-black">
              {product?.name} – Hương Vị Truyền Thống Gói Gọn Trong Chiếc Bánh Nóng Giòn
            </h2>
            <div className="text-gray-700 text-sm space-y-2 leading-relaxed">
              {product?.detail_description?.split('\n').map((line: string, idx: number) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          </div>
        </div>
        {/* Right Side - Sidebar */}
        <div className="w-full lg:w-[447px] flex flex-col gap-4 lg:gap-6">
          {/* Categories */}
          <div className="rounded-xl p-4 bg-white shadow border border-gray-100">
            <h3 className="text-lg font-bold text-black mb-3">Danh mục</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
              {categories.map((category: any) => (
                <div
                  key={category.id} 
                  className={`py-2 px-3 text-black text-sm sm:text-base hover:bg-gray-100 rounded cursor-pointer transition ${activeCategory === category.id ? 'bg-gray-200 font-semibold' : ''}`}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setSearchTerm('');
                  }}
                >
                  {category.name}
                </div>
              ))}
            </div>
          </div>
          {/* Best Selling Items */}
          <div className="rounded-xl p-4 sm:p-6 w-full bg-white shadow border border-gray-100">
            <h3 className="text-lg font-bold text-black mb-3">Món ăn bán chạy</h3>
            <div className="space-y-3">
              {bestSellingItems.length === 0 ? (
                <div className="text-gray-500 text-center py-4">Không có sản phẩm bán chạy</div>
              ) : (
                  bestSellingItems.map((item, index) => (
                   <div
                     key={item.id || index}
                     className="flex flex-col sm:flex-row items-center bg-gray-50 gap-3 w-full rounded-[12px] border border-gray-200 shadow-sm hover:shadow transition p-3 cursor-pointer"
                     onClick={() => router.push(`/menu/${item.slug}`)}
                   >
                    <img
                      src={item.image || item.imageUrl}
                      alt={item.name}
                      className="w-full sm:w-[120px] lg:w-[205px] h-[120px] sm:h-[90px] lg:h-[168px] object-cover rounded-[8px] border border-gray-100"
                    />
                    <div className="flex-1 px-2 flex flex-col justify-between h-full w-full">
                      <div>
                        <h4 className="text-sm sm:text-base font-medium text-black mb-1">
                          {item.name}
                        </h4>
                        <p className="text-sm sm:text-base text-[#C0392B] font-semibold">
                          {Number(item.price).toLocaleString()} đ
                        </p>
                      </div>
                        <button
                         className="self-end px-2 py-1 border border-[#3B2219] rounded-[12px] flex items-center justify-center gap-1 font-medium text-[#3B2219] bg-white hover:border-[#2a170f] transition text-xs sm:text-sm mt-2"
                         onClick={(e) => {
                           e.stopPropagation();
                           handleAddToCart(item, 1);
                         }}
                       >
                        <span className="w-4 h-4 flex items-center justify-center rounded-[8px] border border-[#3B2219] bg-white">
                          <Plus className="w-3 h-3 text-[#3B2219]" />
                        </span>
                        Đặt
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 text-center">
              <Link href="/menu">
              <button className="w-full border border-gray-300 rounded-[8px] p-3 text-black text-sm hover:bg-gray-100 transition">
                Xem tất cả
              </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Other Dishes Section */}
      <div className="w-full max-w-[1300px] mt-6 lg:mt-10">
        <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 lg:mb-6">Món ăn khác</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {loading ? (
            <div className="col-span-full text-center text-gray-500 py-8">Đang tải...</div>
          ) : error ? (
            <div className="col-span-full text-center text-red-500 py-8">{error}</div>
          ) : otherDishes.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-8">Không có món ăn nào</div>
          ) : (
            otherDishes.map((dish, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg border border-gray-100 transition-shadow flex flex-col cursor-pointer"
                onClick={() => router.push(`/menu/${dish.slug}`)}
              >
                <img
                  src={dish.image || dish.imageUrl}
                  alt={dish.name}
                  className="w-full h-32 sm:h-44 object-cover"
                />
                <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-sm sm:text-lg font-medium text-black mb-1">
                      {dish.name}
                    </h3>
                    <p className="text-sm sm:text-lg text-[#E8A317] mb-2 font-semibold">
                      {Number(dish.price).toLocaleString()} đ
                    </p>
                  </div>
                  <button
                    className="px-3 sm:px-4 py-1 border border-[#3B2219] rounded-[12px] flex items-center justify-center gap-2 font-medium text-[#3B2219] bg-white hover:border-[#2a170f] transition text-xs sm:text-sm"
                    onClick={e => {
                      e.stopPropagation();
                      handleAddToCart(dish, 1);
                    }}
                  >
                    <span className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full border border-[#3B2219] bg-white">
                      <Plus className="w-3 h-3 text-[#3B2219]" />
                    </span>
                    Đặt
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Popup thông báo */}
      {showPopup && (
        <div className="fixed top-4 sm:top-8 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg text-sm sm:text-base">
          Đã thêm vào giỏ hàng thành công
        </div>
      )}

      {/* Cart Action Button - chỉ hiện khi có sản phẩm trong giỏ */}
      {hasCart && (
        <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}>
          <CartActionButton hasCart={hasCart} onClick={handleCartClick} />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
