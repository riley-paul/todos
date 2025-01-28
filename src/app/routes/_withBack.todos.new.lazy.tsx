import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_withBack/todos/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_withBack/todos/new"!</div>
}
