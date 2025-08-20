import Link from "next/link";

interface VoucherCardProps {
  discount: string;
  duration: string;
  logoSrc?: string;
  status: number; // Thêm prop status
  code?: string; // Thêm prop code nếu cần
  start_date: string; // Thêm prop start_date nếu cần
}

export const VoucherCard: React.FC<VoucherCardProps> = ({
  discount,
  code,
  duration,
  logoSrc,
  status,
  start_date,
}) => {
  const startDate = new Date(start_date);
  const now = new Date();
  const isDisabled = status === 4 || startDate > now;

  return (
    <article className="flex overflow-hidden gap-3 items-center self-stretch pr-3 my-auto bg-gray-100 rounded-xl border-black min-w-60">
      <div className="flex flex-col justify-center items-center self-stretch my-auto bg-neutral-900 h-[150px] w-[150px]">
        <img
          src={
            logoSrc ||
            "https://cdn.builder.io/api/v1/image/assets/38b2e106282946ca81bcf78ec2ab79c6/89ac71efb4d43052fb83b39c49aa4aebff3cb981?placeholderIfAbsent=true"
          }
          className="object-contain max-w-full aspect-square w-[150px]"
          alt="Voucher logo"
        />
      </div>
      <div className="flex flex-col justify-center items-end self-stretch my-auto text-black w-[212px]">
        <h3 className="text-lg font-bold leading-none">{discount}</h3>
        {code && (
          <p className="mt-1 text-sm text-gray-600">Mã: <span className="font-semibold">{code}</span></p>
        )}
        <p className="mt-3 text-sm leading-6">Thời hạn: {duration}</p>

        {isDisabled ? (
          <button
            className="cursor-not-allowed rounded self-stretch px-7 py-1.5 mt-3 text-xs text-center text-gray-400 border border-solid bg-gray-200 border-gray-300 max-md:px-5"
            disabled
          >
            KHÔNG SỬ DỤNG
          </button>
        ) : (
          <Link
            href="/dat-ban"
            className="rounded self-stretch px-7 py-1.5 mt-3 text-xs text-center text-yellow-50 border border-solid bg-stone-800 border-stone-800 max-md:px-5"
          >
            SỬ DỤNG
          </Link>
        )}
      </div>
    </article>
  );
};
