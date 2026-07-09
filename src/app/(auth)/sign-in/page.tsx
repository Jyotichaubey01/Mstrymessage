'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useState } from "react"
import  { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/router"
const page = () => {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')

    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setSubmitting] =useState(false)

    const debouncedUsername = useDebounceValue(username, 300)
    const { toast } = useToast()
    const route = useRouter();
    
  return (
    <div>
      
    </div>
  )
}

export default page
