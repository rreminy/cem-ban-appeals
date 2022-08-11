import { sign, verify } from "jsonwebtoken";

function createJwt(data, duration) {
    const options = {
        issuer: 'ban-appeals-backend'
    };

    if (duration) {
        options.expiresIn = duration;
    }

    return sign(data, process.env.JWT_SECRET, options);
}

function decodeJwt(token) {
    return verify(token, process.env.JWT_SECRET);
}

export default { createJwt, decodeJwt };