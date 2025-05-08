# Connecting Trilliant Digital Dashboard to n8n

This guide explains how to integrate your Trilliant Digital dashboard with n8n to automate your marketing tasks.

## What is n8n?

n8n is a workflow automation platform that allows you to connect apps and build automated workflows. It runs as a server and can be self-hosted or used in the cloud. With n8n, you can create workflows that take data from one service, process it, and send it to another service.

## Prerequisites

- An n8n instance running (either locally or hosted)
- Access to your Trilliant Digital dashboard
- Basic understanding of JavaScript and HTTP requests

## General Integration Steps

### 1. Setting Up n8n Webhooks

1. Log in to your n8n instance
2. Create a new workflow
3. Add a "Webhook" node as a trigger
4. Configure the webhook to receive POST requests
5. Save the workflow and activate the webhook
6. Copy the webhook URL provided by n8n

### 2. Configuring the Dashboard

The Trilliant Digital dashboard is designed to send data to n8n webhooks when users interact with agents. To connect an agent to n8n:

1. Open the `js/main.js` file in your code editor
2. Find the `sendMessage` function (around line 100)
3. Replace the simulated agent response code with an actual API call to your n8n webhook

## Specific Agent Integration Examples

### ICP Agent Integration

Here's how to modify the `sendMessage` function to send data from the ICP Agent to n8n:

```javascript
// Inside the sendMessage function
if (agentType === 'icp') {
    // Remove the simulated response
    const n8nWebhookUrl = 'https://your-n8n-instance.com/webhook/icp-agent';
    
    const requestData = {
        message: messageText,
        userInput: {
            websiteUrl: chatWindow.querySelector('.validate-url').value,
            timestamp: new Date().toISOString()
        }
    };
    
    // Show typing indicator
    // ...existing typing indicator code...
    
    // Send data to n8n
    fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        // Remove typing indicator
        chatContent.removeChild(typingIndicator);
        
        // Add agent response based on n8n data
        const agentMessage = document.createElement('div');
        agentMessage.className = 'agent-message';
        agentMessage.innerHTML = `
            <div class="agent-avatar">👥</div>
            <div class="message-content">${data.response || 'Analysis complete! Check your n8n workflow for results.'}</div>
        `;
        
        chatContent.appendChild(agentMessage);
        chatContent.scrollTop = chatContent.scrollHeight;
    })
    .catch(error => {
        console.error('Error connecting to n8n:', error);
        
        // Remove typing indicator
        chatContent.removeChild(typingIndicator);
        
        // Show error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'agent-message';
        errorMessage.innerHTML = `
            <div class="agent-avatar">👥</div>
            <div class="message-content">Sorry, I encountered an error connecting to the backend. Please try again later.</div>
        `;
        
        chatContent.appendChild(errorMessage);
        chatContent.scrollTop = chatContent.scrollHeight;
    });
}
```

### SEO Keyword Agent Integration

For the Keyword Agent, use this code:

```javascript
// Inside the sendMessage function
if (agentType === 'keyword') {
    const n8nWebhookUrl = 'https://your-n8n-instance.com/webhook/keyword-agent';
    
    // Collect form data
    const websiteName = chatWindow.querySelector('input[placeholder="Your website name"]').value;
    const websiteUrl = chatWindow.querySelector('input[placeholder="https://example.com"]').value;
    
    // Get all keyword tags
    const tagChips = chatWindow.querySelectorAll('.tag-chip');
    const keywords = Array.from(tagChips).map(chip => chip.querySelector('span').textContent);
    
    // Get selected niche
    const nicheSelect = chatWindow.querySelector('#keyword-niche-select');
    const selectedNiche = nicheSelect.options[nicheSelect.selectedIndex].value;
    
    const requestData = {
        message: messageText,
        userInput: {
            websiteName,
            websiteUrl,
            keywords,
            niche: selectedNiche,
            timestamp: new Date().toISOString()
        }
    };
    
    // Show typing indicator...
    
    // Send data to n8n
    fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        // Remove typing indicator
        chatContent.removeChild(typingIndicator);
        
        // Add agent response
        const agentMessage = document.createElement('div');
        agentMessage.className = 'agent-message';
        agentMessage.innerHTML = `
            <div class="agent-avatar">🔑</div>
            <div class="message-content">${data.response || 'Keyword analysis complete! I\'ve found some great keywords for your niche.'}</div>
        `;
        
        // If n8n returned keywords, display them
        if (data.keywords && data.keywords.length > 0) {
            const keywordList = document.createElement('div');
            keywordList.className = 'keyword-list';
            keywordList.innerHTML = `
                <h4>Recommended Keywords:</h4>
                <ul>
                    ${data.keywords.map(kw => `<li>${kw.term} (Score: ${kw.score})</li>`).join('')}
                </ul>
            `;
            
            agentMessage.querySelector('.message-content').appendChild(keywordList);
        }
        
        chatContent.appendChild(agentMessage);
        chatContent.scrollTop = chatContent.scrollHeight;
    })
    .catch(error => {
        // Error handling code...
    });
}
```

## Setting Up n8n Workflows

### ICP Agent Workflow in n8n

1. Start with a Webhook node as the trigger
2. Add an HTTP Request node to fetch data from the target website:
   - Method: GET
   - URL: Use the `userInput.websiteUrl` from the webhook data
   - Authentication: None (or configure as needed)
3. Add a Set node to extract and organize the data:
   - Extract domain information
   - Parse meta tags and description
   - Count occurrences of specific terms
4. Add a Function node to analyze the data:
   - Identify potential customer segments
   - Analyze content
   - Generate ICP recommendations
5. Add a Respond to Webhook node to send data back to the dashboard:
   - Set Content-Type to application/json
   - Return a JSON object with the analysis results

### Keyword Agent Workflow in n8n

1. Start with a Webhook node
2. Add an HTTP Request node to a keyword research API (like SEMrush, Ahrefs, etc.)
   - Configure API credentials
   - Use the website and niche from the webhook data
3. Add a Function node to process the keyword data:
   - Filter keywords by search volume and competition
   - Score and rank keywords
   - Group keywords by topic
4. Add a Respond to Webhook node to return the results:
   - Include the processed keyword list
   - Add recommendations based on the analysis

## Troubleshooting

### Common Issues

1. **Connection Errors**: Ensure your n8n instance is accessible from your dashboard's location.
2. **CORS Issues**: If hosting separately, configure CORS settings in n8n to allow requests from your dashboard's domain.
3. **Authentication**: For production use, consider adding authentication to your webhooks.

### Debugging Tips

1. Use console.log in the dashboard's JavaScript to track request/response data
2. Check the n8n execution logs for detailed information about workflow execution
3. Test your webhooks using tools like Postman before integrating with the dashboard

## Advanced Integration

For production use, consider these enhancements:

1. **Authentication**: Add API keys or JWT tokens to secure your webhooks
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **Error Handling**: Add comprehensive error handling and retry logic
4. **Caching**: Cache frequent requests to improve performance
5. **Webhook Management**: Create an admin interface to manage webhook URLs without code changes

## Resources

- [n8n Documentation](https://docs.n8n.io/)
- [Webhook Security Best Practices](https://webhooks.fyi/security/best-practices)
- [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) 