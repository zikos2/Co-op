"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const buildSearchQuery = (productQB, filters) => {
    console.log("2 called");
    console.log(filters);
    if (filters.title) {
        console.log("title called");
        productQB = productQB.andWhere("product.title like :title", {
            title: `%${filters.title}%`,
        });
    }
    if (filters.minPrice) {
        productQB = productQB.andWhere("product.minPrice > (:...minPrice)", {
            minPrice: filters.minPrice,
        });
        console.log("minCalled");
    }
    if (filters.maxPrice) {
        productQB = productQB.andWhere("product.maxPrice < (:...maxPrice)", {
            maxPrice: filters.maxPrice,
        });
        console.log("maxCalled");
    }
    console.log("done");
};
exports.default = buildSearchQuery;
//# sourceMappingURL=buildSearchQuery.js.map