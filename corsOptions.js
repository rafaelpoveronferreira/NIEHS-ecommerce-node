// lista de ips abaixo é de endereços da Stripe responsáveis por webhooks
const WHITELIST = [
    '3.18.12.63',
    '3.130.192.231',
    '13.235.14.237',
    '13.235.122.149',
    '18.211.135.69',
    '35.154.171.200',
    '52.15.183.38',
    '54.88.130.119',
    '54.88.130.237',
    '54.187.174.169',
    '54.187.205.235',
    '54.187.216.72',
    'https://rafaelpoveronferreira.github.io/NIEHS-ecommerce-react',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:4173',
    'http://localhost:4174']

// CORS dinâmico
const corsOptions = {origin: WHITELIST, credentials: true}

/*
const corsOptions = {
  origin: (origin, callback) => {
  if (WHITELIST.some(e=> e==origin) || !origin) {
    console.log(origin+' is allowed')
      callback(null, true)
    } else {
      callback(new Error(origin+' not allowed!'))
    }
  },
  credentials: true}
*/

module.exports = corsOptions