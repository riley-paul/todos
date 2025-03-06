import { createFileRoute } from '@tanstack/react-router'
import ListAdderForm from '@/components/list-adder-form'

export const Route = createFileRoute('/_withBack/todos/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ListAdderForm />
}
