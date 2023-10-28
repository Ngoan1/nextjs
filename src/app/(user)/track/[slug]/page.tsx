'use client'
import WaveTrack from '@/components/track/wave.track'
import  Container from '@mui/material/Container'
import { useSearchParams } from 'next/navigation'


const TrackDetailPage=(props:any)=>{
  const {params}=props

  const searchParams = useSearchParams()
 
  const audio = searchParams.get('audio')

  return(
    <Container>
      <WaveTrack></WaveTrack>
    </Container>
  )
}
export default TrackDetailPage