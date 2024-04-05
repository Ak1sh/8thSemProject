const connection = require('../middleware/sqlConnection')

const setUserSQl = (data) => {
    const ip = data.ip;
    const time = data.time;
    const tokenSize = data.tokenSize;

    const key = `user:${ip}`;
    return new Promise(async (resolve, reject) => {
        try {
            // Retrieve last access time and current token size from MySQL
            const [rows] = await connection.execute('SELECT user_ip, token_size FROM user_tokens');
            const lastAccessTime = rows.length > 0 ? rows[0].user_ip : null;
            const currTokenSize = rows.length > 0 ? rows[0].token_size : null;
            console.log(lastAccessTime)
            console.log("executing");
            const timeGap = time - lastAccessTime;

            if (lastAccessTime === null || currTokenSize === null) {
                // If user data doesn't exist, insert new data
                await connection.execute('INSERT INTO user_tokens (user_ip, datetime, token_size) VALUES (?, ?, ?)', [ip, time, tokenSize]);
                console.log("Data inserted for new user");
            } else if (timeGap > 60) {
                // If time gap is more than 60 seconds, update token size and last access time
                await connection.execute('UPDATE user_tokens SET datetime = ?, token_size = ? WHERE user_ip = ?', [time, tokenSize, ip]);
                console.log("Token size reset for user");
            } else if (currTokenSize === 0) {
                // If current token size is 0, reject the request
                console.log("Rate Limit Exceeded !!");
                reject("Rate Limit Exceeded !!");
                return;
            } else {
                // Otherwise, decrement token size and update last access time
                await connection.execute('UPDATE user_tokens SET datetime = ?, token_size = ? WHERE user_ip = ?', [time, currTokenSize - 1, ip]);
                console.log("Token size decremented for user");
            }
            resolve("success man");
        } catch (err) {
            console.error("Error setting user data: ", err);
            reject(err);
        }
    });
};

class UserSQl {
    constructor(ip, time, tokenSize) {
        this.ip = ip
        // this.name = name
        this.time = time
        this.tokenSize = tokenSize
    }
}


module.exports = {
    UserSQl,
    setUserSQl
}