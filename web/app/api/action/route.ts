import {
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
} from '@solana/actions';
import { clusterApiUrl, Connection, PublicKey, Transaction } from '@solana/web3.js';

export async function GET(request: Request) {
  const responseBody: ActionGetResponse = {
    icon: 'https://seeklogo.com/images/S/solana-sol-logo-12828AD23D-seeklogo.com.png',
    description: 'This is Solana demo blink.',
    title: 'Do Blink!',
    label: 'Click me!',
    error: {
      message: 'This blink is not implemented yet!',
    },
  };

  const response = Response.json(responseBody, {
    headers: ACTIONS_CORS_HEADERS,
  });

  return response;
}

export async function POST(request: Request) {
  const requestBody: ActionPostRequest = await request.json();
  const userPubkey = requestBody.account;
  console.log(userPubkey);

  const connection = new Connection(clusterApiUrl("mainnet-beta"))

  const tx = new Transaction();

  tx.feePayer = new PublicKey(userPubkey);
  const bh = (await connection.getLatestBlockhash({commitment: "finalized"})).blockhash

  console.log("using blockhash" + bh);
  

  tx.recentBlockhash = bh
  const serialTX = tx.serialize({requireAllSignatures: false, verifySignatures: false}).toString('base64');

  const response: ActionPostResponse = {
    transaction: serialTX,
    message: 'hello ' + userPubkey,
  };



  return Response.json(response, {
    headers: ACTIONS_CORS_HEADERS,
  });
}

export async function OPTIONS(request: Request) {
  return new Response(null, { headers: ACTIONS_CORS_HEADERS });
}
