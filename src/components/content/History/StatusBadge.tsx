interface StatusBadgeProps {
  status: 'active' | 'completed' | 'cancelled';
  children: React.ReactNode;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, children }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'active':
        return 'text-lime-500 bg-lime-500 bg-opacity-10';
      case 'completed':
        return 'bg-black bg-opacity-10';
      case 'cancelled':
        return 'text-orange-600 bg-orange-600 bg-opacity-10';
      default:
        return 'bg-black bg-opacity-10';
    }
  };

  return (
    <div className="flex flex-1 shrink justify-center gap-2.5 items-center self-stretch p-2.5 my-auto basis-0">
      <div className={`gap-2.5 self-stretch px-3 py-1 my-auto rounded ${getStatusStyles()}`}>
        {children}
      </div>
    </div>
  );
};
