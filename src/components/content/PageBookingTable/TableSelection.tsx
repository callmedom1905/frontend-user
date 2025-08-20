"use client";
import React, { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";

// Interface cho dữ liệu bàn từ API
interface ApiTable {
  id: number;
  name: string;
  table_number: number;
  status: boolean; // true: trống, false: đã đặt
}

// Component cho mỗi cái bàn
interface TableProps {
  table: ApiTable;
  isSelected?: boolean;
  onClick?: () => void;
}

const Table: React.FC<TableProps> = ({ table, isSelected, onClick }) => {
  const isOccupied = !table.status;
  const getTableClasses = () => {
    if (isSelected) return "gap-2.5 self-stretch px-2.5 my-auto text-white bg-amber-400 rounded-[8px] border border-solid border-stone-300 h-[100px] min-h-[100px] w-[100px] flex items-center justify-center cursor-pointer";
    if (isOccupied) return "gap-2.5 self-stretch px-2.5 my-auto bg-white rounded-[8px] border border-solid border-stone-300 h-[100px] min-h-[100px] w-[100px] flex items-center justify-center";
    return "gap-2.5 self-stretch px-2.5 my-auto bg-white rounded-[8px] border border-solid border-stone-300 h-[100px] min-h-[100px] w-[100px] flex items-center justify-center cursor-pointer hover:bg-gray-50";
  };

  return (
    <button
      className={getTableClasses()}
      onClick={onClick}
      disabled={isOccupied}
    >
      <div className="flex flex-col items-center">
        <span className="text-[16px] mb-1 text-black">Bàn {table.table_number}</span>
        <span className="text-sm">{table.name}</span>
      </div>
    </button>
  );
};

interface TableSelectionProps {
  setSelectedTableId?: (id: number) => void;
}

export const TableSelection: React.FC<TableSelectionProps> = ({ setSelectedTableId }) => {
  const [tables, setTables] = useState<ApiTable[]>([]);
  const [selectedTableId, setSelectedTableIdState] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await apiClient.get('/users/tables');
        setTables(response.data?.data || response.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bàn:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
    const interval = setInterval(fetchTables, 5000); // Cập nhật mỗi 5s
    return () => clearInterval(interval);
  }, []);

  const handleTableSelect = (table: ApiTable) => {
    if (table.status) {
      setSelectedTableId && setSelectedTableId(table.table_number);
      setSelectedTableIdState(table.table_number);
    }
  };

  // Chia bàn thành 2 hàng để dễ dàng tạo layout
  const topRowTables = tables.slice(0, 6);
  const bottomRowTables = tables.slice(6, 12);

  return (
    <section className="flex flex-col justify-center px-12 py-3 w-full max-w-[940px] max-md:px-5 max-md:max-w-full">
      <div className="max-w-full text-lg font-medium leading-none text-center text-black w-[254px]">
        <h3 className="gap-2.5 self-stretch py-3 w-full">
          Chọn vị trí bàn
        </h3>
      </div>

      {loading ? (
        <p className="text-center py-10">Đang tải danh sách bàn...</p>
      ) : (
        <div className="flex flex-row gap-5 justify-center items-center w-full text-base text-center max-md:max-w-full">
          <div
            className="flex items-center justify-center bg-neutral-900 rounded w-[45px] h-[220px] text-white"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            Lối vào
          </div>

          <div className="flex flex-col gap-5">
            {/* Hàng trên */}
            <div className="flex flex-row gap-5 rounded-[8px] items-center max-md:max-w-full">
              {topRowTables.map(table => (
                <Table
                  key={table.id}
                  table={table}
                  isSelected={selectedTableId === table.table_number}
                  onClick={() => handleTableSelect(table)}
                />
              ))}
            </div>
            {/* Hàng dưới */}
            <div className="flex flex-row gap-5 items-center rounded-[8px] max-md:max-w-full">
              {bottomRowTables.map(table => (
                <Table
                  key={table.id}
                  table={table}
                  isSelected={selectedTableId === table.table_number}
                  onClick={() => handleTableSelect(table)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
