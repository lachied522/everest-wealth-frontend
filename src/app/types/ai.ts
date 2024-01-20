

export interface Message {
    content: string
    role: 'custom' | 'system' | 'user' | 'assistant'
}