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
        console.log('response.data==================================================', response.data)
        res.status(200).json(response.data);
    } catch (error) {
        console.error("E-----------------------------rror in /api/axios:---------------------------------", error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}