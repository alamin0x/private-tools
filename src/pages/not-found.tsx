import { Link } from "react-router"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
      <p className="text-muted-foreground mb-4">Tool not found</p>
      <Link
        to="/"
        className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  )
}
