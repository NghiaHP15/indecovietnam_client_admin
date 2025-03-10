import { ReactNode } from 'react';
import { CSSProperties } from 'styled-components';

export default function Region({className, style, children }: { className?: string, style?: CSSProperties, children?: ReactNode }) {
  return (
    <div className={`q-region ${className ?? ""}`} style={style}>
      {children ? children : null}
    </div>
  );
}

export function RegionCenter({className, children }: { className?: string, children?: ReactNode }) {
  return (
    <div className={`q-region-center ${className ?? ""}`}>
      {children ? children : null}
    </div>
  );
}

export function RegionTop({className, children }: { className?: string, children?: ReactNode }) {
  return (
    <div className={`q-region-top ${className ?? ""}`}>
      {children ? children : null}
    </div>
  );
}
export function RegionBottom({className, children }: { className?: string, children?: ReactNode }) {
  return (
    <div className={`q-region-bottom ${className ?? ""}`}>
      {children ? children : null}
    </div>
  );
}