self.addEventListener('message', function(e) {

    e.data.trainObs = [];
    e.data.testObs = [];

    for (obs of e.data.obs.data) {
        let train = [];
        let test = [];

        for (key of e.data.predictiveVariables) {
            train.push(obs[key])
        }

        for (key of e.data.targetVariables) {
            test.push(obs[key])
        }

        e.data.trainObs.push(train)
        e.data.testObs.push(test)
    }
    delete e.data.obs
    self.postMessage(e.data);
}, false);