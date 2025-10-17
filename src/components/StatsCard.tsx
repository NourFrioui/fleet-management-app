import React from "react";
import { type LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
}) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-3 rounded-md ${color}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {value}
                </div>
                {subtitle && (
                  <div className="ml-2 text-sm text-gray-500">{subtitle}</div>
                )}
              </dd>
              {trend && (
                <dd className="mt-1">
                  <div
                    className={`text-sm flex items-center ${
                      trend.isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <span className="mr-1">{trend.isPositive ? "↗" : "↘"}</span>
                    {Math.abs(trend.value)}%
                  </div>
                </dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
