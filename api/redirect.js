export default function handler(req, res) {
  const host = req.headers.host;
  
  // If not already at www.vizepedia.com, redirect with 301
  if (host !== 'www.vizepedia.com') {
    res.setHeader('Location', `https://www.vizepedia.com${req.url}`);
    res.statusCode = 301;
    res.end();
    return;
  }
  
  // If already at www.vizepedia.com, serve the content
  res.rewrite('/');
}