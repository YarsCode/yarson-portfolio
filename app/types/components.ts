import { NavigationLink } from './schemas';

export interface NavigationProps {
  links: NavigationLink[];
  className?: string;
  ariaLabel?: string;
}

export interface RootLayoutProps {
  children: React.ReactNode;
}

export type NavigationLinkHandler = (
  link: NavigationLink,
  event: React.MouseEvent<HTMLAnchorElement>
) => void;