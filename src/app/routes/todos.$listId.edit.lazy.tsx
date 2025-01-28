import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/todos/$listId/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/todos/$listId/edit"!</div>
}
