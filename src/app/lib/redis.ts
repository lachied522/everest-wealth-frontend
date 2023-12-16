// https://dev.to/rainforss/using-redis-cloud-in-your-nextjs-application-39f2
import { createClient, SchemaFieldTypes } from 'redis';
import { Schema, Repository, Entity } from 'redis-om';

import { StockInfo } from '@/types/types';

let GlobalWithClient = global as typeof globalThis & {
  client: ReturnType<typeof createClient>
};

let idleTimer: ReturnType<typeof setTimeout>;
let client = GlobalWithClient.client;

if (!client) {
  client = createClient({
      password: 'Lachie2001#',
      username: 'lachie',
      socket: {
          host: 'redis-18851.c296.ap-southeast-2-1.ec2.cloud.redislabs.com',
          port: 18851
      }
  });
}

const universeSchema = new Schema('symbol', {
    symbol: { type: 'text' },
    name: { type: 'text' },
  }, {
    dataStructure: 'HASH'
});

// create repository and index for text search
const universeRepository = new Repository(universeSchema, client);

// Helper function to set the idle timer
function setIdleTimer() {
  idleTimer = setTimeout(async () => {
    await disconnect();
  }, 5000); // 5 seconds idle time
}

// Helper function to reset the idle timer
function resetIdleTimer() {
  clearTimeout(idleTimer);
  setIdleTimer();
}

export async function connect() {
  if (client.isOpen) {
    resetIdleTimer(); // Reset the idle timer on every connection
    return;
  }

  await client.connect();
  if (process.env.NODE_ENV==="development") console.log("Redis Client Connected");

  // Set the idle timer when the client is connected
  setIdleTimer();
}

export async function disconnect() {
  if (!client.isOpen) return;

  await client.quit();
  if (process.env.NODE_ENV==="development") console.log("Redis Client Disconnected");
}

export const searchUniverse = async (q: string) => {
  await connect();

  try {
      const results = await universeRepository.search()
          .where('symbol').match(q, { fuzzyMatching: true } )
          .or('name').match(q, { fuzzyMatching: true })
          .return.all();
      
      return results as StockInfo[];
  } catch (e) {
    console.error('Error searching records:', e);
  }
}

type Data = {
  symbol: string
  name: string | null
  description: string | null
  sector: string | null
  div: string | null
  div_yield: string | null
  beta: string | null
  market_cap: string | null
  PE: string | null
  last_price: string
  change: string
  domestic: string
  active: string
}


function parseData(data: Data) {
  const parsedData: { [key: string]: any } = new Object();

  // convert to boolean
  parsedData['domestic'] = data.domestic==="True";
  parsedData['active'] = data.active==="True";
  // convert any numbers to Number type
  for (const key in data) {
    const value = data[key as keyof Data];
    if (value) {
      parsedData[key] = !isNaN(Number(value))? Number(value): value
    }
  }

  return parsedData as StockInfo
}

export const fetchSymbol = async (symbol: string) => {
  await connect();

  try {
    const data = await universeRepository.fetch(symbol) as Data;

    if (data) return parseData(data) as StockInfo;
    
  } catch (e) {
    console.log(e);
  }
}