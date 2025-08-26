export {}

declare global {
  interface HTMLElement {
    _vDraggableCollisionDestroy?: () => void
  }
}
