"use client"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient"
import "./ChatPage.css"
import { Component } from 'react'

// ✅ ErrorBoundary component
class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{this.state.error.message}</p>
          <button onClick={() => window.location.reload()}>Refresh</button>
        </div>
      )
    }

    return this.props.children
  }
}

const ChatPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [book, setBook] = useState(null)
  const [seller, setSeller] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          navigate("/login")
          return
        }
        setUser(user)
      } catch (err) {
        console.error("Error getting user:", err)
        setError("Failed to authenticate. Please try again.")
        navigate("/login")
      }
    }
    checkUser()
  }, [navigate])

  useEffect(() => {
    if (!user || !id) return

    const fetchData = async () => {
      try {
        // 1. Fetch book info
        const { data: bookData, error: bookError } = await supabase
          .from("books")
          .select("*")
          .eq("id", id)
          .single()

        if (bookError) {
          console.error("Error fetching book:", bookError)
          setError("Book not found")
          return
        }

        setBook(bookData)

        // 2. Fetch all messages
        const { data: messagesData, error: msgError } = await supabase
          .from("messages")
          .select("*")
          .eq("book_id", id)
          .order("created_at", { ascending: true })

        if (msgError) {
          console.error("Error fetching messages:", msgError)
          setError("Failed to load messages")
          return
        }

        // 3. Fetch all involved users
        const userIds = Array.from(
          new Set(messagesData.flatMap(msg => [msg.sender_id, msg.receiver_id]))
        )

        const { data: profiles, error: userError } = await supabase
          .from("users") // from view public.users
          .select("id, username, avatar_url")
          .in("id", userIds)

        if (userError) {
          console.error("Error fetching user profiles:", userError)
          setError("Failed to fetch user info")
          return
        }

        const userMap = Object.fromEntries(profiles.map(p => [p.id, p]))

        const enrichedMessages = messagesData.map(msg => ({
          ...msg,
          sender: userMap[msg.sender_id],
          receiver: userMap[msg.receiver_id]
        }))

        setMessages(enrichedMessages)
        setSeller(userMap[bookData.user_id])
      } catch (err) {
        console.error("Unexpected error:", err)
        setError("Failed to load chat")
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // 4. Real-time subscription
    const channel = supabase
      .channel(`book:${id}:messages`)
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `book_id=eq.${id}`
        },
        async (payload) => {
          const msg = payload.new

          const { data: senderData } = await supabase
            .from("users")
            .select("id, username, avatar_url")
            .eq("id", msg.sender_id)
            .single()

          const { data: receiverData } = await supabase
            .from("users")
            .select("id, username, avatar_url")
            .eq("id", msg.receiver_id)
            .single()

          const enrichedMsg = {
            ...msg,
            sender: senderData,
            receiver: receiverData
          }

          setMessages(prev => [...prev, enrichedMsg])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }

  }, [id, user, navigate])

  const sendMessage = async () => {
    if (!newMessage.trim()) return
  
    let receiverId
  
    // Determine the other person in the conversation
    if (user.id === book.user_id) {
      // Current user is the seller → receiver is the buyer (from existing messages)
      const lastMsg = messages.find(msg => msg.sender_id !== user.id)
      receiverId = lastMsg?.sender_id || null
    } else {
      // Current user is the buyer → receiver is the seller
      receiverId = book?.user_id
    }
  
    if (!receiverId) {
      alert("Unable to find recipient.")
      return
    }
  
    try {
      const { error } = await supabase.from("messages").insert({
        book_id: id,
        sender_id: user.id,
        receiver_id: receiverId,
        content: newMessage
      })
  
      if (error) {
        console.error("Error sending message:", error)
        alert("Failed to send message")
      } else {
        setNewMessage("")
      }
    } catch (err) {
      console.error("Error sending message:", err)
      alert("Failed to send message")
    }
  }
  
  if (error) {
    return (
      <div className="chat-container">
        <div className="error-container">
          <div className="error-message">{error}</div>
          <button className="back-btn" onClick={() => navigate(`/book/${id}`)}>Back to Book</button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="chat-container">
        <div className="loading">Loading chat...</div>
      </div>
    )
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button className="back-btn" onClick={() => navigate(`/book/${id}`)}>
          ← Back to Book
        </button>
        <h2>Chat with {seller?.username || "Seller"}</h2>
        <div className="seller-info">
          <img
            src={seller?.avatar_url || "/placeholder.svg"}
            alt={seller?.username}
            className="avatar"
          />
          <div>
            <div className="username">{seller?.username}</div>
            <div className="book-title">About: {book?.title}</div>
          </div>
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">Start the conversation about this book</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.sender_id === user.id ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                <div className="message-text">{msg.content}</div>
                <div className="message-time">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="message-input-container">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          rows="3"
        />
        <button
          className="send-btn"
          onClick={sendMessage}
          disabled={!newMessage.trim()}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export { ErrorBoundary }
export default ChatPage
