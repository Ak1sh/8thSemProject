const express = require("express");
const cors = require("cors");
require('dotenv').config()


const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const consistentHashing = require("./server/middleware/consistent-hashing").consistentHashing
// app.use(consistentHashing.consistentHashing)

app.use((req, res, next) => {
    if (req.path === "/available-servers") {
        // If the request path is "/available-servers", skip applying the middleware
        next(); // Proceed to the next middleware or route handler
    } else {
        // For all other requests, apply the middleware
        consistentHashing(req, res, next);
    }
});

const availableServersRoutes = require("./server/routes/availableServersRoutes")
app.use("/available-servers", availableServersRoutes)

const rateLimiterRoutes = require("./server/routes/rateLimterRoutesSql")
app.use("/rate-limit", rateLimiterRoutes)


app.listen(PORT, () => {
    console.log(`listening on port number : ${PORT}`);
})

