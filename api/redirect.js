export default function handler(req, res) {
  const host = req.headers.host || '';
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const url = req.url;
  
  // Determine the correct destination
  let destinationHost = 'www.vizepedia.com';
  let destinationProtocol = 'https';
  
  // If the request is already for the correct host and protocol, serve the content
  if (host === destinationHost && protocol === destinationProtocol) {
    // Rewrite to the actual page
    return res.rewrite('/');
  }
  
  // Construct the destination URL
  const destination = `${destinationProtocol}://${destinationHost}${url}`;
  
  // Issue a single 301 redirect
  res.setHeader('Location', destination);
  res.statusCode = 301;
  res.end();
}