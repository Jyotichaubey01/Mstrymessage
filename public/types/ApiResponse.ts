import { Message } from "@/model/User";
import { success } from "zod"

export default ApiResponse{
    success: boolean;
    message: string;
    isAccesptingMessages?: boolean
    messages?: Array<Message>
}