import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import Image from 'next/image'
type Props = {
  urls: string[]
}

const ImagePreview = ({ urls }: Props) => {
  const isVideoFile = (fileName: string) => {
    const videoFilePattern = /\.(mp4|webm|ogg|mov)$/i
    return videoFilePattern.test(fileName)
  }
  return (
    <div
      className={cn('grid gap-2 justify-items-start', {
        'grid-cols-1': urls.length === 1,
        'grid-cols-2': urls.length > 1,
      })}
    >
      {urls.map((url, index) => {
        const fileName = url.split('/').pop()!
        const isVideo = isVideoFile(fileName)
        return (
          <div
            key={index}
            className={cn('relative aspect-square', {
              'w-full': urls.length === 1,
              'w-1/2': urls.length > 1,
            })}
          >
            <Dialog key={index}>
              <div
                className={cn('relative cursor-pointer', {
                  'w-28 h-28 max-w-full': !isVideo,
                })}
              >
                <DialogTrigger asChild>
                  {isVideo ? (
                    <div className='aspect-w-16 aspect-h-9'>
                      <video
                        className='object-cover w-full h-full rounded-md'
                        poster={url}
                      >
                        <source src={`${url}#t=.01`} type='video/mp4' />
                      </video>
                    </div>
                  ) : (
                    <Image
                      src={url}
                      alt={fileName}
                      referrerPolicy='no-referrer'
                      className='rounded-md'
                      layout='fill'
                      objectFit='cover'
                    />
                  )}
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {isVideo ? 'Video Preview' : 'Image Preview'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className='w-full h-96 relative flex items-center justify-center'>
                    {isVideo ? (
                      <video className='w-full' poster={url} controls>
                        <source src={`${url}#t=.01`} type='video/mp4' />
                      </video>
                    ) : (
                      <Image
                        src={url}
                        alt={fileName}
                        referrerPolicy='no-referrer'
                        layout='fill'
                        objectFit='contain'
                      />
                    )}
                  </div>
                </DialogContent>
              </div>
            </Dialog>
          </div>
        )
      })}
    </div>
  )
}

export default ImagePreview
