"use client";
import React, { useEffect, useState } from "react";
import { ProgressSteps } from "@/components/content/PageMeal/ProgressSteps";
import { ProductCard } from "@/components/content/PageMeal/ProductCard";

import { CategoryNav } from "@/components/content/PageMeal/CategoryNav";
import { SearchBar } from "@/components/content/PageMeal/SearchNav";
import { CartActionButton } from "@/components/content/PageCart/CartActionButton";
import apiClient from "@/lib/apiClient";
import { useParams } from "next/navigation";


export const FormThucOn: React.FC = () => {
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
        price: Number(product.price), // Ensure price is number
        quantity: 1 
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };
  const [hasCart, setHasCart] = useState(false);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [cart, setCart] = useState<any[]>([]);

  const [menuProducts, setMenuProducts] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number|null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const tablesId = params?.tablesId as string;
  const tableIds = tablesId ? tablesId.split("-").map(Number) : [];

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const cartData = localStorage.getItem("cart");
    if (cartData) {
      const parsed = JSON.parse(cartData);
      // Normalize cart data to ensure prices are numbers
      const normalizedCart = parsed.map((item: any) => ({
        ...item,
        price: Number(item.price) || 0
      }));
      setCart(normalizedCart);
      setHasCart(normalizedCart.length > 0);
    } else {
      setCart([]);
      setHasCart(false);
    }

    // Fetch sản phẩm status = 1
    const fetchProducts = async () => {
      try {
        const res = await apiClient.get("/users/product");
        let data = res.data || [];
        data = data.filter((item: any) => item.status === true);
        setAllProducts(data); // Lưu tất cả sản phẩm
        
        // Hiển thị tất cả sản phẩm
        setMenuProducts(data);
      } catch (err) {
        setAllProducts([]);
        setMenuProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // Search and category filtering logic
  useEffect(() => {
    if (allProducts.length === 0) return;

    const filterProducts = async () => {
      setLoading(true);
      try {
        let filteredProducts = [...allProducts];

        // Apply search filter
        if (debouncedSearchTerm.trim()) {
          const searchLower = debouncedSearchTerm.toLowerCase();
          filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchLower) ||
            product.description?.toLowerCase().includes(searchLower)
          );
        }

        // Apply category filter
        if (selectedCategory) {
          filteredProducts = filteredProducts.filter(product => 
            product.id_category === selectedCategory
          );
        }

        if (debouncedSearchTerm.trim() || selectedCategory) {
          // Show filtered results
          setMenuProducts(filteredProducts);
        } else {
          // Show ALL products
          setMenuProducts(allProducts);
        }
      } catch (error) {
        console.error('Error filtering products:', error);
      } finally {
        setLoading(false);
      }
    };

    filterProducts();
  }, [debouncedSearchTerm, selectedCategory, allProducts]);

  // Lưu vào localStorage để các component khác dùng được
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

  const handleButtonClick = () => {
    if (hasCart) {
      setShowCartPopup(true);
    } else {
      window.location.href = "/thanh-toan"; // hoặc router.push nếu dùng Next.js router
    }
  };

  // Search and category handlers
  const handleSearch = (query: string) => {
    setSearchTerm(query);
    setSelectedCategory(null); // Reset category when searching
  };

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setSearchTerm(''); // Reset search when selecting category
  };



  return (
    <div className="flex flex-col overflow-hidden bg-stone-100">
      <div
        className="fixed right-8 z-50 max-md:bottom-2 max-md:right-2"
        style={{}}
      >
        <CartActionButton hasCart={hasCart} onClick={handleButtonClick} />
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
                {cart.map((item, idx) => (
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

      {/* Search and Category Section */}
      <section className="flex ml-[210px] mr-[250px] z-10 items-center px-8 pt-6 pb-4 w-full bg-zinc-100 min-h-[142px] max-md:px-3 max-md:flex-col max-md:gap-3 max-sm:ml-4 max-sm:mr-4">
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
              Menu
            </h2>
            {loading ? (
              <div className="text-center py-10 text-lg text-black">
                {debouncedSearchTerm.trim() ? 'Đang tìm kiếm...' : selectedCategory ? 'Đang tải danh mục...' : 'Đang tải sản phẩm...'}
              </div>
            ) : menuProducts.length === 0 && (debouncedSearchTerm.trim() || selectedCategory) ? (
              <div className="text-center py-10 text-lg text-gray-500">
                {selectedCategory ? 'Không có sản phẩm nào trong danh mục này' : 'Không tìm thấy món ăn nào'}
              </div>
            ) : menuProducts.length === 0 ? (
              <div className="text-center py-10 text-lg text-gray-500">
                Chưa có sản phẩm nào
              </div>
            ) : (
              <div className="mt-5 flex w-full items-center gap-5 text-center max-md:max-w-full">
                <div className="my-auto flex min-w-60 flex-wrap items-center gap-5 self-stretch max-md:max-w-full">
                  {menuProducts.map((product, idx) => (
                    <ProductCard
                      key={product.id || idx}
                      imageSrc={product.image}
                      title={product.name}
                      price={`${Number(product.price).toLocaleString()} đ`}
                      slug={product.slug}
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
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default FormThucOn;
