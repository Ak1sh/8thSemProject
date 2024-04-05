const axios = require('axios');
const plotly = require('plotly')('akashv', 'MemyZs7D07Kgu7O6n1G2');

const endpoint = 'http://localhost:4000/rate-limit/lightEndPoint';
const requestsCount = 200;
const requestIntervals = 100; // Interval between each request in milliseconds

async function makeRequest(requestNumber) {
    try {
        const startTime = Date.now();
        await axios.get(endpoint);
        const endTime = Date.now();
        return { requestNumber, timeTaken: endTime - startTime };
    } catch (error) {
        console.error('Error making request:', error);
        return { requestNumber, timeTaken: -1 };
    }
}

// Function to make multiple requests and collect time taken
async function makeMultipleRequests() {
    const requestTimes = [];
    for (let i = 0; i < requestsCount; i++) {
        const result = await makeRequest(i + 1);
        requestTimes.push(result.timeTaken);
        await new Promise(resolve => setTimeout(resolve, requestIntervals)); // Wait before making the next request
    }
    return requestTimes;
}

// Function to plot the graph
const plotGraph = (responseTimes) => {
    const data = [{
        x: Array.from({ length: responseTimes.length }, (_, i) => i + 1),
        y: responseTimes,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Response Time',
    }];

    const layout = {
        title: 'Response Time Plot',
        xaxis: { title: 'Request Number' },
        yaxis: { title: 'Response Time (ms)' },
    };

    const graphOptions = { filename: 'response-time-plot', fileopt: 'overwrite' };

    plotly.plot(data, graphOptions, (err, msg) => {
        if (err) {
            console.error(err);
        } else {
            console.log(`Graph URL: ${msg.url}`);
        }
    });
};

// Main function
async function main() {
    console.log('Sending requests...');
    const responseTimes = await makeMultipleRequests();
    console.log('Requests completed.');

    // Plot the graph
    plotGraph(responseTimes);
}

main().catch(err => console.error('Error:', err));