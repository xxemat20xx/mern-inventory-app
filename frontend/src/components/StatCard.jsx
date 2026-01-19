const StatCard = ({ title, value, subtitle, icon, color }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group">
      <div
        className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-110 ${color}`}
      ></div>

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <h2 className="text-3xl font-bold mt-1 text-gray-900">{value}</h2>
          <p
            className={`text-xs mt-2 font-medium ${
              subtitle.includes("↑")
                ? "text-green-600"
                : "text-blue-600"
            }`}
          >
            {subtitle}
          </p>
        </div>

        <div className={`p-3 rounded-lg text-white ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
