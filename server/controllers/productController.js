exports.checkId = (req, res, next, val) => {
    next();
}

exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing <Name> or <Price>'
        });
    }
    next();
}

exports.getAllProducts = (req, res) => {
    res.status(200).json(
        {
            status: 'success',
            results: '',
            data: {
                products: '<All product here...>'
            }
        }
    );
}

exports.getProduct = (req, res) => {
    res.status(200).json(
        {
            status: 'success',
            results: '',
            data: {
                product: '<Product here...>'
            }
        }
    );
}

exports.createProduct = (req, res) => {
    res.status(201).json(
        {
            status: 'success',
            data: {
                product: '<Product here...>'
            }
        }
    );
}

exports.updateProduct = (req, res) => {
    res.status(201).json(
        {
            status: 'success',
            data: {
                product: '<Product here...>'
            }
        }
    );
}

exports.deleteProduct = (req, res) => {
    res.status(201).json(
        {
            status: 'success',
            data: {
                product: '<Product here...>'
            }
        }
    );
}