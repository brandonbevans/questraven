import { ThreadMessageLike } from "@assistant-ui/react"
import { MyMessage } from "./type"

export const FREE_MESSAGE_LIMIT = 100

export const convertMessage = (message: MyMessage): ThreadMessageLike => {
    return {
        role: message.role,
        content: [{ type: "text", text: message.content }],
    }
}

export const mockMessages: MyMessage[] = [
    { role: "assistant", content: 'How can I help you?' },
    { role: "user", content: 'My name is Ahamd ' },
    { role: "assistant", content: 'Welcome Ahamd, how may I assist you? ' },
]
