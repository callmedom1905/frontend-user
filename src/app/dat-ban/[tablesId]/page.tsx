"use client";
import React, { useEffect, useState, useCallback } from "react";
import { ProgressSteps } from "@/components/content/PageMeal/ProgressSteps";
import { ProductCard } from "@/components/content/PageMeal/ProductCard";
import { CategoryNav } from "@/components/content/PageMeal/CategoryNav";
import { SearchBar } from "@/components/content/PageMeal/SearchNav";
import { CartActionButton } from "@/components/content/PageCart/CartActionButton";
import apiClient from "@/lib/apiClient";
import { useParams } from "next/navigation";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  slug: string;
  description?: string;
  id_category: number;
  status: boolean;
}

interface CartItem extends Product {
  quantity: number;
}


export const FormThucOn: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleOrder = (product: {
    id: number;
    image: string;
    name: string;
    price: number;
  }) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const idx = cart.findIndex(
      (item: { id: number }) => item.id === product.id,
    );
    if (idx > -1) {
      cart[idx].quantity += 1;
    } else {
      cart.push({ 
        ...product, 
        price: Number(product.price),
        quantity: 1 
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [menuProducts, setMenuProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number|null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState(''); // Chỉ thay đổi khi submit search
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const params = useParams();
  const tablesId = params?.tablesId as string;
  const tableIds = tablesId ? tablesId.split("-").map(Number) : [];

  useEffect(() => {
    const cartData = localStorage.getItem("cart");
    if (cartData) {
      const parsed = JSON.parse(cartData);
      const normalizedCart = parsed.map((item: CartItem) => ({
        ...item,
        price: Number(item.price) || 0
      }));
      setCart(normalizedCart);
    } else {
      setCart([]);
    }
  }, []);

  useEffect(() => {
    const fetchInitialProducts = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get('/users/product');
        const data = res.data?.data || res.data || [];
        const filteredData = data.filter((item: Product) => item.status === true);
        setMenuProducts(filteredData);
      } catch (error) {
        console.error('Error fetching initial products:', error);
        setMenuProducts([]);
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    };

    fetchInitialProducts();
  }, []);

  useEffect(() => {
    if (isInitialLoad) {
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        let res;
        
        if (activeSearchTerm.trim()) {
          // Tìm kiếm sản phẩm
          res = await apiClient.get(`/users/product/search?query=${encodeURIComponent(activeSearchTerm.trim())}`);
        } else if (selectedCategory) {
          // Lấy sản phẩm theo danh mục
          res = await apiClient.get(`/users/products/category/${selectedCategory}`);
        } else {
          // Lấy tất cả sản phẩm
          res = await apiClient.get('/users/product');
        }
        
        const data = res.data?.data || res.data || [];
        const filteredData = data.filter((item: Product) => item.status === true);
        setMenuProducts(filteredData);
      } catch (error) {
        console.error('Error fetching products:', error);
        setMenuProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeSearchTerm, selectedCategory, isInitialLoad]);

  useEffect(() => {
    if (tableIds.length > 0) {
      const bookingInfoStr = localStorage.getItem("bookingInfo");
      let bookingInfo = {};
      if (bookingInfoStr) {
        try {
          bookingInfo = JSON.parse(bookingInfoStr);
        } catch {}
      }
      localStorage.setItem(
        "bookingInfo",
        JSON.stringify({ ...bookingInfo, tableIds }),
      );
    }
  }, [tablesId]);

  const handleSearch = useCallback((query: string) => {
    setActiveSearchTerm(query); // Chỉ cập nhật khi submit search
    setSelectedCategory(null);
  }, []);

  const handleCategorySelect = useCallback((categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setSearchTerm('');
    setActiveSearchTerm('');
  }, []);

  // Xác định variant dựa trên kích thước màn hình
  const displayVariant = isMobile ? 'mobile' : 'square';

  return (
    <div className="flex flex-col overflow-hidden bg-stone-100">
      <div
        className="fixed right-8 z-50 max-md:bottom-2 max-md:right-2"
        style={{}}
      >
        <CartActionButton />
      </div>
      {showCartPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-[900px] rounded-xl bg-white p-8">
            <button
              className="absolute right-6 top-6 h-[50px] w-[50px] rounded-full border text-3xl hover:text-red-500"
              onClick={() => setShowCartPopup(false)}
            >
              ×
            </button>
            <h2 className="mb-6 text-3xl font-bold text-black">GIỎ HÀNG</h2>
            <table className="mb-6 w-full">
              <thead>
                <tr className="text-left font-bold text-black">
                  <th>Món Ăn</th>
                  <th>Đơn Giá</th>
                  <th>Số Lượng</th>
                  <th>Tổng</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="flex items-center gap-3 py-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 rounded object-cover"
                      />
                      <span className="font-bold text-black">{item.name}</span>
                    </td>
                    <td className="font-bold text-black">
                      {Number(item.price).toLocaleString()} đ
                    </td>
                    <td className="text-black">
                      <div className="mx-auto flex w-fit items-center rounded border">
                        <button
                          className="px-3 py-1 text-xl text-black disabled:text-gray-300"
                          onClick={() => {
                            setCart((prev) => {
                              const updated = prev.map((p) =>
                                p.id === item.id
                                  ? {
                                      ...p,
                                      quantity: Math.max(1, p.quantity - 1),
                                    }
                                  : p,
                              );
                              localStorage.setItem(
                                "cart",
                                JSON.stringify(updated),
                              );
                              return updated;
                            });
                          }}
                          disabled={item.quantity === 1}
                        >
                          -
                        </button>
                        <span className="px-4 text-lg font-bold">
                          {item.quantity}
                        </span>
                        <button
                          className="px-3 py-1 text-xl text-black"
                          onClick={() => {
                            setCart((prev) => {
                              const updated = prev.map((p) =>
                                p.id === item.id
                                  ? { ...p, quantity: p.quantity + 1 }
                                  : p,
                              );
                              localStorage.setItem(
                                "cart",
                                JSON.stringify(updated),
                              );
                              return updated;
                            });
                          }}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="font-bold text-black">
                      {(Number(item.price) * item.quantity).toLocaleString()} đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="ml-auto w-1/2 rounded-xl bg-gray-100 p-6 text-black">
              <div className="mb-2 flex justify-between text-black">
                <span>Tổng số món</span>
                <span className="text-xl font-bold">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <div className="mb-2 flex justify-between text-black">
                <span>Tổng tiền</span>
                <span className="text-xl font-bold">
                  {cart
                    .reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
                    .toLocaleString()} đ
                </span>
              </div>
              <div className="mb-4 flex justify-between text-black">
                <span>Cọc trước</span>
                <span className="text-xl font-bold">
                  {(
                    cart.reduce(
                      (sum, item) => sum + Number(item.price) * item.quantity,
                      0,
                    ) / 2
                  ).toLocaleString()} đ
                </span>
              </div>
              <button className="w-full rounded-lg bg-[#4B2E23] py-3 text-lg font-bold text-white">
                Đặt bàn
              </button>
            </div>
          </div>
        </div>
      )}
      <ProgressSteps />
      <section className="flex ml-[210px] mr-[250px] z-10 px-8 pt-6 pb-4 w-full bg-zinc-100 min-h-[142px] max-md:px-3 max-md:flex-col max-md:gap-3 max-sm:ml-4 max-sm:mr-4">
        <div className="flex-1 min-w-0">
          <div className="rounded p-2 h-full">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#D4AF37] uppercase">
              Chọn Món
            </h1>
            <p className="mt-1 text-sm sm:text-base lg:text-lg font-light text-black">
              Tìm kiếm và chọn món ăn yêu thích
            </p>
          </div>
        </div>
        <div className="flex-1 max-md:justify-start max-md:mt-1">
          <div className="rounded mx-[20px] w-full max-w-md max-sm:mx-0">
            <SearchBar 
              value={searchTerm}
              onChange={setSearchTerm}
              onSearch={handleSearch}
              loading={loading}
            />
          </div>
        </div>
      </section>

      <CategoryNav onCategorySelect={handleCategorySelect} />

      <main className="flex w-full max-w-[1670px] flex-wrap justify-between gap-5 self-end max-md:max-w-full">
        <div className="max-md:max-w-full">

          <section className="flex w-full flex-col justify-center max-md:max-w-full">
            <h2 className="h-[70px] w-full gap-2.5 self-stretch whitespace-nowrap pt-10 text-3xl font-bold leading-6 text-black max-md:max-w-full">
              {activeSearchTerm.trim() 
                ? `Kết quả tìm kiếm cho "${activeSearchTerm}" (${menuProducts.length} sản phẩm)`
                : selectedCategory 
                ? `Danh mục (${menuProducts.length} sản phẩm)`
                : 'Menu'
              }
            </h2>
            {loading ? (
              <div className="text-center py-10">
                <div className="text-lg text-black mb-2">
                  {activeSearchTerm.trim() ? 'Đang tìm kiếm...' : selectedCategory ? 'Đang tải danh mục...' : 'Đang tải sản phẩm...'}
                </div>
                <div className="animate-spin w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : menuProducts.length === 0 && (activeSearchTerm.trim() || selectedCategory) ? (
              <div className="text-center py-10">
                <div className="text-lg text-gray-500 mb-4">
                  {selectedCategory ? 'Không có sản phẩm nào trong danh mục này' : 'Không tìm thấy món ăn nào'}
                </div>
              </div>
            ) : menuProducts.length === 0 ? (
              <div className="text-center py-10 text-lg text-gray-500">
                Chưa có sản phẩm nào
              </div>
            ) : (
              <div className="mt-5 flex w-full items-center gap-5 text-center max-md:max-w-full">
                {displayVariant === 'mobile' ? (
                  <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 w-full">
                    {menuProducts.map((product, idx) => (
                      <ProductCard
                        key={product.id || idx}
                        imageSrc={product.image}
                        title={product.name}
                        price={`${Number(product.price).toLocaleString()} đ`}
                        slug={product.slug}
                        variant="mobile"
                        onOrder={() =>
                          handleOrder({
                            id: product.id,
                            image: product.image,
                            name: product.name,
                            price: product.price,
                          })
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <div className="my-auto flex min-w-60 flex-wrap items-center gap-5 self-stretch max-md:max-w-full">
                    {menuProducts.map((product, idx) => (
                      <ProductCard
                        key={product.id || idx}
                        imageSrc={product.image}
                        title={product.name}
                        price={`${Number(product.price).toLocaleString()} đ`}
                        slug={product.slug}
                        variant="square"
                        onOrder={() =>
                          handleOrder({
                            id: product.id,
                            image: product.image,
                            name: product.name,
                            price: product.price,
                          })
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default FormThucOn;
