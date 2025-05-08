# Trilliant Digital - Marketing Automation Dashboard

A futuristic, visually striking, and highly interactive frontend user interface for a digital marketing automation dashboard. This dashboard is designed to connect via webhooks to an n8n backend.

## Features

- Sleek, modern UI with glassmorphism, neon accents, and futuristic aesthetics
- Interactive components with animations and micro-interactions
- Responsive design that works across devices
- Built with vanilla HTML, CSS, and JavaScript (no frameworks)
- Designed for deployment on platforms like Vercel

## Sections

1. **SMM Agent (Social Media Marketing Agent)**
   - Competitor Agent Panel
   - Social Media Calendar Agent Panel

2. **SEO Agent**
   - ICP Agent
   - Keyword Agent
   - SEO Competitor Agent

3. **Ads Agent** (Coming Soon)

4. **Content Agent** (Coming Soon)

## Getting Started

1. Clone this repository
2. Open `index.html` in your browser or deploy to a web server
3. To connect to an n8n backend, configure the webhook URLs in the JavaScript code

## Directory Structure

- `index.html` - Main dashboard HTML
- `css/` - Stylesheet directory
  - `styles.css` - Main styles
  - `animations.css` - Animation and effect styles
- `js/` - JavaScript directory
  - `main.js` - Core functionality
  - `animations.js` - Advanced animations and transitions
  - `chart.min.js` - Simplified charting library

## Customization

- Color scheme can be modified in `css/styles.css` by changing CSS variables
- Add additional form fields by following the existing HTML structure
- Connect to n8n by modifying the form submission handlers in `js/main.js`

## n8n Integration

The dashboard is designed to work with n8n workflows via webhooks. When forms are submitted, they will send data to your configured n8n endpoints. To set up the integration:

1. Create your workflows in n8n
2. Configure webhook nodes in your workflows
3. Update the form submission URLs in the JavaScript code to point to your webhooks

## Browser Compatibility

Optimized for modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deploy on Vercel

The simplest way to deploy this dashboard is to use Vercel:

1. Push your code to a GitHub repository
2. Import your repository on Vercel
3. Deploy

## License

This project is open source and available for personal and commercial use.

## Credits

- Designed and developed for the Trilliant Digital marketing platform
- Custom icons and graphics included
- Inspired by modern dashboard UI trends 