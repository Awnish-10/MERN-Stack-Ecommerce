class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }
    search() {
        const keyword = this.queryStr.keyword
            ? {
                  name: {
                      $regex: this.queryStr.keyword,
                      $options: "i", //case insensitive
                  },
              }
            : {};
        this.query = this.query.find({ ...keyword });
        return this;
    }
    filter() {
        //filter for price category
        const queryCopy = { ...this.queryStr };
        const removeFilter = ["keyword", "page", "limit"];
        removeFilter.forEach((element) => {
            delete queryCopy[element];
        });
        let queryStr = JSON.stringify(queryCopy);

        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
    pagination(countPerPage) {
        const currPage = Number(this.queryStr.page) || 1;
        const skip = countPerPage * (currPage - 1);
        this.query = this.query.limit(countPerPage).skip(skip);
        return this;
    }
}
//in js all objects are passed through reference
module.exports = ApiFeatures;
