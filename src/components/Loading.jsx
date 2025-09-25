import React from "react";

// Loading spinner component
export const LoadingSpinner = ({ size = "md", color = "red" }) => {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
    };

    const colorClasses = {
        red: "border-red-600",
        blue: "border-blue-600",
        green: "border-green-600",
        gray: "border-gray-600",
    };

    return (
        <div
            className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
        ></div>
    );
};

// Page loading component
export const PageLoading = ({ message = "Đang tải..." }) => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-gray-600 text-lg">{message}</p>
    </div>
);

// Section loading component
export const SectionLoading = ({ message = "Đang tải..." }) => (
    <div className="flex flex-col items-center justify-center py-16">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">{message}</p>
    </div>
);

// Button loading component
export const ButtonLoading = ({ isLoading, children, ...props }) => (
    <button {...props} disabled={isLoading || props.disabled}>
        {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
                <LoadingSpinner size="sm" color="gray" />
                <span>Đang xử lý...</span>
            </div>
        ) : (
            children
        )}
    </button>
);

// Product card skeleton
export const ProductCardSkeleton = () => (
    <div className="animate-pulse bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-200 h-56 rounded-t-2xl"></div>
        <div className="p-5">
            <div className="bg-gray-200 h-5 rounded mb-2"></div>
            <div className="bg-gray-200 h-4 rounded w-2/3 mb-3"></div>
            <div className="bg-gray-200 h-4 rounded w-1/2 mb-3"></div>
            <div className="flex justify-between items-center mb-4">
                <div className="bg-gray-200 h-6 rounded w-1/3"></div>
                <div className="bg-gray-200 h-4 rounded w-1/4"></div>
            </div>
            <div className="bg-gray-200 h-10 rounded-xl"></div>
        </div>
    </div>
);

// List skeleton
export const ListSkeleton = ({ count = 4 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(count)].map((_, i) => (
            <ProductCardSkeleton key={i} />
        ))}
    </div>
);

// Table skeleton
export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
    <div className="animate-pulse">
        <div className="bg-gray-200 h-12 rounded mb-4"></div>
        {[...Array(rows)].map((_, i) => (
            <div key={i} className="flex space-x-4 mb-3">
                {[...Array(cols)].map((_, j) => (
                    <div
                        key={j}
                        className="bg-gray-200 h-8 rounded flex-1"
                    ></div>
                ))}
            </div>
        ))}
    </div>
);

// Text skeleton
export const TextSkeleton = ({ lines = 3 }) => (
    <div className="animate-pulse space-y-2">
        {[...Array(lines)].map((_, i) => (
            <div
                key={i}
                className={`bg-gray-200 h-4 rounded ${
                    i === lines - 1 ? "w-2/3" : "w-full"
                }`}
            ></div>
        ))}
    </div>
);

// Card skeleton
export const CardSkeleton = () => (
    <div className="animate-pulse bg-white rounded-lg shadow p-6">
        <div className="bg-gray-200 h-6 rounded mb-4"></div>
        <div className="space-y-2">
            <div className="bg-gray-200 h-4 rounded"></div>
            <div className="bg-gray-200 h-4 rounded w-2/3"></div>
            <div className="bg-gray-200 h-4 rounded w-1/2"></div>
        </div>
    </div>
);

export default {
    LoadingSpinner,
    PageLoading,
    SectionLoading,
    ButtonLoading,
    ProductCardSkeleton,
    ListSkeleton,
    TableSkeleton,
    TextSkeleton,
    CardSkeleton,
};
