import { DirectiveBinding, ObjectDirective } from 'vue';

interface DragData {
  startX: number;
  startY: number;
  initialX: number;
  initialY: number;
}

export const draggable: ObjectDirective<HTMLElement> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<DragData>) {
    const dragData: DragData = {
      startX: 0,
      startY: 0,
      initialX: 0,
      initialY: 0
    };

    const handleMouseDown = (event: MouseEvent) => {
      event.preventDefault();
      dragData.startX = event.clientX;
      dragData.startY = event.clientY;
      dragData.initialX = el.offsetLeft;
      dragData.initialY = el.offsetTop;

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const dx = event.clientX - dragData.startX;
      const dy = event.clientY - dragData.startY;

      el.style.left = `${dragData.initialX + dx}px`;
      el.style.top = `${dragData.initialY + dy}px`;
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    el.addEventListener('mousedown', handleMouseDown);
  },
  // beforeUnmount(el: HTMLElement) {
  //   el.removeEventListener('mousedown', handleMouseDown);
  // }
};
