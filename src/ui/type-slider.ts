import { reduced } from "../motion";

export const TYPE_VIEWS = ["typical", "stress", "loop"] as const;
export type TypeView = (typeof TYPE_VIEWS)[number];

/** Native horizontal paging inside the card's single vertical scroll surface. */
export function setupTypeSlider(
  root: HTMLElement,
  initial: TypeView,
  onChange: (view: TypeView) => void,
) {
  const viewport = root.querySelector<HTMLElement>(".type-slider")!;
  const slides = [...viewport.querySelectorAll<HTMLElement>(".type-slide")];
  const contents = slides.map((slide) => slide.querySelector<HTMLElement>(".type-slide-content")!);
  const mobile = matchMedia("(max-width: 859px)");
  let selected = TYPE_VIEWS.indexOf(initial);
  let frame = 0;
  let settleTimer = 0;
  let lastWidth = 0;
  let disposed = false;
  // Swipe may start anywhere on the card; only the slider region itself keeps
  // native scroll-snap panning (better momentum), so drags start around it.
  const surface = root.closest<HTMLElement>(".info-card") ?? root;
  let drag: { pointer: number; x: number; y: number; left: number; horizontal: boolean } | null =
    null;

  const height = (index: number) => contents[index].offsetHeight;
  const setHeight = (value: number) => {
    viewport.style.height = `${value}px`;
  };

  function commit(index: number) {
    const view = TYPE_VIEWS[index];
    const oldFocus = document.activeElement;
    if (slides.some((slide, i) => i !== index && slide.contains(oldFocus))) {
      root
        .querySelector<HTMLButtonElement>(`[data-type-view="${view}"]`)
        ?.focus({ preventScroll: true });
    }
    selected = index;
    slides.forEach((slide, i) => {
      slide.inert = i !== index;
      slide.setAttribute("aria-hidden", String(i !== index));
    });
    onChange(view);
  }

  function trackHeight() {
    frame = 0;
    const width = viewport.clientWidth;
    // While a drag is held, keep the height of the committed page so the stack
    // panel below doesn't wobble under the finger; it resettles on release.
    if (!width || drag || !mobile.matches) return;
    const position = Math.max(0, Math.min(slides.length - 1, viewport.scrollLeft / width));
    const left = Math.floor(position);
    const right = Math.min(left + 1, slides.length - 1);
    setHeight(height(left) + (height(right) - height(left)) * (position - left));
  }

  function settle() {
    clearTimeout(settleTimer);
    if (disposed || drag || !mobile.matches || !viewport.clientWidth) return;
    const index = Math.max(
      0,
      Math.min(slides.length - 1, Math.round(viewport.scrollLeft / viewport.clientWidth)),
    );
    // Only commit a snapped page, never an intermediate point during a held drag.
    if (Math.abs(viewport.scrollLeft - index * viewport.clientWidth) > 1) return;
    commit(index);
    viewport.classList.remove("is-sliding");
    setHeight(height(index));
  }

  function onScroll() {
    if (!mobile.matches) return;
    viewport.classList.add("is-sliding");
    if (!frame) frame = requestAnimationFrame(trackHeight);
    clearTimeout(settleTimer);
    settleTimer = window.setTimeout(settle, 140);
  }

  function align() {
    if (disposed) return;
    const width = viewport.clientWidth;
    if (!width) return;
    const changedWidth = width !== lastWidth;
    lastWidth = width;
    if (changedWidth) {
      clearTimeout(settleTimer);
      viewport.classList.remove("is-sliding");
      viewport.scrollTo({ left: mobile.matches ? selected * width : 0, behavior: "instant" });
    }
    if (!viewport.classList.contains("is-sliding")) setHeight(height(selected));
  }

  function onBreakpoint() {
    lastWidth = 0;
    commit(selected);
    align();
  }

  function select(view: TypeView) {
    const index = TYPE_VIEWS.indexOf(view);
    if (!mobile.matches || !viewport.clientWidth) {
      commit(index);
      setHeight(height(index));
      return;
    }
    viewport.classList.add("is-sliding");
    viewport.scrollTo({
      left: index * viewport.clientWidth,
      behavior: reduced() ? "instant" : "smooth",
    });
    if (Math.abs(viewport.scrollLeft - index * viewport.clientWidth) < 1) {
      commit(index);
      setHeight(height(index));
      viewport.classList.remove("is-sliding");
    }
  }

  function onPointerDown(event: PointerEvent) {
    if (!mobile.matches || !event.isPrimary || event.button !== 0) return;
    if ((event.target as Element).closest(".type-slider")) return;
    drag = {
      pointer: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      left: viewport.scrollLeft,
      horizontal: false,
    };
  }

  function onPointerMove(event: PointerEvent) {
    if (!drag || event.pointerId !== drag.pointer) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.horizontal) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
      if (Math.abs(dy) >= Math.abs(dx)) {
        drag = null;
        return;
      }
      drag.horizontal = true;
      try {
        surface.setPointerCapture(event.pointerId);
      } catch {
        /* pointer already gone; keep dragging uncaptured */
      }
      viewport.classList.add("is-dragging", "is-sliding");
    }
    viewport.scrollLeft = drag.left - dx;
  }

  function onPointerEnd(event: PointerEvent) {
    if (!drag || event.pointerId !== drag.pointer) return;
    const ended = drag;
    drag = null;
    if (surface.hasPointerCapture(event.pointerId)) surface.releasePointerCapture(event.pointerId);
    if (!ended.horizontal) return;
    const dx = event.clientX - ended.x;
    const start = Math.round(ended.left / viewport.clientWidth);
    const step = event.type !== "pointercancel" && Math.abs(dx) >= 40 ? (dx < 0 ? 1 : -1) : 0;
    viewport.classList.remove("is-dragging");
    select(TYPE_VIEWS[Math.max(0, Math.min(TYPE_VIEWS.length - 1, start + step))]);
  }

  surface.addEventListener("pointerdown", onPointerDown);
  surface.addEventListener("pointermove", onPointerMove);
  surface.addEventListener("pointerup", onPointerEnd);
  surface.addEventListener("pointercancel", onPointerEnd);
  const observer = new ResizeObserver(align);
  contents.forEach((content) => observer.observe(content));
  observer.observe(viewport, { box: "border-box" });
  viewport.addEventListener("scroll", onScroll, { passive: true });
  viewport.addEventListener("scrollend", settle);
  mobile.addEventListener("change", onBreakpoint);
  commit(selected);
  align();

  return {
    select,
    dispose() {
      disposed = true;
      drag = null;
      surface.removeEventListener("pointerdown", onPointerDown);
      surface.removeEventListener("pointermove", onPointerMove);
      surface.removeEventListener("pointerup", onPointerEnd);
      surface.removeEventListener("pointercancel", onPointerEnd);
      observer.disconnect();
      cancelAnimationFrame(frame);
      clearTimeout(settleTimer);
      viewport.removeEventListener("scroll", onScroll);
      viewport.removeEventListener("scrollend", settle);
      mobile.removeEventListener("change", onBreakpoint);
    },
  };
}
