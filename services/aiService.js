// AI Service for generating responses
// This is a mock implementation - replace with actual AI service integration

const generateAIResponse = async (messages) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  const lastMessage = messages[messages.length - 1];
  
  // Mock responses based on content
  let response = '';
  
  if (lastMessage.content.toLowerCase().includes('hello') || 
      lastMessage.content.toLowerCase().includes('hi')) {
    response = "Hello! I'm your Trilliant Digital AI assistant. How can I help you today?";
  } else if (lastMessage.content.toLowerCase().includes('code')) {
    response = `Here's a code example for you:

\`\`\`javascript
function greetUser(name) {
  return \`Hello, \${name}! Welcome to Trilliant Digital.\`;
}

console.log(greetUser('User'));
\`\`\`

This function creates a personalized greeting. Would you like me to explain how it works or help you with something else?`;
  } else if (lastMessage.content.toLowerCase().includes('data') || 
             lastMessage.content.toLowerCase().includes('analysis')) {
    response = `I can help you with data analysis! Here's what I can do:

| Service | Description | Availability |
|---------|-------------|--------------|
| Data Visualization | Create charts and graphs | ✅ Available |
| Statistical Analysis | Perform statistical calculations | ✅ Available |
| Predictive Modeling | Build predictive models | ✅ Available |
| Report Generation | Generate comprehensive reports | ✅ Available |

What specific data analysis task would you like help with?`;
  } else if (lastMessage.content.toLowerCase().includes('marketing')) {
    response = `As a Trilliant Digital AI, I can assist with various marketing tasks:

**Digital Marketing Services:**
- SEO optimization strategies
- Social media campaign planning
- Content creation and optimization
- Email marketing automation
- PPC campaign management
- Analytics and performance tracking

**Current Focus Areas:**
1. **Content Strategy** - Developing engaging content that converts
2. **Audience Targeting** - Identifying and reaching your ideal customers
3. **Performance Analytics** - Measuring and optimizing campaign effectiveness

What marketing challenge can I help you solve today?`;
  } else {
    response = `I understand you're asking about: "${lastMessage.content}"

As your Trilliant Digital AI assistant, I'm here to help with a wide range of tasks including:

• **Business Analysis** - Market research, competitor analysis, business strategy
• **Technical Support** - Code review, system architecture, troubleshooting
• **Creative Projects** - Content creation, design concepts, brainstorming
• **Data & Analytics** - Data visualization, statistical analysis, reporting
• **Marketing & Sales** - Campaign planning, lead generation, customer insights

Could you provide more specific details about what you'd like assistance with? I'm designed to give you comprehensive, actionable insights tailored to Trilliant Digital's standards.`;
  }

  return {
    content: response,
    model: 'trilliant-ai-v1',
    tokens: Math.floor(response.length / 4) // Rough token estimate
  };
};

module.exports = {
  generateAIResponse
};