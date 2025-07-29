export const formatNumber = (num: number) => {
  return new Intl.NumberFormat("id-ID").format(num);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getGrowthColor = (value: number): string => {
  return value >= 0 ? "text-green-600" : "text-red-600";
};
