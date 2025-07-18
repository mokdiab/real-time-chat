import SidebarWrapper from '@/components/shared/sidebar/SidebarWrapper'
type Props = React.PropsWithChildren<{ children: React.ReactNode }>

export default function Layout({ children }: Props) {
  return <SidebarWrapper>{children}</SidebarWrapper>
}
