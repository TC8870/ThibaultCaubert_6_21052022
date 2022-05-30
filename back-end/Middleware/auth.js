const jwt = require('jsonwebtoken');

module.exports= (req,res,next)=> {
    try {
        const token = req.headers.authorization.split('')[1];
        const decodeToken = jwt.verify(token, 'RFMC56DD5DDZFFE96GF3GF14GZ3A68S31F8V9ZE1FE67FEG1V886NN57VD66CT44T');
        const userId = decodeToken.userId;
        req.auth = {userId : userId};
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable';
        }
        else {
            next();
        }
    }
    catch { error } {
        res.status(401).json({ error: error || '403: unauthorized request' })
    }
}