import rateLimit from "express-rate-limit";

function keyGenerator(request: any, _response: any) {
    if (!request.ip) {
        console.error("Warning: request.ip is missing!");
        return request.socket.remoteAddress;
    }else {
        console.log(request.ip,request.socket.remoteAddress)
    }

    return request.ip.replace(/:\d+[^:]*$/, "");
}

export const defaultLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 300,
    message: "Too many request from this ip try again after 5 min",
    keyGenerator: keyGenerator, //generates a key used to identify the client for rate limiting. 
});


export const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 4, // Limit each IP to 4 create account requests per hour)
    message:
        "Too many accounts created from this IP, please try again after an hour",
        keyGenerator: keyGenerator,
});



export const forgetPasswordLimiter = rateLimit({
    windowMs: 2 * 60 * 60 * 1000,
    limit: 2,
    message: "Too many attemot from this IP, please try again after 2 hour",
    keyGenerator: keyGenerator,
});



export const ResetPasswordLimiter = rateLimit({
    windowMs: 2 * 60 * 60 * 1000,
    limit: 2,
    message:
        "Too many attemot from this IP to this request, please try again after 2 hour",
        keyGenerator: keyGenerator,
});
