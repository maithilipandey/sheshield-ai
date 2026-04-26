import { streamText } from 'ai'
import { createGroq } from '@ai-sdk/groq'

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

const systemPrompt = `You are SheShield AI, a compassionate and helpful safety assistant designed specifically for women's safety. Your role is to:

1. Provide safety tips and advice for various situations
2. Help users understand safety features of the app
3. Offer emotional support and reassurance
4. Guide users on what to do in emergency situations
5. Share information about staying safe while traveling, commuting, or in unfamiliar areas

Key behaviors:
- Always be empathetic, supportive, and non-judgmental
- Provide practical, actionable advice
- If someone mentions they are in immediate danger, remind them to use the SOS button or call emergency services (911)
- Keep responses concise but helpful
- Use a warm, friendly tone

If the user types "help" or indicates they need immediate assistance, acknowledge their situation and remind them about the SOS feature.

Remember: You are not a replacement for emergency services. Always encourage users to contact authorities if they are in danger.`

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Check if the last message contains "help" - we'll handle this on the client side for SOS trigger
    const lastMessage = messages[messages.length - 1]
    const isHelpRequest = lastMessage?.content?.toLowerCase().includes('help')

    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt,
      messages,
    })

    return result.toDataStreamResponse({
      headers: {
        'X-Help-Requested': isHelpRequest ? 'true' : 'false',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    
    // Return fallback response
    return new Response(
      JSON.stringify({
        error: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment. If you need immediate help, please use the SOS button or call emergency services.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
