class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
        excludedFields.forEach(el => delete queryObj[el]);

        // 1b) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        this.query = this.query.find(JSON.parse(queryStr));
        //let query = Tour.find(JSON.parse(queryStr));
        return this;
    }
    search() {
        const keyword = this.queryString.keyword ? {
            name: {
                $regex: this.queryString.keyword,
                $options: '1'
            }
        } : {}

        this.query = this.query.find({ ...keyword });
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
            // sort('price ratingsAverage)
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate(resPerPage) {
        const currentPage = this.queryString.page * 1 || 1;
        //limit = this.queryString.limit * 1 || 100
        const skip = (currentPage - 1) * resPerPage;
        this.query = this.query.skip(skip).limit(resPerPage);
        

        // if (this.queryStr.page) {
        //     const numTours = await Tour.countDocuments();
        //     if (skip >= numTours) throw new Error('page does not exist')
        // }

        return this;

    }

}
module.exports = APIFeatures;