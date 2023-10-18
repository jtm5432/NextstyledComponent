var opensearch2 = require('@opensearch-project/opensearch');
import fs from 'fs';
const client =  new opensearch2.Client({
    node: 'https://127.0.0.1:9200' ,
    id: 'opensearch2',
    /*
    auth: {
      username: 'admin',
      password: 'admin'
    },
    */
    ssl: {
      ca: fs.readFileSync('/home/zeniuslog/opensearch/config/root-ca.pem'),
      key: fs.readFileSync('/home/zeniuslog/opensearch/config/kirk-key.pem'),
      cert: fs.readFileSync('/home/zeniuslog/opensearch/config/kirk.pem'),
      rejectUnauthorized: false
    },
  
    //log: logClass ;
    log: [
          {
              type: 'file',
              level: 'warning',
      //level: ['error','warning'],
              path: '/home/zeniuslog/logs/elasticsearch.log'
          },
          {
              type: 'file',
              level: 'error',
              path: '/home/zeniuslog/logs/opensearch2.log'
          }
      ]
    });

    export default async function handler(req, res) {
      const { index, body } = req.body;
    
      try {
        const result = await client.search({ index, body })
        console.log('result.body.aggregations.zhost_groups.buckets',body,result.body);
        return res.status(200).json(result.body.aggregations);
      } catch (error) {
        console.error("Error executing search:", error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }