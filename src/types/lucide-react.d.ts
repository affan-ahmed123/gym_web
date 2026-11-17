declare module "lucide-react" {
  import * as React from "react";
  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    strokeWidth?: number | string;
    absoluteStrokeWidth?: boolean;
    color?: string;
  }
  export type LucideIcon = React.ForwardRefExoticComponent<
    React.PropsWithoutRef<LucideProps> & React.RefAttributes<SVGSVGElement>
  >;

  export const Menu: LucideIcon;
  export const X: LucideIcon;
  export const Flame: LucideIcon;
  export const Dumbbell: LucideIcon;
  export const Activity: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const MapPin: LucideIcon;
  export const Zap: LucideIcon;
  export const Stethoscope: LucideIcon;
  export const Target: LucideIcon;
  export const Repeat: LucideIcon;
  export const Apple: LucideIcon;
  export const Smartphone: LucideIcon;
  export const Check: LucideIcon;
  export const GraduationCap: LucideIcon;
  export const Award: LucideIcon;
  export const HeartPulse: LucideIcon;
  export const Crosshair: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const Star: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const Phone: LucideIcon;
  export const Mail: LucideIcon;
  export const Instagram: LucideIcon;
  export const MessageCircle: LucideIcon;
  export const Lock: LucideIcon;
  export const Upload: LucideIcon;
  export const Trash2: LucideIcon;
  export const LogOut: LucideIcon;
  export const Database: LucideIcon;
  export const Camera: LucideIcon;
  export const MessageSquare: LucideIcon;
  export const CalendarCheck: LucideIcon;
  export const CloudLightning: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Sliders: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const Play: LucideIcon;
  export const Pause: LucideIcon;
  export const Volume2: LucideIcon;
  export const VolumeX: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Video: LucideIcon;
  export const Plus: LucideIcon;
  export const Minus: LucideIcon;
  export const Timer: LucideIcon;
  export const Package: LucideIcon;
  export const ShoppingBag: LucideIcon;
  export const Quote: LucideIcon;
  export const Bot: LucideIcon;
  export const BotMessageSquare: LucideIcon;
  export const Send: LucideIcon;
  export const User: LucideIcon;
  export const RefreshCw: LucideIcon;

  const icons: Record<string, LucideIcon>;
  export default icons;
}
