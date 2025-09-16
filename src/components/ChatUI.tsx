export default function ChatUI() {
  return (
    <div className="flex flex-col h-96 border rounded-lg">
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {/* Chat messages will go here */}
        <p className="text-gray-500">Start a conversation with your AI tutor...</p>
      </div>
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Ask a question..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Send
          </button>
        </div>
      </div>
    </div>
  )
}