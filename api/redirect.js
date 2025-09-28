export default function handler(req, res) {
  const host = req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  
  // Redirect all non-www and HTTP requests to HTTPS www
  if (host === 'vizepedia.com' || protocol === 'http') {
    const destination = `https://www.vizepedia.com${req.url}`;
    res.writeHead(301, { Location: destination });
    res.end();
    return;
  }
  
  // If already at HTTPS www, continue to the actual page
  res.rewrite('/');
}