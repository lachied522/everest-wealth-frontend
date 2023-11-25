import { createClient, SchemaFieldTypes } from 'redis';
import { Schema, Repository } from 'redis-om';

const client = createClient({
    password: 'Lachie2001#',
    username: 'lachie',
    socket: {
        host: 'redis-18851.c296.ap-southeast-2-1.ec2.cloud.redislabs.com',
        port: 18851
    }
});

await client.connect();

const universeSchema = new Schema('symbol', {
    symbol: { type: 'text' },
    name: { type: 'text' },
  }, {
    dataStructure: 'HASH'
});

// create repository and index for text search
const universeRepository = new Repository(universeSchema, client);
await universeRepository.createIndex();

export const searchUniverse = async (q) => {
    try {
        const results = await universeRepository.search()
            .where('symbol').match(q, { fuzzyMatching: true } )
            .or('name').match(q, { fuzzyMatching: true })
            .return.all()
        return results;
      } catch (error) {
        console.error('Error searching records:', error);
        throw error;
      }
}
