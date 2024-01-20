import axios from 'axios';
import https from 'https';

const agent = new https.Agent({
    rejectUnauthorized: false
});

export default async function handler(req, res) {
    try {
        const { endpoint, params } = req.body;
        const response = await axios.get(endpoint, { 
            params,
            httpsAgent: agent 
        });
        console.log('response.data==================================================',endpoint, response.headers)
        res.status(200).json(response.data);
    } catch (error) {
       // console.error("-----------------------------Error in /api/axios:---------------------------------", endpoint);
        res.status(500).json({ error: 'Internal server error' });
    }
}