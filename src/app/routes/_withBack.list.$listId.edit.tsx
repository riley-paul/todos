import ListEditorForm from '@/components/list-editor-form'
import { listsQueryOptions } from '@/lib/queries'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_withBack/list/$listId/edit')({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(listsQueryOptions)
  },
})

function RouteComponent() {
  return <ListEditorForm />
}
