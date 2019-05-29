function trainTestSplit(dataset_X, dataset_y, trainPercentage) {

    let result = {
        train_X: [],
        train_y: [],
        test_X: [],
        test_y: []
    }

    while (dataset_X.length) {
        if (Math.random() * 100 <= trainPercentage) {
            result.train_X.push(dataset_X.pop());
            result.train_y.push(dataset_y.pop());
        } else {
            result.test_X.push(dataset_X.pop());
            result.test_y.push(dataset_y.pop());
        }
    }
    return result;
}

module.exports = {
    trainTestSplit: trainTestSplit
}