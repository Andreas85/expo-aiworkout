import React from 'react';

export default function KeyboardView(props: {
  children?: React.ReactNode;
  className?: string; // for web styling
}) {
  const { children } = props;
  return <>{children}</>;
}
