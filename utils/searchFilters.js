class SearchFilters {
    constructor(modelFind, query) {
        this.modelFind = modelFind;
        this.query = query;
    }

    search() {
        const searchWord = this.query.search
            ? {
                  name: {
                      $regex: this.big.search,
                      $options: 'i',
                  },
              }
            : {};

        this.modelFind = this.modelFind.find({ ...searchWord });
        return this;
    }

    filter() {
        const copyQuery = { ...this.query };

        // removing fields for category
        const removeFields = ['search', 'page', 'limit'];
        removeFields.forEach((field) => delete copyQuery[field]);

        // filter for price and rating
        let stringOfcopyQuery = JSON.stringify(copyQuery);
        stringOfcopyQuery = stringOfcopyQuery.replace(/\b(gt|lt|gte|lte)\b/g, (key) => `$${key}`);
        const jsonOfcopyQuery = JSON.parse(stringOfcopyQuery);

        this.modelFind = this.modelFind.find(jsonOfcopyQuery);
        return this;
    }

    pagination(resultPerPage) {
        const currentPage = Number(this.query.page) || 1;

        const skip = resultPerPage * (currentPage - 1);

        this.modelFind = this.modelFind.limit(resultPerPage).skip(skip);
        return this;
    }
}

export default SearchFilters;
