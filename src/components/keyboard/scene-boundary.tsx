"use client";

import { Component, type ReactNode } from "react";

/** Renders `fallback` instead of taking the page down when the 3D scene fails to load. */
export default class SceneBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
