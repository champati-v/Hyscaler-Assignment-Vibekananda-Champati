const Badge = ({ name }) => {

   const statusColors = {
    approved: "bg-green-100 text-green-700 border border-green-700",
    pending: "bg-yellow-100 text-yellow-700 border border-yellow-700",
    rejected: "bg-red-100 text-red-700 border border-red-700",
  };

  const color = statusColors[name.toLowerCase()] || "text-gray-800 bg-gray-200";

  return (
    <span className={`rounded-full ${color} px-2 py-1 text-xs`}>
      {name}
    </span>
  );
};

export default Badge;
