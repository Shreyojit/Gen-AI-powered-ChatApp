
import { Metadata } from 'next'
import Chat from './Chat'

export const metadata: Metadata = {
  title: 'Register',
}

export default async function Register() {
  return <Chat />
}