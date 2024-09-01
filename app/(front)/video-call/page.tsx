import { Metadata } from 'next'
import VideoCall from './video-call'


export const metadata: Metadata = {
  title: 'Sign in',
}

export default async function Signin() {
  return <VideoCall />
}