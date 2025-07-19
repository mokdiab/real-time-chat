/* eslint-disable */
import { UploadDropzone } from '@/lib/uploadthing'
import { toast } from 'sonner'
type Props = {
  onChange: (urls: string[]) => void
  type: 'image' | 'file'
}

function Uploader({ onChange, type }: Props) {
  return (
    <UploadDropzone
      endpoint={type}
      onClientUploadComplete={(res: any) => {
        console.log('Upload completed:', res)
        onChange(res.map((item: any) => item.url))
      }}
      onUploadError={(error: any) => {
        console.error('Upload error:', error)
        toast.error(error.message)
      }}
      onUploadBegin={(name) => {
        console.log('Upload beginning:', name)
      }}
    />
  )
}

export default Uploader
