export default function handler(req, res) {
  const host = req.headers.host || '';
  const url = req.url;
  
  // Normalize host by removing port if present
  const normalizedHost = host.split(':')[0];
  
  // If the request is for the non-www domain, redirect to www
  if (normalizedHost === 'vizepedia.com') {
    res.setHeader('Location', `https://www.vizepedia.com${url}`);
    res.statusCode = 301;
    res.end();
    return;
  }
  
  // If the request is already for www.vizepedia.com, serve the content
  res.rewrite('/');
}