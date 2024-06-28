import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_app/about')({
  component: () => <div>Hello /_app/about!</div>
})