import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_withBack/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_withBack/settings"!</div>
}
